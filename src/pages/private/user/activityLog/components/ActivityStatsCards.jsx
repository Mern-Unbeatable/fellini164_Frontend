import React from 'react';
import { Activity, MessageSquare, Zap, Calendar } from 'lucide-react';

const ActivityStatsCards = ({ stats, loading }) => {
  const statsData = [
    {
      id: 1,
      title: 'Total Activities',
      value: stats?.totalActivities || 0,
      icon: Activity,
      bgColor: 'bg-[rgba(128,34,254,0.05)]',
      iconColor: 'text-[#8022fe]',
    },
    {
      id: 2,
      title: 'AI Conversations',
      value: stats?.aiChats || 0,
      icon: MessageSquare,
      bgColor: 'bg-[rgba(128,34,254,0.05)] dark:bg-[rgba(128,34,254,0.1)]',
      iconColor: 'text-[#8022fe]',
    },
    {
      id: 3,
      title: 'Total Tokens',
      value: (stats?.totalTokens || 0).toLocaleString(),
      icon: Zap,
      bgColor: 'bg-[rgba(249,115,22,0.05)]',
      iconColor: 'text-[#f97316]',
    },
    {
      id: 4,
      title: 'Plans Created',
      value: stats?.plansCreated || 0,
      icon: Calendar,
      bgColor: 'bg-[rgba(16,185,129,0.05)]',
      iconColor: 'text-[#10b981]',
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat) => (
        <div
          key={stat.id}
          className="rounded-2xl border border-[#f2f2f2] bg-white p-4.5 dark:border-zinc-700 dark:bg-zinc-800"
        >
          <div className="flex items-center justify-between">
            <div className={`rounded-[8px] ${stat.bgColor} p-2`}>
              <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
            </div>
          </div>
          <div className="mt-3">
            {loading ? (
              <div className="h-7 w-20 animate-pulse rounded-[6px] bg-gray-200 dark:bg-gray-700"></div>
            ) : (
              <h3 className="text-[20px] font-semibold text-[#181818] dark:text-white">
                {stat.value}
              </h3>
            )}
            <p className="mt-1 text-[12px] font-medium text-[#c2c2c2] dark:text-gray-400">{stat.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityStatsCards;
