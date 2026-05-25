import { redis } from '../../infra/cache/redis.js';
import { AppError } from '../../infra/errors/AppError.js';
import logger from '../../infra/logger/index.js';

/**
 * Idempotency Middleware
 * 
 * Industry standard: Prevents duplicate execution of critical operations 
 * (like payments or subscriptions) by caching the response against a 
 * client-provided Idempotency-Key.
 */
export const idempotencyMiddleware = async (req, res, next) => {
  const idempotencyKey = req.headers['idempotency-key'];

  if (!idempotencyKey) {
    return next(); // Proceed normally if no key is provided
  }

  // Ensure key is namespaced by user/tenant to prevent global collisions
  const tenantId = res.locals.tenantId || req.user?.tenantId || 'unknown';
  const redisKey = `idempotency:${tenantId}:${idempotencyKey}`;

  try {
    const cachedResponse = await redis.get(redisKey);

    if (cachedResponse) {
      logger.info(`[Idempotency] Cache hit for key: ${idempotencyKey}`);
      const { statusCode, body, headers } = JSON.parse(cachedResponse);
      
      if (headers) {
        for (const [key, value] of Object.entries(headers)) {
          res.setHeader(key, value);
        }
      }
      return res.status(statusCode).json(body);
    }

    // Wrap res.json to capture the response and cache it
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      // Only cache successful responses (2xx)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const responseToCache = {
          statusCode: res.statusCode,
          headers: res.getHeaders(),
          body
        };
        // Cache for 24 hours
        redis.setex(redisKey, 86400, JSON.stringify(responseToCache)).catch(err => {
          logger.error(`[Idempotency] Failed to cache response: ${err.message}`);
        });
      }
      return originalJson(body);
    };

    next();
  } catch (error) {
    logger.error(`[Idempotency] Error reading from cache: ${error.message}`);
    next(error);
  }
};
