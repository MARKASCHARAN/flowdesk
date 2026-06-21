import { create } from 'zustand';
import { usersService } from '../services/users.service';
import { authService } from '../services/auth.service';

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem('flowdesk_token'),
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(credentials);
      const authData = response.data; // backend wraps in { status, message, data }
      localStorage.setItem('flowdesk_token', authData.accessToken);
      set({ isAuthenticated: true, user: authData.user, isLoading: false });
      return true;
    } catch (err) {
      set({ error: err.message || 'Login failed', isLoading: false });
      return false;
    }
  },

  register: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register(credentials);
      const authData = response.data;
      localStorage.setItem('flowdesk_token', authData.accessToken);
      set({ isAuthenticated: true, user: authData.user, isLoading: false });
      return true;
    } catch (err) {
      set({ error: err.message || 'Registration failed', isLoading: false });
      return false;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout API failed, but clearing local state anyway');
    } finally {
      localStorage.removeItem('flowdesk_token');
      set({ isAuthenticated: false, user: null });
    }
  },

  fetchProfile: async () => {
    // Only fetch if we have a token
    if (!localStorage.getItem('flowdesk_token')) {
      set({ isAuthenticated: false, user: null });
      return;
    }
    
    set({ isLoading: true, error: null });
    try {
      const response = await usersService.getProfile();
      set({ user: response.data, isAuthenticated: true, isLoading: false });
    } catch (err) {
      // If unauthorized, the api wrapper will clear the token and redirect
      set({ error: err.message, isAuthenticated: false, user: null, isLoading: false });
    }
  }
}));
