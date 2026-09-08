import React from 'react';
import { DollarSign, Users, Zap, AlertTriangle } from 'lucide-react';

const StatsCards = ({ stats }) => {
  const s = stats || {};
  const totalRevenue = s.totalRevenue ;
  const totalUsers = s.totalUsers ;
  const newUsersToday = s.newUsersToday ;
  const activeSubscribers = s.activeSubscribers ;

  const formatCurrency = (v) => {
    if (typeof v === 'number') return `$${v.toFixed(2)}`;
    return v;
  };

  return (
    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* Revenue Card */}
      <div className="rounded-xl border border-[#f2f2f2] bg-white dark:border-zinc-700 dark:bg-zinc-800 p-6 shadow-sm">
        <div className="mb-3 flex items-start justify-between">
          <div className="rounded-lg bg-[#F0FDF4] p-3">
            <DollarSign className="h-5 w-5 text-[#22A853]" />
          </div>
        </div>
        <p className="text-[20px] font-medium text-[#181818] dark:text-white leading-normal">{formatCurrency(totalRevenue)}</p>
        <p className="text-[12px] font-medium text-[#c2c2c2] dark:text-zinc-500">Total Revenue (MRR)</p>
      </div>

      {/* Users Card */}
      <div className="rounded-xl border border-[#f2f2f2] bg-white dark:border-zinc-700 dark:bg-zinc-800 p-6 shadow-sm">
        <div className="mb-3 flex items-start justify-between">
          <div className="rounded-lg bg-[#EFF6FF] p-3">
            <Users className="h-5 w-5 text-[#2563EB]" />
          </div>
        </div>
        <p className="text-[20px] font-medium text-[#181818] dark:text-white leading-normal">{totalUsers}</p>
        <p className="text-[12px] font-medium text-[#c2c2c2] dark:text-zinc-500">Total Users</p>
      </div>

      {/* New Users Card */}
      <div className="rounded-xl border border-[#f2f2f2] bg-white dark:border-zinc-700 dark:bg-zinc-800 p-6 shadow-sm">
        <div className="mb-3 flex items-start justify-between">
          <div className="rounded-lg bg-[#FAF5FF] p-3">
            <Zap className="h-5 w-5 text-[#7C3AED]" />
          </div>
        </div>
        <p className="text-[20px] font-medium text-[#181818] dark:text-white leading-normal">{newUsersToday}</p>
        <p className="text-[12px] font-medium text-[#c2c2c2] dark:text-zinc-500">New Users Today</p>
      </div>

      {/* Active Subscribers Card */}
      <div className="rounded-xl border border-[#f2f2f2] bg-white dark:border-zinc-700 dark:bg-zinc-800 p-6 shadow-sm">
        <div className="mb-3 flex items-start justify-between">
          <div className="rounded-lg bg-[#FFF7ED] p-3">
            <AlertTriangle className="h-5 w-5 text-[#FF5902]" />
          </div>
        </div>
        <p className="text-[20px] font-medium text-[#181818] dark:text-white leading-normal">{activeSubscribers}</p>
        <p className="text-[12px] font-medium text-[#c2c2c2] dark:text-zinc-500">Active Subscribers</p>
      </div>
    </div>
  );
};

export default StatsCards;
