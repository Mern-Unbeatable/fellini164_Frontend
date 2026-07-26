import React from 'react';
import TypewriterText from '../../../../../../components/ui/TypewriterText';

const PLANNER_SUBTITLE_PHRASES = [
  'Organize your schedule, tasks, and habits with AI...',
  'Let AI generate a customized daily plan for you...',
  'Stay on track and build consistent habits...',
];

export default function PlannerHeader() {
  return (
    <div className="mb-6 flex flex-col items-start gap-2">
      <h1 className="text-[20px] font-medium text-[#181818] dark:text-white">Planner Board</h1>
      <TypewriterText
        phrases={PLANNER_SUBTITLE_PHRASES}
        className="text-[12px] font-medium text-[#c2c2c2] dark:text-gray-400"
      />
    </div>
  );
}
