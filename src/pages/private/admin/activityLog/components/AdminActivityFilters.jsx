import React, { useState, useRef, useEffect } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';

const AdminActivityFilters = ({ filters, onFilterChange, onClearFilters }) => {
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
  const currentLabel = activityTypes.find((t) => t.value === filters.type)?.label;

  return (
    <div className="mb-5 flex w-full flex-col gap-3 rounded-2xl border border-[#f2f2f2] bg-white p-4.5 dark:border-zinc-700 dark:bg-zinc-800">
      <div className="flex w-full items-center justify-between gap-3 max-lg:flex-col max-lg:items-stretch">
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-[#8022fe]" />
          <span className="text-[14px] font-medium text-[#181818] dark:text-white">
            Filters
          </span>
        </div>

        <div className="flex items-center gap-3 max-lg:flex-col max-lg:items-stretch">
          <span className="text-[12px] font-medium text-[#c2c2c2] dark:text-gray-400">
            Activity Type
          </span>
          <div className="flex items-center gap-2">
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-48 items-center justify-between rounded-lg border border-[#f2f2f2] bg-white px-3 py-1.75 text-[12px] font-medium text-[#181818] transition dark:border-zinc-700 dark:bg-zinc-850 dark:text-white max-lg:w-full"
              >
                <span className="truncate">{currentLabel}</span>
                <ChevronDown
                  size={14}
                  className={`text-[#a3a3a3] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isOpen && (
                <div className="absolute right-0 top-8 z-50 max-h-60 w-48 overflow-y-auto rounded-lg border border-[#f2f2f2] bg-white shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)] dark:border-zinc-700 dark:bg-zinc-800 max-lg:left-0 max-lg:top-full max-lg:mt-1">
                  {activityTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => {
                        onFilterChange({ type: type.value });
                        setIsOpen(false);
                      }}
                      className={`flex w-full items-center px-3 py-2 text-left text-[12px] font-medium text-[#181818] dark:text-white transition hover:bg-[#f2f2f2] dark:hover:bg-zinc-700 ${
                        filters.type === type.value
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

            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="flex items-center gap-1.5 rounded-lg border border-[#f2f2f2] bg-white px-3 py-1.75 text-[12px] font-semibold text-[#181818] transition hover:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
              >
                <X size={13} />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Active Filters Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-[#f2f2f2] dark:border-zinc-700">
          {filters.type !== 'ALL' && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#8022fe]/10 px-2.5 py-1 text-[11px] font-semibold text-[#8022fe] dark:bg-[#8022fe]/20">
              Type: {currentLabel}
              <button
                onClick={() => onFilterChange({ type: 'ALL' })}
                className="hover:opacity-70"
              >
                <X size={12} />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminActivityFilters;
