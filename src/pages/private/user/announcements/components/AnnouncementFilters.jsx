import React from 'react';
import { ANNOUNCEMENT_TYPES } from '../../../admin/operation/announcementTypes';

const AnnouncementFilters = ({ filter, setFilter }) => {
  const filterTypes = ['ALL', ...ANNOUNCEMENT_TYPES.map((t) => t.value)];

  return (
    <div className="mb-6 flex flex-wrap gap-2.5">
      {['ALL', 'INFO', 'UPDATE', 'FEATURE', 'MAINTENANCE', 'PROMOTION'].map((type) => (
        <button
          key={type}
          onClick={() => setFilter(type)}
          className={`rounded-lg px-3 py-1.75 text-[12px] transition ${
            filter === type
              ? 'bg-[#8022fe] font-semibold text-white'
              : 'border border-[#f2f2f2] bg-white font-medium text-[#5d5d5d] hover:bg-[#fcfcfc] dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700'
          }`}
        >
          {type}
        </button>
      ))}
    </div>
  );
};

export default AnnouncementFilters;
