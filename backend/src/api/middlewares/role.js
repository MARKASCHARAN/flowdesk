import { AppError } from '../../infra/errors/AppError.js';

/**
 * Role Authorization Guard
 *
 * Validates that the authenticated user possesses at least one of the
 * roles required to access a specific route.
 *
 * @param {string[]} allowedRoles - Array of roles (e.g., ['Admin', 'Manager'])
 */
export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.roles || req.user.roles.length === 0) {
      return next(new AppError(403, 'Forbidden: No roles assigned'));
    }

    const hasRole = req.user.roles.some((role) => allowedRoles.includes(role));
    if (!hasRole) {
      return next(new AppError(403, 'Forbidden: Insufficient permissions'));
    }

    next();
  };
};

export const requireSystemAdmin = (req, res, next) => {
  if (!req.user || !req.user.roles || req.user.roles.length === 0) {
    return next(new AppError(403, 'Forbidden: No roles assigned'));
  }

  // SystemAdmin check (e.g. user has SystemAdmin role or super admin flag)
  // For this boilerplate, we'll assume a role of 'SystemAdmin'
  const hasRole = req.user.roles.some((role) => role === 'SystemAdmin');
  if (!hasRole) {
    return next(
      new AppError(403, 'Forbidden: System Admin permissions required')
    );
  }

  next();
};
