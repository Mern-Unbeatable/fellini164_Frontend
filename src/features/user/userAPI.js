import { createAsyncThunk } from '@reduxjs/toolkit';
import { GET } from '../../services/httpMethods';

// Get referral stats
export const getReferralStats = createAsyncThunk(
  'user/referralStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await GET('/api/v1/auth/referral/stats');

      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to get referral stats');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to get referral stats'
      );
    }
  }
);
