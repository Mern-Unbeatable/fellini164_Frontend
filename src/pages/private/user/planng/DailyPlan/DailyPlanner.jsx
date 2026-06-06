import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Check } from 'lucide-react';
import NewPlanModal from './components/NewPlanModal';
// import NewPlanModal from "../../../public/public_modle/components/NewPlanModal";

export default function DailyPlanner() {
  const [modle, setModle] = useState(false);
  const handleOpenModal = () => setModle(true);
  const handleCloseModal = () => setModle(false);

  const handleSavePlan = (data) => {
    console.log('Saved plan:', data);
  };
  const scheduleItems = Array.from({ length: 6 });

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Review Goals',
      time: '09:00',
      done: true,
      tag: 'Work',
      tagStyle: 'bg-green-100 text-green-600',
    },
    {
      id: 2,
      title: 'Review Goals',
      time: '09:00',
      done: true,
      tag: 'Work',
      tagStyle: 'bg-green-100 text-green-600',
    },
    {
      id: 3,
      title: 'Review Goals',
      time: '11:00',
      done: false,
      tag: 'Processing',
      tagStyle: 'bg-yellow-100 text-yellow-700',
    },
    {
      id: 4,
      title: 'Review Goals',
      time: '11:00',
      done: false,
      tag: 'Processing',
      tagStyle: 'bg-yellow-100 text-yellow-700',
    },
    {
      id: 5,
      title: 'Review Goals',
      time: '11:00',
      done: false,
      tag: 'Processing',
      tagStyle: 'bg-yellow-100 text-yellow-700',
    },
  ]);

  const toggleTask = (id) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, done: !task.done } : task)));
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="">
        {/* Header */}
        <h1 className="text-xl font-semibold sm:text-2xl dark:text-gray-100">Daily </h1>

        {/* Date Bar */}
        <div className="flex flex-col items-start justify-between gap-6 py-4 lg:flex-row lg:py-7.5">
          <div className="flex w-full items-center justify-center gap-4 lg:justify-start">
            <ChevronLeft className="cursor-pointer text-[#141B34] dark:text-gray-300" />
            <div className="text-center">
              <h3 className="text-lg font-semibold sm:text-xl dark:text-gray-200">
                5 Plans Scheduled
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-300">Sunday, December 14</p>
            </div>
            <ChevronRight className="cursor-pointer text-[#141B34] dark:text-gray-100" />
          </div>

          <div className="flex w-full items-center justify-end gap-4">
            <button className="w-full rounded-lg border border-[#868686] px-5 py-3 text-sm font-semibold sm:w-auto dark:text-gray-100">
              Today
            </button>
            <button
              onClick={handleOpenModal}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#7C3AED] px-5 py-3.5 text-sm font-semibold text-white sm:w-auto"
            >
              <Plus size={18} /> Add Plan
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-6 xl:flex-row">
          {/* Schedule */}
          <div className="flex-1 space-y-8 rounded-3xl bg-white p-4 shadow-sm sm:p-6 dark:bg-zinc-800">
            {scheduleItems.map((_, i) => (
              <div
                key={i}
                className="flex flex-col gap-2 border-t-2 border-dashed border-gray-300 pt-6 sm:flex-row sm:items-center sm:gap-16 dark:border-gray-700"
              >
                <span className="w-20 text-sm text-gray-600 dark:text-gray-300">07:00 am</span>

                <div className="flex-1">
                  <div className="flex items-center justify-between rounded-lg border-l-4 border-violet-600 bg-[#F0E6FF] p-4 dark:bg-[#5D5669]">
                    <div>
                      <h4 className="text-sm font-bold dark:text-gray-100">Morning Meditation</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-200">
                        Focus on breathing.
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                      09:00
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tasks */}
          <div className="w-full rounded-2xl bg-white p-4 shadow-sm sm:p-6 xl:w-120 dark:bg-zinc-800">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold sm:text-xl dark:text-gray-100">Tasks List</h3>
              <span className="rounded-lg bg-[#ece9ff] px-3 py-1 text-xs font-bold text-violet-600">
                {tasks.length.toString().padStart(2, '0')}
              </span>
            </div>

            <div className="space-y-3">
              {tasks.map((t) => (
                <div
                  key={t.id}
                  className={`flex gap-3 rounded-xl p-4 transition-all ${
                    t.done ? 'bg-[#ece9ff] dark:bg-[#61585e]' : 'bg-pink-50 dark:bg-[#5d5669]'
                  }`}
                >
                  {/* Checkbox */}
                  <div
                    onClick={() => toggleTask(t.id)}
                    className={`mt-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-md border-2 transition-colors ${
                      t.done
                        ? 'border-[#5415a1] dark:border-[#6b0edd]'
                        : 'border-gray-300 dark:border-[#5d05c9]'
                    } `}
                  >
                    {t.done && (
                      <Check
                        size={14}
                        className="stroke-[3px] text-[#5415a1] dark:text-[#653a99]"
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h4
                      className={`text-base font-bold sm:text-lg ${
                        t.done
                          ? 'text-gray-600 line-through dark:text-gray-100 '
                          : 'text-slate-800 dark:text-gray-100'
                      }`}
                    >
                      {t.title}
                    </h4>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="rounded bg-[#F3F4F6] px-2 py-0.5 text-sm font-bold text-gray-400 dark:text-gray-600">
                        {t.time}
                      </span>
                      <span className={`rounded px-2 py-0.5 text-sm font-bold ${t.tagStyle}`}>
                        {t.tag}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <NewPlanModal open={modle} onClose={handleCloseModal} onSave={handleSavePlan} />
    </div>
  );
}
