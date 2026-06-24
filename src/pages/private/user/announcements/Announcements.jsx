import React, { useState, useEffect } from 'react';
import { GET, PATCH } from '../../../../services/httpMethods';
import { toast } from 'react-toastify';
import { Info } from 'lucide-react';
import AnnouncementHeader from './components/AnnouncementHeader';
import AnnouncementFilters from './components/AnnouncementFilters';
import AnnouncementCard from './components/AnnouncementCard';
import AnnouncementPagination from './components/AnnouncementPagination';

const Announcements = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await GET('/api/v1/user/announcements');
      const notificationsData = response?.data?.notifications || [];
      setNotifications(Array.isArray(notificationsData) ? notificationsData : []);
    } catch (error) {
      toast.error('Failed to load announcements');
      console.error('Error fetching announcements:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await PATCH(`/api/v1/user/announcements/${notificationId}/read`);
      // Update local state
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, isRead: true, readAt: new Date().toISOString() }
            : notification
        )
      );
      toast.success('Marked as read');
    } catch (error) {
      toast.error('Failed to mark as read');
      console.error('Error marking as read:', error);
    }
  };

  const deleteAnnouncement = (notificationId) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    toast.success('Announcement deleted');
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

  // Combine pinned and regular announcements
  const sortedNotifications = [...pinnedNotifications, ...regularNotifications];

  // Pagination calculation
  const totalResults = sortedNotifications.length;
  const totalPages = Math.ceil(totalResults / itemsPerPage);
  const activePage = Math.min(currentPage, Math.max(1, totalPages));
  const indexOfLastItem = activePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNotifications = sortedNotifications.slice(indexOfFirstItem, indexOfLastItem);

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
    <div className="py-7.5 pb-12 max-lg:min-h-0 max-lg:py-4 max-lg:sm:py-6">
      {/* Header */}
      <AnnouncementHeader />

      {/* Filters */}
      <AnnouncementFilters filter={filter} setFilter={setFilter} />

      {/* Announcements List */}
      <div className="flex-1 space-y-4">
        {currentNotifications.map((notification) => (
          <AnnouncementCard
            key={notification.id}
            notification={notification}
            markAsRead={markAsRead}
            deleteAnnouncement={deleteAnnouncement}
          />
        ))}

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

      {/* Pagination Controls */}
      <AnnouncementPagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default Announcements;
