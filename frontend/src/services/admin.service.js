import { api } from '../lib/api';
export const adminService = {
  getDashboardStats: async () => api.get('/admin/dashboard'),
  getTenants: async (params) => api.get(`/admin/tenants${params ? `?${new URLSearchParams(params).toString()}` : ''}`),
  getUsers: async (params) => api.get(`/admin/users${params ? `?${new URLSearchParams(params).toString()}` : ''}`),
  getAuditLogs: async (params) => api.get(`/admin/audit-logs${params ? `?${new URLSearchParams(params).toString()}` : ''}`),
};
