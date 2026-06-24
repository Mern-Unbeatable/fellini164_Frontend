import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Calendar, Clock, Pin, Info, AlertCircle, Star, CheckCircle, Circle } from 'lucide-react';

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

  const getTypeIcon = (type) => {
    switch (type) {
      case 'INFO':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'FEATURE':
        return <Star className="h-5 w-5 text-green-500" />;
      case 'ALERT':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'INFO':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800';
      case 'FEATURE':
        return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800';
      case 'ALERT':
        return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800';
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
      <div className="p-4 sm:p-6">
        <div className="animate-pulse space-y-3 sm:space-y-4">
          <div className="h-6 w-1/2 rounded-md bg-gray-300 sm:h-8 sm:w-1/3"></div>
          <div className="h-24 rounded-lg bg-gray-300 sm:h-32"></div>
          <div className="h-24 rounded-lg bg-gray-300 sm:h-32"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-7.5 max-lg:py-4 max-lg:sm:py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Announcements</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Stay updated with the latest news and features
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {['ALL', 'INFO', 'FEATURE', 'ALERT'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              filter === type
                ? 'bg-violet-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Announcements List */}
      <div className="space-y-3 sm:space-y-4">
        {/* Pinned Announcements */}
        {pinnedNotifications.map((notification) => {
          const announcement = notification.announcement;
          return (
            <div
              key={notification.id}
              className={`relative rounded-lg border-2 border-dashed border-violet-300 bg-violet-50 p-4 sm:p-6 dark:border-violet-700 dark:bg-violet-900/10 ${
                notification.isRead ? 'opacity-75' : ''
              }`}
            >
              <div className="absolute top-3 right-3 flex flex-col items-end gap-1 sm:top-4 sm:right-4 sm:flex-row sm:items-center sm:gap-2">
                <Pin className="h-4 w-4 text-violet-600 sm:h-5 sm:w-5" />
                {!notification.isRead && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="flex items-center gap-1 rounded-md bg-blue-500 px-2 py-1 text-xs whitespace-nowrap text-white transition-colors hover:bg-blue-600"
                  >
                    <Circle className="h-3 w-3" />
                    <span className="xs:inline hidden">Mark as Read</span>
                    <span className="xs:hidden">Read</span>
                  </button>
                )}
                {notification.isRead && (
                  <span className="flex items-center gap-1 rounded-md bg-green-100 px-2 py-1 text-xs whitespace-nowrap text-green-700">
                    <CheckCircle className="h-3 w-3" />
                    Read
                  </span>
                )}
              </div>

              <div className="mb-3 flex items-start gap-2 pr-16 sm:gap-3 sm:pr-32">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                    <h3 className="truncate text-base font-semibold text-gray-900 sm:text-lg dark:text-white">
                      {announcement.title}
                    </h3>
                    <span
                      className={`self-start rounded-full border px-2 py-1 text-xs font-medium ${getTypeColor(announcement.type)} whitespace-nowrap`}
                    >
                      {announcement.type}
                    </span>
                  </div>
                  <p className="mb-3 text-sm leading-relaxed text-gray-700 sm:text-base dark:text-gray-300">
                    {announcement.message}
                  </p>
                  <div className="flex flex-col gap-2 text-xs text-gray-500 sm:flex-row sm:items-center sm:gap-4 sm:text-sm dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{formatDate(announcement.createdAt)}</span>
                    </div>
                    {announcement.expiresAt && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
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
              className={`relative rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md sm:p-6 dark:border-gray-700 dark:bg-gray-800 ${
                notification.isRead ? 'opacity-75' : ''
              }`}
            >
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                {!notification.isRead && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="flex items-center gap-1 rounded-md bg-blue-500 px-2 py-1 text-xs whitespace-nowrap text-white transition-colors hover:bg-blue-600"
                  >
                    <Circle className="h-3 w-3" />
                    <span className="xs:inline hidden">Mark as Read</span>
                    <span className="xs:hidden">Read</span>
                  </button>
                )}
                {notification.isRead && (
                  <span className="flex items-center gap-1 rounded-md bg-green-100 px-2 py-1 text-xs whitespace-nowrap text-green-700">
                    <CheckCircle className="h-3 w-3" />
                    Read
                  </span>
                )}
              </div>

              <div className="flex items-start gap-2 pr-16 sm:gap-3 sm:pr-32">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                    <h3 className="truncate text-base font-semibold text-gray-900 sm:text-lg dark:text-white">
                      {announcement.title}
                    </h3>
                    <span
                      className={`self-start rounded-full border px-2 py-1 text-xs font-medium ${getTypeColor(announcement.type)} whitespace-nowrap`}
                    >
                      {announcement.type}
                    </span>
                  </div>
                  <p className="mb-3 text-sm leading-relaxed text-gray-700 sm:text-base dark:text-gray-300">
                    {announcement.message}
                  </p>
                  <div className="flex flex-col gap-2 text-xs text-gray-500 sm:flex-row sm:items-center sm:gap-4 sm:text-sm dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{formatDate(announcement.createdAt)}</span>
                    </div>
                    {announcement.expiresAt && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
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
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
              <Info className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
              No announcements
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
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
