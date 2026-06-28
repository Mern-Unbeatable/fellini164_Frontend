import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAdminActivityLogs } from './adminActivityLogAPI';
import { toast } from 'react-toastify';

// Async thunks
export const getAdminActivityLogs = createAsyncThunk(
  'adminActivityLog/getAdminActivityLogs',
  async ({ page = 1, limit = 10, type, userId }, { rejectWithValue }) => {
    try {
      const response = await fetchAdminActivityLogs({ page, limit, type, userId });
      return response;
    } catch (error) {
      toast.error('Failed to load activity logs');
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch activity logs');
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
    totalUsers: 0,
  },
  pagination: {
    total: 0,
    limit: 10,
    page: 1,
    totalPages: 1,
    hasMore: false,
  },
  filters: {
    type: 'ALL',
    userId: null,
  },
  loading: false,
  error: null,
};

const adminActivityLogSlice = createSlice({
  name: 'adminActivityLog',
  initialState,
  reducers: {
    setAdminActivityFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // Reset to first page when filter changes
    },
    clearAdminActivityFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.page = 1;
    },
    setAdminPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    resetAdminActivityLog: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Get Admin Activity Logs
      .addCase(getAdminActivityLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminActivityLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload.data || [];
        
        // Update pagination data from API response
        state.pagination.total = action.payload.pagination?.total || 0;
        state.pagination.limit = action.payload.pagination?.limit || 10;
        state.pagination.totalPages = action.payload.pagination?.totalPages || 1;
        state.pagination.hasMore = action.payload.pagination?.hasMore || false;
        
        // Flatten activities from grouped structure for stats calculation
        const groupedData = action.payload.data || [];
        const allActivities = groupedData.flatMap(userGroup => 
          userGroup.activityLogs || []
        );
        
        // Calculate stats from flattened activities
        const aiChats = allActivities.filter((a) => a.type === 'AI_CHAT').length;
        const plansCreated = allActivities.filter((a) => a.type === 'PLAN_CREATED').length;
        const totalTokens = allActivities.reduce((sum, a) => sum + (a.metadata?.tokensUsed || 0), 0);
        const uniqueUsers = groupedData.length; // Each group represents a unique user
        
        state.stats = {
          totalActivities: action.payload.pagination?.total || 0,
          aiChats,
          totalTokens,
          plansCreated,
          totalUsers: uniqueUsers,
        };
      })
      .addCase(getAdminActivityLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setAdminActivityFilter,
  clearAdminActivityFilters,
  setAdminPage,
  resetAdminActivityLog,
} = adminActivityLogSlice.actions;

// Selectors
export const selectAdminActivities = (state) => state.adminActivityLog.activities;
export const selectAdminActivityStats = (state) => state.adminActivityLog.stats;
export const selectAdminActivityPagination = (state) => state.adminActivityLog.pagination;
export const selectAdminActivityFilters = (state) => state.adminActivityLog.filters;
export const selectAdminActivityLoading = (state) => state.adminActivityLog.loading;

export default adminActivityLogSlice.reducer;
