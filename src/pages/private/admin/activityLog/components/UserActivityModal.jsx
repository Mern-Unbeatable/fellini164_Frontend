import React, { useEffect, useState, useRef } from 'react';
import {
  ArrowLeft,
  Activity,
  MessageSquare,
  Zap,
  Calendar,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  LogIn,
  LogOut,
  Edit,
  CheckCircle,
  RotateCcw,
  CheckSquare,
  Target,
  CreditCard,
  DollarSign,
  XCircle,
  Lightbulb,
  Settings,
  Lock,
  Mail,
} from 'lucide-react';
import { fetchUserActivityLogs } from '../../../../../features/aiChat/adminActivityLog/adminActivityLogAPI';
import { toast } from 'react-toastify';
import AllPagination from '../../../../../components/common/AllPagination';

const UserActivityPage = ({ userId, user, onBack }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalActivities, setTotalActivities] = useState(0);
  const [filterType, setFilterType] = useState('ALL');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);
  const [stats, setStats] = useState({
    totalActivities: 0,
    aiChats: 0,
    totalTokens: 0,
    plansCreated: 0,
  });

  useEffect(() => {
    if (userId) {
      setCurrentPage(1);
      setFilterType('ALL');
      fetchUserActivities(1, 'ALL');
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchUserActivities(currentPage, filterType);
    }
  }, [currentPage, filterType]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUserActivities = async (page = 1, type = 'ALL') => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 8,
        ...(type !== 'ALL' && { type }),
      };
      const response = await fetchUserActivityLogs(userId, params);
      
      const data = response.data || [];
      setActivities(data);
      setTotalActivities(response.pagination?.total || 0);
      setTotalPages(response.pagination?.totalPages || 1);

      const aiChats = data.filter((a) => a.type === 'AI_CHAT').length;
      const plansCreated = data.filter((a) => a.type === 'PLAN_CREATED').length;
      const totalTokens = data.reduce((sum, a) => sum + (a.metadata?.tokensUsed || 0), 0);

      setStats({
        totalActivities: response.pagination?.total || data.length,
        aiChats,
        totalTokens,
        plansCreated,
      });
    } catch (error) {
      toast.error('Failed to load user activities');
    } finally {
      setLoading(false);
    }
  };

  const formatDistanceToNow = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getActivityLabel = (type) => {
    const labels = {
      AI_CHAT: 'AI Chat',
      USER_LOGIN: 'Login',
      USER_LOGOUT: 'Logout',
      PLAN_CREATED: 'Plan Created',
      PLAN_UPDATED: 'Plan Updated',
      PLAN_COMPLETED: 'Plan Completed',
      HABIT_CREATED: 'Habit Created',
      HABIT_COMPLETED: 'Habit Completed',
      TASK_CREATED: 'Task Created',
      TASK_COMPLETED: 'Task Completed',
      GOAL_CREATED: 'Goal Created',
      GOAL_COMPLETED: 'Goal Completed',
      SUBSCRIPTION_STARTED: 'Subscription Started',
      SUBSCRIPTION_CANCELED: 'Subscription Canceled',
      SUBSCRIPTION_UPGRADED: 'Subscription Upgraded',
      SUBSCRIPTION_DOWNGRADED: 'Subscription Downgraded',
      PAYMENT_SUCCEEDED: 'Payment Success',
      PAYMENT_FAILED: 'Payment Failed',
      AI_RECOMMENDATION: 'AI Recommendation',
      SETTINGS_UPDATED: 'Settings Updated',
      PASSWORD_CHANGED: 'Password Changed',
      EMAIL_VERIFIED: 'Email Verified',
    };
    return labels[type] || type;
  };

  const activityTypes = [
    { value: 'ALL', label: 'All Activities' },
    { value: 'USER_LOGIN', label: 'User Login' },
    { value: 'USER_LOGOUT', label: 'User Logout' },
    { value: 'PLAN_CREATED', label: 'Plan Created' },
    { value: 'PLAN_UPDATED', label: 'Plan Updated' },
    { value: 'PLAN_COMPLETED', label: 'Plan Completed' },
    { value: 'HABIT_CREATED', label: 'Habit Created' },
    { value: 'HABIT_COMPLETED', label: 'Habit Completed' },
    { value: 'TASK_CREATED', label: 'Task Created' },
    { value: 'TASK_COMPLETED', label: 'Task Completed' },
    { value: 'GOAL_CREATED', label: 'Goal Created' },
    { value: 'GOAL_COMPLETED', label: 'Goal Completed' },
    { value: 'SUBSCRIPTION_STARTED', label: 'Subscription Started' },
    { value: 'SUBSCRIPTION_CANCELED', label: 'Subscription Canceled' },
    { value: 'SUBSCRIPTION_UPGRADED', label: 'Subscription Upgraded' },
    { value: 'SUBSCRIPTION_DOWNGRADED', label: 'Subscription Downgraded' },
    { value: 'PAYMENT_SUCCEEDED', label: 'Payment Succeeded' },
    { value: 'PAYMENT_FAILED', label: 'Payment Failed' },
    { value: 'AI_CHAT', label: 'AI Chat' },
    { value: 'AI_RECOMMENDATION', label: 'AI Recommendation' },
    { value: 'SETTINGS_UPDATED', label: 'Settings Updated' },
    { value: 'PASSWORD_CHANGED', label: 'Password Changed' },
    { value: 'EMAIL_VERIFIED', label: 'Email Verified' },
  ];

  const getActivityColors = (type) => {
    const colorMap = {
      AI_CHAT: {
        badge: 'bg-[#8022fe]/10 text-[#8022fe]',
        bg: 'bg-[#8022fe]/10',
        icon: 'text-[#8022fe]',
      },
      PLAN_CREATED: {
        badge: 'bg-[#10b981]/10 text-[#10b981]',
        bg: 'bg-[#10b981]/10',
        icon: 'text-[#10b981]',
      },
      PLAN_UPDATED: {
        badge: 'bg-[#10b981]/10 text-[#10b981]',
        bg: 'bg-[#10b981]/10',
        icon: 'text-[#10b981]',
      },
      PLAN_COMPLETED: {
        badge: 'bg-[#10b981]/10 text-[#10b981]',
        bg: 'bg-[#10b981]/10',
        icon: 'text-[#10b981]',
      },
      GOAL_CREATED: {
        badge: 'bg-[#3b82f6]/10 text-[#3b82f6]',
        bg: 'bg-[#3b82f6]/10',
        icon: 'text-[#3b82f6]',
      },
      GOAL_COMPLETED: {
        badge: 'bg-[#3b82f6]/10 text-[#3b82f6]',
        bg: 'bg-[#3b82f6]/10',
        icon: 'text-[#3b82f6]',
      },
      TASK_CREATED: {
        badge: 'bg-[#f59e0b]/10 text-[#f59e0b]',
        bg: 'bg-[#f59e0b]/10',
        icon: 'text-[#f59e0b]',
      },
      TASK_COMPLETED: {
        badge: 'bg-[#f59e0b]/10 text-[#f59e0b]',
        bg: 'bg-[#f59e0b]/10',
        icon: 'text-[#f59e0b]',
      },
      SUBSCRIPTION_STARTED: {
        badge: 'bg-[#6366f1]/10 text-[#6366f1]',
        bg: 'bg-[#6366f1]/10',
        icon: 'text-[#6366f1]',
      },
      PAYMENT_SUCCEEDED: {
        badge: 'bg-[#10b981]/10 text-[#10b981]',
        bg: 'bg-[#10b981]/10',
        icon: 'text-[#10b981]',
      },
      PAYMENT_FAILED: {
        badge: 'bg-[#ef4444]/10 text-[#ef4444]',
        bg: 'bg-[#ef4444]/10',
        icon: 'text-[#ef4444]',
      },
    };

    return (
      colorMap[type] || {
        badge: 'bg-[#6b7280]/10 text-[#6b7280]',
        bg: 'bg-[#6b7280]/10',
        icon: 'text-[#6b7280]',
      }
    );
  };

  const renderIcon = (type, colors) => {
    const iconClass = `h-4 w-4 ${colors.icon}`;

    if (!type) return <TrendingUp className={iconClass} />;

    if (type === 'USER_LOGIN') return <LogIn className={iconClass} />;
    if (type === 'USER_LOGOUT') return <LogOut className={iconClass} />;

    if (type === 'PLAN_CREATED') return <Calendar className={iconClass} />;
    if (type === 'PLAN_UPDATED') return <Edit className={iconClass} />;
    if (type === 'PLAN_COMPLETED') return <CheckCircle className={iconClass} />;

    if (type === 'HABIT_CREATED' || type === 'HABIT_COMPLETED') return <RotateCcw className={iconClass} />;

    if (type === 'TASK_CREATED' || type === 'TASK_COMPLETED') return <CheckSquare className={iconClass} />;

    if (type === 'GOAL_CREATED' || type === 'GOAL_COMPLETED') return <Target className={iconClass} />;

    if (type.startsWith('SUBSCRIPTION_')) return <CreditCard className={iconClass} />;

    if (type === 'PAYMENT_SUCCEEDED') return <DollarSign className={iconClass} />;
    if (type === 'PAYMENT_FAILED') return <XCircle className={iconClass} />;

    if (type === 'AI_CHAT') return <MessageSquare className={iconClass} />;
    if (type === 'AI_RECOMMENDATION') return <Lightbulb className={iconClass} />;

    if (type === 'SETTINGS_UPDATED') return <Settings className={iconClass} />;
    if (type === 'PASSWORD_CHANGED') return <Lock className={iconClass} />;
    if (type === 'EMAIL_VERIFIED') return <Mail className={iconClass} />;

    return <TrendingUp className={iconClass} />;
  };

  return (
    <div className="relative w-full py-7.5 max-lg:py-4 max-lg:sm:py-6">
      
      {/* Back button */}
      <button
        onClick={onBack}
        className="mb-4 flex w-fit items-center gap-1.5 text-[12px] font-semibold text-[#8022fe] hover:text-[#8022fe]/80 transition"
      >
        <ArrowLeft size={14} />
        <span>Back to All Users Activity Logs</span>
      </button>

      {/* Header */}
      <div className="mb-5 flex w-full items-start justify-between max-lg:mb-4 max-lg:flex-col max-lg:gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#8022fe] text-sm font-bold text-white">
            {user?.fullName?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="text-[20px] font-semibold text-[#181818] dark:text-white">
              {user?.fullName || 'User'} - Activity Logs
            </h2>
            <p className="text-[12px] font-medium text-[#c2c2c2] dark:text-gray-450">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-[#f2f2f2] bg-white p-5 dark:border-zinc-750 dark:bg-zinc-800">
          <div className="mb-3 inline-flex rounded-lg bg-[#8022fe]/10 p-2.5 dark:bg-[#8022fe]/20">
            <Activity size={16} className="text-[#8022fe]" />
          </div>
          <p className="text-[22px] font-bold text-[#181818] leading-tight dark:text-white">
            {stats.totalActivities}
          </p>
          <p className="text-[12px] font-medium text-[#c2c2c2] mt-1 dark:text-gray-400">Total Activities</p>
        </div>

        <div className="rounded-2xl border border-[#f2f2f2] bg-white p-5 dark:border-zinc-750 dark:bg-zinc-800">
          <div className="mb-3 inline-flex rounded-lg bg-[#3b82f6]/10 p-2.5 dark:bg-[#3b82f6]/20">
            <MessageSquare size={16} className="text-[#3b82f6]" />
          </div>
          <p className="text-[22px] font-bold text-[#181818] leading-tight dark:text-white">
            {stats.aiChats}
          </p>
          <p className="text-[12px] font-medium text-[#c2c2c2] mt-1 dark:text-gray-400">AI Chats</p>
        </div>

        <div className="rounded-2xl border border-[#f2f2f2] bg-white p-5 dark:border-zinc-750 dark:bg-zinc-800">
          <div className="mb-3 inline-flex rounded-lg bg-[#f59e0b]/10 p-2.5 dark:bg-[#f59e0b]/20">
            <Zap size={16} className="text-[#f59e0b]" />
          </div>
          <p className="text-[22px] font-bold text-[#181818] leading-tight dark:text-white">
            {stats.totalTokens.toLocaleString()}
          </p>
          <p className="text-[12px] font-medium text-[#c2c2c2] mt-1 dark:text-gray-400">Tokens Used</p>
        </div>

        <div className="rounded-2xl border border-[#f2f2f2] bg-white p-5 dark:border-zinc-750 dark:bg-zinc-800">
          <div className="mb-3 inline-flex rounded-lg bg-[#10b981]/10 p-2.5 dark:bg-[#10b981]/20">
            <Calendar size={16} className="text-[#10b981]" />
          </div>
          <p className="text-[22px] font-bold text-[#181818] leading-tight dark:text-white">
            {stats.plansCreated}
          </p>
          <p className="text-[12px] font-medium text-[#c2c2c2] mt-1 dark:text-gray-400">Plans Created</p>
        </div>
      </div>

      {/* Activities Table Card Container */}
      <div className="rounded-lg bg-white dark:bg-zinc-800 border border-[#f2f2f2] dark:border-zinc-700 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)] overflow-hidden">
        
        {/* Header/Filters inside the card */}
        <div className="flex flex-col gap-3 border-b border-[#f2f2f2] bg-white dark:border-zinc-700 dark:bg-zinc-800 px-6 py-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-[#8022fe]" />
            <span className="text-[12px] font-semibold text-[#181818] dark:text-white">
              Filters
            </span>
          </div>

          <div className="flex items-center gap-3 max-lg:flex-col max-lg:items-stretch">
            <span className="text-[12px] font-medium text-[#c2c2c2] dark:text-gray-400">
              Activity Type
            </span>
            <div className="relative" ref={filterRef}>
              <button
                type="button"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex w-48 items-center justify-between rounded-lg border border-[#f2f2f2] bg-white px-3 py-1.75 text-[12px] font-medium text-[#181818] transition dark:border-zinc-700 dark:bg-zinc-850 dark:text-white max-lg:w-full"
              >
                <span>{activityTypes.find((t) => t.value === filterType)?.label}</span>
                <ChevronDown
                  size={14}
                  className={`text-[#a3a3a3] transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isFilterOpen && (
                <div className="absolute right-0 top-8 z-50 max-h-60 w-48 overflow-y-auto rounded-lg border border-[#f2f2f2] bg-white shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)] dark:border-zinc-700 dark:bg-zinc-800 max-lg:left-0 max-lg:top-full max-lg:mt-1">
                  {activityTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => {
                        setFilterType(type.value);
                        setCurrentPage(1);
                        setIsFilterOpen(false);
                      }}
                      className={`flex w-full items-center px-3 py-2 text-left text-[12px] font-medium text-[#181818] dark:text-white transition hover:bg-[#f2f2f2] dark:hover:bg-zinc-700 ${
                        filterType === type.value
                          ? 'bg-[#8022fe]/5 text-[#8022fe] dark:bg-[#8022fe]/10 dark:text-[#8022fe]'
                          : ''
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table/Card View */}
        <div>
          {loading ? (
            <div className="space-y-2.5 p-4.5">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 animate-pulse rounded-xl bg-gray-50 border border-[#f2f2f2] dark:bg-zinc-800 dark:border-zinc-750"
                ></div>
              ))}
            </div>
          ) : activities.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-[12px] font-medium text-[#c2c2c2] dark:text-gray-400">No activities found for this user</p>
            </div>
          ) : (
            <>
              {/* Mobile Card List View (hidden on large screens) */}
              <div className="p-4 space-y-3 lg:hidden bg-[#fcfcfc] dark:bg-zinc-900">
                {activities.map((activity) => {
                  const colors = getActivityColors(activity.type);
                  return (
                    <div
                      key={activity.id || Math.random()}
                      className="rounded-xl border border-[#f2f2f2] bg-white p-4.5 transition hover:shadow-sm dark:border-zinc-700 dark:bg-zinc-850"
                    >
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`shrink-0 rounded-lg ${colors.bg} p-1.75`}>
                            {renderIcon(activity.type, colors)}
                          </div>
                          <span className={`rounded-full px-2.5 py-0.75 text-[10px] font-semibold tracking-wide ${colors.badge}`}>
                            {getActivityLabel(activity.type)}
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold text-[#c2c2c2] dark:text-gray-450 whitespace-nowrap">
                          {formatDistanceToNow(activity.createdAt)}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-[12px] font-medium text-[#5d5d5d] dark:text-gray-300 break-words">
                          {activity.description}
                        </p>
                        {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                          <div className="flex flex-wrap gap-2 text-[10px] font-semibold text-[#a3a3a3] pt-1">
                            {activity.metadata.tokensUsed && (
                              <span className="inline-flex items-center gap-1 rounded bg-[#fcfcfc] px-2 py-0.5 border border-[#f2f2f2] dark:bg-zinc-800 dark:border-zinc-700">
                                {activity.metadata.tokensUsed.toLocaleString()} tokens
                              </span>
                            )}
                            {activity.metadata.conversationId && (
                              <span className="inline-flex items-center gap-1 rounded bg-[#fcfcfc] px-2 py-0.5 border border-[#f2f2f2] dark:bg-zinc-800 dark:border-zinc-700">
                                ID: {activity.metadata.conversationId.slice(0, 8)}...
                              </span>
                            )}
                            {activity.metadata.planId && (
                              <span className="inline-flex items-center gap-1 rounded bg-[#fcfcfc] px-2 py-0.5 border border-[#f2f2f2] dark:bg-zinc-800 dark:border-zinc-700">
                                Plan: {activity.metadata.planId.slice(0, 8)}...
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop Table View (hidden on mobile/tablet) */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="min-w-full divide-y divide-[#f2f2f2] dark:divide-zinc-750">
                  <thead className="bg-[#fcfcfc] dark:bg-zinc-850">
                    <tr className="border-b border-[#f2f2f2] dark:border-zinc-700">
                      <th className="px-6 py-2.5 text-left text-[12px] font-semibold text-[#c2c2c2] uppercase tracking-wider dark:text-zinc-500">Activity</th>
                      <th className="px-6 py-2.5 text-left text-[12px] font-semibold text-[#c2c2c2] uppercase tracking-wider dark:text-zinc-500">Description</th>
                      <th className="px-6 py-2.5 text-left text-[12px] font-semibold text-[#c2c2c2] uppercase tracking-wider dark:text-zinc-500">Details / Tokens</th>
                      <th className="px-6 py-2.5 text-right text-[12px] font-semibold text-[#c2c2c2] uppercase tracking-wider dark:text-zinc-500">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f2f2f2] bg-white dark:divide-zinc-750 dark:bg-zinc-800">
                    {activities.map((activity) => {
                      const colors = getActivityColors(activity.type);
                      return (
                        <tr key={activity.id || Math.random()} className="transition hover:bg-[#fcfcfc] dark:hover:bg-zinc-700/50">
                          {/* Activity Type Badge & Icon */}
                          <td className="whitespace-nowrap px-6 py-2.5">
                            <div className="flex items-center gap-2.5">
                              <div className={`shrink-0 rounded-lg ${colors.bg} p-1.75`}>
                                {renderIcon(activity.type, colors)}
                              </div>
                              <span className={`rounded-full px-2.5 py-0.75 text-[10px] font-semibold tracking-wide ${colors.badge}`}>
                                {getActivityLabel(activity.type)}
                              </span>
                            </div>
                          </td>

                          {/* Description */}
                          <td className="px-6 py-2.5">
                            <p className="text-[12px] font-medium text-[#5d5d5d] dark:text-gray-300 max-w-md break-words">
                              {activity.description}
                            </p>
                          </td>

                          {/* Metadata Chips */}
                          <td className="px-6 py-2.5 whitespace-nowrap">
                            {activity.metadata && Object.keys(activity.metadata).length > 0 ? (
                              <div className="flex flex-wrap gap-2 text-[10px] font-semibold text-[#a3a3a3]">
                                {activity.metadata.tokensUsed && (
                                  <span className="inline-flex items-center gap-1 rounded bg-[#fcfcfc] px-2 py-0.5 border border-[#f2f2f2] dark:bg-zinc-850 dark:border-zinc-700">
                                    {activity.metadata.tokensUsed.toLocaleString()} tokens
                                  </span>
                                )}
                                {activity.metadata.conversationId && (
                                  <span className="inline-flex items-center gap-1 rounded bg-[#fcfcfc] px-2 py-0.5 border border-[#f2f2f2] dark:bg-zinc-850 dark:border-zinc-700">
                                    ID: {activity.metadata.conversationId.slice(0, 8)}...
                                  </span>
                                )}
                                {activity.metadata.planId && (
                                  <span className="inline-flex items-center gap-1 rounded bg-[#fcfcfc] px-2 py-0.5 border border-[#f2f2f2] dark:bg-zinc-850 dark:border-zinc-700">
                                    Plan: {activity.metadata.planId.slice(0, 8)}...
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-[11px] text-[#c2c2c2] font-medium">—</span>
                            )}
                          </td>

                          {/* Time */}
                          <td className="whitespace-nowrap px-6 py-2.5 text-right">
                            <span className="text-[10px] font-semibold text-[#c2c2c2] dark:text-gray-450">
                              {formatDistanceToNow(activity.createdAt)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Pagination Footer */}
        {!loading && activities.length > 0 && (
          <div className="border-t border-[#f2f2f2] bg-white px-4 py-3 dark:border-zinc-750 dark:bg-zinc-800">
            <AllPagination
              indexOfFirstItem={(currentPage - 1) * 8}
              indexOfLastItem={Math.min(currentPage * 8, totalActivities)}
              totalResults={totalActivities}
              handlePrevious={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              currentPage={currentPage}
              handleNext={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserActivityPage;
