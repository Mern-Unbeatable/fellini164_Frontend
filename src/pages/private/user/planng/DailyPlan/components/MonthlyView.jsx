import React from 'react';

export default function MonthlyView({
  calendarDays,
  getFormattedDateString,
  plans,
  selectedDate,
  setSelectedDate,
  setViewMode
}) {
  return (
    <div className="flex-1 bg-white dark:bg-zinc-900 border border-[#F2F2F2] dark:border-zinc-800/80 rounded-2xl overflow-hidden shadow-sm flex flex-col">
      {/* Weekday Names */}
      <div className="grid grid-cols-7 border-b border-gray-100 dark:border-zinc-800/80 gap-0">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName) => (
          <div 
            key={dayName} 
            className="py-2 sm:py-3.5 text-center text-xs font-medium text-[#5D5D5D] dark:text-gray-400 border-r last:border-r-0 border-gray-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-900"
          >
            {dayName}
          </div>
        ))}
      </div>

      {/* Calendar Cells */}
      <div className="grid grid-cols-7 flex-1 gap-0 bg-gray-50/5 dark:bg-zinc-900/5">
        {calendarDays.map((dayObj, index) => {
          const formattedDate = getFormattedDateString(dayObj);
          const dayPlans = plans[formattedDate] || [];
          const isSelected = selectedDate.getDate() === dayObj.day && 
                             selectedDate.getMonth() === dayObj.month && 
                             selectedDate.getFullYear() === dayObj.year;
          
          const isLastRow = index >= calendarDays.length - 7;
          const isLastColumn = (index + 1) % 7 === 0;

          return (
            <div 
              key={index}
              onClick={() => {
                setSelectedDate(new Date(dayObj.year, dayObj.month, dayObj.day));
                if (setViewMode) {
                  setViewMode('Daily');
                }
              }}
              className={`min-h-[50px] sm:min-h-[120px] p-1 sm:p-3 bg-white dark:bg-zinc-900 ${
                !isLastColumn ? 'border-r' : ''
              } ${
                isLastRow ? '' : 'border-b'
              } border-gray-100 dark:border-zinc-800/80 flex flex-col items-center hover:bg-gray-50/50 dark:hover:bg-zinc-800/20 cursor-pointer transition-colors`}
            >
              {/* Day Number */}
              <div className="flex justify-center mb-0.5 sm:mb-1.5">
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
              
              {/* Plan Items (Desktop) */}
              <div className="w-full hidden sm:flex flex-col gap-1 mt-1 overflow-y-auto">
                {dayPlans.map((plan) => (
                  <div 
                    key={plan.id}
                    className="w-full text-center text-[10px] py-1.5 px-2 bg-white dark:bg-zinc-800 text-slate-700 dark:text-gray-300 border border-gray-100 dark:border-zinc-800 rounded-lg shadow-sm truncate font-medium hover:border-violet-300 dark:hover:border-violet-700 transition-colors"
                    title={plan.title}
                  >
                    {plan.title}
                  </div>
                ))}
              </div>

              {/* Plan Indicators (Mobile dot representation) */}
              <div className="flex sm:hidden gap-0.5 mt-1 justify-center flex-wrap max-w-full">
                {dayPlans.map((plan) => (
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
    </div>
  );
}
