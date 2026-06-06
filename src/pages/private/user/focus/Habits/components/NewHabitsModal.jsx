import React, { useState } from 'react';
import { X } from 'lucide-react';

const NewHabitsModal = ({ open, onClose, onSave }) => {
  const [title, setTitle] = useState('');

  if (!open) return null;

  const handleSave = () => {
  
    onSave({ title });

    onClose();
  };

  const handleCancel = () => {
    
    onClose();
  };


 

  return (
    <div  onClick={handleCancel}  className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 bg-opacity-50 p-4 sm:p-6">
      {/* Modal Container */}
      <div  onClick={(e) => e.stopPropagation()}  className="w-full max-w-md bg-white dark:bg-zinc-800 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-500 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="text-lg md:text-xl  font-semibold text-gray-900 dark:text-white">New Plan</h2>
          <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600 dark:text-white dark:hover:text-gray-300 transition-colors">
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        <div className="h-px bg-gray-200 dark:bg-zinc-500 w-full" />

        {/* Form Body */}
        <div className="p-6">
          <div className="mb-6">
            <label htmlFor="title" className="block text-base font-semibold text-gray-900  dark:text-white mb-2">
               Title
            </label>
            <input
              type="text"
              id="title"
              placeholder="e.g., Drink 2L Water"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400  text-gray-700 dark:bg-zinc-800 dark:placeholder:text-gray-300 dark:text-white"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <button 
              onClick={handleCancel}
              className="px-6 py-2.5 border border-gray-400 dark:border-zinc-500 rounded-lg text-gray-600 dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              Save Habit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewHabitsModal;
