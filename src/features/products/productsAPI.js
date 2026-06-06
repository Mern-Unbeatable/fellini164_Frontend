// ============================================
// BACKEND DISABLED - UNCOMMENT WHEN BACKEND IS READY
// ============================================

import { createAsyncThunk } from '@reduxjs/toolkit';
import { DELETE, GET } from '../../services/httpMethods';
import { ROUTES_CONFIG } from '../../services/httpEndpoint';
import { handleApiError } from '../../utils/errorHandler';

// COMMENTED OUT - Uncomment when backend is ready
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      // Returning mock data for now - Replace with actual API call
      return { products: [], message: 'Backend not connected' };

      // Uncomment below when backend is ready:
      // const response = await GET(ROUTES_CONFIG.public.PRODUCTS);
      // return response;
    // eslint-disable-next-line no-unreachable
    } catch (err) {
      return rejectWithValue(handleApiError(err));
    }
  }
);

export const deleteProducts = createAsyncThunk(
  'products/deleteProducts',
  async (_, { rejectWithValue }) => {
    try {
      // Returning mock response - Replace with actual API call
      return { success: false, message: 'Backend not connected' };

      // Uncomment below when backend is ready:
      // const response = await DELETE(ROUTES_CONFIG.public.PRODUCTS);
      // return response;
    // eslint-disable-next-line no-unreachable
    } catch (err) {
      return rejectWithValue(handleApiError(err));
    }
  }
);
