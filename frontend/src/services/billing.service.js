import { api } from '../lib/api';
export const billingService = {
  getSubscription: async () => api.get('/billing/subscription'),
  getInvoices: async () => api.get('/billing/invoices'),
  createCheckoutSession: async (data) => api.post('/billing/checkout', data),
  createPortalSession: async () => api.post('/billing/portal'),
};
