import { RateLimiterRedis } from "rate-limiter-flexible";
import redisClient from "../config/redis.js";

/**
 * Factory function to create a rate limiter middleware
 * @param {number} points - Number of requests allowed
 * @param {number} duration - Duration in seconds
 * @param {string} keyPrefix - Unique prefix for Redis keys
 */
export const createRateLimitMiddleware = (points, duration, keyPrefix = "rl") => {
  const rateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    points,
    duration,
    keyPrefix,
  });

  return (req, res, next) => {
    rateLimiter
      .consume(req.ip)
      .then((rateLimiterRes) => {
        res.set({
          "X-RateLimit-Limit": points,
          "X-RateLimit-Remaining": rateLimiterRes.remainingPoints,
        });
        next();
      })
      .catch((rateLimiterRes) => {
        res.set({
          "Retry-After": Math.ceil(rateLimiterRes.msBeforeNext / 1000),
          "X-RateLimit-Limit": points,
          "X-RateLimit-Remaining": rateLimiterRes.remainingPoints,
          "X-RateLimit-Reset": new Date(Date.now() + rateLimiterRes.msBeforeNext).toISOString(),
        });
        res.status(429).json({ message: "Too Many Requests" });
      });
  };
};

// Default generic rate limiter (5 requests per minute)
export const rateLimiter = createRateLimitMiddleware(5, 60, "genericrl");
export default rateLimiter;
