import React from 'react';
import { Sparkles, Clock, Target, BarChart2 } from 'lucide-react';
import { PLANNER_HOURS, dateKeyFromDate } from '../plannerData';

// Timeline rhythm — scaled up from Figma for readability (Tasks/Habits/Goals parity).
const ROW_GAP = 48;
const ROW_LABEL_HEIGHT = 18;
const ROW_STEP = ROW_GAP + ROW_LABEL_HEIGHT;
const TIME_COL_WIDTH = 40;
const TIME_COL_GAP = 10;
const GRID_LINE_LEFT = TIME_COL_WIDTH + TIME_COL_GAP; // 50px
const CARD_LEFT = GRID_LINE_LEFT + 11; // 61px
const CARD_INSET_FROM_GRID = CARD_LEFT - GRID_LINE_LEFT; // 11px
const CARD_TOP_OFFSET = 8;
const HOUR_LINE_OVERHANG = 4;
const GRID_BOTTOM_PAD = 24;

// Positions scaled ~1.2× from Figma grid-relative tops (66/55 step ratio).
const CARD_TOP_FROM_GRID = {
  '1 AM': 7,
  '2 AM': 89,
  '11 AM': 638,
};

// 7 AM two-up — Figma 1264:24904: card aligns with 7 AM row, centered between 7 & 8 AM lines.
const SEVEN_AM_HOUR_INDEX = 6;
const SEVEN_AM_TASK_HEIGHT = 112;
const SEVEN_AM_HABIT_HEIGHT = 54;

function getSevenAmCardTop() {
  // Figma image 1 — card top aligns with the 7 AM label row; slight nudge up for dotted fields.
  return SEVEN_AM_HOUR_INDEX * ROW_STEP - 14;
}
// card begins 26px above the hour rule; purple rule sits a little below the hour line.
const FOUR_AM_HOUR_INDEX = 3;
const FOUR_AM_CARD_ABOVE_HOUR_LINE = 26;
const FOUR_AM_PURPLE_BELOW_HOUR_LINE = 18;

function getFourAmCurrentTimeTop() {
  return getHourLineTop(FOUR_AM_HOUR_INDEX) + FOUR_AM_PURPLE_BELOW_HOUR_LINE;
}

function getFourAmPurpleLineTopInCard() {
  return getFourAmCurrentTimeTop() - getCardTop('4 AM', FOUR_AM_HOUR_INDEX);
}

function FourAmCurrentTimeDot() {
  return (
    <div
      className="pointer-events-none absolute z-[15] h-0 w-0"
      style={{ left: GRID_LINE_LEFT, top: getFourAmCurrentTimeTop() }}
    >
      <div className="h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white bg-[#8022fe] shadow-sm dark:border-zinc-900" />
    </div>
  );
}

function FourAmCurrentTimeLineInCard() {
  return (
    <div
      className="pointer-events-none absolute z-20 overflow-hidden rounded-xl"
      style={{ top: 0, bottom: 0, left: -CARD_INSET_FROM_GRID, right: 0 }}
    >
      <div
        className="absolute -translate-y-1/2"
        style={{
          top: getFourAmPurpleLineTopInCard(),
          left: 0,
          right: 1,
        }}
      >
        <div className="absolute inset-x-0 top-1/2 h-[1.5px] -translate-y-1/2 bg-[#8022fe]" />
      </div>
    </div>
  );
}

// Typography aligned with Tasks / Habits / Goals boards.
const TYPO = {
  hour: 'text-xs font-medium leading-normal text-[#c2c2c2] sm:text-[12px] lg:text-[12px] dark:text-gray-500',
  compactTitle:
    'text-xs font-medium leading-normal text-[#181818] sm:text-[12px] dark:text-gray-300',
  cardTitle:
    'text-sm font-medium leading-normal text-[#181818] sm:text-[12px] lg:text-base dark:text-gray-300',
  cardDesc: 'text-xs font-medium leading-normal text-[#a3a3a3] sm:text-[12px] dark:text-gray-500',
  badge: 'text-[12px] font-medium uppercase leading-normal',
  chip: 'text-[12px] font-medium leading-normal text-[#5d5d5d] dark:text-gray-300',
};

const PRIORITY_STYLES = {
  URGENT: 'bg-[rgba(220,38,38,0.05)] text-[#dc2626]',
  HIGH: 'bg-[rgba(249,115,22,0.05)] text-[#f97316]',
  MEDIUM: 'bg-[rgba(202,138,4,0.05)] text-[#ca8a04]',
  LOW: 'bg-[rgba(107,114,128,0.05)] text-[#6b7280]',
};

const CARD_HEIGHT = {
  compact: 32,
  medium: 68,
  halfTask: SEVEN_AM_TASK_HEIGHT,
  halfHabit: SEVEN_AM_HABIT_HEIGHT,
  full: 88,
};

function estimateCardHeight(item) {
  if (item.kind === 'suggestion') return 72;
  if (item.kind === 'habit') return CARD_HEIGHT.halfHabit;
  if (item.layout === 'half') return CARD_HEIGHT.halfTask;
  if (item.description && !item.durationLabel && !item.category) return CARD_HEIGHT.medium;
  if (!item.description && !item.category && !item.durationLabel) return CARD_HEIGHT.compact;
  return CARD_HEIGHT.full;
}

function getGridMinHeight(dayItems) {
  let bottom = (PLANNER_HOURS.length - 1) * ROW_STEP + ROW_LABEL_HEIGHT;
  dayItems.forEach((item) => {
    const hourIndex = PLANNER_HOURS.indexOf(item.time);
    if (hourIndex < 0) return;
    const top = getCardTop(item.time, hourIndex);
    bottom = Math.max(bottom, top + estimateCardHeight(item));
  });
  return bottom + GRID_BOTTOM_PAD;
}

function getHourLineTop(index) {
  return index * ROW_STEP + ROW_LABEL_HEIGHT / 2;
}

function getCardTop(hour, index) {
  if (hour === '4 AM') return getHourLineTop(index) - FOUR_AM_CARD_ABOVE_HOUR_LINE;
  if (hour === '7 AM') return getSevenAmCardTop();
  if (CARD_TOP_FROM_GRID[hour] != null) return CARD_TOP_FROM_GRID[hour];
  return getHourLineTop(index) + CARD_TOP_OFFSET;
}

function GhostTagsRow({ item, className = '' }) {
  return (
    <div className={`flex flex-wrap items-center gap-2 sm:gap-2.5 ${className}`}>
      <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
        {item.priority && (
          <span
            className={`rounded-[6px] px-1.5 py-0.5 ${TYPO.badge} ${PRIORITY_STYLES[item.priority]}`}
          >
            {item.priority}
          </span>
        )}
        {item.source === 'ai' && (
          <span
            className={`flex items-center gap-1 rounded-[6px] bg-[#f9f4ff] px-1.5 py-0.5 text-[#8022fe] ${TYPO.badge}`}
          >
            <Sparkles size={10} className="shrink-0" /> AI
          </span>
        )}
      </div>
      {item.status && (
        <>
          <TagDivider tall />
          <span
            className={`rounded-[6px] bg-[#f2f2f2] px-1.5 py-0.5 text-[#a3a3a3] uppercase ${TYPO.badge}`}
          >
            {item.status}
          </span>
        </>
      )}
    </div>
  );
}

function HourRow({ hour }) {
  return (
    <div className="relative flex w-full items-center gap-[10px]">
      <span
        className={`shrink-0 text-right whitespace-nowrap ${TYPO.hour}`}
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

function TagDivider({ tall }) {
  return <div className={`mx-0 w-px shrink-0 bg-[#f2f2f2] ${tall ? 'h-2.5' : 'h-1.5'}`} />;
}

function StatusTagsRow({ item }) {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
      {item.priority && (
        <span
          className={`rounded-[6px] px-1.5 py-0.5 ${TYPO.badge} ${PRIORITY_STYLES[item.priority]}`}
        >
          {item.priority}
        </span>
      )}
      {item.status && (
        <>
          <TagDivider tall />
          <span
            className={`rounded-[6px] bg-[#f2f2f2] px-1.5 py-0.5 text-[#a3a3a3] uppercase ${TYPO.badge}`}
          >
            {item.status}
          </span>
        </>
      )}
    </div>
  );
}

function MetadataChips({ item, includeGoal = true, includeSteps = true }) {
  return (
    <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
      {item.category && (
        <span className={`rounded-[6px] border border-[#f2f2f2] px-1.5 py-0.5 ${TYPO.chip}`}>
          {item.category}
        </span>
      )}
      {includeGoal && item.goalLabel && (
        <span
          className={`flex items-center gap-1.5 rounded-[6px] border border-[#f2f2f2] px-1.5 py-0.5 ${TYPO.chip}`}
        >
          <Target size={12} className="shrink-0" /> {item.goalLabel}
        </span>
      )}
      {item.durationLabel && (
        <span
          className={`flex items-center gap-1.5 rounded-[6px] border border-[#f2f2f2] px-1.5 py-0.5 ${TYPO.chip}`}
        >
          <Clock size={12} className="shrink-0" /> {item.durationLabel}
        </span>
      )}
      {includeSteps && item.stepsLabel && (
        <span
          className={`flex items-center gap-1.5 rounded-[6px] border border-[#f2f2f2] px-1.5 py-0.5 ${TYPO.chip}`}
        >
          <BarChart2 size={12} className="shrink-0" /> {item.stepsLabel}
        </span>
      )}
    </div>
  );
}

function HalfTaskCardBody({ item, faded }) {
  return (
    <div
      className={`flex min-h-0 min-w-0 flex-1 flex-col justify-between gap-2 ${
        faded ? 'opacity-40 transition-opacity group-hover:opacity-100' : ''
      }`}
    >
      <div className="flex flex-col gap-1.5">
        <StatusTagsRow item={item} />
        <div className="flex flex-col gap-1">
          <span className="truncate text-[12px] leading-normal font-medium text-[#181818] dark:text-gray-300">
            {item.title}
          </span>
          {item.description && (
            <p className="line-clamp-1 text-[12px] leading-normal font-medium text-[#a3a3a3] dark:text-gray-500">
              {item.description}
            </p>
          )}
        </div>
      </div>
      <MetadataChips item={item} />
    </div>
  );
}

/** Figma ghost cards — vertical dashed rule (habit progress panel). */
function GhostVerticalDivider() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute top-0 left-0 h-full w-px transition-opacity group-hover:opacity-0"
      preserveAspectRatio="none"
      viewBox="0 0 1 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="0.5"
        y1="0"
        x2="0.5"
        y2="100"
        stroke="#e8e8e8"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
        strokeDasharray="8 14"
      />
    </svg>
  );
}

/** Figma empty-state ghost cards — light ashy dashes, airy spacing. */
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
        stroke="#e8e8e8"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
        strokeDasharray="8 14"
      />
    </svg>
  );
}

function GhostFieldShell({
  children,
  className = '',
  radius = 8,
  borderRx = 3,
  borderRy = 30,
  style,
}) {
  return (
    <div
      className={`group relative bg-white transition-all duration-200 hover:bg-[#fcfcfc] hover:shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)] dark:bg-zinc-800 ${className}`}
      style={{ borderRadius: radius, ...style }}
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

function TaskCard({ item, ghost, dimmed }) {
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

  const fullTaskBody = (faded) => (
    <div
      className={`flex min-w-0 flex-1 flex-col gap-2 ${
        faded ? 'opacity-40 transition-opacity group-hover:opacity-100' : ''
      }`}
    >
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <span className={`min-w-0 flex-1 truncate ${TYPO.cardTitle}`}>{item.title}</span>
          <GhostTagsRow item={item} className="shrink-0" />
        </div>
        {item.description && <p className={`line-clamp-1 ${TYPO.cardDesc}`}>{item.description}</p>}
      </div>
      <MetadataChips item={item} />
    </div>
  );

  if (ghostCompact) {
    return (
      <GhostFieldShell
        radius={8}
        borderRx={2}
        borderRy={32}
        className={`flex min-h-[32px] w-full items-center justify-between rounded-lg px-2.5 py-1.5 sm:pl-[11px] ${
          dimmed ? 'opacity-50' : ''
        }`}
      >
        <div className="relative z-[1] flex min-w-0 flex-1 flex-wrap items-center gap-2 opacity-40 transition-opacity group-hover:opacity-100 sm:gap-2.5">
          <span className={`min-w-0 flex-1 truncate ${TYPO.compactTitle}`}>{item.title}</span>
          <GhostTagsRow item={item} className="shrink-0" />
        </div>
      </GhostFieldShell>
    );
  }

  if (ghostMedium) {
    return (
      <GhostFieldShell
        radius={12}
        borderRx={2.5}
        borderRy={8}
        className={`flex h-[68px] w-full overflow-hidden rounded-xl p-[10px] ${
          dimmed ? 'opacity-50' : ''
        }`}
      >
        <div className="relative z-[1] flex min-w-0 flex-1 flex-col opacity-50 transition-opacity group-hover:opacity-100">
          <div className="flex items-center gap-2.5">
            <span className="min-w-0 flex-1 truncate text-[14px] leading-normal font-medium text-[#181818] dark:text-gray-300">
              {item.title}
            </span>
            <GhostTagsRow item={item} className="shrink-0" />
          </div>
          <p className="mt-[13px] line-clamp-1 text-[12px] leading-normal font-medium text-[#a3a3a3] dark:text-gray-500">
            {item.description}
          </p>
        </div>
      </GhostFieldShell>
    );
  }

  if (item.layout === 'half') {
    if (ghost) {
      return (
        <GhostFieldShell
          radius={12}
          borderRx={2.5}
          borderRy={8}
          className={`flex w-full overflow-hidden rounded-xl p-[10px] ${
            dimmed ? 'opacity-50' : ''
          }`}
          style={{ height: CARD_HEIGHT.halfTask }}
        >
          <div className="relative z-[1] flex min-h-0 min-w-0 flex-1">
            <HalfTaskCardBody item={item} faded />
          </div>
        </GhostFieldShell>
      );
    }
    return (
      <div
        className={`flex w-full flex-col overflow-hidden rounded-xl border border-solid border-[#f2f2f2] bg-[#fcfcfc] p-[10px] dark:border-zinc-700 dark:bg-zinc-800 ${
          dimmed ? 'opacity-50' : ''
        }`}
        style={{ height: CARD_HEIGHT.halfTask }}
      >
        <HalfTaskCardBody item={item} faded={false} />
      </div>
    );
  }

  if (ghost && (item.category || item.durationLabel || item.stepsLabel)) {
    return (
      <GhostFieldShell
        radius={12}
        borderRx={2.5}
        borderRy={8}
        className={`flex min-h-[88px] w-full overflow-hidden rounded-xl p-2.5 sm:p-[10px] ${
          dimmed ? 'opacity-50' : ''
        }`}
      >
        <div className="relative z-[1] min-w-0 flex-1">{fullTaskBody(true)}</div>
      </GhostFieldShell>
    );
  }

  if (!ghost && (item.category || item.durationLabel || item.stepsLabel)) {
    return (
      <div
        className={`flex min-h-[88px] w-full overflow-hidden rounded-xl border border-solid border-[#f2f2f2] bg-[#fcfcfc] p-2.5 sm:p-[10px] dark:border-zinc-700 dark:bg-zinc-800 ${
          dimmed ? 'opacity-50' : ''
        } ${item.optimized ? 'border-purple-200 bg-purple-50/10' : ''}`}
      >
        {fullTaskBody(false)}
      </div>
    );
  }

  return (
    <div
      className={`flex w-full flex-col gap-1.5 rounded-xl p-2.5 shadow-sm transition-all duration-200 sm:p-3 dark:bg-zinc-800 ${
        ghost
          ? 'border border-dashed border-[#f2f2f2] bg-white opacity-40 hover:border-solid hover:border-[#f2f2f2] hover:bg-[#fcfcfc] hover:opacity-100 hover:shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)] dark:border-zinc-700 dark:bg-zinc-800'
          : 'border border-gray-100 bg-white dark:border-zinc-700'
      } ${dimmed ? 'opacity-50' : ''} ${item.optimized ? 'border-purple-200 bg-purple-50/10' : ''}`}
    >
      <div className="flex flex-col justify-start gap-2 sm:flex-row sm:items-center">
        <span className={`min-w-0 truncate ${TYPO.cardTitle}`}>{item.title}</span>
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <GhostTagsRow item={item} className="shrink-0" />
        </div>
      </div>
      {item.description && <p className={TYPO.cardDesc}>{item.description}</p>}
      {(item.category || item.goalLabel || item.durationLabel || item.stepsLabel) && (
        <MetadataChips item={item} />
      )}
    </div>
  );
}

function HabitCard({ item, ghost, dimmed }) {
  const faded = ghost ? 'opacity-40 transition-opacity group-hover:opacity-100' : '';

  const body = (
    <>
      <div className={`flex min-w-0 flex-1 flex-col justify-center gap-0.5 p-[10px] ${faded}`}>
        <span className="truncate text-[12px] leading-normal font-medium text-[#181818] dark:text-gray-300">
          {item.title}
        </span>
        {item.description && (
          <p className="line-clamp-1 text-[12px] leading-normal font-medium text-[#a3a3a3] dark:text-gray-500">
            {item.description}
          </p>
        )}
      </div>
      <div className="relative flex w-11 shrink-0 flex-col items-center justify-between px-3 py-2">
        {ghost && (
          <>
            <GhostVerticalDivider />
            <div
              aria-hidden
              className="pointer-events-none absolute top-0 bottom-0 left-0 w-px bg-[#f2f2f2] opacity-0 transition-opacity group-hover:opacity-100"
            />
          </>
        )}
        {!ghost && <div aria-hidden className="absolute top-0 bottom-0 left-0 w-px bg-[#f2f2f2]" />}
        <div
          className={`size-5 shrink-0 rounded-md border border-[#e9e9e9] bg-white dark:border-zinc-600 dark:bg-zinc-800 ${faded}`}
        />
        <span
          className={`text-[12px] leading-none font-medium text-[#5d5d5d] dark:text-gray-400 ${faded}`}
        >
          {item.progress.done}/{item.progress.total}
        </span>
      </div>
    </>
  );

  if (ghost) {
    return (
      <GhostFieldShell
        radius={12}
        borderRx={2.5}
        borderRy={8}
        className={`flex w-full items-stretch overflow-hidden rounded-xl ${
          dimmed ? 'opacity-50' : ''
        }`}
        style={{ height: CARD_HEIGHT.halfHabit }}
      >
        <div className="relative z-[1] flex min-w-0 flex-1 items-stretch">{body}</div>
      </GhostFieldShell>
    );
  }

  return (
    <div
      className={`flex w-full items-stretch overflow-hidden rounded-xl border border-solid border-[#f2f2f2] bg-[#fcfcfc] dark:border-zinc-700 dark:bg-zinc-800 ${
        dimmed ? 'opacity-50' : ''
      }`}
      style={{ height: CARD_HEIGHT.halfHabit }}
    >
      {body}
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
  return <TaskCard item={item} ghost={ghost} dimmed={dimmed} />;
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
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[#f2f2f2] bg-white shadow-sm max-xl:h-auto max-xl:flex-none dark:border-zinc-800/80 dark:bg-zinc-900">
      <div className="scrollbar-white relative flex-1 overflow-y-auto p-3 max-xl:max-h-[min(70vh,560px)] xl:min-h-0">
        {/* Date header — centered over time column, Figma 1260:23099 */}
        <div className="mb-3 flex flex-col items-center gap-0.5" style={{ width: GRID_LINE_LEFT }}>
          <span className="text-xs font-medium text-[#c2c2c2] sm:text-[12px] dark:text-gray-500">
            {weekdayShort}
          </span>
          <span className="flex items-center justify-center rounded-[8px] bg-[#f9f4ff] px-1.5 py-0.5 text-sm font-medium text-[#8022fe] sm:text-[16px] dark:bg-purple-950/40 dark:text-purple-400">
            {dateNum}
          </span>
        </div>

        <div className="relative" style={{ minHeight: getGridMinHeight(dayItems) }}>
          {/* Vertical separator — Figma 1260:23199 at left 45px */}
          <div
            className="pointer-events-none absolute top-0 bottom-0 w-px bg-[#f2f2f2] dark:bg-zinc-800/80"
            style={{ left: GRID_LINE_LEFT }}
          />

          {/* Hour rows only — Figma 1260:23132; no extra slot grid lines */}
          <div className="relative z-0 flex flex-col" style={{ gap: ROW_GAP }}>
            {PLANNER_HOURS.map((hour) => (
              <HourRow key={hour} hour={hour} />
            ))}
          </div>

          {/* Dot on vertical timeline; line lives inside 4 AM card (clipped to dashed border) */}
          {!hasAcceptedPlan && dayItems.some((item) => item.time === '4 AM') && (
            <FourAmCurrentTimeDot />
          )}

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
                style={{ left: CARD_LEFT, top: getCardTop(hour, i) }}
              >
                {!hasAcceptedPlan && hour === '4 AM' && <FourAmCurrentTimeLineInCard />}
                {isHalfLayout ? (
                  <div className="flex w-full items-start gap-2">
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
