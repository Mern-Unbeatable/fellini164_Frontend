import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { fetchActivityLogs, fetchActivityStats } from './activityLogAPI';
import { parseActivityLogsResponse } from './activityLogMappers';
import { toast } from 'react-toastify';

const EMPTY_ACTIVITIES = [];
const DEFAULT_STATS = {
  totalActivities: 0,
  aiChats: 0,
  totalTokens: 0,
  plansCreated: 0,
};
const DEFAULT_PAGINATION = {
  total: 0,
  limit: 8,
  offset: 0,
  page: 1,
  totalPages: 1,
  hasMore: false,
  currentPage: 1,
};
const DEFAULT_FILTERS = {
  type: 'ALL',
  startDate: null,
  endDate: null,
};

export const getActivityLogs = createAsyncThunk(
  'activityLog/getActivityLogs',
  async ({ type, startDate, endDate } = {}, { rejectWithValue }) => {
    try {
      const response = await fetchActivityLogs({ type, startDate, endDate });
      return parseActivityLogsResponse(response);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || 'Failed to load activity logs');
      return rejectWithValue(error?.response?.data?.message || error.message || 'Failed to fetch activity logs');
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
    limit: 8,
    offset: 0,
    page: 1,
    totalPages: 1,
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
      const page = Number(action.payload);
      if (!Number.isFinite(page) || page < 1) return;
      state.pagination.currentPage = page;
      state.pagination.offset = (page - 1) * state.pagination.limit;
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
        state.activities = action.payload.activities;
        state.pagination.total = action.payload.total;
        state.pagination.totalPages = Math.max(
          1,
          Math.ceil(action.payload.total / state.pagination.limit)
        );
        state.pagination.offset = (state.pagination.currentPage - 1) * state.pagination.limit;
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

const selectActivityLogState = (state) => state.activityLog;

export const selectActivities = createSelector(
  [selectActivityLogState],
  (activityLog) => activityLog?.activities ?? EMPTY_ACTIVITIES
);

export const selectActivityStats = createSelector(
  [selectActivityLogState],
  (activityLog) => activityLog?.stats ?? DEFAULT_STATS
);

export const selectActivityPagination = createSelector(
  [selectActivityLogState],
  (activityLog) => activityLog?.pagination ?? DEFAULT_PAGINATION
);

export const selectActivityFilters = createSelector(
  [selectActivityLogState],
  (activityLog) => activityLog?.filters ?? DEFAULT_FILTERS
);

export const selectActivityLoading = createSelector(
  [selectActivityLogState],
  (activityLog) => activityLog?.loading ?? false
);

export const selectStatsLoading = createSelector(
  [selectActivityLogState],
  (activityLog) => activityLog?.statsLoading ?? false
);

export default activityLogSlice.reducer;