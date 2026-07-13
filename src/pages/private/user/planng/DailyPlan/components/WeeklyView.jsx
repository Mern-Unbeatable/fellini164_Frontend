import React from 'react';
import { RefreshCw, Clock, Sparkles } from 'lucide-react';
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

// Figma 1264:27359+ — compact title 10px; badges/chips 8px.
const WEEKLY_TYPO = {
  ghostTitle:
    'm-0 h-[18px] w-full min-w-0 truncate text-center text-[12px] font-medium leading-[1.5] text-[#181818] opacity-40 transition-opacity group-hover:opacity-100 dark:text-gray-300',
  title:
    'm-0 w-full min-w-0 truncate text-center text-[10px] font-medium leading-[1.5] text-[#181818] opacity-40 transition-opacity group-hover:opacity-100 dark:text-gray-300',
  titleMulti:
    'm-0 line-clamp-2 h-[29px] w-full min-w-0 shrink-0 break-words text-left text-[10px] font-medium leading-[1.5] text-[#181818] dark:text-gray-300',
  habitTitle:
    'm-0 line-clamp-2 h-[36px] w-full min-w-0 shrink-0 break-words text-left text-[12px] font-medium leading-[1.5] text-[#181818] dark:text-gray-300',
  badge: 'text-[8px] font-medium uppercase leading-[1.5]',
  badgeMd: 'text-[12px] font-medium uppercase leading-[1.5]',
  chip: 'text-[8px] font-medium leading-[1.5] text-[#5d5d5d]',
  chipMd: 'text-[12px] font-medium leading-[1.5] text-[#5d5d5d]',
};

const PRIORITY_STYLES = {
  URGENT: 'bg-[rgba(220,38,38,0.05)] text-[#dc2626]',
  HIGH: 'bg-[rgba(249,115,22,0.05)] text-[#f97316]',
  MEDIUM: 'bg-[rgba(202,138,4,0.05)] text-[#ca8a04]',
  LOW: 'bg-[rgba(107,114,128,0.05)] text-[#6b7280]',
};

// Figma 1264:27350+ absolute card tops/heights on Wed column.
const WEEKLY_CARD_LAYOUT = {
  '1': { top: 7, height: 37 },
  '2': { top: 72, height: 37 },
  '3': { top: 149, height: 64 },
  '5': { top: 322, height: 120, showHabitBadge: true },
  // Centered on the 11 AM line (index 10 → line at 557.5): top = 557.5 - height/2.
  '4': { top: 552, height: 72 },
};

const FOUR_AM_PURPLE_TOP = 199; // sits just below the URGENT/TO DO row of the Exercise Routine card

function scaleY(value) {
  return Math.round(value * GRID_SCALE);
}

function getGridMinHeight() {
  const last = WEEKLY_CARD_LAYOUT['4'];
  return scaleY(last.top + last.height) + 24;
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
function WeekGhostCompactBody({ title, paddingClass = 'py-[6px]' }) {
  return (
    <div
      className={`box-border flex h-full w-full min-w-0 flex-col items-center justify-center overflow-hidden px-[8px] ${paddingClass}`}
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
  return (
    <div
      className={`group relative box-border w-full bg-white transition-all duration-200 hover:bg-[#fcfcfc] dark:bg-zinc-800 ${
        habitBadge ? 'overflow-visible' : 'overflow-hidden'
      } ${ghost ? '' : 'border border-solid border-[#f2f2f2]'} ${className}`}
      style={{ borderRadius: radius, ...style }}
    >
      {ghost && <WeekGhostFieldBorder radius={radius} />}
      {ghost && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity group-hover:opacity-100"
          style={{ boxShadow: 'inset 0 0 0 1px #f2f2f2', borderRadius: radius }}
        />
      )}
      {habitBadge && ghost && (
        <div className="absolute top-[-8px] left-1/2 z-2 flex w-max -translate-x-1/2 items-center gap-[4px] whitespace-nowrap rounded-[4px] bg-[#fcfcfc] px-[3px] py-px dark:bg-zinc-900">
          <RefreshCw size={12} className="text-[#5d5d5d] opacity-40" />
          <span className="text-[12px] font-medium leading-[1.5] text-[#5d5d5d] opacity-40">1 Habit</span>
        </div>
      )}
      <div className="relative z-[1] box-border flex h-full w-full flex-col">{children}</div>
    </div>
  );
}

function WeekGhostFieldTitle({ children, multiline = false, ghost = false, className = '' }) {
  const style = multiline ? WEEKLY_TYPO.titleMulti : WEEKLY_TYPO.title;
  return <p className={`${style} ${className}`}>{children}</p>;
}

function WeekItemCard({ item, ghost, layout }) {
  const height = scaleY(layout.height);
  const isTiny = layout.height <= 20;
  const isCompact = layout.height <= 37 && !isTiny;

  if (isTiny) {
    return (
      <WeekGhostCard ghost={ghost} radius={6} style={{ height }}>
        <WeekGhostCompactBody title={item.title} paddingClass="py-[6px]" />
      </WeekGhostCard>
    );
  }

  if (isCompact) {
    return (
      <WeekGhostCard ghost={ghost} radius={8} style={{ height }}>
        <WeekGhostCompactBody title={item.title} />
      </WeekGhostCard>
    );
  }

  if (item.id === '3') {
    return (
      <WeekGhostCard ghost={ghost} style={{ height }}>
        <div className="box-border flex h-full w-full flex-col items-center justify-start gap-[6px] px-[8px] pb-[6px] pt-[8px] text-center">
          <div className="flex w-full min-w-0 flex-col items-center opacity-40 transition-opacity group-hover:opacity-100">
            <p className="m-0 w-full text-center text-[12px] font-medium leading-[1.5] text-[#181818] dark:text-gray-300">
              {item.title}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-[4px] opacity-40 transition-opacity group-hover:opacity-100">
            {item.priority && (
              <span className={`rounded-[4px] px-[3px] py-px ${WEEKLY_TYPO.badge} ${PRIORITY_STYLES[item.priority]}`}>
                {item.priority}
              </span>
            )}
            {item.status && (
              <span className={`rounded-[4px] bg-[#f2f2f2] px-[3px] py-px uppercase text-[#a3a3a3] ${WEEKLY_TYPO.badge}`}>
                {item.status}
              </span>
            )}
          </div>
        </div>
      </WeekGhostCard>
    );
  }

  // Figma 1264:27361 — 106×108, radius 8, px-8 pt-8 pb-6, gap-6, left-aligned stack.
  if (layout.showHabitBadge) {
    return (
      <WeekGhostCard ghost={ghost} habitBadge style={{ height }}>
        <div className="box-border flex h-full w-full flex-col items-start gap-[6px] px-[8px] pt-[8px] pb-[6px] text-left">
          <div className="flex w-full min-w-0 flex-col items-start gap-[6px] opacity-40 transition-opacity group-hover:opacity-100">
            <p className={WEEKLY_TYPO.habitTitle}>{item.title}</p>
            {(item.priority || item.status) && (
              <div className="flex flex-wrap items-center gap-[4px]">
                {item.priority && (
                  <span className={`rounded-[4px] px-[3px] py-px ${WEEKLY_TYPO.badgeMd} ${PRIORITY_STYLES[item.priority]}`}>
                    {item.priority}
                  </span>
                )}
                {item.status && (
                  <span className={`rounded-[4px] bg-[#f2f2f2] px-[3px] py-px uppercase text-[#a3a3a3] ${WEEKLY_TYPO.badgeMd}`}>
                    {item.status}
                  </span>
                )}
              </div>
            )}
          </div>
          {(item.category || item.durationLabel) && (
            <div className="flex w-full min-w-0 shrink-0 flex-wrap items-center gap-[4px] opacity-40 transition-opacity group-hover:opacity-100">
              {item.category && (
                <span className={`rounded-[4px] border border-[#f2f2f2] px-[6px] py-[2px] ${WEEKLY_TYPO.chipMd}`}>
                  {item.category}
                </span>
              )}
              {item.durationLabel && (
                <span className={`flex items-center gap-[4px] rounded-[4px] border border-[#f2f2f2] px-[6px] py-[2px] ${WEEKLY_TYPO.chipMd}`}>
                  <Clock size={10} /> {item.durationLabel}
                </span>
              )}
            </div>
          )}
        </div>
      </WeekGhostCard>
    );
  }

  // Figma Frame 219 — 11 AM: title + HIGH / IN PROGRESS only, 12px text.
  if (item.id === '4') {
    return (
      <WeekGhostCard ghost={ghost} style={{ height }}>
        <div className="box-border flex w-full flex-col items-start px-[8px] pt-[8px] pb-[6px] text-left">
          <div className="flex w-full min-w-0 flex-col items-start gap-[2px] opacity-40 transition-opacity group-hover:opacity-100">
            <p className={WEEKLY_TYPO.habitTitle}>{item.title}</p>
            {(item.priority || item.status) && (
              <div className="flex flex-wrap items-center gap-[4px]">
                {item.priority && (
                  <span className={`rounded-[4px] px-[3px] py-px ${WEEKLY_TYPO.badgeMd} ${PRIORITY_STYLES[item.priority]}`}>
                    {item.priority}
                  </span>
                )}
                {item.status && (
                  <span className={`rounded-[4px] bg-[#f2f2f2] px-[3px] py-px uppercase text-[#a3a3a3] ${WEEKLY_TYPO.badgeMd}`}>
                    {item.status}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </WeekGhostCard>
    );
  }

  return (
    <WeekGhostCard ghost={ghost} style={{ height }}>
      <div className="box-border flex h-full w-full flex-col items-center gap-[6px] px-[6px] pb-[6px] pt-[8px] text-center">
        <div className="flex min-h-0 w-full flex-1 flex-col items-center gap-[6px] opacity-40 transition-opacity group-hover:opacity-100">
          <WeekGhostFieldTitle multiline ghost={ghost}>
            {item.title}
          </WeekGhostFieldTitle>
          {(item.priority || item.status) && (
            <div className="flex w-full min-w-0 flex-wrap items-center justify-center gap-[4px]">
              {item.priority && (
                <span className={`rounded-[4px] px-[3px] py-px ${WEEKLY_TYPO.badge} ${PRIORITY_STYLES[item.priority]}`}>
                  {item.priority}
                </span>
              )}
              {item.status && (
                <span className={`rounded-[4px] bg-[#f2f2f2] px-[3px] py-px uppercase text-[#a3a3a3] ${WEEKLY_TYPO.badge}`}>
                  {item.status}
                </span>
              )}
              {item.source === 'ai' && (
                <span className={`flex items-center gap-[4px] rounded-[4px] bg-[#f9f4ff] px-[3px] py-px text-[#8022fe] ${WEEKLY_TYPO.badge}`}>
                  <Sparkles size={8} /> AI
                </span>
              )}
            </div>
          )}
        </div>
        {(item.category || item.durationLabel) && (
          <div className="flex w-full min-w-0 flex-wrap content-center items-center justify-center gap-[4px]">
            {item.category && (
              <span className={`rounded-[4px] border border-[#f2f2f2] px-[6px] py-[2px] ${WEEKLY_TYPO.chip}`}>
                {item.category}
              </span>
            )}
            {item.durationLabel && (
              <span className={`flex items-center gap-[4px] rounded-[4px] border border-[#f2f2f2] px-[6px] py-[2px] ${WEEKLY_TYPO.chip}`}>
                <Clock size={7} /> {item.durationLabel}
              </span>
            )}
          </div>
        )}
      </div>
    </WeekGhostCard>
  );
}

export default function WeeklyView({ currentDate, selectedDate, plans, hasAcceptedPlan, isLoading }) {
  const anchorDate = selectedDate || currentDate || new Date(2026, 4, 13);
  const weekDays = getWeekDays(anchorDate);
  const selectedKey = dateKeyFromDate(anchorDate);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[#f2f2f2] bg-white shadow-sm max-lg:h-auto max-lg:flex-none dark:border-zinc-800/80 dark:bg-zinc-900">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex min-h-0 w-full flex-1 flex-col p-3">
          {/* Header + grid share ONE scroll container; both day-areas are flex-1 after the
              same 50px time-column spacer, so their 7 columns are always identical width. */}
          <div className="scrollbar-hidden relative min-h-0 flex-1 overflow-y-auto lg:min-h-0 max-lg:max-h-[min(70vh,560px)]">
            {/* Weekday header — Figma 1264:27249 */}
            <div className="sticky top-0 z-30 mb-3 flex w-full bg-white dark:bg-zinc-900">
              <div aria-hidden className="shrink-0" style={{ width: GRID_LINE_LEFT }} />
              <div className="grid min-w-0 flex-1" style={{ gridTemplateColumns: DAY_GRID_COLUMNS, columnGap: 0 }}>
                {weekDays.map((day) => {
                  const isActive = dateKeyFromDate(day) === selectedKey;
                  return (
                    <div key={day.toISOString()} className="flex min-w-0 flex-col items-center gap-[2px]">
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
                    </div>
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
                          return WEEKLY_CARD_LAYOUT[item.id];
                        });

                    return (
                      <div
                        key={`col-cards-${dayKey}`}
                        className="relative min-w-0 overflow-visible border-l border-[#f2f2f2] dark:border-zinc-800/80"
                      >
                        {!isLoading &&
                          dayItems.map((item) => {
                            const layout = WEEKLY_CARD_LAYOUT[item.id];
                            return (
                              <WeekCardAnchor key={item.id} top={scaleY(layout.top)}>
                                <WeekItemCard item={item} ghost={!hasAcceptedPlan} layout={layout} />
                              </WeekCardAnchor>
                            );
                          })}

                        {!isLoading &&
                          !hasAcceptedPlan &&
                          dayKey === SEED_DATE_KEY &&
                          dayItems.some((item) => item.id === '3') && (
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
