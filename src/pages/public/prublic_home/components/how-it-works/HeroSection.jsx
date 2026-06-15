import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { PiCompass, PiInfinity } from 'react-icons/pi';
import { MdChecklist } from 'react-icons/md';

gsap.registerPlugin(ScrollTrigger);

const HERO_BENEFITS = [
  { icon: PiCompass, text: 'Stay on track even when life gets messy' },
  { icon: PiInfinity, text: 'Never restart your plans again' },
  { icon: MdChecklist, text: 'Know exactly what to do next' },
];

const HeroHIW = () => {
  const secRef = useRef(null);
  const h1Ref = useRef(null);
  const subRef = useRef(null);
  const ctaRef = useRef(null);
  const bensRef = useRef(null);
  const visualRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
      tl.from(h1Ref.current, { opacity: 0, y: 24, duration: 0.55 })
        .from(subRef.current, { opacity: 0, y: 18, duration: 0.4 }, '-=0.1')
        .from(
          Array.from(ctaRef.current?.children ?? []),
          { opacity: 0, y: 12, duration: 0.35, stagger: 0.1 },
          '-=0.05'
        )
        .from(bensRef.current, { opacity: 0, y: 10, duration: 0.3 }, '-=0.05')
        .from(visualRef.current, { opacity: 0, y: 20, duration: 0.6 }, '-=0.2');
    }, secRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={secRef}
      className="relative w-full overflow-hidden bg-white pt-7.5 pb-12.5 lg:pt-12.5 lg:pb-22.5"
    >
      <div className="mx-auto flex max-w-385 flex-col items-center gap-15 px-5 lg:gap-20 lg:px-20">
        <div className="flex w-full flex-col items-center gap-6 lg:gap-10">
          <div className="flex w-full flex-col items-center gap-5 lg:gap-7.5">
            <div ref={h1Ref} className="flex w-full flex-col items-center gap-2.5 lg:gap-7.5">
              <h1 className="text-center font-['Inter',sans-serif] text-[26px] leading-[1.3] font-bold text-[#181818] lg:hidden">
                AI organizes your tasks into a clear <span className="text-[#8022fe]">Plan</span>
                <span className="text-[#14f1d9]">.</span>
                <br />
                Always know what to do <span className="text-[#8022fe]">Next</span>
                <span className="text-[#14f1d9]">.</span>
              </h1>

              <h1 className="hidden text-center font-['Inter',sans-serif] text-[54px] leading-[1.3] font-bold text-[#181818] lg:block">
                Your plans should adapt to your <span className="text-[#8022fe]">Life</span>
                <span className="text-[#14f1d9]">.</span>
                <br />
                Not the other way <span className="text-[#8022fe]">Around</span>
                <span className="text-[#14f1d9]">.</span>
              </h1>

              <p
                ref={subRef}
                className="w-full text-center font-['Inter',sans-serif] text-[14px] leading-normal font-medium text-[#181818] lg:max-w-117.5 lg:text-[16px]"
              >
                Elyxa<span className="text-[#8022fe]">.Ai</span> automatically adjusts your day when
                plans break — so you always know what to do next
              </p>
            </div>

            <div
              ref={ctaRef}
              className="flex w-full flex-col gap-2.5 lg:w-auto lg:flex-row lg:items-center lg:justify-center lg:gap-5"
            >
              <Link to="/signup" className="block w-full shrink-0 lg:w-auto">
                <button className="w-full rounded-[10px] bg-[#8022fe] px-5 py-3 font-['Inter',sans-serif] text-[14px] font-semibold whitespace-nowrap text-white transition-colors hover:bg-[#6b1bdb] lg:w-auto lg:px-5 lg:py-3 lg:text-[16px]">
                  Get Your First Plan
                </button>
              </Link>
              <button className="w-full shrink-0 rounded-[10px] border-2 border-[#8022fe] bg-transparent px-5 py-3 font-['Inter',sans-serif] text-[14px] font-semibold whitespace-nowrap text-[#8022fe] transition-colors hover:bg-[rgba(128,34,254,0.05)] lg:w-auto lg:bg-[rgba(128,34,254,0.05)] lg:text-[16px]">
                See How It Works
              </button>
            </div>
          </div>

          <div
            ref={bensRef}
            className="relative flex w-full flex-col items-center gap-4 pt-5 before:absolute before:top-0 before:left-1/2 before:h-px before:w-200 before:-translate-x-1/2 before:bg-[#f2f2f2] lg:flex-row lg:flex-wrap lg:justify-center lg:gap-17.5 lg:pt-7.5"
          >
            {HERO_BENEFITS.map(({ icon: Icon, text }) => (
              <span
                key={text}
                className="flex items-center gap-1.5 font-['Inter',sans-serif] text-[12px] font-normal text-[#a3a3a3] lg:gap-2 lg:text-[14px]"
              >
                <span className="lg:hidden">
                  <Icon size={16} className="text-[#8022fe]" />
                </span>
                <span className="hidden lg:inline">
                  <Icon size={18} className="text-[#8022fe]" />
                </span>
                {text}
              </span>
            ))}
          </div>
        </div>

        <div ref={visualRef} className="relative mx-auto w-full max-w-86 lg:max-w-full">
          <img
            src="/images/how-it-works/heroSectionMobile.png"
            alt="Elyxa AI transforms scattered tasks into an organized daily schedule"
            className="mx-auto h-auto w-full max-w-86 lg:hidden"
            draggable={false}
          />
          <img
            src="/images/how-it-works/hiw-hero-visual.png"
            alt="Elyxa AI transforms scattered tasks into an organized daily schedule"
            className="hidden h-150 w-full object-contain object-center lg:block"
            draggable={false}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroHIW;
