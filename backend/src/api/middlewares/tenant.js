import { AppError } from '../../infra/errors/AppError.js';

/**
 * Tenant Boundary Guard
 *
 * Ensures that the authenticated user operates strictly within their tenant's data.
 * If a route accepts a `tenantId` parameter, it verifies the user actually belongs to it.
 */
export const requireTenant = (req, res, next) => {
  if (!req.user || !req.user.tenantId) {
    return next(new AppError(403, 'Forbidden: Tenant ID missing from token'));
  }

  // If the route explicitly contains a :tenantId param, ensure it matches the token
  if (req.params.tenantId && req.params.tenantId !== req.user.tenantId) {
    return next(new AppError(403, 'Forbidden: Cross-tenant access denied'));
  }

  // Also bind tenantId to res.locals for easy downstream access
  res.locals.tenantId = req.user.tenantId;

  next();
};
