import React from 'react';
import DailyView from './DailyView';
import WeeklyView from './WeeklyView';
import MonthlyView from './MonthlyView';

export default function PlannerBoard({
  currentDate,
  selectedDate,
  setSelectedDate,
  viewMode,
  setViewMode,
  plans,
  hasAcceptedPlan,
  calendarDays,
  getFormattedDateString,
  isLoading,
  onCompleteItem,
}) {
  return (
    <div className="flex min-w-0 flex-col max-xl:flex-none xl:min-h-0 xl:flex-1">

      {viewMode === 'Daily' ? (
        <DailyView
          currentDate={currentDate}
          selectedDate={selectedDate}
          plans={plans}
          hasAcceptedPlan={hasAcceptedPlan}
          isLoading={isLoading}
          onCompleteItem={onCompleteItem}
        />
      ) : viewMode === 'Weekly' ? (
        <WeeklyView
          currentDate={currentDate}
          selectedDate={selectedDate}
          plans={plans}
          hasAcceptedPlan={hasAcceptedPlan}
          isLoading={isLoading}
        />
      ) : (
        <MonthlyView
          calendarDays={calendarDays}
          getFormattedDateString={getFormattedDateString}
          plans={plans}
          hasAcceptedPlan={hasAcceptedPlan}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          setViewMode={setViewMode}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}