import { api } from '../lib/api';
export const tenantsService = {
  getTenant: async () => api.get('/tenants'),
  updateTenant: async (data) => api.patch('/tenants', data),
};
