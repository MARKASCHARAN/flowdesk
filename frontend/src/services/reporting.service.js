import { api } from '../lib/api';
export const reportingService = {
  getReports: async () => api.get('/reporting/export'), // Assuming we update backend or frontend just uses it for mock
  generateReport: async (data) => api.post('/reporting/export', data),
  downloadReport: async (id) => api.get(`/reporting/export/${id}`),
};
