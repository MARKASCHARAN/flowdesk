import { api } from '../lib/api';
export const tenantsService = {
  getTenant: async () => api.get('/tenants/current'),
  updateTenant: async (data) => api.patch('/tenants/current', data),
};
