import React from 'react';
import { Zap, Check, Flame } from 'lucide-react';

const HabitTracker = ({ habits, checkedHabits, toggleHabit }) => {
  return (
    <div className="rounded-2xl border border-[#f2f2f2] bg-[#fcfcfc] p-5 dark:border-zinc-700 dark:bg-zinc-800">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-[14px] font-semibold text-[#181818] lg:text-[13px] dark:text-white">
            Habit Tracker
          </h2>
          <p className="mt-0.5 text-[11px] text-[#a3a3a3] dark:text-zinc-400">
            Quick update today's habits
          </p>
        </div>
        <Zap size={14} className="fill-yellow-500 text-yellow-500" />
      </div>

      <div className="space-y-2.5">
        {habits.map((habit) => (
          <div
            key={habit.id}
            onClick={() => toggleHabit(habit.id)}
            className="flex cursor-pointer items-center justify-between rounded-xl border border-[#f2f2f2] bg-white p-3 transition hover:shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] dark:border-zinc-700/50 dark:bg-zinc-900/50"
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border transition duration-150 ${
                  checkedHabits[habit.id]
                    ? 'border-emerald-500 bg-emerald-500 text-white'
                    : 'border-gray-300 dark:border-zinc-600'
                }`}
              >
                {checkedHabits[habit.id] && <Check size={10} strokeWidth={3.5} />}
              </div>
              <span className="text-[13px] font-medium text-[#181818] dark:text-gray-200">
                {habit.title}
              </span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                {habit.streak + (checkedHabits[habit.id] ? 1 : 0)}
              </span>
              <span className="text-yellow-500">
                <Flame size={14} className="fill-yellow-500/20" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HabitTracker;
