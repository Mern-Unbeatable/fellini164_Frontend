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

      {/* Calendar Month/Weekly/Daily Grid */}
      {viewMode === 'Daily' ? (
        <div className="flex-1 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 rounded-2xl overflow-hidden shadow-sm flex flex-col">
          {/* Daily Date Header */}
          <div className="p-4 border-b border-gray-100 dark:border-zinc-800/80 flex flex-col items-start bg-white dark:bg-zinc-900">
            <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Wed</span>
            <span className="text-sm font-bold mt-1 w-7 h-7 flex items-center justify-center rounded-lg bg-purple-100/70 text-[#7C3AED] dark:bg-purple-950/40 dark:text-purple-400">
              13
            </span>
          </div>

          {/* Daily Scrollable Grid */}
          <div className="flex-1 overflow-y-auto max-h-[580px]">
            {['1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM'].map((hour) => (
              <div 
                key={hour} 
                className="grid grid-cols-[64px_1fr] border-b last:border-b-0 border-gray-100 dark:border-zinc-800/80 gap-0 relative"
              >
                {/* Hour Label */}
                <div className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold pr-3 text-right py-4 border-r border-gray-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-900">
                  {hour}
                </div>

                {/* Hour Task Slot */}
                <div className="p-3 bg-white dark:bg-zinc-900 relative flex flex-col justify-center min-h-[90px]">
                  {/* Time Line Indicator Overlay at 4 AM slot */}
                  {hour === '4 AM' && (
                    <div className="absolute left-0 right-0 top-1/4 -translate-y-1/2 flex items-center z-10 pointer-events-none">
                      <div className="w-2 h-2 rounded-full bg-purple-600 border border-white dark:border-zinc-900 shadow-sm ml-[-4px]"></div>
                      <div className="flex-1 h-[2px] bg-purple-500/85"></div>
                    </div>
                  )}

                  {hour === '1 AM' && (
                    <div className="bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 shadow-sm rounded-lg p-3 flex items-center justify-between w-full">
                      <span className="text-xs text-slate-700 dark:text-gray-300 font-bold">Morning Workout Routine</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[8px] font-bold px-2 py-0.5 rounded bg-orange-50 text-orange-500 border border-orange-100 dark:bg-orange-950/30 dark:text-orange-400 dark:border-none">HIGH</span>
                        <span className="text-[8px] font-bold px-2 py-0.5 rounded bg-purple-50 text-[#7C3AED] border border-purple-100 dark:bg-purple-950/30 dark:text-purple-400 dark:border-none flex items-center gap-0.5">✨ AI</span>
                        <span className="text-[8px] font-bold px-2 py-0.5 rounded bg-gray-50 text-gray-400 border border-gray-100 dark:bg-zinc-700 dark:text-gray-400 dark:border-none">TO DO</span>
                      </div>
                    </div>
                  )}

                  {hour === '2 AM' && (
                    <div className="bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 shadow-sm rounded-lg p-3 flex items-center justify-between w-full">
                      <span className="text-xs text-slate-700 dark:text-gray-300 font-bold">Complete Work Task</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[8px] font-bold px-2 py-0.5 rounded bg-yellow-50 text-yellow-600 border border-yellow-100 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-none">MEDIUM</span>
                        <span className="text-[8px] font-bold px-2 py-0.5 rounded bg-gray-50 text-gray-400 border border-gray-100 dark:bg-zinc-700 dark:text-gray-400 dark:border-none">TO DO</span>
                      </div>
                    </div>
                  )}

                  {hour === '4 AM' && (
                    <div className="bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 shadow-sm rounded-lg p-3 flex flex-col gap-1 w-full">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-700 dark:text-gray-300 font-bold">Exercise Routine</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[8px] font-bold px-2 py-0.5 rounded bg-red-50 text-red-500 border border-red-100 dark:bg-red-950/30 dark:text-red-400 dark:border-none">URGENT</span>
                          <span className="text-[8px] font-bold px-2 py-0.5 rounded bg-purple-50 text-[#7C3AED] border border-purple-100 dark:bg-purple-950/30 dark:text-purple-400 dark:border-none flex items-center gap-0.5">✨ AI</span>
                          <span className="text-[8px] font-bold px-2 py-0.5 rounded bg-gray-50 text-gray-400 border border-gray-100 dark:bg-zinc-700 dark:text-gray-400 dark:border-none">TO DO</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">Follow your fitness routine or do a workout session.</p>
                    </div>
                  )}

                  {hour === '7 AM' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                      {/* Update Resume card */}
                      <div className="bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 shadow-sm rounded-lg p-3.5 flex flex-col gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[8px] font-bold px-2 py-0.5 rounded bg-gray-50 text-gray-405 border border-gray-100 dark:bg-zinc-700 dark:text-gray-400 dark:border-none">LOW</span>
                          <span className="text-[8px] font-bold px-2 py-0.5 rounded bg-gray-50 text-gray-500 border border-gray-100 dark:bg-zinc-700 dark:text-gray-300 dark:border-none">IN PROGRESS</span>
                        </div>
                        <span className="text-xs text-slate-700 dark:text-gray-300 font-bold leading-snug">Update Resume and LinkedIn Profile</span>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-relaxed truncate">Communicate the expectations regarding maintaining a calm...</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[8px] font-semibold px-2 py-0.5 border border-gray-200 text-gray-400 rounded-lg dark:border-zinc-700">Health</span>
                          <span className="text-[8px] font-semibold text-gray-400 dark:text-gray-500 flex items-center gap-0.5">🕒 115 Min</span>
                        </div>
                      </div>

                      {/* Drink Water card */}
                      <div className="bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 shadow-sm rounded-lg p-3.5 flex items-center justify-between">
                        <div className="flex flex-col gap-1 pr-4">
                          <span className="text-xs text-slate-700 dark:text-gray-300 font-bold">Drink Water</span>
                          <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-relaxed truncate">Stay hydrated throughout the day Stay hydrated throughout...</p>
                        </div>
                        <div className="flex flex-col items-center justify-center p-2 border border-gray-100 dark:border-zinc-700 rounded-lg min-w-[48px]">
                          <div className="w-4 h-4 rounded border border-gray-300 dark:border-zinc-600 mb-1"></div>
                          <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500">0/2</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {hour === '11 AM' && (
                    <div className="bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 shadow-sm rounded-lg p-3.5 flex flex-col gap-1.5 w-full">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-700 dark:text-gray-300 font-bold">Career Development Plan</span>
                          <span className="text-[8px] font-bold px-2 py-0.5 rounded bg-orange-50 text-orange-500 border border-orange-100 dark:bg-orange-950/30 dark:text-orange-400 dark:border-none">HIGH</span>
                          <span className="text-[8px] font-bold px-2 py-0.5 rounded bg-purple-50 text-[#7C3AED] border border-purple-100 dark:bg-purple-950/30 dark:text-purple-400 dark:border-none flex items-center gap-0.5">✨ AI</span>
                          <span className="text-[8px] font-bold px-2 py-0.5 rounded bg-gray-50 text-gray-500 border border-gray-100 dark:bg-zinc-700 dark:text-gray-300 dark:border-none">IN PROGRESS</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500">Stick to your professional development plan or engage in a skills training session.</p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="text-[8px] font-semibold px-2 py-0.5 border border-gray-200 text-gray-400 rounded-lg dark:border-zinc-700">Career</span>
                        <span className="text-[8px] font-semibold px-2 py-0.5 border border-gray-200 text-gray-400 rounded-lg dark:border-zinc-700 flex items-center gap-0.5">🎯 Improve Rate</span>
                        <span className="text-[8px] font-semibold text-gray-400 dark:text-gray-500 flex items-center gap-0.5">🕒 60 Min</span>
                        <span className="text-[8px] font-semibold text-gray-400 dark:text-gray-500 flex items-center gap-0.5">📊 0/4 Steps</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : viewMode === 'Weekly' ? (
        <div className="flex-1 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 rounded-2xl overflow-hidden shadow-sm flex flex-col">
          {/* Weekday Names with Date Numbers */}
          <div className="grid grid-cols-[64px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b border-gray-100 dark:border-zinc-800/80 gap-0">
            {/* Corner Cell (Time column spacer) */}
            <div className="border-r border-gray-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-900"></div>
            {[
              { name: 'Mon', num: 11 },
              { name: 'Tue', num: 12 },
              { name: 'Wed', num: 13, active: true },
              { name: 'Thu', num: 14 },
              { name: 'Fri', num: 15 },
              { name: 'Sat', num: 16 },
              { name: 'Sun', num: 17 }
            ].map((dayObj) => (
              <div 
                key={dayObj.num} 
                className="py-3 text-center border-r last:border-r-0 border-gray-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 flex flex-col items-center justify-center"
              >
                <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{dayObj.name}</span>
                <span className={`text-sm font-bold mt-1 w-7 h-7 flex items-center justify-center rounded-lg ${
                  dayObj.active 
                    ? 'bg-purple-100/70 text-[#7C3AED] dark:bg-purple-950/40 dark:text-purple-400' 
                    : 'text-slate-700 dark:text-gray-200'
                }`}>
                  {dayObj.num}
                </span>
              </div>
            ))}
          </div>

          {/* Hourly Slots Scrollable Area */}
          <div className="flex-1 overflow-y-auto max-h-[580px]">
            {['1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM'].map((hour) => (
              <div 
                key={hour} 
                className="grid grid-cols-[64px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b last:border-b-0 border-gray-100 dark:border-zinc-800/80 gap-0"
              >
                {/* Time Label */}
                <div className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold pr-3 text-right py-4 border-r border-gray-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-900">
                  {hour}
                </div>

                {/* Day Columns (Mon to Sun) */}
                {Array.from({ length: 7 }).map((_, colIndex) => {
                  const isWednesday = colIndex === 2;
                  
                  return (
                    <div 
                      key={colIndex}
                      className="border-r last:border-r-0 border-gray-100 dark:border-zinc-800/80 p-2 min-h-[90px] bg-white dark:bg-zinc-900 hover:bg-gray-50/20 transition-colors"
                    >
                      {/* Render Wednesday Tasks specifically matching mockup */}
                      {isWednesday && hour === '1 AM' && (
                        <div className="bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 shadow-sm rounded-lg p-2.5 text-xs text-slate-700 dark:text-gray-300 font-semibold truncate">
                          Morning Workout...
                        </div>
                      )}

                      {isWednesday && hour === '2 AM' && (
                        <div className="bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 shadow-sm rounded-lg p-2.5 text-xs text-slate-700 dark:text-gray-300 font-semibold truncate">
                          Complete Work T...
                        </div>
                      )}

                      {isWednesday && hour === '4 AM' && (
                        <div className="bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 border-b-2 border-b-purple-500 shadow-sm rounded-lg p-2.5 flex flex-col gap-1.5 relative">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                            <span className="text-xs text-slate-700 dark:text-gray-300 font-semibold">Exercise Routine</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-1">
                            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-red-50 text-red-500 border border-red-100 dark:bg-red-950/30 dark:text-red-400 dark:border-none">URGENT</span>
                            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-gray-50 text-gray-500 border border-gray-100 dark:bg-zinc-700 dark:text-gray-400 dark:border-none">TO DO</span>
                          </div>
                        </div>
                      )}

                      {isWednesday && hour === '7 AM' && (
                        <div className="bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 shadow-sm rounded-lg p-2.5 flex flex-col gap-1.5">
                          <div>
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-gray-50 dark:bg-zinc-700 border border-gray-100 dark:border-zinc-600 rounded-full text-[8px] font-semibold text-gray-500 dark:text-gray-400">
                              💬 1 Habit
                            </span>
                          </div>
                          <span className="text-xs text-slate-700 dark:text-gray-300 font-semibold leading-snug">
                            Update Resume and LinkedIn Pro...
                          </span>
                          <div className="flex flex-wrap items-center gap-1 mt-0.5">
                            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-gray-50 text-gray-405 border border-gray-100 dark:bg-zinc-700 dark:text-gray-400 dark:border-none">LOW</span>
                            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-gray-50 text-gray-500 border border-gray-100 dark:bg-zinc-700 dark:text-gray-300 dark:border-none">IN PROGRESS</span>
                            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded border border-gray-200 text-gray-400 dark:border-zinc-700">Health</span>
                            <span className="text-[8px] font-bold text-gray-400 dark:text-gray-500 flex items-center gap-0.5 ml-1">
                              🕒 115 Min
                            </span>
                          </div>
                        </div>
                      )}

                      {isWednesday && hour === '11 AM' && (
                        <div className="bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 shadow-sm rounded-lg p-2.5 flex flex-col gap-1.5">
                          <span className="text-xs text-slate-700 dark:text-gray-300 font-semibold leading-snug">
                            Career Development Plan
                          </span>
                          <div className="flex flex-wrap items-center gap-1 mt-0.5">
                            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-orange-50 text-orange-500 border border-orange-100 dark:bg-orange-950/30 dark:text-orange-400 dark:border-none">HIGH</span>
                            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-gray-50 text-gray-500 border border-gray-100 dark:bg-zinc-700 dark:text-gray-300 dark:border-none">IN PROGRESS</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      ) : (
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
      )}
    </div>
  );
}