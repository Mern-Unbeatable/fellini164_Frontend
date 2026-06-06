import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const pieData = [
    { name: 'Free', value: 60 },
    { name: 'Starter', value: 20 },
    { name: 'Pro', value: 15 },
    { name: 'Ultimate', value: 5 },
];

const COLORS = ['#9AAFC8', '#3FC3FF', '#7C3AED', '#A78BFA'];

const PlanDistribution = () => {
    return (
        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-6">
            <div className="flex  items-start justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Plan Distribution</h2>
            </div>

            <div className="flex flex-col items-center gap-4">
                <div style={{ width: 160, height: 160 }}>
                    <ResponsiveContainer width="100%" height={160}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                innerRadius={50}
                                outerRadius={70}
                                startAngle={90}
                                endAngle={450}
                                dataKey="value"
                                paddingAngle={6}
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="-mt-28 flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-lg font-bold dark:text-white">2,350</div>
                            <div className="text-sm text-gray-500 dark:text-white/90">Total Users</div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 w-full">
                    <div className="space-y-3 text-sm">
                        <div className="flex  justify-between w-full gap-3">
                            <span className="w-3 h-3 rounded-full" style={{ background: COLORS[0] }} />
                            <span className="text-gray-600 dark:text-white">Free</span>
                            <span className="ml-auto font-semibold dark:text-white">60%</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="w-3 h-3 rounded-full" style={{ background: COLORS[1] }} />
                            <span className="text-gray-600 dark:text-white">Starter</span>
                            <span className="ml-auto font-semibold dark:text-white">20%</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="w-3 h-3 rounded-full" style={{ background: COLORS[2] }} />
                            <span className="text-gray-600 dark:text-white">Pro</span>
                            <span className="ml-auto font-semibold dark:text-white">15%</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="w-3 h-3 rounded-full" style={{ background: COLORS[3] }} />
                            <span className="text-gray-600 dark:text-white">Ultimate</span>
                            <span className="ml-auto font-semibold dark:text-white">5%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlanDistribution;
