import { createAsyncThunk } from '@reduxjs/toolkit';
import { GET, PUT, POST } from '../../services/httpMethods';
import { API_ENDPOINTS } from '../../services/httpEndpoint';

// Get user profile
export const getUserProfile = createAsyncThunk(
  'profile/getUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await GET(API_ENDPOINTS.AUTH.PROFILE);

      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to fetch profile');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch profile'
      );
    }
  }
);

// Get subscription status
export const getSubscriptionStatus = createAsyncThunk(
  'profile/getSubscriptionStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await GET('/api/v1/payments/subscription-status');

      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to fetch subscription status');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch subscription status'
      );
    }
  }
);

// Update user profile
export const updateUserProfile = createAsyncThunk(
  'profile/updateUserProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await PUT(API_ENDPOINTS.AUTH.PROFILE, profileData);

      if (response.success) {
        return response.data;
      }

      return rejectWithValue(response.message || 'Failed to update profile');
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to update profile'
      );
    }
  }
);

export const changePassword = createAsyncThunk(
  'profile/changePassword',
  async ({ currentPassword, newPassword, confirmPassword }, { rejectWithValue }) => {
    try {
      const response = await POST(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (response?.success === false) {
        return rejectWithValue(response.message || 'Failed to change password');
      }

      return response?.data ?? response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to change password'
      );
    }
  }
);
