import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { GET } from '../../../../../../services/httpMethods';

const SubscriptionTab = ({ user }) => {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchPayments = async () => {
      if (!user?.id) return;
      setLoading(true);
      setError(null);
      try {
        const resp = await GET(`/api/v1/admin/users/${user.id}/payments`);
        // resp may be { success, count, data: [] }
        let arr = resp?.data ?? resp;
        if (!Array.isArray(arr)) arr = arr?.data ?? [];
        if (mounted) setPaymentHistory(arr);
      } catch (err) {
        if (mounted) setError(err?.message || 'Failed to load payments');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPayments();
    return () => (mounted = false);
  }, [user?.id]);

  const currentPlan = user?.subscriptionPlan || user?.plan || 'Free';

  return (
    <div className="p-6">
      {/* Current Plan Card */}
      <div className="mb-8 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] dark:bg-gray-600 dark:border-gray-300 px-6 py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="mb-1 text-base font-semibold text-[#000000] dark:text-white">
              Current plan: <span className="text-[#000000] dark:text-white">{currentPlan}</span>
            </h3>
            <p className="text-sm text-[#90959D]">
              {/* If API provides renewal info, show here */}
              {user?.subscriptionEndDate
                ? `Renews on ${new Date(user.subscriptionEndDate).toLocaleDateString()}`
                : ''}
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-sm font-medium text-[#7C3AED] hover:text-[#6B21A8] dark:text-violet-400 dark:hover:text-violet-200">
              Upgrade
            </button>
            <button className="px-4 py-2 text-sm font-medium text-[#DC2626] hover:text-[#B91C1C] dark:text-red-400 dark:hover:text-red-200">
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div>
        <h3 className="mb-6 text-lg font-bold text-gray-900 dark:text-white">Payment History</h3>
        <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-600 border border-[#E5E7EB] dark:border-gray-300">
          {loading ? (
            <div className="p-6 text-center text-gray-500 dark:text-white">Loading payments...</div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">{error}</div>
          ) : paymentHistory.length === 0 ? (
            <div className="p-6 text-center text-gray-500 dark:text-white">No payments found.</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 dark:bg-gray-700">
                  <th className="px-6 py-6 text-left text-xs font-medium text-gray-600 dark:text-white">Date</th>
                  <th className="px-6 py-6 text-left text-xs font-medium text-gray-600 dark:text-white">Amount</th>
                  <th className="px-6 py-6 text-left text-xs font-medium text-gray-600 dark:text-white">Status</th>
                  <th className="px-6 py-6 text-left text-xs font-medium text-gray-600 dark:text-white">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((payment, idx) => (
                  <tr key={payment.id || idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {payment.date ||
                        payment.createdAt ||
                        (payment.createdAt && new Date(payment.createdAt).toLocaleDateString())}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-[#000000]">
                      {payment.amount || payment.total || payment.price || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-md bg-[#F5F3FF] px-3 py-1 text-xs font-semibold text-[#7C3AED]">
                        {payment.status || payment.paymentStatus || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-gray-400 hover:text-gray-600 dark:text-white dark:hover:text-white/90" >
                        <Download size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionTab;
