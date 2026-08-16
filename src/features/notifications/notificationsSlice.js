import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import {
  deleteNotificationApi,
  fetchNotificationsApi,
  markAllNotificationsReadApi,
  markNotificationReadApi,
} from './notificationsAPI';
import { parseNotificationsResponse } from './notificationsMappers';

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchNotificationsApi();
      return parseNotificationsResponse(response);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to load notifications');
      return rejectWithValue(error?.response?.data?.message || 'Failed to load notifications');
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'notifications/markNotificationAsRead',
  async (id, { rejectWithValue }) => {
    try {
      const response = await markNotificationReadApi(id);
      toast.success(response?.message || 'Marked as read');
      return id;
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to mark notification as read');
      return rejectWithValue(error?.response?.data?.message || 'Failed to mark notification as read');
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  'notifications/markAllNotificationsAsRead',
  async (_, { rejectWithValue }) => {
    try {
      const response = await markAllNotificationsReadApi();
      toast.success(response?.message || 'All notifications marked as read');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to mark all notifications as read');
      return rejectWithValue(error?.response?.data?.message || 'Failed to mark all notifications as read');
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteNotificationApi(id);
      toast.success(response?.message || 'Notification deleted');
      return id;
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to delete notification');
      return rejectWithValue(error?.response?.data?.message || 'Failed to delete notification');
    }
  }
);

const initialState = {
  notifications: [],
  total: 0,
  count: 0,
  loading: false,
  error: null,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.notifications;
        state.total = action.payload.total;
        state.count = action.payload.count;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load notifications';
        state.notifications = [];
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find((n) => n.id === action.payload);
        if (notification) {
          notification.unread = false;
          notification.readAt = new Date().toISOString();
        }
      })
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications.forEach((n) => {
          n.unread = false;
          n.readAt = n.readAt || new Date().toISOString();
        });
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter((n) => n.id !== action.payload);
        state.total = Math.max(0, state.total - 1);
        state.count = Math.max(0, state.count - 1);
      });
  },
});

export const selectNotifications = (state) => state.notifications?.notifications || [];
export const selectNotificationsLoading = (state) => state.notifications?.loading || false;
export const selectUnreadNotificationCount = (state) =>
  (state.notifications?.notifications || []).filter((n) => n.unread).length;

export default notificationsSlice.reducer;
