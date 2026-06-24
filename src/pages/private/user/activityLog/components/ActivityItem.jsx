import React from 'react';
import { 
  MessageSquare, Calendar, Target, TrendingUp, ChevronRight, 
  LogIn, LogOut, Edit, CheckCircle, RotateCcw, CheckSquare,
  CreditCard, DollarSign, XCircle, Lightbulb, Settings,
  Lock, Mail
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ActivityItem = ({ activity }) => {
  const navigate = useNavigate();

  const formatDistanceToNow = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    }
    if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
    if (diffInSeconds < 31536000) {
      const months = Math.floor(diffInSeconds / 2592000);
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    }
    const years = Math.floor(diffInSeconds / 31536000);
    return `${years} ${years === 1 ? 'year' : 'years'} ago`;
  };

  const getActivityColors = (type) => {
    // AI & Chat
    if (type === 'AI_CHAT' || type === 'AI_RECOMMENDATION') {
      return {
        bg: 'bg-purple-50 dark:bg-purple-900/30',
        icon: 'text-purple-600 dark:text-purple-400',
        border: 'border-purple-200 dark:border-purple-800',
        badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
      };
    }
    // Plans
    if (type === 'PLAN_CREATED' || type === 'PLAN_UPDATED' || type === 'PLAN_COMPLETED') {
      return {
        bg: 'bg-green-50 dark:bg-green-900/30',
        icon: 'text-green-600 dark:text-green-400',
        border: 'border-green-200 dark:border-green-800',
        badge: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
      };
    }
    // Goals
    if (type === 'GOAL_CREATED' || type === 'GOAL_COMPLETED') {
      return {
        bg: 'bg-blue-50 dark:bg-blue-900/30',
        icon: 'text-blue-600 dark:text-blue-400',
        border: 'border-blue-200 dark:border-blue-800',
        badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
      };
    }
    // Habits
    if (type === 'HABIT_CREATED' || type === 'HABIT_COMPLETED') {
      return {
        bg: 'bg-orange-50 dark:bg-orange-900/30',
        icon: 'text-orange-600 dark:text-orange-400',
        border: 'border-orange-200 dark:border-orange-800',
        badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
      };
    }
    // Tasks
    if (type === 'TASK_CREATED' || type === 'TASK_COMPLETED') {
      return {
        bg: 'bg-cyan-50 dark:bg-cyan-900/30',
        icon: 'text-cyan-600 dark:text-cyan-400',
        border: 'border-cyan-200 dark:border-cyan-800',
        badge: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300',
      };
    }
    // Subscriptions
    if (type.startsWith('SUBSCRIPTION_')) {
      return {
        bg: 'bg-indigo-50 dark:bg-indigo-900/30',
        icon: 'text-indigo-600 dark:text-indigo-400',
        border: 'border-indigo-200 dark:border-indigo-800',
        badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300',
      };
    }
    // Payments
    if (type === 'PAYMENT_SUCCEEDED') {
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-900/30',
        icon: 'text-emerald-600 dark:text-emerald-400',
        border: 'border-emerald-200 dark:border-emerald-800',
        badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
      };
    }
    if (type === 'PAYMENT_FAILED') {
      return {
        bg: 'bg-red-50 dark:bg-red-900/30',
        icon: 'text-red-600 dark:text-red-400',
        border: 'border-red-200 dark:border-red-800',
        badge: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
      };
    }
    // Auth & Settings
    if (type === 'USER_LOGIN' || type === 'USER_LOGOUT' || type === 'SETTINGS_UPDATED' || 
        type === 'PASSWORD_CHANGED' || type === 'EMAIL_VERIFIED') {
      return {
        bg: 'bg-slate-50 dark:bg-slate-900/30',
        icon: 'text-slate-600 dark:text-slate-400',
        border: 'border-slate-200 dark:border-slate-800',
        badge: 'bg-slate-100 text-slate-700 dark:bg-slate-900/50 dark:text-slate-300',
      };
    }
    // Default
    return {
      bg: 'bg-gray-50 dark:bg-gray-900/30',
      icon: 'text-gray-600 dark:text-gray-400',
      border: 'border-gray-200 dark:border-gray-800',
      badge: 'bg-gray-100 text-gray-700 dark:bg-gray-900/50 dark:text-gray-300',
    };
  };

  const getActivityLabel = (type) => {
    const labels = {
      USER_LOGIN: 'User Login',
      USER_LOGOUT: 'User Logout',
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
      PAYMENT_SUCCEEDED: 'Payment Succeeded',
      PAYMENT_FAILED: 'Payment Failed',
      AI_CHAT: 'AI Chat',
      AI_RECOMMENDATION: 'AI Recommendation',
      SETTINGS_UPDATED: 'Settings Updated',
      PASSWORD_CHANGED: 'Password Changed',
      EMAIL_VERIFIED: 'Email Verified',
    };
    return labels[type] || type.replace(/_/g, ' ');
  };

  const handleViewDetails = () => {
    const { type, metadata } = activity;
    
    if (type === 'AI_CHAT' && metadata?.conversationId) {
      navigate('/user/ai-coach');
    } else if ((type === 'PLAN_CREATED' || type === 'PLAN_UPDATED') && metadata?.planId) {
      const planType = activity.description?.toLowerCase();
      if (planType?.includes('weekly')) {
        navigate('/user/weekly-plan');
      } else if (planType?.includes('monthly')) {
        navigate('/user/monthly-plan');
      } else if (planType?.includes('daily')) {
        navigate('/user/daily-plan');
      }
    } else if ((type === 'TASK_CREATED' || type === 'TASK_COMPLETED') && metadata?.taskId) {
      navigate('/user/tasks');
    } else if ((type === 'HABIT_CREATED' || type === 'HABIT_COMPLETED') && metadata?.habitId) {
      navigate('/user/habits');
    } else if ((type === 'GOAL_CREATED' || type === 'GOAL_COMPLETED') && metadata?.goalId) {
      navigate('/user/goals');
    } else if (type.startsWith('SUBSCRIPTION_') || type.startsWith('PAYMENT_')) {
      navigate('/user/subscription');
    } else if (type === 'SETTINGS_UPDATED' || type === 'PASSWORD_CHANGED') {
      navigate('/settings');
    } else if (type === 'EMAIL_VERIFIED') {
      navigate('/user/profile');
    }
  };

  const colors = getActivityColors(activity.type);
  const timeAgo = formatDistanceToNow(new Date(activity.createdAt));

  const renderIcon = () => {
    const iconClass = `h-4 w-4 sm:h-5 sm:w-5 ${colors.icon}`;
    const { type } = activity;
    
    // Auth
    if (type === 'USER_LOGIN') return <LogIn className={iconClass} />;
    if (type === 'USER_LOGOUT') return <LogOut className={iconClass} />;
    
    // Plans
    if (type === 'PLAN_CREATED') return <Calendar className={iconClass} />;
    if (type === 'PLAN_UPDATED') return <Edit className={iconClass} />;
    if (type === 'PLAN_COMPLETED') return <CheckCircle className={iconClass} />;
    
    // Habits
    if (type === 'HABIT_CREATED' || type === 'HABIT_COMPLETED') return <RotateCcw className={iconClass} />;
    
    // Tasks
    if (type === 'TASK_CREATED' || type === 'TASK_COMPLETED') return <CheckSquare className={iconClass} />;
    
    // Goals
    if (type === 'GOAL_CREATED' || type === 'GOAL_COMPLETED') return <Target className={iconClass} />;
    
    // Subscriptions
    if (type.startsWith('SUBSCRIPTION_')) return <CreditCard className={iconClass} />;
    
    // Payments
    if (type === 'PAYMENT_SUCCEEDED') return <DollarSign className={iconClass} />;
    if (type === 'PAYMENT_FAILED') return <XCircle className={iconClass} />;
    
    // AI
    if (type === 'AI_CHAT') return <MessageSquare className={iconClass} />;
    if (type === 'AI_RECOMMENDATION') return <Lightbulb className={iconClass} />;
    
    // Settings
    if (type === 'SETTINGS_UPDATED') return <Settings className={iconClass} />;
    if (type === 'PASSWORD_CHANGED') return <Lock className={iconClass} />;
    if (type === 'EMAIL_VERIFIED') return <Mail className={iconClass} />;
    
    // Default
    return <TrendingUp className={iconClass} />;
  };

  return (
    <div
      className={`group rounded-lg border ${colors.border} bg-white p-4 shadow-sm transition-all hover:shadow-md dark:bg-zinc-800`}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Icon */}
        <div className={`shrink-0 rounded-lg ${colors.bg} p-2 sm:p-2.5`}>
          {renderIcon()}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-900 sm:text-base dark:text-white">
                  {activity.description}
                </h3>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors.badge}`}>
                  {getActivityLabel(activity.type)}
                </span>
              </div>
              <p className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">{timeAgo}</p>
            </div>

            {/* Time on larger screens */}
            <span className="hidden text-sm text-gray-500 sm:block dark:text-gray-400">
              {new Date(activity.createdAt).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          {/* Metadata */}
          {activity.metadata && (
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs sm:text-sm">
              {activity.metadata.tokensUsed && (
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <span className="font-medium">💬</span>
                  <span>{activity.metadata.tokensUsed.toLocaleString()} tokens</span>
                </div>
              )}
              {activity.metadata.conversationId && (
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-500">
                  <span className="text-xs">
                    ID: {activity.metadata.conversationId}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* View Details Button */}
          {(activity.metadata?.conversationId || 
            activity.metadata?.planId || 
            activity.metadata?.taskId || 
            activity.metadata?.habitId || 
            activity.metadata?.goalId ||
            activity.type.startsWith('SUBSCRIPTION_') ||
            activity.type.startsWith('PAYMENT_') ||
            activity.type === 'SETTINGS_UPDATED' ||
            activity.type === 'PASSWORD_CHANGED' ||
            activity.type === 'EMAIL_VERIFIED') && (
            <button
              onClick={handleViewDetails}
              className="mt-3 flex items-center gap-1 text-sm font-medium text-purple-600 transition hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
            >
              <span>View Details</span>
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;
