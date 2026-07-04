import React from 'react';
import { Sparkles, Clock, Target, BarChart2 } from 'lucide-react';

export default function DailyView({ currentDate, selectedDate, isLoading, aiActionState, onAccept, onDismiss }) {
  // Get short weekday name and date number of selectedDate or currentDate
  const dateToUse = selectedDate || currentDate || new Date(2026, 4, 13);
  const weekdayShort = dateToUse.toLocaleDateString('en-US', { weekday: 'short' });
  const dateNum = dateToUse.getDate();

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
        {/* Daily Date Header Skeleton */}
        <div className="flex flex-col items-start border-b border-gray-100 bg-white p-4 dark:border-zinc-800/80 dark:bg-zinc-900">
          <div className="h-3 w-10 animate-pulse rounded bg-gray-200 dark:bg-zinc-800"></div>
          <div className="mt-1.5 h-7 w-7 animate-pulse rounded-lg bg-gray-200 dark:bg-zinc-800"></div>
        </div>

        {/* Shimmer Slots */}
        <div className="max-h-[580px] flex-1 overflow-y-auto p-4 space-y-4">
          {[1, 2, 3, 4, 5].map((val) => (
            <div key={val} className="flex gap-4 items-center animate-pulse">
              <div className="h-4 w-10 rounded bg-gray-150 dark:bg-zinc-850"></div>
              <div className="flex-1 h-20 rounded-xl bg-gray-100 dark:bg-zinc-800 flex flex-col justify-center px-4 gap-2">
                <div className="h-3.5 w-1/3 rounded bg-gray-200 dark:bg-zinc-700"></div>
                <div className="h-2 w-1/2 rounded bg-gray-200 dark:bg-zinc-700"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
      {/* Daily Date Header */}
      <div className="flex flex-col items-start border-b border-gray-100 bg-white p-4 dark:border-zinc-800/80 dark:bg-zinc-900">
        <span className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase dark:text-gray-500">
          {weekdayShort}
        </span>
        <span className="mt-1 flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100/70 text-sm font-bold text-[#7C3AED] dark:bg-purple-950/40 dark:text-purple-400">
          {dateNum}
        </span>
      </div>

      {/* Daily Scrollable Grid */}
      <div className="scrollbar-white max-h-[580px] flex-1 overflow-y-auto">
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
            className="relative grid grid-cols-[64px_minmax(0,1fr)] gap-0 border-b border-gray-100 last:border-b-0 dark:border-zinc-800/80"
          >
            {/* Hour Label */}
            <div className="border-r border-gray-100 bg-white py-4 pr-3 text-right text-[10px] font-semibold text-gray-400 dark:border-zinc-800/80 dark:bg-zinc-900 dark:text-gray-500">
              {hour}
            </div>

            {/* Hour Task Slot */}
            <div className="relative flex min-h-[90px] flex-col justify-center bg-white p-3 dark:bg-zinc-900">
              {/* Time Line Indicator Overlay at 4 AM slot */}
              {hour === '4 AM' && !isLoading && (
                <div className="pointer-events-none absolute top-1/4 right-0 left-0 z-10 flex -translate-y-1/2 items-center">
                  <div className="ml-[-4px] h-2 w-2 rounded-full border border-white bg-purple-600 shadow-sm dark:border-zinc-900"></div>
                  <div className="h-[2px] flex-1 bg-purple-500/85"></div>
                </div>
              )}

              {hour === '1 AM' && aiActionState !== 'free_evening' && (
                <div className={`flex flex-col sm:flex-row sm:items-center w-full justify-start gap-2.5 rounded-lg border border-gray-100 bg-white p-3 shadow-sm dark:border-zinc-700 dark:bg-zinc-800 transition-all ${aiActionState === 'optimized' ? 'border-purple-200 bg-purple-50/10' : ''}`}>
                  <span className="text-xs font-medium text-slate-700 dark:text-gray-300">
                    Morning Workout Routine
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="rounded bg-[#F973160D] px-2 py-0.5 text-[8px] font-medium text-[#F97316] dark:border-none dark:bg-[#F973160D] dark:text-orange-400">
                      HIGH
                    </span>
                    <span className="text-primary flex items-center gap-1 rounded bg-[#7C3AED]/10 px-2 py-0.5 text-[8px] font-medium dark:border-none dark:bg-[#F9F4FF] dark:text-purple-400">
                      <Sparkles size={8} /> AI
                    </span>
                    {aiActionState === 'optimized' && (
                      <span className="text-[8px] font-semibold bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400 px-2 py-0.5 rounded">
                        Optimized
                      </span>
                    )}
                    <div className="mx-0.5 h-3 w-[1px] bg-gray-200 dark:bg-zinc-700"></div>
                    <span className="rounded border border-gray-100 bg-gray-50 px-2 py-0.5 text-[8px] font-medium text-gray-400 dark:border-none dark:bg-zinc-700 dark:text-gray-400">
                      TO DO
                    </span>
                  </div>
                </div>
              )}

              {hour === '2 AM' && aiActionState !== 'free_evening' && (
                <>
                  {aiActionState === 'overload_reduced' ? (
                    <div className="flex w-full items-center justify-between gap-2.5 rounded-lg border border-dashed border-gray-200 bg-gray-50/30 p-3.5 dark:border-zinc-700 dark:bg-zinc-800/20 opacity-60">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-slate-400 line-through dark:text-gray-500">
                          Complete Work Task
                        </span>
                        <span className="text-[9px] text-[#7C3AED] dark:text-purple-400 font-semibold mt-0.5">
                          Rescheduled to tomorrow morning by AI to reduce overload
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center w-full justify-start gap-2.5 rounded-lg border border-gray-100 bg-white p-3 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
                      <span className="text-xs font-medium text-slate-700 dark:text-gray-300">
                        Complete Work Task
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="rounded border border-yellow-100 bg-yellow-50 px-2 py-0.5 text-[8px] font-bold text-yellow-600 dark:border-none dark:bg-yellow-950/30 dark:text-yellow-400">
                          MEDIUM
                        </span>
                        <div className="mx-0.5 h-3 w-[1px] bg-gray-200 dark:bg-zinc-700"></div>
                        <span className="rounded border border-gray-100 bg-gray-50 px-2 py-0.5 text-[8px] font-bold text-gray-400 dark:border-none dark:bg-zinc-700 dark:text-gray-400">
                          TO DO
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}

              {hour === '4 AM' && aiActionState !== 'free_evening' && (
                <div className={`flex w-full flex-col gap-1 rounded-lg border border-gray-100 bg-white p-3 shadow-sm dark:border-zinc-700 dark:bg-zinc-800 transition-all ${aiActionState === 'optimized' ? 'border-purple-200 bg-purple-50/10' : ''}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-start gap-2">
                    <span className="text-xs font-medium text-slate-700 dark:text-gray-300">
                      Exercise Routine
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="rounded bg-red-50 px-2 py-0.5 text-[8px] font-medium text-red-500 dark:border-none dark:text-red-400">
                        URGENT
                      </span>
                      <span className="flex items-center gap-1 rounded border border-[#7C3AED]/20 bg-[#7C3AED]/10 px-2 py-0.5 text-[8px] font-medium text-[#7C3AED] dark:border-none dark:bg-purple-950/30 dark:text-purple-400">
                        <Sparkles size={8} /> AI
                      </span>
                      {aiActionState === 'optimized' && (
                        <span className="text-[8px] font-semibold bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400 px-2 py-0.5 rounded">
                          Time Adjusted (Optimized)
                        </span>
                      )}
                      <div className="mx-0.5 h-3 w-[1px] bg-gray-200 dark:bg-zinc-700"></div>
                      <span className="rounded bg-gray-50 px-2 py-0.5 text-[8px] font-medium text-gray-400 dark:border-none dark:text-gray-400">
                        TO DO
                      </span>
                    </div>
                  </div>
                  <p className="mt-0.5 text-[10px] text-gray-400 dark:text-gray-500">
                    Follow your fitness routine or do a workout session.
                  </p>
                </div>
              )}

              {hour === '7 AM' && aiActionState !== 'free_evening' && (
                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Update Resume card */}
                  <div className="flex flex-col gap-2 rounded-lg border border-gray-100 bg-white p-3.5 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-405 rounded border border-gray-100 bg-gray-50 px-2 py-0.5 text-[8px] font-bold dark:border-none dark:bg-zinc-700 dark:text-gray-400">
                        LOW
                      </span>
                      <span className="rounded border border-gray-100 bg-gray-50 px-2 py-0.5 text-[8px] font-bold text-gray-500 dark:border-none dark:bg-zinc-700 dark:text-gray-300">
                        IN PROGRESS
                      </span>
                    </div>
                    <span className="text-xs leading-snug font-medium text-slate-700 dark:text-gray-300">
                      Update Resume and LinkedIn Profile
                    </span>
                    <p className="truncate text-[10px] leading-relaxed text-gray-400 dark:text-gray-500">
                      Communicate the expectations regarding maintaining a calm...
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="rounded-lg border border-gray-200 px-2 py-0.5 text-[8px] font-semibold text-gray-400 dark:border-zinc-700">
                        Health
                      </span>
                      <span className="flex items-center gap-1 text-[8px] font-semibold text-gray-400 dark:text-gray-500">
                        <Clock size={8} /> 115 Min
                      </span>
                    </div>
                  </div>

                  {/* Drink Water card */}
                  <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-white p-3.5 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
                    <div className="flex flex-col gap-1 pr-4 min-w-0">
                      <span className="text-xs font-medium text-slate-700 dark:text-gray-300">
                        Drink Water
                      </span>
                      <p className="truncate text-[10px] leading-relaxed text-gray-400 dark:text-gray-500">
                        Stay hydrated throughout the day Stay hydrated throughout...
                      </p>
                    </div>
                    <div className="flex min-w-[48px] flex-col items-center justify-center rounded-lg border border-gray-100 p-2 dark:border-zinc-700">
                      <div className="mb-1 h-4 w-4 rounded border border-gray-300 dark:border-zinc-600"></div>
                      <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500">
                        0/2
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Recalibrate AI Suggested card at 8 AM */}
              {hour === '8 AM' && aiActionState === 'recalibrated' && (
                <div className="flex flex-col md:flex-row md:items-center w-full justify-between gap-3 rounded-lg border border-purple-200 bg-purple-50/20 p-3.5 shadow-sm dark:border-purple-900/40 dark:bg-purple-950/10 animate-fade-in">
                  <div className="flex flex-col gap-1 pr-4 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-purple-700 dark:text-purple-400">
                        Read Book & Meditate
                      </span>
                      <span className="text-primary flex items-center gap-1 rounded bg-[#7C3AED]/10 px-2 py-0.5 text-[8px] font-medium dark:border-none dark:bg-[#F9F4FF] dark:text-purple-400">
                        <Sparkles size={8} /> AI Suggested
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500">
                      30 mins of reading followed by mindfulness meditation.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={onAccept} className="rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-purple-700">
                      Accept
                    </button>
                    <button onClick={onDismiss} className="rounded-lg bg-gray-100 dark:bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-gray-300 hover:bg-gray-200">
                      Dismiss
                    </button>
                  </div>
                </div>
              )}

              {hour === '11 AM' && aiActionState !== 'free_evening' && (
                <div className={`flex w-full flex-col gap-1.5 rounded-lg border border-gray-100 bg-white p-3.5 shadow-sm dark:border-zinc-700 dark:bg-zinc-800 transition-all ${aiActionState === 'recalibrated' ? 'border-purple-200 bg-purple-50/10' : ''}`}>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-gray-300">
                      Career Development Plan
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="rounded border border-orange-100 bg-orange-50 px-2 py-0.5 text-[8px] font-bold text-orange-500 dark:border-none dark:bg-orange-950/30 dark:text-orange-400">
                        HIGH
                      </span>
                      <span className="flex items-center gap-1 rounded border border-[#7C3AED]/20 bg-[#7C3AED]/10 px-2 py-0.5 text-[8px] font-bold text-[#7C3AED] dark:border-none dark:bg-purple-950/30 dark:text-purple-400">
                        <Sparkles size={8} /> AI
                      </span>
                      {aiActionState === 'recalibrated' && (
                        <span className="text-[8px] font-semibold bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400 px-2 py-0.5 rounded">
                          AI Balanced
                        </span>
                      )}
                      <div className="mx-0.5 h-3 w-[1px] bg-gray-200 dark:bg-zinc-700"></div>
                      <span className="rounded border border-gray-100 bg-gray-50 px-2 py-0.5 text-[8px] font-bold text-gray-500 dark:border-none dark:bg-zinc-700 dark:text-gray-300">
                        IN PROGRESS
                      </span>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">
                    Stick to your professional development plan or engage in a skills training
                    session.
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <span className="rounded-lg border border-gray-200 px-2 py-0.5 text-[8px] font-semibold text-gray-400 dark:border-zinc-700">
                      Career
                    </span>
                    <span className="flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-0.5 text-[8px] font-semibold text-gray-400 dark:border-zinc-700">
                      <Target size={8} /> Improve Rate
                    </span>
                    <span className="flex items-center gap-1 text-[8px] font-semibold text-gray-400 dark:text-gray-500">
                      <Clock size={8} /> 60 Min
                    </span>
                    <span className="flex items-center gap-1 text-[8px] font-semibold text-gray-400 dark:text-gray-500">
                      <BarChart2 size={8} /> 0/4 Steps
                    </span>
                  </div>
                </div>
              )}

              {/* Faded empty slot representation when evening is freed up */}
              {aiActionState === 'free_evening' && (
                <div className="text-center py-4 text-xs text-gray-350 dark:text-zinc-600 italic">
                  Evening freed up by AI assistant.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
