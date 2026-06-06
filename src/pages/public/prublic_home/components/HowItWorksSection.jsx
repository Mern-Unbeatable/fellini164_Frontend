
import React from 'react';

const HowItWorksSection = () => {
  return (
    <section id='how-it-works' className="w-full py-12 md:py-20 bg-white dark:bg-black">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-20">
        <div className="flex flex-col items-center justify-start gap-10 md:gap-16">
          {/* Section Header */}
          <div className="flex w-full flex-col items-center justify-start gap-2">
            <div className="text-center">
              <span className="font-['Inter'] text-2xl font-semibold text-black dark:text-white md:text-3xl lg:text-4xl">
                How ELYXA 
              </span>
              <span className="font-['Inter'] text-2xl font-semibold text-indigo-600 dark:text-indigo-400 md:text-3xl lg:text-4xl">
                {' '}
                Works
              </span>
            </div>
            {/* <div className="w-full text-center font-['Inter'] text-sm leading-6 font-normal text-zinc-600 dark:text-white md:text-base">
              Four simple steps to transform your productivity.
            </div> */}
          </div>

          {/* Step 1 */}
          <div className="flex w-full flex-col items-center justify-between gap-8 lg:flex-row lg:gap-12">
            <div className="flex w-full flex-col items-start justify-start gap-6 md:gap-8 lg:w-96">
              <div className="w-full bg-gradient-to-b from-[#462A94] to-[#666666]/10   dark:text-violet-400 bg-clip-text font-['Inter'] text-4xl font-extrabold text-transparent md:text-5xl lg:text-6xl">
                01
              </div>
              <div className="flex w-full flex-col items-start justify-start gap-2">
                <div className="w-full font-['Inter'] text-2xl font-semibold text-black dark:text-white md:text-3xl">
                  Context-Aware Modeling
                </div>
                <div className="w-full font-['Inter'] text-sm leading-6 font-normal text-zinc-600 dark:text-white md:text-base">
                   Tell Elyxa what you’re optimizing for - projects, focus areas, or energy patterns. It builds a model of your priorities, not just a static list.
                </div>
              </div>
            </div>
            <img
              className="w-full rounded-2xl object-contain md:h-80 lg:h-[470px] lg:w-[470px]"
              src="/images/Step1.png"
              alt="Step 1"
            />
          </div>

          {/* Step 2 */}
          <div className="flex w-full flex-col-reverse items-center justify-between gap-8 lg:flex-row lg:gap-12">
            <img
              className="w-full rounded-2xl object-contain md:h-80 lg:h-[470px] lg:w-[470px]"
              src="/images/Step2.png"
              alt="Step 2"
            />
            <div className="flex w-full flex-col items-start justify-start gap-6 md:gap-8 lg:w-96">
              <div className="w-full bg-gradient-to-b from-[#462A94] to-[#666666]/10 bg-clip-text font-['Inter'] text-4xl font-extrabold text-transparent md:text-5xl lg:text-6xl dark:text-violet-400">
                02
              </div>
              <div className="flex w-full flex-col items-start justify-start gap-2">
                <div className="w-full font-['Inter'] text-2xl font-semibold text-black dark:text-white md:text-3xl">
                  <div className="whitespace-nowrap">Execution Tracking</div>
                  
                </div>
                <div className="w-full font-['Inter'] text-sm leading-6 font-normal text-zinc-600 dark:text-white md:text-base">
                  As you work, Elyxa senses the "drift" between your plan and reality. It identifies what's still achievable and what needs to shift.                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex w-full flex-col items-center justify-between gap-8 lg:flex-row lg:gap-12">
            <div className="flex w-full flex-col items-start justify-start gap-6 md:gap-8 lg:w-96">
              <div className="w-full bg-gradient-to-b from-[#462A94] to-[#666666]/10 bg-clip-text font-['Inter'] text-4xl font-extrabold text-transparent md:text-5xl lg:text-6xl dark:text-violet-400">
                03
              </div>
              <div className="flex w-full flex-col items-start justify-start gap-2">
                <div className="w-full font-['Inter'] text-2xl font-semibold text-black dark:text-white md:text-3xl">
                  Adaptive Recalibration 
                </div>
                <div className="w-full font-['Inter'] text-sm leading-6 font-normal text-zinc-600 dark:text-white md:text-base">
                  When life happens, hit Recalibrate. Elyxa suggests a revised path, showing you what to focus on, what to defer, and what to drop entirely.
                </div>
              </div>
            </div>
            <img
              className="w-full rounded-2xl object-contain md:h-80 lg:h-[470px] lg:w-[470px]"
              src="/images/Step3.png"
              alt="Step 3"
            />
          </div>

         
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;