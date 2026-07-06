import React from 'react';
import { Target, Check, Clock } from 'lucide-react';

const TodayFocusTasks = ({ tasks, checkedTasks, toggleTask }) => {
  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-[#f2f2f2] bg-[#fcfcfc] p-5 dark:border-zinc-700 dark:bg-zinc-800">
      <div>
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="flex items-center gap-2 text-[16px] font-semibold text-[#181818] lg:text-[14px] dark:text-white">
              <Target size={16} className="shrink-0 text-[#8022fe]" />
              <span>Today's Focus Tasks</span>
            </h2>
            <p className="mt-0.5 text-[11px] text-[#a3a3a3] dark:text-zinc-400">
              High-priority tasks scheduled for today
            </p>
          </div>
          <span className="shrink-0 rounded-md bg-[#f9f4ff] px-2.5 py-1 text-[12px] font-medium whitespace-nowrap text-[#8022fe] dark:bg-zinc-700 dark:text-gray-300">
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>

        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`flex cursor-pointer items-center justify-between rounded-xl border p-3.5 transition-all duration-200 ${
                checkedTasks[task.id]
                  ? 'border-[#f2f2f2] bg-white opacity-60 dark:border-zinc-700/30 dark:bg-zinc-900/30'
                  : 'border-[#f2f2f2] bg-white hover:border-[#8022fe]/30 hover:shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] dark:border-zinc-700/50 dark:bg-zinc-900/50'
              }`}
            >
              <div className="flex min-w-0 items-center gap-3.5">
                <div
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition duration-150 ${
                    checkedTasks[task.id]
                      ? 'border-[#8022fe] bg-[#8022fe] text-white'
                      : 'border-gray-300 dark:border-zinc-600'
                  }`}
                >
                  {checkedTasks[task.id] && <Check size={12} strokeWidth={3} />}
                </div>
                <div className="min-w-0">
                  <h3
                    className={`truncate text-[14px] font-medium transition duration-150 lg:text-[13px] dark:text-gray-200 ${
                      checkedTasks[task.id]
                        ? 'text-gray-400 line-through dark:text-gray-500'
                        : 'text-[#181818]'
                    }`}
                  >
                    {task.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="flex items-center gap-1 text-[11px] text-[#a3a3a3] dark:text-zinc-500">
                      <Clock size={10} /> {task.time} ({task.duration})
                    </span>
                  </div>
                </div>
              </div>

              <span
                className={`rounded-[6px] px-2 py-0.5 text-[10px] font-semibold ${
                  task.category === 'Wellness'
                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400'
                    : task.category === 'Work'
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400'
                      : 'bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400'
                }`}
              >
                {task.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodayFocusTasks;
