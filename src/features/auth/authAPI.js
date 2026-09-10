import { createAsyncThunk } from '@reduxjs/toolkit';
import { POST, GET } from '../../services/httpMethods';
import { getGoogleIdToken } from '../../services/googleAuth';
import { logGoogleAuth, logGoogleAuthBody } from '../../services/googleAuthDebug';
import { ENV } from '../../config/env';

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
      if (error.response?.status === 429) {
        return rejectWithValue('Too many login attempts. Please wait and try again.');
      }
      return rejectWithValue(
        error.response?.data?.message || error.message || 'An error occurred during login'
      );
    }
  }
);

/**
 * Google login — Firebase popup → idToken → backend.
 * Backend: POST /api/v1/auth/google  body: { idToken }
 */
export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async (_, { rejectWithValue }) => {
    try {
      logGoogleAuth(1, 'Started — fetching idToken from Firebase...');

      const idToken = await getGoogleIdToken();

      logGoogleAuthBody(idToken);

      const url = '/api/v1/auth/google';
      const body = { idToken };
      logGoogleAuth(5, `Sending POST ${ENV.API_BASE_URL}${url}`, body);

      const response = await POST(url, body);

      logGoogleAuth(6, 'Backend response', response);

      if (response.success) {
        logGoogleAuth(7, 'Login success — app token saved', {
          userEmail: response.data?.user?.email,
          hasToken: Boolean(response.data?.token),
        });
        return {
          user: response.data.user,
          token: response.data.token,
        };
      }

      logGoogleAuth(6, 'Backend returned success: false', response);
      return rejectWithValue(response.message || 'Google login failed');
    } catch (error) {
      logGoogleAuth('ERR', 'Request failed', {
        message: error.message,
        status: error.response?.status,
        backendBody: error.response?.data,
        firebaseCode: error?.code,
      });

      const firebaseCode = error?.code;
      if (
        firebaseCode === 'auth/popup-closed-by-user' ||
        firebaseCode === 'auth/cancelled-popup-request'
      ) {
        return rejectWithValue(null);
      }

      if (error.response?.status === 404) {
        return rejectWithValue(
          'Google sign-in API is not available on the server yet. Ask the backend team to enable POST /api/v1/auth/google.'
        );
      }

      if (error.response?.status === 401) {
        return rejectWithValue(
          error.response?.data?.message ||
            'Google sign-in failed: server could not verify your Google token. Ask backend to check Firebase Admin setup for project fellini-82332.'
        );
      }

      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'An error occurred during Google sign-in'
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
        error.response?.data?.message ||
          error.message ||
          'An error occurred during reset OTP verification'
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

// Resend OTP
export const resendOtp = createAsyncThunk(
  'auth/resendOtp',
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await POST('/api/v1/auth/resend-otp', { email });
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to resend OTP');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to resend OTP'
      );
    }
  }
);

export const fetchSubscriptionStatus = createAsyncThunk(
  'subscription/fetchStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await GET('/api/v1/payments/subscription-status');

      return response.data.data; // plan, status, startDate, endDate, etc
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch subscription status'
      );
    }
  }
);
