import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const SmartCoachSection = () => {
  return (
    <section className="w-full bg-neutral-100 py-12 md:py-20 dark:bg-zinc-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-20">
        <div className="flex flex-col items-center justify-start gap-12 lg:flex-row lg:gap-64">
          <div className="flex w-full flex-col items-start justify-start gap-6 md:gap-8 lg:w-[519px]">
            <div className="flex w-full flex-col items-start justify-start gap-3 md:gap-4">
              <div className="w-full">
                <span className="font-['Inter'] text-2xl font-semibold text-black md:text-3xl lg:text-4xl dark:text-white">
                  Meet Smart Coach AI{' '}
                </span>
                <span className="font-['Inter'] text-2xl font-semibold text-violet-600 md:text-3xl lg:text-4xl dark:text-violet-400">
                  Productivity That{' '}
                </span>
                <span className="font-['Playfair_Display'] text-2xl font-semibold text-violet-600 italic md:text-3xl lg:text-4xl dark:text-violet-400">
                  Thinks <br /> Ahead
                </span>
              </div>
              <div className="w-full">
                <span className="font-['Inter'] text-sm leading-6 font-semibold text-zinc-600 md:text-base dark:text-white">
                  Smart Coach AI
                </span>
                <span className="font-['Inter'] text-base leading-6 font-normal text-zinc-600 md:text-base dark:text-white">
                  {' '}
                  is not just a planner. It’s an AI-powered life system that understands your goals, analyzes your behavior, and continuously adjusts your plans to help you succeed.
                </span>
              </div>
            </div>
            <div className="flex w-full flex-col items-start justify-start gap-3 md:gap-4">
              <div className="inline-flex w-full items-center justify-start gap-2">
                <CheckCircle2 className="h-5 w-5 shrink-0 fill-violet-500 text-white" />
                <div className="flex-1 font-['Inter'] text-sm leading-6 font-medium text-zinc-600 md:text-base dark:text-white">
                 Personalized daily, weekly, & monthly plans.
                </div>
              </div>
              <div className="inline-flex w-full items-center justify-start gap-2">
                <CheckCircle2 className="h-5 w-5 shrink-0 fill-violet-500 text-white" />
                <div className="flex-1 font-['Inter'] text-sm leading-6 font-medium text-zinc-600 md:text-base dark:text-white">
                  AI coach that learns your habits.
                </div>
              </div>
              <div className="inline-flex w-full items-center justify-start gap-2">
                <CheckCircle2 className="h-5 w-5 shrink-0 fill-violet-500 text-white" />
                <div className="flex-1 font-['Inter'] text-sm leading-6 font-medium text-zinc-600 md:text-base dark:text-white">
                  Smart task & habit optimization.
                </div>
              </div>
              <div className="inline-flex w-full items-center justify-start gap-2">
                <CheckCircle2 className="h-5 w-5 shrink-0 fill-violet-500 text-white" />
                <div className="flex-1 font-['Inter'] text-sm leading-6 font-medium text-zinc-600 md:text-base dark:text-white">
                  Real-time progress tracking.
                </div>
              </div>
              <div className="inline-flex w-full items-center justify-start gap-2">
                <CheckCircle2 className="h-5 w-5 shrink-0 fill-violet-500 text-white" />
                <div className="flex-1 font-['Inter'] text-sm leading-6 font-medium text-zinc-600 md:text-base dark:text-white">
                  Automatic plan rebalancing.
                </div>
              </div>
            </div>
          </div>
          <img
            className="h-64 w-full rounded-3xl object-cover md:h-96 lg:w-[543px]"
            src="/images/humans.png"
            alt="Smart Coach AI"
          />
        </div>
      </div>
    </section>
  );
};

export default SmartCoachSection;
