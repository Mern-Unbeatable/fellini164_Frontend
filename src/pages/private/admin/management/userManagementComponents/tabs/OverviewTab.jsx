import React from 'react';

const formatDate = (iso) => {
  if (!iso) return '-';
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch (e) {
    return e;
  }
};

const OverviewTab = ({ user }) => {
  if (!user) {
    return (
      <div className="p-6">
        <div className="text-center text-sm text-gray-500 dark:text-white">No user data available.</div>
      </div>
    );
  }

  const joined = user.createdAt || user.joined || '-';
  const lastActive = user.lastLogin || user.lastActive || '-';
  const lastIp = user.lastIp || user.last_ip || user.lastLogin || '-';

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Personal Details (left) - simplified per request */}
        <div className="rounded-md bg-white dark:bg-gray-600 overflow-hidden">
          <div className="px-6 py-4">
            <h3 className="text-lg font-semibold text-[#000000] dark:text-white">Personal Details</h3>
          </div>
          <div className="border-t border-[#E5E7EB] dark:border-gray-600 px-6 py-6">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
                <div className="sm:w-40 w-full text-sm text-[#9CA3AF] dark:text-white mb-1 sm:mb-0">Full Name</div>
                <div className="flex-1 text-sm font-medium text-[#1A1A1A] dark:text-white">{user.fullName || user.name || '-'}</div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
                <div className="sm:w-40 w-full text-sm text-[#9CA3AF] dark:text-white mb-1 sm:mb-0">Email</div>
                <div className="flex-1 text-sm font-medium text-[#1A1A1A] dark:text-white">{user.email || '-'}</div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
                <div className="sm:w-40 w-full text-sm text-[#9CA3AF] dark:text-white mb-1 sm:mb-0">Joined</div>
                <div className="flex-1 text-sm font-medium text-[#1A1A1A] dark:text-white">{formatDate(joined)}</div>
              </div>

              
            </div>
          </div>
        </div>

        {/* Engagement Stats (right) - restored UI */}
        <div className="rounded-md bg-white dark:bg-gray-600">
          <div className="px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Engagement Stats</h3>
          </div>
          <div className="border-t border-[#E5E7EB]  px-6 py-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col items-center justify-center rounded-lg bg-gray-50 dark:bg-zinc-700 p-6">
                <div className="text-4xl font-semibold text-[#7C3AED]">0%</div>
                <div className="mt-2 text-sm text-[#9CA3AF] dark:text-white">Habit Completion</div>
              </div>

              <div className="flex flex-col items-center justify-center rounded-lg bg-gray-50 dark:bg-zinc-700 p-6">
                <div className="text-4xl font-semibold text-[#2563EB]">0</div>
                <div className="mt-2 text-sm text-[#9CA3AF] dark:text-white">AI Messages</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
