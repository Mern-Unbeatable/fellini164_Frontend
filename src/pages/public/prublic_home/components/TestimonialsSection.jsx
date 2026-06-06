import React from 'react';

const TestimonialsSection = () => {
  return (
    <section className="w-full bg-white dark:bg-black py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-20">
        <div className="flex flex-col items-center justify-start gap-8 md:gap-12">
          {/* Header */}
          <div className="flex flex-col items-center justify-start gap-2 text-center">
            <div className="justify-start">
              <span className="font-['Inter'] text-2xl font-semibold text-black dark:text-white md:text-3xl lg:text-4xl">
                Trusted by People{' '}
              </span>
              <span className="font-['Playfair_Display'] text-2xl font-semibold text-violet-600 dark:text-violet-400 italic md:text-3xl lg:text-4xl">
                Like You
              </span>
            </div>
            <div className="max-w-2xl justify-start font-['Inter'] text-base  leading-5 font-normal text-zinc-600 dark:text-white md:text-base md:leading-6">
              Real experiences from users building better
              <br className="hidden sm:block" />
              habits and smarter routines.
            </div>
          </div>

          {/* Testimonials Grid */}
          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
            {/* Testimonial 1 */}
            <div className="flex flex-col items-start justify-start gap-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 p-5 md:px-6 md:py-8">
              <img
                className="h-14 w-14 rounded-full object-cover md:h-16 md:w-16"
                src="/images/Sarah.png"
                alt="Sarah L."
              />
              <div className="flex w-full flex-col items-start justify-start">
                <div className="justify-start font-['Inter'] text-lg font-medium text-black dark:text-white md:text-xl">
                  — Sarah L.
                </div>
                <div className="justify-start font-['Inter'] text-sm font-light text-neutral-500 dark:text-white/60 md:text-base">
                  Product Manager
                </div>
              </div>
              <div className="justify-start font-['Inter'] text-sm leading-relaxed font-light text-black dark:text-white md:text-base">
                "This AI coach completely changed how I plan my day. It understands my energy levels and keeps me focused without feeling overwhelming."
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="flex flex-col items-start justify-start gap-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 p-5 md:px-6 md:py-8">
              <img
                className="h-14 w-14 rounded-full object-cover md:h-16 md:w-16"
                src="images/Daniel.png"
                alt="Daniel R."
              />
              <div className="flex w-full flex-col items-start justify-start">
                <div className="justify-start font-['Inter'] text-lg font-medium text-black dark:text-white md:text-xl">
                  — Daniel R.
                </div>
                <div className="justify-start font-['Inter'] text-sm font-light text-neutral-500 md:text-base">
                  Startup Founder
                </div>
              </div>
              <div className="justify-start font-['Inter'] text-sm leading-relaxed font-light text-black dark:text-white md:text-base">
                "I’ve tried multiple habit apps before, but this feels different. The guidance is personal, motivating, and actually keeps me consistent."
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="flex flex-col items-start justify-start gap-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 p-5 md:px-6 md:py-8">
              <img
                className="h-14 w-14 rounded-full object-cover md:h-16 md:w-16"
                src="/images/James.png"
                alt="James S."
              />
              <div className="flex w-full flex-col items-start justify-start">
                <div className="justify-start font-['Inter'] text-lg font-medium text-black dark:text-white md:text-xl">
                  — James S.
                </div>
                <div className="justify-start font-['Inter'] text-sm font-light text-neutral-500 md:text-base">
                  Marketing Lead
                </div>
              </div>
              <div className="justify-start font-['Inter'] text-sm leading-relaxed font-light text-black dark:text-white md:text-base">
                "It’s like having a personal coach available 24/7. My routines are clearer, my stress is lower, and I finally feel in control of my time."
              </div>
            </div>

            {/* Testimonial 4 */}
            <div className="flex flex-col items-start justify-start gap-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 p-5 md:px-6 md:py-8">
              <img
                className="h-14 w-14 rounded-full object-cover md:h-16 md:w-16"
                src="/images/Michael.png"
                alt="Michael T."
              />
              <div className="flex w-full flex-col items-start justify-start">
                <div className="justify-start font-['Inter'] text-lg font-medium text-black dark:text-white md:text-xl">
                  — Michael T.
                </div>
                <div className="justify-start font-['Inter'] text-sm font-light text-neutral-500 dark:text-white/60 md:text-base">
                  Freelance Consultant
                </div>
              </div>
              <div className="justify-start font-['Inter'] text-sm leading-relaxed font-light text-black dark:text-white md:text-base">
                "The AI suggestions are surprisingly accurate. It adapts as I go and helps me make better decisions every day."
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
