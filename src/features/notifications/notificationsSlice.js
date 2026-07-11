import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [
    {
      id: 'n1',
      title: 'System Maintenance Scheduled',
      message: 'We will be performing a scheduled system maintenance on Sunday, June 28th, from 2:00 AM to 4:00 AM UTC. Some services might be temporarily unavailable.',
      type: 'ALERT',
      time: '2 hours ago',
      unread: true,
      date: '2026-06-24',
    },
    {
      id: 'n2',
      title: 'New AI Planner Feature Released!',
      message: 'We have launched a new Daily Planner module powered by AI. Check it out in your side menu to organize your day more productively.',
      type: 'FEATURE',
      time: '1 day ago',
      unread: true,
      date: '2026-06-23',
    },
    {
      id: 'n3',
      title: 'Welcome to Fellini164',
      message: 'Welcome to our platform! Please take a moment to complete your profile setup and review your dashboard settings.',
      type: 'INFO',
      time: '3 days ago',
      unread: false,
      date: '2026-06-21',
    },
    {
      id: 'n4',
      title: 'Updated Privacy Policy',
      message: 'We have updated our Privacy Policy to better serve you. Please review the updated terms on our policy page.',
      type: 'INFO',
      time: '4 days ago',
      unread: false,
      date: '2026-06-20',
    },
  ],
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    markNotificationAsRead: (state, action) => {
      const notification = state.notifications.find((n) => n.id === action.payload);
      if (notification) notification.unread = false;
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach((n) => {
        n.unread = false;
      });
    },
    deleteNotification: (state, action) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },
  },
});

export const { markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } =
  notificationsSlice.actions;

export const selectNotifications = (state) => state.notifications?.notifications || [];
export const selectUnreadNotificationCount = (state) =>
  (state.notifications?.notifications || []).filter((n) => n.unread).length;

export default notificationsSlice.reducer;
