import React from 'react';

export default function MonthlyView({
  calendarDays,
  getFormattedDateString,
  plans,
  selectedDate,
  setSelectedDate
}) {
  return (
    <div className="flex-1 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 rounded-2xl overflow-hidden shadow-sm flex flex-col">
      {/* Weekday Names */}
      <div className="grid grid-cols-7 border-b border-gray-100 dark:border-zinc-800/80 gap-0">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName) => (
          <div 
            key={dayName} 
            className="py-3.5 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 border-r last:border-r-0 border-gray-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-900"
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
              onClick={() => setSelectedDate(new Date(dayObj.year, dayObj.month, dayObj.day))}
              className={`min-h-[120px] p-3 bg-white dark:bg-zinc-900 ${
                !isLastColumn ? 'border-r' : ''
              } ${
                isLastRow ? '' : 'border-b'
              } border-gray-100 dark:border-zinc-800/80 flex flex-col items-center hover:bg-gray-50/50 dark:hover:bg-zinc-800/20 cursor-pointer transition-colors`}
            >
              {/* Day Number */}
              <div className="flex justify-center mb-1.5">
                <span className={`text-xs font-semibold w-7 h-7 flex items-center justify-center rounded-lg transition-all ${
                  isSelected 
                    ? 'bg-purple-100/70 text-[#7C3AED] dark:bg-purple-950/40 dark:text-purple-400 font-bold' 
                    : dayObj.isCurrentMonth 
                      ? 'text-slate-600 dark:text-gray-300' 
                      : 'text-gray-300 dark:text-zinc-700'
                }`}>
                  {dayObj.day}
                </span>
              </div>
              
              {/* Plan Items */}
              <div className="w-full flex flex-col gap-1 mt-1 overflow-y-auto">
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
