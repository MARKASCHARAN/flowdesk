import { api } from '../lib/api';
export const notificationsService = {
  getNotifications: async (params) => api.get(`/notifications${params ? `?${new URLSearchParams(params).toString()}` : ''}`),
  markAsRead: async (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: async () => api.post('/notifications/mark-all-read'),
};
