import { RateLimiterRedis } from "rate-limiter-flexible";
import redisClient from "../config/redis.js";

const getClientIp = (req) => {
  // If you're behind a proxy (nginx, load balancer), the real client IP is usually in x-forwarded-for.
  // Express's `req.ip` depends on `app.set('trust proxy', ...)`.
  const xForwardedFor = req.headers?.["x-forwarded-for"];
  if (typeof xForwardedFor === "string" && xForwardedFor.length > 0) {
    return xForwardedFor.split(",")[0].trim() || req.ip;
  }
  return req.ip;
};

/**
 * Factory function to create a rate limiter middleware
 * @param {number} points - Number of requests allowed
 * @param {number} duration - Duration in seconds
 * @param {string} keyPrefix - Unique prefix for Redis keys
 */
export const createRateLimitMiddleware = (points, duration, keyPrefix = "rl") => {
  const rateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    // `config/redis.js` uses the `redis` (node-redis) package, so we must enable this flag.
    useRedisPackage: true,
    points,
    duration,
    // Do not block requests, just reject with HTTP 429.
    blockDuration: 0,
    keyPrefix,
  });

  return async (req, res, next) => {
    const ip = getClientIp(req);

    try {
      const rateLimiterRes = await rateLimiter.consume(ip);

      res.set({
        "X-RateLimit-Limit": String(points),
        "X-RateLimit-Remaining": String(rateLimiterRes.remainingPoints),
      });

      return next();
    } catch (rejRes) {
      // Redis/structural error: fail-open (allow the request through)
      if (rejRes instanceof Error) {
        console.error("Rate Limiter technical Error:", rejRes.message);
        return next();
      }

      // Rate-limit rejection: we have msBeforeNext in the rejection object
      const msBeforeNext = rejRes?.msBeforeNext ?? 0;
      const retryAfterSeconds = Math.round(msBeforeNext / 1000) || 1;

      res.set({
        "Retry-After": String(retryAfterSeconds),
        "X-RateLimit-Limit": String(points),
        "X-RateLimit-Remaining": String(rejRes?.remainingPoints ?? 0),
      });

      if (msBeforeNext > 0) {
        res.set("X-RateLimit-Reset", new Date(Date.now() + msBeforeNext).toUTCString());
      }

      return res.status(429).json({
        success: false,
        message: "Too Many Requests. Please try again later.",
        retryAfterSeconds,
      });
    }
  };
};

// Default generic rate limiter (5 requests per minute)
export const rateLimiter = createRateLimitMiddleware(5, 60, "genericrl");
export default rateLimiter;
