import React from 'react';
import { Sparkles, Clock, Target, BarChart2 } from 'lucide-react';
import { PLANNER_HOURS, dateKeyFromDate } from '../plannerData';

// Fixed px-per-hour spacing for the gridline background layer — matches Figma's row rhythm
// (confirmed via get_design_context: gap-[40px] + ~12px label line-height ≈ 52px/hour). Cards
// are positioned relative to this independently, so they can never push a gridline out of place.
const ROW_HEIGHT = 52;

const PRIORITY_STYLES = {
  URGENT: 'bg-[rgba(220,38,38,0.05)] text-[#dc2626]',
  HIGH: 'bg-[rgba(249,115,22,0.05)] text-[#f97316]',
  MEDIUM: 'bg-[rgba(202,138,4,0.05)] text-[#ca8a04]',
  LOW: 'bg-[rgba(107,114,128,0.05)] text-[#6b7280]',
};

function TaskCard({ item, ghost, dimmed, compact }) {
  const isOverload = item.status === 'Rescheduled';
  if (isOverload) {
    return (
      <div className="flex w-full items-center justify-between gap-2.5 rounded-lg border-2 border-dashed border-[#e2e2e2] bg-gray-50/30 p-3.5 opacity-60 dark:border-zinc-700 dark:bg-zinc-800/20">
        <div className="flex flex-col">
          <span className="text-xs font-medium text-slate-400 line-through dark:text-gray-500">
            {item.title}
          </span>
          <span className="mt-0.5 text-[9px] font-semibold text-[#7C3AED] dark:text-purple-400">
            Rescheduled to tomorrow morning by AI to reduce overload
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex w-full flex-col gap-1 rounded-lg p-3 shadow-sm transition-all dark:bg-zinc-800 ${
        ghost
          ? 'border-2 border-dashed border-[#e2e2e2] bg-white opacity-40 hover:border-solid hover:opacity-100 dark:border-zinc-700 dark:bg-zinc-800'
          : 'border border-gray-100 bg-white dark:border-zinc-700'
      } ${dimmed ? 'opacity-50' : ''} ${item.optimized ? 'border-purple-200 bg-purple-50/10' : ''}`}
    >
      <div
        className={`flex flex-col justify-start gap-2 ${compact ? '' : 'sm:flex-row sm:items-center'}`}
      >
        {compact && (
          <div className="flex flex-wrap items-center gap-1.5">
            {item.priority && (
              <span
                className={`rounded px-2 py-0.5 text-[8px] font-medium uppercase ${PRIORITY_STYLES[item.priority]}`}
              >
                {item.priority}
              </span>
            )}
            {item.status && (
              <span className="rounded border border-gray-100 bg-gray-50 px-2 py-0.5 text-[8px] font-medium text-gray-400 dark:border-none dark:bg-zinc-700 dark:text-gray-400">
                {item.status.toUpperCase()}
              </span>
            )}
            {item.source === 'ai' && (
              <span className="text-primary flex items-center gap-1 rounded bg-[#7C3AED]/10 px-2 py-0.5 text-[8px] font-medium dark:border-none dark:bg-[#F9F4FF] dark:text-purple-400">
                <Sparkles size={8} /> AI
              </span>
            )}
          </div>
        )}
        <span className="text-xs font-medium text-slate-700 dark:text-gray-300">
          {item.title}
        </span>
        {!compact && (
        <div className="flex flex-wrap items-center gap-1.5">
          {item.priority && (
            <span
              className={`rounded px-2 py-0.5 text-[8px] font-medium uppercase ${PRIORITY_STYLES[item.priority]}`}
            >
              {item.priority}
            </span>
          )}
          {item.source === 'ai' && (
            <span className="text-primary flex items-center gap-1 rounded bg-[#7C3AED]/10 px-2 py-0.5 text-[8px] font-medium dark:border-none dark:bg-[#F9F4FF] dark:text-purple-400">
              <Sparkles size={8} /> AI
            </span>
          )}
          {item.optimized && (
            <span className="rounded bg-green-50 px-2 py-0.5 text-[8px] font-semibold text-green-600 dark:bg-green-950/20 dark:text-green-400">
              Optimized
            </span>
          )}
          {item.balanced && (
            <span className="rounded bg-green-50 px-2 py-0.5 text-[8px] font-semibold text-green-600 dark:bg-green-950/20 dark:text-green-400">
              AI Balanced
            </span>
          )}
          {item.status && (
            <>
              <div className="mx-0.5 h-3 w-[1px] bg-gray-200 dark:bg-zinc-700" />
              <span className="rounded border border-gray-100 bg-gray-50 px-2 py-0.5 text-[8px] font-medium text-gray-400 dark:border-none dark:bg-zinc-700 dark:text-gray-400">
                {item.status.toUpperCase()}
              </span>
            </>
          )}
        </div>
        )}
      </div>
      {item.description && (
        <p className="mt-0.5 text-[10px] text-gray-400 dark:text-gray-500">{item.description}</p>
      )}
      {(item.category || item.goalLabel || item.durationLabel || item.stepsLabel) && (
        <div className="mt-1 flex flex-wrap items-center gap-2">
          {item.category && (
            <span className="rounded-lg border border-gray-200 px-2 py-0.5 text-[8px] font-semibold text-gray-400 dark:border-zinc-700">
              {item.category}
            </span>
          )}
          {item.goalLabel && (
            <span className="flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-0.5 text-[8px] font-semibold text-gray-400 dark:border-zinc-700">
              <Target size={8} /> {item.goalLabel}
            </span>
          )}
          {item.durationLabel && (
            <span className="flex items-center gap-1 text-[8px] font-semibold text-gray-400 dark:text-gray-500">
              <Clock size={8} /> {item.durationLabel}
            </span>
          )}
          {item.stepsLabel && (
            <span className="flex items-center gap-1 text-[8px] font-semibold text-gray-400 dark:text-gray-500">
              <BarChart2 size={8} /> {item.stepsLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function HabitCard({ item, ghost, dimmed }) {
  return (
    <div
      className={`flex items-center justify-between rounded-lg p-3.5 shadow-sm transition-all dark:bg-zinc-800 ${
        ghost
          ? 'border-2 border-dashed border-[#e2e2e2] bg-white opacity-40 hover:border-solid hover:opacity-100 dark:border-zinc-700 dark:bg-zinc-800'
          : 'border border-gray-100 bg-white dark:border-zinc-700'
      } ${dimmed ? 'opacity-50' : ''}`}
    >
      <div className="flex min-w-0 flex-col gap-1 pr-4">
        <span className="text-xs font-medium text-slate-700 dark:text-gray-300">{item.title}</span>
        {item.description && (
          <p className="truncate text-[10px] leading-relaxed text-gray-400 dark:text-gray-500">
            {item.description}
          </p>
        )}
      </div>
      <div className="flex min-w-[48px] shrink-0 flex-col items-center justify-center rounded-lg border border-gray-100 p-2 dark:border-zinc-700">
        <div className="mb-1 h-4 w-4 rounded border border-gray-300 dark:border-zinc-600" />
        <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500">
          {item.progress.done}/{item.progress.total}
        </span>
      </div>
    </div>
  );
}

function SuggestionCard({ item, onAccept, onDismiss }) {
  return (
    <div className="animate-fade-in flex w-full flex-col justify-between gap-3 rounded-lg border border-purple-200 bg-purple-50/20 p-3.5 shadow-sm md:flex-row md:items-center dark:border-purple-900/40 dark:bg-purple-950/10">
      <div className="flex min-w-0 flex-col gap-1 pr-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-purple-700 dark:text-purple-400">
            {item.title}
          </span>
          <span className="text-primary flex items-center gap-1 rounded bg-[#7C3AED]/10 px-2 py-0.5 text-[8px] font-medium dark:border-none dark:bg-[#F9F4FF] dark:text-purple-400">
            <Sparkles size={8} /> AI Suggested
          </span>
        </div>
        <p className="text-[10px] text-gray-400 dark:text-gray-500">{item.description}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          onClick={onAccept}
          className="rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-purple-700"
        >
          Accept
        </button>
        <button
          onClick={onDismiss}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-300"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

function ItemCard({ item, ghost, dimmed, onAccept, onDismiss }) {
  if (item.kind === 'suggestion') {
    return <SuggestionCard item={item} onAccept={onAccept} onDismiss={onDismiss} />;
  }
  if (item.kind === 'habit') {
    return <HabitCard item={item} ghost={ghost} dimmed={dimmed} />;
  }
  return <TaskCard item={item} ghost={ghost} dimmed={dimmed} compact={item.layout === 'half'} />;
}

export default function DailyView({
  currentDate,
  selectedDate,
  plans,
  hasAcceptedPlan,
  isLoading,
  onAccept,
  onDismiss,
}) {
  const dateToUse = selectedDate || currentDate || new Date(2026, 4, 13);
  const weekdayShort = dateToUse.toLocaleDateString('en-US', { weekday: 'short' });
  const dateNum = dateToUse.getDate();
  const dayItems = plans[dateKeyFromDate(dateToUse)] || [];

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
        <div className="flex flex-col items-start border-b border-gray-100 bg-white p-4 dark:border-zinc-800/80 dark:bg-zinc-900">
          <div className="h-3 w-10 animate-pulse rounded bg-gray-200 dark:bg-zinc-800" />
          <div className="mt-1.5 h-7 w-7 animate-pulse rounded-lg bg-gray-200 dark:bg-zinc-800" />
        </div>
        <div className="max-h-[580px] flex-1 space-y-4 overflow-y-auto p-4">
          {[1, 2, 3, 4, 5].map((val) => (
            <div key={val} className="flex animate-pulse items-center gap-4">
              <div className="bg-gray-150 dark:bg-zinc-850 h-4 w-10 rounded" />
              <div className="flex h-20 flex-1 flex-col justify-center gap-2 rounded-xl bg-gray-100 px-4 dark:bg-zinc-800">
                <div className="h-3.5 w-1/3 rounded bg-gray-200 dark:bg-zinc-700" />
                <div className="h-2 w-1/2 rounded bg-gray-200 dark:bg-zinc-700" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm max-lg:h-auto max-lg:flex-none dark:border-zinc-800/80 dark:bg-zinc-900">
      {/* Daily Date Header */}
      <div className="flex flex-col items-start gap-0.5 border-b border-gray-100 bg-white p-3 dark:border-zinc-800/80 dark:bg-zinc-900">
        <span className="text-[12px] font-medium text-gray-400 dark:text-gray-500">
          {weekdayShort}
        </span>
        <span className="flex items-center justify-center rounded-lg bg-purple-100/70 px-1.5 py-0.5 text-sm font-bold text-[#7C3AED] dark:bg-purple-950/40 dark:text-purple-400">
          {dateNum}
        </span>
      </div>

      {/* Daily Scrollable Grid — gridlines are a fixed-height, evenly-spaced background layer;
          cards are a separately absolutely-positioned overlay keyed to their hour's offset, so
          a tall card can never push a gridline out of alignment with its label (matches Figma's
          actual mechanism: absolute-positioned cards over a uniform label+line list). */}
      <div className="scrollbar-white relative flex-1 overflow-y-auto lg:min-h-0 max-lg:max-h-[min(70vh,560px)]">
        <div className="relative" style={{ height: PLANNER_HOURS.length * ROW_HEIGHT + 100 }}>
          <div className="pointer-events-none absolute top-4 bottom-0 left-16 border-l border-gray-100 dark:border-zinc-800/80" />

          {PLANNER_HOURS.map((hour, i) => (
            <div
              key={hour}
              className="absolute inset-x-0 flex items-center"
              style={{ top: i * ROW_HEIGHT }}
            >
              <div className="relative z-10 flex h-4 w-16 shrink-0 items-center justify-end bg-white pr-3 text-[10px] font-semibold text-gray-400 dark:bg-zinc-900 dark:text-gray-500">
                {hour}
              </div>
              <div className="relative h-0 flex-1">
                {hour === '4 AM' ? (
                  <>
                    <div className="absolute top-1/2 left-0 z-20 -mt-1 h-2 w-2 -translate-x-1/2 rounded-full border border-white bg-purple-600 shadow-sm dark:border-zinc-900" />
                    <div className="absolute inset-x-0 top-1/2 z-20 h-[2px] -translate-y-1/2 bg-purple-500/85" />
                  </>
                ) : (
                  i > 0 && (
                    <div className="absolute inset-x-0 top-0 border-t border-dashed border-gray-200 dark:border-zinc-700" />
                  )
                )}
              </div>
            </div>
          ))}

          {PLANNER_HOURS.map((hour, i) => {
            const hourItems = dayItems.filter((item) => item.time === hour);
            if (hourItems.length === 0) return null;
            const isHalfLayout = hourItems.length > 1 && hourItems.every((it) => it.layout === 'half');

            return (
              <div
                key={hour}
                className="absolute right-3 left-16 z-10 pl-3"
                style={{ top: i * ROW_HEIGHT + 10 }}
              >
                {isHalfLayout ? (
                  <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                    {hourItems.map((item) => (
                      <ItemCard
                        key={item.id}
                        item={item}
                        ghost={!hasAcceptedPlan}
                        onAccept={onAccept}
                        onDismiss={onDismiss}
                      />
                    ))}
                  </div>
                ) : (
                  hourItems.map((item) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      ghost={!hasAcceptedPlan}
                      onAccept={onAccept}
                      onDismiss={onDismiss}
                    />
                  ))
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
