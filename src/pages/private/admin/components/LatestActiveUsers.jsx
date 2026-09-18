import React from 'react';

function formatJoinedAt(iso) {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const LatestActiveUsers = ({ users = [] }) => {
  const list = Array.isArray(users) ? users.slice(0, 5) : [];

  return (
    <div className="mt-6 rounded-xl border border-[#f2f2f2] bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
      <div className="border-b border-[#f2f2f2] px-5 py-3.5 dark:border-zinc-700">
        <h2 className="text-[16px] font-medium text-[#181818] dark:text-white">Latest New Users</h2>
        <p className="mt-0.5 text-[12px] font-medium text-[#c2c2c2] dark:text-zinc-500">
          Last 5 users from admin stats
        </p>
      </div>

      {list.length === 0 ? (
        <div className="px-5 py-8 text-center text-[13px] font-medium text-[#a3a3a3] dark:text-zinc-400">
          No recent users found.
        </div>
      ) : (
        <>
          <div className="divide-y divide-[#f2f2f2] dark:divide-zinc-700 lg:hidden">
            {list.map((user) => (
              <div key={user.id} className="px-5 py-3.5">
                <p className="text-[14px] font-medium text-[#181818] dark:text-white">
                  {user.fullName || 'N/A'}
                </p>
                <p className="mt-0.5 text-[12px] font-medium text-[#5d5d5d] dark:text-gray-300">
                  {user.email || '—'}
                </p>
                <div className="mt-2 flex items-center justify-between text-[12px] font-medium text-[#a3a3a3]">
                  <span>{user.referralCode || '—'}</span>
                  <span>{formatJoinedAt(user.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full text-left">
              <thead className="border-b border-[#f2f2f2] bg-[#fcfcfc] dark:border-zinc-700 dark:bg-zinc-800">
                <tr>
                  <th className="px-5 py-2.5 text-[12px] font-medium tracking-wider text-[#c2c2c2] uppercase dark:text-zinc-500">
                    Name
                  </th>
                  <th className="px-5 py-2.5 text-[12px] font-medium tracking-wider text-[#c2c2c2] uppercase dark:text-zinc-500">
                    Email
                  </th>
                  <th className="px-5 py-2.5 text-[12px] font-medium tracking-wider text-[#c2c2c2] uppercase dark:text-zinc-500">
                    Referral
                  </th>
                  <th className="px-5 py-2.5 text-end text-[12px] font-medium tracking-wider text-[#c2c2c2] uppercase dark:text-zinc-500">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2f2f2] dark:divide-zinc-700">
                {list.map((user) => (
                  <tr
                    key={user.id}
                    className="transition-colors hover:bg-[#fcfcfc] dark:hover:bg-zinc-700/50"
                  >
                    <td className="px-5 py-2.5 text-[13px] font-medium text-[#181818] dark:text-white">
                      {user.fullName || 'N/A'}
                    </td>
                    <td className="px-5 py-2.5 text-[13px] font-medium text-[#5d5d5d] dark:text-gray-300">
                      {user.email || '—'}
                    </td>
                    <td className="px-5 py-2.5 text-[13px] font-medium text-[#5d5d5d] dark:text-gray-300">
                      {user.referralCode || '—'}
                    </td>
                    <td className="px-5 py-2.5 text-end text-[13px] font-medium text-[#5d5d5d] dark:text-gray-300">
                      {formatJoinedAt(user.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default LatestActiveUsers;
