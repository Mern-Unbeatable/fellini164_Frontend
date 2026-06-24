import React from 'react';
import { Calendar, Clock, CheckCircle, Circle, Trash2 } from 'lucide-react';

const AnnouncementCard = ({ notification, markAsRead, deleteAnnouncement }) => {
  const announcement = notification.announcement;
  const isPinned = announcement?.isPinned;

  const getTypeColor = (type) => {
    switch (type) {
      case 'ALERT':
        return 'bg-[#DC26260D] text-[#DC2626]';
      case 'FEATURE':
        return 'bg-[#F973160D] text-[#F97316]';
      case 'INFO':
        return 'bg-[#F9F4FF] text-[#8022FE]';
      default:
        return 'bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      className={`group relative p-4.5 transition-all duration-200 ${
        isPinned
          ? 'rounded-xl border border-dashed border-[#8022fe]/40 bg-[#f9f4ff]/40 dark:border-purple-800/40 dark:bg-purple-950/10'
          : 'rounded-2xl border border-[#f2f2f2] bg-[#fcfcfc] hover:bg-white hover:shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)] dark:border-zinc-700 dark:bg-zinc-800'
      } ${notification.isRead ? 'opacity-70' : ''}`}
    >
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {!notification.isRead && (
          <button
            onClick={() => markAsRead(notification.id)}
            className="flex items-center gap-1 rounded-lg bg-[#8022fe] px-2.5 py-1 text-[12px] font-semibold text-white transition hover:opacity-90"
          >
            <Circle className="h-2.5 w-2.5 fill-white text-white" />
            <span>Mark as Read</span>
          </button>
        )}
        {notification.isRead && (
          <span className="flex items-center gap-1 rounded-[6px] bg-[rgba(16,185,129,0.05)] px-2 py-0.5 text-xs font-semibold text-[#10b981]">
            <CheckCircle className="h-3.5 w-3.5 text-[#10b981]" />
            Read
          </span>
        )}
        <button
          type="button"
          onClick={() => deleteAnnouncement(notification.id)}
          className="p-1 text-[#c2c2c2] opacity-0 transition-opacity duration-200 group-hover:opacity-100 hover:text-[#dc2626] dark:hover:text-red-400"
          title="Delete announcement"
          aria-label="Delete announcement"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-start gap-3 pr-16 sm:pr-32">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-col gap-1.5 sm:flex-row sm:items-center">
            <p className="text-sm font-semibold text-[#181818] dark:text-white">
              {announcement.title}
            </p>
            <span
              className={`self-start rounded-[6px] px-[6px] py-[2px] text-xs font-medium uppercase lg:text-[10px] ${getTypeColor(announcement.type)} whitespace-nowrap`}
            >
              {announcement.type}
            </span>
          </div>
          <p className="mb-3 text-[12px] leading-normal font-medium text-[#5d5d5d] dark:text-gray-300">
            {announcement.message}
          </p>
          <div className="flex flex-col gap-2 text-[12px] font-medium text-[#c2c2c2] sm:flex-row sm:items-center sm:gap-4 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-[#c2c2c2]" />
              <span>{formatDate(announcement.createdAt)}</span>
            </div>
            {announcement.expiresAt && (
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-[#c2c2c2]" />
                <span>Expires: {formatDate(announcement.expiresAt)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementCard;
