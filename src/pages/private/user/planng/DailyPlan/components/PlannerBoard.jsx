import React from 'react';
import DailyView from './DailyView';
import WeeklyView from './WeeklyView';
import MonthlyView from './MonthlyView';

export default function PlannerBoard({
  currentDate,
  selectedDate,
  setSelectedDate,
  viewMode,
  plans,
  calendarDays,
  getFormattedDateString
}) {
  return (
    <div className="flex-1 flex flex-col">
      {/* Calendar Month/Weekly/Daily Grid */}
      {viewMode === 'Daily' ? (
        <DailyView currentDate={currentDate} selectedDate={selectedDate} />
      ) : viewMode === 'Weekly' ? (
        <WeeklyView />
      ) : (
        <MonthlyView
          calendarDays={calendarDays}
          getFormattedDateString={getFormattedDateString}
          plans={plans}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      )}
    </div>
  );
}