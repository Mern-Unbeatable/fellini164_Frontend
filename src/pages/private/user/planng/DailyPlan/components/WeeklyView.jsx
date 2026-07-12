import React from 'react';
import { RefreshCw, Clock, Sparkles } from 'lucide-react';
import { PLANNER_HOURS, SEED_DATE_KEY, dateKeyFromDate, getWeekDays } from '../plannerData';

// Figma 1264:27248 — weekly grid rhythm (scaled ~66/55 for Daily parity).
const ROW_GAP = 48;
const ROW_LABEL_HEIGHT = 18;
const ROW_STEP = ROW_GAP + ROW_LABEL_HEIGHT;
const TIME_COL_WIDTH = 40;
const TIME_COL_GAP = 10;
const GRID_LINE_LEFT = TIME_COL_WIDTH + TIME_COL_GAP;
const HOUR_LINE_OVERHANG = 4;
const GRID_SCALE = ROW_STEP / 55;
const DAY_COLS = 7;
const CARD_INSET = 8;

const PRIORITY_STYLES = {
  URGENT: 'bg-[rgba(220,38,38,0.05)] text-[#dc2626]',
  HIGH: 'bg-[rgba(249,115,22,0.05)] text-[#f97316]',
  MEDIUM: 'bg-[rgba(202,138,4,0.05)] text-[#ca8a04]',
  LOW: 'bg-[rgba(107,114,128,0.05)] text-[#6b7280]',
};

// Figma 1264:27350+ absolute card tops/heights on Wed column.
const WEEKLY_CARD_LAYOUT = {
  '1': { top: 7, height: 37 },
  '2': { top: 72, height: 20 },
  '3': { top: 149, height: 52 },
  '5': { top: 307, height: 108, showHabitBadge: true },
  '4': { top: 540, height: 144 },
};

const FOUR_AM_PURPLE_TOP = Math.round(188 * GRID_SCALE);

function scaleY(value) {
  return Math.round(value * GRID_SCALE);
}

function getGridMinHeight() {
  const last = WEEKLY_CARD_LAYOUT['4'];
  return scaleY(last.top + last.height) + 24;
}

function HourRow({ hour }) {
  return (
    <div className="relative flex w-full items-center gap-[10px]">
      <span
        className="shrink-0 text-right text-[10px] font-medium leading-normal whitespace-nowrap text-[#c2c2c2] sm:text-[12px] dark:text-gray-500"
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

function WeekGhostCard({ ghost, className = '', style, children, habitBadge }) {
  return (
    <div
      className={`group relative overflow-hidden rounded-lg border border-dashed border-[#f2f2f2] bg-white transition-all hover:bg-[#fcfcfc] dark:bg-zinc-800 ${
        ghost ? '' : 'border-solid'
      } ${className}`}
      style={style}
    >
      {habitBadge && ghost && (
        <div className="absolute top-[-8px] left-1/2 z-2 flex -translate-x-1/2 items-center gap-1 rounded bg-[#fcfcfc] px-[3px] py-px dark:bg-zinc-900">
          <RefreshCw size={8} className="text-[#5d5d5d] opacity-40" />
          <span className="text-[8px] font-medium text-[#5d5d5d] opacity-40">1 Habit</span>
        </div>
      )}
      {children}
    </div>
  );
}

function WeekItemCard({ item, ghost, layout }) {
  const faded = ghost ? 'opacity-40 transition-opacity group-hover:opacity-100' : '';
  const height = scaleY(layout.height);
  const isCompact = layout.height <= 37;
  const isTiny = layout.height <= 20;

  if (isTiny) {
    return (
      <WeekGhostCard
        ghost={ghost}
        className="flex items-center px-2 py-1.5"
        style={{ height }}
      >
        <p className={`line-clamp-1 text-[10px] font-medium leading-normal text-[#181818] ${faded} dark:text-gray-300`}>
          {item.title}
        </p>
      </WeekGhostCard>
    );
  }

  if (isCompact && !item.priority && !item.category) {
    return (
      <WeekGhostCard
        ghost={ghost}
        className="flex items-center px-2 py-1.5"
        style={{ height }}
      >
        <p className={`line-clamp-1 text-[10px] font-medium leading-normal text-[#181818] ${faded} dark:text-gray-300`}>
          {item.title}
        </p>
      </WeekGhostCard>
    );
  }

  if (item.id === '3') {
    return (
      <WeekGhostCard ghost={ghost} className="flex flex-col gap-1.5 px-2 pb-1.5 pt-2" style={{ height }}>
        <p className={`text-[10px] font-medium leading-normal text-[#181818] ${faded} dark:text-gray-300`}>
          {item.title}
        </p>
        <div className={`flex flex-wrap items-center gap-1 ${faded}`}>
          {item.priority && (
            <span className={`rounded px-[3px] py-px text-[8px] font-medium uppercase ${PRIORITY_STYLES[item.priority]}`}>
              {item.priority}
            </span>
          )}
          {item.status && (
            <span className="rounded bg-[#f2f2f2] px-[3px] py-px text-[8px] font-medium uppercase text-[#a3a3a3]">
              {item.status}
            </span>
          )}
        </div>
      </WeekGhostCard>
    );
  }

  return (
    <WeekGhostCard
      ghost={ghost}
      habitBadge={layout.showHabitBadge}
      className="flex flex-col gap-1.5 px-2 pb-1.5 pt-2"
      style={{ height }}
    >
      <div className={`flex min-h-0 flex-1 flex-col gap-1.5 ${faded}`}>
        <p className="line-clamp-2 text-[10px] font-medium leading-normal text-[#181818] dark:text-gray-300">
          {item.title}
        </p>
        {(item.priority || item.status) && (
          <div className="flex flex-wrap items-center gap-1">
            {item.priority && (
              <span className={`rounded px-[3px] py-px text-[8px] font-medium uppercase ${PRIORITY_STYLES[item.priority]}`}>
                {item.priority}
              </span>
            )}
            {item.status && (
              <span className="rounded bg-[#f2f2f2] px-[3px] py-px text-[8px] font-medium uppercase text-[#a3a3a3]">
                {item.status}
              </span>
            )}
            {item.source === 'ai' && (
              <span className="flex items-center gap-0.5 rounded bg-[#f9f4ff] px-[3px] py-px text-[8px] font-medium text-[#8022fe]">
                <Sparkles size={7} /> AI
              </span>
            )}
          </div>
        )}
      </div>
      {(item.category || item.durationLabel) && (
        <div className={`flex flex-wrap items-center gap-1 ${faded}`}>
          {item.category && (
            <span className="rounded border border-[#f2f2f2] px-1.5 py-0.5 text-[8px] font-medium text-[#5d5d5d]">
              {item.category}
            </span>
          )}
          {item.durationLabel && (
            <span className="flex items-center gap-1 rounded border border-[#f2f2f2] px-1.5 py-0.5 text-[8px] font-medium text-[#5d5d5d]">
              <Clock size={7} /> {item.durationLabel}
            </span>
          )}
        </div>
      )}
    </WeekGhostCard>
  );
}

export default function WeeklyView({ currentDate, selectedDate, plans, hasAcceptedPlan, isLoading }) {
  const anchorDate = selectedDate || currentDate || new Date(2026, 4, 13);
  const weekDays = getWeekDays(anchorDate);
  const selectedKey = dateKeyFromDate(anchorDate);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[#f2f2f2] bg-white shadow-sm max-lg:h-auto max-lg:flex-none dark:border-zinc-800/80 dark:bg-zinc-900">
      <div className="scrollbar-white flex min-h-0 flex-1 flex-col overflow-x-auto">
        <div className="flex min-h-0 min-w-[800px] flex-1 flex-col p-3">
          {/* Weekday header — Figma 1264:27249 */}
          <div className="mb-3 flex">
            <div className="shrink-0" style={{ width: GRID_LINE_LEFT }} />
            <div className="grid min-w-0 flex-1 grid-cols-7">
              {weekDays.map((day) => {
                const isActive = dateKeyFromDate(day) === selectedKey;
                return (
                  <div key={day.toISOString()} className="flex flex-col items-center gap-0.5 px-1">
                    <span className="text-xs font-medium text-[#c2c2c2] sm:text-[12px] dark:text-gray-500">
                      {day.toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                    <span
                      className={`flex items-center justify-center rounded-lg px-1.5 py-0.5 text-sm font-medium sm:text-[16px] ${
                        isActive
                          ? 'bg-[#f9f4ff] text-[#8022fe] dark:bg-purple-950/40 dark:text-purple-400'
                          : 'text-[#5d5d5d] dark:text-gray-200'
                      }`}
                    >
                      {day.getDate()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Grid + cards */}
          <div
            className="scrollbar-hidden relative flex-1 overflow-y-auto lg:min-h-0 max-lg:max-h-[min(70vh,560px)]"
          >
            <div className="relative" style={{ minHeight: getGridMinHeight() }}>
              {/* Vertical day separators — Figma 1264:27351+ */}
              <div
                className="pointer-events-none absolute top-0 bottom-0 z-0 grid"
                style={{ left: GRID_LINE_LEFT, right: 0, gridTemplateColumns: `repeat(${DAY_COLS}, 1fr)` }}
              >
                {Array.from({ length: DAY_COLS }).map((_, i) => (
                  <div key={`col-${i}`} className="relative h-full">
                    <div className="absolute top-0 bottom-0 left-0 w-px bg-[#f2f2f2] dark:bg-zinc-800/80" />
                  </div>
                ))}
              </div>

              {/* Hour rows — Figma 1264:27283 */}
              <div className="relative z-0 flex flex-col" style={{ gap: ROW_GAP }}>
                {isLoading
                  ? PLANNER_HOURS.map((hour) => (
                      <div key={hour} className="flex animate-pulse items-center gap-[10px]">
                        <div className="h-3 rounded bg-gray-200 dark:bg-zinc-800" style={{ width: TIME_COL_WIDTH }} />
                        <div className="h-px flex-1 bg-gray-100 dark:bg-zinc-800" />
                      </div>
                    ))
                  : PLANNER_HOURS.map((hour) => <HourRow key={hour} hour={hour} />)}
              </div>

              {/* Cards overlay — Figma 1264:27350 */}
              {!isLoading && (
                <div
                  className="pointer-events-none absolute top-0 z-10 grid"
                  style={{
                    left: GRID_LINE_LEFT,
                    right: 0,
                    height: getGridMinHeight(),
                    gridTemplateColumns: `repeat(${DAY_COLS}, 1fr)`,
                  }}
                >
                  {weekDays.map((day) => {
                    const dayKey = dateKeyFromDate(day);
                    const dayItems = (plans[dayKey] || []).filter((item) => {
                      if (item.kind === 'habit' && item.layout === 'half') return false;
                      return WEEKLY_CARD_LAYOUT[item.id];
                    });

                    return (
                      <div key={`col-cards-${dayKey}`} className="relative h-full">
                        {dayItems.map((item) => {
                          const layout = WEEKLY_CARD_LAYOUT[item.id];
                          return (
                            <div
                              key={item.id}
                              className="pointer-events-auto absolute"
                              style={{
                                top: scaleY(layout.top),
                                left: CARD_INSET,
                                right: CARD_INSET,
                              }}
                            >
                              <WeekItemCard item={item} ghost={!hasAcceptedPlan} layout={layout} />
                            </div>
                          );
                        })}

                        {!hasAcceptedPlan &&
                          dayKey === SEED_DATE_KEY &&
                          dayItems.some((item) => item.id === '3') && (
                            <div
                              className="pointer-events-none absolute right-2 left-2 z-15"
                              style={{ top: FOUR_AM_PURPLE_TOP }}
                            >
                              <div className="absolute top-1/2 h-[1.5px] -translate-y-1/2 bg-[#8022fe]" style={{ left: 0, right: 0 }} />
                            </div>
                          )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
