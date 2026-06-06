

import React from 'react';
import { AlertCircle, TrendingDown, XCircle } from 'lucide-react';

const WhyStruggleSection = () => {
  return (
    <section className="w-full py-12 md:py-20 bg-white dark:bg-black">
      <div className="container mx-auto  px-4 sm:px-6 lg:px-20">
        <div className="flex flex-col items-center justify-start gap-10 md:gap-14">
          {/* Header */}
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="font-['Inter'] text-2xl font-bold text-black dark:text-white md:text-4xl lg:text-5xl leading-tight">
              Have You Ever Wondered Why Your <br className="hidden md:block" />
              Plans Keep <span className="text-indigo-600 dark:text-violet-400">Breaking?</span>
            </h2>
            <p className="w-full max-w-3xl font-['Inter'] text-base leading-7 font-normal text-zinc-600 dark:text-zinc-300 md:text-lg md:leading-8">
              Sometimes the problem isn't your motivation - it's that your productivity tools treat your life like a <span className="font-semibold text-zinc-800 dark:text-zinc-100">static contract.</span>
            </p>
          </div>

          {/* Problem Cards */}
          <div className="flex w-full flex-col gap-6 md:gap-8">
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* The Gap */}
            <div className="group relative overflow-hidden rounded-xl border border-violet-100 dark:border-violet-900/30 bg-white dark:bg-zinc-900 p-6 md:p-8 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800/50">
                  <AlertCircle className="h-7 w-7 text-violet-600 dark:text-violet-400" />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <h3 className="font-['Inter'] text-xl font-semibold text-violet-900 dark:text-violet-300 md:text-2xl">
                    The Gap
                  </h3>
                  <p className="font-['Inter'] text-base leading-7 text-zinc-600 dark:text-zinc-300 md:text-lg">
                    Most calendar apps handle the initial setup well, but they fail the moment reality deviates.
                  </p>
                </div>
              </div>
            </div>

            {/* The Consequence */}
            <div className="group relative overflow-hidden rounded-xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-zinc-900 p-6 md:p-8 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50">
                  <TrendingDown className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <h3 className="font-['Inter'] text-xl font-semibold text-indigo-900 dark:text-indigo-300 md:text-2xl">
                    The Consequence
                  </h3>
                  <p className="font-['Inter'] text-base leading-7 text-zinc-600 dark:text-zinc-300 md:text-lg">
                    One long meeting or a sick day turns your calendar into a list of "overdue" chores.
                  </p>
                </div>
              </div>
            </div>
            </div>

            {/* The Result */}
            <div className="group relative overflow-hidden rounded-xl border border-purple-100 dark:border-purple-900/30 bg-white dark:bg-zinc-900 p-6 md:p-8 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/50">
                  <XCircle className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <h3 className="font-['Inter'] text-xl font-semibold text-purple-900 dark:text-purple-300 md:text-2xl">
                    The Result
                  </h3>
                  <p className="font-['Inter'] text-base leading-7 text-zinc-600 dark:text-zinc-300 md:text-lg">
                    You don't get organized; you get "productivity guilt." And most times, it's either restart or shutdown.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyStruggleSection;
