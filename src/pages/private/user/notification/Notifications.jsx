import React, { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { 
  Bell, 
  Check, 
  Trash2, 
  Search, 
  AlertCircle, 
  Star, 
  Info,
  Clock
} from 'lucide-react';

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

const NOTIFICATION_TYPE_STYLES = {
  ALERT: 'bg-[rgba(220,38,38,0.05)] text-[#dc2626]',
  FEATURE: 'bg-[rgba(249,115,22,0.05)] text-[#f97316]',
  INFO: 'bg-[rgba(107,114,128,0.05)] text-[#6b7280]',
};

export default function Notifications() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, UNREAD, READ

  const handleMarkAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, unread: false } : n)
    );
    toast.success('Marked as read');
  };

  const handleMarkAllRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, unread: false }))
    );
    toast.success('All notifications marked as read');
  };

  const handleDelete = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success('Notification deleted');
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

  const getTypeIcon = (type) => {
    switch (type) {
      case 'ALERT':
        return <AlertCircle size={14} />;
      case 'FEATURE':
        return <Star size={14} />;
      default:
        return <Info size={14} />;
    }
  };

  return (
    <div className="py-7.5 max-lg:py-4 max-lg:sm:py-6">
      {/* Header */}
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

      {/* Action Row */}
      <div className="mb-5 flex w-full items-center justify-between max-lg:mb-4 max-lg:flex-col max-lg:items-stretch max-lg:gap-4">
        <div className="flex gap-2">
          <button
            onClick={handleMarkAllRead}
            disabled={!notifications.some(n => n.unread)}
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

      {/* Notification List */}
      <div className="space-y-3">
        {filteredNotifications.map((n) => (
          <div
            key={n.id}
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
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${NOTIFICATION_TYPE_STYLES[n.type]}`}>
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
