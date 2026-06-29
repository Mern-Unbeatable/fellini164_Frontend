import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { GoMegaphone } from 'react-icons/go';
import { PiWarning, PiTimer } from 'react-icons/pi';
import { HiOutlineSparkles } from 'react-icons/hi2';

gsap.registerPlugin(ScrollTrigger);

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
    className={`flex flex-col gap-3.5 rounded-[18px] border border-[#f2f2f2] bg-white p-3.5 shadow-[0px_10.97px_21.939px_rgba(0,0,0,0.05)] ${className}`}
  >
    <p className="font-['Inter',sans-serif] text-[11px] font-semibold text-[#181818] md:text-[12px]">
      Tasks List
    </p>
    <div className="flex max-h-55 flex-col gap-2.5 overflow-hidden md:max-h-73">
      {BREAKING_TASKS.map((task) => {
        const tag = TASK_TAG_STYLES[task.tagStyle];
        return (
          <div
            key={task.name}
            className="flex items-center gap-2.5 rounded-lg border border-[#f2f2f2] bg-[#fcfcfc] p-2.5"
          >
            <TaskCheckboxIcon done={task.done} />
            <div className="min-w-0 flex-1">
              <p
                className={`font-['Inter',sans-serif] text-[10px] font-medium text-[#181818] ${task.done ? 'line-through' : ''}`}
              >
                {task.name}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-1">
                <span
                  className={`rounded px-1 py-0.5 font-['Inter',sans-serif] text-[7px] font-medium text-[#181818] ${task.timeBg}`}
                >
                  {task.time}
                </span>
                <span
                  className={`rounded-full border bg-white px-1 py-0.5 font-['Inter',sans-serif] text-[7px] font-medium ${tag.text} ${tag.border}`}
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
    <section ref={secRef} className="w-full bg-white py-12.5 md:py-10">
      <div className="mx-auto max-w-385 px-5 md:px-20">
        <div ref={headRef} className="mb-6">
          <h2 className="font-['Inter',sans-serif] text-[28px] leading-tight font-bold text-[#181818] sm:text-[36px] md:text-[42px]">
            Have you ever wondered why your
            <br />
            plans keep <span className="text-[#8022fe]">Breaking</span>
            <span className="text-[#14f1d9]">.</span>
          </h2>
          <p className="mt-4 max-w-140 font-['Inter',sans-serif] text-[15px] font-medium text-[#888]">
            It's not your motivation — it's that your tools treat your life like a fixed schedule.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div
            ref={c0}
            className="rounded-2xl border border-[#f0f0f0] bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.04)]"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5f0ff]">
                <GoMegaphone size={18} className="text-purple-600" />
              </div>
              <h3 className="font-['Inter',sans-serif] text-[18px] leading-[1.3] font-semibold text-[#181818] md:text-[24px]">
                The Gap
              </h3>
            </div>
            <p className="font-['Inter',sans-serif] text-[14px] leading-normal font-medium text-[#181818] md:text-[16px]">
              Most planning tools work — until something changes. Then everything falls <br />{' '}
              apart.
            </p>
          </div>

          <div
            ref={c1}
            className="rounded-2xl border border-[#f0f0f0] bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.04)]"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5f0ff]">
                <PiWarning size={18} className="text-purple-600" />
              </div>
              <h3 className="font-['Inter',sans-serif] text-[18px] leading-[1.3] font-semibold text-[#181818] md:text-[24px]">
                The Consequence
              </h3>
            </div>
            <p className="font-['Inter',sans-serif] text-[14px] leading-normal font-medium text-[#181818] md:text-[16px]">
              One delay, one unexpected event — and your day turns into a list of overdue <br />{' '}
              tasks.
            </p>
          </div>

          <div
            ref={c2}
            className="relative min-h-54.25 overflow-hidden rounded-2xl border border-[#f2f2f2] bg-[#fcfcfc] p-5 md:min-h-40.75 md:rounded-[20px] md:p-6"
          >
            <BreakingTasksList className="absolute top-24.25 -right-12.75 z-10 w-50 md:top-5.75 md:-right-11.25 md:w-56" />
            <div className="relative z-0 flex max-w-[calc(100%-80px)] flex-col gap-2.5 md:max-w-100">
              <div className="flex items-center gap-2.5 md:gap-3.5">
                <div className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-lg bg-[#f9f4ff] md:h-8.5 md:w-8.5">
                  <HiOutlineSparkles size={16} className="text-[#8022fe] md:hidden" />
                  <HiOutlineSparkles size={18} className="hidden text-[#8022fe] md:block" />
                </div>
                <h3 className="font-['Inter',sans-serif] text-[18px] leading-[1.3] font-semibold text-[#181818] md:text-[24px]">
                  Start planning differently
                </h3>
              </div>
              <p className="font-['Inter',sans-serif] text-[14px] leading-normal font-medium text-[#181818] md:text-[16px]">
                See how your schedule adapts when life changes.
              </p>
            </div>
            <Link to="/signup">
              <button className="relative z-0 mt-17.5 rounded-lg bg-[#8022fe] px-4 py-2 font-['Inter',sans-serif] text-[14px] font-semibold text-white transition-colors hover:bg-[#6b1bdb] md:mt-3.5">
                Try It Yourself
              </button>
            </Link>
          </div>

          <div
            ref={c3}
            className="rounded-2xl border border-[#e9e8e8] bg-[#fcfcfc] p-5 shadow-[0px_15px_7.5px_rgba(0,0,0,0.02)] md:rounded-[20px] md:p-6"
          >
            <div className="mb-2.5 flex items-center gap-2.5 md:gap-3.5">
              <div className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-lg bg-[#f9f4ff] md:h-8.5 md:w-8.5">
                <PiTimer size={16} className="text-[#8022fe] md:hidden" />
                <PiTimer size={18} className="hidden text-[#8022fe] md:block" />
              </div>
              <h3 className="font-['Inter',sans-serif] text-[18px] leading-[1.3] font-semibold text-[#181818] md:text-[24px]">
                The Result
              </h3>
            </div>
            <p className="font-['Inter',sans-serif] text-[14px] leading-normal font-medium text-[#181818] md:text-[16px]">
              You don't feel organized — you feel behind. And most days end in either catching up or
              giving up.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BreakingSection;
