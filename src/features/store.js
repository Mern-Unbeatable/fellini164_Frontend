import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../features/products/productsSlice';
import authReducer from '../features/auth/authSlice';
import usersReducer from '../features/users/usersSlice';
import userReducer from '../features/user/userSlice';
import paymentReducer from '../features/users/paymentSlice';
import subscriptionReducer from '../features/users/subscriptionSlice';
import profileReducer from '../features/auth/profileSlice';
import referralReducer from './users/referralSlice';
import themeReducer from '../features/theme/themeSlice';
import aiChatReducer from './aiChat/aiChatSlice';
import adminActivityLogReducer from './aiChat/adminActivityLog/adminActivityLogSlice';
import notificationsReducer from './notifications/notificationsSlice';
import goalsReducer from './goals/goalsSlice';

const store = configureStore({
  reducer: {
    products: productsReducer,
    auth: authReducer,
    users: usersReducer,
    user: userReducer,
    payments: paymentReducer,
    subscription: subscriptionReducer,
    profile: profileReducer,
    referral: referralReducer,
    theme: themeReducer,
    aiChat: aiChatReducer,
    adminActivityLog: adminActivityLogReducer,
    notifications: notificationsReducer,
    goals: goalsReducer,
  },
});

export default store;
