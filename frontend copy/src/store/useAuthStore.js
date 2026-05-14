// import { create } from 'zustand';
// import api from '../utils/api';

// export const useAuthStore = create((set) => ({
//   user: null,
//   token: localStorage.getItem('token') || null,
//   isLoading: false,
//   error: null,

//   signup: async (userData) => {
//     set({ isLoading: true, error: null });
//     try {
//       const response = await api.post('/auth/signup', userData);
      
//       // FIXED: Extract the token from the backend response
//       const { token, ...user } = response.data;
      
//       // FIXED: Save the real token into Local Storage
//       if (token) {
//           localStorage.setItem('token', token);
//       }
      
//       set({ user, token, isLoading: false });
//       return true;
//     } catch (error) {
//       set({ 
//         error: error.response?.data?.message || 'Signup failed', 
//         isLoading: false 
//       });
//       return false;
//     }
//   },

//   login: async (userData) => {
//     set({ isLoading: true, error: null });
//     try {
//       const response = await api.post('/auth/login', userData);
      
//       // FIXED: Extract the token from the backend response
//       const { token, ...user } = response.data;
      
//       // FIXED: Save the real token into Local Storage
//       if (token) {
//           localStorage.setItem('token', token);
//       }
      
//       set({ user, token, isLoading: false });
//       return true;
//     } catch (error) {
//       set({ 
//         error: error.response?.data?.message || 'Login failed', 
//         isLoading: false 
//       });
//       return false;
//     }
//   },

//   logout: () => {
//     localStorage.removeItem('token');
//     set({ user: null, token: null });
//     window.location.href = '/login';
//   }
// }));







import { create } from 'zustand';
import api from '../utils/api';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('userInfo')) || null,
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
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
      localStorage.setItem('userInfo', JSON.stringify(data));
      set({ user: data, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, message: error.response?.data?.message || 'Server is waking up. Please try again in 30 seconds.' };
    }
  },

  // 🚀 NEW: Handle Google Login
  googleAuth: async (token) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post('/auth/google', { token });
      localStorage.setItem('userInfo', JSON.stringify(data));
      set({ user: data, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, message: error.response?.data?.message || 'Google Auth Failed' };
    }
  },

  logout: () => {
    localStorage.removeItem('userInfo');
    set({ user: null });
  },
}));