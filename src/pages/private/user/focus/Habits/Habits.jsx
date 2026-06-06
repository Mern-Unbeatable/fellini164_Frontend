import React, { useState } from 'react';
import { Flame, Plus, Trash2 } from 'lucide-react';
import NewHabitsModal from './components/NewHabitsModal';

export default function Habits() {
  const [modal, setModal] = useState(false);

  const handleOpenModal = () => setModal(true);
  const handleCloseModal = () => setModal(false);

  const handleSavePlan = (data) => {
    console.log('Saved plan:', data);
  };

  const [tasks, setTasks] = useState([
    {
      id: 1,
      name: 'Drink 2L Water',
      streak: 12,
      bg: 'bg-[#EDFFE9] dark:bg-[#1F3326]',
      checkedDays: [1, 3, 4, 6, 7],
      checked: false,
    },
    {
      id: 2,
      name: 'Read 30 mins',
      streak: 8,
      bg: 'bg-[#E9F4FF] dark:bg-[#1A2A3D]',
      checkedDays: [1, 2, 3, 4, 5, 7],
      checked: false,
    },
    {
      id: 3,
      name: 'No Sugar',
      streak: 12,
      bg: 'bg-[#FFE9E9] dark:bg-[#3F1A1A]',
      checkedDays: [1, 3, 4, 5, 7],
      checked: true,
    },
  ]);

  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const toggleCheck = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, checked: !task.checked } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="min-h-screen  p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex items-start justify-between gap-4 sm:items-center">
        <h1 className="text-xl md:text-2xl font-semibold text-black dark:text-white">Tasks Board</h1>
        <button
          onClick={handleOpenModal}
          className="flex items-center gap-2 rounded-lg bg-purple-600 px-2 md:px-6 py-2 font-semibold text-white hover:bg-purple-700"
        >
          <Plus size={20} /> New Task
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-x-auto rounded-lg bg-white dark:bg-zinc-800 shadow-sm sm:block">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-200 dark:border-zinc-500">
              <th className="px-6 py-4 text-left text-lg text-gray-700 dark:text-white">
                HABIT NAME
              </th>
              <th className="px-6 py-4 text-left  text-gray-700 dark:text-white">
                STREAK
              </th>
              {days.map((day, i) => (
                <th
                  key={i}
                  className=" py-4 text-center font-semibold text-gray-700 dark:text-white"
                >
                  {day}
                </th>
              ))}
              <th className="px-6 py-4 text-right font-semibold text-gray-700 dark:text-white">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {tasks.map((task) => (
              <tr
                key={task.id}
                className="border-b border-gray-200 hover:bg-gray-50 dark:border-zinc-500 dark:hover:bg-zinc-700"
              >
                <td className="px-6 py-4 text-lg  text-gray-900 dark:text-white">
                  {task.name}
                </td>

                <td className=" py-4">
                  <div className="flex ">
                    <span
                      className={`flex items-center justify-center gap-2 
      w-[110px] h-[44px] 
      rounded-full font-bold text-lg text-black dark:text-white ${task.bg}`}
                    >
                      {String(task.streak).padStart(2, '0')}
                      {/* <Flame className="text-orange-500" size={20} /> */}
                    </span>
                  </div>
                </td>

                {days.map((_, dayIdx) => (
                  <td key={dayIdx} className=" py-4 text-center">
                    <div
                      className={`mx-auto h-8 w-8 rounded-md ${task.checkedDays.includes(dayIdx + 1)
                        ? 'bg-green-500 dark:bg-[#166534]'
                        : 'bg-gray-200 dark:bg-[#4B5563]'
                        }`}
                    />
                  </td>
                ))}

                <td className="flex items-center justify-end gap-2 px-6 py-4">
                  <button
                    onClick={() => toggleCheck(task.id)}
                    className={`rounded-full px-4 py-1.5 text-sm font-semibold ${task.checked
                      ? 'bg-pink-100 text-pink-700 hover:bg-pink-200'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                      }`}
                  >
                    {task.checked ? 'Undo' : 'Check In'}
                  </button>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-gray-400 hover:text-red-500 dark:text-white dark:hover:text-red-500"
                  >
                    <Trash2 size={22} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-4 sm:hidden">
        {tasks.map((task) => (
          <div key={task.id} className="rounded-lg bg-white dark:bg-zinc-800 p-4 shadow">
            <div className="mb-2 flex items-center justify-between ">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                {task.name}
              </h2>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-gray-400 hover:text-red-500 dark:text-white dark:hover:text-red-500"
              >
                <Trash2 size={18} />
              </button>
            </div>
            <div className="mb-3 flex items-center gap-2 ">
              <span
                className={`flex items-center justify-center gap-2 w-[110px] h-[44px]  rounded-full font-bold text-lg text-black dark:text-white ${task.bg}`}
              >
                {String(task.streak).padStart(2, '0')}
                {/* <Flame className="text-orange-500" size={20} /> */}
              </span>
            </div>

            <div className="mb-3 flex gap-2">
              {days.map((day, dayIdx) => (
                <div
                  key={dayIdx}
                  className={`flex h-8 w-8 items-center justify-center rounded-md text-white ${task.checkedDays.includes(dayIdx + 1)
                     ? 'bg-green-500 dark:bg-[#166534]'
                        : 'bg-gray-200 dark:bg-[#4B5563]'
                    }`}
                >
                  {day}
                </div>
              ))}
            </div>

            <button
              onClick={() => toggleCheck(task.id)}
              className={`w-full rounded-full py-2 text-base ${task.checked
                ? 'bg-pink-100 text-pink-700 hover:bg-pink-200'
                : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
            >
              {task.checked ? 'Undo' : 'Check In'}
            </button>
          </div>
        ))}
      </div>

      <NewHabitsModal
        open={modal}
        onClose={handleCloseModal}
        onSave={handleSavePlan}
      />
    </div>
  );
}
