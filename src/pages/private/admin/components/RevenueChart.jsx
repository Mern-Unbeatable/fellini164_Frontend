import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const PERIOD_OPTIONS = [
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' },
];

const RevenueChart = ({ series = [], period = '7d', onPeriodChange, loading = false }) => {
  const lineData = useMemo(
    () =>
      (Array.isArray(series) ? series : []).map((item) => ({
        name: item.label || item.date,
        revenue: Number(item.revenue) || 0,
        newUsers: Number(item.newUsers) || 0,
      })),
    [series]
  );

  const yMax = useMemo(() => {
    const maxVal = Math.max(
      0,
      ...lineData.map((d) => Math.max(d.revenue, d.newUsers))
    );
    if (maxVal <= 0) return 10;
    const padded = Math.ceil(maxVal * 1.2);
    return padded < 10 ? 10 : padded;
  }, [lineData]);

  return (
    <div className="lg:col-span-2 rounded-xl border border-[#f2f2f2] bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-800 md:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <h2 className="text-[16px] font-medium text-[#181818] dark:text-white">
          Revenue & User Growth
        </h2>
        <select
          value={period}
          onChange={(e) => onPeriodChange?.(e.target.value)}
          className="w-fit shrink-0 cursor-pointer rounded-lg border border-[#f2f2f2] bg-white px-3 py-1.75 text-[12px] font-medium text-[#5d5d5d] focus:outline-none dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
        >
          {PERIOD_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="text-[12px] font-medium">
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="h-64">
        {loading && lineData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-[13px] font-medium text-[#a3a3a3]">
            Loading chart…
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#9b6bff" stopOpacity={1} />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity={1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="8 10" stroke="#EEF2F6" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 500 }}
                axisLine={false}
                tickMargin={12}
              />
              <YAxis
                domain={[0, yMax]}
                tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 500 }}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '12px',
                }}
                labelStyle={{ color: '#374151', fontWeight: 600 }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ fontSize: 11, paddingBottom: 8 }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="url(#lineGradient)"
                strokeWidth={3}
                dot={false}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Line
                type="monotone"
                dataKey="newUsers"
                name="New Users"
                stroke="#3FC3FF"
                strokeWidth={2.5}
                dot={false}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default RevenueChart;
