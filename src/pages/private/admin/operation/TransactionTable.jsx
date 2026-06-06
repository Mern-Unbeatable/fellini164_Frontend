import React, { useState } from 'react';
import ReplyModal from './components/ReplyModal';

/* ===================== DATA ===================== */

export default function TransactionTable() {
  const [modle, setModle] = useState(false);
  const handleOpenModal = () => setModle(true);
  const handleCloseModal = () => setModle(false);

  const handleSavePlan = (data) => {
    console.log('Saved plan:', data);
  };

  const transactions = [
    {
      id: 'TXT-001',
      subject: 'AI keeps representing itself',
      user: 'John Doe',
      priority: 'HIGH',
      status: 'Open',
    },
    {
      id: 'TXT-002',
      subject: 'Billing question',
      user: 'Alice Johnson',
      priority: 'LOW',
      status: 'Resolved',
    },
    {
      id: 'TXT-005',
      subject: 'Feature request: Dark Mode',
      user: 'Charlie Davis',
      priority: 'MEDIUM',
      status: 'In Progress',
    },
  ];

  /* ===================== HELPERS ===================== */
  const getPriorityColor = (p) =>
    p === 'HIGH' ? 'text-[#DC2626] bg-[#FEF2F2] ' : p === 'MEDIUM' ? 'text-[#CD8A04] bg-[#FEFCE8]' : 'text-[#16A34A] bg-[#F0FDF4]';

  const getStatusBg = (s) =>
    s === 'Open'
      ? 'text-[#B91C3B] bg-[#FEE2E2]'
      : s === 'Resolved'
        ? 'bg-gray-200 text-gray-700'
        : 'bg-blue-100 text-blue-700';

  return (
    <div className="   p-6 md:p-8">
      <div className=" hidden md:block">
        <div className="rounded-xl bg-white dark:bg-zinc-800 dark:text-white  shadow-sm border border-gray-300 dark:border-gray-700 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E0E5ED] dark:border-gray-700 dark:bg-zinc-800 dark:text-white">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transaction</h2>
            <span className="text-xs font-semibold bg-[#FEE2E2] text-[#B91C1C] px-2 py-1 rounded-sm">
              {transactions.filter((t) => t.status === 'Open').length} Open
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e0e5ed] dark:bg-zinc-700  dark:text-white dark:border-gray-700  ">
                  {['ID', 'SUBJECT', 'USER', 'PRIORITY', 'STATUS', 'ACTION'].map((h) => (
                    <th key={h} className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-100 ">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-gray-500 ">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-[#F8FBFE] dark:hover:bg-zinc-700  ">
                    <td className="px-6 py-4 text-base text-gray-600 dark:text-gray-200">{t.id}</td>
                    <td className="px-6 py-4 text-base text-gray-600 dark:text-gray-200">{t.subject}</td>
                    <td className="px-6 py-4 text-base text-gray-600 dark:text-gray-200">{t.user}</td>
                    <td className="px-6 py-4">


                      <samp className={`rounded-sm px-3 py-1 text-sm  ${getPriorityColor(t.priority)}`}>{t.priority}</samp>


                    </td>
                    <td className="px-6 py-4">
                      <span className={`rounded-sm px-3 py-1 text-xs ${getStatusBg(t.status)}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={handleOpenModal}
                        className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                      >
                        Reply
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className=" space-y-4 md:hidden">
        {transactions.map((t) => (
          <div key={t.id} className="space-y-3 rounded-xl  p-4 shadow-sm dark:bg-zinc-800">
            <div className="flex items-start justify-between">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-300">{t.subject}</h3>
              <span className={`rounded-sm   px-3 py-1 text-xs ${getPriorityColor(t.priority)}`}>
                {t.priority}
              </span>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-300">ID: {t.id}</p>
            <p className="text-sm text-gray-500 dark:text-gray-300">User: {t.user}</p>

            <div className="flex items-center justify-between pt-2">
              <span className={`rounded-sm   px-3 py-1 text-xs ${getStatusBg(t.status)}`}>
                {t.status}
              </span>
              <button onClick={handleOpenModal} className="text-sm font-medium text-purple-600 dark:text-purple-400">Reply</button>
            </div>
          </div>
        ))}
      </div>


      <ReplyModal open={modle}
        onClose={handleCloseModal}
        onSave={handleSavePlan} />
    </div>
  );
}
