import React from 'react';
import { RefreshCw, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

export default function WeeklyView() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-[#F2F2F2] bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
      {/* Weekday Names with Date Numbers */}
      <div className="grid grid-cols-[64px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-0 border-b border-[#F2F2F2] dark:border-zinc-800/80">
        {/* Corner Cell (Time column spacer) */}
        <div className="border-r border-[#F2F2F2] bg-white dark:border-zinc-800/80 dark:bg-zinc-900"></div>
        {[
          { name: 'Mon', num: 11 },
          { name: 'Tue', num: 12 },
          { name: 'Wed', num: 13, active: true },
          { name: 'Thu', num: 14 },
          { name: 'Fri', num: 15 },
          { name: 'Sat', num: 16 },
          { name: 'Sun', num: 17 },
        ].map((dayObj) => (
          <div
            key={dayObj.num}
            className="flex flex-col items-center justify-center border-r border-[#F2F2F2] bg-white py-3 text-center last:border-r-0 dark:border-zinc-800/80 dark:bg-zinc-900"
          >
            <span className="text-xs font-medium tracking-wider text-[#C2C2C2]  dark:text-gray-500">
              {dayObj.name}
            </span>
            <span
              className={`mt-1 flex h-8 w-8 items-center justify-center rounded-lg text-base font-medium ${
                dayObj.active
                  ? 'text-primary bg-[#F9F4FF] dark:bg-primary dark:text-purple-400'
                  : 'text-[#5D5D5D] dark:text-gray-200'
              }`}
            >
              {dayObj.num}
            </span>
          </div>
        ))}
      </div>

      {/* Hourly Slots Scrollable Area */}
      <div className="scrollbar-hidden max-h-[580px] flex-1 overflow-y-auto">
        {[
          '1 AM',
          '2 AM',
          '3 AM',
          '4 AM',
          '5 AM',
          '6 AM',
          '7 AM',
          '8 AM',
          '9 AM',
          '10 AM',
          '11 AM',
        ].map((hour) => (
          <div
            key={hour}
            className="grid grid-cols-[64px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-0 border-b border-[#F2F2F2] last:border-b-0 dark:border-zinc-800/80"
          >
            {/* Time Label */}
            <div className="border-r border-[#F2F2F2] bg-white py-4 pr-3 text-right text-[10px] font-semibold text-[#C2C2C2] dark:border-zinc-800/80 dark:bg-zinc-900 dark:text-gray-500">
              {hour}
            </div>

            {/* Day Columns (Mon to Sun) */}
            {Array.from({ length: 7 }).map((_, colIndex) => {
              const isWednesday = colIndex === 2;

              return (
                <div
                  key={colIndex}
                  className="min-h-[90px] border-r border-[#F2F2F2] bg-white p-2 transition-colors last:border-r-0 hover:bg-gray-50/20 dark:border-zinc-800/80 dark:bg-zinc-900"
                >
                  {/* Render Wednesday Tasks specifically matching mockup */}
                  {isWednesday && hour === '1 AM' && (
                    <div className="truncate rounded-lg border border-[#F2F2F2] bg-white p-2.5 text-xs font-semibold text-[#181818] shadow-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-300">
                      Morning Workout...
                    </div>
                  )}

                  {isWednesday && hour === '2 AM' && (
                    <div className="truncate rounded-lg border border-[#F2F2F2] bg-white p-2.5 text-xs font-semibold text-[#181818] shadow-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-300">
                      Complete Work T...
                    </div>
                  )}

                  {isWednesday && hour === '4 AM' && (
                    <div className="border-b-primary relative flex flex-col gap-1.5 rounded-lg border border-b-2 border-[#F2F2F2] bg-white p-2.5 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-primary h-1.5 w-1.5 rounded-full"></span>
                        <span className="text-xs font-semibold text-[#181818] dark:text-gray-300">
                          Exercise Routine
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="rounded border border-red-100 bg-red-50 px-1.5 py-0.5 text-[8px] font-bold text-red-500 dark:border-none dark:bg-red-950/30 dark:text-red-400">
                          URGENT
                        </span>
                        <span className="rounded border border-gray-100 bg-gray-50 px-1.5 py-0.5 text-[8px] font-bold text-gray-500 dark:border-none dark:bg-zinc-700 dark:text-gray-400">
                          TO DO
                        </span>
                      </div>
                    </div>
                  )}

                  {isWednesday && hour === '7 AM' && (
                    <div className="flex flex-col gap-1.5 rounded-lg border border-[#F2F2F2] bg-white p-2.5 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
                      <div>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#F2F2F2] px-1.5 py-0.5 text-[8px] font-semibold text-[#5D5D5D] dark:bg-zinc-700 dark:text-gray-400">
                          <RefreshCw size={8} className="text-[#5D5D5D]" />
                          <span>1 Habit</span>
                        </span>
                      </div>
                      <span className="text-xs leading-snug font-semibold text-[#181818] dark:text-gray-300">
                        Update Resume and LinkedIn Pro...
                      </span>
                      <div className="mt-0.5 flex flex-wrap items-center gap-1">
                        <span className="rounded border border-[#F2F2F2] bg-gray-50 px-1.5 py-0.5 text-[8px] font-bold text-[#5D5D5D] dark:border-none dark:bg-zinc-700 dark:text-gray-400">
                          LOW
                        </span>
                        <span className="dark:text-gray-350 rounded border border-[#F2F2F2] bg-gray-50 px-1.5 py-0.5 text-[8px] font-bold text-[#5D5D5D] dark:border-none dark:bg-zinc-700">
                          IN PROGRESS
                        </span>
                        <span className="rounded border border-[#F2F2F2] px-1.5 py-0.5 text-[8px] font-bold text-[#5D5D5D] dark:border-zinc-700">
                          Health
                        </span>
                        <span className="ml-1 flex items-center gap-1 text-[8px] font-bold text-[#5D5D5D] dark:text-gray-500">
                          <Clock size={10} className="text-[#5D5D5D]" />
                          <span>115 Min</span>
                        </span>
                      </div>
                    </div>
                  )}

                  {isWednesday && hour === '11 AM' && (
                    <div className="flex flex-col gap-1.5 rounded-lg border border-[#F2F2F2] bg-white p-2.5 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
                      <span className="text-xs leading-snug font-semibold text-[#181818] dark:text-gray-300">
                        Career Development Plan
                      </span>
                      <div className="mt-0.5 flex flex-wrap items-center gap-1">
                        <span className="rounded border border-orange-100 bg-orange-50 px-1.5 py-0.5 text-[8px] font-bold text-orange-500 dark:border-none dark:bg-orange-950/30 dark:text-orange-400">
                          HIGH
                        </span>
                        <span className="rounded border border-[#F2F2F2] bg-gray-50 px-1.5 py-0.5 text-[8px] font-bold text-[#5D5D5D] dark:border-none dark:bg-zinc-700 dark:text-gray-300">
                          IN PROGRESS
                        </span>
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
