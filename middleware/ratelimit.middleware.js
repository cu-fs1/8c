import { RateLimiterMemory } from "rate-limiter-flexible";

/**
 * Factory function to create a rate limiter middleware
 * @param {number} points - Number of requests allowed
 * @param {number} duration - Duration in seconds
 */
export const createRateLimitMiddleware = (points, duration) => {
  const rateLimiter = new RateLimiterMemory({
    points,
    duration,
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
          "X-RateLimit-Reset": new Date(Date.now() + rateLimiterRes.msBeforeNext),
        });
        res.status(429).send("Too Many Requests");
      });
  };
};

// Default generic rate limiter (5 requests per minute)
export default createRateLimitMiddleware(5, 60);
