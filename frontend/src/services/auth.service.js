import { api } from '../lib/api';

export const authService = {
  login: async (credentials) => {
    return api.post('/auth/login', credentials);
  },
  
  register: async (data) => {
    return api.post('/auth/register', data);
  },

  logout: async () => {
    return api.post('/auth/logout');
  },

  forgotPassword: async (email) => {
    return api.post('/auth/forgot-password', { email });
  },

  resetPassword: async (data) => {
    return api.post('/auth/reset-password', data);
  }
};
