import React, { useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const PLAN_COLORS = {
  FREE: '#9AAFC8',
  STARTER: '#3FC3FF',
  PRO: '#7C3AED',
  ULTIMATE: '#A78BFA',
};

const PLAN_ORDER = ['FREE', 'STARTER', 'PRO', 'ULTIMATE'];

const PlanDistribution = ({ planDistribution }) => {
  const plans = useMemo(() => {
    const list = Array.isArray(planDistribution?.plans) ? planDistribution.plans : [];
    const byPlan = Object.fromEntries(list.map((p) => [String(p.plan || '').toUpperCase(), p]));

    return PLAN_ORDER.map((plan) => {
      const item = byPlan[plan] || {};
      return {
        name: plan.charAt(0) + plan.slice(1).toLowerCase(),
        plan,
        value: Number(item.percentage) || 0,
        count: Number(item.count) || 0,
        color: PLAN_COLORS[plan],
      };
    });
  }, [planDistribution]);

  const totalUsers = planDistribution?.totalUsers ?? plans.reduce((sum, p) => sum + p.count, 0);
  const chartData = plans.filter((p) => p.value > 0);
  const pieSource = chartData.length > 0 ? chartData : plans.map((p) => ({ ...p, value: 1 }));

  return (
    <div className="rounded-xl border border-[#f2f2f2] bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
      <div className="mb-4 flex items-start justify-between">
        <h2 className="text-[16px] font-medium text-[#181818] dark:text-white">Plan Distribution</h2>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div style={{ width: 160, height: 160 }} className="relative">
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={pieSource}
                innerRadius={50}
                outerRadius={70}
                startAngle={90}
                endAngle={450}
                dataKey="value"
                paddingAngle={6}
              >
                {pieSource.map((entry) => (
                  <Cell key={entry.plan} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-[16px] font-medium text-[#181818] dark:text-white">
              {Number(totalUsers).toLocaleString()}
            </div>
            <div className="text-[10px] font-medium text-[#c2c2c2] dark:text-zinc-500">Total Users</div>
          </div>
        </div>

        <div className="w-full flex-1">
          <div className="space-y-2.5 text-[12px] font-medium text-[#5d5d5d] dark:text-gray-300">
            {plans.map((plan) => (
              <div key={plan.plan} className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: plan.color }}
                  />
                  <span>{plan.name}</span>
                </div>
                <span className="font-semibold text-[#181818] dark:text-white">
                  {plan.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanDistribution;
