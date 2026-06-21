import { api } from '../lib/api';
export const adminService = {
  getDashboardStats: async () => api.get('/analytics/dashboard'), // Fallback to analytics
  getTenants: async (params) => api.get(`/tenants${params ? `?${new URLSearchParams(params).toString()}` : ''}`),
  getUsers: async (params) => api.get(`/users/team${params ? `?${new URLSearchParams(params).toString()}` : ''}`), // Fallback to team
  getAuditLogs: async (params) => api.get(`/audit-logs${params ? `?${new URLSearchParams(params).toString()}` : ''}`),
};
