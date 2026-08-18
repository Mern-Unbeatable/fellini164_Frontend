import React from 'react';

const WeeklyFocus = ({ weekLabel, weekTotal }) => {
  return (
    <div className="rounded-2xl border border-[#f2f2f2] bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800 sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-semibold text-[#181818] dark:text-white">Weekly focus</h2>
          <p className="mt-0.5 text-[12px] font-medium text-[#a3a3a3] dark:text-zinc-400">
            {weekLabel} · minutes planned per day
          </p>
        </div>
        <span className="shrink-0 rounded-md bg-[rgba(59,130,246,0.08)] px-2 py-1 text-[11px] font-medium text-[#3b82f6] dark:bg-blue-950/40 dark:text-blue-300">
          {weekTotal} this week
        </span>
      </div>

      <div className="relative h-35 overflow-hidden rounded-xl border border-[#f2f2f2] bg-[#fcfcfc] dark:border-zinc-700 dark:bg-zinc-900/50">
        <div className="absolute inset-x-4 top-5 bottom-5 flex flex-col justify-between">
          {[0, 1, 2, 3].map((line) => (
            <div key={line} className="h-px w-full bg-[#ececec] dark:bg-zinc-700" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeeklyFocus;
