import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Bell } from 'lucide-react';
import NewPlanModal from '../DailyPlan/components/NewPlanModal';

export default function WeeklyPlanner() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 11, 8));
  const [modle, setModle] = useState(false);
  const handleOpenModal = () => setModle(true);
  const handleCloseModal = () => setModle(false);

  const handleSavePlan = (data) => {
    console.log('Saved plan:', data);
  };

  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  const startDate = new Date(currentDate);
  startDate.setDate(startDate.getDate() - startDate.getDay() + 1);

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    return date;
  });

  const dateRange = `Dec${weekDates[0].getDate()}-Dec${weekDates[6].getDate()}`;

  const handlePrevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  return (
    <div className=" bg-[#EEEEEE] dark:bg-zinc-800">
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Weekly Plan</h1>
        </div>

        {/* Date Navigation */}
        <div className="mb-8 flex items-center justify-between ">
          <div className="flex items-center gap-2 md:gap-4">
            <button onClick={handlePrevWeek} className=" ">
              <ChevronLeft className="h-4 w-4 md:h-5 md:w-5  text-gray-700 dark:text-gray-200" />
            </button>
            <span className="text-lg font-medium text-gray-800 dark:text-gray-100">{dateRange}</span>
            <button onClick={handleNextWeek} className=" ">
              <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-gray-700 dark:text-gray-200" />
            </button>
          </div>
          <button
            onClick={handleOpenModal}
            className="flex  items-center justify-center gap-2 rounded-lg bg-[#7C3AED] px-4 py-2.5 md:px-5 md:py-3 text-sm font-semibold text-white sm:w-auto"
          >
            <Plus size={18} /> Add Plan
          </button>
        </div>

        {/* Week Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6 lg:grid-cols-7 lg:gap-8">
          {weekDates.map((date, index) => (
            <div
              key={index}
              className="flex min-h-62.5 flex-col overflow-hidden rounded-2xl  bg-white dark:bg-zinc-800  shadow-md md:h-130 lg:h-170"
            >
              {/* Day Header */}
              <div className="  bg-gray-100 dark:bg-zinc-700 p-4">
                <div className="text-center">
                  <div className="text-base font-medium tracking-wide text-gray-700 dark:text-gray-200 uppercase md:text-lg">
                    {days[index]}
                  </div>
                  <div className="mt-1 text-base text-gray-600 dark:text-gray-300">{date.getDate()} Plan</div>
                </div>
              </div>

              {/* Day Content (Scrolling Area) */}
              <div className="flex-1 overflow-y-auto bg-[#F4EEFF] dark:bg-[#1B1533]">
                {/* Is div mein aapke plans ya cards aayenge */}
            <p className="text-center text-xs text-gray-400 dark:text-gray-3  00 mt-4">
                    No plans
                 </p>
              </div>

              {/* Add Plan Button */}
              <button className="group flex w-full items-center justify-center gap-2
             0 bg-gray-100 dark:bg-zinc-700 py-3 text-gray-700 dark:text-gray-200 transition-all duration-300 md:py-4">
                <Plus className="h-4 w-4 transition-transform group-hover:scale-110" />
                <button onClick={handleOpenModal} className="text-base">Add Plan</button>
              </button>
            </div>
          ))}
        </div>
      </div>

       <NewPlanModal  open={modle}
              onClose={handleCloseModal}
              onSave={handleSavePlan}/>

    </div>
  );
}



