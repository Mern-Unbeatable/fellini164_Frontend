import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { CreditCard } from 'lucide-react';
import { createCheckout } from '../../../../../features/users/paymentSlice';
import { MONTHLY_PLANS, PRICING_COMMITMENTS, YEARLY_PLANS } from '../../../../../components/pricing/pricingPlans';
import PricingToggle from '../../../../../components/pricing/PricingToggle';
import PricingPlanCard from '../../../../../components/pricing/PricingPlanCard';
import SettingsCard from './SettingsCard';

export default function SubscriptionSection({ id, currentPlan, subscriptionStatus }) {
  const dispatch = useDispatch();
  const [billing, setBilling] = useState('yearly');
  const [loadingPlanId, setLoadingPlanId] = useState(null);
  const plans = billing === 'yearly' ? YEARLY_PLANS : MONTHLY_PLANS;
  const planLabel = currentPlan.charAt(0) + currentPlan.slice(1).toLowerCase();

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
      </div>
    </SettingsCard>
  );
}
