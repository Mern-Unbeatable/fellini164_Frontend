import React, { useState } from 'react';

const CheckIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="mt-px shrink-0"
  >
    <circle cx="8" cy="8" r="7" stroke="#C2C2C2" strokeWidth="1" />
    <path
      d="M5 8.5L7 10.5L11 6"
      stroke="#8022FE"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const YEARLY_PLANS = [
  {
    id: 'free',
    name: 'Free',
    tagline: 'Limited features only',
    price: '$0',
    priceSuffix: '/yearly',
    billingNote: 'Free forever',
    cta: 'Start Free',
    ctaFilled: false,
    featured: false,
    features: [
      'Basic daily planning',
      'AI assistance (limited)',
      'Single active routine',
      'Basic task breakdown',
      '7-day history',
    ],
  },
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Get organized with AI',
    originalPrice: '$8',
    price: '$6.39',
    priceSuffix: '/yearly',
    billingNote: 'Billed annually',
    cta: 'Get Starter',
    ctaFilled: true,
    featured: true,
    badge: 'Best Value',
    features: [
      'Everything in Free',
      'Plan your tasks (daily & weekly)',
      'AI assistance for daily tasks',
      'Smart reminders',
      'Unlimited routines',
      'Goal tracking & progress insights',
      '1 AI assistant',
      'Monthly summary',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'AI that runs your entire day',
    originalPrice: '$18',
    price: '$14.39',
    priceSuffix: '/yearly',
    billingNote: 'Billed annually',
    cta: 'Get Pro',
    ctaFilled: false,
    featured: false,
    features: [
      'Everything in Starter',
      'Unlimited AI assistance',
      'Advanced automations',
      'Productivity insights',
      'Faster response speed',
      '3 AI assistants (different roles)',
    ],
  },
  {
    id: 'ultimate',
    name: 'Ultimate',
    tagline: 'Complete AI system for your life',
    originalPrice: '$40',
    price: '$31.99',
    priceSuffix: '/yearly',
    billingNote: 'Billed annually',
    cta: 'Get Ultimate',
    ctaFilled: false,
    featured: false,
    features: [
      'Everything in Pro',
      'Full life planning',
      'Voice coaching sessions',
      'Adaptive routine optimization',
      'Energy-based planning',
      'Monthly AI coaching session',
      'Early access to new features',
      'Unlimited AI assistants',
    ],
  },
];

const MONTHLY_PLANS = [
  {
    id: 'free',
    name: 'Free',
    tagline: 'Limited features only',
    price: '$0',
    priceSuffix: '/month',
    cta: 'Start Free',
    ctaFilled: false,
    featured: false,
    features: [
      'Basic daily planning',
      'AI assistance (limited)',
      'Single active routine',
      'Basic task breakdown',
      '7-day history',
    ],
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
    features: [
      'Everything in Free',
      'Plan your tasks (daily & weekly)',
      'AI assistance for daily tasks',
      'Smart reminders',
      'Unlimited routines',
      'Goal tracking & progress insights',
      '1 AI assistant',
      'Monthly summary',
    ],
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
    features: [
      'Everything in Starter',
      'Unlimited AI assistance',
      'Advanced automations',
      'Productivity insights',
      'Faster response speed',
      '3 AI assistants (different roles)',
    ],
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
    features: [
      'Everything in Pro',
      'Full life planning',
      'Voice coaching sessions',
      'Adaptive routine optimization',
      'Energy-based planning',
      'Monthly AI coaching session',
      'Early access to new features',
      'Unlimited AI assistants',
    ],
  },
];

const PricingCard = ({ plan }) => {
  const card = (
    <div
      className={`flex h-full flex-col items-start justify-between overflow-hidden rounded-[20px] bg-white shadow-[0px_7px_15px_rgba(0,0,0,0.02),0px_27px_27px_rgba(0,0,0,0.02),0px_61px_37px_rgba(0,0,0,0.01)] ${
        plan.featured
          ? 'border-2 border-[#8022fe]'
          : 'border border-[#f2f2f2]'
      }`}
    >
      {/* Header */}
      <div className="flex w-full shrink-0 flex-col gap-1.5 border-b border-[#f2f2f2] p-6">
        <p className="font-['Inter',sans-serif] text-[24px] font-semibold leading-[1.3] text-[#181818]">
          {plan.name}
        </p>
        <p className="font-['Inter',sans-serif] text-[16px] font-medium leading-normal text-[#181818]">
          {plan.tagline}
        </p>
      </div>

      {/* Pricing */}
      <div className="flex w-full shrink-0 flex-col gap-1 border-b border-[#f2f2f2] px-6 py-4">
        <div className="flex items-start gap-2.5">
          {plan.originalPrice && (
            <div className="relative flex shrink-0 items-center justify-center">
              <p className="font-['Inter',sans-serif] text-[34px] font-bold leading-[1.3] text-[#8022fe]">
                {plan.originalPrice}
              </p>
              <span className="absolute left-0 right-0 top-1/2 h-0.75 -translate-y-1/2 rounded-full bg-[#8022fe]" />
            </div>
          )}
          <div className="flex min-w-0 flex-1 items-baseline">
            <p className="shrink-0 font-['Inter',sans-serif] text-[34px] font-bold leading-[1.3] text-[#181818]">
              {plan.price}
            </p>
            <p className="min-w-0 flex-1 font-['Inter',sans-serif] text-[16px] font-medium leading-normal text-[#c2c2c2]">
              {plan.priceSuffix}
            </p>
          </div>
        </div>
        {plan.billingNote && (
          <p className="font-['Inter',sans-serif] text-[14px] font-medium leading-normal text-[#c2c2c2]">
            {plan.billingNote}
          </p>
        )}
      </div>

      {/* Features */}
      <div className="flex min-h-0 w-full flex-1 flex-col items-start p-6">
        <div className="flex flex-col gap-3.5">
          {plan.features.map((feature) => (
            <div key={feature} className="flex items-center gap-2">
              <CheckIcon />
              <p className="font-['Inter',sans-serif] text-[14px] font-medium leading-normal text-[#181818]">
                {feature}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="flex w-full shrink-0 flex-col items-start p-6">
        <button
          className={`w-full rounded-[10px] px-5 py-3 font-['Inter',sans-serif] text-[16px] font-semibold leading-none transition-colors ${
            plan.ctaFilled
              ? 'bg-[#8022fe] text-white hover:bg-[#6b1bdb]'
              : 'border-2 border-[#8022fe] bg-white text-[#8022fe] hover:bg-[#f9f4ff]'
          }`}
        >
          {plan.cta}
        </button>
      </div>
    </div>
  );

  if (plan.featured) {
    return (
      <div className="relative flex flex-col items-center gap-1.75">
        <div className="absolute -top-2.5 z-10 flex items-center justify-center rounded-[40px] bg-[#8022fe] px-2 py-0.5">
          <p className="font-['Inter',sans-serif] text-[12px] font-medium leading-normal text-white">
            {plan.badge}
          </p>
        </div>
        <div className="w-full flex-1">{card}</div>
      </div>
    );
  }

  return card;
};

const PricingSection = () => {
  const [billing, setBilling] = useState('yearly');
  const plans = billing === 'yearly' ? YEARLY_PLANS : MONTHLY_PLANS;

  return (
    <section id="pricing" className="w-full bg-[#fcfcfc] py-12 md:py-16 lg:py-22.5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-20">
        <div className="flex flex-col items-center gap-12.5">

          {/* Heading */}
          <div className="flex flex-col items-center gap-5 text-center">
            <div className="flex flex-wrap items-baseline justify-center gap-2.5">
              <p className="font-['Inter',sans-serif] text-[26px] font-bold leading-[1.3] text-[#181818] sm:text-[34px]">
                Your day, fully managed by AI —{' '}
                <span className="text-[#8022fe]">From $6.39/month</span>
                <span className="text-[#14f1d9]">.</span>
              </p>
              <p className="font-['Inter',sans-serif] text-[14px] font-medium leading-normal text-[#c2c2c2] sm:text-[16px]">
                (Billed yearly)
              </p>
            </div>
            <p className="font-['Inter',sans-serif] text-[14px] font-medium leading-normal text-[#181818] sm:text-[16px]">
              Start free. Upgrade when you need real productivity. Cancel anytime.
            </p>
          </div>

          {/* Toggle + Cards */}
          <div className="flex w-full flex-col items-center gap-12.5">

            {/* Toggle */}
            <div className="flex items-center overflow-hidden rounded-xl border border-[#f2f2f2] p-1">
              <button
                onClick={() => setBilling('monthly')}
                className={`rounded-lg px-5 py-2.5 font-['Inter',sans-serif] text-[14px] font-semibold transition-all ${
                  billing === 'monthly'
                    ? 'bg-white text-[#181818] shadow-[0px_0px_5px_rgba(0,0,0,0.05)]'
                    : 'text-[#c2c2c2]'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling('yearly')}
                className={`flex items-center gap-2 rounded-lg px-5 py-2.5 font-['Inter',sans-serif] text-[14px] font-semibold transition-all ${
                  billing === 'yearly'
                    ? 'bg-white text-[#8022fe] shadow-[0px_0px_5px_rgba(0,0,0,0.05)]'
                    : 'text-[#c2c2c2]'
                }`}
              >
                Yearly
                <span
                  className={`rounded-[40px] px-2 py-0.5 font-['Inter',sans-serif] text-[12px] font-medium text-white ${
                    billing === 'yearly' ? 'bg-[#8022fe]' : 'bg-[#c2c2c2]'
                  }`}
                >
                  Save 20%
                </span>
              </button>
            </div>

            {/* Cards */}
            <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {plans.map((plan) => (
                <PricingCard key={plan.id} plan={plan} />
              ))}
            </div>

            {/* Commitments */}
            <div className="flex flex-wrap items-center justify-center gap-10">
              {['No commitment', 'Cancel anytime', 'Secure payments'].map((text) => (
                <p
                  key={text}
                  className="font-['Inter',sans-serif] text-[12px] font-medium leading-normal text-[#c2c2c2]"
                >
                  {text}
                </p>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default PricingSection;
