import React from 'react';
import { AlertTriangle, Star, RefreshCw } from 'lucide-react';

const INSIGHTS = [
  {
    id: 'momentum',
    title: 'Momentum',
    body: 'Your day is ready. Complete the first task to build momentum.',
    icon: AlertTriangle,
    wrap: 'bg-[rgba(128,34,254,0.08)] text-[#8022fe] dark:bg-purple-950/30 dark:text-purple-300',
  },
  {
    id: 'focus',
    title: 'Focus peak',
    body: 'Your highest productivity is usually in the morning.',
    icon: Star,
    wrap: 'bg-[rgba(249,115,22,0.08)] text-[#f97316] dark:bg-orange-950/30 dark:text-orange-300',
  },
  {
    id: 'consistency',
    title: 'Consistency',
    body: 'Small daily habits compound. Check in on one habit to keep your streak alive.',
    icon: RefreshCw,
    wrap: 'bg-[rgba(16,185,129,0.08)] text-[#10b981] dark:bg-emerald-950/30 dark:text-emerald-300',
  },
];

const AiInsights = () => {
  return (
    <div className="rounded-2xl border border-[#f2f2f2] bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800 sm:p-5">
      <div className="mb-4">
        <h2 className="text-[15px] font-semibold text-[#181818] dark:text-white">AI insights</h2>
        <p className="mt-0.5 text-[12px] font-medium text-[#a3a3a3] dark:text-zinc-400">
          {INSIGHTS.length} signals for today
        </p>
      </div>

      <div className="space-y-4">
        {INSIGHTS.map((item) => (
          <div key={item.id} className="flex items-start gap-3">
            <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.wrap}`}>
              <item.icon size={15} />
            </span>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-[#181818] dark:text-white">{item.title}</p>
              <p className="mt-0.5 text-[12px] leading-relaxed text-[#8a8a8a] dark:text-zinc-400">
                {item.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AiInsights;
