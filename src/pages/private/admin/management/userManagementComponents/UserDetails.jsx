import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Lock, XCircle } from 'lucide-react';
import OverviewTab from './tabs/OverviewTab';
import SubscriptionTab from './tabs/SubscriptionTab';
import ActivityTab from './tabs/ActivityTab';
import LogsTab from './tabs/LogsTab';
import { GET } from '../../../../../services/httpMethods';

const UserDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const resp = await GET(`/api/v1/admin/users/${id}`);
        const data = resp?.data ?? resp;
        let u = null;
        if (Array.isArray(data)) {
          u = data.find((x) => String(x.id) === String(id)) || data[0] || null;
        } else {
          u = data || null;
        }

        if (mounted) {
          if (!u) {
            setError('User not found');
          } else {
            setUser(u);
          }
        }
      } catch (err) {
        setError(err?.message || 'Failed to load user');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchUser();

    return () => {
      mounted = false;
    };
  }, [id]);
  return (
    <div className="w-full p-4 md:p-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/admin/users')}
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 dark:text-white dark:hover:text-white/90"
      >
        <ArrowLeft size={18} />
        <span>Back to Users</span>
      </button>

      {/* User Info Card */}
      <div className="mb-6 rounded-lg bg-white dark:bg-zinc-800 p-6 shadow-sm">
        {loading && <div className="py-8 text-center text-gray-500 dark:text-white">Loading user...</div>}
        {error && <div className="py-8 text-center text-red-500">{error}</div>}
        {!loading && !error && user && (
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#7C3AED] text-2xl font-semibold text-white">
                {user.fullName
                  ? user.fullName.charAt(0).toUpperCase()
                  : user.name
                    ? user.name.charAt(0).toUpperCase()
                    : 'U'}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user.fullName || user.name || 'Unknown'}
                </h1>
                <p className="flex items-center gap-2 text-gray-500 dark:text-white/90">
                  <span>{user.email}</span>
                </p>
                <div className="mt-2 flex gap-2">
                  <span className="inline-flex rounded-md bg-[#F5F3FF] px-3 py-1 text-xs font-semibold text-[#7C3AED]">
                    {user.subscriptionPlan || user.plan || 'Free'}
                  </span>
                  <span className="inline-flex rounded-md bg-[#F0FDF4] px-3 py-1 text-xs font-semibold text-[#16A34A]">
                    {(user.userStatus &&
                      (user.userStatus === 'ACTIVE' ? 'Active' : user.userStatus)) ||
                      user.status ||
                      'Unknown'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-white dark:bg-zinc-700 dark:border-gray-600 dark:hover:bg-zinc-600">
                <Lock size={16} />
                <span>Reset Password</span>
              </button>
              <button className="flex items-center gap-2 rounded-md border border-[#DC2626] bg-[#FEF2F2] px-3 py-2 text-sm font-medium text-[#DC2626] hover:bg-red-100">
                <XCircle size={16} />
                <span>Suspended</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="rounded-lg bg-white dark:bg-zinc-800 shadow-sm">
        <div className="border-b border-gray-200 dark:border-zinc-700">
          <div className="flex gap-8 px-6">
            {['Overview', 'Subscription', 'Activity'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`border-b-2 py-4 text-sm font-medium transition ${
                  activeTab === tab.toLowerCase()
                    ? 'border-[#7C3AED] text-[#7C3AED]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-white/90 dark:hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && <OverviewTab user={user} />}
        {activeTab === 'subscription' && <SubscriptionTab user={user} />}
        {activeTab === 'activity' && <ActivityTab user={user} />}
      </div>
    </div>
  );
};

export default UserDetail;
