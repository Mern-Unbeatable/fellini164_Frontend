import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createCheckout, selectPaymentLoading } from '../../../../../features/users/paymentSlice';
import { selectIsAuthenticated } from '../../../../../features/auth/authSlice';

gsap.registerPlugin(ScrollTrigger);

const PRICING_CARD_SHADOW =
  'shadow-[0px_171px_48px_0px_rgba(0,0,0,0),0px_109px_44px_0px_rgba(0,0,0,0),0px_61px_37px_0px_rgba(0,0,0,0.01),0px_27px_27px_0px_rgba(0,0,0,0.02),0px_7px_15px_0px_rgba(0,0,0,0.02)]';

const YEARLY_PLANS = [
  {
    id: 'free',
    name: 'Free',
    tagline: 'Limited features only',
    price: '$0',
    priceSuffix: '/month',
    billingNote: 'Free forever',
    cta: 'Start Free',
    ctaFilled: false,
    featured: false,
    features: ['Basic daily planning', 'AI assistance (limited)', 'Single active routine', 'Basic task breakdown', '7-day history'],
  },
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Get organized with AI',
    originalPrice: '$8',
    price: '$6.39',
    priceSuffix: '/month',
    billingNote: 'Billed annually',
    cta: 'Get Starter',
    ctaFilled: true,
    featured: true,
    badge: 'Best Value',
    features: ['Everything in Free', 'Plan your tasks (daily & weekly)', 'AI assistance for daily tasks', 'Smart reminders', 'Unlimited routines', 'Goal tracking & progress insights', '1 AI assistant', 'Monthly summary'],
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'AI that runs your entire day',
    originalPrice: '$18',
    price: '$14.39',
    priceSuffix: '/month',
    billingNote: 'Billed annually',
    cta: 'Get Pro',
    ctaFilled: false,
    featured: false,
    features: ['Everything in Starter', 'Unlimited AI assistance', 'Advanced automations', 'Productivity insights', 'Faster response speed', '3 AI assistants (different roles)'],
  },
  {
    id: 'ultimate',
    name: 'Ultimate',
    tagline: 'Complete AI system for your life',
    originalPrice: '$40',
    price: '$31.99',
    priceSuffix: '/month',
    billingNote: 'Billed annually',
    cta: 'Get Ultimate',
    ctaFilled: false,
    featured: false,
    features: ['Everything in Pro', 'Full life planning', 'Voice coaching sessions', 'Adaptive routine optimization', 'Energy-based planning', 'Monthly AI coaching session', 'Early access to new features', 'Unlimited AI assistants'],
  },
];

const MONTHLY_PLANS = [
  {
    id: 'free',
    name: 'Free',
    tagline: 'Limited features only',
    price: '$0',
    priceSuffix: '/month',
    billingNote: 'Free forever',
    cta: 'Start Free',
    ctaFilled: false,
    featured: false,
    features: ['Basic daily planning', 'AI assistance (limited)', 'Single active routine', 'Basic task breakdown', '7-day history'],
  },
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Get organized with AI',
    price: '$7.99',
    priceSuffix: '/month',
    cta: 'Get Starter',
    ctaFilled: true,
    featured: true,
    badge: 'Best Value',
    features: ['Everything in Free', 'Plan your tasks (daily & weekly)', 'AI assistance for daily tasks', 'Smart reminders', 'Unlimited routines', 'Goal tracking & progress insights', '1 AI assistant', 'Monthly summary'],
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'AI that runs your entire day',
    price: '$17.99',
    priceSuffix: '/month',
    cta: 'Get Pro',
    ctaFilled: false,
    featured: false,
    features: ['Everything in Starter', 'Unlimited AI assistance', 'Advanced automations', 'Productivity insights', 'Faster response speed', '3 AI assistants (different roles)'],
  },
  {
    id: 'ultimate',
    name: 'Ultimate',
    tagline: 'Complete AI system for your life',
    price: '$39.99',
    priceSuffix: '/month',
    cta: 'Get Ultimate',
    ctaFilled: false,
    featured: false,
    features: ['Everything in Pro', 'Full life planning', 'Voice coaching sessions', 'Adaptive routine optimization', 'Energy-based planning', 'Monthly AI coaching session', 'Early access to new features', 'Unlimited AI assistants'],
  },
];

const PlanCheckIcon = () => (
  <svg width={16} height={16} viewBox="0 0 16 16" fill="none" className="size-3.5 shrink-0 md:size-4">
    <circle cx="8" cy="8" r="7" stroke="#C2C2C2" strokeWidth="1" />
    <path d="M5 8.5L7 10.5L11 6" stroke="#8022FE" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const StrikethroughPrice = ({ price }) => (
  <div className="relative flex shrink-0 items-center">
    <p className="font-['Inter',sans-serif] text-[22px] leading-[1.3] font-bold text-[#8022fe] md:text-[34px]">
      {price}
    </p>
    <span className="absolute top-1/2 right-0 left-0 h-0.5 -translate-y-1/2 bg-[#8022fe] md:h-0.75" />
  </div>
);

const PricingToggle = ({ billing, onChange }) => (
  <div className="flex w-full items-center overflow-hidden rounded-xl border border-[#f2f2f2] p-1 md:w-67">
    {['monthly', 'yearly'].map((opt) => {
      const isActive = billing === opt;
      return (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`flex flex-1 items-center justify-center rounded-lg px-5 py-2.5 font-['Inter',sans-serif] text-[12px] font-semibold capitalize transition-all md:flex-none md:text-[14px] ${
            isActive ? 'bg-white text-[#8022fe] shadow-[0px_0px_5px_rgba(0,0,0,0.05)]' : 'text-[#c2c2c2]'
          } ${opt === 'yearly' ? 'gap-2' : ''}`}
        >
          {opt === 'yearly' ? 'Yearly' : 'Monthly'}
          {opt === 'yearly' && (
            <span
              className={`rounded-[40px] px-2 py-0.5 font-['Inter',sans-serif] text-[10px] font-medium text-white shadow-[0px_0px_5px_rgba(128,34,254,0.3)] md:text-[12px] ${
                isActive ? 'bg-[#8022fe]' : 'bg-[#c2c2c2]'
              }`}
            >
              Save 20%
            </span>
          )}
        </button>
      );
    })}
  </div>
);

const PricingCard = ({ plan, cardRef, billing, onCtaClick, loading }) => {
  const isYearly = billing === 'yearly';
  const showDiscount = isYearly && plan.originalPrice;
  const borderClass = plan.featured ? 'border-2 border-[#8022fe]' : 'border border-[#f2f2f2]';

  const cardBody = (
    <>
      <div className="flex w-full flex-1 flex-col">
        <div className="flex w-full flex-col gap-1 border-b border-[#f2f2f2] p-5 md:gap-1.5 md:p-6">
          <p className="font-['Inter',sans-serif] text-[18px] leading-[1.3] font-semibold text-[#181818] md:text-[24px]">
            {plan.name}
          </p>
          <p className="font-['Inter',sans-serif] text-[14px] leading-normal font-medium text-[#181818] md:text-[16px]">
            {plan.tagline}
          </p>
        </div>

        <div className="border-b border-[#f2f2f2] px-5 py-3.5 md:flex md:flex-col md:gap-1 md:px-6 md:py-4">
          <div className="flex w-full items-center gap-1.5 md:items-start md:gap-2.5">
            {showDiscount && <StrikethroughPrice price={plan.originalPrice} />}
            <div className="flex items-baseline">
              <p className="font-['Inter',sans-serif] text-[22px] leading-[1.3] font-bold text-[#181818] md:text-[34px]">
                {plan.price}
              </p>
              <p className="font-['Inter',sans-serif] text-[12px] leading-normal font-medium text-[#c2c2c2] md:text-[16px]">
                {plan.priceSuffix}
              </p>
            </div>
            {plan.billingNote && (
              <p className="ml-auto shrink-0 font-['Inter',sans-serif] text-[12px] leading-normal font-medium text-[#c2c2c2] md:hidden">
                {plan.billingNote}
              </p>
            )}
          </div>
          {plan.billingNote && (
            <p className="hidden font-['Inter',sans-serif] text-[14px] leading-normal font-medium text-[#c2c2c2] md:block">
              {plan.billingNote}
            </p>
          )}
        </div>

        <div className="flex flex-1 flex-col px-5 pt-5 pb-2.5 md:p-6">
          <div className="flex flex-col gap-2.5 md:gap-3.5">
            {plan.features.map((f) => (
              <div key={f} className="flex items-center gap-1.5 md:gap-2">
                <PlanCheckIcon />
                <p className="font-['Inter',sans-serif] text-[12px] leading-normal font-medium text-[#181818] md:text-[14px]">
                  {f}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 pt-2.5 pb-5 md:p-6">
        <button
          type="button"
          disabled={loading}
          onClick={() => onCtaClick?.(plan)}
          className={`w-full rounded-[10px] px-5 py-3 font-['Inter',sans-serif] text-[14px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 md:text-[16px] ${
            plan.ctaFilled
              ? 'bg-[#8022fe] text-white hover:bg-[#6b1bdb]'
              : 'border-2 border-[#8022fe] bg-white text-[#8022fe] hover:bg-[#f9f4ff]'
          }`}
        >
          {loading ? 'Processing...' : plan.cta}
        </button>
      </div>
    </>
  );

  if (plan.featured) {
    return (
      <div ref={cardRef} className="relative flex w-full flex-col items-center md:h-full">
        <div
          className={`relative flex h-115 w-full flex-col justify-between overflow-hidden rounded-2xl bg-white md:h-full md:min-h-155 md:rounded-[20px] ${borderClass} ${PRICING_CARD_SHADOW}`}
        >
          {cardBody}
        </div>
        <div className="absolute top-[-8.5px] left-1/2 z-10 flex -translate-x-1/2 items-center justify-center rounded-[40px] bg-[#8022fe] px-2 py-0.5 drop-shadow-[0px_0px_5px_rgba(128,34,254,0.3)] md:-top-2.5">
          <p className="font-['Inter',sans-serif] text-[10px] leading-normal font-medium text-white md:text-[12px]">
            {plan.badge}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={cardRef} className="w-full">
      <div
        className={`flex h-115 flex-col justify-between overflow-hidden rounded-2xl bg-white md:h-full md:min-h-155 md:rounded-[20px] ${borderClass} ${PRICING_CARD_SHADOW}`}
      >
        {cardBody}
      </div>
    </div>
  );
};

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
              {['No commitment', 'Cancel anytime', 'Secure payments'].map((t) => (
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
