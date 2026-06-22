import React from 'react';
import { ChevronLeft, ChevronRight, Plus, Sparkles, ChevronDown } from 'lucide-react';

export default function PlannerBoard({
  currentDate,
  selectedDate,
  setSelectedDate,
  viewMode,
  setViewMode,
  dropdownOpen,
  setDropdownOpen,
  plans,
  calendarDays,
  navigateMonth,
  handleOpenModal,
  handleQuickAction,
  getFormattedDateString,
  months
}) {
  return (
    <div className="flex-1 flex flex-col">
      {/* Title & Subtitle */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Planner Board</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">Organize your schedule, tasks, and habits with AI...</p>
      </div>

      {/* Action & Navigation Controls Bar */}
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

      {/* Calendar Month Grid */}
      <div className="flex-1 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 rounded-2xl overflow-hidden shadow-sm flex flex-col">
        {/* Weekday Names */}
        <div className="grid grid-cols-7 border-b border-gray-100 dark:border-zinc-800/80 gap-0">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName) => (
            <div 
              key={dayName} 
              className="py-3.5 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 border-r last:border-r-0 border-gray-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-900"
            >
              {dayName}
            </div>
          ))}
        </div>

        {/* Calendar Cells */}
        <div className="grid grid-cols-7 flex-1 gap-0 bg-gray-50/5 dark:bg-zinc-900/5">
          {calendarDays.map((dayObj, index) => {
            const formattedDate = getFormattedDateString(dayObj);
            const dayPlans = plans[formattedDate] || [];
            const isSelected = selectedDate.getDate() === dayObj.day && 
                               selectedDate.getMonth() === dayObj.month && 
                               selectedDate.getFullYear() === dayObj.year;
            
            const isLastRow = index >= calendarDays.length - 7;
            const isLastColumn = (index + 1) % 7 === 0;

            return (
              <div 
                key={index}
                onClick={() => setSelectedDate(new Date(dayObj.year, dayObj.month, dayObj.day))}
                className={`min-h-[120px] p-3 bg-white dark:bg-zinc-900 ${
                  !isLastColumn ? 'border-r' : ''
                } ${
                  isLastRow ? '' : 'border-b'
                } border-gray-100 dark:border-zinc-800/80 flex flex-col items-center hover:bg-gray-50/50 dark:hover:bg-zinc-800/20 cursor-pointer transition-colors`}
              >
                {/* Day Number */}
                <div className="flex justify-center mb-1.5">
                  <span className={`text-xs font-semibold w-7 h-7 flex items-center justify-center rounded-lg transition-all ${
                    isSelected 
                      ? 'bg-purple-100/70 text-[#7C3AED] dark:bg-purple-950/40 dark:text-purple-400 font-bold' 
                      : dayObj.isCurrentMonth 
                        ? 'text-slate-600 dark:text-gray-300' 
                        : 'text-gray-300 dark:text-zinc-700'
                  }`}>
                    {dayObj.day}
                  </span>
                </div>
                
                {/* Plan Items */}
                <div className="w-full flex flex-col gap-1 mt-1 overflow-y-auto">
                  {dayPlans.map((plan) => (
                    <div 
                      key={plan.id}
                      className="w-full text-center text-[10px] py-1.5 px-2 bg-white dark:bg-zinc-800 text-slate-700 dark:text-gray-300 border border-gray-100 dark:border-zinc-800 rounded-lg shadow-sm truncate font-medium hover:border-violet-300 dark:hover:border-violet-700 transition-colors"
                      title={plan.title}
                    >
                      {plan.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}






