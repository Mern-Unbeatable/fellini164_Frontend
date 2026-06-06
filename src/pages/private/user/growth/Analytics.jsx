import React from 'react';
import { TrendingUp, Users, Zap, AlertCircle, DollarSign, TriangleAlert } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function Analytics() {
  const focusMoodData = [

    { day: 'Sat', value: 1800 },
    { day: 'Sun', value: 3200 },
    { day: 'Mon', value: 800 },
    { day: 'Tue', value: 1200 },
    { day: 'Wed', value: 900 },
    { day: 'Thu', value: 1400 },
    { day: 'Fri', value: 1500 },
  ];

  const taskCompletionData = [
    { day: 'Mon', tasks: 5 },
    { day: 'Tue', tasks: 7 },
    { day: 'Wed', tasks: 11 },
    { day: 'Thu', tasks: 5 },
    { day: 'Fri', tasks: 8 },
    { day: 'Sat', tasks: 3 },
    { day: 'Sun', tasks: 2 },
  ];

  const timeDistributionData = [
    { name: 'Work', value: 45, color: '#8B5CF6' },
    { name: 'Health', value: 25, color: '#10B981' },
    { name: 'Learning', value: 20, color: '#F59E0B' },
    { name: 'Personal', value: 10, color: '#EC4899' },
  ];

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 ">
      <div className="">
        <h2 className="pb-6 text-2xl font-semibold dark:text-white">Analytics</h2>
        {/* KPI Cards */}

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Revenue Card */}
          <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-gray-600 bg-white dark:bg-zinc-800 p-6 shadow-sm">
            <div className="items-startc flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-[#F0FDF4] px-3 py-1 text-lg font-bold text-[#22A853]">
                  <DollarSign />
                </span>
                <span className="inline-block rounded-full bg-[#F0FDF4] px-3 py-1 text-sm font-medium text-[#22A853]">
                  +12.5%
                </span>
              </div>
              <div>
                <h3 className="text-3xl font-extrabold text-gray-900 sm:text-4xl dark:text-white">$45,231</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Total Revenue (MRR)</p>
              </div>
            </div>
          </div>
          {/* Users Card */}

          <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-gray-600 bg-white dark:bg-zinc-800 p-6 shadow-sm">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-[#EFF6FF] px-3 py-1 text-lg font-bold text-[#2563EB]">
                  <Users />
                </span>
                <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-[#2563EB]">
                  +180 This Week
                </span>
              </div>

              <div>
                <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">2,350</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Total Users</p>
              </div>
            </div>
          </div>

          {/* AI Interactions Card */}
          <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-gray-600 bg-white dark:bg-zinc-800 p-6 shadow-sm">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-[#FAF5FF] px-3 py-1 text-lg font-bold text-[#7C3AED]">
                  <TrendingUp />
                </span>
                <span className="inline-block rounded-full bg-gray-50 px-3 py-1 text-sm font-medium text-gray-600 ">
                  Today
                </span>
              </div>

              <div>
                <h3 className="text-3xl font-extrabold text-gray-900 sm:text-4xl dark:text-white">12,402</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">AI Interactions</p>
              </div>
            </div>
          </div>
          {/* Churn Rate Card */}
          <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-gray-600 bg-white dark:bg-zinc-800  p-6 shadow-sm">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-[#FFF7ED] px-3 py-1 text-lg font-bold text-[#B91C1C]">
                  <TriangleAlert />
                </span>
                <span className="inline-block rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-[#B91C1C]">
                  -0.1% vs last month
                </span>
              </div>

              <div>
                <h3 className="text-3xl font-extrabold text-gray-900 sm:text-4xl dark:text-white">2.4%</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Churn Rate</p>
              </div>
            </div>
          </div>
        </div>
        {/* Charts Grid */}
        <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Focus & Mood Correlation */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-800 p-4 md:p-6  shadow-sm lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white ">Focus & Mood Correlation</h2>
              <select className="w-auto px-3 py-2 text-sm text-gray-600 focus:outline-none border dark:text-white dark:bg-zinc-700 border-gray-200 dark:border-gray-600 rounded-lg">
                <option className='text-sm'>Last 7 Days</option>
              </select>
            </div>
            <div className="text-gray-500 dark:text-white">
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={focusMoodData} margin={{ top: 20, right: 20, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'currentColor' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'currentColor' }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#7C3AED"
                    strokeWidth={10}
                    dot={false}
                    strokeLinecap="round"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Time Distribution */}
          <div className="relative rounded-lg border border-gray-200 bg-white dark:bg-zinc-800 p-6 shadow-sm">
            <h2 className="mb-4 text-lg md:text-xl font-semibold text-gray-900 dark:text-white">Time Distribution</h2>
            <div className="relative">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={timeDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {timeDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">42h</div>
                  <div className="text-xs text-gray-500 dark:text-gray-300">Total Time</div>
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-2 text-sm">
              {timeDistributionData.map((d) => (
                <div key={d.name} className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ background: d.color }} />
                  <span className="text-gray-600 dark:text-gray-300">{d.name}</span>
                  <span className="ml-auto font-semibold text-gray-900 dark:text-white">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Task Completion Volume */}
        <div className="rounded-lg border border-gray-200 bg-white dark:bg-zinc-800 p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Task Completion Volume</h2>
          <div className="text-gray-500 dark:text-white">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={taskCompletionData}
                margin={{ top: 20, right: 0, left: -15, bottom: 0 }}
                barCategoryGap="30%"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e9e9ef" vertical={false} />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'currentColor', fontSize: 13 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'currentColor' }}
                  domain={[0, 12]}
                  tickCount={5}
                />
                <Tooltip
                  cursor={false}
                  contentStyle={{ padding: '6px 8px', fontSize: 12, borderRadius: 8 }}
                  itemStyle={{ color: '#7c3aed', fontWeight: 600 }}
                />
                <Bar dataKey="tasks" fill="#7c3aed" radius={[12, 12, 0, 0]} barSize={44} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
