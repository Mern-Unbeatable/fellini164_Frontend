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
        <div className="bg-white dark:bg-zinc-800 border border-[#f2f2f2] dark:border-zinc-700 rounded-xl shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
                <h2 className="text-[16px] font-medium text-[#181818] dark:text-white">Plan Distribution</h2>
            </div>

            <div className="flex flex-col items-center gap-4">
                <div style={{ width: 160, height: 160 }} className="relative">
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
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-[16px] font-medium text-[#181818] dark:text-white">2,350</div>
                        <div className="text-[10px] font-medium text-[#c2c2c2] dark:text-zinc-500">Total Users</div>
                    </div>
                </div>

                <div className="flex-1 w-full">
                    <div className="space-y-2.5 text-[12px] font-medium text-[#5d5d5d] dark:text-gray-300">
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: COLORS[0] }} />
                                <span>Free</span>
                            </div>
                            <span className="font-semibold text-[#181818] dark:text-white">60%</span>
                        </div>
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: COLORS[1] }} />
                                <span>Starter</span>
                            </div>
                            <span className="font-semibold text-[#181818] dark:text-white">20%</span>
                        </div>
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: COLORS[2] }} />
                                <span>Pro</span>
                            </div>
                            <span className="font-semibold text-[#181818] dark:text-white">15%</span>
                        </div>
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: COLORS[3] }} />
                                <span>Ultimate</span>
                            </div>
                            <span className="font-semibold text-[#181818] dark:text-white">5%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlanDistribution;
