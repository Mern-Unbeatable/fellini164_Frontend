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
  calendarDays,
  getFormattedDateString,
  isLoading,
  aiActionState,
  onAccept,
  onDismiss
}) {
  return (
    <div className="flex-1 flex flex-col">
      
      {viewMode === 'Daily' ? (
        <DailyView 
          currentDate={currentDate} 
          selectedDate={selectedDate} 
          isLoading={isLoading} 
          aiActionState={aiActionState} 
          onAccept={onAccept}
          onDismiss={onDismiss}
        />
      ) : viewMode === 'Weekly' ? (
        <WeeklyView 
          isLoading={isLoading} 
          aiActionState={aiActionState} 
        />
      ) : (
        <MonthlyView
          calendarDays={calendarDays}
          getFormattedDateString={getFormattedDateString}
          plans={plans}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          setViewMode={setViewMode}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}