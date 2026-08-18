import React from 'react';
import { Check } from 'lucide-react';

const TodayFocusTasks = ({ tasks, checkedTasks, toggleTask, doneCount, plannedLabel }) => {
  return (
    <div className="rounded-2xl border border-[#f2f2f2] bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800 sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-semibold text-[#181818] dark:text-white">Today&apos;s schedule</h2>
          <p className="mt-0.5 text-[12px] font-medium text-[#a3a3a3] dark:text-zinc-400">
            {tasks.length} {tasks.length === 1 ? 'item' : 'items'} · {plannedLabel}
          </p>
        </div>
        <span className="shrink-0 rounded-md bg-[#f9f4ff] px-2 py-1 text-[11px] font-medium text-[#8022fe] dark:bg-purple-950/40 dark:text-purple-300">
          {doneCount} of {tasks.length} done
        </span>
      </div>

      <div className="space-y-2.5">
        {tasks.map((task) => {
          const done = Boolean(checkedTasks[task.id]);
          return (
            <button
              key={task.id}
              type="button"
              onClick={() => toggleTask(task.id)}
              className="flex w-full items-start gap-3 rounded-xl border border-[#f2f2f2] bg-[#fcfcfc] px-3 py-3 text-left transition hover:bg-white dark:border-zinc-700 dark:bg-zinc-900/40 dark:hover:bg-zinc-900/70"
            >
              <span
                className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-[5px] border ${
                  done
                    ? 'border-[#8022fe] bg-[#8022fe] text-white'
                    : 'border-[#d4d4d4] bg-white dark:border-zinc-600 dark:bg-zinc-800'
                }`}
              >
                {done && <Check size={11} strokeWidth={3} />}
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-[14px] font-medium leading-snug ${
                    done
                      ? 'text-[#a3a3a3] line-through dark:text-zinc-500'
                      : 'text-[#181818] dark:text-white'
                  }`}
                >
                  {task.title}
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[12px] font-medium text-[#a3a3a3] dark:text-zinc-400">
                  <span>
                    {task.time} · {task.duration}
                  </span>
                  <span>·</span>
                  <span>{task.category}</span>
                  {task.extra && (
                    <>
                      <span>·</span>
                      {task.extraIsPriority ? (
                        <span className="rounded-md bg-[#f2f2f2] px-1.5 py-0.5 text-[11px] text-[#8a8a8a] dark:bg-zinc-700 dark:text-zinc-300">
                          {task.extra}
                        </span>
                      ) : (
                        <span>{task.extra}</span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TodayFocusTasks;
