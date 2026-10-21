import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createCheckout, selectPaymentLoading } from '../../../../../features/users/paymentSlice';
import { selectIsAuthenticated } from '../../../../../features/auth/authSlice';
import { savePendingCheckout } from '../../../../../features/users/pendingCheckout';
import { MONTHLY_PLANS, PRICING_COMMITMENTS, YEARLY_PLANS } from '../../../../../components/pricing/pricingPlans';
import PricingToggle from '../../../../../components/pricing/PricingToggle';
import PricingCard from '../../../../../components/pricing/PricingPlanCard';

gsap.registerPlugin(ScrollTrigger);

const PricingHIW = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const paymentLoading = useSelector(selectPaymentLoading);
  const [billing, setBilling] = useState('yearly');
  const [loadingPlanId, setLoadingPlanId] = useState(null);
  const plans = billing === 'yearly' ? YEARLY_PLANS : MONTHLY_PLANS;
  const secRef = useRef(null);
  const headRef = useRef(null);
  const cr0 = useRef(null);
  const cr1 = useRef(null);
  const cr2 = useRef(null);
  const cr3 = useRef(null);
  const cardRefs = [cr0, cr1, cr2, cr3];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headRef.current, {
        opacity: 0, y: 20, duration: 0.5, ease: 'power2.out',
        scrollTrigger: { trigger: headRef.current, start: 'top 88%', once: true },
      });
      cardRefs.forEach((r, i) => {
        gsap.from(r.current, {
          opacity: 0, y: 20, duration: 0.5, ease: 'power2.out', delay: i * 0.1,
          scrollTrigger: { trigger: r.current, start: 'top 90%', once: true },
        });
      });
    }, secRef);
    return () => ctx.revert();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePlanCta = async (plan) => {
    if (paymentLoading || loadingPlanId) return;

    if (plan.id === 'free') {
      navigate(isAuthenticated ? '/dashboard' : '/signup');
      return;
    }

    if (!isAuthenticated) {
      savePendingCheckout({ plan: plan.name.toUpperCase(), billingPeriod: billing });
      toast.info('Please log in to continue checkout');
      navigate('/login');
      return;
    }

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
    <section ref={secRef} id="pricing" className="w-full border-y border-[#f2f2f2] bg-[#fcfcfc]">
      <div className="mx-auto flex max-w-385 flex-col gap-7.5 px-5 py-12.5 md:gap-12.5 md:px-20 md:py-22.5">
        <div ref={headRef} className="flex flex-col items-center gap-3.5 text-center md:gap-5">
          <div className="flex flex-col items-center gap-1 md:flex-row md:items-start md:justify-center md:gap-2.5">
            <h2 className="font-['Inter',sans-serif] text-[22px] leading-[1.3] font-bold text-[#181818] md:text-[34px]">
              Your day, fully managed by AI —{' '}
              <span className="text-[#8022fe]">From $6.39/month</span>
              <span className="text-[#14f1d9]">.</span>
            </h2>
            {billing === 'yearly' && (
              <p className="font-['Inter',sans-serif] text-[12px] leading-normal font-medium text-[#c2c2c2] md:text-[16px]">
                (Billed yearly)
              </p>
            )}
          </div>
          <p className="font-['Inter',sans-serif] text-[14px] leading-normal font-medium text-[#181818] md:text-[16px]">
            Start free. Upgrade when you need real productivity. Cancel anytime.
          </p>
        </div>

        <div className="flex flex-col items-center gap-5 md:gap-12.5">
          <PricingToggle billing={billing} onChange={setBilling} />

          <div className="flex w-full flex-col items-center gap-5 md:gap-7.5">
            <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
              {plans.map((plan, i) => (
                <PricingCard
                  key={plan.id}
                  plan={plan}
                  cardRef={cardRefs[i]}
                  billing={billing}
                  onCtaClick={handlePlanCta}
                  loading={loadingPlanId === plan.id}
                />
              ))}
            </div>

            <div className="flex w-full items-start justify-between px-5 md:justify-center md:gap-10 md:px-0">
              {PRICING_COMMITMENTS.map((t) => (
                <p key={t} className="font-['Inter',sans-serif] text-[10px] leading-normal font-medium text-[#c2c2c2] md:text-[12px]">
                  {t}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingHIW;
