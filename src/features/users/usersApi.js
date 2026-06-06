import { createAsyncThunk } from '@reduxjs/toolkit';
import { GET } from '../../services/httpMethods';

// Fetch mapped users (used by some UI views)
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async ({ page = 1, limit, search = '' } = {}, { rejectWithValue }) => {
    try {
      let url = `/api/v1/admin/users?page=${page}`;
      if (limit) url += `&limit=${limit}`;
      if (search) url += `&q=${encodeURIComponent(search)}`;

      const response = await GET(url);

      if (!response || !response.success) {
        return rejectWithValue(response?.message || 'Failed to load users');
      }

      const mapped = (response.data || []).map((user) => ({
        id: user.id,
        name: user.fullName || 'N/A',
        email: user.email || '',
        plan: (user.subscriptionPlan || 'FREE').toUpperCase(),
        status: (function (s) {
          const map = {
            ACTIVE: 'Active',
            WAITLIST: 'Inactive',
            INVITED: 'Active',
            UNSUBSCRIBED: 'Suspended',
          };
          return map[s] || 'Inactive';
        })(user.userStatus),
        joined: user.createdAt,
        lastActive: user.lastLogin,
      }));

      return {
        users: mapped,
        page: response.page || 1,
        totalPages: response.totalPages || 1,
        total: response.total || mapped.length,
      };
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);

// Fetch raw admin users (includes raw status, referralCount, createdAt)
export const fetchAdminUsers = createAsyncThunk(
  'users/fetchAdminUsers',
  async ({ page = 1, limit, search = '', status } = {}, { rejectWithValue }) => {
    try {
      let url = `/api/v1/admin/users?page=${page}`;
      if (limit) url += `&limit=${limit}`;
      if (search) url += `&q=${encodeURIComponent(search)}`;
      if (status) url += `&status=${encodeURIComponent(status)}`;

      const response = await GET(url);

      if (!response || !response.success) {
        return rejectWithValue(response?.message || 'Failed to load admin users');
      }

      const raw = (response.data || []).map((user) => ({
        id: user.id,
        fullName: user.fullName || 'N/A',
        email: user.email || '',
        userStatus: user.userStatus,
        referralCount: user.referralCount || 0,
        createdAt: user.createdAt,
      }));

      return {
        adminUsers: raw,
        page: response.page || 1,
        totalPages: response.totalPages || 1,
        total: response.total || raw.length,
      };
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);

// Fetch waitlist users from /api/v1/admin/waitlist
export const fetchWaitlistUsers = createAsyncThunk(
  'users/fetchWaitlistUsers',
  async ({ page = 1, limit, search = '' } = {}, { rejectWithValue }) => {
    try {
      let url = `/api/v1/admin/waitlist?page=${page}`;
      if (limit) url += `&limit=${limit}`;
      if (search) url += `&q=${encodeURIComponent(search)}`;

      const response = await GET(url);

      if (!response || !response.success) {
        return rejectWithValue(response?.message || 'Failed to load waitlist users');
      }

      const raw = (response.data || []).map((user) => ({
        id: user.id,
        fullName: user.fullName || 'N/A',
        email: user.email || '',
        userStatus: user.userStatus,
        referralCount: user.referralCount || 0,
        referralCode: user.referralCode || '',
        createdAt: user.createdAt,
      }));

      return {
        waitlistUsers: raw,
        page: response.page || 1,
        totalPages: response.totalPages || 1,
        total: response.total || raw.length,
      };
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);

// Fetch admin dashboard stats from /api/v1/admin/stats
export const fetchAdminStats = createAsyncThunk(
  'users/fetchAdminStats',
  async (_, { rejectWithValue }) => {
    try {
      const url = `/api/v1/admin/stats`;
      const response = await GET(url);

      if (!response || !response.success) {
        return rejectWithValue(response?.message || 'Failed to load admin stats');
      }

      // Return raw stats payload for dashboard components to consume
      return response.data || {};
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);

export default {
  fetchUsers,
  fetchAdminUsers,
  fetchWaitlistUsers,
  fetchAdminStats,
};
