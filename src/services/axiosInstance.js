// ============================================
// BACKEND DISABLED - UNCOMMENT WHEN BACKEND IS READY
// Add your BASE_URL in config/env.js when backend is complete
// ============================================

import axios from 'axios';
import { API_CONFIG, AUTH_CONFIG } from '../config/constants';
import { getStorage, removeStorage } from '../utils/storage';

// Get token from storage
const getToken = () => {
  return getStorage(AUTH_CONFIG.TOKEN_KEY) || null;
};

// Create axios instance with backend URL
const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
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
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;

    // Handle specific error statuses
    if (response?.status === 401) {
      // Handle unauthorized - clear tokens and redirect to login
      removeStorage(AUTH_CONFIG.TOKEN_KEY);
      removeStorage(AUTH_CONFIG.USER_KEY);

      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    if (response?.status === 403) {
      console.error('Forbidden: You do not have permission');
    }

    if (response?.status === 404) {
      console.error('Resource not found');
    }

    // Always reject with error for thunk to catch
    return Promise.reject(error);
  }
);

export default axiosInstance;
