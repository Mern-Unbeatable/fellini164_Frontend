import React from 'react';
import { Plus } from 'lucide-react';

function ProgressRing({ percent, size = 56, stroke = 4 }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, percent)) / 100) * circumference;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.28)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="white"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[13px] font-semibold text-white">
        {percent}%
      </span>
    </div>
  );
}

const WelcomeHeader = ({ greeting, dailyProgress, date }) => {
  const dateLabel = date
    ? new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      })
    : new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      });

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#8B5CF6] via-[#8B5CF6] to-[#A78BFA] px-5 py-6 text-white shadow-md sm:px-7 sm:py-7 dark:from-[#6C3ADC] dark:to-[#4E2C9D]">
      <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-xl" />
      <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-black/10 blur-2xl" />
      <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0 space-y-2.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[12px] font-medium backdrop-blur-sm">
            <Plus size={12} strokeWidth={2.5} />
            {dateLabel}
          </span>
          <h1 className="text-[28px] leading-tight font-semibold tracking-tight sm:text-[32px]">
            {greeting?.text || 'Welcome back!'}
          </h1>
          <p className="max-w-xl text-[13px] leading-relaxed text-white/85 sm:text-[14px]">
            {greeting?.subtitle || 'A great day starts with one completed item.'}
          </p>
        </div>

        <div className="flex items-center gap-3.5 rounded-xl bg-black/15 px-4 py-3 backdrop-blur-sm">
          <ProgressRing percent={dailyProgress?.percent || 0} />
          <div>
            <p className="text-[12px] font-medium text-white/80">Daily progress</p>
            <p className="text-[13px] font-semibold text-white">
              {dailyProgress?.label ||
                `${dailyProgress?.completed || 0} of ${dailyProgress?.total || 0} tasks completed`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;
