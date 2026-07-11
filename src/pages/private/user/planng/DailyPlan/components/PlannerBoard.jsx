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
  onAccept,
  onDismiss
}) {
  return (
    <div className="flex-1 flex flex-col">

      {viewMode === 'Daily' ? (
        <DailyView
          currentDate={currentDate}
          selectedDate={selectedDate}
          plans={plans}
          hasAcceptedPlan={hasAcceptedPlan}
          isLoading={isLoading}
          onAccept={onAccept}
          onDismiss={onDismiss}
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