import { useState, useEffect } from 'react';
import { DollarSign, CreditCard, TriangleAlert } from 'lucide-react';
import AllPagination from '../../../../components/common/AllPagination';
import { GET } from '../../../../services/httpMethods';

const TransactionMobileCard = ({ tx }) => (
  <div className="mb-3 rounded-lg border border-[#f2f2f2] dark:border-zinc-700 bg-white dark:bg-zinc-800 p-4 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)]">
    <div className="mb-3 flex items-start justify-between">
      <div>
        <div className="text-[10px] font-medium text-[#c2c2c2] dark:text-zinc-500 uppercase">{tx.id}</div>
        <div className="text-[14px] font-medium text-[#181818] dark:text-white">{tx.user}</div>
      </div>
      <span
        className={`inline-flex rounded-[6px] px-2 py-0.75 text-[12px] font-medium ${
          tx.status === 'SUCCESS'
            ? 'bg-green-50 text-green-600 border border-green-100'
            : tx.status === 'FAILED'
              ? 'bg-red-50 text-red-500 border border-red-100'
              : 'bg-gray-50 text-gray-500 border border-gray-100'
        }`}
      >
        {tx.status}
      </span>
    </div>

    <div className="space-y-2 border-t border-[#f2f2f2] dark:border-zinc-700 pt-3">
      <div className="flex justify-between text-[12px] font-medium">
        <span className="text-[#c2c2c2] dark:text-zinc-500">Plan:</span>
        <span className="text-[#5d5d5d] dark:text-gray-300">{tx.plan}</span>
      </div>
      <div className="flex justify-between text-[12px] font-medium">
        <span className="text-[#c2c2c2] dark:text-zinc-500">Date:</span>
        <span className="text-[#5d5d5d] dark:text-gray-300">{tx.date}</span>
      </div>
      <div className="flex items-center justify-between text-[12px] font-medium">
        <span className="text-[#c2c2c2] dark:text-zinc-500">Amount:</span>
        <span className="text-[14px] font-semibold text-[#181818] dark:text-white">{tx.amount}</span>
      </div>
    </div>
  </div>
);

const FinanceAndSubscriptions = () => {
  // --- Pagination Logic Start ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchPayments = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await GET('/api/v1/payments/history');
        let list = [];
        if (Array.isArray(res)) list = res;
        else if (res && Array.isArray(res.data)) list = res.data;
        else if (res && Array.isArray(res.payments)) list = res.payments;
        else if (res && Array.isArray(res.paymentsHistory)) list = res.paymentsHistory;
        if (mounted) setTransactions(list);
      } catch (err) {
        if (mounted) setError(err?.message || 'Failed to load transactions');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchPayments();
    return () => {
      mounted = false;
    };
  }, []);

  const totalResults = transactions.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / itemsPerPage));

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstItem, indexOfLastItem);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  return (
    <div className="w-full py-7.5 max-lg:min-h-0 max-lg:py-4 max-lg:sm:py-6">
      {/* Stats Cards Section */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:mb-8 md:grid-cols-3 md:gap-6">
        <div className="relative rounded-xl border border-[#f2f2f2] dark:border-zinc-700 bg-white dark:bg-zinc-800 p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="rounded-lg bg-[#F0FDF4] p-2">
              <DollarSign className="h-5 w-5 text-[#22A853]" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-[20px] font-medium text-[#181818] dark:text-white leading-normal">$0</h3>
            <p className="text-[12px] font-medium text-[#c2c2c2] dark:text-zinc-500">Monthly Recurring Revenue</p>
          </div>
        </div>

        <div className="relative rounded-xl border border-[#f2f2f2] dark:border-zinc-700 bg-white dark:bg-zinc-800 p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="rounded-lg bg-[#EFF6FF] p-2">
              <CreditCard className="h-5 w-5 text-[#2563EB]" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-[20px] font-medium text-[#181818] dark:text-white leading-normal">0</h3>
            <p className="text-[12px] font-medium text-[#c2c2c2] dark:text-zinc-500">Active Subscriptions</p>
          </div>
        </div>

        <div className="relative rounded-xl border border-[#f2f2f2] dark:border-zinc-700 bg-white dark:bg-zinc-800 p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="rounded-lg bg-[#FFF7ED] p-2">
              <TriangleAlert className="h-5 w-5 text-[#FF5902]" />
            </div>
            <span className="rounded-full bg-[#F3F4F5] px-2 py-0.75 text-[12px] font-medium text-[#5C6370] dark:bg-zinc-700 dark:text-gray-300">
              Needs Attention
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-[20px] font-medium text-[#181818] dark:text-white leading-normal">0</h3>
            <p className="text-[12px] font-medium text-[#c2c2c2] dark:text-zinc-500">Failed Payments</p>
          </div>
        </div>
      </div>

      {/* Recent Transactions Section */}
      <div className="overflow-hidden rounded-xl border border-[#f2f2f2] dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)]">
        <div className="flex items-center justify-between border-b border-[#f2f2f2] dark:border-zinc-700 px-6 py-3.5 text-base font-medium text-black">
          <h2 className="text-[16px] font-medium text-[#181818] dark:text-white">Recent Transactions</h2>
        </div>

        {/* --- Mobile Card View --- */}
        <div className="p-4 lg:hidden">
          {!loading && !error && transactions.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500 dark:text-gray-200">No transactions found.</div>
          ) : (
            currentTransactions.map((tx, idx) => (
              <TransactionMobileCard key={`${tx.id}-${idx}`} tx={tx} />
            ))
          )}
        </div>

        {/* --- Desktop Table View --- */}
        <div className="hidden overflow-hidden lg:block">
          <div className="overflow-x-auto">
            {!loading && !error && transactions.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500 dark:text-gray-200">No transactions found.</div>
            ) : (
              <table className="w-full text-left">
                <thead className="border-b border-[#f2f2f2] bg-[#fcfcfc] dark:bg-zinc-800">
                  <tr>
                    <th className="px-6 py-2.5 text-[12px] font-medium text-[#c2c2c2] uppercase tracking-wider dark:text-zinc-500">
                      ID
                    </th>
                    <th className="px-6 py-2.5 text-center text-[12px] font-medium text-[#c2c2c2] uppercase tracking-wider dark:text-zinc-500">
                      User
                    </th>
                    <th className="px-6 py-2.5 text-center text-[12px] font-medium text-[#c2c2c2] uppercase tracking-wider dark:text-zinc-500">
                      Plan
                    </th>
                    <th className="px-6 py-2.5 text-center text-[12px] font-medium text-[#c2c2c2] uppercase tracking-wider dark:text-zinc-500">
                      Amount
                    </th>
                    <th className="px-6 py-2.5 text-center text-[12px] font-medium text-[#c2c2c2] uppercase tracking-wider dark:text-zinc-500">
                      Date
                    </th>
                    <th className="px-6 py-2.5 text-end text-[12px] font-medium text-[#c2c2c2] uppercase tracking-wider dark:text-zinc-500">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f2f2f2] dark:divide-zinc-700">
                  {currentTransactions.map((tx, idx) => (
                    <tr
                      key={`${tx.id}-${idx}`}
                      className="border-b border-[#f2f2f2] dark:border-zinc-700 transition-colors hover:bg-[#fcfcfc] dark:hover:bg-zinc-700/50"
                    >
                      <td className="truncate px-6 py-2.5 text-[12px] font-medium text-[#5d5d5d] dark:text-gray-300">{tx.id}</td>
                      <td className="truncate px-6 py-2.5 text-center text-[12px] font-medium text-[#5d5d5d] dark:text-gray-300">{tx.user}</td>
                      <td className="truncate px-6 py-2.5 text-center text-[12px] font-medium text-[#5d5d5d] dark:text-gray-300">{tx.plan}</td>
                      <td className="truncate px-6 py-2.5 text-center text-[12px] font-semibold text-[#181818] dark:text-white">
                        {tx.amount}
                      </td>
                      <td className="truncate px-6 py-2.5 text-center text-[12px] font-medium text-[#5d5d5d] dark:text-gray-300">{tx.date}</td>
                      <td className="truncate px-6 py-2.5 text-end">
                        <span
                          className={`inline-flex rounded-[6px] px-2 py-0.75 text-[12px] font-medium ${
                            tx.status === 'SUCCESS'
                              ? 'bg-green-50 text-green-600 border border-green-100'
                              : tx.status === 'FAILED'
                                ? 'bg-red-50 text-red-500 border border-red-100'
                                : 'bg-gray-50 text-gray-500 border border-gray-100'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Pagination Component */}
        <div className="pb-4 lg:p-4">
          {!loading && !error && transactions.length > 0 && (
            <AllPagination
              currentPage={currentPage}
              handleNext={handleNext}
              handlePrevious={handlePrevious}
              indexOfFirstItem={indexOfFirstItem}
              indexOfLastItem={Math.min(indexOfLastItem, totalResults)}
              totalPages={totalPages}
              totalResults={totalResults}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FinanceAndSubscriptions;
