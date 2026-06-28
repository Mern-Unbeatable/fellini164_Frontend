import React, { useState, useRef, useEffect } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';

const ActivityFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
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
    <div className="mb-6 rounded-2xl border border-[#f2f2f2] bg-white p-3 dark:border-zinc-700 dark:bg-zinc-800">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-[#5d5d5d] dark:text-gray-300" />
          <span className="text-sm font-medium text-[#5d5d5d] dark:text-gray-300">
            Filters
          </span>
        </div>
        
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="text-[12px] font-medium text-[#5d5d5d] dark:text-gray-300">
            Activity Type
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between rounded-lg border border-[#f2f2f2] bg-white px-3 py-1.75 text-[12px] font-medium text-[#181818] transition dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              >
                <span>{activityTypes.find((t) => t.value === filters.type)?.label}</span>
                <ChevronDown className={`h-3.5 w-3.5 text-[#a3a3a3] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isOpen && (
                <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-lg border border-[#f2f2f2] bg-white shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)] dark:border-zinc-700 dark:bg-zinc-800">
                  {activityTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onMouseEnter={() => setHovered(type.value)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => {
                        onFilterChange({ type: type.value });
                        setIsOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-[12px] font-medium text-[#181818] dark:text-white transition ${
                        filters.type === type.value
                          ? 'bg-[#f9f4ff] text-[#8022fe] dark:bg-purple-950/40 dark:text-purple-300'
                          : hovered === type.value
                          ? 'bg-[#f2f2f2] dark:bg-zinc-700'
                          : ''
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
                className="flex items-center gap-1 rounded-lg border border-[#f2f2f2] bg-white px-3 py-1.75 text-[12px] font-medium text-[#5d5d5d] transition hover:bg-[#fcfcfc] dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700"
              >
                <X className="h-3.5 w-3.5" />
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
            <span className="inline-flex items-center gap-1 rounded-[6px] bg-[#f9f4ff] px-2 py-0.5 text-xs font-medium text-[#8022fe] dark:bg-purple-950/40 dark:text-purple-300">
              Type: {activityTypes.find((t) => t.value === filters.type)?.label}
              <button
                onClick={() => onFilterChange({ type: 'ALL' })}
                className="hover:text-[#8022fe] dark:hover:text-purple-100 ml-1 inline-flex items-center"
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
