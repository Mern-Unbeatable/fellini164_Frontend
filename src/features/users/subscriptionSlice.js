import { createSlice } from '@reduxjs/toolkit';
import { fetchSubscriptionStatus } from '../auth/authAPI';
// import { fetchSubscriptionStatus } from './paymentsThunks';

const initialState = {
  data: null,       
  loading: false,   
  error: null,      
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    clearSubscription: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ---------------- pending ----------------
      .addCase(fetchSubscriptionStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // ---------------- fulfilled ----------------
      .addCase(fetchSubscriptionStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      // ---------------- rejected ----------------
      .addCase(fetchSubscriptionStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSubscription } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
