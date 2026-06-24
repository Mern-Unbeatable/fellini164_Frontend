import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchActivityLogs, fetchActivityStats } from './activityLogAPI';
import { toast } from 'react-toastify';

// Async thunks
export const getActivityLogs = createAsyncThunk(
  'activityLog/getActivityLogs',
  async ({ page = 1, limit = 10, type, startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await fetchActivityLogs({ page, limit, type, startDate, endDate });
      return response;
    } catch (error) {
      toast.error('Failed to load activity logs');
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch activity logs');
    }
  }
);

export const getActivityStats = createAsyncThunk(
  'activityLog/getActivityStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchActivityStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
    }
  }
);

const initialState = {
  activities: [],
  stats: {
    totalActivities: 0,
    aiChats: 0,
    totalTokens: 0,
    plansCreated: 0,
  },
  pagination: {
    total: 0,
    limit: 10,
    offset: 0,
    hasMore: false,
    currentPage: 1,
  },
  filters: {
    type: 'ALL',
    startDate: null,
    endDate: null,
  },
  loading: false,
  statsLoading: false,
  error: null,
};

const activityLogSlice = createSlice({
  name: 'activityLog',
  initialState,
  reducers: {
    setActivityFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.currentPage = 1; // Reset to first page when filter changes
    },
    clearActivityFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.currentPage = 1; // Reset to first page when filters are cleared
    },
    setPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    resetActivityLog: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Get Activity Logs
      .addCase(getActivityLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getActivityLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload.data || [];
        // Update pagination data from API response, keeping currentPage from state
        state.pagination.total = action.payload.pagination?.total || 0;
        state.pagination.limit = action.payload.pagination?.limit || 10;
        state.pagination.offset = action.payload.pagination?.offset || 0;
        state.pagination.hasMore = action.payload.pagination?.hasMore || false;
        // Don't recalculate currentPage from offset - keep the one we set
      })
      .addCase(getActivityLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Activity Stats
      .addCase(getActivityStats.pending, (state) => {
        state.statsLoading = true;
      })
      .addCase(getActivityStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload || initialState.stats;
      })
      .addCase(getActivityStats.rejected, (state) => {
        state.statsLoading = false;
      });
  },
});

export const { setActivityFilter, clearActivityFilters, setPage, resetActivityLog } = activityLogSlice.actions;

// Selectors
export const selectActivities = (state) => state.activityLog?.activities || [];
export const selectActivityStats = (state) => state.activityLog?.stats || { totalActivities: 0, aiChats: 0, totalTokens: 0, plansCreated: 0 };
export const selectActivityPagination = (state) => state.activityLog?.pagination || { total: 0, limit: 10, currentPage: 1, offset: 0 };
export const selectActivityFilters = (state) => state.activityLog?.filters || { type: 'ALL', startDate: '', endDate: '' };
export const selectActivityLoading = (state) => state.activityLog?.loading || false;
export const selectStatsLoading = (state) => state.activityLog?.statsLoading || false;

export default activityLogSlice.reducer;
