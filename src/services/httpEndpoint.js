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
};

export function adminAnnouncementById(id) {
  return `${API_ENDPOINTS.ADMIN.ANNOUNCEMENTS}/${id}`;
}
