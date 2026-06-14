import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { PiCompass, PiInfinity } from 'react-icons/pi';
import { MdChecklist } from 'react-icons/md';

gsap.registerPlugin(ScrollTrigger);

// ─── Shared icons ─────────────────────────────────────────────────────────────

const PlanCheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="7" stroke="#C2C2C2" strokeWidth="1" />
    <path
      d="M5 8.5L7 10.5L11 6"
      stroke="#8022FE"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ElyxaIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 shrink-0">
    <rect width="16" height="16" rx="3" fill="#8022FE" fillOpacity="0.12" />
    <path
      d="M4 8.5L6.5 11L12 5"
      stroke="#8022FE"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ─── Pricing data ─────────────────────────────────────────────────────────────

const YEARLY_PLANS = [
  {
    id: 'free',
    name: 'Free',
    tagline: 'Limited features only',
    price: '$0',
    priceSuffix: '/yearly',
    billingNote: 'Free forever',
    cta: 'Start Free',
    ctaFilled: false,
    featured: false,
    features: [
      'Basic daily planning',
      'AI assistance (limited)',
      'Single active routine',
      'Basic task breakdown',
      '7-day history',
    ],
  },
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Get organized with AI',
    originalPrice: '$8',
    price: '$6.39',
    priceSuffix: '/yearly',
    billingNote: 'Billed annually',
    cta: 'Get Starter',
    ctaFilled: true,
    featured: true,
    badge: 'Best Value',
    features: [
      'Everything in Free',
      'Plan your tasks (daily & weekly)',
      'AI assistance for daily tasks',
      'Smart reminders',
      'Unlimited routines',
      'Goal tracking & progress insights',
      '1 AI assistant',
      'Monthly summary',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'AI that runs your entire day',
    originalPrice: '$18',
    price: '$14.39',
    priceSuffix: '/yearly',
    billingNote: 'Billed annually',
    cta: 'Get Pro',
    ctaFilled: false,
    featured: false,
    features: [
      'Everything in Starter',
      'Unlimited AI assistance',
      'Advanced automations',
      'Productivity insights',
      'Faster response speed',
      '3 AI assistants (different roles)',
    ],
  },
  {
    id: 'ultimate',
    name: 'Ultimate',
    tagline: 'Complete AI system for your life',
    originalPrice: '$40',
    price: '$31.99',
    priceSuffix: '/yearly',
    billingNote: 'Billed annually',
    cta: 'Get Ultimate',
    ctaFilled: false,
    featured: false,
    features: [
      'Everything in Pro',
      'Full life planning',
      'Voice coaching sessions',
      'Adaptive routine optimization',
      'Energy-based planning',
      'Monthly AI coaching session',
      'Early access to new features',
      'Unlimited AI assistants',
    ],
  },
];

const MONTHLY_PLANS = [
  {
    id: 'free',
    name: 'Free',
    tagline: 'Limited features only',
    price: '$0',
    priceSuffix: '/month',
    cta: 'Start Free',
    ctaFilled: false,
    featured: false,
    features: [
      'Basic daily planning',
      'AI assistance (limited)',
      'Single active routine',
      'Basic task breakdown',
      '7-day history',
    ],
  },
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Get organized with AI',
    price: '$7.99',
    priceSuffix: '/month',
    cta: 'Get Starter',
    ctaFilled: true,
    featured: true,
    badge: 'Best Value',
    features: [
      'Everything in Free',
      'Plan your tasks (daily & weekly)',
      'AI assistance for daily tasks',
      'Smart reminders',
      'Unlimited routines',
      'Goal tracking & progress insights',
      '1 AI assistant',
      'Monthly summary',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'AI that runs your entire day',
    price: '$17.99',
    priceSuffix: '/month',
    cta: 'Get Pro',
    ctaFilled: false,
    featured: false,
    features: [
      'Everything in Starter',
      'Unlimited AI assistance',
      'Advanced automations',
      'Productivity insights',
      'Faster response speed',
      '3 AI assistants (different roles)',
    ],
  },
  {
    id: 'ultimate',
    name: 'Ultimate',
    tagline: 'Complete AI system for your life',
    price: '$39.99',
    priceSuffix: '/month',
    cta: 'Get Ultimate',
    ctaFilled: false,
    featured: false,
    features: [
      'Everything in Pro',
      'Full life planning',
      'Voice coaching sessions',
      'Adaptive routine optimization',
      'Energy-based planning',
      'Monthly AI coaching session',
      'Early access to new features',
      'Unlimited AI assistants',
    ],
  },
];

const FAQS = [
  {
    q: 'Do I still need my calendar?',
    a: "Elyxa integrates with your existing calendar so you don't need to replace anything. It reads your schedule and adapts your tasks around it.",
  },
  {
    q: 'What makes this "Adaptive"?',
    a: 'Unlike traditional planners that are static, Elyxa re-schedules your day when something changes — a meeting runs over, a task takes longer, or life simply gets in the way.',
  },
  {
    q: 'Is this just another "AI" tool?',
    a: 'No. Most "AI" tools just generate content. Elyxa is an AI that manages your actual schedule, reprioritizes tasks, and helps you stay on track — every day.',
  },
  {
    q: 'How is this different from a "Smart" to-do list?',
    a: 'Smart to-do lists track tasks. Elyxa manages your time — it schedules tasks into your actual day, adapts when things change, and helps you focus on what matters most.',
  },
  {
    q: 'What happens if I fall behind by a lot?',
    a: "That's where Elyxa shines. Instead of overwhelming you with a backlog, it helps you ruthlessly reprioritize so you can start fresh with a plan that actually works.",
  },
  {
    q: 'Do you offer early access to new features?',
    a: "Yes! Ultimate plan subscribers get early access to all new features before they're released to the general public.",
  },
];

// ─── Section 1: Hero ──────────────────────────────────────────────────────────

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
      className="relative w-full overflow-hidden bg-white pt-[30px] pb-[50px] lg:pt-[50px] lg:pb-[90px]"
    >
      <div className="mx-auto flex max-w-[1300px] flex-col items-center gap-[60px] lg:gap-20">
        {/* Header */}
        <div className="flex w-full flex-col items-center gap-6 px-5 lg:gap-10 lg:px-6 xl:px-0">
          <div className="flex w-full flex-col items-center gap-5 lg:gap-[30px]">
            <div ref={h1Ref} className="flex w-full flex-col items-center gap-2.5 lg:gap-[30px]">
              {/* Mobile headline */}
              <h1 className="text-center font-['Inter',sans-serif] text-[26px] leading-[1.3] font-bold text-[#181818] lg:hidden">
                AI organizes your tasks into a clear <span className="text-[#8022fe]">Plan</span>
                <span className="text-[#14f1d9]">.</span>
                <br />
                Always know what to do <span className="text-[#8022fe]">Next</span>
                <span className="text-[#14f1d9]">.</span>
              </h1>

              {/* Desktop headline */}
              <h1 className="hidden text-center font-['Inter',sans-serif] text-[54px] leading-[1.3] font-bold text-[#181818] lg:block">
                Your plans should adapt to your <span className="text-[#8022fe]">Life</span>
                <span className="text-[#14f1d9]">.</span>
                <br />
                Not the other way <span className="text-[#8022fe]">Around</span>
                <span className="text-[#14f1d9]">.</span>
              </h1>

              <p
                ref={subRef}
                className="w-full text-center font-['Inter',sans-serif] text-[14px] leading-normal font-medium text-[#181818] lg:max-w-[470px] lg:text-[16px]"
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
            className="relative flex w-full flex-col items-center gap-4 pt-5 before:absolute before:top-0 before:left-1/2 before:h-px before:w-[800px] before:-translate-x-1/2 before:bg-[#f2f2f2] lg:flex-row lg:flex-wrap lg:justify-center lg:gap-[70px] lg:pt-[30px]"
          >
            {HERO_BENEFITS.map(({ icon: BenefitIcon, text }) => (
              <span
                key={text}
                className="flex items-center gap-1.5 font-['Inter',sans-serif] text-[12px] font-normal text-[#a3a3a3] lg:gap-2 lg:text-[14px]"
              >
                <span className="lg:hidden">
                  <BenefitIcon size={16} className="text-[#8022fe]" />
                </span>
                <span className="hidden lg:inline">
                  <BenefitIcon size={18} className="text-[#8022fe]" />
                </span>
                {text}
              </span>
            ))}
          </div>
        </div>

        {/* Hero visual — separate mobile / desktop Figma exports */}
        <div
          ref={visualRef}
          className="relative mx-auto w-full max-w-[344px] px-2 lg:max-w-[1300px] lg:px-6 xl:px-0"
        >
          <img
            src="/images/how-it-works/heroSectionMobile.png"
            alt="Elyxa AI transforms scattered tasks into an organized daily schedule"
            className="mx-auto h-auto w-full max-w-[344px] lg:hidden"
            draggable={false}
          />
          <img
            src="/images/how-it-works/hiw-hero-visual.png"
            alt="Elyxa AI transforms scattered tasks into an organized daily schedule"
            className="hidden h-[600px] w-full object-contain object-center lg:block"
            draggable={false}
          />
        </div>
      </div>
    </section>
  );
};

// ─── Section 2: Breaking ──────────────────────────────────────────────────────

const MiniTaskList = () => (
  <div className="flex h-full flex-col rounded-xl border border-[#f0f0f0] bg-white p-3">
    <p className="mb-2.5 font-['Inter',sans-serif] text-[11px] font-bold text-[#181818]">
      Tasks List
    </p>
    {[
      { name: 'Review Goals', time: '09:00', tag: 'Work', done: true },
      { name: 'Team Meeting', time: '10:00', tag: 'Collaboration', done: false },
    ].map((t) => (
      <div
        key={t.name}
        className="flex items-center gap-2 border-b border-[#f8f8f8] py-2 last:border-0"
      >
        <div
          className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border ${t.done ? 'border-[#8022fe] bg-[#f0e8ff]' : 'border-[#d9d9d9]'}`}
        >
          {t.done && (
            <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
              <path
                d="M1 3.5L2.8 5.5L6 1.5"
                stroke="#8022FE"
                strokeWidth="1"
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-['Inter',sans-serif] text-[10px] font-semibold text-[#181818]">
            {t.name}
          </p>
          <p className="font-['Inter',sans-serif] text-[9px] text-[#c2c2c2]">
            {t.time}{' '}
            <span className={`font-medium ${t.done ? 'text-[#8022fe]' : 'text-[#aaa]'}`}>
              {t.tag}
            </span>
          </p>
        </div>
      </div>
    ))}
  </div>
);

const BreakingSection = () => {
  const secRef = useRef(null);
  const headRef = useRef(null);
  const c0 = useRef(null);
  const c1 = useRef(null);
  const c2 = useRef(null);
  const c3 = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: { trigger: headRef.current, start: 'top 88%', once: true },
      });
      [c0, c1, c2, c3].forEach((c, i) => {
        gsap.from(c.current, {
          opacity: 0,
          y: 20,
          duration: 0.5,
          ease: 'power2.out',
          delay: i * 0.09,
          scrollTrigger: { trigger: c.current, start: 'top 90%', once: true },
        });
      });
    }, secRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={secRef} className="w-full bg-white px-6 py-20 lg:px-24">
      <div className="mx-auto max-w-[1300px]">
        <div ref={headRef} className="mb-10">
          <h2 className="font-['Inter',sans-serif] text-[28px] leading-tight font-bold text-[#181818] sm:text-[36px] lg:text-[42px]">
            Have you ever wondered why your
            <br />
            plans keep <span className="text-[#8022fe]">Breaking</span>
            <span className="text-[#14f1d9]">.</span>
          </h2>
          <p className="mt-4 max-w-[560px] font-['Inter',sans-serif] text-[15px] font-medium text-[#888]">
            It's not your motivation — it's that your tools treat your life like a fixed schedule.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Card 1 — The Gap */}
          <div
            ref={c0}
            className="rounded-2xl border border-[#f0f0f0] bg-white p-7 shadow-[0_2px_16px_rgba(0,0,0,0.04)]"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5f0ff]">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M3 9C3 5.686 5.686 3 9 3"
                    stroke="#8022FE"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M15 9C15 12.314 12.314 15 9 15"
                    stroke="#8022FE"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <circle cx="9" cy="9" r="2" fill="#8022FE" />
                </svg>
              </div>
              <h3 className="font-['Inter',sans-serif] text-[18px] font-bold text-[#181818]">
                The Gap
              </h3>
            </div>
            <p className="font-['Inter',sans-serif] text-[15px] leading-relaxed font-medium text-[#888]">
              Most planning tools work — until something changes. Then everything falls apart.
            </p>
          </div>

          {/* Card 2 — The Consequence */}
          <div
            ref={c1}
            className="rounded-2xl border border-[#f0f0f0] bg-white p-7 shadow-[0_2px_16px_rgba(0,0,0,0.04)]"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5f0ff]">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M9 3L16 15H2L9 3Z"
                    stroke="#8022FE"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <path d="M9 8V11" stroke="#8022FE" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="9" cy="13" r="0.75" fill="#8022FE" />
                </svg>
              </div>
              <h3 className="font-['Inter',sans-serif] text-[18px] font-bold text-[#181818]">
                The Consequence
              </h3>
            </div>
            <p className="font-['Inter',sans-serif] text-[15px] leading-relaxed font-medium text-[#888]">
              One delay, one unexpected event — and your day turns into a list of overdue tasks.
            </p>
          </div>

          {/* Card 3 — Start planning differently (split layout with embedded task list) */}
          <div
            ref={c2}
            className="overflow-hidden rounded-2xl border border-[#f0f0f0] bg-white shadow-[0_2px_16px_rgba(0,0,0,0.04)]"
          >
            <div className="flex h-full min-h-[200px]">
              {/* Left: text + button */}
              <div className="flex flex-col justify-between p-7 pr-4" style={{ flex: '0 0 54%' }}>
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5f0ff]">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path
                          d="M9 2L10.8 7H16L11.6 10.3L13.4 15.3L9 12L4.6 15.3L6.4 10.3L2 7H7.2L9 2Z"
                          stroke="#8022FE"
                          strokeWidth="1.3"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <h3 className="font-['Inter',sans-serif] text-[17px] font-bold text-[#181818]">
                      Start planning differently
                    </h3>
                  </div>
                  <p className="mb-6 font-['Inter',sans-serif] text-[14px] leading-relaxed font-medium text-[#888]">
                    See how your schedule adapts when life changes.
                  </p>
                </div>
                <button className="w-fit rounded-xl bg-[#8022fe] px-5 py-2.5 font-['Inter',sans-serif] text-[13px] font-semibold text-white shadow-[0_4px_14px_rgba(128,34,254,0.3)] transition-colors hover:bg-[#6b1bdb]">
                  Try It Yourself
                </button>
              </div>
              {/* Right: embedded mini task list */}
              <div className="border-l border-[#f5f5f5] p-4" style={{ flex: '0 0 46%' }}>
                <MiniTaskList />
              </div>
            </div>
          </div>

          {/* Card 4 — The Result */}
          <div
            ref={c3}
            className="rounded-2xl border border-[#f0f0f0] bg-white p-7 shadow-[0_2px_16px_rgba(0,0,0,0.04)]"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5f0ff]">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="6.5" stroke="#8022FE" strokeWidth="1.5" />
                  <path
                    d="M9 6V9.5L11 11.5"
                    stroke="#8022FE"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="font-['Inter',sans-serif] text-[18px] font-bold text-[#181818]">
                The Result
              </h3>
            </div>
            <p className="font-['Inter',sans-serif] text-[15px] leading-relaxed font-medium text-[#888]">
              You don't feel organized — you feel behind. And most days end in either catching up or
              giving up.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Section 3: Adapts ────────────────────────────────────────────────────────

const AppSidebar = () => (
  <div className="flex h-full w-[90px] shrink-0 flex-col bg-[#181818] p-3">
    <div className="mb-4 flex items-center gap-1.5">
      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[#8022fe]">
        <span className="font-bold text-white" style={{ fontSize: 9 }}>
          E
        </span>
      </div>
      <span className="font-['Inter',sans-serif] text-[10px] font-bold text-white">Elyxa.AI</span>
    </div>
    {['Dashboard', 'Daily Plan', 'Weekly Plan', 'Monthly Plan'].map((item, i) => (
      <div key={item} className={`mb-1 rounded-md px-2 py-1 ${i === 1 ? 'bg-[#8022fe]/20' : ''}`}>
        <p
          className={`font-['Inter',sans-serif] text-[9px] font-medium ${i === 1 ? 'text-[#8022fe]' : 'text-[#666]'}`}
        >
          {item}
        </p>
      </div>
    ))}
    <div className="mt-2 border-t border-[#2a2a2a] pt-2">
      {['Tasks', 'Habits', 'Goals', 'AI Coach Chat', 'Analytics'].map((item) => (
        <div key={item} className="mb-0.5 px-2 py-0.5">
          <p className="font-['Inter',sans-serif] text-[8px] font-medium text-[#555]">{item}</p>
        </div>
      ))}
    </div>
  </div>
);

const DailyEmpty = () => (
  <div className="flex flex-1 flex-col bg-white p-4">
    <p className="mb-1 font-['Inter',sans-serif] text-[13px] font-bold text-[#181818]">Daily</p>
    <div className="mb-4 flex items-center gap-1 font-['Inter',sans-serif] text-[10px] text-[#c2c2c2]">
      <span>{'<'}</span>
      <span>0 Plans Scheduled</span>
      <span>{'>'}</span>
    </div>
    <div className="flex flex-1 items-center justify-center">
      <button className="flex items-center gap-1 rounded-lg border border-dashed border-[#8022fe]/40 px-3 py-1.5 font-['Inter',sans-serif] text-[10px] font-medium text-[#8022fe]">
        <span className="text-sm leading-none">+</span> Add Task Here
      </button>
    </div>
  </div>
);

const ConflictSchedule = () => (
  <div className="flex-1 overflow-hidden rounded-xl border border-[#f0f0f0] bg-white p-3">
    {[
      { time: '11:00 AM', task: 'Focus Time', badge: 'Time Conflict', red: true },
      { time: '11:00 AM', task: 'Breakfast Boost', badge: 'Time Conflict', red: true },
      { time: '5:00 AM', task: 'Morning Mindfulness', badge: null },
      { time: '1:00 PM', task: 'Lunch Break', badge: 'Double Booked', red: false },
      { time: '2:00 AM', task: 'Team Standup', badge: null },
    ].map((r, i) => (
      <div
        key={i}
        className="flex items-center gap-2 border-b border-[#f8f8f8] py-1.5 last:border-0"
      >
        <span
          className={`w-14 shrink-0 font-['Inter',sans-serif] text-[9px] font-medium ${r.red || r.badge ? 'text-[#ef4444]' : 'text-[#c2c2c2]'}`}
        >
          {r.time}
        </span>
        <p className="flex-1 truncate font-['Inter',sans-serif] text-[10px] font-medium text-[#181818]">
          {r.task}
        </p>
        {r.badge && (
          <span
            className={`shrink-0 rounded px-1.5 py-0.5 font-['Inter',sans-serif] text-[8px] font-medium ${r.red ? 'bg-[#fee2e2] text-[#ef4444]' : 'bg-[#fff3e0] text-[#f59e0b]'}`}
          >
            {r.badge}
          </span>
        )}
      </div>
    ))}
  </div>
);

const AdaptedScheduleMockup = ({ className = '', style }) => (
  <div
    className={`flex overflow-hidden rounded-xl border border-[#f0f0f0] shadow-sm ${className}`}
    style={style ?? { height: 255 }}
  >
    <div className="flex w-7 shrink-0 flex-col items-center gap-2 bg-[#181818] py-2">
      <div className="flex h-4 w-4 items-center justify-center rounded bg-[#8022fe]">
        <span style={{ fontSize: 6, color: 'white', fontWeight: 700 }}>E</span>
      </div>
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-3 w-3 rounded bg-[#2a2a2a]" />
      ))}
    </div>
    <div className="flex flex-1 flex-col overflow-hidden bg-white p-2.5">
      <p className="mb-0.5 font-['Inter',sans-serif] text-[10px] font-bold text-[#181818]">Daily</p>
      <div className="mb-2 flex items-center gap-1">
        <span className="text-[8px] text-[#c2c2c2]">{'<'}</span>
        <p className="font-['Inter',sans-serif] text-[8px] font-medium text-[#181818]">
          6 Plans Scheduled
        </p>
        <span className="text-[8px] text-[#c2c2c2]">{'>'}</span>
        <p className="ml-1 font-['Inter',sans-serif] text-[8px] text-[#c2c2c2]">
          Sunday, December 14
        </p>
      </div>
      {[
        { time: '7:00 AM', task: 'Morning Mindfulness', tag: 'Optimized for You', hl: true },
        { time: '8:00 AM', task: 'Breakfast Boost', tag: '' },
        { time: '9:30 AM', task: 'Team Standup', tag: 'High Priority', warn: true },
        { time: '11:00 AM', task: 'Focus Time', tag: 'Focus Block' },
        { time: '1:00 PM', task: 'Lunch Break', tag: '' },
        { time: '2:30 PM', task: 'Creative Session', tag: '' },
      ].map((r, i) => (
        <div
          key={i}
          className={`flex items-center gap-1.5 border-b border-[#f8f8f8] py-0.5 last:border-0 ${r.hl ? '-mx-0.5 rounded bg-[#f5f0ff] px-0.5' : ''}`}
        >
          <span
            className={`w-11 shrink-0 font-['Inter',sans-serif] text-[8px] font-medium ${r.warn ? 'text-[#8022fe]' : 'text-[#c2c2c2]'}`}
          >
            {r.time}
          </span>
          <p className="flex-1 truncate font-['Inter',sans-serif] text-[9px] font-medium text-[#181818]">
            {r.task}
          </p>
          {r.tag && (
            <span className="shrink-0 rounded bg-[#f0e8ff] px-1 py-0.5 font-['Inter',sans-serif] text-[7px] font-medium text-[#8022fe]">
              {r.tag}
            </span>
          )}
        </div>
      ))}
    </div>
    <div className="w-24 shrink-0 border-l border-[#f0f0f0] bg-white p-2">
      <p className="mb-1.5 font-['Inter',sans-serif] text-[9px] font-bold text-[#181818]">
        Tasks List
      </p>
      {[
        { name: 'Review Goals', time: '09:00', tag: 'Work', done: true },
        { name: 'Team Meeting', time: '10:05', tag: 'Collab', done: true },
        { name: 'Project Update', time: '11:30', tag: 'Report' },
        { name: 'Lunch Break', time: '12:30', tag: 'Rest' },
        { name: 'Client Call', time: '14:00', tag: 'Consu' },
      ].map((t, i) => (
        <div
          key={i}
          className="flex items-start gap-1 border-b border-[#f8f8f8] py-0.5 last:border-0"
        >
          <div
            className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full border ${t.done ? 'border-[#8022fe] bg-[#8022fe]' : 'border-[#d9d9d9]'}`}
          />
          <div className="min-w-0">
            <p className="truncate font-['Inter',sans-serif] text-[8px] leading-tight font-medium text-[#181818]">
              {t.name}
            </p>
            <p className="font-['Inter',sans-serif] text-[7px] text-[#c2c2c2]">
              {t.time} <span className={t.done ? 'text-[#8022fe]' : 'text-[#aaa]'}>{t.tag}</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const PlanDayVisual = () => (
  <div className="flex h-[280px] w-[520px] overflow-hidden rounded-2xl bg-[#f3f4f6] shadow-[-16px_0_16px_rgba(0,0,0,0.05)] sm:h-[320px] sm:w-[580px] lg:h-[292px] lg:w-[520px]">
    <AppSidebar />
    <DailyEmpty />
  </div>
);

const LifeHappensVisual = () => (
  <div className="h-[280px] w-[520px] overflow-hidden rounded-2xl bg-white p-4 shadow-[-16px_0_16px_rgba(0,0,0,0.05)] sm:h-[320px] sm:w-[580px] lg:h-[292px] lg:w-[520px]">
    <ConflictSchedule />
  </div>
);

const HIWStepCard = ({ cardRef, number, title, body, variant, visual }) => {
  const isAdaptCard = variant === '03';

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden border border-[#f2f2f2] bg-[#fcfcfc] ${
        isAdaptCard
          ? 'flex flex-col rounded-2xl px-5 pt-5 pb-[350px] lg:h-[720px] lg:rounded-[20px] lg:p-[30px]'
          : 'h-[300px] rounded-2xl p-5 lg:h-[350px] lg:rounded-[20px] lg:p-[30px]'
      }`}
    >
      {/* Header row */}
      <div
        className={`relative z-10 flex items-start gap-6 lg:gap-[50px] ${isAdaptCard ? 'lg:mb-5' : ''}`}
      >
        <div
          className={`flex flex-1 flex-col gap-1.5 lg:gap-2.5 ${!isAdaptCard ? 'lg:h-full lg:max-w-[230px] lg:justify-between' : ''}`}
        >
          <div className="flex flex-col gap-1.5 lg:gap-2.5">
            <h3 className="font-['Inter',sans-serif] text-[18px] leading-[1.3] font-semibold text-[#181818] lg:text-[24px]">
              {title}
            </h3>
            <p className="font-['Inter',sans-serif] text-[14px] leading-normal font-medium text-[#181818] lg:text-[16px]">
              {body}
            </p>
          </div>

          {isAdaptCard && (
            <Link to="/signup" className="mt-3 lg:mt-0">
              <button className="w-full rounded-[10px] bg-[#8022fe] px-5 py-3 font-['Inter',sans-serif] text-[14px] font-semibold text-white transition-colors hover:bg-[#6b1bdb] lg:w-auto lg:px-5 lg:py-3 lg:text-[16px]">
                Get Your First Plan
              </button>
            </Link>
          )}

          {!isAdaptCard && (
            <p className="hidden font-['Inter',sans-serif] text-[54px] leading-[1.3] font-bold text-[#f2f2f2] select-none lg:block">
              {number}
            </p>
          )}
        </div>

        <p className="font-['Inter',sans-serif] text-[40px] leading-[1.3] font-bold text-[#f2f2f2] select-none lg:hidden">
          {number}
        </p>
      </div>

      {/* Card 03 desktop number — top-right */}
      {isAdaptCard && (
        <p className="absolute top-[30px] right-[30px] hidden font-['Inter',sans-serif] text-[54px] leading-[1.3] font-bold text-[#f2f2f2] select-none lg:block">
          {number}
        </p>
      )}

      {/* Visual mockup */}
      <div
        className={
          isAdaptCard
            ? 'absolute right-5 bottom-0 left-5 lg:relative lg:mt-auto lg:flex lg:flex-1 lg:flex-col'
            : 'absolute top-[110px] left-5 lg:top-[29px] lg:right-[-40%] lg:left-auto xl:right-[-53%]'
        }
      >
        {visual}
      </div>
    </div>
  );
};

const AdaptsSection = () => {
  const secRef = useRef(null);
  const headRef = useRef(null);
  const c1Ref = useRef(null);
  const c2Ref = useRef(null);
  const c3Ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: { trigger: headRef.current, start: 'top 88%', once: true },
      });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: c1Ref.current, start: 'top 85%', once: true },
      });
      tl.from(c1Ref.current, { opacity: 0, y: 24, duration: 0.55, ease: 'power2.out' })
        .from(c2Ref.current, { opacity: 0, y: 24, duration: 0.55, ease: 'power2.out' })
        .from(c3Ref.current, { opacity: 0, y: 24, duration: 0.55, ease: 'power2.out' });
    }, secRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={secRef} className="w-full bg-white px-5 py-[50px] lg:px-6 lg:py-[90px] xl:px-24">
      <div className="mx-auto max-w-[1300px]">
        <div ref={headRef} className="mb-6 flex flex-col gap-3.5 lg:mb-10 lg:gap-5">
          <h2 className="font-['Inter',sans-serif] text-[22px] leading-[1.3] font-bold text-[#181818] lg:text-[34px]">
            How Elyxa adapts to your <span className="text-[#8022fe]">Life</span>
            <span className="text-[#14f1d9]">.</span>
          </h2>
          <p className="font-['Inter',sans-serif] text-[14px] leading-normal font-medium text-[#181818] lg:text-[16px]">
            Your plan updates itself when things don't go as expected.
          </p>
        </div>

        <div className="flex flex-col gap-5 lg:grid lg:grid-cols-2 lg:items-start">
          <div className="flex flex-col gap-5">
            <HIWStepCard
              cardRef={c1Ref}
              number="01"
              title="Plan your day"
              body="Add tasks and plan your day in seconds."
              variant="01"
              visual={<PlanDayVisual />}
            />
            <HIWStepCard
              cardRef={c2Ref}
              number="02"
              title="Life happens"
              body="Meetings run late. Plans shift. Things break."
              variant="02"
              visual={<LifeHappensVisual />}
            />
          </div>

          <HIWStepCard
            cardRef={c3Ref}
            number="03"
            title="Elyxa adapts"
            body="Your schedule updates automatically — no manual fixes."
            variant="03"
            visual={
              <AdaptedScheduleMockup className="h-[280px] w-full lg:h-[calc(100%-140px)] lg:min-h-[480px]" />
            }
          />
        </div>
      </div>
    </section>
  );
};

// ─── Section 4: Pricing ───────────────────────────────────────────────────────

const PricingCard = ({ plan, cardRef }) => {
  const inner = (
    <div
      className={`flex h-full flex-col overflow-hidden rounded-[20px] bg-white ${
        plan.featured ? 'border-2 border-[#8022fe]' : 'border border-[#f2f2f2]'
      } shadow-[0_7px_15px_rgba(0,0,0,0.02),0_27px_27px_rgba(0,0,0,0.02)]`}
    >
      <div className="flex w-full flex-col gap-1.5 border-b border-[#f2f2f2] p-6">
        <p className="font-['Inter',sans-serif] text-[22px] font-semibold text-[#181818]">
          {plan.name}
        </p>
        <p className="font-['Inter',sans-serif] text-[14px] font-medium text-[#888]">
          {plan.tagline}
        </p>
      </div>
      <div className="flex w-full flex-col gap-1 border-b border-[#f2f2f2] px-6 py-4">
        <div className="flex items-start gap-2">
          {plan.originalPrice && (
            <div className="relative flex shrink-0 items-center">
              <p className="font-['Inter',sans-serif] text-[30px] font-bold text-[#8022fe]">
                {plan.originalPrice}
              </p>
              <span className="absolute top-1/2 right-0 left-0 h-px -translate-y-1/2 bg-[#8022fe]" />
            </div>
          )}
          <div className="flex items-baseline">
            <p className="shrink-0 font-['Inter',sans-serif] text-[30px] font-bold text-[#181818]">
              {plan.price}
            </p>
            <p className="font-['Inter',sans-serif] text-[13px] font-medium text-[#c2c2c2]">
              {plan.priceSuffix}
            </p>
          </div>
        </div>
        {plan.billingNote && (
          <p className="font-['Inter',sans-serif] text-[13px] font-medium text-[#c2c2c2]">
            {plan.billingNote}
          </p>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        {plan.features.map((f) => (
          <div key={f} className="flex items-center gap-2">
            <PlanCheckIcon />
            <p className="font-['Inter',sans-serif] text-[13px] font-medium text-[#181818]">{f}</p>
          </div>
        ))}
      </div>
      <div className="p-6">
        <button
          className={`w-full rounded-[10px] px-5 py-3 font-['Inter',sans-serif] text-[14px] font-semibold transition-colors ${
            plan.ctaFilled
              ? 'bg-[#8022fe] text-white hover:bg-[#6b1bdb]'
              : 'border-2 border-[#8022fe] bg-white text-[#8022fe] hover:bg-[#f9f4ff]'
          }`}
        >
          {plan.cta}
        </button>
      </div>
    </div>
  );

  if (plan.featured) {
    return (
      <div ref={cardRef} className="relative flex flex-col items-center">
        <div className="absolute -top-3 z-10 flex items-center justify-center rounded-[40px] bg-[#8022fe] px-3 py-0.5">
          <p className="font-['Inter',sans-serif] text-[11px] font-medium text-white">
            {plan.badge}
          </p>
        </div>
        <div className="w-full flex-1">{inner}</div>
      </div>
    );
  }
  return <div ref={cardRef}>{inner}</div>;
};

const PricingHIW = () => {
  const [billing, setBilling] = useState('yearly');
  const plans = billing === 'yearly' ? YEARLY_PLANS : MONTHLY_PLANS;
  const secRef = useRef(null);
  const headRef = useRef(null);
  const cr0 = useRef(null);
  const cr1 = useRef(null);
  const cr2 = useRef(null);
  const cr3 = useRef(null);
  const cardRefs = [cr0, cr1, cr2, cr3];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: { trigger: headRef.current, start: 'top 88%', once: true },
      });
      cardRefs.forEach((r, i) => {
        gsap.from(r.current, {
          opacity: 0,
          y: 20,
          duration: 0.5,
          ease: 'power2.out',
          delay: i * 0.1,
          scrollTrigger: { trigger: r.current, start: 'top 90%', once: true },
        });
      });
    }, secRef);
    return () => ctx.revert();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section ref={secRef} id="pricing" className="w-full bg-[#fcfcfc] px-6 py-20 lg:px-24">
      <div className="mx-auto max-w-[1300px]">
        <div ref={headRef} className="mb-10 flex flex-col items-center gap-3 text-center">
          <h2 className="font-['Inter',sans-serif] text-[26px] font-bold text-[#181818] sm:text-[32px]">
            Your day, fully managed by AI — <span className="text-[#8022fe]">From $6.39/month</span>
            <span className="text-[#14f1d9]">.</span>
          </h2>
          <p className="font-['Inter',sans-serif] text-[13px] font-medium text-[#c2c2c2]">
            (Billed yearly)
          </p>
          <p className="font-['Inter',sans-serif] text-[15px] font-medium text-[#181818]">
            Start free. Upgrade when you need real productivity. Cancel anytime.
          </p>
        </div>

        <div className="mb-8 flex justify-center">
          <div className="flex items-center overflow-hidden rounded-xl border border-[#f2f2f2] p-1">
            {['monthly', 'yearly'].map((opt) => (
              <button
                key={opt}
                onClick={() => setBilling(opt)}
                className={`flex items-center gap-2 rounded-lg px-5 py-2.5 font-['Inter',sans-serif] text-[13px] font-semibold capitalize transition-all ${
                  billing === opt
                    ? opt === 'yearly'
                      ? 'bg-white text-[#8022fe] shadow-[0_0_5px_rgba(0,0,0,0.05)]'
                      : 'bg-white text-[#181818] shadow-[0_0_5px_rgba(0,0,0,0.05)]'
                    : 'text-[#c2c2c2]'
                }`}
              >
                {opt === 'yearly' ? 'Yearly' : 'Monthly'}
                {opt === 'yearly' && (
                  <span
                    className={`rounded-[40px] px-2 py-0.5 font-['Inter',sans-serif] text-[11px] font-medium text-white ${billing === 'yearly' ? 'bg-[#8022fe]' : 'bg-[#c2c2c2]'}`}
                  >
                    Save 20%
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan, i) => (
            <PricingCard key={plan.id} plan={plan} cardRef={cardRefs[i]} />
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-10">
          {['No commitment', 'Cancel anytime', 'Secure payments'].map((t) => (
            <p key={t} className="font-['Inter',sans-serif] text-[12px] font-medium text-[#c2c2c2]">
              {t}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Section 5: Missing Layer ─────────────────────────────────────────────────

const MISSING_ROWS = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="4" width="16" height="13" rx="2" stroke="#8022FE" strokeWidth="1.4" />
        <path d="M6 2V5M14 2V5M2 8H18" stroke="#8022FE" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
    tool: 'Calendars',
    badge: 'Auto-Adapts',
    badgeColor: 'bg-[#f0e8ff] text-[#8022fe]',
    problem: "They manage schedules, but can't adapt when plans change.",
    solution: 'Your schedule adapts automatically when life changes.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="3" y="3" width="14" height="14" rx="2" stroke="#8022FE" strokeWidth="1.4" />
        <path
          d="M7 10L9 12L13 8"
          stroke="#8022FE"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    tool: 'Task Managers',
    badge: 'Reprioritizes',
    badgeColor: 'bg-[#e8fff9] text-[#0aab7a]',
    problem: 'Tasks pile up. The list grows longer — not smarter.',
    solution: 'Tasks are reprioritized based on your actual capacity.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M10 3C6.686 3 4 5.686 4 9C4 12.314 6.686 15 10 15C13.314 15 16 12.314 16 9"
          stroke="#8022FE"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M13 3L16 6L13 9"
          stroke="#8022FE"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    tool: 'Habit Trackers',
    badge: 'Adapts to Reality',
    badgeColor: 'bg-[#fff8e8] text-[#d97706]',
    problem: "They track streaks, but don't understand context. One bad day breaks your progress.",
    solution: 'Distinguishes between failure and necessary adjustment.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="3" y="3" width="14" height="14" rx="2" stroke="#8022FE" strokeWidth="1.4" />
        <path
          d="M6 7H14M6 10H14M6 13H11"
          stroke="#8022FE"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    ),
    tool: 'Notes & Docs',
    badge: 'Focuses on Action',
    badgeColor: 'bg-[#fff0f5] text-[#e11d48]',
    problem: 'You spend more time building the system than doing the work.',
    solution: 'No setup. Built for action, not planning.',
  },
];

const MissingLayerSection = () => {
  const secRef = useRef(null);
  const headRef = useRef(null);
  const r0 = useRef(null);
  const r1 = useRef(null);
  const r2 = useRef(null);
  const r3 = useRef(null);
  const rowRefs = [r0, r1, r2, r3];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: { trigger: headRef.current, start: 'top 88%', once: true },
      });
      rowRefs.forEach((r, i) => {
        gsap.from(r.current, {
          opacity: 0,
          y: 16,
          duration: 0.5,
          ease: 'power2.out',
          delay: i * 0.09,
          scrollTrigger: { trigger: r.current, start: 'top 90%', once: true },
        });
      });
    }, secRef);
    return () => ctx.revert();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section ref={secRef} className="w-full bg-white px-6 py-20 lg:px-24">
      <div className="mx-auto max-w-[1100px]">
        <div ref={headRef} className="mb-10 flex flex-col items-center gap-3 text-center">
          <h2 className="font-['Inter',sans-serif] text-[26px] font-bold text-[#181818] sm:text-[34px]">
            The missing layer in your <span className="text-[#8022fe]">Workflow</span>
            <span className="text-[#14f1d9]">.</span>
          </h2>
          <p className="font-['Inter',sans-serif] text-[15px] font-medium text-[#888]">
            Your tools manage tasks — but they don't adapt when life changes.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#f0f0f0]">
          {MISSING_ROWS.map((row, i) => (
            <div
              key={row.tool}
              ref={rowRefs[i]}
              className="border-b border-[#f0f0f0] bg-white last:border-0"
            >
              <div className="flex items-center gap-3 px-8 pt-6 pb-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f5f0ff]">
                  {row.icon}
                </div>
                <p className="font-['Inter',sans-serif] text-[17px] font-bold text-[#181818]">
                  {row.tool}
                </p>
                <span
                  className={`rounded-full px-3 py-1 font-['Inter',sans-serif] text-[12px] font-medium ${row.badgeColor}`}
                >
                  {row.badge}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-8 px-8 pb-6">
                <div>
                  <p className="mb-1.5 font-['Inter',sans-serif] text-[13px] font-medium text-[#181818]">
                    The problem
                  </p>
                  <p className="font-['Inter',sans-serif] text-[14px] leading-relaxed font-medium text-[#c2c2c2]">
                    {row.problem}
                  </p>
                </div>
                <div>
                  <p className="mb-1.5 font-['Inter',sans-serif] text-[13px] font-medium text-[#181818]">
                    With Elyxa
                  </p>
                  <div className="flex items-start gap-2">
                    <ElyxaIcon />
                    <p className="font-['Inter',sans-serif] text-[14px] leading-relaxed font-medium text-[#8022fe]">
                      {row.solution}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Section 6: FAQ ───────────────────────────────────────────────────────────

const FAQItem = ({ faq, animRef }) => {
  const [open, setOpen] = useState(false);
  return (
    <div ref={animRef} className="overflow-hidden rounded-2xl border border-[#f0f0f0] bg-white">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-center justify-between px-7 py-5 text-left"
      >
        <p
          className={`font-['Inter',sans-serif] text-[16px] font-semibold ${open ? 'text-[#8022fe]' : 'text-[#181818]'}`}
        >
          {faq.q}
        </p>
        <div
          className={`ml-4 flex h-6 w-6 shrink-0 items-center justify-center ${open ? 'text-[#8022fe]' : 'text-[#181818]'}`}
        >
          {open ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 2L12 12M12 2L2 12"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 7H12M7 2V12"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>
      </button>
      <div
        className="transition-all duration-300 ease-out"
        style={{ maxHeight: open ? '300px' : '0px', overflow: 'hidden' }}
      >
        <p className="px-7 pb-6 font-['Inter',sans-serif] text-[15px] leading-relaxed font-medium text-[#888]">
          {faq.a}
        </p>
      </div>
    </div>
  );
};

const FAQHIWSection = () => {
  const secRef = useRef(null);
  const headRef = useRef(null);
  const f0 = useRef(null);
  const f1 = useRef(null);
  const f2 = useRef(null);
  const f3 = useRef(null);
  const f4 = useRef(null);
  const f5 = useRef(null);
  const faqRefs = [f0, f1, f2, f3, f4, f5];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: { trigger: headRef.current, start: 'top 88%', once: true },
      });
      faqRefs.forEach((r, i) => {
        gsap.from(r.current, {
          opacity: 0,
          y: 14,
          duration: 0.45,
          ease: 'power2.out',
          delay: i * 0.07,
          scrollTrigger: { trigger: r.current, start: 'top 92%', once: true },
        });
      });
    }, secRef);
    return () => ctx.revert();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section ref={secRef} className="w-full bg-[#fcfcfc] px-6 py-20 lg:px-24">
      <div className="mx-auto max-w-[900px]">
        <div ref={headRef} className="mb-10 text-center">
          <h2 className="font-['Inter',sans-serif] text-[26px] font-bold text-[#181818] sm:text-[34px]">
            Frequently Asked <span className="text-[#8022fe]">Questions</span>
            <span className="text-[#14f1d9]">.</span>
          </h2>
          <p className="mt-3 font-['Inter',sans-serif] text-[15px] font-medium text-[#888]">
            Everything you need to know before getting started.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          {FAQS.map((faq, i) => (
            <FAQItem key={faq.q} faq={faq} animRef={faqRefs[i]} />
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Section 7: Final CTA ─────────────────────────────────────────────────────

const CTADashboard = () => (
  <div
    className="flex overflow-hidden rounded-xl shadow-[0_8px_40px_rgba(0,0,0,0.2)]"
    style={{ height: 270 }}
  >
    <div className="flex w-8 shrink-0 flex-col items-center gap-2 bg-[#222] py-2">
      <div className="flex h-4 w-4 items-center justify-center rounded bg-[#8022fe]">
        <span style={{ fontSize: 6, color: 'white', fontWeight: 700 }}>E</span>
      </div>
      {[...Array(7)].map((_, i) => (
        <div key={i} className="h-3 w-3 rounded bg-[#333]" />
      ))}
    </div>
    <div className="flex flex-1 flex-col overflow-hidden bg-white p-3">
      <p className="mb-0.5 font-['Inter',sans-serif] text-[11px] font-bold text-[#181818]">Daily</p>
      <div className="mb-2 flex items-center gap-1">
        <span className="text-[8px] text-[#c2c2c2]">{'<'}</span>
        <p className="font-['Inter',sans-serif] text-[8px] font-medium text-[#181818]">
          6 Plans Scheduled
        </p>
        <span className="text-[8px] text-[#c2c2c2]">{'>'}</span>
        <p className="ml-1 font-['Inter',sans-serif] text-[8px] text-[#c2c2c2]">
          Sunday, December 14
        </p>
      </div>
      {[
        { time: '7:00 AM', task: 'Morning Mindfulness', tag: 'Optimized for You', hl: true },
        { time: '8:00 AM', task: 'Breakfast Boost', tag: '' },
        { time: '9:30 AM', task: 'Team Standup', tag: 'High Priority' },
        { time: '11:00 AM', task: 'Focus Time', tag: 'Focus Block' },
        { time: '1:00 PM', task: 'Lunch Break', tag: '' },
        { time: '2:30 PM', task: 'Creative Session', tag: '' },
      ].map((r, i) => (
        <div
          key={i}
          className={`flex items-center gap-1.5 border-b border-[#f8f8f8] py-1 last:border-0 ${r.hl ? '-mx-0.5 rounded bg-[#f5f0ff] px-0.5' : ''}`}
        >
          <span className="w-11 shrink-0 font-['Inter',sans-serif] text-[8px] font-medium text-[#c2c2c2]">
            {r.time}
          </span>
          <p className="flex-1 truncate font-['Inter',sans-serif] text-[9px] font-medium text-[#181818]">
            {r.task}
          </p>
          {r.tag && (
            <span className="shrink-0 rounded bg-[#f0e8ff] px-1 py-0.5 font-['Inter',sans-serif] text-[7px] font-medium text-[#8022fe]">
              {r.tag}
            </span>
          )}
        </div>
      ))}
    </div>
    <div className="w-28 shrink-0 border-l border-[#f0f0f0] bg-white p-2.5">
      <p className="mb-1.5 font-['Inter',sans-serif] text-[9px] font-bold text-[#181818]">
        Tasks List
      </p>
      {[
        { name: 'Review Goals', time: '09:00', tag: 'Work', done: true },
        { name: 'Team Meeting', time: '10:00', tag: 'Collaboration', done: true },
        { name: 'Project Update', time: '11:30', tag: 'Reporting' },
        { name: 'Lunch Break', time: '12:30', tag: 'Rest' },
        { name: 'Client Call', time: '14:00', tag: 'Consulting' },
        { name: 'Generate with AI', time: '', tag: '' },
      ].map((t, i) => (
        <div
          key={i}
          className="flex items-start gap-1 border-b border-[#f8f8f8] py-0.5 last:border-0"
        >
          <div
            className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full border ${t.done ? 'border-[#8022fe] bg-[#8022fe]' : 'border-[#d9d9d9]'}`}
          />
          <div className="min-w-0">
            <p className="truncate font-['Inter',sans-serif] text-[8px] leading-tight font-medium text-[#181818]">
              {t.name}
            </p>
            {t.time && (
              <p className="font-['Inter',sans-serif] text-[7px] text-[#c2c2c2]">
                {t.time} <span className={t.done ? 'text-[#8022fe]' : 'text-[#aaa]'}>{t.tag}</span>
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const FinalCTASection = () => {
  const secRef = useRef(null);
  const textRef = useRef(null);
  const dashRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: secRef.current, start: 'top 80%', once: true },
      });
      tl.from(textRef.current, { opacity: 0, y: 20, duration: 0.55, ease: 'power2.out' }).from(
        dashRef.current,
        { opacity: 0, y: 24, duration: 0.6, ease: 'expo.out' },
        '-=0.2'
      );
    }, secRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="w-full bg-white px-6 py-20 lg:px-24">
      <div className="mx-auto max-w-[1300px]">
        <div
          ref={secRef}
          className="relative overflow-hidden rounded-[28px] bg-[#181818] px-10 py-14 lg:flex lg:items-center lg:gap-12"
        >
          <div ref={textRef} className="shrink-0 lg:w-[400px]">
            <h2 className="mb-4 font-['Inter',sans-serif] text-[28px] leading-tight font-bold text-white sm:text-[36px]">
              Your plans should adapt to <span className="text-[#8022fe]">You</span>
              <span className="text-[#14f1d9]">.</span>
            </h2>
            <p className="mb-8 font-['Inter',sans-serif] text-[15px] leading-relaxed font-medium text-[#888]">
              Elyxa adjusts your day as things change — so you always know what to do next.
            </p>
            <Link to="/signup">
              <button className="rounded-xl bg-[#8022fe] px-7 py-3.5 font-['Inter',sans-serif] text-[15px] font-semibold text-white shadow-[0_4px_20px_rgba(128,34,254,0.4)] transition-colors hover:bg-[#6b1bdb]">
                Get Your First Plan
              </button>
            </Link>
            <p className="mt-4 flex items-center gap-2 font-['Inter',sans-serif] text-[13px] font-medium text-[#555]">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M7 1L8.5 5H13L9.5 7.5L11 12L7 9.5L3 12L4.5 7.5L1 5H5.5L7 1Z"
                  stroke="#666"
                  strokeWidth="1"
                  strokeLinejoin="round"
                />
              </svg>
              Takes less than a minute
            </p>
          </div>

          <div ref={dashRef} className="mt-8 flex-1 lg:mt-0">
            <CTADashboard />
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Root ─────────────────────────────────────────────────────────────────────

const HowItWorksSection = () => (
  <div className="w-full">
    <HeroHIW />
    <BreakingSection />
    <AdaptsSection />
    <PricingHIW />
    <MissingLayerSection />
    <FAQHIWSection />
    <FinalCTASection />
  </div>
);

export default HowItWorksSection;
