import { create } from 'zustand';
import api from '../utils/api';

const readStoredUser = () => {
  try {
    const storedUser = localStorage.getItem('userInfo');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    localStorage.removeItem('userInfo');
    return null;
  }
};

export const useAuthStore = create((set) => ({
  user: readStoredUser(),
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      
      // 🚀 CRITICAL FIX: Save BOTH userInfo and token
      localStorage.setItem('userInfo', JSON.stringify(data));
      if (data.token) localStorage.setItem('token', data.token);
      
      set({ user: data, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, message: error.response?.data?.message || 'Server is waking up. Please try again in 30 seconds.' };
    }
  },

  signup: async (username, email, password) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post('/auth/signup', { username, email, password });
      
      // 🚀 CRITICAL FIX: Save BOTH userInfo and token
      localStorage.setItem('userInfo', JSON.stringify(data));
      if (data.token) localStorage.setItem('token', data.token);
      
      set({ user: data, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, message: error.response?.data?.message || 'Server is waking up. Please try again in 30 seconds.' };
    }
  },

  googleAuth: async (token) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post('/auth/google', { token });
      
      // 🚀 CRITICAL FIX: Save BOTH userInfo and token
      localStorage.setItem('userInfo', JSON.stringify(data));
      if (data.token) localStorage.setItem('token', data.token);
      
      set({ user: data, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, message: error.response?.data?.message || 'Google Auth Failed' };
    }
  },

  logout: () => {
    // 🚀 CRITICAL FIX: Clear BOTH when logging out
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    set({ user: null });
    window.location.href = '/login';
  },
}));