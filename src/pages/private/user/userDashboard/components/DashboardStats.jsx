import React from 'react';
import { CheckSquare, Clock, Target, Flag } from 'lucide-react';

const DashboardStats = ({ stats }) => {
  const cards = [
    {
      id: 'tasks',
      title: 'Tasks today',
      value: stats.tasksValue,
      subtitle: stats.tasksSubtitle,
      icon: CheckSquare,
      iconWrap: 'bg-[rgba(128,34,254,0.08)] text-[#8022fe] dark:bg-purple-950/30 dark:text-purple-300',
    },
    {
      id: 'focus',
      title: 'Focus time',
      value: stats.focusValue,
      subtitle: stats.focusSubtitle,
      icon: Clock,
      iconWrap: 'bg-[rgba(59,130,246,0.08)] text-[#3b82f6] dark:bg-blue-950/30 dark:text-blue-300',
    },
    {
      id: 'habits',
      title: 'Habit score',
      value: stats.habitValue,
      subtitle: stats.habitSubtitle,
      icon: Target,
      iconWrap: 'bg-[rgba(249,115,22,0.08)] text-[#f97316] dark:bg-orange-950/30 dark:text-orange-300',
    },
    {
      id: 'goals',
      title: 'Goal progress',
      value: stats.goalValue,
      subtitle: stats.goalSubtitle,
      icon: Flag,
      iconWrap: 'bg-[rgba(16,185,129,0.08)] text-[#10b981] dark:bg-emerald-950/30 dark:text-emerald-300',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.id}
          className="rounded-2xl border border-[#f2f2f2] bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-[11px] font-medium tracking-wide text-[#a3a3a3] uppercase">
              {card.title}
            </p>
            <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.iconWrap}`}>
              <card.icon size={16} />
            </span>
          </div>
          <p className="mt-3 text-[22px] font-semibold text-[#181818] dark:text-white">{card.value}</p>
          <p className="mt-1 text-[12px] font-medium text-[#c2c2c2] dark:text-gray-400">{card.subtitle}</p>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
