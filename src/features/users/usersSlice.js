import { createSlice } from '@reduxjs/toolkit';
import { fetchUsers, fetchAdminUsers, fetchWaitlistUsers } from './usersApi';

// thunks moved to UsersApi.js

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    list: [],
    loading: false,
    error: null,
    adminList: [],
    waitlistList: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      total: 0,
    },
    adminPagination: {
      currentPage: 1,
      totalPages: 1,
      total: 0,
    },
    waitlistPagination: {
      currentPage: 1,
      totalPages: 1,
      total: 0,
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.users || [];
        state.pagination.currentPage = action.payload.page || 1;
        state.pagination.totalPages = action.payload.totalPages || 1;
        state.pagination.total = action.payload.total || state.list.length;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || 'Failed to load users';
      });

    builder
      .addCase(fetchAdminUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.adminList = action.payload.adminUsers || [];
        state.adminPagination.currentPage = action.payload.page || 1;
        state.adminPagination.totalPages = action.payload.totalPages || 1;
        state.adminPagination.total = action.payload.total || state.adminList.length;
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || 'Failed to load admin users';
      });

    builder
      .addCase(fetchWaitlistUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWaitlistUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.waitlistList = action.payload.waitlistUsers || [];
        state.waitlistPagination.currentPage = action.payload.page || 1;
        state.waitlistPagination.totalPages = action.payload.totalPages || 1;
        state.waitlistPagination.total = action.payload.total || state.waitlistList.length;
      })
      .addCase(fetchWaitlistUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || 'Failed to load waitlist users';
      });
  },
});

export default usersSlice.reducer;
