import { createAsyncThunk } from '@reduxjs/toolkit';
import { POST, GET } from '../../services/httpMethods';

// Login API
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await POST('/api/v1/auth/login', { email, password });

      if (response.success) {
        return {
          user: response.data.user,
          token: response.data.token,
        };
      } else {
        return rejectWithValue(response.message || 'Login failed');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'An error occurred during login'
      );
    }
  }
);

// Register API
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await POST('/api/v1/auth/register', userData);

      if (response.success) {
        return {
          user: response.data.user,
          token: response.data.token,
        };
      } else {
        return rejectWithValue(response.error || response.message || 'Registration failed');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          'An error occurred during registration'
      );
    }
  }
);

// Verify OTP API
export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await POST('/api/v1/auth/verify-otp', { email, otp });

      if (response.success) {
        return {
          user: response.data.user,
          token: response.data.token,
        };
      } else {
        return rejectWithValue(response.message || 'OTP verification failed');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'An error occurred during OTP verification'
      );
    }
  }
);

// Verify Reset OTP (forgot-password -> verify-reset-otp)
export const verifyResetOTP = createAsyncThunk(
  'auth/verifyResetOTP',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await POST('/api/v1/auth/verify-reset-otp', { email, otp });

      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Reset OTP verification failed');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'An error occurred during reset OTP verification'
      );
    }
  }
);

// Get current user
export const getCurrentUser = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try {
    const response = await GET('/v1/auth/me');

    if (response.success) {
      return response.data.user;
    } else {
      return rejectWithValue(response.message || 'Failed to get user data');
    }
  } catch (error) {
    return rejectWithValue(
      error.response?.data?.message || error.message || 'Failed to get user data'
    );
  }
});

// Logout API
export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    const response = await POST('/v1/auth/logout');
    return response;
  } catch (error) {
    // Even if logout fails on server, we clear local data
    return rejectWithValue(error.response?.data?.message || error.message || 'Logout failed');
  }
});

//ForgotPassword

export const sendForgotOTP = createAsyncThunk(
  'auth/sendForgotOTP',
  async ({ email }, { rejectWithValue }) => {
    try {
      const res = await POST('/api/v1/auth/forgot-password', { email });
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to send OTP');
    }
  }
);

// authAPI.js
export const resetPasswordAPI = async ({ email, otp, password, confirmPassword }) => {
  // POST body field names must match backend; using 'set-new-password' endpoint
  const body = { email, password };
  if (confirmPassword) body.confirmPassword = confirmPassword;
  if (otp) body.otp = otp;

  const response = await POST('/api/v1/auth/set-new-password', body);
  return response;
};

// payments API
export const createCheckout = createAsyncThunk(
  'payments/createCheckout',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await POST('/api/v1/payments/create-checkout', payload);

      if (response.success) {
        return response.data; // sessionId + url
      } else {
        return rejectWithValue(response.message || 'Checkout failed');
      }
    } catch (error) {
      console.log(error.response?.data);
      return rejectWithValue(error.response?.data?.message || error.message || 'Checkout error');
    }
  }
);

export const fetchSubscriptionStatus = createAsyncThunk(
  'subscription/fetchStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await GET('/api/v1/payments/subscription-status', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      return response.data.data; // plan, status, startDate, endDate, etc
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch subscription status'
      );
    }
  }
);
