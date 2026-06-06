import { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';

export default function NewGoalModal( { open, onClose, onSave }) {



  const [formData, setFormData] = useState({
    goalTitle: '',
    targetAmount: '',
    unit: '',
    currentProgress: '',
    deadline: '',
    category: 'Personal',
    description: ''
  });
  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    console.log('Form Data:', formData);
    onSave()
     onClose();

    // Handle save logic here
  };
  


  const handleCancel = () => {
    setFormData({
      goalTitle: '',
      targetAmount: '',
      unit: '',
      currentProgress: '',
      deadline: '',
      category: 'Personal',
      description: '',
         
    });
    onClose();
  };

  return (
  <div
  onClick={handleCancel}
  className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 sm:p-6 "
>
  {/* Modal */}
  <div
    onClick={(e) => e.stopPropagation()}
    className="flex max-h-[90vh] w-full max-w-xl flex-col  bg-white dark:bg-zinc-800 shadow-lg  rounded-2xl"
  >
    {/* ================= HEADER (FIXED) ================= */}
    <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white dark:border-zinc-500 dark:bg-zinc-800 p-6  rounded-t-lg ">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">New Goal</h2>
      <button
        onClick={handleCancel}
        className="text-gray-400 hover:text-gray-600 dark:text-white dark:hover:text-white transition-colors"
      >
        <X size={24} />
      </button>
    </div>

    {/* ================= FORM CONTENT (SCROLL) ================= */}
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">
      {/* Goal Title */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">
          Goal Title
        </label>
        <input
          type="text"
          name="goalTitle"
          placeholder="e.g. Save Money"
          value={formData.goalTitle}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 dark:border-zinc-500 bg-[#F8FBFE] dark:bg-zinc-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:placeholder:text-gray-300 dark:text-white"
        />
      </div>

      {/* Target & Unit */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">
            Target Amount
          </label>
          <input
            type="number"
            name="targetAmount"
            placeholder="100"
            value={formData.targetAmount}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 dark:border-zinc-500 bg-[#F8FBFE] dark:bg-zinc-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:placeholder:text-gray-300 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white  ">
            Unit
          </label>
          <div className="relative">
            <input
              type="text"
              name="unit"
              placeholder="e.g. USD, kg"
              value={formData.unit}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 dark:border-zinc-500 bg-[#F8FBFE] dark:bg-zinc-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:placeholder:text-gray-300 dark:text-white"
            />
            
          </div>
        </div>
      </div>

      {/* Progress & Deadline */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">
            Current Progress
          </label>
          <input
            type="number"
            name="currentProgress"
            placeholder="00"
            value={formData.currentProgress}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 dark:border-zinc-500 bg-[#F8FBFE] dark:bg-zinc-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:placeholder:text-gray-300 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">
            Deadline
          </label>
          <input
            type="text"
            name="deadline"
            placeholder="mm/dd/yyyy"
            value={formData.deadline}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 dark:border-zinc-500 bg-[#F8FBFE] dark:bg-zinc-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:placeholder:text-gray-300 dark:text-white"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">
          Category
        </label>
        <div className="relative">
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full appearance-none rounded-lg border border-gray-300 dark:border-zinc-500 bg-[#F8FBFE] dark:bg-zinc-700 px-4 py-2 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option>Personal</option>
            <option>Health</option>
            <option>Finance</option>
            <option>Education</option>
            <option>Other</option>
          </select>
          <ChevronDown
            size={18}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">
          Description
        </label>
        <textarea
          name="description"
          placeholder="Add details"
          value={formData.description}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 dark:border-zinc-500 bg-[#F8FBFE] dark:bg-zinc-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:placeholder:text-gray-300 dark:text-white"
        />
      </div>
    </div>

    {/* ================= FOOTER (FIXED) ================= */}
    <div className="sticky bottom-0 border-t border-gray-200 bg-white dark:border-zinc-500 dark:bg-zinc-800 p-6 rounded-b-lg">
      <div className="flex gap-3">
        <button
          onClick={handleCancel}
          className="flex-1 rounded-lg border border-gray-300 dark:border-zinc-500 px-4 py-2 font-semibold text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-700 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="flex-1 rounded-lg bg-purple-600 px-4 py-2 font-semibold text-white hover:bg-purple-700 transition"
        >
          Save Goal
        </button>
      </div>
    </div>
  </div>
</div>

  );
}