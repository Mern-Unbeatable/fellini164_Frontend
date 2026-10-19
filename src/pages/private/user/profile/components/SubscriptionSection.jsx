import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { CreditCard } from 'lucide-react';
import {
  cancelSubscription,
  createCheckout,
  selectCancellingSubscription,
} from '../../../../../features/users/paymentSlice';
import { getSubscriptionStatus } from '../../../../../features/auth/profileApi';
import { updateAuthUser } from '../../../../../features/auth/authSlice';
import { MONTHLY_PLANS, PRICING_COMMITMENTS, YEARLY_PLANS } from '../../../../../components/pricing/pricingPlans';
import PricingToggle from '../../../../../components/pricing/PricingToggle';
import PricingPlanCard from '../../../../../components/pricing/PricingPlanCard';
import SettingsCard from './SettingsCard';
import CancelSubscriptionModal from './CancelSubscriptionModal';

function formatDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function SubscriptionSection({ id, currentPlan, subscription, subscriptionStatus }) {
  const dispatch = useDispatch();
  const cancelling = useSelector(selectCancellingSubscription);
  const [billing, setBilling] = useState('yearly');
  const [loadingPlanId, setLoadingPlanId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const plans = billing === 'yearly' ? YEARLY_PLANS : MONTHLY_PLANS;
  const planLabel = currentPlan.charAt(0) + currentPlan.slice(1).toLowerCase();

  const isPaidPlan = currentPlan !== 'FREE';
  const isCancelled =
    Boolean(subscription?.cancelAtPeriodEnd) || /cancel/i.test(String(subscription?.status || ''));
  const periodEnd = formatDate(subscription?.currentPeriodEnd || subscription?.periodEnd || subscription?.endsAt);

  const handlePlanCta = async (plan) => {
    if (loadingPlanId || plan.id === 'free') return;

    setLoadingPlanId(plan.id);
    try {
      const data = await dispatch(
        createCheckout({
          plan: plan.name.toUpperCase(),
          billingPeriod: billing,
        })
      ).unwrap();

      if (data?.url) {
        window.location.href = data.url;
        return;
      }

      toast.error('Checkout URL missing');
    } catch (error) {
      toast.error(error || 'Failed to start checkout');
    } finally {
      setLoadingPlanId(null);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      const result = await dispatch(cancelSubscription()).unwrap();
      toast.success(result?.message || 'Your subscription has been cancelled');
      setConfirmOpen(false);
      const status = await dispatch(getSubscriptionStatus()).unwrap().catch(() => null);
      if (status?.plan) {
        dispatch(updateAuthUser({ subscriptionPlan: status.plan }));
      }
    } catch (error) {
      toast.error(error || 'Failed to cancel subscription');
    }
  };

  return (
    <SettingsCard
      id={id}
      icon={CreditCard}
      title="Subscription & Billing"
      description={
        subscriptionStatus
          ? `You're on the ${planLabel} plan · Status: ${subscriptionStatus}`
          : `You're on the ${planLabel} plan`
      }
    >
      <div className="flex flex-col items-center gap-7.5">
        <PricingToggle billing={billing} onChange={setBilling} />

        <div className="grid w-full grid-cols-1 gap-5 pt-2.5 md:grid-cols-2 2xl:grid-cols-4">
          {plans.map((plan) => (
            <PricingPlanCard
              key={plan.id}
              plan={plan}
              billing={billing}
              onCtaClick={handlePlanCta}
              loading={loadingPlanId === plan.id}
              isCurrent={plan.name.toUpperCase() === currentPlan}
              ctaDisabled={plan.id === 'free'}
            />
          ))}
        </div>

        <div className="flex w-full items-start justify-between md:justify-center md:gap-10">
          {PRICING_COMMITMENTS.map((t) => (
            <p key={t} className="font-['Inter',sans-serif] text-[10px] leading-normal font-medium text-[#c2c2c2] md:text-[12px]">
              {t}
            </p>
          ))}
        </div>

        {isPaidPlan && (
          <div className="flex w-full flex-wrap items-center justify-between gap-3 rounded-xl border border-[#f2f2f2] bg-[#fcfcfc] px-4 py-3.5 dark:border-zinc-700 dark:bg-zinc-800">
            <div className="min-w-0">
              <p className="text-[14px] font-medium text-[#181818] dark:text-white">
                {isCancelled ? 'Subscription cancelled' : 'Cancel subscription'}
              </p>
              <p className="mt-0.5 text-[12px] font-medium text-[#c2c2c2] dark:text-zinc-500">
                {isCancelled
                  ? periodEnd
                    ? `You'll keep ${planLabel} features until ${periodEnd}.`
                    : `You'll keep ${planLabel} features until the end of your billing period.`
                  : 'Stop future payments. You keep access until the end of your billing period.'}
              </p>
            </div>
            {!isCancelled && (
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                disabled={cancelling}
                className="shrink-0 rounded-xl border border-[rgba(220,38,38,0.2)] px-3 py-1.5 text-[13px] font-semibold text-[#dc2626] transition hover:bg-[rgba(220,38,38,0.05)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel subscription
              </button>
            )}
          </div>
        )}
      </div>

      <CancelSubscriptionModal
        open={confirmOpen}
        planLabel={planLabel}
        submitting={cancelling}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleCancelSubscription}
      />
    </SettingsCard>
  );
}
