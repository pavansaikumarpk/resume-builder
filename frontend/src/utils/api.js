import axios from 'axios';

// Use the Hostinger environment variable when it is configured.
// If it is missing, use the production Hostinger backend as a safe fallback.
const FALLBACK_API_URL = 'https://haveresume-com-878344.hostingersite.com';
const configuredApiUrl = import.meta.env.VITE_API_URL || FALLBACK_API_URL;
const normalizedApiUrl = configuredApiUrl.replace(/\/+$/, '');
const API_BASE_URL = normalizedApiUrl.endsWith('/api')
  ? normalizedApiUrl
  : `${normalizedApiUrl}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && token !== 'undefined' && token !== 'null') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('userInfo');
      localStorage.removeItem('token');
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/signup' && currentPath !== '/') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
