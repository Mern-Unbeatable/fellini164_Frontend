

import React from 'react';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="w-full bg-white dark:bg-black py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-20">
        <div className="relative mx-auto container rounded-3xl bg-[#4C1D95] p-8 md:p-12 lg:p-16  overflow-hidden">
          
          {/* Decorative glow (no gradient) */}
          <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-black/20 blur-3xl" />

          <div className="relative flex flex-col items-center gap-10 text-center">
            
            {/* Badge */}
            {/* <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-6 py-2 backdrop-blur-md">
              <span className="text-sm md:text-base font-semibold uppercase tracking-wide text-white">
                Elyxa = Adaptive Planning
              </span>
            </div> */}

            {/* Text */}
            <div className="max-w-2xl space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                {/* Plan Better. Execute Smarter. */}
                Elyxa = Adaptive Planning
              </h2>
              <p className="text-base md:text-lg text-white/90 leading-relaxed">
                Join the waitlist for productive planning and flawless execution —
                even on chaotic days. Elyxa helps you stay consistent without burnout.
              </p>
            </div>

            {/* CTA */}
            <div className="flex flex-col items-center gap-4">
              <Link
                to="/early-access"
                className="group inline-flex items-center justify-center rounded-xl bg-white px-10 py-4 md:px-14 md:py-5 shadow-xl transition-all duration-300 hover:scale-[1.04] hover:shadow-2xl hover:no-underline"
              >
                <span className="text-base md:text-lg font-semibold text-purple-700 group-hover:text-purple-800">
                  Get Early Access
                </span>
              </Link>

              <span className="text-sm md:text-base font-medium text-white/85">
                 First 500 users get lifetime early-adopter pricing
              </span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
