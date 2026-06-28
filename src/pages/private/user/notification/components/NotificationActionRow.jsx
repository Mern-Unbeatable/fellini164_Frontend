import React from 'react';
import { Check } from 'lucide-react';

const NotificationActionRow = ({ activeTab, setActiveTab, handleMarkAllRead, hasUnread }) => {
  return (
    <div className="mb-5 flex w-full items-center justify-between max-lg:mb-4 max-lg:flex-col max-lg:items-stretch max-lg:gap-4">
      <div className="flex gap-2">
        <button
          onClick={handleMarkAllRead}
          disabled={!hasUnread}
          className="flex items-center gap-2 rounded-lg bg-[#8022fe] px-3 py-2 text-[12px] font-semibold text-white transition-opacity disabled:opacity-50 max-lg:w-full max-lg:justify-center max-lg:py-2.5 max-lg:text-base"
        >
          <Check size={12} />
          Mark all read
        </button>
      </div>

      {/* Tab Filters */}
      <div className="flex items-center gap-1 rounded-lg border border-[#f2f2f2] p-1 dark:border-zinc-700 max-lg:w-full">
        {['ALL', 'UNREAD', 'READ'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-md px-3 py-1 text-[12px] font-medium transition max-lg:flex-1 max-lg:py-2 max-lg:text-center max-lg:text-base ${
              activeTab === tab
                ? 'bg-[#f2f2f2] text-[#181818] dark:bg-zinc-700 dark:text-white'
                : 'text-[#c2c2c2] hover:text-[#5d5d5d]'
            }`}
          >
            {tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NotificationActionRow;
