import { createSlice } from '@reduxjs/toolkit';
import { getReferralStats } from './userAPI';

const initialState = {
  referral: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getReferralStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReferralStats.fulfilled, (state, action) => {
        state.loading = false;
        state.referral = action.payload;
      })
      .addCase(getReferralStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load referral data';
      });
  },
});

export const selectReferral = (state) => state.user.referral;

export default userSlice.reducer;
