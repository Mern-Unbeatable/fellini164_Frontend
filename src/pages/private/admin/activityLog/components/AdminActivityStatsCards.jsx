import React from 'react';
import { Activity, MessageSquare, Zap, Calendar, Users } from 'lucide-react';

const AdminActivityStatsCards = ({ stats, loading }) => {
  const cards = [
    {
      title: 'Total Activities',
      value: stats?.totalActivities || 0,
      icon: Activity,
      color: 'text-[#8022fe]',
      bgColor: 'bg-[#8022fe]/10 dark:bg-[#8022fe]/20',
    },
    {
      title: 'Active Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'text-[#10b981]',
      bgColor: 'bg-[#10b981]/10 dark:bg-[#10b981]/20',
    },
    {
      title: 'AI Conversations',
      value: stats?.aiChats || 0,
      icon: MessageSquare,
      color: 'text-[#3b82f6]',
      bgColor: 'bg-[#3b82f6]/10 dark:bg-[#3b82f6]/20',
    },
    {
      title: 'Total Tokens',
      value: (stats?.totalTokens || 0).toLocaleString(),
      icon: Zap,
      color: 'text-[#f59e0b]',
      bgColor: 'bg-[#f59e0b]/10 dark:bg-[#f59e0b]/20',
    },
    {
      title: 'Plans Created',
      value: stats?.plansCreated || 0,
      icon: Calendar,
      color: 'text-[#06b6d4]',
      bgColor: 'bg-[#06b6d4]/10 dark:bg-[#06b6d4]/20',
    },
  ];

  if (loading) {
    return (
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-2xl border border-[#f2f2f2] bg-white p-5 dark:border-zinc-700 dark:bg-zinc-800"
          >
            <div className="mb-4 h-10 w-10 rounded-lg bg-gray-100 dark:bg-zinc-700"></div>
            <div className="h-6 w-16 rounded bg-gray-100 dark:bg-zinc-700"></div>
            <div className="mt-2 h-3.5 w-24 rounded bg-gray-100 dark:bg-zinc-700"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="rounded-2xl border border-[#f2f2f2] bg-white p-5 transition hover:shadow-sm dark:border-zinc-700 dark:bg-zinc-800"
          >
            <div className={`mb-3 inline-flex rounded-lg p-2.5 ${card.bgColor}`}>
              <Icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <h3 className="text-[22px] font-bold text-[#181818] leading-tight dark:text-white">{card.value}</h3>
            <p className="mt-1 text-[12px] font-medium text-[#c2c2c2] dark:text-gray-400">{card.title}</p>
          </div>
        );
      })}
    </div>
  );
};

export default AdminActivityStatsCards;
