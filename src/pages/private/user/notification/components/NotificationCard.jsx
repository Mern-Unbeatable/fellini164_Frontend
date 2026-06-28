import React from 'react';
import { AlertCircle, Star, Info, Check, Trash2, Clock } from 'lucide-react';

const NOTIFICATION_TYPE_STYLES = {
  ALERT: 'bg-[#DC26260D] text-[#DC2626]',
  FEATURE: 'bg-[#F973160D] text-[#F97316]',
  INFO: 'bg-[#F9F4FF] text-[#8022FE]',
};

const NotificationCard = ({ notification, handleMarkAsRead, handleDelete }) => {
  const n = notification;

  const getTypeIcon = (type) => {
    switch (type) {
      case 'ALERT':
        return <AlertCircle size={12} />;
      case 'FEATURE':
        return <Star size={12} />;
      default:
        return <Info size={12} />;
    }
  };

  return (
    <div
      className={`relative flex items-start justify-between gap-4 rounded-xl border border-[#f2f2f2] p-4 transition-all dark:border-zinc-700 ${
        n.unread
          ? 'bg-[#f9f4ff] border-purple-100 dark:bg-purple-950/10 dark:border-purple-900/30'
          : 'bg-white dark:bg-zinc-800'
      }`}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        {/* Left Indicator Dot */}
        {n.unread && (
          <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-[#8022fe]" />
        )}
        
        <div className="min-w-0 flex-1">
          {/* Title & Type Badge */}
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <h3 className={`text-[14px] font-semibold text-[#181818] dark:text-white truncate ${n.unread ? 'font-bold' : 'font-medium'}`}>
              {n.title}
            </h3>
            <span className={`inline-flex items-center gap-1 rounded-[6px] px-[6px] py-[2px] text-xs font-medium uppercase lg:text-[12px] tracking-wide ${NOTIFICATION_TYPE_STYLES[n.type]}`}>
              {getTypeIcon(n.type)}
              {n.type}
            </span>
          </div>
          
          {/* Message */}
          <p className="text-[12px] leading-relaxed text-[#5d5d5d] dark:text-gray-300">
            {n.message}
          </p>
          
          {/* Meta details */}
          <div className="mt-2.5 flex items-center gap-1 text-[11px] text-[#c2c2c2] dark:text-zinc-500">
            <Clock size={11} />
            <span>{n.time}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-1">
        {n.unread && (
          <button
            onClick={() => handleMarkAsRead(n.id)}
            title="Mark as read"
            className="rounded-lg p-1.5 text-[#c2c2c2] hover:bg-[#f2f2f2] hover:text-[#5d5d5d] dark:hover:bg-zinc-700 dark:hover:text-white"
          >
            <Check size={14} />
          </button>
        )}
        <button
          onClick={() => handleDelete(n.id)}
          title="Delete notification"
          className="rounded-lg p-1.5 text-[#c2c2c2] hover:bg-red-50 hover:text-[#DC2626] dark:hover:bg-red-950/30 dark:hover:text-red-400"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

export default NotificationCard;
