import { api } from '../lib/api';

export const commentsService = {
  getComments: async (ticketId, params) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return api.get(`/comments/ticket/${ticketId}${query}`);
  },

  createComment: async (ticketId, data) => {
    return api.post(`/comments/ticket/${ticketId}`, data);
  },

  updateComment: async (id, data) => {
    return api.patch(`/comments/${id}`, data);
  },

  deleteComment: async (id) => {
    return api.delete(`/comments/${id}`);
  }
};
