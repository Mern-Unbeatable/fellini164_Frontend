import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { POST } from '../../services/httpMethods';

// NEW: Join waitlist with actual API endpoint
export const joinWaitlistWithReferral = createAsyncThunk(
  'referral/joinWaitlistWithReferral',
  async ({ email, referredBy }, { rejectWithValue }) => {
    try {
      const payload = { email };
      if (referredBy) {
        payload.referredBy = referredBy;
      }

      const response = await POST('/api/v1/auth/join-waitlist', payload);
      console.log('Waitlist join response:', response);

      if (response.success) {
        return response.data; // expected { email, referralCode, referralLink }
      } else {
        return rejectWithValue(response.message || 'Failed to join waitlist');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// OLD: Keep this for backward compatibility (commented as requested)
// Async Thunk: Join waitlist (simplified)
export const joinWaitlist = createAsyncThunk(
  'referral/joinWaitlist',
  async (email, { rejectWithValue }) => {
    try {
      const response = await POST('/api/v1/waitlist/join', { email });
      console.log('Waitlist join response:', response);

      if (response.success) {
        return response.data; // expected { message: "Success" }
      } else {
        return rejectWithValue(response.message || 'Failed to join waitlist');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

// Keep the old inviteToWaitlist for backward compatibility (if needed elsewhere)
export const inviteToWaitlist = createAsyncThunk(
  'referral/invite',
  async (email, { rejectWithValue }) => {
    try {
      const response = await POST('/api/v1/auth/join-waitlist', { email });
      console.log('Invite response:', response);

      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Invitation failed');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

const referralSlice = createSlice({
  name: 'referral',
  initialState: {
    loading: false,
    referralLink: '',
    referralCode: '',
    email: '',
    error: null,
    success: false,
  },
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.success = false;
      state.referralLink = '';
      state.referralCode = '';
      state.email = '';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle NEW joinWaitlistWithReferral
      .addCase(joinWaitlistWithReferral.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(joinWaitlistWithReferral.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.email = action.payload?.email || '';
        state.referralCode = action.payload?.referralCode || '';
        state.referralLink = action.payload?.referralLink || '';
      })
      .addCase(joinWaitlistWithReferral.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
        state.success = false;
      })
      // Handle joinWaitlist (old simplified flow - kept for compatibility)
      .addCase(joinWaitlist.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(joinWaitlist.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(joinWaitlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
        state.success = false;
      })
      // Handle inviteToWaitlist (old flow - for backward compatibility)
      .addCase(inviteToWaitlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(inviteToWaitlist.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.referralLink = action.payload?.referralLink || '';
      })
      .addCase(inviteToWaitlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      });
  },
});

export const { resetState } = referralSlice.actions;
export default referralSlice.reducer;
