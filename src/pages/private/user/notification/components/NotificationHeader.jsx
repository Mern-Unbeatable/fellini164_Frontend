import React from 'react';
import { Search } from 'lucide-react';

const NotificationHeader = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="mb-5 flex w-full items-start justify-between max-lg:mb-4 max-lg:flex-col max-lg:gap-4">
      <div className="flex flex-col items-start gap-2">
        <p className="text-[20px] font-medium text-[#181818] dark:text-white">Notifications</p>
        <p className="text-[12px] font-medium text-[#c2c2c2] dark:text-gray-400 max-lg:text-sm">
          Stay updated with your latest alerts and notifications...
        </p>
      </div>
      
      {/* Search */}
      <label className="flex w-62.5 items-center gap-2 rounded-lg border border-[#f2f2f2] bg-white px-3 py-1.75 focus-within:border-[#e9e9e9] dark:border-zinc-700 dark:bg-zinc-800 dark:focus-within:border-zinc-600 max-lg:w-full max-lg:py-2">
        <Search size={12} className="shrink-0 text-[#c2c2c2]" aria-hidden />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search notifications..."
          aria-label="Search notifications"
          className="w-full bg-transparent text-[12px] font-medium text-[#181818] outline-none placeholder:text-[#c2c2c2] dark:text-white max-lg:text-base"
        />
      </label>
    </div>
  );
};

export default NotificationHeader;
