import React from 'react';
import { MessageSquareDot } from 'lucide-react';

const DailyQuote = () => {
  return (
    <div className="flex h-full items-start gap-4 rounded-2xl border border-[#f2f2f2] bg-[#fcfcfc] p-5 dark:border-zinc-700 dark:bg-zinc-800">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f9f4ff] text-[#8022fe] dark:bg-zinc-700 dark:text-gray-300">
        <MessageSquareDot size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="mb-1.5 text-[14px] font-semibold text-[#181818] lg:text-[13px] dark:text-white">
          Daily Quote
        </h2>
        <p className="text-[13px] leading-relaxed text-gray-600 italic dark:text-gray-300">
          "Success is not final, failure is not fatal: it is the courage to continue that
          counts."
        </p>
        <span className="mt-1 block text-[11px] font-medium text-gray-400">
          — Winston Churchill
        </span>
      </div>
    </div>
  );
};

export default DailyQuote;
