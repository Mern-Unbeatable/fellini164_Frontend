import React from 'react';
import { Link } from 'react-router-dom';

export default function NotificationPanel({ isOpen, onClose, notifications, setNotifications }) {
  if (!isOpen) return null;

  const markAllRead = (e) => {
    e.stopPropagation();
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const markIndividualRead = (e, id) => {
    e.stopPropagation();
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  return (
    <>
      <style>{`
        @keyframes notificationPanelOpen {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-notification-panel {
          animation: notificationPanelOpen 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transform-origin: top right;
        }
        .custom-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .custom-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <div className="absolute right-[-40px] sm:right-0 mt-2.5 z-50 w-80 rounded-xl border border-[#f2f2f2] bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-800 p-4 text-left animate-notification-panel">
        <div className="flex items-center justify-between border-b border-[#f2f2f2] pb-2 mb-2 dark:border-zinc-700">
        <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Notifications</h3>
        {notifications.some(n => n.unread) && (
          <button 
            onClick={markAllRead}
            className="text-xs text-purple-600 hover:text-purple-700 font-medium"
          >
            Mark all read
          </button>
        )}
      </div>
      <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            onClick={(e) => markIndividualRead(e, notification.id)}
            className={`p-2.5 rounded-lg border border-transparent transition cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-700 ${notification.unread ? 'bg-purple-50/50 dark:bg-purple-950/20' : ''}`}
          >
            <div className="flex items-start justify-between gap-1.5">
              <p className={`text-xs font-semibold text-gray-900 dark:text-white ${notification.unread ? 'text-purple-900 dark:text-purple-300' : ''}`}>
                {notification.title}
              </p>
              {notification.unread && <span className="h-1.5 w-1.5 rounded-full bg-purple-600 shrink-0 mt-1" />}
            </div>
            <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-0.5 leading-normal">
              {notification.message}
            </p>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 block">
              {notification.time}
            </span>
          </div>
        ))}
        {notifications.length === 0 && (
          <p className="text-center text-xs text-gray-500 py-4 font-medium">No notifications</p>
        )}
      </div>
      <div className="border-t border-[#f2f2f2] pt-2 mt-2 text-center dark:border-zinc-700">
        <Link 
          to="/user/notifications" 
          onClick={onClose}
          className="text-xs text-purple-600 hover:text-purple-700 font-medium block"
        >
          View all notification
        </Link>
      </div>
      </div>
    </>
  );
}
