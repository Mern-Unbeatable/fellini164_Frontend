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
  AUTH: {
    PROFILE: '/api/v1/auth/profile',
    CHANGE_PASSWORD: '/api/v1/auth/change-password',
  },
  PAYMENTS: {
    CREATE_CHECKOUT: '/api/v1/payments/create-checkout',
    SUBSCRIPTION_STATUS: '/api/v1/payments/subscription-status',
  },
  USERS: {
    DASHBOARD: '/api/v1/users/dashboard',
    ACTIVITY_LOGS: '/api/v1/users/activity-logs',
    ACTIVITY_LOGS_STATS: '/api/v1/users/activity-logs/stats',
  },
};

export function adminAnnouncementById(id) {
  return `${API_ENDPOINTS.ADMIN.ANNOUNCEMENTS}/${id}`;
}

export function notificationById(id, suffix) {
  const base = `${API_ENDPOINTS.NOTIFICATIONS.BASE}/${id}`;
  return suffix ? `${base}/${suffix}` : base;
}
