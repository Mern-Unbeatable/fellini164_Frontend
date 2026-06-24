import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Calendar, Clock, Pin, Info, AlertCircle, Star, CheckCircle, Circle, Trash2 } from 'lucide-react';

const DUMMY_ANNOUNCEMENTS = [
  {
    id: '1',
    isRead: false,
    readAt: null,
    announcement: {
      title: 'System Maintenance Scheduled',
      type: 'ALERT',
      message:
        'We will be performing a scheduled system maintenance on Sunday, June 28th, from 2:00 AM to 4:00 AM UTC. Some services might be temporarily unavailable.',
      isPinned: true,
      createdAt: '2026-06-24T08:00:00.000Z',
      expiresAt: '2026-06-28T04:00:00.000Z',
    },
  },
  {
    id: '2',
    isRead: false,
    readAt: null,
    announcement: {
      title: 'New AI Planner Feature Released!',
      type: 'FEATURE',
      message:
        'We have launched a new Daily Planner module powered by AI. Check it out in your side menu to organize your day more productively.',
      isPinned: true,
      createdAt: '2026-06-23T10:00:00.000Z',
      expiresAt: null,
    },
  },
  {
    id: '3',
    isRead: true,
    readAt: '2026-06-24T09:00:00.000Z',
    announcement: {
      title: 'Welcome to Fellini164',
      type: 'INFO',
      message:
        'Welcome to our platform! Please take a moment to complete your profile setup and review your dashboard settings.',
      isPinned: false,
      createdAt: '2026-06-20T06:00:00.000Z',
      expiresAt: null,
    },
  },
  {
    id: '4',
    isRead: false,
    readAt: null,
    announcement: {
      title: 'Updated Privacy Policy',
      type: 'INFO',
      message:
        'We have updated our Privacy Policy to better serve you. Please review the updated terms on our policy page.',
      isPinned: false,
      createdAt: '2026-06-22T14:30:00.000Z',
      expiresAt: null,
    },
  },
];

const Announcements = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, INFO, FEATURE, ALERT

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = () => {
    setLoading(true);
    // Simulate a brief local loading effect for better UX
    setTimeout(() => {
      setNotifications(DUMMY_ANNOUNCEMENTS);
      setLoading(false);
    }, 300);
  };

  const markAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true, readAt: new Date().toISOString() }
          : notification
      )
    );
    toast.success('Marked as read');
  };

  const deleteAnnouncement = (notificationId) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    toast.success('Announcement deleted');
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'INFO':
        return <Info className="h-4 w-4 text-[#3b82f6]" />;
      case 'FEATURE':
        return <Star className="h-4 w-4 text-[#10b981]" />;
      case 'ALERT':
        return <AlertCircle className="h-4 w-4 text-[#ef4444]" />;
      default:
        return <Info className="h-4 w-4 text-[#3b82f6]" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'INFO':
        return 'bg-[rgba(59,130,246,0.05)] text-[#3b82f6] dark:bg-blue-900/20 dark:text-blue-300';
      case 'FEATURE':
        return 'bg-[rgba(16,185,129,0.05)] text-[#10b981] dark:bg-green-900/20 dark:text-green-300';
      case 'ALERT':
        return 'bg-[rgba(239,68,68,0.05)] text-[#ef4444] dark:bg-red-900/20 dark:text-red-300';
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

  // Ensure notifications is always an array before filtering
  const safeNotifications = Array.isArray(notifications) ? notifications : [];
  const filteredNotifications = safeNotifications.filter((notification) => {
    if (!notification.announcement) return false;
    if (filter === 'ALL') return true;
    return notification.announcement.type === filter;
  });

  const pinnedNotifications = filteredNotifications.filter((n) => n.announcement?.isPinned);
  const regularNotifications = filteredNotifications.filter((n) => !n.announcement?.isPinned);

  if (loading) {
    return (
      <div className="relative flex min-h-full flex-col py-7.5 max-lg:min-h-0 max-lg:py-4 max-lg:sm:py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-1/3 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-24 rounded-2xl bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-24 rounded-2xl bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-full flex-col py-7.5 max-lg:min-h-0 max-lg:py-4 max-lg:sm:py-6">
      {/* Header */}
      <div className="mb-5 flex w-full items-start justify-between max-lg:mb-4 max-lg:flex-col max-lg:gap-4">
        <div className="flex flex-col items-start gap-2">
          <p className="text-[20px] font-medium text-[#181818] dark:text-white">Announcements</p>
          <p className="text-[12px] font-medium text-[#c2c2c2] dark:text-gray-400 max-lg:text-sm">
            Stay updated with the latest news and features
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2.5">
        {['ALL', 'INFO', 'FEATURE', 'ALERT'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`rounded-lg px-3 py-1.75 text-[12px] transition ${
              filter === type
                ? 'bg-[#8022fe] font-semibold text-white'
                : 'border border-[#f2f2f2] bg-white text-[#5d5d5d] font-medium hover:bg-[#fcfcfc] dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {/* Pinned Announcements */}
        {pinnedNotifications.map((notification) => {
          const announcement = notification.announcement;
          return (
            <div
              key={notification.id}
              className={`group relative rounded-xl border border-dashed border-[#8022fe]/40 bg-[#f9f4ff]/40 p-4.5 dark:border-purple-800/40 dark:bg-purple-950/10 ${
                notification.isRead ? 'opacity-70' : ''
              }`}
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
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 text-[#c2c2c2] hover:text-[#dc2626] dark:hover:text-red-400"
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
                  <p className="mb-3 text-[12px] font-medium text-[#5d5d5d] leading-normal dark:text-gray-300">
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
        })}

        {/* Regular Announcements */}
        {regularNotifications.map((notification) => {
          const announcement = notification.announcement;
          return (
            <div
              key={notification.id}
              className={`group relative rounded-2xl border border-[#f2f2f2] bg-[#fcfcfc] p-4.5 transition-all hover:bg-white hover:shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)] dark:border-zinc-700 dark:bg-zinc-800 ${
                notification.isRead ? 'opacity-70' : ''
              }`}
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
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 text-[#c2c2c2] hover:text-[#dc2626] dark:hover:text-red-400"
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
                  <p className="mb-3 text-[12px] font-medium text-[#5d5d5d] leading-normal dark:text-gray-300">
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
        })}

        {/* Empty State */}
        {filteredNotifications.length === 0 && (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#e9e9e9] bg-[#fcfcfc] p-8 text-center dark:border-zinc-700 dark:bg-zinc-800/30">
            <div className="mb-4 rounded-full bg-[rgba(128,34,254,0.05)] p-4 text-[#8022fe]">
              <Info className="h-8 w-8 text-[#8022fe]" />
            </div>
            <h3 className="mb-1.5 text-base font-semibold text-[#181818] dark:text-white">
              No announcements
            </h3>
            <p className="text-[12px] font-medium text-[#c2c2c2] dark:text-gray-400">
              {filter === 'ALL'
                ? 'No announcements available at the moment.'
                : `No ${filter.toLowerCase()} announcements available.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;


