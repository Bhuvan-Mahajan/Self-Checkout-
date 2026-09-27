import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your live Railway backend URL (e.g., https://smartcart-backend.up.railway.app)
export const BASE_URL = 'https://self-checkout-production-d764.up.railway.app';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Read and attach JWT Bearer token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Error reading auth token from AsyncStorage:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Return response.data, handle 401, format error message
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await AsyncStorage.removeItem('token');
      } catch (storageError) {
        console.warn('Error clearing token on 401:', storageError);
      }
    }

    const message = error.response?.data?.message || 'Something went wrong';
    throw new Error(message);
  }
);

export default api;
