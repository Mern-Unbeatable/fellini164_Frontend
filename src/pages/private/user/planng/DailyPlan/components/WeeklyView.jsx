import React from 'react';
import { RefreshCw, Clock } from 'lucide-react';
import { PLANNER_HOURS, dateKeyFromDate, getWeekDays } from '../plannerData';

const PRIORITY_STYLES = {
  URGENT: 'bg-[rgba(220,38,38,0.05)] text-[#dc2626]',
  HIGH: 'bg-[rgba(249,115,22,0.05)] text-[#f97316]',
  MEDIUM: 'bg-[rgba(202,138,4,0.05)] text-[#ca8a04]',
  LOW: 'bg-[rgba(107,114,128,0.05)] text-[#6b7280]',
};

function WeekItemCard({ item, ghost }) {
  const base = `flex flex-col gap-1.5 rounded-lg p-2.5 shadow-sm transition-all dark:bg-zinc-800 ${
    ghost
      ? 'border-2 border-dashed border-[#e2e2e2] bg-white opacity-40 hover:border-solid hover:opacity-100 dark:border-zinc-700 dark:bg-zinc-800'
      : 'border border-[#F2F2F2] bg-white dark:border-zinc-700'
  }`;

  if (item.kind === 'habit') {
    return (
      <div className={base}>
        <span className="inline-flex w-fit items-center gap-1 rounded-full bg-[#F2F2F2] px-1.5 py-0.5 text-[8px] font-semibold text-[#5D5D5D] dark:bg-zinc-700 dark:text-gray-400">
          <RefreshCw size={8} className="text-[#5D5D5D]" />
          <span>1 Habit</span>
        </span>
        <span className="truncate text-xs leading-snug font-semibold text-[#181818] dark:text-gray-300">
          {item.title}
        </span>
      </div>
    );
  }

  return (
    <div className={item.priority === 'URGENT' ? `${base} border-b-primary border-b-2` : base}>
      <div className="flex items-center gap-1.5">
        {item.priority === 'URGENT' && <span className="bg-primary h-1.5 w-1.5 shrink-0 rounded-full" />}
        <span className="truncate text-xs font-semibold text-[#181818] dark:text-gray-300">
          {item.title}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-1">
        {item.priority && (
          <span className={`rounded px-1.5 py-0.5 text-[8px] font-bold uppercase ${PRIORITY_STYLES[item.priority]}`}>
            {item.priority}
          </span>
        )}
        {item.status && (
          <span className="rounded border border-gray-100 bg-gray-50 px-1.5 py-0.5 text-[8px] font-bold text-gray-500 dark:border-none dark:bg-zinc-700 dark:text-gray-400">
            {item.status.toUpperCase()}
          </span>
        )}
        {item.category && (
          <span className="rounded border border-[#F2F2F2] px-1.5 py-0.5 text-[8px] font-bold text-[#5D5D5D] dark:border-zinc-700">
            {item.category}
          </span>
        )}
        {item.durationLabel && (
          <span className="ml-1 flex items-center gap-1 text-[8px] font-bold text-[#5D5D5D] dark:text-gray-500">
            <Clock size={10} className="text-[#5D5D5D]" />
            <span>{item.durationLabel}</span>
          </span>
        )}
      </div>
    </div>
  );
}

export default function WeeklyView({ currentDate, selectedDate, plans, hasAcceptedPlan, isLoading }) {
  const anchorDate = selectedDate || currentDate || new Date(2026, 4, 13);
  const weekDays = getWeekDays(anchorDate);
  const selectedKey = dateKeyFromDate(anchorDate);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[#F2F2F2] bg-white shadow-sm max-lg:h-auto max-lg:flex-none dark:border-zinc-800/80 dark:bg-zinc-900">
      <div className="flex min-h-0 w-full flex-1 flex-col overflow-x-auto">
        <div className="flex min-h-0 w-full min-w-[950px] flex-1 flex-col">
          {/* Weekday Names with Date Numbers */}
          <div className="grid grid-cols-[64px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-0 border-b border-[#F2F2F2] dark:border-zinc-800/80">
            <div className="border-r border-[#F2F2F2] bg-white dark:border-zinc-800/80 dark:bg-zinc-900" />
            {weekDays.map((day) => {
              const isActive = dateKeyFromDate(day) === selectedKey;
              return (
                <div
                  key={day.toISOString()}
                  className="flex min-w-0 flex-col items-center justify-center border-r border-[#F2F2F2] bg-white py-3 text-center last:border-r-0 dark:border-zinc-800/80 dark:bg-zinc-900"
                >
                  <span className="text-xs font-medium tracking-wider text-[#C2C2C2] dark:text-gray-500">
                    {day.toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <span
                    className={`mt-1 flex h-8 w-8 items-center justify-center rounded-lg text-base font-medium ${
                      isActive
                        ? 'text-primary dark:bg-primary bg-[#F9F4FF] dark:text-purple-400'
                        : 'text-[#5D5D5D] dark:text-gray-200'
                    }`}
                  >
                    {day.getDate()}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Hourly Slots Scrollable Area */}
          <div className="scrollbar-hidden flex-1 overflow-y-auto lg:min-h-0 max-lg:max-h-[min(70vh,560px)]">
            {isLoading
              ? [1, 2, 3, 4, 5].map((val) => (
                  <div key={val} className="grid grid-cols-[64px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-0 border-b border-[#F2F2F2] p-2 dark:border-zinc-800/80">
                    <div className="h-4 w-10 animate-pulse rounded bg-gray-200 dark:bg-zinc-800" />
                    <div className="col-span-7 h-16 animate-pulse rounded-lg bg-gray-100 dark:bg-zinc-800" />
                  </div>
                ))
              : PLANNER_HOURS.map((hour) => (
                  <div
                    key={hour}
                    className="grid grid-cols-[64px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-0 border-b border-[#F2F2F2] last:border-b-0 dark:border-zinc-800/80"
                  >
                    <div className="border-r border-[#F2F2F2] bg-white py-4 pr-3 text-right text-[10px] font-semibold text-[#C2C2C2] dark:border-zinc-800/80 dark:bg-zinc-900 dark:text-gray-500">
                      {hour}
                    </div>

                    {weekDays.map((day) => {
                      const dayKey = dateKeyFromDate(day);
                      const dayItems = (plans[dayKey] || []).filter((item) => item.time === hour);

                      return (
                        <div
                          key={dayKey}
                          className="min-h-13 min-w-0 border-r border-[#F2F2F2] bg-white p-2 transition-colors last:border-r-0 hover:bg-gray-50/20 dark:border-zinc-800/80 dark:bg-zinc-900"
                        >
                          {dayItems.map((item) => (
                            <WeekItemCard key={item.id} item={item} ghost={!hasAcceptedPlan} />
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}
