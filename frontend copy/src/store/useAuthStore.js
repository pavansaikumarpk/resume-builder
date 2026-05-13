import { create } from 'zustand';
import api from '../utils/api';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,

  signup: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/signup', userData);
      
      // FIXED: Extract the token from the backend response
      const { token, ...user } = response.data;
      
      // FIXED: Save the real token into Local Storage
      if (token) {
          localStorage.setItem('token', token);
      }
      
      set({ user, token, isLoading: false });
      return true;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Signup failed', 
        isLoading: false 
      });
      return false;
    }
  },

  login: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login', userData);
      
      // FIXED: Extract the token from the backend response
      const { token, ...user } = response.data;
      
      // FIXED: Save the real token into Local Storage
      if (token) {
          localStorage.setItem('token', token);
      }
      
      set({ user, token, isLoading: false });
      return true;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Login failed', 
        isLoading: false 
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
    window.location.href = '/login';
  }
}));