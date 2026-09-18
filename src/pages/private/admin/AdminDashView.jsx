import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import StatsCards from './components/StatsCards';
import RevenueChart from './components/RevenueChart';
import PlanDistribution from './components/PlanDistribution';
import LatestActiveUsers from './components/LatestActiveUsers';
import { fetchAdminStats } from '../../../features/users/usersApi';

const AdminDashView = () => {
  const dispatch = useDispatch();
  const [stats, setStats] = useState({});
  const [period, setPeriod] = useState('7d');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    dispatch(fetchAdminStats({ period }))
      .unwrap()
      .then((data) => {
        if (mounted) setStats(data || {});
      })
      .catch(() => {
        if (mounted) setStats({});
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [dispatch, period]);

  return (
    <div className="py-7.5 max-lg:min-h-0 max-lg:py-4 max-lg:sm:py-6">
      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <RevenueChart
          series={stats?.revenueAndUserGrowth?.series}
          period={period}
          onPeriodChange={setPeriod}
          loading={loading}
        />
        <PlanDistribution planDistribution={stats?.planDistribution} />
      </div>

      <LatestActiveUsers users={stats?.latestActiveUsers} />
    </div>
  );
};

export default AdminDashView;
