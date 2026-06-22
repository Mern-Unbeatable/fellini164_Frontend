import React from 'react';
import { ChevronLeft, ChevronRight, Plus, Sparkles, ChevronDown } from 'lucide-react';

export default function PlannerControls({
  currentDate,
  setSelectedDate,
  viewMode,
  setViewMode,
  dropdownOpen,
  setDropdownOpen,
  navigateMonth,
  handleOpenModal,
  handleQuickAction,
  months
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-2">
      {/* Action Buttons */}
      <div className="flex items-center gap-2.5">
        <button 
          onClick={() => handleQuickAction('monthly_plan')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-medium transition-colors"
        >
          <Sparkles size={14} className="fill-white/20" />
          <span>+ AI Actions</span>
        </button>
        <button 
          onClick={handleOpenModal}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white hover:bg-gray-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-gray-200 text-sm font-medium transition-colors"
        >
          <Plus size={14} />
          <span>Create Plan</span>
        </button>
      </div>

      {/* Navigation and Dropdown */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-gray-50 dark:bg-zinc-800/80 px-2.5 py-1.5 rounded-lg border border-gray-100 dark:border-zinc-800">
          <button 
            onClick={() => {
              setSelectedDate(new Date(2026, 4, 13));
            }}
            className="px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-gray-200 hover:bg-white dark:hover:bg-zinc-700 rounded transition-colors"
          >
            Today
          </button>
          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => navigateMonth(-1)}
              className="p-1 hover:bg-white dark:hover:bg-zinc-700 rounded text-gray-500 dark:text-gray-400 transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-xs font-semibold min-w-[90px] text-center text-slate-800 dark:text-gray-100">
              {months[currentDate.getMonth()]} {currentDate.getDate()}, {currentDate.getFullYear()}
            </span>
            <button 
              onClick={() => navigateMonth(1)}
              className="p-1 hover:bg-white dark:hover:bg-zinc-700 rounded text-gray-500 dark:text-gray-400 transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* View Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-700 text-slate-700 dark:text-gray-200 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
          >
            <span>{viewMode}</span>
            <ChevronDown size={12} />
          </button>
          
          {dropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-32 bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-lg shadow-md py-1 z-10">
              {['Daily', 'Weekly', 'Monthly'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    setViewMode(mode);
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-1.5 text-xs text-slate-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-700/80 transition-colors"
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
