import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { DELETE, GET, PATCH } from '../../../../services/httpMethods';
import { selectIsAdmin } from '../../../../features/auth/authSlice';
import { toast } from 'react-toastify';
import { Info } from 'lucide-react';
import AnnouncementHeader from './components/AnnouncementHeader';
import AnnouncementFilters from './components/AnnouncementFilters';
import AnnouncementCard from './components/AnnouncementCard';
import AnnouncementPagination from './components/AnnouncementPagination';

const Announcements = () => {
  const isAdmin = useSelector(selectIsAdmin);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchAnnouncements = useCallback(async () => {
    try {
      setLoading(true);
      const params = filter === 'ALL' ? undefined : { type: filter };
      const rawResponse = await GET('/api/v1/user/announcements', params);
      const response = Array.isArray(rawResponse) ? rawResponse[0] : rawResponse;
      const notificationsData =
        response?.data?.notifications || response?.notifications || [];
      setNotifications(Array.isArray(notificationsData) ? notificationsData : []);
    } catch (error) {
      toast.error('Failed to load announcements');
      console.error('Error fetching announcements:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    setCurrentPage(1);
    fetchAnnouncements();
  }, [fetchAnnouncements]);

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

  const deleteAnnouncement = async (notification) => {
    if (!isAdmin) return;
    const announcementId = notification?.announcementId || notification?.announcement?.id;
    if (!announcementId) return;
    try {
      const response = await DELETE(`/api/v1/user/announcements/${announcementId}`);
      setNotifications((prev) =>
        prev.filter(
          (n) =>
            n.id !== notification.id &&
            n.announcementId !== announcementId &&
            n.announcement?.id !== announcementId
        )
      );
      toast.success(response?.message || 'Announcement deleted');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to delete announcement');
    }
  };

  // API already applies the selected type; retain this guard for response safety.
  const safeNotifications = Array.isArray(notifications) ? notifications : [];
  const filteredNotifications = safeNotifications.filter((notification) => notification.announcement);

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
    <div className="pt-7.5 pb-7.5  max-lg:min-h-0 max-lg:py-4 max-lg:sm:py-6">
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
            canDelete={isAdmin}
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
