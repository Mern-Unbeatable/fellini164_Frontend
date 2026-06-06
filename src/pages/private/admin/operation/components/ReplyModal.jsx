import React, { useState } from 'react';
import { X } from 'lucide-react';

const ReplyModal = ( {open, onClose, onSave}) => {
  const [isResolved, setIsResolved] = useState(true);


    if (!open) return null;

  const handleSave = () => {
  
    onSave();

    onClose();
  };

  return (
    <div onClick={onClose}  className="fixed inset-0 z-50 flex items-center justify-center bg-black/40  dark:bg-black/60 p-4">
      {/* Modal Container */}
      <div  onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-zinc-800  rounded-xl shadow-lg w-full max-w-[500px] overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Reply To John Doe</h2>
          <button onClick={onClose} className="text-slate-400  dark:text-slate-100  transition-colors">
            <X size={24} />
          </button>
        </div>

        <hr className="border-slate-100 dark:border-gray-500" />

        <div className="p-6 space-y-5">
          {/* Subject Box */}
          <div className="bg-[#F9FAFB]  dark:bg-zinc-800  border border-[#E5E7EB] dark:border-gray-500 rounded-lg px-4 py-2">
            <p className="font-medium text-[#000000] dark:text-gray-100">
              Subject: AI keeps repeating itself.
            </p>
            <p className="text-xs text-[#5D5D5D] dark:text-gray-200 uppercase tracking-wider">
              Ticket ID: T-101
            </p>
          </div>

          {/* Reply Textarea */}
          <div className="space-y-2">
            <label className="block font-bold text-[#000000] dark:text-white">Your Reply</label>
            <textarea
              rows={5}
              className="w-full border border-slate-300 dark:border-gray-500  rounded-md p-3 text-[#5D5D5D] focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none resize-none placeholder:text-slate-400"
              placeholder="Type your response here."
            ></textarea>
          </div>

          {/* Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="resolved"
              checked={isResolved}
              onChange={() => setIsResolved(!isResolved)}
              className="w-4 h-4 text-blue-600   border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="resolved" className="text-slate-800 font-medium cursor-pointer dark:text-white">
              Mark ticket as Resolved
            </label>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end space-x-3 pt-2">
            <button onClick={onClose} className="px-8 py-2.5 border border-slate-400 rounded-md font-medium text-slate-700 dark:text-slate-200  transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} className="px-4 md:px-8 py-2.5 bg-[#7C3AED]  text-white dark:text-slate-100 rounded-md font-medium transition-colors">
              Add Member
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReplyModal;