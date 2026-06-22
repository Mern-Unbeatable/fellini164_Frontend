import React from 'react';

export default function WeeklyView() {
  return (
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
  );
}
