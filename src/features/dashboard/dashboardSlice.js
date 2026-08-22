import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { fetchDashboardApi } from './dashboardAPI';
import { parseDashboardResponse } from './dashboardMappers';

const EMPTY_LIST = [];
const DEFAULT_GREETING = { text: '', subtitle: '', firstName: '' };
const DEFAULT_PROGRESS = { percent: 0, completed: 0, total: 0, label: '' };
const DEFAULT_STATS = {
  tasksValue: '0/0',
  tasksSubtitle: '0% completed',
  focusValue: '0m',
  focusSubtitle: 'Today',
  habitValue: '0%',
  habitSubtitle: 'Start today',
  goalValue: '0%',
  goalSubtitle: 'No active goals',
};
const DEFAULT_WEEKLY = { weekLabel: '', weekTotal: '0m', days: EMPTY_LIST };
const DEFAULT_HABITS_META = { shownOf: 0, todayPercent: 0, completedToday: 0 };
const DEFAULT_SCHEDULE_META = { plannedLabel: '0m planned', doneCount: 0 };
const DEFAULT_GOALS = { activeGoals: 0, percent: 0, label: 'No active goals' };
const DEFAULT_FOCUS = { minutes: 0, loggedLabel: '0m logged', footer: 'nothing logged yet' };

export const fetchDashboard = createAsyncThunk(
  'dashboard/fetchDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchDashboardApi();
      if (response?.success === false) {
        return rejectWithValue(response.message || 'Failed to load dashboard');
      }
      return parseDashboardResponse(response);
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || 'Failed to load dashboard';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    resetDashboard: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetDashboard } = dashboardSlice.actions;

const selectDashboardState = (state) => state.dashboard;

export const selectDashboardData = createSelector(
  [selectDashboardState],
  (dashboard) => dashboard?.data ?? null
);

export const selectDashboardLoading = createSelector(
  [selectDashboardState],
  (dashboard) => dashboard?.loading ?? false
);

export const selectDashboardGreeting = createSelector(
  [selectDashboardData],
  (data) => data?.greeting ?? DEFAULT_GREETING
);

export const selectDashboardProgress = createSelector(
  [selectDashboardData],
  (data) => data?.dailyProgress ?? DEFAULT_PROGRESS
);

export const selectDashboardStats = createSelector(
  [selectDashboardData],
  (data) => data?.stats ?? DEFAULT_STATS
);

export const selectDashboardSchedule = createSelector(
  [selectDashboardData],
  (data) => data?.todaySchedule ?? EMPTY_LIST
);

export const selectDashboardScheduleMeta = createSelector(
  [selectDashboardData],
  (data) => data?.scheduleMeta ?? DEFAULT_SCHEDULE_META
);

export const selectDashboardWeeklyFocus = createSelector(
  [selectDashboardData],
  (data) => data?.weeklyFocus ?? DEFAULT_WEEKLY
);

export const selectDashboardHabits = createSelector(
  [selectDashboardData],
  (data) => data?.habits ?? EMPTY_LIST
);

export const selectDashboardHabitsMeta = createSelector(
  [selectDashboardData],
  (data) => data?.habitsMeta ?? DEFAULT_HABITS_META
);

export const selectDashboardInsights = createSelector(
  [selectDashboardData],
  (data) => data?.insights ?? EMPTY_LIST
);

export const selectDashboardGoals = createSelector(
  [selectDashboardData],
  (data) => data?.goals ?? DEFAULT_GOALS
);

export const selectDashboardFocusTime = createSelector(
  [selectDashboardData],
  (data) => data?.focusTimeToday ?? DEFAULT_FOCUS
);

export default dashboardSlice.reducer;
