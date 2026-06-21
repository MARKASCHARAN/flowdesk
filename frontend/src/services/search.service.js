import { api } from '../lib/api';
export const searchService = {
  globalSearch: async (query) => api.get(`/search?q=${encodeURIComponent(query)}`),
};
