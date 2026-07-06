import React from 'react';
import { TrendingUp, Flame, Award } from 'lucide-react';

const FocusAnalytics = () => {
  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-[#f2f2f2] bg-[#fcfcfc] p-5 dark:border-zinc-700 dark:bg-zinc-800">
      <h2 className="mb-4 flex items-center gap-2 text-[14px] font-semibold text-[#181818] lg:text-[13px] dark:text-white">
        <TrendingUp size={15} className="text-[#8022fe]" /> Focus Analytics
      </h2>
      <div className="grid flex-1 grid-cols-2 gap-3">
        <div className="flex flex-col justify-center rounded-xl border border-[#f2f2f2] bg-white p-3 dark:border-zinc-700/50 dark:bg-zinc-900/50">
          <div className="text-[10px] font-medium tracking-wider text-gray-400 uppercase">
            Focus Streak
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[18px] font-bold text-[#181818] dark:text-white">
            <Flame size={16} className="fill-orange-500 text-orange-500" /> 14 Days
          </div>
        </div>
        <div className="flex flex-col justify-center rounded-xl border border-[#f2f2f2] bg-white p-3 dark:border-zinc-700/50 dark:bg-zinc-900/50">
          <div className="text-[10px] font-medium tracking-wider text-gray-400 uppercase">
            Goal Score
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[18px] font-bold text-[#181818] dark:text-white">
            <Award size={16} className="text-[#8022fe]" /> 98%
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusAnalytics;
