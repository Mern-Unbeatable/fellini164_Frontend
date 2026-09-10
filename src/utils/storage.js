// LocalStorage utility functions (+ auth token in cookies)

import Cookies from 'js-cookie';
import { AUTH_CONFIG } from '../config/constants';

const AUTH_TOKEN_COOKIE_DAYS = 7;

function authTokenCookieOptions() {
  return {
    expires: AUTH_TOKEN_COOKIE_DAYS,
    path: '/',
    sameSite: 'Lax',
    secure: typeof window !== 'undefined' && window.location.protocol === 'https:',
  };
}

/** Read JWT from cookie (migrates leftover localStorage token once). */
export const getAuthToken = () => {
  try {
    const fromCookie = Cookies.get(AUTH_CONFIG.TOKEN_KEY);
    if (fromCookie) return fromCookie;

    // One-time migrate from older localStorage sessions
    const raw = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
    if (!raw) return null;
    let token = raw;
    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed === 'string') token = parsed;
    } catch {
      // plain JWT string
    }
    if (token) {
      Cookies.set(AUTH_CONFIG.TOKEN_KEY, token, authTokenCookieOptions());
      localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
      return token;
    }
    return null;
  } catch (error) {
    console.error('Error reading auth token cookie:', error);
    return null;
  }
};

/** Persist JWT in cookie and clear any localStorage copy. */
export const setAuthToken = (token) => {
  try {
    if (!token) {
      removeAuthToken();
      return;
    }
    Cookies.set(AUTH_CONFIG.TOKEN_KEY, String(token), authTokenCookieOptions());
    localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
  } catch (error) {
    console.error('Error saving auth token cookie:', error);
  }
};

/** Clear JWT cookie + any leftover localStorage token. */
export const removeAuthToken = () => {
  try {
    Cookies.remove(AUTH_CONFIG.TOKEN_KEY, { path: '/' });
    localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
  } catch (error) {
    console.error('Error removing auth token cookie:', error);
  }
};

export const setStorage = (key, value) => {
  try {
    if (key === AUTH_CONFIG.TOKEN_KEY) {
      setAuthToken(value);
      return;
    }
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error(`Error saving to localStorage (key: ${key}):`, error);
  }
};

// Retrieve data from localStorage (auth token → cookie)
export const getStorage = (key) => {
  try {
    if (key === AUTH_CONFIG.TOKEN_KEY) {
      return getAuthToken();
    }
    const serializedValue = localStorage.getItem(key);
    if (serializedValue === null) {
      return null;
    }
    // Try to parse as JSON, if it fails return the raw string (for tokens)
    try {
      return JSON.parse(serializedValue);
    } catch {
      // If not valid JSON, return as-is (handles plain strings like JWT tokens)
      return serializedValue;
    }
  } catch (error) {
    console.error(`Error reading from localStorage (key: ${key}):`, error);
    return null;
  }
};

// Remove a specific key from localStorage (auth token → cookie)
export const removeStorage = (key) => {
  try {
    if (key === AUTH_CONFIG.TOKEN_KEY) {
      removeAuthToken();
      return;
    }
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage (key: ${key}):`, error);
  }
};

// Clear all localStorage data (+ auth token cookie)
export const clearStorage = () => {
  try {
    removeAuthToken();
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

// Check if a specific key exists in localStorage (auth token → cookie)
export const hasStorage = (key) => {
  if (key === AUTH_CONFIG.TOKEN_KEY) {
    return Boolean(getAuthToken());
  }
  return localStorage.getItem(key) !== null;
};
