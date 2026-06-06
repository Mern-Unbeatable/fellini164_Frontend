import { Plus, Edit2, Trash2, LogIn, SquareArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import NewGoalModal from './components/NewGoalModal';
// import NewHabitsModal from '../Habits/NewHabitsModal';
import GoalProgressModal from './components/GoalProgressModal';

export default function ActiveGoals() {

const [modle, setModle] = useState(false);

const [modleProgress, setModleProgress] = useState(false);


  const handleOpenModal = () => setModle(true);
  const handleOpenModalProgress = () => setModleProgress(true);

const handleCloseModalProgress = () => setModleProgress(false);


  const handleCloseModal = () => setModle(false);

  const handleSavePlan = (data) => {
    console.log("Saved plan:", data);
    
  };


  const goals = [
    {
      id: 1,
      category: 'PERSONAL',
      categoryColor: 'bg-[#E7EBFF] text-[#3657FF]',
      title: 'Review Goals',
      date: 'Sun, Dec 14',
      current: 33,
      total: 100,
      progressColor: 'bg-purple-600'
    },
    {
      id: 2,
      category: 'FINANCE',
      categoryColor: 'bg-[#FEFCE8] text-[#CD8A04]',
      title: 'Save $10,000',
      progress: '8500 / 10000 USD',
      current: 65,
      total: 100,
      progressColor: 'bg-purple-600'
    },
    {
      id: 3,
      category: 'HEALTH',
      categoryColor: 'bg-[#F0FDF4] text-[#16A34A]',
      title: 'Run 500km',
      progress: '120 / 500 km',
      current: 65,
      total: 100,
      progressColor: 'bg-purple-600'
    }
  ];

  return (
    <div className=" min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl md:text-2xl  font-semibold text-gray-900 dark:text-white">Active Goals</h1>
          <button onClick={handleOpenModal} className="bg-purple-600  text-white font-medium py-2 md:py-3 px-2 rounded-lg flex items-center gap-2 transition ">
            <Plus size={20} />
            New Task
          </button>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <div key={goal.id} className="bg-white dark:bg-zinc-800  rounded-lg shadow-sm p-6 hover:shadow-md transition">
              {/* Category Header */}
              <div className="flex justify-between items-start mb-4">
                <span className={`text-xs  px-3 py-1 rounded ${goal.categoryColor}`}>
                  {goal.category}
                </span>
                <div className="flex gap-2">
                  <button className="text-gray-400 dark:text-white  p-1">
                    <Edit2 size={18} />
                  </button>
                  <button className="text-gray-400 dark:text-white  p-1">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Title */}
              <h3 className=" text-lg md:text-xl font-medium text-gray-900 dark:text-white mb-1">{goal.title}</h3>

              {/* Date/Progress Info */}
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                {goal.date || goal.progress}
              </p>

              {/* Progress Info */}
              <div className="mb-4">
                <p className="text-sm   mb-2 dark:text-white">
                  {goal.current}% Completed
                </p>
                {/* Progress Bar */}
                <div className="w-full bg-[#DBC7FF] dark:bg-[#45357A] rounded-full h-2 my-6">
                  <div
                    className={`${goal.progressColor} h-2 rounded-full`}
                    style={{ width: `${goal.current}%` }}
                  />
                </div>
              </div>

              {/* Log Daily Progress Button */}
              <button  onClick={handleOpenModalProgress} className="w-full bg-[#E0E5ED] hover:bg-gray-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-gray-700 dark:text-white font-semibold mt-8 py-3 rounded-lg flex items-center justify-center gap-2 transition">
                <SquareArrowUpRight size={18} />
                Log Daily Progress
              </button>
            </div>
          ))}
        </div>
      </div>
      <GoalProgressModal open={modleProgress}  onClose={handleCloseModalProgress} onSave={handleSavePlan} />
      <NewGoalModal onClose={handleCloseModal} onSave={handleSavePlan} open={modle}/>


    </div>
  );
}