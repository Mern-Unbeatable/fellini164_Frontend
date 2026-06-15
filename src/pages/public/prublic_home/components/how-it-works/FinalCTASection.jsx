import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { GoZap } from 'react-icons/go';

gsap.registerPlugin(ScrollTrigger);

const FINAL_CTA_SHADOW =
  'shadow-[0px_171px_48px_0px_rgba(0,0,0,0),0px_109px_44px_0px_rgba(0,0,0,0),0px_61px_37px_0px_rgba(0,0,0,0.01),0px_27px_27px_0px_rgba(0,0,0,0.02),0px_7px_15px_0px_rgba(0,0,0,0.02)]';

export const FinalCTASection = () => {
  const cardRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(textRef.current, {
        opacity: 0, y: 20, duration: 0.55, ease: 'power2.out',
        scrollTrigger: { trigger: cardRef.current, start: 'top 88%', once: true },
      });
      gsap.from(cardRef.current, {
        opacity: 0, y: 24, duration: 0.6, ease: 'expo.out',
        scrollTrigger: { trigger: cardRef.current, start: 'top 88%', once: true },
      });
    }, cardRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={cardRef} className="relative z-20 w-full">
      <div
        className={`relative overflow-hidden rounded-[20px] bg-[#181818] px-5 pt-5 pb-47.5 md:h-79.75 md:rounded-[30px] md:p-12.5 md:pb-12.5 ${FINAL_CTA_SHADOW}`}
      >
        <div ref={textRef} className="relative z-10 flex w-full flex-col gap-5 md:max-w-160 md:gap-12.5">
          <div className="flex flex-col gap-3.5 md:gap-5">
            <h2 className="font-['Inter',sans-serif] text-[22px] leading-[1.3] font-bold text-white md:text-[34px]">
              Your plans should adapt to <span className="text-[#8022fe]">You</span>
              <span className="text-[#14f1d9]">.</span>
            </h2>
            <p className="font-['Inter',sans-serif] text-sm leading-normal font-medium text-white md:text-base">
              Elyxa adjusts your day as things change — so you always know what to do next.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <Link to="/signup" className="inline-flex w-full no-underline outline-none hover:no-underline focus:outline-none focus-visible:outline-none md:w-auto" tabIndex={-1}>
              <button
                type="button"
                className="w-full rounded-[10px] bg-[#8022fe] px-5 py-3 font-['Inter',sans-serif] text-sm font-semibold text-white outline-none transition-colors hover:bg-[#6b1bdb] focus:outline-none focus-visible:outline-none md:w-auto md:text-base"
              >
                Get Your First Plan
              </button>
            </Link>
            <div className="flex items-center gap-1">
              <GoZap className="text-purple-600 h-4 w-4" />
              <p className="font-['Inter',sans-serif] text-xs leading-none font-normal text-[#5d5d5d] md:text-sm">
                Takes less than a minute
              </p>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-1/2 w-[320px] max-w-none -translate-x-1/2 overflow-hidden rounded-[15.6px] drop-shadow-[-8px_0px_14.39px_rgba(255,255,255,0.05)] md:top-12.5 md:-right-24.75 md:bottom-auto md:left-auto md:w-162.5 md:translate-x-0">
          <img src="/images/how-it-works/hiw-final-cta-dashboard.png" alt="" className="block h-auto w-full" />
        </div>
      </div>
    </div>
  );
};

export default FinalCTASection;
