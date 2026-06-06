import { useState } from 'react';
import { X, Calendar, Clock } from 'lucide-react';

export default function NewPlanModal({ open, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    startDate: '12/14/2025',
    dueDate: '12/14/2025',
    category: 'Work',
    priority: 'Medium',
    status: 'To Do',
    description: '',
  });

  if (!open) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#121111CC] p-4"
    >
      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-xl flex-col rounded-xl bg-white dark:bg-zinc-800  shadow-lg"
      >
        {/* ================= HEADER (FIXED) ================= */}
        <div className="sticky top-0 z-10 flex items-center justify-between  bg-white dark:bg-zinc-800  p-5 rounded-xl">
          <h2 className="text-xl font-bold text-gray-900  dark:text-gray-100">New Plan</h2>
          <button onClick={onClose} className="text-gray-600  dark:text-gray-200">
            <X size={24} />
          </button>
        </div>

        {/* ================= CONTENT (SCROLL) ================= */}
        <div className="flex-1 overflow-y-auto p-5 border-t  border-[#949ea3] dark:border-gray-700">
          {/* Title */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-gray-900  dark:text-gray-100">
              Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="e.g., Deep Work"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 bg-[#F8FBFE]  dark:bg-zinc-800 px-4 py-2 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none dark:text-gray-300"
            />
          </div>

          {/* Dates */}
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900  dark:text-gray-100">
                Start Date
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 bg-[#F8FBFE] dark:text-gray-400 dark:bg-zinc-800 dark:value: px-4 py-2 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none placeholder-gray-400 dark:placeholder-gray-100
  "
                />
                <Calendar
                  size={18}
                  className="absolute right-3 top-2.5 text-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900  dark:text-gray-100">
                Due Date
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 bg-[#F8FBFE] dark:text-gray-400 dark:text-gray-40 dark:bg-zinc-800 px-4 py-2 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                />
                <Clock
                  size={18}
                  className="absolute right-3 top-2.5 text-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Category & Priority */}
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900  dark:text-gray-100">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 bg-[#F8FBFE] dark:bg-zinc-800 px-4 py-2 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none dark:text-gray-400"
              >
                <option>Work</option>
                <option>Personal</option>
                <option>Health</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-gray-100">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 dark:text-gray-400 bg-[#F8FBFE] dark:bg-zinc-800 px-4 py-2 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>

          {/* Status */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-gray-100">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 bg-[#F8FBFE] dark:bg-zinc-800 px-4 py-2 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none dark:text-gray-400"
            >
              <option>To Do</option>
              <option>In Progress</option>
              <option>Done</option>
            </select>
          </div>

          {/* Description */}
          <div className="">
            <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-gray-100">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              placeholder="Add details"
              className="w-full resize-none rounded-md border border-gray-300 dark:text-gray-400 bg-[#F8FBFE] dark:bg-zinc-800 px-4 py-2 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* ================= FOOTER (FIXED) ================= */}
        <div className="sticky bottom-0  bg-white dark:bg-zinc-800 px-5 pb-5.5 rounded-xl">
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 rounded-md border border-gray-300 px-4 py-2 font-medium text-gray-700 dark:text-gray-400  "
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 rounded-md bg-[#7C3AED] px-4 py-2 font-medium text-white"
            >
              Save Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
