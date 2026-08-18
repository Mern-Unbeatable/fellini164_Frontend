import React from 'react';

const FocusTimeToday = ({ loggedLabel, footer }) => {
  return (
    <div className="rounded-2xl border border-[#f2f2f2] bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800 sm:p-5">
      <h2 className="text-[15px] font-semibold text-[#181818] dark:text-white">Focus time today</h2>
      <div className="mt-3 h-22 rounded-xl border border-[#f2f2f2] bg-[#fcfcfc] dark:border-zinc-700 dark:bg-zinc-900/50" />
      <p className="mt-3 text-[12px] font-medium text-[#a3a3a3] dark:text-zinc-400">
        {loggedLabel} · {footer}
      </p>
    </div>
  );
};

export default FocusTimeToday;
