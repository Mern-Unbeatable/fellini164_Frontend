import React from 'react';

export default function DailyView({ currentDate, selectedDate }) {
  // Get short weekday name and date number of selectedDate or currentDate
  const dateToUse = selectedDate || currentDate || new Date(2026, 4, 13);
  const weekdayShort = dateToUse.toLocaleDateString('en-US', { weekday: 'short' });
  const dateNum = dateToUse.getDate();

  return (
    <div className="flex-1 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 rounded-2xl overflow-hidden shadow-sm flex flex-col">
      {/* Daily Date Header */}
      <div className="p-4 border-b border-gray-100 dark:border-zinc-800/80 flex flex-col items-start bg-white dark:bg-zinc-900">
        <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          {weekdayShort}
        </span>
        <span className="text-sm font-bold mt-1 w-7 h-7 flex items-center justify-center rounded-lg bg-purple-100/70 text-[#7C3AED] dark:bg-purple-950/40 dark:text-purple-400">
          {dateNum}
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
  );
}
