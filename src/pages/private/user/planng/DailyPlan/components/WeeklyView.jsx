import React from 'react';
import { RefreshCw, Clock } from 'lucide-react';
import { PLANNER_HOURS, SEED_DATE_KEY, dateKeyFromDate, getWeekDays } from '../plannerData';

// Weekly grid rhythm — time column matches DailyView exactly.
const ROW_LABEL_HEIGHT = 15;
const ROW_GAP = 40;
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

const FOUR_AM_PURPLE_TOP = 199 + ROW_STEP; // sits just below the URGENT/TO DO row of the Exercise Routine card

function scaleY(value) {
  return Math.round(value * GRID_SCALE);
}

function weekContentFade(ghost) {
  return ghost ? 'opacity-40 transition-opacity group-hover:opacity-100' : '';
}

function getGridMinHeight() {
  const last = WEEKLY_CARD_LAYOUT['4'];
  return scaleY(last.top + last.height) + 24;
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
    <div className="relative flex w-full items-center gap-[10px]">
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
    <div className="relative flex w-full animate-pulse items-center gap-[10px]">
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

function WeekGhostCard({ ghost, className = '', style, children, habitBadge, radius = 8 }) {
  const active = !ghost;
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
          <span className="text-[12px] font-medium leading-[1.5] text-[#5d5d5d]">1 Habit</span>
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
function WeekTaskMetaChips({ item, fade, chipClass }) {
  if (!item.category && !item.durationLabel) return null;
  return (
    <div
      className={`flex w-full min-w-0 shrink-0 flex-nowrap items-center justify-center gap-[4px] overflow-hidden ${fade}`}
    >
      {item.category && (
        <span
          className={`max-w-[50%] shrink truncate rounded-[4px] border border-[#f2f2f2] px-[6px] py-[2px] ${chipClass}`}
        >
          {item.category}
        </span>
      )}
      {item.durationLabel && (
        <span
          className={`flex min-w-0 max-w-[50%] items-center gap-[4px] truncate rounded-[4px] border border-[#f2f2f2] px-[6px] py-[2px] ${chipClass}`}
        >
          <Clock size={10} className="shrink-0" /> {item.durationLabel}
        </span>
      )}
    </div>
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

  // Real / API tasks — monthly-style truncated field (fixes long-title overlap into chips).
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

  // Habit cards — top padding clears floating "1 Habit" badge; title truncates like Monthly.
  if (layout.showHabitBadge) {
    return (
      <WeekGhostCard ghost={ghost} habitBadge style={{ height }}>
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

  const openDayInDaily = (day) => {
    if (setSelectedDate) setSelectedDate(new Date(day.getFullYear(), day.getMonth(), day.getDate()));
    if (setViewMode) setViewMode('Daily');
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[#f2f2f2] bg-white shadow-sm max-xl:h-auto max-xl:flex-none dark:border-zinc-800/80 dark:bg-zinc-900">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex min-h-0 w-full flex-1 flex-col p-3">
          {/* Header + grid share ONE scroll container; both day-areas are flex-1 after the
              same 50px time-column spacer, so their 7 columns are always identical width. */}
          <div className="scrollbar-hidden relative min-h-0 flex-1 overflow-y-auto xl:min-h-0 max-xl:max-h-[min(70vh,560px)]">
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
                    const dayItems = isLoading
                      ? []
                      : (plans[dayKey] || []).filter((item) => {
                      if (item.kind === 'habit' && item.layout === 'half') return false;
                      return getWeeklyCardLayout(item);
                    });

                    return (
                      <div
                        key={`col-cards-${dayKey}`}
                        className="relative min-w-0 overflow-visible border-l border-[#f2f2f2] dark:border-zinc-800/80"
                      >
                        {!isLoading &&
                          dayItems.map((item) => {
                            const layout = getWeeklyCardLayout(item);
                            return (
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
                            );
                          })}

                        {!isLoading &&
                          dayKey === SEED_DATE_KEY &&
                          (
                            <div
                              className="pointer-events-none absolute inset-x-0 z-15"
                              style={{ top: FOUR_AM_PURPLE_TOP }}
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
      </div>
    </div>
  );
}
