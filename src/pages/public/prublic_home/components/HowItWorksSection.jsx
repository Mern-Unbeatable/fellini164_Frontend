import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import {
  PiCompass,
  PiInfinity,
  PiWarning,
  PiTimer,
  PiCalendarCheckDuotone,
  PiCheckSquare,
  PiFileDuotone,
} from 'react-icons/pi';
import { MdChecklist } from 'react-icons/md';
import { GoMegaphone } from 'react-icons/go';
import { HiOutlineSparkles, HiArrowPathRoundedSquare } from 'react-icons/hi2';

gsap.registerPlugin(ScrollTrigger);

// ─── Shared icons ─────────────────────────────────────────────────────────────

const PlanCheckIcon = () => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="none"
    className="size-[14px] shrink-0 lg:size-4"
  >
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

const PRICING_CARD_SHADOW =
  'shadow-[0px_171px_48px_0px_rgba(0,0,0,0),0px_109px_44px_0px_rgba(0,0,0,0),0px_61px_37px_0px_rgba(0,0,0,0.01),0px_27px_27px_0px_rgba(0,0,0,0.02),0px_7px_15px_0px_rgba(0,0,0,0.02)]';

// ─── Pricing data ─────────────────────────────────────────────────────────────

const YEARLY_PLANS = [
  {
    id: 'free',
    name: 'Free',
    tagline: 'Limited features only',
    price: '$0',
    priceSuffix: '/month',
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
    priceSuffix: '/month',
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
    priceSuffix: '/month',
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
    priceSuffix: '/month',
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

const TASK_TAG_STYLES = {
  green: { text: 'text-[#16a34a]', border: 'border-[rgba(22,163,74,0.2)]' },
  yellow: { text: 'text-[#a38e16]', border: 'border-[rgba(163,142,22,0.2)]' },
  blue: { text: 'text-[#1647a3]', border: 'border-[rgba(22,71,163,0.2)]' },
  purple: { text: 'text-[#7d16a3]', border: 'border-[rgba(125,22,163,0.2)]' },
};

const BREAKING_TASKS = [
  {
    name: 'Review Goals',
    time: '09:00',
    tag: 'Work',
    tagStyle: 'green',
    done: true,
    timeBg: 'bg-[#f8f8f8]',
  },
  {
    name: 'Team Meeting',
    time: '10:00',
    tag: 'Collaboration',
    tagStyle: 'yellow',
    done: true,
    timeBg: 'bg-[#f3f4f6]',
  },
  {
    name: 'Project Update',
    time: '11:30',
    tag: 'Reporting',
    tagStyle: 'blue',
    done: false,
    timeBg: 'bg-[#f3f4f6]',
  },
  {
    name: 'Lunch Break',
    time: '12:30',
    tag: 'Rest',
    tagStyle: 'purple',
    done: false,
    timeBg: 'bg-white',
  },
  {
    name: 'Client Call',
    time: '14:00',
    tag: 'Consultation',
    tagStyle: 'green',
    done: false,
    timeBg: 'bg-white',
  },
];

const TaskCheckboxIcon = ({ done }) =>
  done ? (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="shrink-0">
      <rect x="0.5" y="0.5" width="14" height="14" rx="3" fill="#8022FE" stroke="#8022FE" />
      <path
        d="M4 7.5L6.5 10L11 5"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ) : (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="shrink-0">
      <rect x="0.5" y="0.5" width="14" height="14" rx="3" stroke="#D9D9D9" />
    </svg>
  );

const BreakingTasksList = ({ className = '' }) => (
  <div
    className={`flex flex-col gap-3.5 rounded-[18px] border border-[#f2f2f2] bg-white p-3.5 shadow-[0px_10.97px_21.939px_rgba(0,0,0,0.05)] lg:rounded-[18px] lg:p-3.5 ${className}`}
  >
    <p className="font-['Inter',sans-serif] text-[11px] font-semibold text-[#181818] lg:text-[12px]">
      Tasks List
    </p>
    <div className="flex max-h-[220px] flex-col gap-2.5 overflow-hidden lg:max-h-[292px] lg:gap-2.5">
      {BREAKING_TASKS.map((task) => {
        const tag = TASK_TAG_STYLES[task.tagStyle];
        return (
          <div
            key={task.name}
            className="flex items-center gap-2.5 rounded-[8px] border border-[#f2f2f2] bg-[#fcfcfc] p-2.5 lg:gap-2.5 lg:p-2.5"
          >
            <TaskCheckboxIcon done={task.done} />
            <div className="min-w-0 flex-1">
              <p
                className={`font-['Inter',sans-serif] text-[10px] font-medium text-[#181818] lg:text-[10px] ${task.done ? 'line-through' : ''}`}
              >
                {task.name}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-1">
                <span
                  className={`rounded px-1 py-0.5 font-['Inter',sans-serif] text-[7px] font-medium text-[#181818] lg:text-[7.5px] ${task.timeBg}`}
                >
                  {task.time}
                </span>
                <span
                  className={`rounded-full border bg-white px-1 py-0.5 font-['Inter',sans-serif] text-[7px] font-medium lg:text-[7.5px] ${tag.text} ${tag.border}`}
                >
                  {task.tag}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
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
    <section ref={secRef} className="w-full bg-white px-6 py-10 lg:px-24">
      <div className="mx-auto max-w-[1370px] px-2 lg:px-6 xl:px-0">
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
                <GoMegaphone size={18} className="text-purple-600" />
              </div>
              <h3 className="font-['Inter',sans-serif] text-[18px] leading-[1.3] font-semibold text-[#181818] lg:text-[24px]">
                The Gap
              </h3>
            </div>
            <p className="font-['Inter',sans-serif] text-[14px] leading-normal font-medium text-[#181818] lg:text-[16px]">
              Most planning tools work — until something changes. Then everything falls <br />{' '}
              apart.
            </p>
          </div>

          {/* Card 2 — The Consequence */}
          <div
            ref={c1}
            className="rounded-2xl border border-[#f0f0f0] bg-white p-7 shadow-[0_2px_16px_rgba(0,0,0,0.04)]"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5f0ff]">
                <PiWarning size={18} className="text-purple-600" />
              </div>
              <h3 className="font-['Inter',sans-serif] text-[18px] leading-[1.3] font-semibold text-[#181818] lg:text-[24px]">
                The Consequence
              </h3>
            </div>
            <p className="font-['Inter',sans-serif] text-[14px] leading-normal font-medium text-[#181818] lg:text-[16px]">
              One delay, one unexpected event — and your day turns into a list of overdue <br />{' '}
              tasks.
            </p>
          </div>

          {/* Card 3 — Start planning differently */}
          <div
            ref={c2}
            className="relative min-h-[217px] overflow-hidden rounded-2xl border border-[#f2f2f2] bg-[#fcfcfc] p-4 lg:min-h-[163px] lg:rounded-[20px] lg:p-6"
          >
            <BreakingTasksList className="absolute top-[97px] right-[-51px] z-10 w-[200px] lg:top-[23px] lg:right-[-45px] lg:w-[224px]" />

            <div className="relative z-0 flex max-w-[calc(100%-80px)] flex-col gap-2.5 lg:max-w-[400px] lg:gap-2.5">
              <div className="flex items-center gap-2.5 lg:gap-3.5">
                <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg bg-[#f9f4ff] lg:h-[34px] lg:w-[34px]">
                  <HiOutlineSparkles size={16} className="text-[#8022fe] lg:hidden" />
                  <HiOutlineSparkles size={18} className="hidden text-[#8022fe] lg:block" />
                </div>
                <h3 className="font-['Inter',sans-serif] text-[18px] leading-[1.3] font-semibold text-[#181818] lg:text-[24px]">
                  Start planning differently
                </h3>
              </div>
              <p className="font-['Inter',sans-serif] text-[14px] leading-normal font-medium text-[#181818] lg:text-[16px]">
                See how your schedule adapts when life changes.
              </p>
            </div>

            <button className="relative z-0 mt-[70px] rounded-lg bg-[#8022fe] px-4 py-2 font-['Inter',sans-serif] text-[14px] font-semibold text-white transition-colors hover:bg-[#6b1bdb] lg:mt-3.5">
              Try It Yourself
            </button>
          </div>

          {/* Card 4 — The Result */}
          <div
            ref={c3}
            className="rounded-2xl border border-[#e9e8e8] bg-[#fcfcfc] p-4 shadow-[0px_15px_7.5px_rgba(0,0,0,0.02)] lg:rounded-[20px] lg:p-6"
          >
            <div className="mb-2.5 flex items-center gap-2.5 lg:gap-3.5">
              <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg bg-[#f9f4ff] lg:h-[34px] lg:w-[34px]">
                <PiTimer size={16} className="text-[#8022fe] lg:hidden" />
                <PiTimer size={18} className="hidden text-[#8022fe] lg:block" />
              </div>
              <h3 className="font-['Inter',sans-serif] text-[18px] leading-[1.3] font-semibold text-[#181818] lg:text-[24px]">
                The Result
              </h3>
            </div>
            <p className="font-['Inter',sans-serif] text-[14px] leading-normal font-medium text-[#181818] lg:text-[16px]">
              You don't feel organized — you feel behind. And most days end in either catching up or
              giving up.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Section 3: Adapts (Figma 842:84149 desktop / 278:4187 mobile) ─────────────

const ADAPTS_MOBILE_STEPS = [
  {
    number: '01',
    title: 'Plan your day',
    body: 'Add tasks and plan your day in seconds.',
    variant: '01',
    visual: '/images/how-it-works/hiw-adapts-card01-visual-mobile.png',
    visualClass:
      'absolute left-[19px] top-[110px] w-[550px] rounded-[13.2px] drop-shadow-[-16.337px_0_16.337px_rgba(0,0,0,0.05)]',
    alt: 'Elyxa daily plan interface with empty schedule and add task button',
  },
  {
    number: '02',
    title: 'Life happens',
    body: 'Meetings run late. Plans shift. Things break.',
    variant: '02',
    visual: '/images/how-it-works/hiw-adapts-card02-visual-mobile.png',
    visualClass:
      'absolute left-[19px] top-[110px] w-[320px] rounded-[13.672px] shadow-[0_0_35.165px_rgba(0,0,0,0.05)]',
    alt: 'Schedule with time conflicts and overdue tasks',
  },
  {
    number: '03',
    title: 'Elyxa adapts',
    body: 'Your schedule updates automatically — no manual fixes.',
    variant: '03',
    visual: '/images/how-it-works/hiw-adapts-card03-visual-mobile.png',
    visualClass:
      'absolute bottom-[-121px] right-[-301px] w-[600px] rounded-[14.4px] drop-shadow-[-13.304px_0_13.304px_rgba(0,0,0,0.05)]',
    alt: 'Elyxa adapted schedule with daily plan, tasks list, and AI generate panel',
  },
];

const AdaptsMobileCard = ({ cardRef, number, title, body, variant, visual, visualClass, alt }) => {
  const isAdaptCard = variant === '03';

  return (
    <div
      ref={cardRef}
      className={`relative w-full max-w-[320px] overflow-hidden border border-[#f2f2f2] bg-[#fcfcfc] ${
        isAdaptCard
          ? 'flex flex-col gap-4 rounded-2xl px-5 pt-5 pb-[350px]'
          : 'h-[300px] rounded-2xl p-5'
      }`}
    >
      <div className="relative z-10 flex items-start gap-[30px]">
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

      {isAdaptCard && (
        <Link to="/signup" className="relative z-10 w-full">
          <button className="w-full rounded-[10px] bg-[#8022fe] px-5 py-3 font-['Inter',sans-serif] text-[14px] font-semibold text-white transition-colors hover:bg-[#6b1bdb]">
            Get Your First Plan
          </button>
        </Link>
      )}

      <img
        src={visual}
        alt={alt}
        className={`pointer-events-none z-0 h-auto max-w-none select-none ${visualClass}`}
        draggable={false}
      />
    </div>
  );
};

const AdaptsDesktopCards = () => (
  <div className="hidden w-full overflow-x-auto lg:block">
    <div className="flex min-w-[1300px] items-center gap-5">
      <div className="flex w-[640px] shrink-0 flex-col gap-5">
        <img
          src="/images/how-it-works/hiw-adapts-card01-full.png"
          alt="Plan your day — Elyxa daily plan interface"
          width={640}
          height={350}
          className="h-[350px] w-[640px] shrink-0 rounded-[20px]"
          draggable={false}
        />
        <img
          src="/images/how-it-works/hiw-adapts-card02-full.png"
          alt="Life happens — schedule with time conflicts"
          width={640}
          height={350}
          className="h-[350px] w-[640px] shrink-0 rounded-[20px]"
          draggable={false}
        />
      </div>

      <div className="relative h-[720px] w-[640px] shrink-0">
        <img
          src="/images/how-it-works/hiw-adapts-card03-full.png"
          alt="Elyxa adapts — full dashboard with tasks list and AI panel"
          width={640}
          height={720}
          className="h-[720px] w-[640px] rounded-[20px]"
          draggable={false}
        />
        <Link
          to="/signup"
          className="absolute top-[139px] left-[30px] z-10 h-[43px] w-[220px] rounded-[10px]"
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
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: { trigger: headRef.current, start: 'top 88%', once: true },
      });
      gsap.from(cardsAnimRef.current, {
        opacity: 0,
        y: 24,
        duration: 0.55,
        ease: 'power2.out',
        scrollTrigger: { trigger: cardsAnimRef.current, start: 'top 85%', once: true },
      });
    }, secRef);
    return () => ctx.revert();
  }, []);

  const [step01, step02, step03] = ADAPTS_MOBILE_STEPS;

  return (
    <section ref={secRef} className="w-full bg-white">
      <div className="mx-auto max-w-[1300px] px-5 py-[50px] lg:px-0 lg:pt-[90px] lg:pb-[180px]">
        <div className="flex flex-col gap-6 lg:gap-[50px]">
          <div ref={headRef} className="flex max-w-[640px] flex-col gap-3.5 lg:gap-5">
            <h2 className="font-['Inter',sans-serif] text-[22px] leading-[1.3] font-bold text-[#181818] lg:text-[34px]">
              How Elyxa adapts to your <span className="text-[#8022fe]">Life</span>
              <span className="text-[#14f1d9]">.</span>
            </h2>
            <p className="font-['Inter',sans-serif] text-[14px] leading-normal font-medium text-[#181818] lg:text-[16px]">
              Your plan updates itself when things don't go as expected.
            </p>
          </div>

          <div ref={cardsAnimRef}>
            <AdaptsDesktopCards />

            <div className="flex flex-col gap-5 lg:hidden">
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

// ─── Section 4: Pricing ───────────────────────────────────────────────────────

const StrikethroughPrice = ({ price }) => (
  <div className="relative flex shrink-0 items-center">
    <p className="font-['Inter',sans-serif] text-[22px] leading-[1.3] font-bold text-[#8022fe] lg:text-[34px]">
      {price}
    </p>
    <span className="absolute top-1/2 right-0 left-0 h-[2px] -translate-y-1/2 bg-[#8022fe] lg:h-[3px]" />
  </div>
);

const PricingToggle = ({ billing, onChange }) => (
  <div className="flex w-full items-center overflow-hidden rounded-[12px] border border-[#f2f2f2] p-1 lg:w-[268px]">
    {['monthly', 'yearly'].map((opt) => {
      const isActive = billing === opt;
      return (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`flex flex-1 items-center justify-center rounded-[8px] px-5 py-2.5 font-['Inter',sans-serif] text-[12px] font-semibold capitalize transition-all lg:flex-none lg:text-[14px] ${
            isActive
              ? 'bg-white text-[#8022fe] shadow-[0px_0px_5px_rgba(0,0,0,0.05)]'
              : 'text-[#c2c2c2]'
          } ${isActive && opt === 'monthly' ? 'text-[#181818]' : ''} ${opt === 'yearly' ? 'gap-2' : ''}`}
        >
          {opt === 'yearly' ? 'Yearly' : 'Monthly'}
          {opt === 'yearly' && (
            <span
              className={`rounded-[40px] px-2 py-0.5 font-['Inter',sans-serif] text-[10px] font-medium text-white shadow-[0px_0px_5px_rgba(128,34,254,0.3)] lg:text-[12px] ${
                isActive ? 'bg-[#8022fe]' : 'bg-[#c2c2c2]'
              }`}
            >
              Save 20%
            </span>
          )}
        </button>
      );
    })}
  </div>
);

const PricingCard = ({ plan, cardRef, billing }) => {
  const isYearly = billing === 'yearly';
  const showDiscount = isYearly && plan.originalPrice;
  const borderClass = plan.featured
    ? 'border-2 border-[#8022fe]'
    : plan.id === 'free'
      ? 'border border-[#f2f2f2] lg:border-[#e9e8e8]'
      : 'border border-[#f2f2f2]';

  const cardBody = (
    <>
      <div className="flex w-full flex-1 flex-col">
        <div className="flex w-full flex-col gap-1 border-b border-[#f2f2f2] p-5 lg:gap-1.5 lg:p-6">
          <p className="font-['Inter',sans-serif] text-[18px] leading-[1.3] font-semibold text-[#181818] lg:text-[24px]">
            {plan.name}
          </p>
          <p className="font-['Inter',sans-serif] text-[14px] leading-[1.5] font-medium text-[#181818] lg:text-[16px]">
            {plan.tagline}
          </p>
        </div>

        <div className="border-b border-[#f2f2f2] px-5 py-3.5 lg:flex lg:flex-col lg:gap-1 lg:px-6 lg:py-4">
          <div className="flex w-full items-center gap-1.5 lg:items-start lg:gap-2.5">
            {showDiscount && <StrikethroughPrice price={plan.originalPrice} />}
            <div className="flex items-baseline">
              <p className="font-['Inter',sans-serif] text-[22px] leading-[1.3] font-bold text-[#181818] lg:text-[34px]">
                {plan.price}
              </p>
              <p className="font-['Inter',sans-serif] text-[12px] leading-[1.5] font-medium text-[#c2c2c2] lg:text-[16px]">
                {plan.priceSuffix}
              </p>
            </div>
            {plan.billingNote && (
              <p className="ml-auto shrink-0 font-['Inter',sans-serif] text-[12px] leading-[1.5] font-medium text-[#c2c2c2] lg:hidden">
                {plan.billingNote}
              </p>
            )}
          </div>
          {plan.billingNote && (
            <p className="hidden font-['Inter',sans-serif] text-[14px] leading-[1.5] font-medium text-[#c2c2c2] lg:block">
              {plan.billingNote}
            </p>
          )}
        </div>

        <div className="flex flex-1 flex-col px-5 pt-5 pb-2.5 lg:p-6">
          <div className="flex flex-col gap-2.5 lg:gap-3.5">
            {plan.features.map((f) => (
              <div key={f} className="flex items-center gap-1.5 lg:gap-2">
                <PlanCheckIcon />
                <p className="font-['Inter',sans-serif] text-[12px] leading-[1.5] font-medium text-[#181818] lg:text-[14px]">
                  {f}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 pt-2.5 pb-5 lg:p-6">
        <button
          type="button"
          className={`w-full rounded-[10px] px-5 py-3 font-['Inter',sans-serif] text-[14px] font-semibold transition-colors lg:text-[16px] ${
            plan.ctaFilled
              ? 'bg-[#8022fe] text-white hover:bg-[#6b1bdb]'
              : 'border-2 border-[#8022fe] bg-white text-[#8022fe] hover:bg-[#f9f4ff]'
          }`}
        >
          {plan.cta}
        </button>
      </div>
    </>
  );

  if (plan.featured) {
    return (
      <div
        ref={cardRef}
        className="relative flex w-full flex-col items-center lg:h-[620px] lg:w-[310px] lg:shrink-0 lg:gap-[7px]"
      >
        <div
          className={`relative flex h-[460px] w-full flex-col justify-between overflow-hidden rounded-[16px] bg-white lg:h-full lg:flex-1 lg:rounded-[20px] ${borderClass} ${PRICING_CARD_SHADOW}`}
        >
          {cardBody}
        </div>
        <div className="absolute top-[-8.5px] left-1/2 z-10 flex -translate-x-1/2 items-center justify-center rounded-[40px] bg-[#8022fe] px-2 py-0.5 lg:top-[-10px]">
          <p className="font-['Inter',sans-serif] text-[10px] leading-[1.5] font-medium text-white lg:text-[12px]">
            {plan.badge}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={cardRef} className="w-full lg:w-[310px] lg:shrink-0">
      <div
        className={`flex h-[460px] flex-col justify-between overflow-hidden rounded-[16px] bg-white lg:h-[620px] lg:rounded-[20px] ${borderClass} ${PRICING_CARD_SHADOW}`}
      >
        {cardBody}
      </div>
    </div>
  );
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
    <section ref={secRef} id="pricing" className="w-full border-y border-[#f2f2f2] bg-[#fcfcfc]">
      <div className="mx-auto flex max-w-[1300px] flex-col gap-[30px] px-3 py-[30px] md:gap-10 md:px-6 md:py-[60px] lg:gap-[50px] lg:px-0 lg:py-[90px]">
        <div ref={headRef} className="flex flex-col items-center gap-3.5 text-center lg:gap-5">
          <div className="flex flex-col items-center gap-1 lg:flex-row lg:items-start lg:justify-center lg:gap-2.5">
            <h2 className="font-['Inter',sans-serif] text-[22px] leading-[1.3] font-bold text-[#181818] lg:text-[34px]">
              Your day, fully managed by AI —{' '}
              <span className="text-[#8022fe]">From $6.39/month</span>
              <span className="text-[#14f1d9]">.</span>
            </h2>
            {billing === 'yearly' && (
              <p className="font-['Inter',sans-serif] text-[12px] leading-[1.5] font-medium text-[#c2c2c2] lg:text-[16px]">
                (Billed yearly)
              </p>
            )}
          </div>
          <p className="font-['Inter',sans-serif] text-[14px] leading-[1.5] font-medium text-[#181818] lg:text-[16px]">
            Start free. Upgrade when you need real productivity. Cancel anytime.
          </p>
        </div>

        <div className="flex flex-col items-center gap-5 lg:gap-[50px]">
          <PricingToggle billing={billing} onChange={setBilling} />

          <div className="flex w-full flex-col items-center gap-5 lg:gap-[30px]">
            <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 lg:flex lg:justify-between lg:gap-5">
              {plans.map((plan, i) => (
                <PricingCard key={plan.id} plan={plan} cardRef={cardRefs[i]} billing={billing} />
              ))}
            </div>

            <div className="flex w-full items-start justify-between px-5 md:justify-center md:gap-10 md:px-0 lg:gap-10">
              {['No commitment', 'Cancel anytime', 'Secure payments'].map((t) => (
                <p
                  key={t}
                  className="font-['Inter',sans-serif] text-[10px] leading-[1.5] font-medium text-[#c2c2c2] lg:text-[12px]"
                >
                  {t}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Section 5: Missing Layer ─────────────────────────────────────────────────

const WorkflowIconWrap = ({ children }) => (
  <div className="flex size-[30px] shrink-0 items-center justify-center rounded-lg bg-[#f9f4ff] lg:size-[34px]">
    {children}
  </div>
);

const CalendarWorkflowIcon = () => <PiCalendarCheckDuotone className="h-6 w-6 text-purple-600" />;

const TaskWorkflowIcon = () => <PiCheckSquare className="h-6 w-6 text-purple-600" />;

const HabitWorkflowIcon = () => <HiArrowPathRoundedSquare className="h-6 w-6 text-purple-600" />;

const NotesWorkflowIcon = () => <PiFileDuotone className="h-6 w-6 text-purple-600" />;

const WorkflowSolutionIcon = () => (
  <img src="/images/how-it-works/Arrow.png" alt="Workflow Solution Icon"  />
);

const MISSING_ROWS = [
  {
    icon: CalendarWorkflowIcon,
    tool: 'Calendars',
    badge: 'Auto-Adapts',
    badgeText: 'text-[#1647a3]',
    badgeBorder: 'border-[rgba(22,71,163,0.2)]',
    problem: "They manage schedules, but can't adapt when plans change.",
    solution: 'Your schedule adapts automatically when life changes.',
    featured: true,
  },
  {
    icon: TaskWorkflowIcon,
    tool: 'Task Managers',
    badge: 'Reprioritizes',
    badgeText: 'text-[#16a34a]',
    badgeBorder: 'border-[rgba(22,163,74,0.2)]',
    problem: 'Tasks pile up. The list grows longer — not smarter.',
    solution: 'Tasks are reprioritized based on your actual capacity.',
  },
  {
    icon: HabitWorkflowIcon,
    tool: 'Habit Trackers',
    badge: 'Adapts to Reality',
    badgeText: 'text-[#7d16a3]',
    badgeBorder: 'border-[rgba(125,22,163,0.2)]',
    problem: "They track streaks, but don't understand content. One bad day breaks your progress.",
    solution: 'Distinguishes between failure and necessary adjustment.',
  },
  {
    icon: NotesWorkflowIcon,
    tool: 'Notes & Docs',
    badge: 'Focuses on Action',
    badgeText: 'text-[#a38e16]',
    badgeBorder: 'border-[rgba(163,142,22,0.2)]',
    problem: 'You spend more time building the system than doing the work.',
    solution: 'No setup. Built for action, not planning.',
  },
];

const WorkflowCard = ({ row, cardRef }) => {
  const Icon = row.icon;
  const cardBorder = row.featured ? 'border-[#e9e8e8]' : 'border-[#f2f2f2]';
  const cardShadow = row.featured ? 'shadow-[0px_15px_7.5px_rgba(0,0,0,0.02)]' : '';

  return (
    <article
      ref={cardRef}
      className={`flex w-full flex-col overflow-hidden rounded-[20px] border bg-[#fcfcfc] ${cardBorder} ${cardShadow}`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-[#f2f2f2] px-4 py-3.5 lg:justify-start lg:gap-3.5 lg:px-6 lg:py-5">
        <div className="flex min-w-0 items-center gap-2.5 lg:gap-3.5">
          <WorkflowIconWrap>
            <Icon />
          </WorkflowIconWrap>
          <h3 className="font-['Inter',sans-serif] text-lg leading-[1.3] font-semibold text-[#181818] lg:text-2xl">
            {row.tool}
          </h3>
        </div>
        <span
          className={`shrink-0 rounded-[40px] border bg-white px-2 py-0.5 font-['Inter',sans-serif] text-[10px] leading-normal font-medium lg:px-2.5 lg:py-1 lg:text-sm ${row.badgeText} ${row.badgeBorder}`}
        >
          {row.badge}
        </span>
      </div>

      <div className="flex flex-col gap-4 p-4 lg:gap-2.5 lg:p-6">
        {/* Mobile / tablet: stacked */}
        <div className="flex flex-col gap-1 lg:hidden">
          <p className="font-['Inter',sans-serif] text-sm leading-normal font-medium text-[#181818]">
            The problem
          </p>
          <p className="font-['Inter',sans-serif] text-sm leading-normal font-medium text-[#c2c2c2]">
            {row.problem}
          </p>
        </div>

        <div className="flex flex-col gap-2 lg:hidden">
          <p className="font-['Inter',sans-serif] text-sm leading-normal font-medium text-[#181818]">
            With Elyxa
          </p>
          <div className="flex items-start gap-2 rounded-xl border border-[#f2f2f2] bg-white px-2.5 py-1.5">
            <WorkflowSolutionIcon />
            <p className="font-['Inter',sans-serif] text-sm leading-normal font-medium text-[#8022fe]">
              {row.solution}
            </p>
          </div>
        </div>

        {/* Desktop: two-column */}
        <div className="hidden lg:flex lg:items-center lg:justify-between">
          <p className="font-['Inter',sans-serif] text-base leading-normal font-medium text-[#181818]">
            The problem
          </p>
          <p className="w-[580px] shrink-0 font-['Inter',sans-serif] text-base leading-normal font-medium text-[#181818]">
            With Elyxa
          </p>
        </div>

        <div className="hidden lg:flex lg:items-start lg:justify-between">
          <p className="max-w-[660px] flex-1 font-['Inter',sans-serif] text-xl leading-normal font-medium text-[#c2c2c2]">
            {row.problem}
          </p>
          <div className="flex w-[580px] shrink-0 items-start gap-2.5 rounded-xl border border-[#f2f2f2] bg-white px-3 py-2">
            <WorkflowSolutionIcon />
            <p className="font-['Inter',sans-serif] text-xl leading-normal font-medium text-[#8022fe]">
              {row.solution}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};

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
    <section ref={secRef} className="w-full bg-white">
      <div className="mx-auto flex max-w-[1300px] flex-col gap-6 px-5 py-[50px] md:gap-10 md:px-6 md:py-[60px] lg:gap-[50px] lg:px-0 lg:pt-[170px] lg:pb-[90px]">
        <div ref={headRef} className="flex flex-col items-center gap-3.5 text-center lg:gap-5">
          <h2 className="font-['Inter',sans-serif] text-[22px] leading-[1.3] font-bold text-[#181818] lg:text-[34px]">
            The missing layer in your <span className="text-[#8022fe]">Workflow</span>
            <span className="text-[#14f1d9]">.</span>
          </h2>
          <p className="max-w-[1300px] font-['Inter',sans-serif] text-sm leading-normal font-medium text-[#181818] lg:text-base">
            Your tools manage tasks — but they don&apos;t adapt when life changes.
          </p>
        </div>

        <div className="flex w-full flex-col gap-5 lg:gap-5">
          {MISSING_ROWS.map((row, i) => (
            <WorkflowCard key={row.tool} row={row} cardRef={rowRefs[i]} />
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

const FINAL_CTA_SHADOW =
  'shadow-[0px_171px_48px_0px_rgba(0,0,0,0),0px_109px_44px_0px_rgba(0,0,0,0),0px_61px_37px_0px_rgba(0,0,0,0.01),0px_27px_27px_0px_rgba(0,0,0,0.02),0px_7px_15px_0px_rgba(0,0,0,0.02)]';

const SparkleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className="shrink-0">
    <path
      d="M9 1.5L10.5 6H15L11.25 8.625L12.75 13.5L9 10.875L5.25 13.5L6.75 8.625L3 6H7.5L9 1.5Z"
      stroke="#5D5D5D"
      strokeWidth="1"
      strokeLinejoin="round"
    />
  </svg>
);

export const FinalCTASection = () => {
  const cardRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(textRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.55,
        ease: 'power2.out',
        scrollTrigger: { trigger: cardRef.current, start: 'top 88%', once: true },
      });
      gsap.from(cardRef.current, {
        opacity: 0,
        y: 24,
        duration: 0.6,
        ease: 'expo.out',
        scrollTrigger: { trigger: cardRef.current, start: 'top 88%', once: true },
      });
    }, cardRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={cardRef} className="relative z-20 w-full">
      <div
        className={`relative overflow-hidden rounded-[20px] bg-[#181818] px-5 pb-[190px] pt-5 lg:h-[319px] lg:rounded-[30px] lg:p-[50px] lg:pb-[50px] ${FINAL_CTA_SHADOW}`}
      >
        <div ref={textRef} className="relative z-10 flex w-full flex-col gap-5 lg:max-w-[640px] lg:gap-[50px]">
          <div className="flex flex-col gap-3.5 lg:gap-5">
            <h2 className="font-['Inter',sans-serif] text-[22px] font-bold leading-[1.3] text-white lg:text-[34px]">
              Your plans should adapt to <span className="text-[#8022fe]">You</span>
              <span className="text-[#14f1d9]">.</span>
            </h2>
            <p className="font-['Inter',sans-serif] text-sm font-medium leading-normal text-white lg:text-base">
              Elyxa adjusts your day as things change — so you always know what to do next.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <Link to="/signup" className="inline-flex w-full lg:w-auto">
              <button
                type="button"
                className="w-full rounded-[10px] bg-[#8022fe] px-5 py-3 font-['Inter',sans-serif] text-sm font-semibold text-white transition-colors hover:bg-[#6b1bdb] lg:w-auto lg:text-base"
              >
                Get Your First Plan
              </button>
            </Link>
            <div className="flex items-center gap-1">
              <SparkleIcon />
              <p className="font-['Inter',sans-serif] text-xs font-normal leading-none text-[#5d5d5d] lg:text-sm">
                Takes less than a minute
              </p>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-1/2 w-[320px] max-w-none -translate-x-1/2 overflow-hidden rounded-[15.6px] drop-shadow-[-8px_0px_14.39px_rgba(255,255,255,0.05)] lg:bottom-auto lg:left-auto lg:right-[-99px] lg:top-[50px] lg:w-[650px] lg:translate-x-0">
          <img
            src="/images/how-it-works/hiw-final-cta-dashboard.png"
            alt=""
            className="block h-auto w-full"
          />
        </div>
      </div>
    </div>
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
  </div>
);

export default HowItWorksSection;
