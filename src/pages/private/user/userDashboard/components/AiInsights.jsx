import React from 'react';
import { AlertTriangle, Star, RefreshCw } from 'lucide-react';

const INSIGHT_STYLES = {
  MOMENTUM: {
    icon: AlertTriangle,
    wrap: 'bg-[rgba(128,34,254,0.08)] text-[#8022fe] dark:bg-purple-950/30 dark:text-purple-300',
  },
  FOCUS_PEAK: {
    icon: Star,
    wrap: 'bg-[rgba(249,115,22,0.08)] text-[#f97316] dark:bg-orange-950/30 dark:text-orange-300',
  },
  CONSISTENCY: {
    icon: RefreshCw,
    wrap: 'bg-[rgba(16,185,129,0.08)] text-[#10b981] dark:bg-emerald-950/30 dark:text-emerald-300',
  },
};

const DEFAULT_STYLE = {
  icon: Star,
  wrap: 'bg-[rgba(128,34,254,0.08)] text-[#8022fe] dark:bg-purple-950/30 dark:text-purple-300',
};

const AiInsights = ({ insights = [] }) => {
  return (
    <div className="rounded-2xl border border-[#f2f2f2] bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800 sm:p-5">
      <div className="mb-4">
        <h2 className="text-[15px] font-semibold text-[#181818] dark:text-white">AI insights</h2>
        <p className="mt-0.5 text-[12px] font-medium text-[#a3a3a3] dark:text-zinc-400">
          {insights.length} signals for today
        </p>
      </div>

      {insights.length === 0 ? (
        <p className="text-[13px] font-medium text-[#a3a3a3] dark:text-zinc-400">
          No insights available yet.
        </p>
      ) : (
        <div className="space-y-4">
          {insights.map((item) => {
            const style = INSIGHT_STYLES[item.type] || DEFAULT_STYLE;
            const Icon = style.icon;
            return (
              <div key={item.id} className="flex items-start gap-3">
                <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${style.wrap}`}>
                  <Icon size={15} />
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-[#181818] dark:text-white">{item.title}</p>
                  <p className="mt-0.5 text-[12px] leading-relaxed text-[#8a8a8a] dark:text-zinc-400">
                    {item.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AiInsights;
