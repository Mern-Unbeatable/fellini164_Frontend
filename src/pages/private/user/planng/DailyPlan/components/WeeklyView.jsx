import React, { useEffect, useState } from 'react';
import { RefreshCw, Clock } from 'lucide-react';
import { PLANNER_HOURS, dateKeyFromDate, getWeekDays } from '../plannerData';

// Weekly grid rhythm — match DailyView so the present-time line lands on the same hour.
const ROW_GAP = 48;
const ROW_LABEL_HEIGHT = 18;
const ROW_STEP = ROW_GAP + ROW_LABEL_HEIGHT;
const TIME_COL_WIDTH = 40; // DailyView parity
const TIME_COL_GAP = 10; // DailyView parity
const GRID_LINE_LEFT = TIME_COL_WIDTH + TIME_COL_GAP; // 50px — same as DailyView
const HOUR_LINE_OVERHANG = 4;
const GRID_SCALE = 1;
const DAY_COLS = 7;

const DAY_GRID_COLUMNS = `repeat(${DAY_COLS}, minmax(0, 1fr))`;

const HOUR_LABEL =
  'shrink-0 text-right text-[12px] font-medium leading-[1.5] whitespace-nowrap text-[#c2c2c2] dark:text-gray-500';

// Weekly card typography — 12px; titles truncate like Monthly (no 2-line overflow into chips).
const WEEKLY_TYPO = {
  ghostTitle:
    'm-0 w-full min-w-0 truncate text-center text-[12px] font-medium leading-[1.5] text-[#181818] dark:text-gray-300',
  title:
    'm-0 w-full min-w-0 truncate text-center text-[12px] font-medium leading-[1.5] text-[#181818] dark:text-gray-300',
  habitTitle:
    'm-0 w-full min-w-0 truncate text-left text-[12px] font-medium leading-[1.5] text-[#181818] dark:text-gray-300',
  badge: 'text-[12px] font-medium uppercase leading-[1.5]',
  badgeMd: 'text-[12px] font-medium uppercase leading-[1.5]',
  chip: 'text-[12px] font-medium leading-[1.5] text-[#5d5d5d]',
  chipMd: 'text-[12px] font-medium leading-[1.5] text-[#5d5d5d]',
};

const PRIORITY_STYLES = {
  URGENT: 'bg-[rgba(220,38,38,0.05)] text-[#dc2626]',
  HIGH: 'bg-[rgba(249,115,22,0.05)] text-[#f97316]',
  MEDIUM: 'bg-[rgba(202,138,4,0.05)] text-[#ca8a04]',
  LOW: 'bg-[rgba(107,114,128,0.05)] text-[#6b7280]',
};

// Figma 1264:27350+ absolute card tops/heights on Wed column.
// +ROW_STEP once 12 AM was prepended so seed cards keep the same offset to their hour lines.
const WEEKLY_CARD_LAYOUT = {
  '1': { top: 7 + ROW_STEP, height: 37 },
  '2': { top: 72 + ROW_STEP, height: 37 },
  '3': { top: 149 + ROW_STEP, height: 64 },
  '5': { top: 322 + ROW_STEP, height: 120, showHabitBadge: true },
  // Centered on the 11 AM line: previous top 552 + one row for 12 AM.
  '4': { top: 552 + ROW_STEP, height: 72 },
};

const ORIGINAL_TIME_BY_ID = {
  '1': '1 AM',
  '2': '2 AM',
  '3': '4 AM',
  '5': '7 AM',
  '4': '11 AM',
};

function scaleY(value) {
  return Math.round(value * GRID_SCALE);
}

function getWeeklyHourLineTop(index) {
  return index * ROW_STEP + ROW_LABEL_HEIGHT / 2;
}

/** Y of "now" — same formula as DailyView.getCurrentTimeTop (12 AM–11 PM). */
function getWeeklyCurrentTimeTop(now = new Date()) {
  const hourIndex = Math.min(23, Math.max(0, now.getHours()));
  const minuteFrac = now.getMinutes() / 60 + now.getSeconds() / 3600;
  return getWeeklyHourLineTop(hourIndex) + minuteFrac * ROW_STEP;
}

function useNowTicker(enabled) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    if (!enabled) return undefined;
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, [enabled]);
  return now;
}

function weekContentFade(ghost) {
  return ghost ? 'opacity-40 transition-opacity group-hover:opacity-100' : '';
}

function getGridMinHeight() {
  return PLANNER_HOURS.length * ROW_STEP + 24;
}

function getWeeklyCardLayout(item) {
  const hourIndex = PLANNER_HOURS.indexOf(item.time);
  const baseLayout = WEEKLY_CARD_LAYOUT[item.id];

  // Mock seed cards (fixed Figma ids) keep their absolute layouts.
  if (baseLayout) {
    if (item.time === ORIGINAL_TIME_BY_ID[item.id]) return baseLayout;
    if (hourIndex < 0) return baseLayout;
    return {
      ...baseLayout,
      top: hourIndex * ROW_STEP + 7,
    };
  }

  // API planner items (UUID ids) — place by startTime on the existing hour grid.
  // Habits need extra height so the floating "1 Habit" badge never covers the title.
  // Tasks with meta chips need ~72px so truncated title + Career/Min never overlap.
  if (hourIndex >= 0) {
    const isHabit = item.kind === 'habit';
    const hasMeta = Boolean(item.category || item.durationLabel);
    return {
      top: hourIndex * ROW_STEP + 7,
      height: isHabit ? (hasMeta ? 76 : 64) : hasMeta ? 72 : 52,
      showHabitBadge: isHabit,
    };
  }

  // No matching hour label — stack by order so the item still appears in the week column.
  const order = Number(item.orderIndex) || 0;
  const isHabit = item.kind === 'habit';
  const hasMeta = Boolean(item.category || item.durationLabel);
  return {
    top: order * 44 + 7,
    height: isHabit ? (hasMeta ? 76 : 64) : hasMeta ? 72 : 52,
    showHabitBadge: isHabit,
  };
}

/**
 * Weekly Figma 2 / 2.1 flow (not Daily two-up):
 * - Same hour with task + habit → show task card(s) with details; habits collapse to top "N Habit" badge
 * - Habit-only hour → habit card with badge
 * - Multiple tasks same hour → stack vertically (no overlap)
 */
function buildWeeklyRenderSlots(dayItems) {
  const groups = new Map();
  const order = [];
  (dayItems || []).forEach((item) => {
    const key = item.time || `__id_${item.id}`;
    if (!groups.has(key)) {
      groups.set(key, []);
      order.push(key);
    }
    groups.get(key).push(item);
  });

  const slots = [];
  order.forEach((key) => {
    const items = groups.get(key);
    const habits = items.filter((item) => item.kind === 'habit');
    const tasks = items.filter((item) => item.kind !== 'habit');
    const habitCount = habits.length;
    const displayItems = tasks.length > 0 ? tasks : habits;

    let top = getWeeklyCardLayout(displayItems[0]).top;
    displayItems.forEach((item, index) => {
      const base = getWeeklyCardLayout(item);
      const attachHabitBadge =
        tasks.length > 0
          ? index === 0 && (habitCount > 0 || Boolean(base.showHabitBadge))
          : true;
      const resolvedHabitCount = attachHabitBadge
        ? Math.max(habitCount, base.showHabitBadge ? 1 : 0, item.kind === 'habit' ? 1 : 0)
        : 0;
      const needsDetailHeight =
        resolvedHabitCount > 0 ||
        Boolean(item.priority || item.status || item.category || item.durationLabel);
      const height =
        resolvedHabitCount > 0 && tasks.length > 0
          ? Math.max(base.height, 120)
          : needsDetailHeight
            ? Math.max(base.height, item.kind === 'habit' ? 64 : 72)
            : base.height;

      slots.push({
        item,
        layout: {
          ...base,
          top,
          height,
          showHabitBadge: resolvedHabitCount > 0,
          habitCount: resolvedHabitCount,
        },
      });
      top += height + 6;
    });
  });

  return slots;
}

// Card fills the day column (Figma card ≈ column width) with small equal side gaps.
function WeekCardAnchor({ top, children, className = 'pointer-events-auto' }) {
  return (
    <div className={`absolute inset-x-[4px] ${className}`} style={{ top }}>
      {children}
    </div>
  );
}

/** Figma 1264:27359 — centered compact title inside dashed card. */
function WeekGhostCompactBody({ title, ghost = false, paddingClass = 'py-[6px]' }) {
  return (
    <div
      className={`box-border flex h-full w-full min-w-0 flex-col items-center justify-center overflow-hidden px-[8px] ${paddingClass} ${weekContentFade(ghost)}`}
    >
      <p className={WEEKLY_TYPO.ghostTitle}>{title}</p>
    </div>
  );
}

function HourRow({ hour }) {
  return (
    <div
      className="relative flex w-full items-center gap-[10px]"
      style={{ height: ROW_LABEL_HEIGHT }}
    >
      <span className={HOUR_LABEL} style={{ width: TIME_COL_WIDTH }}>
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

function HourRowSkeleton() {
  return (
    <div
      className="relative flex w-full animate-pulse items-center gap-[10px]"
      style={{ height: ROW_LABEL_HEIGHT }}
    >
      <div className="h-3 shrink-0 rounded bg-gray-200 dark:bg-zinc-800" style={{ width: TIME_COL_WIDTH }} />
      <div className="relative h-0 min-w-0 flex-1">
        <div
          className="absolute top-1/2 h-px -translate-y-1/2 bg-gray-100 dark:bg-zinc-800"
          style={{ left: -HOUR_LINE_OVERHANG, right: 0 }}
        />
      </div>
    </div>
  );
}

/** Airy dashed border matching DailyView ghost fields (Figma empty state, dash 8/14). */
function WeekGhostFieldBorder({ radius = 8 }) {
  const rx = radius <= 6 ? 6 : radius <= 8 ? 4 : 3;
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
        ry={30}
        fill="none"
        stroke="#e8e8e8"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
        strokeDasharray="8 14"
      />
    </svg>
  );
}

function WeekGhostCard({ ghost, className = '', style, children, habitBadge, habitCount = 1, radius = 8 }) {
  const active = !ghost;
  const badgeLabel = habitCount === 1 ? '1 Habit' : `${habitCount} Habits`;
  return (
    <div
      className={`group relative box-border w-full overflow-visible transition-all duration-200 dark:bg-zinc-800 ${
        active
          ? 'bg-[#fcfcfc] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)]'
          : 'bg-white hover:bg-[#fcfcfc]'
      } ${className}`}
      style={{ borderRadius: radius, ...style }}
    >
      {ghost && <WeekGhostFieldBorder radius={radius} />}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 z-0 transition-opacity ${
          active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
        style={{ boxShadow: 'inset 0 0 0 1px #f2f2f2', borderRadius: radius }}
      />
      {habitBadge && (
        <div
          className={`absolute top-[-10px] left-1/2 z-2 flex w-max -translate-x-1/2 items-center gap-[4px] whitespace-nowrap rounded-[4px] border border-[#f2f2f2] bg-[#fcfcfc] px-[6px] py-[2px] dark:border-zinc-700 dark:bg-zinc-900 ${
            ghost ? 'opacity-40 transition-opacity group-hover:opacity-100' : ''
          }`}
        >
          <RefreshCw size={12} className="text-[#5d5d5d]" />
          <span className="text-[12px] font-medium leading-[1.5] text-[#5d5d5d]">{badgeLabel}</span>
        </div>
      )}
      {/* Content is clipped in its own layer so it can never visually escape the card's
          dashed/solid boundary, while the floating "1 Habit" pill above (a sibling, not a
          descendant of this clip) is unaffected. */}
      <div
        className="relative z-[1] box-border flex h-full w-full flex-col overflow-hidden"
        style={{ borderRadius: radius }}
      >
        {children}
      </div>
    </div>
  );
}

/** Monthly-style task chip row (Career / 480 Min) — never wraps under title. */
function WeekTaskMetaChips({ item, fade, chipClass, stacked = false }) {
  if (!item.category && !item.durationLabel) return null;
  return (
    <div
      className={`flex w-full min-w-0 shrink-0 overflow-hidden ${
        stacked
          ? 'flex-col items-start gap-[4px]'
          : 'flex-nowrap items-center justify-center gap-[4px]'
      } ${fade}`}
    >
      {item.category && (
        <span
          className={`max-w-full shrink truncate rounded-[4px] border border-[#f2f2f2] px-[6px] py-[2px] ${chipClass}`}
        >
          {item.category}
        </span>
      )}
      {item.durationLabel && (
        <span
          className={`flex min-w-0 max-w-full items-center gap-[4px] truncate rounded-[4px] border border-[#f2f2f2] px-[6px] py-[2px] ${chipClass}`}
        >
          <Clock size={10} className="shrink-0" /> {item.durationLabel}
        </span>
      )}
    </div>
  );
}

/**
 * Weekly task with details (Figma 2.1 / image 2):
 * optional top habit badge + title + priority/status + category/duration.
 * Typography stays 12px (WEEKLY_TYPO) — do not shrink.
 */
function WeekTaskDetailCard({ item, ghost, height, habitBadge = false, habitCount = 1 }) {
  const fade = weekContentFade(ghost);
  const hasTags = Boolean(item.priority || item.status);
  const hasMeta = Boolean(item.category || item.durationLabel);

  return (
    <WeekGhostCard
      ghost={ghost}
      habitBadge={habitBadge}
      habitCount={habitCount}
      style={{ height }}
    >
      <div
        className={`box-border flex h-full w-full min-w-0 flex-col items-start justify-center gap-[4px] overflow-hidden px-[8px] text-left ${
          habitBadge ? 'pt-[14px] pb-[6px]' : 'py-[6px]'
        } ${fade}`}
      >
        <p className={WEEKLY_TYPO.habitTitle} title={item.title}>
          {item.title}
        </p>
        {hasTags && (
          <div className="flex w-full min-w-0 flex-nowrap items-center gap-[4px] overflow-hidden">
            {item.priority && (
              <span
                className={`shrink-0 rounded-[4px] px-[3px] py-px ${WEEKLY_TYPO.badgeMd} ${PRIORITY_STYLES[item.priority]}`}
              >
                {item.priority}
              </span>
            )}
            {item.status && (
              <span
                className={`min-w-0 truncate rounded-[4px] bg-[#f2f2f2] px-[3px] py-px uppercase text-[#a3a3a3] ${WEEKLY_TYPO.badgeMd}`}
              >
                {item.status}
              </span>
            )}
          </div>
        )}
        {hasMeta && (
          <WeekTaskMetaChips item={item} fade="" chipClass={WEEKLY_TYPO.chipMd} stacked />
        )}
      </div>
    </WeekGhostCard>
  );
}

/**
 * Task cards in Weekly — same truncation as Monthly field:
 * single-line ellipsis title + optional meta chips below (no wrap/overlap).
 */
function WeekTaskFieldCard({ item, ghost, height }) {
  const fade = weekContentFade(ghost);
  const hasMeta = Boolean(item.category || item.durationLabel);

  return (
    <WeekGhostCard ghost={ghost} style={{ height }}>
      <div
        className={`box-border flex h-full w-full min-w-0 flex-col items-center justify-center gap-[4px] overflow-hidden px-[6px] py-[6px] text-center ${fade}`}
      >
        <p className={WEEKLY_TYPO.title} title={item.title}>
          {item.title}
        </p>
        {hasMeta && <WeekTaskMetaChips item={item} fade="" chipClass={WEEKLY_TYPO.chip} />}
      </div>
    </WeekGhostCard>
  );
}

function WeekItemCard({ item, ghost, layout }) {
  const height = scaleY(layout.height);
  const isTiny = layout.height <= 20;
  const isCompact = layout.height <= 37 && !isTiny;
  const fade = weekContentFade(ghost);
  const habitCount = layout.habitCount || (layout.showHabitBadge ? 1 : 0);
  const isTask = item.kind === 'task' || (!layout.showHabitBadge && item.kind !== 'habit');

  if (isTiny) {
    return (
      <WeekGhostCard ghost={ghost} radius={6} style={{ height }}>
        <WeekGhostCompactBody title={item.title} ghost={ghost} paddingClass="py-[6px]" />
      </WeekGhostCard>
    );
  }

  if (isCompact) {
    return (
      <WeekGhostCard ghost={ghost} radius={8} style={{ height }}>
        <WeekGhostCompactBody title={item.title} ghost={ghost} />
      </WeekGhostCard>
    );
  }

  // Task + co-scheduled habit badge (Weekly Figma 2.1) — full details, original 12px type.
  if (isTask && layout.showHabitBadge && habitCount > 0) {
    return (
      <WeekTaskDetailCard
        item={item}
        ghost={ghost}
        height={height}
        habitBadge
        habitCount={habitCount}
      />
    );
  }

  // Real / API tasks with priority/status — same detail layout without habit badge.
  if (isTask && !WEEKLY_CARD_LAYOUT[item.id] && (item.priority || item.status)) {
    return <WeekTaskDetailCard item={item} ghost={ghost} height={height} />;
  }

  // Real / API tasks — monthly-style truncated field.
  if (isTask && !WEEKLY_CARD_LAYOUT[item.id]) {
    return <WeekTaskFieldCard item={item} ghost={ghost} height={height} />;
  }

  if (item.id === '3') {
    return (
      <WeekGhostCard ghost={ghost} style={{ height }}>
        <div className="box-border flex h-full w-full flex-col items-center justify-center gap-[4px] overflow-hidden px-[8px] py-[6px] text-center">
          <p className={`${WEEKLY_TYPO.title} ${fade}`} title={item.title}>
            {item.title}
          </p>
          <div className={`flex w-full min-w-0 flex-nowrap items-center justify-center gap-[4px] overflow-hidden ${fade}`}>
            {item.priority && (
              <span className={`shrink-0 rounded-[4px] px-[3px] py-px ${WEEKLY_TYPO.badgeMd} ${PRIORITY_STYLES[item.priority]}`}>
                {item.priority}
              </span>
            )}
            {item.status && (
              <span className={`min-w-0 truncate rounded-[4px] bg-[#f2f2f2] px-[3px] py-px uppercase text-[#a3a3a3] ${WEEKLY_TYPO.badgeMd}`}>
                {item.status}
              </span>
            )}
          </div>
        </div>
      </WeekGhostCard>
    );
  }

  // Habit-only cards — top "1 Habit" badge; title truncates like Monthly.
  if (layout.showHabitBadge || item.kind === 'habit') {
    return (
      <WeekGhostCard
        ghost={ghost}
        habitBadge
        habitCount={habitCount || 1}
        style={{ height }}
      >
        <div className="box-border flex h-full w-full flex-col items-start justify-center gap-[4px] overflow-hidden px-[8px] pt-[14px] pb-[6px] text-left">
          <p className={`${WEEKLY_TYPO.habitTitle} ${fade}`} title={item.title}>
            {item.title}
          </p>
          {(item.category || item.durationLabel) && (
            <div className={`flex w-full min-w-0 shrink-0 flex-nowrap items-center gap-[4px] overflow-hidden ${fade}`}>
              {item.category && (
                <span className={`max-w-[50%] shrink truncate rounded-[4px] border border-[#f2f2f2] px-[6px] py-[2px] ${WEEKLY_TYPO.chipMd}`}>
                  {item.category}
                </span>
              )}
              {item.durationLabel && (
                <span className={`flex min-w-0 max-w-[50%] items-center gap-[4px] truncate rounded-[4px] border border-[#f2f2f2] px-[6px] py-[2px] ${WEEKLY_TYPO.chipMd}`}>
                  <Clock size={10} className="shrink-0" /> {item.durationLabel}
                </span>
              )}
            </div>
          )}
        </div>
      </WeekGhostCard>
    );
  }

  // Figma Frame 219 — 11 AM seed card.
  if (item.id === '4') {
    return (
      <WeekGhostCard ghost={ghost} style={{ height }}>
        <div className="box-border flex h-full w-full flex-col items-start justify-center gap-[2px] overflow-hidden px-[8px] py-[6px] text-left">
          <p className={`${WEEKLY_TYPO.habitTitle} ${fade}`} title={item.title}>
            {item.title}
          </p>
          {(item.priority || item.status) && (
            <div className={`flex w-full min-w-0 flex-nowrap items-center gap-[4px] overflow-hidden ${fade}`}>
              {item.priority && (
                <span className={`shrink-0 rounded-[4px] px-[3px] py-px ${WEEKLY_TYPO.badgeMd} ${PRIORITY_STYLES[item.priority]}`}>
                  {item.priority}
                </span>
              )}
              {item.status && (
                <span className={`min-w-0 truncate rounded-[4px] bg-[#f2f2f2] px-[3px] py-px uppercase text-[#a3a3a3] ${WEEKLY_TYPO.badgeMd}`}>
                  {item.status}
                </span>
              )}
            </div>
          )}
        </div>
      </WeekGhostCard>
    );
  }

  // Fallback (seed tasks with meta) — monthly truncate + chips.
  return <WeekTaskFieldCard item={item} ghost={ghost} height={height} />;
}

export default function WeeklyView({
  currentDate,
  selectedDate,
  setSelectedDate,
  setViewMode,
  plans,
  hasAcceptedPlan,
  isLoading,
}) {
  const anchorDate = selectedDate || currentDate || new Date(2026, 4, 13);
  const weekDays = getWeekDays(anchorDate);
  const selectedKey = dateKeyFromDate(anchorDate);
  const todayKey = dateKeyFromDate(new Date());
  const weekIncludesToday = weekDays.some((day) => dateKeyFromDate(day) === todayKey);
  const now = useNowTicker(weekIncludesToday && !isLoading);
  const nowTop = scaleY(getWeeklyCurrentTimeTop(now));

  const openDayInDaily = (day) => {
    if (setSelectedDate) setSelectedDate(new Date(day.getFullYear(), day.getMonth(), day.getDate()));
    if (setViewMode) setViewMode('Daily');
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[#f2f2f2] bg-white shadow-sm max-xl:h-auto max-xl:flex-none dark:border-zinc-800/80 dark:bg-zinc-900">
      {/* Same scroll shell as DailyView: padding on the scroll container so the white
          scrollbar sits on the card edge (not inset behind an outer p-3 wrapper). */}
      <div className="scrollbar-white relative flex-1 overflow-y-auto p-3 max-xl:max-h-[min(70vh,560px)] xl:min-h-0">
        {/* Weekday header — Figma 1264:27249 */}
        <div className="sticky top-0 z-30 mb-3 flex w-full bg-white dark:bg-zinc-900">
          <div aria-hidden className="shrink-0" style={{ width: GRID_LINE_LEFT }} />
          <div className="grid min-w-0 flex-1" style={{ gridTemplateColumns: DAY_GRID_COLUMNS, columnGap: 0 }}>
            {weekDays.map((day) => {
              const isActive = dateKeyFromDate(day) === selectedKey;
              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => openDayInDaily(day)}
                  className="flex min-w-0 cursor-pointer flex-col items-center gap-[2px] rounded-lg border-0 bg-transparent p-0"
                >
                  <p className="text-center text-[12px] font-medium leading-[1.5] whitespace-nowrap text-[#c2c2c2] dark:text-gray-500">
                    {day.toLocaleDateString('en-US', { weekday: 'short' })}
                  </p>
                  <div
                    className={`flex flex-col items-center rounded-[8px] px-[6px] py-[2px] ${
                      isActive ? 'bg-[#f9f4ff] dark:bg-purple-950/40' : ''
                    }`}
                  >
                    <p
                      className={`text-center text-[16px] font-medium leading-[1.5] whitespace-nowrap ${
                        isActive
                          ? 'text-[#8022fe] dark:text-purple-400'
                          : 'text-[#5d5d5d] dark:text-gray-200'
                      }`}
                    >
                      {day.getDate()}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative w-full" style={{ minHeight: getGridMinHeight() }}>
          {/* Hour rows — label(40) + gap(10) + line; line starts at the 50px grid line */}
          <div className="relative z-0 flex flex-col" style={{ gap: ROW_GAP }}>
            {isLoading
              ? PLANNER_HOURS.map((hour) => <HourRowSkeleton key={hour} />)
              : PLANNER_HOURS.map((hour) => <HourRow key={hour} hour={hour} />)}
          </div>

          {/* Day columns + cards overlay — same flex(50px spacer)+grid-cols-7 as the header */}
          <div className="pointer-events-none absolute inset-0 z-[2] flex w-full">
            <div aria-hidden className="shrink-0" style={{ width: GRID_LINE_LEFT }} />
            <div className="grid min-w-0 flex-1" style={{ gridTemplateColumns: DAY_GRID_COLUMNS, columnGap: 0 }}>
              {weekDays.map((day) => {
                const dayKey = dateKeyFromDate(day);
                const dayItems = isLoading ? [] : plans[dayKey] || [];
                const slots = buildWeeklyRenderSlots(dayItems);

                return (
                  <div
                    key={`col-cards-${dayKey}`}
                    className="relative min-w-0 overflow-visible border-l border-[#f2f2f2] dark:border-zinc-800/80"
                  >
                    {!isLoading &&
                      slots.map(({ item, layout }) => (
                        <WeekCardAnchor
                          key={item.id}
                          top={scaleY(layout.top)}
                          className={`pointer-events-auto cursor-pointer ${
                            item.aiScheduleState ? 'animate-fade-in' : ''
                          }`}
                        >
                          <div
                            role="button"
                            tabIndex={0}
                            onClick={() => openDayInDaily(day)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                openDayInDaily(day);
                              }
                            }}
                          >
                            <WeekItemCard item={item} ghost={!hasAcceptedPlan} layout={layout} />
                          </div>
                        </WeekCardAnchor>
                      ))}

                    {!isLoading && dayKey === todayKey && (
                      <div
                        className="pointer-events-none absolute inset-x-0 z-15"
                        style={{ top: nowTop }}
                        aria-hidden
                      >
                        <div className="absolute inset-x-0 top-1/2 h-[1.5px] -translate-y-1/2 bg-[#8022fe]" />
                        <div className="absolute left-0 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white bg-[#8022fe] shadow-sm dark:border-zinc-900" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
