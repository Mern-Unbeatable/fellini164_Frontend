import React, { useEffect, useState, useRef } from 'react';
import { X, Activity, MessageSquare, Zap, Calendar, Filter, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchUserActivityLogs } from '../../../../../features/aiChat/adminActivityLog/adminActivityLogAPI';
import { toast } from 'react-toastify';

const UserActivityModal = ({ isOpen, onClose, userId, user }) => {
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
    if (isOpen && userId) {
      setCurrentPage(1);
      setFilterType('ALL');
      fetchUserActivities(1, 'ALL');
    }
  }, [isOpen, userId]);

  useEffect(() => {
    if (isOpen && userId) {
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
        limit: 10,
        ...(type !== 'ALL' && { type }),
      };
      const response = await fetchUserActivityLogs(userId, params);
      
      // Handle new API response structure
      const data = response.data || [];
      const userInfo = response.user || user;
      
      setActivities(data);
      setTotalActivities(response.pagination?.total || 0);
      setTotalPages(response.pagination?.totalPages || 1);

      // Calculate stats from current data
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
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
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
      AI_CHAT: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      PLAN_CREATED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      GOAL_CREATED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      TASK_CREATED: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
    };
    return colorMap[type] || 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-zinc-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-purple-600 to-purple-500 p-6 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl font-bold text-purple-600">
              {user?.fullName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{user?.fullName || 'User'} - Activity Logs</h2>
              <p className="text-sm text-purple-100">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-white transition hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-6 dark:bg-zinc-900 lg:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-zinc-800">
            <div className="mb-2 inline-flex rounded-lg bg-purple-100 p-2 dark:bg-purple-900/20">
              <Activity className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalActivities}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Total Activities</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-zinc-800">
            <div className="mb-2 inline-flex rounded-lg bg-blue-100 p-2 dark:bg-blue-900/20">
              <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.aiChats}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">AI Chats</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-zinc-800">
            <div className="mb-2 inline-flex rounded-lg bg-orange-100 p-2 dark:bg-orange-900/20">
              <Zap className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.totalTokens.toLocaleString()}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Tokens Used</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-zinc-800">
            <div className="mb-2 inline-flex rounded-lg bg-green-100 p-2 dark:bg-green-900/20">
              <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.plansCreated}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Plans Created</p>
          </div>
        </div>

        {/* Filter Section */}
        <div className="border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-zinc-900">
          <div className="flex items-center gap-3">
            <Filter className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Activity Type:
            </label>
            <div className="relative flex-1 sm:w-64" ref={filterRef}>
              <button
                type="button"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-600 dark:bg-zinc-700 dark:text-white"
              >
                <span>{activityTypes.find((t) => t.value === filterType)?.label}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>

              {isFilterOpen && (
                <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-300 bg-white shadow-lg dark:border-gray-600 dark:bg-zinc-700">
                  {activityTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => {
                        setFilterType(type.value);
                        setCurrentPage(1);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-sm transition hover:bg-gray-100 dark:hover:bg-zinc-600 ${
                        filterType === type.value
                          ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                          : 'text-gray-900 dark:text-white'
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

        {/* Activities List */}
        <div className="max-h-96 overflow-y-auto p-6">
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-20 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-700"
                ></div>
              ))}
            </div>
          ) : activities.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">No activities found for this user</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="rounded-lg border border-gray-200 bg-white p-4 transition hover:shadow-md dark:border-gray-700 dark:bg-zinc-800"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="mb-1 text-sm font-medium text-gray-900 dark:text-white">
                        {activity.description}
                      </p>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-600 dark:text-gray-400">
                        {activity.metadata?.tokensUsed && (
                          <span className="inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-1 dark:bg-zinc-700">
                            ⚡ {activity.metadata.tokensUsed.toLocaleString()} tokens
                          </span>
                        )}
                        {activity.metadata?.conversationId && (
                          <span className="inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-1 dark:bg-zinc-700">
                            💬 ID: {activity.metadata.conversationId.slice(0, 8)}...
                          </span>
                        )}
                        {activity.metadata?.planId && (
                          <span className="inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-1 dark:bg-zinc-700">
                            📋 Plan: {activity.metadata.planId.slice(0, 8)}...
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getActivityColors(activity.type)}`}
                      >
                        {getActivityLabel(activity.type)}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDistanceToNow(activity.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && activities.length > 0 && (
          <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-zinc-900">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing page {currentPage} of {totalPages} ({totalActivities} total activities)
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white dark:border-gray-600 dark:bg-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-600 dark:disabled:hover:bg-zinc-700"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>

                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`h-9 w-9 rounded-lg border text-sm font-medium transition ${
                            currentPage === pageNum
                              ? 'border-purple-600 bg-purple-600 text-white dark:border-purple-500 dark:bg-purple-500'
                              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:bg-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-600'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                      return (
                        <span key={pageNum} className="flex h-9 w-9 items-center justify-center text-gray-500">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white dark:border-gray-600 dark:bg-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-600 dark:disabled:hover:bg-zinc-700"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-zinc-900">
          <button
            onClick={onClose}
            className="w-full rounded-lg bg-gray-200 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserActivityModal;
