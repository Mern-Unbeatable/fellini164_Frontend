import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PiCalendarCheckDuotone, PiCheckSquare, PiFileDuotone } from 'react-icons/pi';
import { HiArrowPathRoundedSquare } from 'react-icons/hi2';

gsap.registerPlugin(ScrollTrigger);

const WorkflowIconWrap = ({ children }) => (
  <div className="flex size-7.5 shrink-0 items-center justify-center rounded-lg bg-[#f9f4ff] md:size-8.5">
    {children}
  </div>
);

const CalendarWorkflowIcon = () => <PiCalendarCheckDuotone className="h-6 w-6 text-purple-600" />;
const TaskWorkflowIcon = () => <PiCheckSquare className="h-6 w-6 text-purple-600" />;
const HabitWorkflowIcon = () => <HiArrowPathRoundedSquare className="h-6 w-6 text-purple-600" />;
const NotesWorkflowIcon = () => <PiFileDuotone className="h-6 w-6 text-purple-600" />;

const WorkflowSolutionIcon = () => (
  <img src="/images/how-it-works/Arrow.png" alt="Workflow Solution Icon" />
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
      <div className="flex items-center justify-between gap-3 border-b border-[#f2f2f2] px-5 py-3.5 md:justify-start md:gap-3.5 md:px-6 md:py-5">
        <div className="flex min-w-0 items-center gap-2.5 md:gap-3.5">
          <WorkflowIconWrap>
            <Icon />
          </WorkflowIconWrap>
          <h3 className="font-['Inter',sans-serif] text-lg leading-[1.3] font-semibold text-[#181818] md:text-2xl">
            {row.tool}
          </h3>
        </div>
        <span
          className={`shrink-0 rounded-[40px] border bg-white px-2 py-0.5 font-['Inter',sans-serif] text-[10px] leading-normal font-medium md:px-2.5 md:py-1 md:text-sm ${row.badgeText} ${row.badgeBorder}`}
        >
          {row.badge}
        </span>
      </div>

      <div className="flex flex-col gap-4 p-5 md:gap-2.5 md:p-6">
        <div className="flex flex-col gap-1 md:hidden">
          <p className="font-['Inter',sans-serif] text-sm leading-normal font-medium text-[#181818]">
            The problem
          </p>
          <p className="font-['Inter',sans-serif] text-sm leading-normal font-medium text-[#c2c2c2]">
            {row.problem}
          </p>
        </div>

        <div className="flex flex-col gap-2 md:hidden">
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

        <div className="hidden md:flex md:items-center md:justify-between">
          <p className="font-['Inter',sans-serif] text-base leading-normal font-medium text-[#181818]">
            The problem
          </p>
          <p className="w-145 shrink-0 font-['Inter',sans-serif] text-base leading-normal font-medium text-[#181818]">
            With Elyxa
          </p>
        </div>

        <div className="hidden md:flex md:items-start md:justify-between">
          <p className="max-w-165 flex-1 font-['Inter',sans-serif] text-xl leading-normal font-medium text-[#c2c2c2]">
            {row.problem}
          </p>
          <div className="flex w-145 shrink-0 items-start gap-2.5 rounded-xl border border-[#f2f2f2] bg-white px-3 py-2">
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
        opacity: 0, y: 20, duration: 0.5, ease: 'power2.out',
        scrollTrigger: { trigger: headRef.current, start: 'top 88%', once: true },
      });
      rowRefs.forEach((r, i) => {
        gsap.from(r.current, {
          opacity: 0, y: 16, duration: 0.5, ease: 'power2.out', delay: i * 0.09,
          scrollTrigger: { trigger: r.current, start: 'top 90%', once: true },
        });
      });
    }, secRef);
    return () => ctx.revert();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section ref={secRef} className="w-full bg-white">
      <div className="mx-auto flex max-w-385 flex-col gap-6 px-5 py-12.5 md:gap-12.5 md:px-20 md:pt-42.5 md:pb-22.5">
        <div ref={headRef} className="flex flex-col items-center gap-3.5 text-center md:gap-5">
          <h2 className="font-['Inter',sans-serif] text-[22px] leading-[1.3] font-bold text-[#181818] md:text-[34px]">
            The missing layer in your <span className="text-[#8022fe]">Workflow</span>
            <span className="text-[#14f1d9]">.</span>
          </h2>
          <p className="max-w-325 font-['Inter',sans-serif] text-sm leading-normal font-medium text-[#181818] md:text-base">
            Your tools manage tasks — but they don&apos;t adapt when life changes.
          </p>
        </div>

        <div className="flex w-full flex-col gap-5">
          {MISSING_ROWS.map((row, i) => (
            <WorkflowCard key={row.tool} row={row} cardRef={rowRefs[i]} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MissingLayerSection;
