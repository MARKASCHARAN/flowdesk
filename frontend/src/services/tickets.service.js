import { api } from '../lib/api';

export const ticketsService = {
  getTickets: async (params) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return api.get(`/tickets${query}`);
  },

  getTicketById: async (id) => {
    return api.get(`/tickets/${id}`);
  },

  createTicket: async (data) => {
    return api.post('/tickets', data);
  },

  updateTicket: async (id, data) => {
    return api.patch(`/tickets/${id}`, data);
  },

  deleteTicket: async (id) => {
    return api.delete(`/tickets/${id}`);
  },

  assignTicket: async (id, assigneeId) => {
    return api.post(`/tickets/${id}/assign`, { assigneeId });
  }
};
