import { api } from '../lib/api';
export const rbacService = {
  getRoles: async () => api.get('/rbac/roles'),
  createRole: async (data) => api.post('/rbac/roles', data),
  updateRole: async (id, data) => api.patch(`/rbac/roles/${id}`, data),
  deleteRole: async (id) => api.delete(`/rbac/roles/${id}`),
  getPermissions: async () => api.get('/rbac/permissions'),
  updatePermissions: async (roleId, permissionIds) => api.post(`/rbac/roles/${roleId}/permissions`, { permissionIds }),
  assignRole: async (userId, data) => api.post(`/rbac/users/${userId}/role`, data),
};
