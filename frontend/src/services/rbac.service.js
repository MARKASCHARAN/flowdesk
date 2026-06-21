import { api } from '../lib/api';
export const rbacService = {
  getRoles: async () => api.get('/rbac/roles'),
  getPermissions: async () => api.get('/rbac/permissions'),
  assignRole: async (userId, data) => api.post(`/rbac/users/${userId}/role`, data),
};
