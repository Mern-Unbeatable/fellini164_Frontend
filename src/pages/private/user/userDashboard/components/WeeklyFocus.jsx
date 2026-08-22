import React, { useMemo } from 'react';

const WeeklyFocus = ({ weekLabel, weekTotal, days = [] }) => {
  const maxMinutes = useMemo(() => {
    const max = Math.max(...days.map((d) => Number(d.minutes) || 0), 0);
    return max > 0 ? max : 1;
  }, [days]);

  return (
    <div className="rounded-2xl border border-[#f2f2f2] bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800 sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-semibold text-[#181818] dark:text-white">Weekly focus</h2>
          <p className="mt-0.5 text-[12px] font-medium text-[#a3a3a3] dark:text-zinc-400">
            {weekLabel || 'This week'} · minutes planned per day
          </p>
        </div>
        <span className="shrink-0 rounded-md bg-[rgba(59,130,246,0.08)] px-2 py-1 text-[11px] font-medium text-[#3b82f6] dark:bg-blue-950/40 dark:text-blue-300">
          {weekTotal || '0m'} this week
        </span>
      </div>

      <div className="flex h-56 items-end gap-2 bg-white px-1 sm:h-64 sm:gap-3">
        {days.length === 0 ? (
          <p className="w-full self-center text-center text-[13px] font-medium text-[#a3a3a3]">
            No weekly focus data yet.
          </p>
        ) : (
          days.map((day) => {
            const minutes = Number(day.minutes) || 0;
            const heightPct = Math.max(8, Math.round((minutes / maxMinutes) * 100));
            return (
              <div key={day.date || day.day} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <span className="text-[10px] font-medium text-[#a3a3a3]">{minutes}m</span>
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-md bg-[#8022fe]/80"
                    style={{ height: `${heightPct}%` }}
                    title={`${day.day}: ${minutes}m`}
                  />
                </div>
                <span className="text-[11px] font-medium text-[#5d5d5d] dark:text-gray-300">{day.day}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default WeeklyFocus;
