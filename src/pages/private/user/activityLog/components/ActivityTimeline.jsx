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
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="mb-3 h-5 w-24 rounded-[6px] bg-gray-200 dark:bg-gray-700"></div>
            <div className="space-y-3">
              {[1, 2].map((j) => (
                <div
                  key={j}
                  className="h-20 rounded-2xl border border-[#f2f2f2] bg-white dark:border-zinc-700 dark:bg-zinc-800"
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
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#e9e9e9] bg-[#fcfcfc] p-8 text-center dark:border-zinc-700 dark:bg-zinc-800/30">
        <div className="mb-4 rounded-full bg-[rgba(128,34,254,0.05)] p-4">
          <svg
            className="h-10 w-10 text-[#8022fe]"
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
        <h3 className="mb-1.5 text-base font-semibold text-[#181818] dark:text-white">
          No Activities Found
        </h3>
        <p className="text-[12px] font-medium text-[#c2c2c2] dark:text-gray-400">
          Start using the app to see your activity history here.
        </p>
      </div>
    );
  }

  const groupedActivities = groupActivitiesByDate(activities);

  return (
    <div className="space-y-5">
      {groupedActivities.map(([dateKey, dateActivities]) => (
        <div key={dateKey}>
          {/* Date Header */}
          <div className="mb-3 flex items-center gap-3">
            <h2 className="text-sm font-semibold text-[#5d5d5d] dark:text-gray-300">
              {getDateLabel(dateActivities[0].createdAt)}
            </h2>
            <div className="h-px flex-1 bg-[#f2f2f2] dark:bg-zinc-700"></div>
            <span className="text-[12px] font-medium text-[#c2c2c2] dark:text-gray-400">
              {dateActivities.length} {dateActivities.length === 1 ? 'activity' : 'activities'}
            </span>
          </div>

          {/* Activities for this date */}
          <div className="space-y-2.5">
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
