import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { COLORS } from '../constants/colors';

export const useAuthStore = create((set, get) => ({
  // State
  user: null,
  token: null,
  isLoading: false,
  error: null,

  // Smart Cart pairing state
  cartId: null,
  isCartConnected: false,

  // Actions
  login: async (phone, password) => {
    set({ isLoading: true, error: null });
    try {
      // api response interceptor returns response.data directly
      const response = await api.post('/api/auth/login', { phone, password });
      const token = response.accessToken;

      await AsyncStorage.setItem('token', token);

      set({
        user: response.user,
        token: token,
        isLoading: false,
        error: null,
      });

      return true;
    } catch (err) {
      const errorMessage = err.message || err || 'Something went wrong';
      set({
        error: errorMessage,
        isLoading: false,
      });
      return false;
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem('token');
    } catch (err) {
      console.warn('Failed to remove token on logout:', err);
    }

    set({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      cartId: null,
      isCartConnected: false,
    });
  },

  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        return false;
      }

      set({ isLoading: true, error: null });
      const response = await api.get('/api/auth/me');

      set({
        user: response.user || response,
        token,
        isLoading: false,
        error: null,
      });

      return true;
    } catch (err) {
      await get().logout();
      return false;
    }
  },

  // State setters for cart hardware pairing and backward compatibility
  setCartId: (cartId) => set({ cartId }),
  setCartConnected: (connected) => set({ isCartConnected: connected }),
  setUser: (user, token) => {
    if (token) AsyncStorage.setItem('token', token);
    set({ user, token });
  },
  clearError: () => set({ error: null }),
}));

export default useAuthStore;
