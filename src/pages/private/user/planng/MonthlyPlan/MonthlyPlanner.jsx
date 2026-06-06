import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import NewPlanModal from '../DailyPlan/components/NewPlanModal';

export default function MonthlyPlanner() {
  const [modle, setModle] = useState(false);
  const handleOpenModal = () => setModle(true);
  const handleCloseModal = () => setModle(false);

  const handleSavePlan = (data) => {
    console.log('Saved plan:', data);
  };

  const days = [
    { date: null }, { date: 1 }, { date: 2 }, { date: 3 }, { date: 4 }, { date: 5 }, { date: 6 },
    { date: 7 }, { date: 8 }, { date: 9 }, { date: 10 }, { date: 11 }, { date: 12 }, { date: 13 },
    { date: 14 }, { date: 15 }, { date: 16 }, { date: 17 }, { date: 18 }, { date: 19 }, { date: 20 },
    { date: 21 }, { date: 22 }, { date: 23 }, { date: 24 }, { date: 25 }, { date: 26 }, { date: 27 },
    { date: 28 }, { date: 29 }, { date: 30 }, { date: 31 },
  ];

  const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  return (
    <div className=" sm:p-6 lg:p-8">
      <div className="container mx-auto">
        <h2 className="py-2 text-2xl font-semibold dark:text-gray-100">Monthly</h2>

        {/* Header */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 sm:mb-8 sm:gap-4">
          <div className="flex items-center gap-2">
            <button className="p-2 dark:text-gray-100">
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-lg font-semibold sm:text-xl dark:text-gray-100">
              December 2025
            </h1>
            <button className="p-2 dark:text-gray-100">
              <ChevronRight size={20} />
            </button>
          </div>

          <button
            onClick={handleOpenModal}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#7C3AED] px-4 py-2 text-white  sm:w-auto"
          >
            <Plus size={18} />
            Add Plan
          </button>
        </div>

        {/* Calendar */}
        <div className="overflow-x-auto">
          <div className="min-w-[60px] sm:min-w-[900px]">
            {/* Weekdays */}
            <div className="grid grid-cols-7 gap-0 pb-0.5">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="rounded-sm bg-white dark:bg-zinc-800 py-2 text-center text-sm font-semibold text-gray-600 dark:text-gray-200 sm:py-3"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7 gap-0.5">
              {days.map((day, idx) => {
                const isHighlighted =
                  day.date && day.date >= 8 && day.date <= 14;

                return (
                  <div
                    key={idx}
                    className={`
                      min-h-[50px] sm:min-h-[110px] lg:min-h-[130px]
                      p-1 sm:p-3
                      rounded-lg
                      text-sm sm:text-base md:text-lg
                      shadow-sm
                      transition-all
                      flex items-center md:items-start justify-center md:justify-start

                      ${isHighlighted ? 'bg-[#F7F3FF]   dark:bg-[#3C3166]' : 'bg-white dark:bg-zinc-800'}  '}
                      ${day.date ? 'cursor-pointer' : 'bg-transparent shadow-none'}
                    `}
                  >
                    {day.date && (
                      <span className="font-medium text-gray-800  dark:text-gray-200">
                        {String(day.date).padStart(2, '0')}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <NewPlanModal
        open={modle}
        onClose={handleCloseModal}
        onSave={handleSavePlan}
      />
    </div>
  );
}
