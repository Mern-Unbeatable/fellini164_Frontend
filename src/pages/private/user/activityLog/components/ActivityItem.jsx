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
        bg: 'bg-[rgba(128,34,254,0.05)] dark:bg-purple-950/20',
        icon: 'text-[#8022fe]',
        badge: 'bg-[#f9f4ff] text-[#8022fe] dark:bg-purple-950/40 dark:text-purple-300',
      };
    }
    // Plans
    if (type === 'PLAN_CREATED' || type === 'PLAN_UPDATED' || type === 'PLAN_COMPLETED') {
      return {
        bg: 'bg-[rgba(16,185,129,0.05)] dark:bg-green-950/20',
        icon: 'text-[#10b981]',
        badge: 'bg-[rgba(16,185,129,0.1)] text-[#10b981] dark:bg-green-950/40 dark:text-green-300',
      };
    }
    // Goals
    if (type === 'GOAL_CREATED' || type === 'GOAL_COMPLETED') {
      return {
        bg: 'bg-[rgba(59,130,246,0.05)] dark:bg-blue-950/20',
        icon: 'text-[#3b82f6]',
        badge: 'bg-[rgba(59,130,246,0.1)] text-[#3b82f6] dark:bg-blue-950/40 dark:text-blue-300',
      };
    }
    // Habits
    if (type === 'HABIT_CREATED' || type === 'HABIT_COMPLETED') {
      return {
        bg: 'bg-[rgba(249,115,22,0.05)] dark:bg-orange-950/20',
        icon: 'text-[#f97316]',
        badge: 'bg-[rgba(249,115,22,0.1)] text-[#f97316] dark:bg-orange-950/40 dark:text-orange-300',
      };
    }
    // Tasks
    if (type === 'TASK_CREATED' || type === 'TASK_COMPLETED') {
      return {
        bg: 'bg-[rgba(6,182,212,0.05)] dark:bg-cyan-950/20',
        icon: 'text-[#06b6d4]',
        badge: 'bg-[rgba(6,182,212,0.1)] text-[#06b6d4] dark:bg-cyan-950/40 dark:text-cyan-300',
      };
    }
    // Subscriptions
    if (type.startsWith('SUBSCRIPTION_')) {
      return {
        bg: 'bg-[rgba(99,102,241,0.05)] dark:bg-indigo-950/20',
        icon: 'text-[#6366f1]',
        badge: 'bg-[rgba(99,102,241,0.1)] text-[#6366f1] dark:bg-indigo-950/40 dark:text-indigo-300',
      };
    }
    // Payments
    if (type === 'PAYMENT_SUCCEEDED') {
      return {
        bg: 'bg-[rgba(16,185,129,0.05)] dark:bg-emerald-950/20',
        icon: 'text-[#10b981]',
        badge: 'bg-[rgba(16,185,129,0.1)] text-[#10b981] dark:bg-emerald-950/40 dark:text-emerald-300',
      };
    }
    if (type === 'PAYMENT_FAILED') {
      return {
        bg: 'bg-[rgba(239,68,68,0.05)] dark:bg-red-950/20',
        icon: 'text-[#ef4444]',
        badge: 'bg-[rgba(239,68,68,0.1)] text-[#ef4444] dark:bg-red-950/40 dark:text-red-300',
      };
    }
    // Auth & Settings
    if (type === 'USER_LOGIN' || type === 'USER_LOGOUT' || type === 'SETTINGS_UPDATED' || 
        type === 'PASSWORD_CHANGED' || type === 'EMAIL_VERIFIED') {
      return {
        bg: 'bg-[rgba(107,114,128,0.05)] dark:bg-slate-950/20',
        icon: 'text-[#6b7280]',
        badge: 'bg-[rgba(107,114,128,0.1)] text-[#6b7280] dark:bg-slate-950/40 dark:text-slate-300',
      };
    }
    // Default
    return {
      bg: 'bg-[rgba(107,114,128,0.05)] dark:bg-zinc-950/20',
      icon: 'text-[#6b7280]',
      badge: 'bg-[rgba(107,114,128,0.1)] text-[#6b7280] dark:bg-zinc-950/40 dark:text-zinc-300',
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
      className="group rounded-2xl border border-[#f2f2f2] bg-[#fcfcfc] p-3 transition-all hover:bg-white hover:shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)] dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-750"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`shrink-0 rounded-[8px] ${colors.bg} p-2`}>
          {renderIcon()}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-medium text-[#181818] dark:text-white leading-normal">
                  {activity.description}
                </h3>
                <span className={`rounded-[6px] px-[6px] py-[2px] text-xs font-semibold uppercase lg:text-[10px] ${colors.badge}`}>
                  {getActivityLabel(activity.type)}
                </span>
              </div>
              <p className="text-[12px] font-medium text-[#c2c2c2] dark:text-gray-400">{timeAgo}</p>
            </div>

            {/* Time on larger screens */}
            <span className="hidden text-[12px] font-medium text-[#c2c2c2] sm:block dark:text-gray-400">
              {new Date(activity.createdAt).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          {/* Metadata */}
          {activity.metadata && (
            <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs font-medium text-[#5d5d5d] dark:text-gray-300">
              {activity.metadata.tokensUsed && (
                <span className="flex items-center gap-1 rounded-[6px] border border-[#f2f2f2] px-[6px] py-[2px] dark:border-zinc-700">
                  💬 {activity.metadata.tokensUsed.toLocaleString()} tokens
                </span>
              )}
              {activity.metadata.conversationId && (
                <span className="flex items-center gap-1 rounded-[6px] border border-[#f2f2f2] px-[6px] py-[2px] dark:border-zinc-700">
                  ID: {activity.metadata.conversationId}
                </span>
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
              className="mt-3 flex items-center gap-1 text-[12px] font-semibold text-[#8022fe] transition hover:opacity-80"
            >
              <span>View Details</span>
              <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;
