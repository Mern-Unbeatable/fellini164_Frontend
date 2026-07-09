import React, { useState, useEffect, useRef } from 'react';
import { MoreVertical, Eye, Pencil, Trash2 } from 'lucide-react';

export default function ActionDropdown({ user, onView, onEdit, onDelete, dropdownClass = "right-0 top-full mt-2.5" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="rounded-lg p-1 text-[#a3a3a3] hover:bg-[#f2f2f2] dark:hover:bg-zinc-700 transition"
      >
        <MoreVertical size={16} />
      </button>

      {open && (
        <div className={`absolute z-50 flex w-32 flex-col overflow-hidden rounded-lg border border-[#f2f2f2] bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800 ${dropdownClass}`}>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onView(user);
            }}
            className="flex items-center gap-2 px-3 py-2 text-left text-[12px] font-medium text-[#5d5d5d] hover:bg-[#fcfcfc] dark:text-gray-300 dark:hover:bg-zinc-700 w-full"
          >
            <Eye size={12} />
            View
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onEdit(user);
            }}
            className="flex items-center gap-2 px-3 py-2 text-left text-[12px] font-medium text-[#8022fe] hover:bg-[#fcfcfc] dark:hover:bg-zinc-700 w-full"
          >
            <Pencil size={12} />
            Edit
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onDelete(user.id);
            }}
            className="flex items-center gap-2 px-3 py-2 text-left text-[12px] font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 w-full"
          >
            <Trash2 size={12} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
