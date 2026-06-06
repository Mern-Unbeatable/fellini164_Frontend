// import React from 'react';
// import { CheckCircle } from 'lucide-react';
// import { Link } from 'react-router-dom';

// const HeroSection = () => {
//   return (
//     <section className="w-full py-12 md:py-20 bg-white dark:bg-black">
//       <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-20">
//         <div className="flex flex-col items-center justify-start gap-16 md:gap-28">
//           <div className="flex w-full flex-col items-center justify-start gap-8 md:gap-10">
//             <div className="flex w-full flex-col items-center justify-start gap-4 md:gap-6">
//               <div className="inline-flex items-center justify-center gap-3.5 rounded-[53.07px] bg-violet-100 dark:bg-violet-300 px-6 py-3">
//                 <div className="font-['Inter'] text-sm font-medium text-violet-900  uppercase md:text-base">
//                   Plan Better. Live Smarter.
//                 </div>
//               </div>
//               <div className="flex w-full max-w-[721px] flex-col gap-3 px-4 text-center">
//                 <span className="font-['Inter'] text-3xl font-semibold text-zinc-800 dark:text-white md:text-5xl lg:text-5xl">
//                   Plan Smarter. Live Better.
//                 </span>
//                 <span className="font-['Inter'] text-3xl font-semibold text-indigo-600 dark:text-indigo-400  italic md:text-5xl lg:text-5xl">
//                   Achieve More — With AI.
//                 </span>
//               </div>
//               <div className="w-full max-w-154 px-4 text-center font-['Inter'] text-sm leading-6 font-normal text-zinc-600 dark:text-white md:text-base">
//                 Elyxa AI is your intelligent daily planning and life-coaching assistant that adapts
//                 to your goals, habits, energy levels, and lifestyle — so you can stay focused,
//                 consistent, and in control.
//               </div>
//             </div>
//             <div className="flex w-full flex-col items-center justify-center gap-6 sm:w-auto sm:flex-row md:gap-6">
//               <div className="flex w-full items-center justify-center gap-2.5 rounded-lg bg-violet-600 dark:bg-violet-500 px-6 py-3 shadow-[0px_10px_20px_0px_rgba(188,150,255,0.5)] md:shadow-[0px_20px_37px_0px_rgba(188,150,255,1.00)] dark:shadow-[0px_10px_20px_0px_rgba(139,92,246,0.3)] dark:md:shadow-[0px_20px_37px_0px_rgba(139,92,246,0.4)] sm:w-auto md:px-8 md:py-4">
//                 <Link
//                   to="/early-access"
//                   className="font-['Inter'] text-sm font-medium text-white dark:text-gray-50 no-underline hover:no-underline md:text-base"
//                 >
//                   Join Early Access{' '}
//                 </Link>
//               </div>
//               <div className="flex w-full items-center justify-center gap-2.5 rounded-lg px-6 py-3 no-underline outline -outline-offset-1 outline-violet-600 dark:outline-white sm:w-auto md:px-8 md:py-4">
//                 <a
//                   href="#how-it-works"
//                   className="font-['Inter'] text-sm font-medium text-violet-600 dark:text-white no-underline hover:no-underline md:text-base"
//                 >
//                   See How It Works
//                 </a>
//               </div>
//             </div>
//           </div>
//           <div className="flex w-full max-w-3xl flex-wrap items-center justify-center gap-5 border-t border-gray-200 pt-8 md:gap-6 md:pt-10 lg:gap-8">
//             <div className="flex items-center justify-start gap-1 md:gap-2">
//               <CheckCircle className="h-4 w-4 shrink-0 text-violet-400" />
//               <div className="font-['Inter'] text-xs leading-4 font-normal whitespace-nowrap text-zinc-600 dark:text-white">
//                 Secure Payments
//               </div>
//             </div>
//             <div className="flex items-center justify-start gap-1 md:gap-2">
//               <CheckCircle className="h-4 w-4 shrink-0 text-violet-400" />
//               <div className="font-['Inter'] text-xs leading-4 font-normal whitespace-nowrap text-zinc-600 dark:text-white">
//                 Encrypted Data
//               </div>
//             </div>
//             <div className="flex items-center justify-start gap-1 md:gap-2">
//               <CheckCircle className="h-4 w-4 shrink-0 text-violet-400" />
//               <div className="font-['Inter'] text-xs leading-4 font-normal whitespace-nowrap text-zinc-600 dark:text-white">
//                 No Passwords Stored
//               </div>
//             </div>
//             <div className="flex items-center justify-start gap-1 md:gap-2">
//               <CheckCircle className="h-4 w-4 shrink-0 text-violet-400 " />
//               <div className="font-['Inter'] text-xs leading-4 font-normal whitespace-nowrap text-zinc-600 dark:text-white">
//                 AI Safety Certified
//               </div>
//             </div>
//             <div className="flex items-center justify-start gap-1 md:gap-2">
//               <CheckCircle className="h-4 w-4 shrink-0 text-violet-400" />
//               <div className="font-['Inter'] text-xs leading-4 font-normal whitespace-nowrap text-zinc-600 dark:text-white">
//                 Powered by OpenAI
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HeroSection;










import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="w-full py-12 md:py-20 bg-white dark:bg-black">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-20">
        <div className="flex flex-col items-center justify-start gap-16 md:gap-28">
          <div className="flex w-full flex-col items-center justify-start gap-8 md:gap-10">
            <div className="flex w-full flex-col items-center justify-start gap-4 md:gap-6">
              <div className="inline-flex items-center justify-center gap-3.5 rounded-[53.07px] bg-violet-100 dark:bg-violet-300 px-6 py-3">
                <div className="font-['Inter'] text-sm font-medium text-violet-900  uppercase md:text-base">
                  Elyxa = Adaptive Planning
                </div>
              </div>
              <div className="flex w-full max-w-[821px] flex-col gap-3 px-4 text-center">
                <span className="font-['Inter'] text-3xl font-semibold text-zinc-800 dark:text-white md:text-5xl lg:text-5xl">
                  Your plans should adapt to your life.
                </span>
                <span className="font-['Inter'] text-3xl font-semibold text-indigo-600 dark:text-indigo-400  italic md:text-5xl lg:text-5xl">
                  Not the other way around.  
                </span>
              </div>
              <div className="w-full max-w-154 px-4 text-center font-['Inter'] text-sm leading-6 font-normal text-zinc-600 dark:text-white md:text-base">
                Stop restarting your week every time life gets messy. Elyxa is an AI-powered execution planning platform that detects when you’re falling behind and automatically recalibrates your day, so you can maintain momentum instead of starting over.
              </div>
            </div>
            <div className="flex w-full flex-col items-center justify-center gap-6 sm:w-auto sm:flex-row md:gap-6">
              <div className="flex w-full items-center justify-center gap-2.5 rounded-lg bg-violet-600 dark:bg-violet-500 px-6 py-3 shadow-[0px_10px_20px_0px_rgba(188,150,255,0.5)] md:shadow-[0px_20px_37px_0px_rgba(188,150,255,1.00)] dark:shadow-[0px_10px_20px_0px_rgba(139,92,246,0.3)] dark:md:shadow-[0px_20px_37px_0px_rgba(139,92,246,0.4)] sm:w-auto md:px-8 md:py-4">
                <Link
                  to="/early-access"
                  className="font-['Inter'] text-sm font-medium text-white dark:text-gray-50 no-underline hover:no-underline md:text-base"
                >
                  Join Early Access{' '}
                </Link>
              </div>
              {/* <div className="flex w-full items-center justify-center gap-2.5 rounded-lg px-6 py-3 no-underline outline -outline-offset-1 outline-violet-600 dark:outline-white sm:w-auto md:px-8 md:py-4">
                <a
                  href="#how-it-works"
                  className="font-['Inter'] text-sm font-medium text-violet-600 dark:text-white no-underline hover:no-underline md:text-base"
                >
                  See How It Works
                </a>
              </div> */}
            </div>
          </div>
          <div className="flex w-full max-w-3xl flex-wrap items-center justify-center gap-5 border-t border-gray-200 pt-8 md:gap-6 md:pt-10 lg:gap-8">
            <div className="flex items-center justify-start gap-1 md:gap-2">
              <CheckCircle className="h-4 w-4 shrink-0 text-violet-400" />
              <div className="font-['Inter'] text-xs leading-4 font-normal whitespace-nowrap text-zinc-600 dark:text-white">
                Free to join
              </div>
            </div>
            <div className="flex items-center justify-start gap-1 md:gap-2">
              <CheckCircle className="h-4 w-4 shrink-0 text-violet-400" />
              <div className="font-['Inter'] text-xs leading-4 font-normal whitespace-nowrap text-zinc-600 dark:text-white">
                Priority access when we launch
              </div>
            </div>
            <div className="flex items-center justify-start gap-1 md:gap-2">
              <CheckCircle className="h-4 w-4 shrink-0 text-violet-400" />
              <div className="font-['Inter'] text-xs leading-4 font-normal whitespace-nowrap text-zinc-600 dark:text-white">
                Help shape what we build
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
