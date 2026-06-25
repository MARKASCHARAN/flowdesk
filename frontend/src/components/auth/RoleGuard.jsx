import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';

/**
 * RoleGuard conditionally renders children based on the user's role.
 * @param {string[]} allowedRoles - Array of role names that are permitted to see the content.
 * @param {React.ReactNode} fallback - What to render if the user does not have permission (default: null).
 */
const RoleGuard = ({ allowedRoles = [], children, fallback = null }) => {
  const { user } = useAuthStore();

  // If there's no user, we can't verify roles, so deny access.
  if (!user) return fallback;

  // Extract the user's role from their memberships
  // Assuming a user typically has one active membership in the current tenant context
  const userRole = user.memberships?.[0]?.role?.name || user.role?.name;

  // If they are an 'Admin', they automatically pass all role guards
  if (userRole === 'Admin') return <>{children}</>;

  // Check if their specific role is in the allowed list
  if (allowedRoles.includes(userRole)) {
    return <>{children}</>;
  }

  // Permission denied
  return fallback;
};

export default RoleGuard;
