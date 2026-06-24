import React from 'react';
import ActivityItem from './ActivityItem';

const ActivityTimeline = ({ activities, loading }) => {
  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isYesterday = (date) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.toDateString() === yesterday.toDateString();
  };

  const isThisWeek = (date) => {
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 7);
    return date >= weekAgo && date <= today;
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const getDayName = (date) => {
    const options = { weekday: 'long' };
    return date.toLocaleDateString('en-US', options);
  };

  const getDateLabel = (dateString) => {
    const date = new Date(dateString);

    if (isToday(date)) {
      return 'Today';
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else if (isThisWeek(date)) {
      return getDayName(date);
    } else {
      return formatDate(date);
    }
  };

  const groupActivitiesByDate = (activities) => {
    const grouped = {};

    activities.forEach((activity) => {
      const date = new Date(activity.createdAt);
      const dateKey = date.toISOString().split('T')[0]; // yyyy-MM-dd
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(activity);
    });

    return Object.entries(grouped).sort((a, b) => b[0].localeCompare(a[0]));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="mb-3 h-6 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="space-y-3">
              {[1, 2].map((j) => (
                <div
                  key={j}
                  className="h-24 rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-zinc-800"
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="flex min-h-100 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-zinc-800/50">
        <div className="mb-4 rounded-full bg-purple-100 p-4 dark:bg-purple-900/30">
          <svg
            className="h-12 w-12 text-purple-600 dark:text-purple-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
          No Activities Found
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Start using the app to see your activity history here.
        </p>
      </div>
    );
  }

  const groupedActivities = groupActivitiesByDate(activities);

  return (
    <div className="space-y-6">
      {groupedActivities.map(([dateKey, dateActivities]) => (
        <div key={dateKey}>
          {/* Date Header */}
          <div className="mb-3 flex items-center gap-3">
            <h2 className="text-base font-semibold text-gray-900 sm:text-lg dark:text-white">
              {getDateLabel(dateActivities[0].createdAt)}
            </h2>
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {dateActivities.length} {dateActivities.length === 1 ? 'activity' : 'activities'}
            </span>
          </div>

          {/* Activities for this date */}
          <div className="space-y-3">
            {dateActivities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityTimeline;
