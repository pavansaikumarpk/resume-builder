import axios from 'axios';

const api = axios.create({
  baseURL: 'https://resume-builder-t50m.onrender.com/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // Required for cross-origin cookies
});

// Add Token to requests if it exists in local storage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && token !== 'undefined' && token !== 'null') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle expired sessions globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Session expired or unauthorized. Logging out.");
      
      // Clear data
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      
      // Prevent infinite redirect loops if we are already on the login or signup page
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/signup') {
        window.location.href = '/login'; 
      }
    }
    return Promise.reject(error);
  }
);

export default api;