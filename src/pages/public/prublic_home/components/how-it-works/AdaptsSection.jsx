import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const ADAPTS_MOBILE_STEPS = [
  {
    number: '01',
    title: 'Plan your day',
    body: 'Add tasks and plan your day in seconds.',
    variant: '01',
    visual: '/images/how-it-works/hiw-adapts-card01-visual-mobile.png',
    visualClass: 'absolute left-[19px] top-[110px] w-[550px] rounded-[13.2px] drop-shadow-[-16.337px_0_16.337px_rgba(0,0,0,0.05)]',
    alt: 'Elyxa daily plan interface with empty schedule and add task button',
  },
  {
    number: '02',
    title: 'Life happens',
    body: 'Meetings run late. Plans shift. Things break.',
    variant: '02',
    visual: '/images/how-it-works/hiw-adapts-card02-visual-mobile.png',
    visualClass: 'absolute left-[19px] top-[110px] w-[320px] rounded-[13.672px] shadow-[0_0_35.165px_rgba(0,0,0,0.05)]',
    alt: 'Schedule with time conflicts and overdue tasks',
  },
  {
    number: '03',
    title: 'Elyxa adapts',
    body: 'Your schedule updates automatically — no manual fixes.',
    variant: '03',
    visual: '/images/how-it-works/hiw-adapts-card03-visual-mobile.png',
    visualClass: 'absolute bottom-[-121px] right-[-301px] w-[600px] rounded-[14.4px] drop-shadow-[-13.304px_0_13.304px_rgba(0,0,0,0.05)]',
    alt: 'Elyxa adapted schedule with daily plan, tasks list, and AI generate panel',
  },
];

const AdaptsMobileCard = ({ cardRef, number, title, body, variant, visual, visualClass, alt }) => {
  const isAdaptCard = variant === '03';

  if (isAdaptCard) {
    return (
      <div ref={cardRef} className="relative w-full overflow-hidden rounded-2xl border border-[#f2f2f2] bg-[#fcfcfc] flex flex-col">
        <div className="flex flex-col gap-4 px-5 pt-5 pb-4">
          <div className="flex items-start gap-7.5">
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <h3 className="font-['Inter',sans-serif] text-[18px] leading-[1.3] font-semibold text-[#181818]">
                {title}
              </h3>
              <p className="font-['Inter',sans-serif] text-[14px] leading-normal font-medium text-[#181818]">
                {body}
              </p>
            </div>
            <p className="shrink-0 font-['Inter',sans-serif] text-[40px] leading-[1.3] font-bold text-[#f2f2f2] select-none">
              {number}
            </p>
          </div>
          <Link to="/signup" className="w-full no-underline outline-none focus:outline-none focus-visible:outline-none">
            <button className="w-full rounded-[10px] bg-[#8022fe] px-5 py-3 font-['Inter',sans-serif] text-[14px] font-semibold text-white outline-none transition-colors hover:bg-[#6b1bdb] focus:outline-none focus-visible:outline-none">
              Get Your First Plan
            </button>
          </Link>
        </div>
        <img
          src={visual}
          alt={alt}
          className="ml-5 h-auto w-full rounded-[14.4px] drop-shadow-[-13.304px_0_13.304px_rgba(0,0,0,0.05)] pointer-events-none select-none"
          draggable={false}
        />
      </div>
    );
  }

  return (
    <div ref={cardRef} className="relative h-75 w-full overflow-hidden rounded-2xl border border-[#f2f2f2] bg-[#fcfcfc] p-5">
      <img
        src={visual}
        alt={alt}
        className={`pointer-events-none absolute h-auto max-w-none select-none ${visualClass}`}
        draggable={false}
      />
      <div className="relative z-10 flex items-start gap-7.5">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <h3 className="font-['Inter',sans-serif] text-[18px] leading-[1.3] font-semibold text-[#181818]">
            {title}
          </h3>
          <p className="font-['Inter',sans-serif] text-[14px] leading-normal font-medium text-[#181818]">
            {body}
          </p>
        </div>
        <p className="shrink-0 font-['Inter',sans-serif] text-[40px] leading-[1.3] font-bold text-[#f2f2f2] select-none">
          {number}
        </p>
      </div>
    </div>
  );
};

/* Tablet: row 1 = cards 01+02 side by side, row 2 = card 03 full width below */
const AdaptsTabletCards = () => (
  <div className="hidden md:flex md:flex-col md:gap-5 lg:hidden">
    <div className="flex gap-5">
      <div className="min-w-0 flex-1">
        <img
          src="/images/how-it-works/hiw-adapts-card01-full.png"
          alt="Plan your day — Elyxa daily plan interface"
          className="w-full object-cover object-top rounded-[20px] md:h-44"
          draggable={false}
        />
      </div>
      <div className="min-w-0 flex-1">
        <img
          src="/images/how-it-works/hiw-adapts-card02-full.png"
          alt="Life happens — schedule with time conflicts"
          className="w-full object-cover object-top rounded-[20px] md:h-44"
          draggable={false}
        />
      </div>
    </div>
    <div className="relative w-full">
      <img
        src="/images/how-it-works/hiw-adapts-card03-full.png"
        alt="Elyxa adapts — full dashboard with tasks list and AI panel"
        className="w-full rounded-[20px] md:h-auto"
        draggable={false}
      />
      <Link
        to="/signup"
        className="absolute top-[19.3%] left-[4.7%] z-10 h-[6%] w-[34.4%] rounded-[10px]"
        aria-label="Get Your First Plan"
      />
    </div>
  </div>
);

/* Desktop: original fixed-width horizontal layout */
const AdaptsDesktopCards = () => (
  <div className="hidden w-full overflow-x-auto lg:block">
    <div className="flex min-w-325 items-center gap-5">
      <div className="flex w-160 shrink-0 flex-col gap-5">
        <img
          src="/images/how-it-works/hiw-adapts-card01-full.png"
          alt="Plan your day — Elyxa daily plan interface"
          width={640}
          height={350}
          className="h-87.5 w-160 shrink-0 rounded-[20px]"
          draggable={false}
        />
        <img
          src="/images/how-it-works/hiw-adapts-card02-full.png"
          alt="Life happens — schedule with time conflicts"
          width={640}
          height={350}
          className="h-87.5 w-160 shrink-0 rounded-[20px]"
          draggable={false}
        />
      </div>

      <div className="relative h-180 w-160 shrink-0">
        <img
          src="/images/how-it-works/hiw-adapts-card03-full.png"
          alt="Elyxa adapts — full dashboard with tasks list and AI panel"
          width={640}
          height={720}
          className="h-180 w-160 rounded-[20px]"
          draggable={false}
        />
        <Link
          to="/signup"
          className="absolute top-34.75 left-7.5 z-10 h-10.75 w-55 rounded-[10px]"
          aria-label="Get Your First Plan"
        />
      </div>
    </div>
  </div>
);

const AdaptsSection = () => {
  const secRef = useRef(null);
  const headRef = useRef(null);
  const c1Ref = useRef(null);
  const c2Ref = useRef(null);
  const c3Ref = useRef(null);
  const cardsAnimRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headRef.current, {
        opacity: 0, y: 20, duration: 0.5, ease: 'power2.out',
        scrollTrigger: { trigger: headRef.current, start: 'top 88%', once: true },
      });
      gsap.from(cardsAnimRef.current, {
        opacity: 0, y: 24, duration: 0.55, ease: 'power2.out',
        scrollTrigger: { trigger: cardsAnimRef.current, start: 'top 85%', once: true },
      });
    }, secRef);
    return () => ctx.revert();
  }, []);

  const [step01, step02, step03] = ADAPTS_MOBILE_STEPS;

  return (
    <section ref={secRef} className="w-full bg-white">
      <div className="mx-auto max-w-385 px-5 py-12.5 md:px-20 md:pt-22.5 md:pb-45">
        <div className="flex flex-col gap-6 md:gap-12.5">
          <div ref={headRef} className="flex max-w-160 flex-col gap-3.5 md:gap-5">
            <h2 className="font-['Inter',sans-serif] text-[22px] leading-[1.3] font-bold text-[#181818] md:text-[34px]">
              How Elyxa adapts to your <span className="text-[#8022fe]">Life</span>
              <span className="text-[#14f1d9]">.</span>
            </h2>
            <p className="font-['Inter',sans-serif] text-[14px] leading-normal font-medium text-[#181818] md:text-[16px]">
              Your plan updates itself when things don't go as expected.
            </p>
          </div>

          <div ref={cardsAnimRef}>
            {/* Desktop only */}
            <AdaptsDesktopCards />
            {/* Tablet only: desktop images in responsive 2-col layout */}
            <AdaptsTabletCards />
            {/* Mobile only */}
            <div className="flex flex-col gap-5 md:hidden">
              <AdaptsMobileCard cardRef={c1Ref} {...step01} />
              <AdaptsMobileCard cardRef={c2Ref} {...step02} />
              <AdaptsMobileCard cardRef={c3Ref} {...step03} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdaptsSection;
