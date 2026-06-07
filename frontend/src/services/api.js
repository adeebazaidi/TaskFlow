import axios from 'axios';

const api = axios.create({
  // In dev, Vite proxy forwards /api to localhost:5000 so we use a relative path.
  // For production, set VITE_API_URL to the full backend URL.
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Response interceptor for consistent error handling (F1)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong';

    // If 401, clear local auth state (but don't show toast here — handled per call-site)
    if (error.response?.status === 401) {
      localStorage.removeItem('taskflow_token');
      localStorage.removeItem('taskflow_user');
      delete api.defaults.headers.common['Authorization'];
    }

    // Attach the friendly message to the original error object so it's
    // accessible via err.message while preserving the Error prototype chain (F1)
    const enrichedError = error instanceof Error ? error : new Error(message);
    enrichedError.message = message;
    enrichedError.response = error.response;
    enrichedError.status = error.response?.status;

    return Promise.reject(enrichedError);
  }
);

export default api;
