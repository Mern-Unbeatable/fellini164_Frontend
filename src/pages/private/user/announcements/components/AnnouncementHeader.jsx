import React from 'react';

const AnnouncementHeader = () => {
  return (
    <div className="mb-5 flex w-full items-start justify-between max-lg:mb-4 max-lg:flex-col max-lg:gap-4">
      <div className="flex flex-col items-start gap-2">
        <p className="text-[20px] font-medium text-[#181818] dark:text-white">Announcements</p>
        <p className="text-[12px] font-medium text-[#c2c2c2] max-lg:text-sm dark:text-gray-400">
          Stay updated with the latest news and features
        </p>
      </div>
    </div>
  );
};

export default AnnouncementHeader;
