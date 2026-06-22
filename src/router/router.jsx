import React from 'react';
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import PublicLayout from '../components/layout/public/PublicLayout';
import AdminLayout from '../components/layout/admin/AdminLayout';
import PrivateLayout from '../components/layout/private/PrivateLayout';
import AuthLayout from '../components/layout/auth/AuthLayout';
import ProtectedRoute from './ProtectedRoute';
import HomeView from '../pages/public/prublic_home/HomeView';
import NotFoundView from '../pages/error/NotFoundView';
import ServicesView from '../pages/public/public_services/ServicesView';
import ContactView from '../pages/public/prublic_contact/ContactView';
import PricingView from '../pages/public/prublic_pricing/PricingView';
import FAQView from '../pages/public/prublic_faq/FAQView';
import LoginView from '../pages/auth/LoginView';
import RegisterView from '../pages/auth/RegisterView';
import OTPVerifyView from '../pages/auth/OTPVerifyView';
import OnboardingFlowView from '../pages/auth/OnboardingFlowView';
import UserDashView from '../pages/private/user/UserDashView';
import AdminDashView from '../pages/private/admin/AdminDashView';
import Subscription from '../pages/private/user/account/Subscription';
import ReferFriend from '../pages/private/user/account/ReferFriend';
import Profile from '../pages/private/user/account/Profile';
import Settings from '../pages/private/user/account/Settings';
import AiChat from '../pages/private/user/growth/AiChat';
import Analytics from '../pages/private/user/growth/Analytics';
import UserManagement from '../pages/private/admin/management/UserManagement';
import UserDetail from '../pages/private/admin/management/userManagementComponents/UserDetails';
import DailyPlanner from '../pages/private/user/planng/DailyPlan/DailyPlanner';
import WeeklyPlanner from '../pages/private/user/planng/WeeklyPlan/WeeklyPlanner';
import MonthlyPlanner from '../pages/private/user/planng/MonthlyPlan/MonthlyPlanner';
import TasksBoard from '../pages/private/user/focus/Tasks/TasksBoard';
import Habits from '../pages/private/user/focus/Habits/Habits';
import ActiveGoals from '../pages/private/user/focus/Goals/ActiveGoals';
import GoalDetailPage from '../pages/private/user/focus/Goals/GoalDetailPage';
import SystemControls from '../pages/private/admin/system/SystemControls';
import TransactionTable from '../pages/private/admin/operation/TransactionTable';
import WaitingList from '../pages/private/admin/management/WaitingList';
import CMSAnnouncements from '../pages/private/admin/operation/CMSAnnouncements';
import FinanceAndSubscriptions from '../pages/private/admin/management/FinanceAndSubscriptions';
import EarlyAccessView from '../pages/public/public_waitlist/EarlyAccessView';

import ResetPassword from '../pages/auth/ResetPassword';
import ForgotPassword from '../pages/auth/ForgotPassword';

import ForgotPasswordVerifyOTP from '../pages/auth/ForgotPasswordVerifyOTP';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomeView />} />
        <Route path="/how-it-works" element={<HomeView />} />
        <Route path="/pricing" element={<PricingView />} />
        <Route path="/faq" element={<FAQView />} />
        <Route path="/contact" element={<ContactView />} />
        <Route path="/services" element={<ServicesView />} />
        <Route path="/early-access" element={<EarlyAccessView />} />
      </Route>

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginView />} />

        <Route path="forgot-Password" element={<ForgotPassword />} />
        <Route path="reset-Password" element={<ResetPassword />} />
        <Route path="forgot-Password-verifyotp" element={<ForgotPasswordVerifyOTP />} />

        <Route path="/signup" element={<RegisterView />} />
        <Route path="/verify-otp" element={<OTPVerifyView />} />
        <Route path="/onboarding-setup" element={<OnboardingFlowView />} />
      </Route>

      {/* User Dashboard (Protected) */}
      <Route
        element={
          <ProtectedRoute requiredRole="user">
            <PrivateLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<UserDashView />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/user/ai-coach" element={<AiChat />} />
        <Route path="/user/analytics" element={<Analytics />} />
        <Route path="/user/profile" element={<Profile />} />
        <Route path="/user/subscription" element={<Subscription />} />
        <Route path="/user/refer" element={<ReferFriend />} />
        <Route path="/user/daily-plan" element={<DailyPlanner />} />
        <Route path="/user/weekly-plan" element={<WeeklyPlanner />} />
        <Route path="/user/monthly-plan" element={<MonthlyPlanner />} />
        <Route path="/user/tasks" element={<TasksBoard />} />
        <Route path="/user/habits" element={<Habits />} />
        <Route path="/user/goals" element={<ActiveGoals />} />
        <Route path="/user/goals/:goalId" element={<GoalDetailPage />} />
      </Route>

      {/* Admin Dashboard (Protected) */}
      <Route
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashView />} />
        <Route path="/admin/waiting-list" element={<WaitingList />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/users/:id" element={<UserDetail />} />
        <Route path="/admin/finance" element={<FinanceAndSubscriptions />} />
        <Route path="/admin/content" element={<CMSAnnouncements />} />
        <Route path="/admin/support" element={<TransactionTable />} />
        <Route path="/admin/settings" element={<SystemControls />} />
      </Route>
      {/* 404 Not Found */}
      <Route path="*" element={<NotFoundView />} />
    </>
  )
);

export default router;
