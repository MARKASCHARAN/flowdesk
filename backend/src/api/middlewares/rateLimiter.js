import rateLimit from 'express-rate-limit';

/**
 * Authentication Rate Limiter
 * 
 * Industry standard: Protects login and password reset routes from brute-force
 * and dictionary attacks. We only count *failed* requests towards the limit, 
 * so legitimate users are not penalized for logging in successfully.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  skipSuccessfulRequests: true,
});

/**
 * Global API Rate Limiter
 * 
 * Industry standard: Protects general API endpoints from DDoS attacks and 
 * scraping bots by capping requests per IP address.
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
