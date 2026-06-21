import { api } from '../lib/api';
export const webhooksService = {
  getWebhooks: async () => api.get('/webhooks'),
  createWebhook: async (data) => api.post('/webhooks', data),
  updateWebhook: async (id, data) => api.patch(`/webhooks/${id}`, data),
  deleteWebhook: async (id) => api.delete(`/webhooks/${id}`),
};
