import { api } from '../lib/api';
export const reportingService = {
  getReports: async () => api.get('/reporting'),
  generateReport: async (data) => api.post('/reporting/generate', data),
  downloadReport: async (id) => api.get(`/reporting/${id}/download`),
};
