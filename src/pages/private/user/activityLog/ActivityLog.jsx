import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getActivityLogs,
  selectActivities,
  selectActivityPagination,
  selectActivityFilters,
  selectActivityLoading,
  setActivityFilter,
  clearActivityFilters,
  setPage,
} from '../../../../features/activityLog/activityLogSlice';
import ActivityStatsCards from './components/ActivityStatsCards';
import ActivityFilters from './components/ActivityFilters';
import ActivityTimeline from './components/ActivityTimeline';
import AnnouncementPagination from '../announcements/components/AnnouncementPagination';

const ITEMS_PER_PAGE = 6;

const ActivityLog = () => {
  const dispatch = useDispatch();
  const allActivities = useSelector(selectActivities);
  const pagination = useSelector(selectActivityPagination);
  const filters = useSelector(selectActivityFilters);
  const loading = useSelector(selectActivityLoading);

  useEffect(() => {
    dispatch(
      getActivityLogs({
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
      })
    );
  }, [dispatch, filters.startDate, filters.endDate]);

  const filteredActivities = useMemo(() => {
    if (filters.type === 'ALL') return allActivities;
    return allActivities.filter((activity) => activity.type === filters.type);
  }, [allActivities, filters.type]);

  const totalResults = filteredActivities.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / ITEMS_PER_PAGE) || 1);
  const rawPage = Number(pagination.currentPage);
  const activePage = Number.isFinite(rawPage)
    ? Math.min(Math.max(1, rawPage), totalPages)
    : 1;
  const indexOfLastItem = activePage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const visibleActivities = filteredActivities.slice(indexOfFirstItem, indexOfLastItem);

  const displayStats = useMemo(() => {
    const aiChats = allActivities.filter((a) => a.type === 'AI_CHAT').length;
    const plansCreated = allActivities.filter((a) => a.type === 'PLAN_CREATED').length;
    const totalTokens = allActivities.reduce(
      (sum, a) => sum + (a.metadata?.tokensUsed || 0),
      0
    );

    return {
      totalActivities: allActivities.length,
      aiChats,
      totalTokens,
      plansCreated,
    };
  }, [allActivities]);

  const handleFilterChange = (newFilters) => {
    dispatch(setActivityFilter(newFilters));
  };

  const handleClearFilters = () => {
    dispatch(clearActivityFilters());
  };

  // AnnouncementPagination may pass a number or a React-style updater fn
  const handlePageChange = (pageOrUpdater) => {
    const nextPage =
      typeof pageOrUpdater === 'function'
        ? pageOrUpdater(activePage)
        : pageOrUpdater;
    const safePage = Math.min(Math.max(1, Number(nextPage) || 1), totalPages);
    dispatch(setPage(safePage));
  };

  return (
    <div className="relative flex min-h-full flex-col py-7.5 max-lg:min-h-0 max-lg:py-4 max-lg:sm:py-6">
      <div className="mb-5 flex w-full items-start justify-between max-lg:mb-4 max-lg:flex-col max-lg:gap-4">
        <div className="flex flex-col items-start gap-2">
          <p className="text-[20px] font-medium text-[#181818] dark:text-white">Activity Log</p>
          <p className="text-[12px] font-medium text-[#c2c2c2] dark:text-gray-400 max-lg:text-sm">
            Track your productivity journey and AI usage
          </p>
        </div>
      </div>

      {/* <ActivityStatsCards stats={displayStats} loading={loading} /> */}

      <ActivityFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      <ActivityTimeline activities={visibleActivities} loading={loading} />

      {!loading && totalResults > ITEMS_PER_PAGE && (
        <AnnouncementPagination
          currentPage={activePage}
          totalPages={totalPages}
          setCurrentPage={handlePageChange}
        />
      )}
    </div>
  );
};

export default ActivityLog;
