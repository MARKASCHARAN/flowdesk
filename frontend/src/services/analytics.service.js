import { api } from '../lib/api';
export const analyticsService = {
  getDashboardMetrics: async (params) => api.get(`/analytics/dashboard${params ? `?${new URLSearchParams(params).toString()}` : ''}`),
  getTicketTrends: async (params) => api.get(`/analytics/tickets${params ? `?${new URLSearchParams(params).toString()}` : ''}`),
};
