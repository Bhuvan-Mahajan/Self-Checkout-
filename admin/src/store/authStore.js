import { create } from 'zustand';
import api from '../services/api';
import { connectSocket, disconnectSocket } from '../services/socket';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,

  login: async (phone, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/api/auth/login', { phone, password });
      const user = response.user;
      const token = response.accessToken;

      localStorage.setItem('token', token);
      set({ user, token, isLoading: false, error: null });

      connectSocket(token);
      return true;
    } catch (err) {
      set({
        error: err.message || 'Login failed',
        isLoading: false,
      });
      return false;
    }
  },

  logout: () => {
    localStorage.clear();
    disconnectSocket();
    set({ user: null, token: null, error: null });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ user: null, token: null });
      return false;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/api/auth/me');
      const user = response.user || response;

      set({ user, token, isLoading: false, error: null });
      connectSocket(token);
      return true;
    } catch (err) {
      get().logout();
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
