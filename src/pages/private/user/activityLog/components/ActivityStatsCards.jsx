import React from 'react';
import { Activity, MessageSquare, Zap, Calendar } from 'lucide-react';

const ActivityStatsCards = ({ stats, loading }) => {
  const statsData = [
    {
      id: 1,
      title: 'Total Activities',
      value: stats?.totalActivities || 0,
      icon: Activity,
      bgColor: 'bg-purple-50 dark:bg-purple-900/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
      borderColor: 'border-purple-200 dark:border-purple-800',
    },
    {
      id: 2,
      title: 'AI Conversations',
      value: stats?.aiChats || 0,
      icon: MessageSquare,
      bgColor: 'bg-blue-50 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
      borderColor: 'border-blue-200 dark:border-blue-800',
    },
    {
      id: 3,
      title: 'Total Tokens',
      value: (stats?.totalTokens || 0).toLocaleString(),
      icon: Zap,
      bgColor: 'bg-amber-50 dark:bg-amber-900/30',
      iconColor: 'text-amber-600 dark:text-amber-400',
      borderColor: 'border-amber-200 dark:border-amber-800',
    },
    {
      id: 4,
      title: 'Plans Created',
      value: stats?.plansCreated || 0,
      icon: Calendar,
      bgColor: 'bg-green-50 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400',
      borderColor: 'border-green-200 dark:border-green-800',
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat) => (
        <div
          key={stat.id}
          className={`rounded-xl border ${stat.borderColor} bg-white p-4 shadow-sm transition-all hover:shadow-md sm:p-6 dark:bg-zinc-800`}
        >
          <div className="flex items-center justify-between">
            <div className={`rounded-lg ${stat.bgColor} p-2 sm:p-3`}>
              <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.iconColor}`} />
            </div>
          </div>
          <div className="mt-3 sm:mt-4">
            {loading ? (
              <div className="h-8 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            ) : (
              <h3 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
                {stat.value}
              </h3>
            )}
            <p className="mt-1 text-xs text-gray-600 sm:text-sm dark:text-gray-400">{stat.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityStatsCards;
