import { AsyncLocalStorage } from 'async_hooks';

export const requestContext = new AsyncLocalStorage();

/**
 * Context Middleware
 * 
 * Industry standard: We use AsyncLocalStorage to persist request-scoped data
 * (like tenantId and userId) throughout the entire async execution tree without
 * needing to pass 'req' or 'user' objects into every database repository function.
 */
export const contextMiddleware = (req, res, next) => {
  requestContext.run(new Map(), () => {
    next();
  });
};
