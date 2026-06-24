import React, { useState, useEffect, useMemo } from 'react';
import ActivityStatsCards from './components/ActivityStatsCards';
import ActivityFilters from './components/ActivityFilters';
import ActivityTimeline from './components/ActivityTimeline';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DUMMY_ACTIVITIES = [
  {
    id: '1',
    type: 'AI_CHAT',
    description: 'Asked AI Coach about daily prioritization strategies',
    createdAt: '2026-06-24T09:15:00.000Z',
    metadata: { tokensUsed: 420 },
  },
  {
    id: '2',
    type: 'PLAN_CREATED',
    description: 'Created a new Daily Plan for today',
    createdAt: '2026-06-24T07:30:00.000Z',
    metadata: { planId: 'plan-101' },
  },
  {
    id: '3',
    type: 'TASK_COMPLETED',
    description: 'Completed task: Refactor dashboard component layout',
    createdAt: '2026-06-23T16:45:00.000Z',
    metadata: { taskId: 'task-202' },
  },
  {
    id: '4',
    type: 'AI_CHAT',
    description: 'Generated habit suggestion list using AI',
    createdAt: '2026-06-23T11:20:00.000Z',
    metadata: { tokensUsed: 680 },
  },
  {
    id: '5',
    type: 'HABIT_UPDATED',
    description: 'Logged habit: Morning Meditation',
    createdAt: '2026-06-23T06:00:00.000Z',
    metadata: { habitId: 'habit-303' },
  },
  {
    id: '6',
    type: 'PLAN_CREATED',
    description: 'Created a new Weekly Plan',
    createdAt: '2026-06-22T08:00:00.000Z',
    metadata: { planId: 'plan-100' },
  },
  {
    id: '7',
    type: 'TASK_COMPLETED',
    description: 'Completed task: Integrate user notifications API',
    createdAt: '2026-06-22T15:00:00.000Z',
    metadata: { taskId: 'task-201' },
  }
];

const ActivityLog = () => {
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: 'ALL',
    startDate: '',
    endDate: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 5;

  // Simulate initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Filter activities locally
  const filteredActivities = useMemo(() => {
    return DUMMY_ACTIVITIES.filter((activity) => {
      if (filters.type !== 'ALL' && activity.type !== filters.type) {
        return false;
      }
      if (filters.startDate) {
        const start = new Date(filters.startDate).setHours(0, 0, 0, 0);
        const activityTime = new Date(activity.createdAt).getTime();
        if (activityTime < start) return false;
      }
      if (filters.endDate) {
        const end = new Date(filters.endDate).setHours(23, 59, 59, 999);
        const activityTime = new Date(activity.createdAt).getTime();
        if (activityTime > end) return false;
      }
      return true;
    });
  }, [filters]);

  // Paginate filtered activities
  const totalActivitiesCount = filteredActivities.length;
  const totalPages = Math.ceil(totalActivitiesCount / limit);
  const startOffset = (currentPage - 1) * limit;

  const paginatedActivities = useMemo(() => {
    return filteredActivities.slice(startOffset, startOffset + limit);
  }, [filteredActivities, startOffset, limit]);

  // Calculate stats from all dummy activities
  const displayStats = useMemo(() => {
    const aiChats = DUMMY_ACTIVITIES.filter((a) => a.type === 'AI_CHAT').length;
    const plansCreated = DUMMY_ACTIVITIES.filter((a) => a.type === 'PLAN_CREATED').length;
    const totalTokens = DUMMY_ACTIVITIES.reduce((sum, a) => sum + (a.metadata?.tokensUsed || 0), 0);

    return {
      totalActivities: DUMMY_ACTIVITIES.length,
      aiChats,
      totalTokens,
      plansCreated,
    };
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset page on filter change
  };

  const handleClearFilters = () => {
    setFilters({
      type: 'ALL',
      startDate: '',
      endDate: '',
    });
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className="py-7.5 max-lg:py-4 max-lg:sm:py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
          Activity Log
        </h1>
        <p className="text-sm text-gray-600 sm:text-base dark:text-gray-400">
          Track your productivity journey and AI usage
        </p>
      </div>

      {/* Stats Cards */}
      <ActivityStatsCards stats={displayStats} loading={loading} />

      {/* Filters */}
      <ActivityFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Timeline */}
      <ActivityTimeline activities={paginatedActivities} loading={loading} />

      {/* Pagination */}
      {!loading && paginatedActivities.length > 0 && totalPages > 1 && (
        <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row dark:border-gray-700 dark:bg-zinc-800">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing{' '}
            <span className="font-medium text-gray-900 dark:text-white">
              {startOffset + 1}
            </span>{' '}
            to{' '}
            <span className="font-medium text-gray-900 dark:text-white">
              {Math.min(startOffset + limit, totalActivitiesCount)}
            </span>{' '}
            of <span className="font-medium text-gray-900 dark:text-white">{totalActivitiesCount}</span>{' '}
            activities
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!canGoPrevious}
              className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-600"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`h-9 w-9 rounded-lg text-sm font-medium transition ${
                      currentPage === pageNum
                        ? 'bg-purple-600 text-white'
                        : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-600'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!canGoNext}
              className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-600"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* No results message */}
      {!loading && paginatedActivities.length === 0 && (filters.type !== 'ALL' || filters.startDate || filters.endDate) && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-zinc-800">
          <p className="text-gray-600 dark:text-gray-400">
            No activities found matching your filters. Try adjusting your search criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default ActivityLog;
