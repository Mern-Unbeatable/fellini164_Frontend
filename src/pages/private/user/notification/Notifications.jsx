import React, { useState, useMemo } from 'react';
import { Bell } from 'lucide-react';
import NotificationHeader from './components/NotificationHeader';
import NotificationActionRow from './components/NotificationActionRow';
import NotificationCard from './components/NotificationCard';

const INITIAL_NOTIFICATIONS = [
  {
    id: 'n1',
    title: 'System Maintenance Scheduled',
    message: 'We will be performing a scheduled system maintenance on Sunday, June 28th, from 2:00 AM to 4:00 AM UTC. Some services might be temporarily unavailable.',
    type: 'ALERT',
    time: '2 hours ago',
    unread: true,
    date: '2026-06-24'
  },
  {
    id: 'n2',
    title: 'New AI Planner Feature Released!',
    message: 'We have launched a new Daily Planner module powered by AI. Check it out in your side menu to organize your day more productively.',
    type: 'FEATURE',
    time: '1 day ago',
    unread: true,
    date: '2026-06-23'
  },
  {
    id: 'n3',
    title: 'Welcome to Fellini164',
    message: 'Welcome to our platform! Please take a moment to complete your profile setup and review your dashboard settings.',
    type: 'INFO',
    time: '3 days ago',
    unread: false,
    date: '2026-06-21'
  },
  {
    id: 'n4',
    title: 'Updated Privacy Policy',
    message: 'We have updated our Privacy Policy to better serve you. Please review the updated terms on our policy page.',
    type: 'INFO',
    time: '4 days ago',
    unread: false,
    date: '2026-06-20'
  }
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, UNREAD, READ

  const handleMarkAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, unread: false } : n)
    );
  };

  const handleMarkAllRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, unread: false }))
    );
  };

  const handleDelete = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
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
