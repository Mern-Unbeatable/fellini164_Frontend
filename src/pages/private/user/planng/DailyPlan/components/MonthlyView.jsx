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

function MonthGhostPlanItem({ title }) {
  return (
    <div className="group relative w-full shrink-0 overflow-hidden rounded-lg bg-white py-1.5 px-2 transition-all duration-200 hover:bg-[#fcfcfc] dark:bg-zinc-800 dark:hover:bg-zinc-800/90">
      <MonthGhostFieldBorder />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 rounded-lg opacity-0 transition-opacity group-hover:opacity-100"
        style={{ boxShadow: 'inset 0 0 0 1px #f2f2f2' }}
      />
      <p
        className="relative z-[1] truncate text-center text-[12px] font-medium leading-[1.5] text-[#181818] opacity-40 transition-opacity group-hover:opacity-100 dark:text-gray-300"
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
  setViewMode
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
    <div className="flex min-h-0 flex-1 flex-col bg-white dark:bg-zinc-900 border border-[#F2F2F2] dark:border-zinc-800/80 rounded-2xl overflow-hidden shadow-sm max-xl:h-auto max-xl:flex-none">
      {/* Weekday Names */}
      <div className="grid grid-cols-7 border-b border-gray-100 dark:border-zinc-800/80 gap-0 shrink-0">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName) => (
          <div
            key={dayName}
            className="py-2 sm:py-3.5 text-center text-xs font-medium text-[#5D5D5D] dark:text-gray-400 border-r last:border-r-0 border-gray-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-900"
          >
            {dayName}
          </div>
        ))}
      </div>

      {/* Calendar Cells — each week is its own grid row, sized independently so a busy day
          grows only its own week; a full border per cell (card look) replaces shared
          grid-lines since those only look right when every row is the same height. The whole
          list scrolls internally so an unusually tall week never clips the weeks below it. */}
      <div className="scrollbar-white flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto bg-gray-50/5 p-1.5 dark:bg-zinc-900/5 sm:gap-2 sm:p-2 max-xl:max-h-[min(70vh,560px)] xl:min-h-0">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {week.map((dayObj) => {
              const formattedDate = getFormattedDateString(dayObj);
              const dayPlans = plans[formattedDate] || [];
              // Monthly is a compact overview — show up to 3 non-habit tasks (Figma May 13).
              const monthlyDisplayPlans = dayPlans
                .filter((plan) => plan.kind !== 'habit' && plan.layout !== 'half')
                .slice(0, 3);
              const isSelected = selectedDate.getDate() === dayObj.day &&
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
                  className="flex min-h-12.5 flex-col items-center overflow-hidden rounded-lg border border-gray-100 bg-white p-1 transition-colors hover:border-violet-200 hover:bg-gray-50/50 dark:border-zinc-800/80 dark:bg-zinc-900 dark:hover:border-violet-800 dark:hover:bg-zinc-800/20 sm:h-30 sm:max-h-30 sm:rounded-xl sm:p-3 cursor-pointer"
                >
                  {/* Day Number */}
                  <div className="mb-0.5 flex shrink-0 justify-center sm:mb-1.5">
                    <span className={`text-xs font-medium w-5 h-5 sm:w-7 sm:h-7 flex items-center justify-center rounded-md sm:rounded-lg transition-all ${
                      isSelected
                        ? 'bg-purple-100/70 text-primary dark:bg-purple-950/40 dark:text-purple-400 font-bold'
                        : dayObj.isCurrentMonth
                          ? 'text-slate-600 dark:text-gray-300'
                          : 'text-gray-300 dark:text-zinc-700'
                    }`}>
                      {dayObj.day}
                    </span>
                  </div>

                  {/* Plan Items (Desktop) — clipped inside fixed cell height */}
                  <div className="mt-1 hidden w-full min-h-0 flex-1 flex-col gap-1 overflow-hidden sm:flex">
                    {monthlyDisplayPlans.map((plan) =>
                      hasAcceptedPlan ? (
                        <div
                          key={plan.id}
                          className="w-full text-center text-[10px] py-1.5 px-2 bg-white dark:bg-zinc-800 text-slate-700 dark:text-gray-300 border border-gray-100 dark:border-zinc-800 rounded-lg shadow-sm truncate font-medium hover:border-violet-300 dark:hover:border-violet-700 transition-colors"
                          title={plan.title}
                        >
                          {plan.title}
                        </div>
                      ) : (
                        <MonthGhostPlanItem key={plan.id} title={plan.title} />
                      )
                    )}
                  </div>

                  {/* Plan Indicators (Mobile dot representation) */}
                  <div className="flex sm:hidden gap-0.5 mt-1 justify-center flex-wrap max-w-full">
                    {monthlyDisplayPlans.map((plan) => (
                      <span
                        key={plan.id}
                        className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"
                      />
                    ))}
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
