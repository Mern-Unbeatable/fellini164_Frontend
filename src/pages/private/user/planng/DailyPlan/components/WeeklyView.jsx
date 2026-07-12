import React from 'react';
import { RefreshCw, Clock, Sparkles } from 'lucide-react';
import { PLANNER_HOURS, SEED_DATE_KEY, dateKeyFromDate, getWeekDays } from '../plannerData';

// Figma 1264:27248 — weekly grid rhythm (native Figma px values).
const ROW_LABEL_HEIGHT = 15;
const ROW_GAP = 40;
const ROW_STEP = 55;
const TIME_COL_WIDTH = 35;
const TIME_LABEL_GAP = 10; // Figma — gap between label and day column line
const GRID_LINE_LEFT = 45;
const HOUR_LINE_EXTEND_LEFT = 11; // Figma 1264:27286 — line starts ~34px, grid at 45px
const GRID_SCALE = 1;
const DAY_COLS = 7;

const WEEKLY_GRID_COLUMNS = `${GRID_LINE_LEFT}px repeat(${DAY_COLS}, minmax(0, 1fr))`;

// Figma 1264:27359+ — compact title 10px; badges/chips 8px.
const WEEKLY_TYPO = {
  ghostTitle:
    'm-0 w-full overflow-hidden text-center text-ellipsis whitespace-nowrap text-[10px] font-medium leading-[1.5] text-[#181818] opacity-40 transition-opacity group-hover:opacity-100 dark:text-gray-300',
  title:
    'w-full overflow-hidden text-center text-ellipsis whitespace-nowrap text-[10px] font-medium leading-[1.5] text-[#181818] opacity-40 transition-opacity group-hover:opacity-100 dark:text-gray-300',
  titleMulti:
    'm-0 h-[29px] w-full overflow-hidden text-center text-[10px] font-medium leading-[1.5] text-[#181818] line-clamp-2 dark:text-gray-300',
  badge: 'text-[8px] font-medium uppercase leading-[1.5]',
  chip: 'text-[8px] font-medium leading-[1.5] text-[#5d5d5d]',
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
  '2': { top: 72, height: 20 },
  '3': { top: 149, height: 52 },
  '5': { top: 307, height: 108, showHabitBadge: true },
  '4': { top: 540, height: 144 },
};

const FOUR_AM_PURPLE_TOP = 188; // Figma 1264:27407 — 4 AM indicator y in grid

function scaleY(value) {
  return Math.round(value * GRID_SCALE);
}

function getGridMinHeight() {
  const last = WEEKLY_CARD_LAYOUT['4'];
  return scaleY(last.top + last.height) + 24;
}

function WeekCardAnchor({ top, children, className = 'pointer-events-auto' }) {
  return (
    <div
      className={`absolute box-border ${className}`}
      style={{ top, left: 0, right: 0, width: '100%' }}
    >
      {children}
    </div>
  );
}

/** Figma 1264:27359 — px-8 both sides, title spans full inner width. */
function WeekGhostCompactBody({ title, paddingClass = 'py-[6px]', inset = true }) {
  return (
    <div
      className={`box-border flex h-full w-full min-w-0 flex-col items-center justify-center text-center ${inset ? 'px-[8px]' : ''} ${paddingClass}`}
    >
      <p className={WEEKLY_TYPO.ghostTitle}>{title}</p>
    </div>
  );
}

function HourRow({ hour, rowIndex }) {
  return (
    <>
      <span
        className="box-border w-full min-w-0 self-center text-right text-[10px] font-medium leading-[1.5] whitespace-nowrap text-[#c2c2c2] dark:text-gray-500"
        style={{ gridColumn: 1, gridRow: rowIndex, paddingRight: TIME_LABEL_GAP }}
      >
        {hour}
      </span>
      <div className="relative min-w-0 self-center" style={{ gridColumn: '2 / -1', gridRow: rowIndex }}>
        <div
          className="absolute top-1/2 right-0 h-px -translate-y-1/2 bg-[#f2f2f2] dark:bg-zinc-800/80"
          style={{ left: -HOUR_LINE_EXTEND_LEFT }}
        />
      </div>
    </>
  );
}

function WeekGhostCard({ ghost, className = '', style, children, habitBadge, radius = 8 }) {
  return (
    <div
      className={`group relative box-border w-full overflow-hidden bg-white transition-all duration-200 hover:bg-[#fcfcfc] dark:bg-zinc-800 ${
        ghost ? 'border border-dashed border-[#f2f2f2]' : 'border border-solid border-[#f2f2f2]'
      } ${className}`}
      style={{ borderRadius: radius, ...style }}
    >
      {ghost && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity group-hover:opacity-100"
          style={{ boxShadow: 'inset 0 0 0 1px #f2f2f2', borderRadius: radius }}
        />
      )}
      {habitBadge && ghost && (
        <div className="absolute top-[-8px] left-1/2 z-2 flex -translate-x-1/2 items-center gap-[4px] rounded-[4px] bg-[#fcfcfc] px-[3px] py-px dark:bg-zinc-900">
          <RefreshCw size={8} className="text-[#5d5d5d] opacity-40" />
          <span className="text-[8px] font-medium leading-[1.5] text-[#5d5d5d] opacity-40">1 Habit</span>
        </div>
      )}
      <div className="relative z-[1] box-border h-full w-full">
        {children}
      </div>
    </div>
  );
}

function WeekGhostFieldTitle({ children, multiline = false, ghost = false, className = '' }) {
  if (ghost) {
    return <p className={`${WEEKLY_TYPO.ghostTitle} ${className}`}>{children}</p>;
  }

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
        <WeekGhostCompactBody title={item.title} paddingClass="h-full justify-center py-0" />
      </WeekGhostCard>
    );
  }

  if (isCompact) {
    return (
      <WeekGhostCard ghost={ghost} radius={8} style={{ height }}>
        <WeekGhostCompactBody title={item.title} paddingClass="h-full justify-center py-[6px]" />
      </WeekGhostCard>
    );
  }

  if (item.id === '3') {
    return (
      <WeekGhostCard ghost={ghost} style={{ height }}>
        <div className="box-border flex h-full w-full flex-col gap-[6px] px-[8px] pb-[6px] pt-[8px]">
          <div className="flex w-full min-w-0 flex-col items-center gap-[6px] text-center opacity-40 transition-opacity group-hover:opacity-100">
            <p className="m-0 w-full text-center text-[10px] font-medium leading-[1.5] text-[#181818] dark:text-gray-300">{item.title}</p>
            <div className="flex flex-wrap items-center justify-center gap-[4px]">
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
        </div>
      </WeekGhostCard>
    );
  }

  return (
    <WeekGhostCard ghost={ghost} habitBadge={layout.showHabitBadge} style={{ height }}>
      <div className="box-border flex h-full w-full flex-col gap-[6px] px-[8px] pb-[6px] pt-[8px]">
        <div className="flex min-h-0 w-full flex-1 flex-col items-center gap-[6px] text-center opacity-40 transition-opacity group-hover:opacity-100">
          <WeekGhostFieldTitle multiline>{item.title}</WeekGhostFieldTitle>
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
          <div
            className={`flex w-full min-w-0 flex-wrap content-center items-center justify-center gap-[4px] ${
              layout.showHabitBadge ? 'opacity-40 transition-opacity group-hover:opacity-100' : ''
            }`}
          >
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
          {/* Weekday header — Figma 1264:27249 */}
          <div
            className="mb-3 grid w-full"
            style={{ gridTemplateColumns: WEEKLY_GRID_COLUMNS }}
          >
            <div aria-hidden className="min-w-0" />
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

          {/* Grid + cards — single full-width column template */}
          <div
            className="scrollbar-hidden relative min-h-0 flex-1 overflow-y-auto lg:min-h-0 max-lg:max-h-[min(70vh,560px)]"
            style={{ scrollbarGutter: 'stable' }}
          >
            <div
              className="relative w-full"
              style={{
                minHeight: getGridMinHeight(),
                display: 'grid',
                gridTemplateColumns: WEEKLY_GRID_COLUMNS,
                gridTemplateRows: `repeat(${PLANNER_HOURS.length}, ${ROW_STEP}px)`,
              }}
            >
              {isLoading
                ? PLANNER_HOURS.map((hour, rowIndex) => (
                    <React.Fragment key={hour}>
                      <div
                        className="box-border h-3 animate-pulse justify-self-end rounded bg-gray-200 dark:bg-zinc-800"
                        style={{
                          gridColumn: 1,
                          gridRow: rowIndex + 1,
                          width: TIME_COL_WIDTH,
                          marginRight: TIME_LABEL_GAP,
                        }}
                      />
                      <div className="relative min-w-0" style={{ gridColumn: '2 / -1', gridRow: rowIndex + 1 }}>
                        <div
                          className="absolute top-1/2 right-0 h-px -translate-y-1/2 bg-gray-100 dark:bg-zinc-800"
                          style={{ left: -HOUR_LINE_EXTEND_LEFT }}
                        />
                      </div>
                    </React.Fragment>
                  ))
                : PLANNER_HOURS.map((hour, rowIndex) => (
                    <HourRow key={hour} hour={hour} rowIndex={rowIndex + 1} />
                  ))}

              {weekDays.map((day, colIndex) => {
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
                    className="relative min-w-0 border-l border-[#f2f2f2] dark:border-zinc-800/80"
                    style={{
                      gridColumn: colIndex + 2,
                      gridRow: `1 / ${PLANNER_HOURS.length + 1}`,
                      minHeight: getGridMinHeight(),
                    }}
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
                        <WeekCardAnchor top={FOUR_AM_PURPLE_TOP} className="pointer-events-none z-15">
                          <div className="relative h-px w-full">
                            <div className="absolute inset-x-0 top-1/2 h-[1.5px] -translate-y-1/2 bg-[#8022fe]" />
                          </div>
                        </WeekCardAnchor>
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
