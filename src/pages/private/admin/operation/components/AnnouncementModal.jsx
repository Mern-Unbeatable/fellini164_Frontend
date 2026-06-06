import React from 'react';
import { X, Calendar, ChevronDown } from 'lucide-react';

const AnnouncementModal = ({open, onClose, onSave}) => {

    
    if (!open) return null;

  const handleSave = () => {
  
    onSave();

    onClose();
  };



  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/30  p-4">
      {/* Modal Container */}
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg bg-white dark:bg-zinc-800 rounded-xl shadow-xl overflow-hidden font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-600">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white ">Create Announcement</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600  dark:text-gray-200 dark:hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          
          {/* Title Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">
              Title
            </label>
            <input 
              type="text" 
              placeholder="e.g New feature launch"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder:text-gray-400"
            />
          </div>

          {/* Status & Date Row */}
      {/* Status & Date Row */}
<div className="grid grid-cols-2 gap-4">
  <div>
    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">
      Status
    </label>
    {/* 1. Added relative wrapper */}
    <div className="relative">
      <select className="w-full px-3 py-2 border border-gray-300  rounded-md bg-white  dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent appearance-none text-gray-600 dark:text-gray-300 pr-10">
        <option>Draft</option>
        <option>Scheduled</option>
        <option>Published</option>
      </select>
      {/* 2. Added the ChevronDown icon */}
      <ChevronDown 
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" 
        size={20} 
      />
    </div>
  </div>
  
  <div>
    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">
      Date
    </label>
    <div className="relative">
      <input 
        type="text" 
        placeholder="MM/DD/YYYY"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder:text-gray-400"
      />
      <Calendar className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={18} />
    </div>
  </div>
</div>

          {/* Content Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 dark:text-gray-300">
              Content
            </label>
            <textarea 
              rows={4}
              placeholder="Announcement Details"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder:text-gray-400 resize-none"
            />
          </div>
        </div>

        {/* Footer / Buttons */}
        <div className="px-6 py-6 flex justify-end gap-3">
          <button  onClick={onClose} className="px-8 py-2.5 border border-gray-400 text-gray-600 dark:text-gray-300 font-medium rounded-md  transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} className="px-8 py-2.5 bg-[#7c3aed] text-white font-medium rounded-md hover:bg-[#6d28d9] transition-colors shadow-sm">
            Publish
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementModal;