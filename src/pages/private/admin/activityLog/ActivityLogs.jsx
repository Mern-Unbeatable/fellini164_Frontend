import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAdminActivityLogs,
  selectAdminActivities,
  selectAdminActivityStats,
  selectAdminActivityPagination,
  selectAdminActivityFilters,
  selectAdminActivityLoading,
  setAdminActivityFilter,
  clearAdminActivityFilters,
  setAdminPage,
} from '../../../../features/aiChat/adminActivityLog/adminActivityLogSlice';
import AdminActivityStatsCards from './components/AdminActivityStatsCards';
import AdminActivityFilters from './components/AdminActivityFilters';
import AdminActivityTimeline from './components/AdminActivityTimeline';
import UserActivityModal from './components/UserActivityModal';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AllUsersActivityLog = () => {
  const dispatch = useDispatch();
  const activities = useSelector(selectAdminActivities);
  const stats = useSelector(selectAdminActivityStats);
  const pagination = useSelector(selectAdminActivityPagination);
  const filters = useSelector(selectAdminActivityFilters);
  const loading = useSelector(selectAdminActivityLoading);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleViewUserDetails = (userId, user) => {
    setSelectedUserId(userId);
    setSelectedUser(user);
    setModalOpen(true);
  };

  useEffect(() => {
    dispatch(
      getAdminActivityLogs({
        page: pagination.page,
        limit: pagination.limit,
        type: filters.type,
        userId: filters.userId,
      })
    );
  }, [dispatch, filters, pagination.page, pagination.limit]);

  const handleFilterChange = (newFilters) => {
    dispatch(setAdminActivityFilter(newFilters));
  };

  const handleClearFilters = () => {
    dispatch(clearAdminActivityFilters());
  };

  const handlePageChange = (newPage) => {
    dispatch(setAdminPage(newPage));
  };

  const canGoPrevious = pagination.page > 1;
  const canGoNext = pagination.page < pagination.totalPages;

  return (
    <div className="relative flex min-h-full flex-col py-7.5 max-lg:min-h-0 max-lg:py-4 max-lg:sm:py-6">
      {/* Header */}
      <div className="mb-5 flex w-full items-start justify-between max-lg:mb-4 max-lg:flex-col max-lg:gap-4">
        <div className="flex flex-col items-start gap-2">
          <p className="text-[20px] font-medium text-[#181818] dark:text-white">All Users Activity Logs</p>
          <p className="text-[12px] font-medium text-[#c2c2c2] dark:text-gray-400">
            Monitor all user activities and system interactions
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <AdminActivityStatsCards stats={stats} loading={loading} />

      {/* Filters */}
      <AdminActivityFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Timeline */}
      <AdminActivityTimeline
        activities={activities}
        loading={loading}
        onViewUserDetails={handleViewUserDetails}
      />

      {/* User Activity Modal */}
      <UserActivityModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        userId={selectedUserId}
        user={selectedUser}
      />

      {/* Pagination */}
      {!loading && activities.length > 0 && pagination.totalPages > 1 && (
        <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-[#f2f2f2] bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800 sm:flex-row">
          <div className="text-[12px] font-medium text-[#c2c2c2] dark:text-gray-400">
            Showing page{' '}
            <span className="font-semibold text-[#181818] dark:text-white">{pagination.page}</span> of{' '}
            <span className="font-semibold text-[#181818] dark:text-white">
              {pagination.totalPages}
            </span>{' '}
            ({pagination.total} total activities)
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={!canGoPrevious}
              className="flex items-center gap-1 rounded-lg border border-[#f2f2f2] bg-white px-3 py-1.75 text-[12px] font-medium text-[#181818] transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
            >
              <ChevronLeft size={14} />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.page <= 3) {
                  pageNum = i + 1;
                } else if (pagination.page >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.page - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`h-8 w-8 rounded-lg text-[12px] font-medium transition ${
                      pagination.page === pageNum
                        ? 'bg-[#8022fe] text-white'
                        : 'border border-[#f2f2f2] bg-white text-[#181818] hover:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={!canGoNext}
              className="flex items-center gap-1 rounded-lg border border-[#f2f2f2] bg-white px-3 py-1.75 text-[12px] font-medium text-[#181818] transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* No results message */}
      {!loading && activities.length === 0 && (
        <div className="mt-6 rounded-2xl border border-[#f2f2f2] bg-white p-8 text-center dark:border-zinc-700 dark:bg-zinc-800">
          <p className="text-[12px] font-medium text-[#c2c2c2] dark:text-gray-400">
            No activities found. {filters.type !== 'ALL' && 'Try adjusting your filters.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default AllUsersActivityLog;
