import { api } from '../lib/api';

export const crmService = {
  // Customers
  getCustomers: async (params) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return api.get(`/crm/customers${query}`);
  },
  
  getCustomerById: async (id) => {
    return api.get(`/crm/customers/${id}`);
  },

  createCustomer: async (data) => {
    return api.post('/crm/customers', data);
  },

  updateCustomer: async (id, data) => {
    return api.patch(`/crm/customers/${id}`, data);
  },

  deleteCustomer: async (id) => {
    return api.delete(`/crm/customers/${id}`);
  },

  // Notes
  addNoteToCustomer: async (customerId, data) => {
    return api.post(`/crm/customers/${customerId}/notes`, data);
  },

  // Leads
  getLeads: async (params) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return api.get(`/crm/leads${query}`);
  },

  createLead: async (customerId, data) => {
    return api.post(`/crm/customers/${customerId}/leads`, data);
  },

  updateLead: async (id, data) => {
    return api.patch(`/crm/leads/${id}`, data);
  }
};
