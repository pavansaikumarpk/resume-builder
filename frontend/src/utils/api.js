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

  // Axios inherits the instance-wide JSON content type. That header breaks
  // browser FormData uploads because the multipart boundary is not added.
  // Remove it for FormData so the browser can set multipart/form-data correctly.
  if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
    if (typeof config.headers.delete === 'function') {
      config.headers.delete('Content-Type');
    } else {
      delete config.headers['Content-Type'];
      delete config.headers['content-type'];
    }
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
