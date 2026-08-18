import React from 'react';
import { Check } from 'lucide-react';

const HabitTracker = ({ habits, checkedHabits, toggleHabit, shownOf, todayPercent }) => {
  const completedToday = Object.values(checkedHabits).filter(Boolean).length;

  return (
    <div className="rounded-2xl border border-[#f2f2f2] bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800 sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-semibold text-[#181818] dark:text-white">Habits</h2>
          <p className="mt-0.5 text-[12px] font-medium text-[#a3a3a3] dark:text-zinc-400">
            {habits.length} of {shownOf} shown ·{' '}
            {completedToday === 0 ? 'none completed today' : `${completedToday} completed today`}
          </p>
        </div>
        <span className="shrink-0 rounded-md bg-[rgba(249,115,22,0.08)] px-2 py-1 text-[11px] font-medium text-[#f97316] dark:bg-orange-950/40 dark:text-orange-300">
          {todayPercent}% today
        </span>
      </div>

      <div className="space-y-2.5">
        {habits.map((habit) => {
          const done = Boolean(checkedHabits[habit.id]);
          return (
            <button
              key={habit.id}
              type="button"
              onClick={() => toggleHabit(habit.id)}
              className="flex w-full items-center gap-3 rounded-xl border border-[#f2f2f2] bg-[#fcfcfc] px-3 py-3 text-left transition hover:bg-white dark:border-zinc-700 dark:bg-zinc-900/40 dark:hover:bg-zinc-900/70"
            >
              <span
                className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border ${
                  done
                    ? 'border-[#8022fe] bg-[#8022fe] text-white'
                    : 'border-[#d4d4d4] bg-white dark:border-zinc-600 dark:bg-zinc-800'
                }`}
              >
                {done && <Check size={10} strokeWidth={3.5} />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-medium text-[#181818] dark:text-white">
                  {habit.title}
                </p>
                <p className="mt-0.5 text-[12px] font-medium text-[#a3a3a3] dark:text-zinc-400">
                  {habit.category} · {habit.progress} · streak {habit.streak}
                </p>
              </div>
              <div className="flex shrink-0 items-end gap-0.5">
                {[8, 12, 7, 14].map((h, i) => (
                  <span
                    key={i}
                    className="w-1.5 rounded-full bg-[#e9e9e9] dark:bg-zinc-600"
                    style={{ height: `${h}px` }}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default HabitTracker;
