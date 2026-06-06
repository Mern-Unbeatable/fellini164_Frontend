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
      <div className="rounded-xl bg-white dark:bg-zinc-800 p-6 shadow-sm">
        <div className="mb-3 flex items-start justify-between">
          <div className="rounded-lg bg-[#F0FDF4] p-3">
            <DollarSign className="h-6 w-6 text-[#22A853]" />
          </div>
          <span className="rounded-full bg-[#F0FDF4] px-2 py-1 text-xs text-[#22A853]">+12.5%</span>
        </div>
        <p className="text-2xl font-bold text-gray-800 dark:text-white">{formatCurrency(totalRevenue)}</p>
        <p className="text-sm text-[#666B74] dark:text-white/90">Total Revenue (MRR)</p>
      </div>

      <div className="rounded-xl bg-white dark:bg-zinc-800 p-6 shadow-sm">
        <div className="mb-3 flex items-start justify-between">
          <div className="rounded-lg bg-[#EFF6FF] p-3">
            <Users className="h-6 w-6 text-[#2563EB]" />
          </div>
          <span className="rounded-full bg-[#EFF6FF] px-2 py-1 text-xs text-[#2563EB]">
            +180 This Week
          </span>
        </div>
        <p className="text-2xl font-bold text-gray-800 dark:text-white">{totalUsers}</p>
        <p className="text-sm text-[#666B74] dark:text-white/90">Total Users</p>
      </div>

      <div className="rounded-xl bg-white dark:bg-zinc-800 p-6 shadow-sm">
        <div className="mb-3 flex items-start justify-between">
          <div className="rounded-lg bg-[#FAF5FF] p-3">
            <Zap className="h-6 w-6 text-[#7C3AED]" />
          </div>
          <span className="rounded-full bg-[#F3F4F5] px-2 py-1 text-xs text-[#5C6370]">Today</span>
        </div>
        <p className="text-2xl font-bold text-[#000000] dark:text-white">{newUsersToday}</p>
        <p className="text-sm text-[#666B74] dark:text-white/90">New Users Today</p>
      </div>

      <div className="rounded-xl bg-white dark:bg-zinc-800 p-6 shadow-sm">
        <div className="mb-3 flex items-start justify-between">
          <div className="rounded-lg bg-[#FFF7ED] p-3">
            <AlertTriangle className="h-6 w-6 text-[#FF5902]" />
          </div>
          <span className="rounded-full bg-[#F3F4F5] px-2 py-1 text-xs text-[#5C6370]">
            -0.1% vs last month
          </span>
        </div>
        <p className="text-2xl font-bold text-[#000000] dark:text-white">{activeSubscribers}</p>
        <p className="text-sm text-[#666B74] dark:text-white/90">Active Subscribers</p>
      </div>
    </div>
  );
};

export default StatsCards;
