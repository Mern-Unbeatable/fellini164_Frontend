import React, { useState, useRef, useEffect } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';

const ActivityFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
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

  const hasActiveFilters = filters.type !== 'ALL';

  return (
    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-zinc-800">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          <h3 className="text-base font-semibold text-gray-900 sm:text-lg dark:text-white">
            Filters
          </h3>
        </div>
        
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Activity Type
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-600 dark:bg-zinc-700 dark:text-white"
              >
                <span>{activityTypes.find((t) => t.value === filters.type)?.label}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isOpen && (
                <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-300 bg-white shadow-lg dark:border-gray-600 dark:bg-zinc-700">
                  {activityTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => {
                        onFilterChange({ type: type.value });
                        setIsOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-sm transition hover:bg-gray-100 dark:hover:bg-zinc-600 ${
                        filters.type === type.value
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
            
            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                <X className="h-4 w-4" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Active Filters Chips */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.type !== 'ALL' && (
            <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
              Type: {activityTypes.find((t) => t.value === filters.type)?.label}
              <button
                onClick={() => onFilterChange({ type: 'ALL' })}
                className="hover:text-purple-900 dark:hover:text-purple-100"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ActivityFilters;
