import React from 'react';
import { Sparkles, Clock, Target, BarChart2 } from 'lucide-react';
import { PLANNER_HOURS, dateKeyFromDate } from '../plannerData';

// Figma node 1260:23097 — flex-col gap-[40px] rows, 10px labels (leading 1.5 ≈ 15px tall).
const ROW_GAP = 40;
const ROW_LABEL_HEIGHT = 15;
const ROW_STEP = ROW_GAP + ROW_LABEL_HEIGHT;
const TIME_COL_WIDTH = 35;
const TIME_COL_GAP = 10;
const GRID_LINE_LEFT = TIME_COL_WIDTH + TIME_COL_GAP; // 45px
const CARD_LEFT = GRID_LINE_LEFT + 11; // 56px
const CARD_TOP_OFFSET = 6;
const HOUR_LINE_OVERHANG = 4; // solid hour line extends past vertical for "+" join

function getHourLineTop(index) {
  return index * ROW_STEP + ROW_LABEL_HEIGHT / 2;
}

function HourRow({ hour }) {
  return (
    <div className="relative flex w-full items-center gap-[10px]">
      <span
        className="shrink-0 text-right text-[10px] leading-[1.5] font-medium whitespace-nowrap text-[#c2c2c2] dark:text-gray-500"
        style={{ width: TIME_COL_WIDTH }}
      >
        {hour}
      </span>
      <div className="relative h-0 min-w-0 flex-1">
        <div
          className="absolute top-1/2 h-px -translate-y-1/2 bg-[#f2f2f2] dark:bg-zinc-800/80"
          style={{ left: -HOUR_LINE_OVERHANG, right: 0 }}
        />
      </div>
    </div>
  );
}

function TagDivider() {
  return <div className="mx-0 h-1.5 w-px shrink-0 bg-[#f2f2f2]" />;
}

/** Figma empty-state ghost cards — visible dashed border (14px dash / 8px gap). */
function GhostFieldBorder({ rx = 3, ry = 30 }) {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 h-full w-full transition-opacity group-hover:opacity-0"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="0.5"
        y="0.5"
        width="99"
        height="99"
        rx={rx}
        ry={ry}
        fill="none"
        stroke="#c9c9c9"
        strokeWidth="1.2"
        vectorEffect="non-scaling-stroke"
        strokeDasharray="14 8"
      />
    </svg>
  );
}

function GhostFieldShell({ children, className = '', radius = 8, borderRx = 3, borderRy = 30 }) {
  return (
    <div
      className={`group relative bg-white transition-all duration-200 hover:bg-[#fcfcfc] hover:shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)] dark:bg-zinc-800 ${className}`}
      style={{ borderRadius: radius }}
    >
      <GhostFieldBorder rx={borderRx} ry={borderRy} />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity group-hover:opacity-100"
        style={{ boxShadow: 'inset 0 0 0 1px #f2f2f2', borderRadius: radius }}
      />
      {children}
    </div>
  );
}

function GhostResizeHandle({ vertical = false }) {
  return (
    <div
      className={`relative z-[1] ml-2 flex shrink-0 opacity-40 transition-opacity group-hover:opacity-100 ${
        vertical ? 'flex-col gap-0.5' : 'flex-row gap-0.5'
      }`}
    >
      <div className="h-0.5 w-0.5 rounded-full bg-[#c2c2c2]" />
      <div className="h-0.5 w-0.5 rounded-full bg-[#c2c2c2]" />
      <div className="h-0.5 w-0.5 rounded-full bg-[#c2c2c2]" />
    </div>
  );
}

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

  const ghostCompact = ghost && !item.description && !item.category && !item.durationLabel;
  const ghostMedium = ghost && item.description && !item.durationLabel;

  const ghostTags = (
    <div className="flex shrink-0 items-center gap-2.5">
      <div className="flex items-center gap-1">
        {item.priority && (
          <span
            className={`rounded px-1 py-0.5 text-[8px] font-medium uppercase ${PRIORITY_STYLES[item.priority]}`}
          >
            {item.priority}
          </span>
        )}
        {item.source === 'ai' && (
          <span className="flex items-center gap-[3px] rounded bg-[#f9f4ff] px-1 py-0.5 text-[8px] font-medium text-[#8022fe]">
            <Sparkles size={7} /> AI
          </span>
        )}
      </div>
      {item.status && (
        <>
          <TagDivider />
          <span className="rounded bg-[#f2f2f2] px-1 py-0.5 text-[8px] font-medium text-[#a3a3a3] uppercase">
            {item.status}
          </span>
        </>
      )}
    </div>
  );

  if (ghostCompact) {
    return (
      <GhostFieldShell
        radius={8}
        borderRx={2}
        borderRy={32}
        className={`flex min-h-[28px] w-full items-center justify-between rounded-lg pl-[11px] pr-2.5 py-1 ${
          dimmed ? 'opacity-50' : ''
        }`}
      >
        <div className="relative z-[1] flex min-w-0 flex-1 items-center gap-2.5 opacity-40 transition-opacity group-hover:opacity-100">
          <span className="shrink-0 text-[10px] font-medium text-[#181818] dark:text-gray-300">
            {item.title}
          </span>
          {ghostTags}
        </div>
        <GhostResizeHandle />
      </GhostFieldShell>
    );
  }

  if (ghostMedium) {
    return (
      <GhostFieldShell
        radius={12}
        borderRx={2.5}
        borderRy={8}
        className={`flex w-full items-start justify-between rounded-xl p-2.5 ${
          dimmed ? 'opacity-50' : ''
        }`}
      >
        <div className="relative z-[1] min-w-0 flex-1 opacity-50 transition-opacity group-hover:opacity-100">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-medium text-[#181818] dark:text-gray-300">{item.title}</span>
            {ghostTags}
          </div>
          <p className="mt-1 text-[10px] text-[#a3a3a3] dark:text-gray-500">{item.description}</p>
        </div>
        <GhostResizeHandle vertical />
      </GhostFieldShell>
    );
  }

  if (ghost && (item.category || item.durationLabel || item.stepsLabel)) {
    return (
      <GhostFieldShell
        radius={12}
        borderRx={2.5}
        borderRy={8}
        className={`flex w-full items-start justify-between rounded-xl p-2.5 ${
          dimmed ? 'opacity-50' : ''
        }`}
      >
        <div className="relative z-[1] min-w-0 flex-1 opacity-40 transition-opacity group-hover:opacity-100">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-medium text-[#181818] dark:text-gray-300">{item.title}</span>
            {ghostTags}
          </div>
          {item.description && (
            <p className="mt-1 line-clamp-2 text-[10px] text-[#a3a3a3] dark:text-gray-500">
              {item.description}
            </p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-1">
            {item.category && (
              <span className="rounded-md border border-[#f2f2f2] px-1.5 py-0.5 text-[10px] font-medium text-[#5d5d5d]">
                {item.category}
              </span>
            )}
            {item.goalLabel && (
              <span className="flex items-center gap-1 rounded-md border border-[#f2f2f2] px-1.5 py-0.5 text-[10px] font-medium text-[#5d5d5d]">
                <Target size={10} /> {item.goalLabel}
              </span>
            )}
            {item.durationLabel && (
              <span className="flex items-center gap-1 rounded-md border border-[#f2f2f2] px-1.5 py-0.5 text-[10px] font-medium text-[#5d5d5d]">
                <Clock size={10} /> {item.durationLabel}
              </span>
            )}
            {item.stepsLabel && (
              <span className="flex items-center gap-1 text-[10px] font-medium text-[#5d5d5d]">
                <BarChart2 size={10} /> {item.stepsLabel}
              </span>
            )}
          </div>
        </div>
        <GhostResizeHandle vertical />
      </GhostFieldShell>
    );
  }

  return (
    <div
      className={`flex w-full flex-col gap-1 rounded-lg p-3 shadow-sm transition-all duration-200 dark:bg-zinc-800 ${
        ghost
          ? 'border border-dashed border-[#f2f2f2] bg-white opacity-40 hover:border-solid hover:border-[#f2f2f2] hover:bg-[#fcfcfc] hover:opacity-100 hover:shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)] dark:border-zinc-700 dark:bg-zinc-800'
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
      className={`flex items-center justify-between rounded-lg p-3.5 shadow-sm transition-all duration-200 dark:bg-zinc-800 ${
        ghost
          ? 'border border-dashed border-[#f2f2f2] bg-white opacity-40 hover:border-solid hover:border-[#f2f2f2] hover:bg-[#fcfcfc] hover:opacity-100 hover:shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)] dark:border-zinc-700 dark:bg-zinc-800'
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
        <div className="scrollbar-white max-h-[580px] flex-1 space-y-4 overflow-y-auto p-4">
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
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[#f2f2f2] bg-white shadow-sm max-lg:h-auto max-lg:flex-none dark:border-zinc-800/80 dark:bg-zinc-900">
      <div className="scrollbar-white relative flex-1 overflow-y-auto p-3 lg:min-h-0 max-lg:max-h-[min(70vh,560px)]">
        {/* Date header — centered over time column, Figma 1260:23099 */}
        <div
          className="mb-3 flex flex-col items-center gap-0.5"
          style={{ width: GRID_LINE_LEFT }}
        >
          <span className="text-[12px] font-medium text-[#c2c2c2] dark:text-gray-500">
            {weekdayShort}
          </span>
          <span className="flex items-center justify-center rounded-[8px] bg-[#f9f4ff] px-1.5 py-0.5 text-[16px] font-medium text-[#8022fe] dark:bg-purple-950/40 dark:text-purple-400">
            {dateNum}
          </span>
        </div>

        <div
          className="relative"
          style={{ minHeight: (PLANNER_HOURS.length - 1) * ROW_STEP + ROW_LABEL_HEIGHT + 160 }}
        >
          {/* Vertical separator — Figma 1260:23199 at left 45px */}
          <div
            className="pointer-events-none absolute top-0 bottom-0 w-px bg-[#f2f2f2] dark:bg-zinc-800/80"
            style={{ left: GRID_LINE_LEFT }}
          />

          {/* Hour rows only — Figma 1260:23132; no extra slot grid lines */}
          <div className="relative z-0 flex flex-col gap-[40px]">
            {PLANNER_HOURS.map((hour) => (
              <HourRow key={hour} hour={hour} />
            ))}
          </div>

          {/* Current time — Figma 1260:23291 */}
          <div
            className="pointer-events-none absolute right-0 z-[5] flex -translate-y-1/2 items-center"
            style={{ left: GRID_LINE_LEFT - 1, top: getHourLineTop(3) + 15 }}
          >
            <div className="h-2 w-2 shrink-0 -translate-x-1/2 rounded-full border border-white bg-[#8022fe] shadow-sm dark:border-zinc-900" />
            <div className="h-[2px] flex-1 bg-[#8022fe]" />
          </div>

          {/* Ghost / task cards — Figma 1264:24782+ absolute positioned */}
          {PLANNER_HOURS.map((hour, i) => {
            const hourItems = dayItems.filter((item) => item.time === hour);
            if (hourItems.length === 0) return null;
            const isHalfLayout =
              hourItems.length > 1 && hourItems.every((it) => it.layout === 'half');

            return (
              <div
                key={`cards-${hour}`}
                className="absolute right-0 z-10"
                style={{ left: GRID_LINE_LEFT, top: i * ROW_STEP + CARD_TOP_OFFSET }}
              >
                {isHalfLayout ? (
                  <div className="flex w-full gap-2">
                    {hourItems.map((item) => (
                      <div key={item.id} className="min-w-0 flex-1">
                        <ItemCard
                          item={item}
                          ghost={!hasAcceptedPlan}
                          onAccept={onAccept}
                          onDismiss={onDismiss}
                        />
                      </div>
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
