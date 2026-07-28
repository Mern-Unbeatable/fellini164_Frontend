import React from 'react';

/** Airy dashed border matching Weekly/Daily ghost fields. */
function MonthGhostFieldBorder() {
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
        rx="4"
        ry="30"
        fill="none"
        stroke="#e8e8e8"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
        strokeDasharray="8 14"
      />
    </svg>
  );
}

function MonthGhostPlanItem({ title, active = false, animated = false }) {
  return (
    <div
      className={`group relative w-full shrink-0 overflow-hidden rounded-lg px-2 py-1.5 transition-all duration-200 dark:bg-zinc-800 ${
        active
          ? 'bg-[#fcfcfc] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)]'
          : 'bg-white hover:bg-[#fcfcfc] dark:hover:bg-zinc-800/90'
      } ${animated ? 'animate-fade-in' : ''}`}
    >
      {!active && <MonthGhostFieldBorder />}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 z-0 rounded-lg transition-opacity ${
          active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
        style={{ boxShadow: 'inset 0 0 0 1px #f2f2f2' }}
      />
      <p
        className={`relative z-[1] truncate text-center text-[12px] leading-[1.5] font-medium text-[#181818] dark:text-gray-300 ${
          active ? '' : 'opacity-40 transition-opacity group-hover:opacity-100'
        }`}
        title={title}
      >
        {title}
      </p>
    </div>
  );
}

export default function MonthlyView({
  calendarDays,
  getFormattedDateString,
  plans,
  hasAcceptedPlan,
  selectedDate,
  setSelectedDate,
  setViewMode,
  isLoading,
}) {
  // Chunked into weeks and rendered as separate row grids — a single grid spanning every cell
  // computes one shared implicit row height across the whole calendar (so a busy day can't grow
  // without every other row being affected too); a grid per week sizes independently, so only
  // the week containing a busy day grows, per-row.
  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[#F2F2F2] bg-white shadow-sm max-xl:h-auto max-xl:flex-none dark:border-zinc-800/80 dark:bg-zinc-900">
      {/* Weekday Names */}
      <div className="grid shrink-0 grid-cols-7 gap-0 border-b border-gray-100 dark:border-zinc-800/80">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName) => (
          <div
            key={dayName}
            className="border-r border-gray-100 bg-white py-2 text-center text-xs font-medium text-[#5D5D5D] last:border-r-0 sm:py-3.5 dark:border-zinc-800/80 dark:bg-zinc-900 dark:text-gray-400"
          >
            {dayName}
          </div>
        ))}
      </div>

      {/* Calendar Cells — each week is its own grid row, sized independently so a busy day
          grows only its own week; a full border per cell (card look) replaces shared
          grid-lines since those only look right when every row is the same height. The whole
          list scrolls internally so an unusually tall week never clips the weeks below it. */}
      <div className="scrollbar-white flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto bg-gray-50/5 p-1.5 max-xl:max-h-[min(70vh,560px)] sm:gap-2 sm:p-2 xl:min-h-0 dark:bg-zinc-900/5">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {week.map((dayObj) => {
              const formattedDate = getFormattedDateString(dayObj);
              const dayPlans = plans[formattedDate] || [];
              // Monthly overview — up to 3 items (tasks + habits from create-plan / board)
              const monthlyDisplayPlans = dayPlans
                .filter((plan) => plan.layout !== 'half')
                .slice(0, 3);
              const isSelected =
                selectedDate.getDate() === dayObj.day &&
                selectedDate.getMonth() === dayObj.month &&
                selectedDate.getFullYear() === dayObj.year;
              const key = `${dayObj.year}-${dayObj.month}-${dayObj.day}-${dayObj.isCurrentMonth}`;

              return (
                <div
                  key={key}
                  onClick={() => {
                    setSelectedDate(new Date(dayObj.year, dayObj.month, dayObj.day));
                    if (setViewMode) {
                      setViewMode('Daily');
                    }
                  }}
                  className="flex min-h-12.5 cursor-pointer flex-col items-center overflow-hidden rounded-lg border border-gray-100 bg-white p-1 transition-colors hover:border-violet-200 hover:bg-gray-50/50 sm:h-30 sm:max-h-30 sm:rounded-xl sm:p-3 dark:border-zinc-800/80 dark:bg-zinc-900 dark:hover:border-violet-800 dark:hover:bg-zinc-800/20"
                >
                  {/* Day Number */}
                  <div className="mb-0.5 flex shrink-0 justify-center sm:mb-1.5">
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-md text-xs font-medium transition-all sm:h-7 sm:w-7 sm:rounded-lg ${
                        isSelected
                          ? 'text-primary bg-purple-100/70 font-bold dark:bg-purple-950/40 dark:text-purple-400'
                          : dayObj.isCurrentMonth
                            ? 'text-slate-600 dark:text-gray-300'
                            : 'text-gray-300 dark:text-zinc-700'
                      }`}
                    >
                      {dayObj.day}
                    </span>
                  </div>

                  {/* Plan Items (Desktop) — clipped inside fixed cell height */}
                  <div className="mt-1 hidden min-h-0 w-full flex-1 flex-col gap-1 overflow-hidden sm:flex">
                    {isLoading && isSelected
                      ? [0, 1, 2].map((value) => (
                          <div
                            key={value}
                            className="h-7 w-full shrink-0 animate-pulse rounded-lg bg-gray-100 dark:bg-zinc-800"
                          />
                        ))
                      : monthlyDisplayPlans.map((plan) => (
                          <MonthGhostPlanItem
                            key={plan.id}
                            title={plan.title}
                            active={hasAcceptedPlan}
                            animated={Boolean(plan.aiScheduleState)}
                          />
                        ))}
                  </div>

                  {/* Plan Indicators (Mobile dot representation) */}
                  <div className="mt-1 flex max-w-full flex-wrap justify-center gap-0.5 sm:hidden">
                    {(isLoading && isSelected ? [0, 1, 2] : monthlyDisplayPlans).map(
                      (plan, index) => (
                        <span
                          key={plan.id || index}
                          className={`bg-primary h-1.5 w-1.5 shrink-0 rounded-full ${
                            isLoading && isSelected ? 'animate-pulse opacity-40' : ''
                          }`}
                        />
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
