import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bell } from 'lucide-react';
import NotificationHeader from './components/NotificationHeader';
import NotificationActionRow from './components/NotificationActionRow';
import NotificationCard from './components/NotificationCard';
import {
  selectNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from '../../../../features/notifications/notificationsSlice';

export default function Notifications() {
  const dispatch = useDispatch();
  const notifications = useSelector(selectNotifications);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, UNREAD, READ

  const handleMarkAsRead = (id) => {
    dispatch(markNotificationAsRead(id));
  };

  const handleMarkAllRead = () => {
    dispatch(markAllNotificationsAsRead());
  };

  const handleDelete = (id) => {
    dispatch(deleteNotification(id));
  };

  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      // Tab filter
      if (activeTab === 'UNREAD' && !n.unread) return false;
      if (activeTab === 'READ' && n.unread) return false;

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          n.title.toLowerCase().includes(query) ||
          n.message.toLowerCase().includes(query) ||
          n.type.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [notifications, activeTab, searchQuery]);

  const hasUnread = notifications.some(n => n.unread);

  return (
    <div className="py-7.5 max-lg:py-4 max-lg:sm:py-6">
      {/* Header & Search */}
      <NotificationHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Action Row & Tabs */}
      <NotificationActionRow
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleMarkAllRead={handleMarkAllRead}
        hasUnread={hasUnread}
      />

      {/* Notification List */}
      <div className="space-y-3">
        {filteredNotifications.map((n) => (
          <NotificationCard
            key={n.id}
            notification={n}
            handleMarkAsRead={handleMarkAsRead}
            handleDelete={handleDelete}
          />
        ))}

        {/* Empty State */}
        {filteredNotifications.length === 0 && (
          <div className="rounded-xl border border-[#f2f2f2] bg-white py-12 text-center dark:border-zinc-700 dark:bg-zinc-800">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#f9f4ff] text-[#8022fe] dark:bg-purple-950/20">
              <Bell size={20} />
            </div>
            <p className="text-[14px] font-medium text-[#181818] dark:text-white">No notifications</p>
            <p className="text-[12px] text-[#c2c2c2] mt-1">
              {searchQuery ? 'No results match your search query.' : 'You are all caught up!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
