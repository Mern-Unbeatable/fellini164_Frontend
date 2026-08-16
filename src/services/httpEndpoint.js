// Frontend route paths
export const ROUTES_CONFIG = {
  public: {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    PRODUCTS: '/api/products',
  },
  private: {
    DASHBOARD: '/dashboard',
    PROFILE: '/profile',
    SETTINGS: '/settings',
  },
};

// API endpoints
export const API_ENDPOINTS = {
  ADMIN: {
    ANNOUNCEMENTS: '/api/v1/admin/announcements',
  },
  ONBOARDING: {
    STEP: '/api/v1/onboarding/step',
    GENERATE: '/api/v1/onboarding/generate',
    GENERATE_TIMEOUT_MS: 120000,
  },
  NOTIFICATIONS: {
    BASE: '/api/v1/notifications',
    READ_ALL: '/api/v1/notifications/read/all',
  },
};

export function adminAnnouncementById(id) {
  return `${API_ENDPOINTS.ADMIN.ANNOUNCEMENTS}/${id}`;
}

export function notificationById(id, suffix) {
  const base = `${API_ENDPOINTS.NOTIFICATIONS.BASE}/${id}`;
  return suffix ? `${base}/${suffix}` : base;
}
