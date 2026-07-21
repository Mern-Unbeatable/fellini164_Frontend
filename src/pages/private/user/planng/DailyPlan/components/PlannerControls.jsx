import React, { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Plus, Sparkles, ChevronDown } from 'lucide-react';
import { getWeekDays } from '../plannerData';

const SHORT_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/** Date label for controls — Daily: single date; Weekly: week range; Monthly: month year. */
function formatNavLabel(date, viewMode, months) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '';

  if (viewMode === 'Weekly') {
    const weekDays = getWeekDays(date);
    const start = weekDays[0];
    const end = weekDays[6];
    const sameYear = start.getFullYear() === end.getFullYear();
    const sameMonth = start.getMonth() === end.getMonth();

    if (sameMonth && sameYear) {
      return `${SHORT_MONTHS[start.getMonth()]} ${start.getDate()} – ${end.getDate()}, ${start.getFullYear()}`;
    }
    if (sameYear) {
      return `${SHORT_MONTHS[start.getMonth()]} ${start.getDate()} – ${SHORT_MONTHS[end.getMonth()]} ${end.getDate()}, ${start.getFullYear()}`;
    }
    return `${SHORT_MONTHS[start.getMonth()]} ${start.getDate()}, ${start.getFullYear()} – ${SHORT_MONTHS[end.getMonth()]} ${end.getDate()}, ${end.getFullYear()}`;
  }

  if (viewMode === 'Monthly') {
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  // Daily
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

export default function PlannerControls({
  currentDate,
  selectedDate,
  goToToday,
  viewMode,
  setViewMode,
  dropdownOpen,
  setDropdownOpen,
  navigateByView,
  handleOpenModal,
  handleQuickAction,
  hasAcceptedPlan,
  months,
}) {
  const dropdownRef = useRef(null);
  const displayDate = selectedDate || currentDate;

  useEffect(() => {
    if (!dropdownOpen) return;

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen, setDropdownOpen]);

  return (
    <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-center max-lg:items-stretch">
      {/* Action Buttons */}
      <div className="flex items-center gap-2.5 max-lg:w-full max-lg:flex-col">
        {hasAcceptedPlan && (
          <button
            type="button"
            onClick={() => handleQuickAction('ai_actions_menu')}
            className="bg-primary flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold text-white transition-colors max-lg:w-full max-lg:justify-center max-lg:py-2.5 max-lg:text-base"
          >
            <Sparkles size={14} className="fill-white/20" />
            <span>AI Actions</span>
          </button>
        )}
        <button
          type="button"
          onClick={handleOpenModal}
          className="flex items-center gap-1.5 rounded-lg border border-[#F2F2F2] bg-[#F2F2F2] px-4 py-2 text-xs font-semibold text-[#5D5D5D] transition-colors dark:border-zinc-700 dark:text-gray-200 max-lg:w-full max-lg:justify-center max-lg:py-2.5 max-lg:text-base"
        >
          <Plus size={14} />
          <span>Create Plan</span>
        </button>
      </div>

      {/* Navigation and Dropdown */}
      <div className="flex items-center gap-3.5 max-lg:w-full max-lg:flex-col max-lg:gap-3">
        <button
          type="button"
          onClick={goToToday}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-850 dark:text-gray-200 dark:hover:bg-zinc-800 max-lg:w-full max-lg:py-2.5 max-lg:text-base"
        >
          Today
        </button>

        <div className="flex items-center gap-2 max-lg:w-full max-lg:justify-between max-lg:px-2">
          <button
            type="button"
            onClick={() => navigateByView(-1)}
            className="text-[#5D5D5D]"
            aria-label={
              viewMode === 'Weekly'
                ? 'Previous week'
                : viewMode === 'Monthly'
                  ? 'Previous month'
                  : 'Previous day'
            }
          >
            <ChevronLeft size={24} />
          </button>
          <span className="min-w-[100px] text-center text-[14px] font-medium leading-[1.5] whitespace-nowrap text-[#5D5D5D] dark:text-gray-200 max-lg:flex-1 max-lg:min-w-0 max-lg:truncate">
            {formatNavLabel(displayDate, viewMode, months)}
          </span>
          <button
            type="button"
            onClick={() => navigateByView(1)}
            className="text-[#5D5D5D]"
            aria-label={
              viewMode === 'Weekly'
                ? 'Next week'
                : viewMode === 'Monthly'
                  ? 'Next month'
                  : 'Next day'
            }
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Divider */}
        <div className="h-4 w-[1px] bg-[#F2F2F2] dark:bg-zinc-800 max-lg:hidden" />

        {/* View Dropdown */}
        <div ref={dropdownRef} className="relative max-lg:w-full">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex w-30 items-center justify-between rounded-lg border border-[#f2f2f2] bg-white px-3 py-1.75 text-[12px] font-medium text-[#181818] transition-colors hover:bg-[#fcfcfc] dark:border-zinc-700 dark:bg-zinc-800 dark:text-white max-lg:w-full max-lg:gap-2 max-lg:py-2.5 max-lg:text-base"
          >
            <span className="truncate max-lg:min-w-0 max-lg:flex-1 max-lg:text-center">{viewMode}</span>
            <ChevronDown
              size={14}
              className={`shrink-0 text-[#a3a3a3] transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 z-50 mt-1.5 w-30 overflow-hidden rounded-lg border border-[#f2f2f2] bg-white py-0 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)] dark:border-zinc-700 dark:bg-zinc-800 max-lg:left-0 max-lg:right-0 max-lg:w-full">
              {['Daily', 'Weekly', 'Monthly'].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => {
                    setViewMode(mode);
                    setDropdownOpen(false);
                  }}
                  className="w-full px-2 py-1.5 text-left text-[12px] font-medium text-[#181818] transition-colors hover:bg-[#f2f2f2] dark:text-white dark:hover:bg-zinc-700 max-lg:py-2.5 max-lg:text-center max-lg:text-base"
                >
                  {mode}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
