// ============================================
// BACKEND DISABLED - UNCOMMENT WHEN BACKEND IS READY
// Add your BASE_URL in config/env.js when backend is complete
// ============================================

import axios from 'axios';
import { API_CONFIG, AUTH_CONFIG } from '../config/constants';
import { getAuthToken, removeAuthToken, removeStorage } from '../utils/storage';

// Get token from cookie
const getToken = () => {
  return getAuthToken() || null;
};

/** Do not attach app JWT on public auth routes (stale token can cause 401 on Google login). */
const PUBLIC_AUTH_PATHS = [
  '/api/v1/auth/login',
  '/api/v1/auth/register',
  '/api/v1/auth/google',
  '/api/v1/auth/forgot-password',
  '/api/v1/auth/verify-otp',
  '/api/v1/auth/verify-reset-otp',
  '/api/v1/auth/resend-otp',
  '/api/v1/auth/set-new-password',
];

function isPublicAuthRequest(url = '') {
  return PUBLIC_AUTH_PATHS.some((path) => url.includes(path));
}

function shouldClearSessionOn401(url = '') {
  return !isPublicAuthRequest(url);
}

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
    if (token && !isPublicAuthRequest(config.url)) {
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
      if (shouldClearSessionOn401(error.config?.url)) {
        removeAuthToken();
        removeStorage(AUTH_CONFIG.USER_KEY);

        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
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
