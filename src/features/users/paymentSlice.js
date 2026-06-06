import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { POST } from '../../services/httpMethods';

// Async action
export const createCheckout = createAsyncThunk(
  'payments/createCheckout',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await POST('/api/v1/payments/create-checkout', payload);
      if (response.success) return response.data;
      else return rejectWithValue(response.message || 'Checkout failed');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Checkout error');
    }
  }
);

const initialState = {
  checkoutData: null,
  loading: false,
  error: null,
};

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    clearCheckout: (state) => {
      state.checkoutData = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCheckout.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.checkoutData = action.payload;
      })
      .addCase(createCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCheckout } = paymentSlice.actions;

// Selectors
export const selectCheckoutData = (state) => state.payments.checkoutData;
export const selectPaymentLoading = (state) => state.payments.loading;
export const selectPaymentError = (state) => state.payments.error;

export default paymentSlice.reducer;
