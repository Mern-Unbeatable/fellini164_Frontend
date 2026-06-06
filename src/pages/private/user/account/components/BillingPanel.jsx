import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createCheckout,
  selectCheckoutData,
  selectPaymentError,
  selectPaymentLoading,
} from '../../../../../features/users/paymentSlice.js';

const SelectedPlanInfo = ({ selectedPlan, amount, currency, period }) => {
  const display = useMemo(() => ({
    amountStr: (amount / 100).toFixed(2),
    currency: currency || 'USD',
  }), [amount, currency]);

  return (
    <div className="mb-6 p-4 bg-gray-50 dark:bg-zinc-700 rounded-lg">
      <h4 className="text-lg font-semibold mb-2">{selectedPlan.name} Plan</h4>
      <p className="text-2xl font-bold text-purple-600 mb-3">
        ${display.amountStr} {display.currency}
        <span className="text-sm font-normal text-gray-500 dark:text-white"> / {period}</span>
      </p>
      <ul className="space-y-2">
        {(selectedPlan.features || []).map((feature, idx) => (
          <li key={idx} className="flex items-start text-sm text-gray-700 dark:text-gray-200">
            <span className="mr-2 text-green-600">✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const BillingPanel = ({ amount = 500, currency = 'USD', productId = 'custom', planName = '', selectedPlan = null, period = 'monthly', customer = {} }) => {
  const dispatch = useDispatch();
  const checkoutData = useSelector(selectCheckoutData);
  const loading = useSelector(selectPaymentLoading);
  const error = useSelector(selectPaymentError);

  const displayAmount = useMemo(() => (amount / 100).toFixed(2), [amount]);

  const handlePayNow = useCallback(async () => {
    const payload = {
      plan: planName,
      amount: Math.round(amount),
      currency: (currency || 'USD').toUpperCase(),
      productId,
      quantity: 1,
      customer: customer || { email: '' },
      paymentMethod: 'paypal',
    };

    try {
      const resultAction = await dispatch(createCheckout(payload));
      if (createCheckout.fulfilled.match(resultAction)) {
        const sessionUrl = resultAction.payload?.url;
        if (sessionUrl) window.open(sessionUrl, '_blank');
      } else {
        // keep existing behavior (errors handled elsewhere)
        // eslint-disable-next-line no-console
        console.error('Checkout failed:', resultAction.payload || resultAction.error);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Checkout exception:', err);
    }
  }, [dispatch, planName, amount, currency, productId, customer]);

  return (
    <div className="flex flex-col rounded-lg bg-white dark:bg-zinc-800 p-6 shadow-sm w-full max-w-md mx-auto">
      <h3 className="mb-4 text-xl font-semibold">Pay with PayPal</h3>

      {selectedPlan && (
        <SelectedPlanInfo selectedPlan={selectedPlan} amount={amount} currency={currency} period={period} />
      )}

      <p className="mb-6 text-gray-600 dark:text-gray-200">
        Total Amount: <strong>{displayAmount} {currency}</strong>
      </p>

      <button
        onClick={handlePayNow}
        disabled={loading}
        className="w-full rounded bg-violet-500 py-3 text-white font-semibold transition"
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>

      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
};

export default BillingPanel;
