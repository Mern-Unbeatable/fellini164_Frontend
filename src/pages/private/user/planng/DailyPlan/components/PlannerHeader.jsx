import React from 'react';
import TypewriterText from '../../../../../../components/ui/TypewriterText';

const PLANNER_SUBTITLE_PHRASES = [
  'Organize your schedule, tasks, and habits with AI...',
  'Let AI generate a customized daily plan for you...',
  'Stay on track and build consistent habits...',
];

function Stat({ label, value }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5 rounded-lg border border-[#F2F2F2] bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900">
      <span className="text-[11px] font-medium text-[#A3A3A3] dark:text-zinc-500">{label}</span>
      <span className="text-sm font-semibold text-[#181818] dark:text-white">{value}</span>
    </div>
  );
}

/** Stats from GET /planner/summary */
export default function PlannerHeader({ summary }) {
  const s = summary || {};
  return (
    <div className="mb-6 flex flex-col items-start gap-3">
      <div className="flex flex-col items-start gap-2">
        <h1 className="text-[20px] font-medium text-[#181818] dark:text-white">Planner Board</h1>
        <TypewriterText
          phrases={PLANNER_SUBTITLE_PHRASES}
          className="text-[12px] font-medium text-[#c2c2c2] dark:text-gray-400"
        />
      </div>
      <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label="Scheduled" value={s.scheduledToday ?? 0} />
        <Stat label="Completed" value={s.completedToday ?? 0} />
        <Stat label="Remaining" value={s.remainingToday ?? 0} />
        <Stat label="AI scheduled" value={s.aiScheduledToday ?? 0} />
        <Stat label="Unscheduled" value={s.unscheduledTasks ?? 0} />
        <Stat label="Active habits" value={s.activeHabits ?? 0} />
      </div>
    </div>
  );
}
