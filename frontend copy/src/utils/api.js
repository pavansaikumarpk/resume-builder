// import axios from 'axios';

// const api = axios.create({
//   // Ensure this points to your production backend when deployed
//   baseURL: import.meta.env.VITE_API_URL || 'https://resume-builder-t50m.onrender.com/api',
//   headers: { 'Content-Type': 'application/json' },
// });

// // CRITICAL FIX: Inject the token into the headers of every request
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token && token !== 'undefined' && token !== 'null') {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // Global Interceptor: Handle expired sessions globally without infinite loops
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       console.warn("Session expired or unauthorized. Clearing state.");
      
//       // Wipe everything so the store resets properly
//       localStorage.removeItem('userInfo');
//       localStorage.removeItem('token');
      
//       // Prevent infinite redirect loops if we are already on auth pages
//       const currentPath = window.location.pathname;
//       if (currentPath !== '/login' && currentPath !== '/signup' && currentPath !== '/') {
//         window.location.href = '/login'; 
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;




















import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
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
    if (error.response && error.response.status === 401) {
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