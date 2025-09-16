import axios from 'axios';
import authService from './authService';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle network errors
    if (!error.response) {
      // Network error or server not responding
      if (authService.isTokenExpired()) {
        authService.logout();
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized errors
    if (error.response.status === 401) {
      // Clear auth data and redirect to login
      authService.logout();
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // console.log(error.response.data.message || "Access denied");
    if (error.response.status === 403) {
      // Handle access denied errors
      authService.logout();
      window.location.href = '/login';
      return Promise.reject({ message: error.response.data.message || "Access denied" });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance; 