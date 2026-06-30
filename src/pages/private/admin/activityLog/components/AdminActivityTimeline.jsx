import React from 'react';
import {
  ChevronRight,
  MessageSquare,
  Calendar,
  Target,
  RotateCcw,
  CheckSquare,
  CreditCard,
  DollarSign,
  XCircle,
  Lightbulb,
  Settings,
  Lock,
  Mail,
  LogIn,
  LogOut,
  Edit,
  CheckCircle,
  TrendingUp,
} from 'lucide-react';

const AdminActivityTimeline = ({ activities, loading, onViewUserDetails }) => {
  // Date helper functions
  const isToday = (date) => {
    const today = new Date();
    const activityDate = new Date(date);
    return (
      activityDate.getDate() === today.getDate() &&
      activityDate.getMonth() === today.getMonth() &&
      activityDate.getFullYear() === today.getFullYear()
    );
  };

  const isYesterday = (date) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const activityDate = new Date(date);
    return (
      activityDate.getDate() === yesterday.getDate() &&
      activityDate.getMonth() === yesterday.getMonth() &&
      activityDate.getFullYear() === yesterday.getFullYear()
    );
  };

  const isThisWeek = (date) => {
    const today = new Date();
    const activityDate = new Date(date);
    const daysDiff = Math.floor((today - activityDate) / (1000 * 60 * 60 * 24));
    return daysDiff < 7 && daysDiff >= 0;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDayName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const getDateLabel = (dateString) => {
    if (isToday(dateString)) return 'Today';
    if (isYesterday(dateString)) return 'Yesterday';
    if (isThisWeek(dateString)) return getDayName(dateString);
    return formatDate(dateString);
  };

  // Flatten activities from the new API structure
  const flattenedActivities = activities.flatMap(userGroup => 
    userGroup.activityLogs.map(activity => ({
      ...activity,
      user: userGroup.user
    }))
  );

  // Sort activities by date (newest first)
  const sortedActivities = flattenedActivities.sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Group activities by date
  const groupedActivities = sortedActivities.reduce((groups, activity) => {
    const date = new Date(activity.createdAt).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
    return groups;
  }, {});

  // Sort dates (newest first) and group by user within each date
  const sortedGroupedActivities = Object.entries(groupedActivities)
    .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
    .reduce((acc, [date, activities]) => {
      // Sort activities within each date group (newest first)
      const sortedActivities = activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      // Group by user within this date
      const userGroups = sortedActivities.reduce((userAcc, activity) => {
        const userId = activity.user?.id || 'unknown';
        if (!userAcc[userId]) {
          userAcc[userId] = {
            user: activity.user,
            activities: []
          };
        }
        userAcc[userId].activities.push(activity);
        return userAcc;
      }, {});
      
      acc[date] = Object.values(userGroups);
      return acc;
    }, {});

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-zinc-800"
          >
            <div className="mb-4 h-6 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="space-y-4">
              {[...Array(2)].map((_, j) => (
                <div key={j} className="h-20 rounded-lg bg-gray-100 dark:bg-gray-700"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="rounded-2xl border border-[#f2f2f2] bg-white p-12 text-center dark:border-zinc-700 dark:bg-zinc-800">
        <p className="text-[12px] font-medium text-[#c2c2c2] dark:text-gray-400">No activities to display</p>
      </div>
    );
  }

  if (flattenedActivities.length === 0) {
    return (
      <div className="rounded-2xl border border-[#f2f2f2] bg-white p-12 text-center dark:border-zinc-700 dark:bg-zinc-800">
        <p className="text-[12px] font-medium text-[#c2c2c2] dark:text-gray-400">No activities found matching active filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {Object.entries(sortedGroupedActivities).map(([date, userGroups]) => {
        const totalActivities = userGroups.reduce((sum, group) => sum + group.activities.length, 0);
        
        return (
          <div
            key={date}
            className="rounded-2xl border border-[#f2f2f2] bg-white p-4.5 dark:border-zinc-700 dark:bg-zinc-800"
          >
            <div className="mb-4 flex items-center justify-between border-b border-[#f2f2f2] pb-3 dark:border-zinc-700">
              <h3 className="text-[14px] font-semibold text-[#181818] dark:text-white">
                {getDateLabel(userGroups[0].activities[0].createdAt)}
              </h3>
              <span className="text-[12px] font-medium text-[#c2c2c2] dark:text-gray-400">
                {totalActivities} {totalActivities === 1 ? 'activity' : 'activities'}
              </span>
            </div>

            <div className="space-y-4">
              {userGroups.map((userGroup) => (
                <AdminUserActivityGroup
                  key={userGroup.user?.id || Math.random()}
                  user={userGroup.user}
                  activities={userGroup.activities}
                  onViewUserDetails={onViewUserDetails}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Admin User Activity Group Component - Shows all activities for a user
const AdminUserActivityGroup = ({ user, activities, onViewUserDetails }) => {
  return (
    <div className="rounded-xl border border-[#f2f2f2] bg-white p-4 dark:border-zinc-700 dark:bg-zinc-850">
      {/* User Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#f2f2f2] dark:border-zinc-700">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#8022fe] text-xs font-bold text-white">
            {user?.fullName?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#181818] dark:text-white">
              {user?.fullName || 'Unknown User'}
            </p>
            <p className="text-[11px] font-medium text-[#c2c2c2] dark:text-gray-450">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => onViewUserDetails && onViewUserDetails(user?.id, user)}
          className="flex items-center gap-1 text-[12px] font-semibold text-[#8022fe] hover:text-[#8022fe]/80 transition"
        >
          View User Details
          <ChevronRight size={14} />
        </button>
      </div>

      {/* User's Activities List */}
      <div className="mt-3.5 space-y-2">
        {activities.map((activity) => (
          <AdminActivityItem key={activity._id || activity.id || Math.random()} activity={activity} />
        ))}
      </div>
    </div>
  );
};

// Admin Activity Item Component
const AdminActivityItem = ({ activity }) => {
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

  const colors = getActivityColors(activity.type);

  return (
    <div className="rounded-lg border border-[#f2f2f2] bg-[#fcfcfc] p-3 transition hover:bg-gray-50/50 dark:border-zinc-700 dark:bg-zinc-900/50 dark:hover:bg-zinc-900">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={`shrink-0 rounded-lg ${colors.bg} p-1.75`}>
            {renderIcon(activity.type, colors)}
          </div>

          {/* Content */}
          <div className="flex-1">
            {/* Activity Description */}
            <p className="text-[12px] font-medium text-[#5d5d5d] dark:text-gray-300">
              {activity.description}
            </p>

            {/* Metadata */}
            {activity.metadata && Object.keys(activity.metadata).length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2 text-[10px] font-semibold text-[#a3a3a3]">
                {activity.metadata.tokensUsed && (
                  <span className="inline-flex items-center gap-1 rounded bg-white px-2 py-0.5 border border-[#f2f2f2] dark:bg-zinc-800 dark:border-zinc-700">
                    ⚡ {activity.metadata.tokensUsed.toLocaleString()} tokens
                  </span>
                )}
                {activity.metadata.conversationId && (
                  <span className="inline-flex items-center gap-1 rounded bg-white px-2 py-0.5 border border-[#f2f2f2] dark:bg-zinc-800 dark:border-zinc-700">
                    💬 ID: {activity.metadata.conversationId.slice(0, 8)}...
                  </span>
                )}
                {activity.metadata.planId && (
                  <span className="inline-flex items-center gap-1 rounded bg-white px-2 py-0.5 border border-[#f2f2f2] dark:bg-zinc-800 dark:border-zinc-700">
                    📋 Plan: {activity.metadata.planId.slice(0, 8)}...
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Badge & Time */}
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide ${colors.badge}`}>
            {getActivityLabel(activity.type)}
          </span>
          <span className="text-[10px] font-semibold text-[#c2c2c2] dark:text-gray-450">
            {formatDistanceToNow(activity.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminActivityTimeline;
