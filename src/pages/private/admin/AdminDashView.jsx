import { useSelector } from 'react-redux';
import { selectUser } from '../../../features/auth/authSlice';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import StatsCards from './components/StatsCards';
import RevenueChart from './components/RevenueChart';
import PlanDistribution from './components/PlanDistribution';
import { fetchAdminStats } from '../../../features/users/usersApi';

const AdminDashView = () => {
    // eslint-disable-next-line no-unused-vars
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const [stats, setStats] = useState({});

    useEffect(() => {
        let mounted = true;
        dispatch(fetchAdminStats())
            .unwrap()
            .then((data) => {
                if (mounted) setStats(data || {});
            })
            .catch(() => {});

        return () => {
            mounted = false;
        };
    }, [dispatch]);

    return (
        <div className=" py-7.5 max-lg:min-h-0 max-lg:py-4 max-lg:sm:py-6 ">
            <StatsCards stats={stats} />
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                <RevenueChart />
                <PlanDistribution stats={stats} />
            </div>
        </div>
    );
};

export default AdminDashView;
 