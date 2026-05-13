import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:8000/api',
//   headers: { 'Content-Type': 'application/json' }
// });

import axios from 'axios';

const api = axios.create({
  // 🚀 If VITE_API_URL fails, it falls back directly to your Render backend
  baseURL: import.meta.env.VITE_API_URL || 'https://resume-builder-t50m.onrender.com/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // 🚀 CRITICAL: Required for cookies to work across different domains!
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && token !== 'undefined' && token !== 'null') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global Error Interceptor for Expired Tokens
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the backend says the token is invalid/expired (401)
    if (error.response && error.response.status === 401) {
      console.warn("Session expired. Logging out.");
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo'); // 🚀 Make sure we clear the user data too!
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;