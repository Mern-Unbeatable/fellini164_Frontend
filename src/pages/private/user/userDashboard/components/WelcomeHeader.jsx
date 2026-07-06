import React from 'react';
import { Sparkles } from 'lucide-react';

const WelcomeHeader = ({ user, tasksCount, completedTasksCount, progressPercent }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#8B5CF6] via-[#8B5CF6] to-[#A78BFA] px-6 py-10 text-white shadow-md md:px-10 md:py-12 dark:from-[#6C3ADC] dark:to-[#4E2C9D]">
      {/* Subtle Decorative Circles */}
      <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-xl"></div>
      <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-black/10 blur-2xl"></div>

      <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">
            <Sparkles size={12} /> Today's Focus
          </span>
          <h1 className="md:text-3.5xl text-2xl font-bold">
            {getGreeting()},{' '}
            {(user?.fullName || user?.firstName || user?.name || 'Achiever').split(' ')[0]}!
          </h1>
          <p className="max-w-xl text-sm text-purple-100/90">
            You have {tasksCount} core tasks planned for today. Let's aim to unlock your best
            productivity state.
          </p>
        </div>

        {/* Quick Progress Badge */}
        <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/15">
            <span className="text-sm font-bold">{progressPercent}%</span>
          </div>
          <div>
            <div className="text-xs font-medium text-purple-200">Daily progress</div>
            <div className="text-sm font-bold text-white">
              {completedTasksCount} of {tasksCount} Completed
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;
