import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:8000/api',
//   headers: { 'Content-Type': 'application/json' }
// });

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' }
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
      window.location.href = '/login'; // Kick them to login automatically
    }
    return Promise.reject(error);
  }
);

export default api;