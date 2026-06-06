  import React, { useState, useEffect } from 'react';
  import { X } from 'lucide-react';

  const GoalProgressModal = ({ open, onClose, onSave, goalTitle = 'Read 24 Books' }) => {
    const [title, setTitle] = useState('');

    // Reset input when modal opens/closes
    useEffect(() => {
      if (!open) setTitle('');
    }, [open]);

    if (!open) return null;

  const handleSave = () => {
    if (!title.trim()) return;   
    console.log("Saving:", title); 
    onSave({ title });            
    setTitle('');                 
      onClose();
  };

    const handleCancel = () => {
      onClose();
    };

    return (
      <div  onClick={handleCancel} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 sm:p-6">
        {/* Modal Container */}
        <div  onClick={(e) => e.stopPropagation()} className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white dark:bg-zinc-700 dark:border-zinc-500 shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-xl font-medium text-gray-900 dark:text-white ">
             
            </h2>
            <button
              onClick={handleCancel}
              className="text-gray-400 transition-colors hover:text-gray-600 dark:text-white dark:hover:text-white"
              aria-label="Close modal"
            >
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>

          <div className="h-px w-full bg-gray-200 dark:bg-zinc-500" />

          {/* Form Body */}
          <div className="p-6">
            <div className="mb-6">
              <p className="mb-3 text-base text-gray-900 dark:text-white">
                Update progress for{' '}
                <span className="text-base md:text-lg font-medium">{goalTitle}.</span>
              </p>

              <label
                htmlFor="title"
                className="mb-2 block text-base font-semibold text-gray-700 dark:text-gray-300 my-6"
              >
                Goal Title
              </label>

              <input
                type="text"
                id="title"
                placeholder="e.g., Read 10 chapters"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-zinc-400 px-4 py-3 text-gray-700 bg-[#F8FBFE] dark:text-white
                dark:bg-zinc-700 placeholder:text-gray-400 dark:placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <p className=' text-sm py-1 text-[#5D5D5D] dark:text-white/80'>Current: 8 / 24 books</p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancel}
                className="rounded-lg border border-gray-400 px-6 py-2.5 font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:hover:bg-zinc-600 dark:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!title.trim()}
                className="rounded-lg bg-[#7C3AED] px-6 py-2.5 font-medium text-white transition-colors  "
              >
                Save Progress
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default GoalProgressModal;
