import React, { useMemo, useState } from 'react';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from 'recharts';

const generateData = (days) => {
    const data = [];
    const base = 700;
    for (let i = 0; i < days; i++) {
        const name = days === 7 ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i] : `Day ${i + 1}`;
        const uv = base + Math.round(Math.sin(i / Math.max(1, days / 7)) * 700) + i * 15;
        data.push({ name, uv });
    }
    return data;
};

const RevenueChart = () => {
    const [selectedRange, setSelectedRange] = useState('7');

    const lineData = useMemo(() => generateData(Number(selectedRange)), [selectedRange]);
    return (
        <div className="lg:col-span-2 bg-white dark:bg-zinc-800 text-gray-800 dark:text-white rounded-xl shadow-sm p-4 md:p-6 ">
            <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Revenue & User Growth</h2>
                {/* <div className="flex items-center gap-2">
                    <label htmlFor="range" className="sr-only ">Range</label>
                    <select
                        id="range"
                        value={selectedRange}
                        onChange={(e) => setSelectedRange(e.target.value)}
                        className="text-sm text-gray-700 bg-white dark:bg-zinc-500 dark:text-white cursor-pointer rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                    >
                        <option value="7">Last 7 Days</option>
                        <option value="30">Last 30 Days</option>
                        <option value="60">Last 60 Days</option>
                        <option value="90">Last 90 Days</option>
                    </select>
                </div> */}
                <select className="w-auto px-3 py-2 text-sm text-gray-600 focus:outline-none border dark:text-white dark:bg-zinc-700 dark:border-gray-600 border-gray-200 rounded-lg">
                <option className='text-sm'>Last 7 Days</option>
              </select>
            </div>
            {/**revenue chart */}
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineData} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
                        <defs>
                            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#9b6bff" stopOpacity={1} />
                                <stop offset="100%" stopColor="#7C3AED" stopOpacity={1} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="8 10" stroke="#EEF2F6" vertical={false} />
                        <XAxis dataKey="name" tick={{ fill: 'currentColor', fontSize: 12 }} axisLine={false} tickMargin={12} />
                        <YAxis ticks={[0, 800, 1600, 2400, 3200]} tick={{ fill: 'currentColor', fontSize: 12 }} axisLine={false} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                padding: '8px 12px',
                                fontSize: '14px'
                            }}
                            labelStyle={{ color: '#374151', fontWeight: 600 }}
                            itemStyle={{ color: '#7C3AED' }}
                        />
                        <Line
                            type="natural"
                            dataKey="uv"
                            stroke="url(#lineGradient)"
                            strokeWidth={7}
                            dot={false}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default RevenueChart;
