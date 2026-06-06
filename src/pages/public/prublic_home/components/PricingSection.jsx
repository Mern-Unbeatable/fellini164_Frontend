import React, { useState } from 'react';
import PricingCard from './PricingCard';

const PricingSection = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [selectedPlan, setSelectedPlan] = useState('PRO');

  const pricingPlans = [
    {
      name: 'FREE',
      description: 'Perfect for Getting Started',
      price: 0,
      buttonText: 'Start',
      buttonStyle: 'bg-gray-100 hover:bg-gray-200 text-black',
      outlineStyle: 'outline-1 outline-offset-[-1px] outline-gray-100',
      nameColor: 'text-black',
      features: [
        "20 AI messages/day (or 200/month)",
        "1 habit tracker",
        "1 routine",
        "Basic daily planner",
        "Basic task breakdown",
        "Limited history",
        "1 basic AI persona",
        "Watermark on AI reports",
        "Email login only",
        "Designed for onboarding & habit formation"
      ],
    },
    {
      name: 'STARTER',
      description: 'For Daily Productivity',

      monthlyPrice: "$7.99/month",
      yearlyPrice: "$79/year (2 months free)",
      buttonText: 'Start ',
      buttonStyle: 'bg-violet-100 hover:bg-violet-200 text-violet-500',
      outlineStyle: 'outline outline-1 outline-offset-[-1px] outline-gray-100',
      nameColor: 'text-black',
      features: [
        "For individuals getting organized with AI",
        "Unlimited AI chat(fair use)",
        "Unlimited task planning",
        "Daily automation",
        "Basic goal analysis",
        "1 AI persona",
        "Monthly summaries",
        "Standard response speed",
      ],
    },
    {
      name: 'PRO',
      description: (
        <>
          Everything in Starter + Advanced Planning
        </>
      ),
      monthlyPrice: "$17.99/month",
      yearlyPrice: "$179/year (Best value)",

      buttonText: 'Start ',
      buttonStyle: 'bg-violet-600 hover:bg-violet-700 text-white',
      outlineStyle: '',
      nameColor: 'text-violet-500',
      isPopular: true,
      features: [
        "For power users who plan weekly & monthly",
        "Everything in Starter, plus:",
        "Full weekly & monthly planning",
        "AI productivity analysis",
        "Weekly AI review reports",
        "3 AI personas",
        "Priority task optimization",
        "Habit difficulty adjustment",
        "Unlimited routines",
        "Faster AI responses",
        "Everything most serious users need"
      ],
    },
    {
      name: 'ULTIMATE',
      description: 'For Life Transformation',
      price: billingCycle === 'monthly' ? 39 : 31,
      monthlyPrice: "$39.99/month",
      yearlyPrice: "$399/year",
      buttonText: 'Start ',
      buttonStyle: 'bg-black hover:bg-gray-900 text-white',
      outlineStyle: 'outline outline-1 outline-offset-[-1px] outline-gray-100',
      nameColor: 'text-black',
      features: [
        "For creators, founders & high performers",
        "Everything in Pro, plus",
        "AI-generated Life Blueprint",
        "AI voice coach",
        "AI routine optimizer",
        "Energy-level planning",
        "Monthly AI coaching session (async summary)",
        "All AI personas",
        "Early feature access",
        "Best for users who want deep personalization"
      ],
    },
  ];

  return (
    <section id='pricing' className="w-full bg-white py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-20">
        <div className="flex flex-col items-center justify-start gap-8 md:gap-12">
          {/* Header */}
          <div className="flex max-w-2xl flex-col items-center justify-start gap-6 md:gap-8">
            <div className="justify-start text-center">
              <span className="font-['Inter'] text-2xl font-semibold text-black md:text-3xl lg:text-4xl">
                Simple Pricing.{' '}
              </span>
              <span className="font-['Inter'] text-2xl font-semibold text-indigo-600 md:text-3xl lg:text-4xl">
                Powerful Results.
              </span>
            </div>

            {/* Billing Toggle */}
            <div className="flex w-full max-w-md items-center justify-start gap-4 rounded-[61px] bg-gray-100 p-2 md:gap-6 md:p-3">
              <div
                className={`flex flex-1 cursor-pointer items-center justify-center gap-2.5 rounded-[46px] px-4 py-3 transition-all md:px-8 md:py-4 ${billingCycle === 'monthly' ? 'bg-white shadow-sm' : ''
                  }`}
                onClick={() => setBillingCycle('monthly')}
              >
                <div
                  className={`justify-start font-['Inter'] text-sm md:text-base ${billingCycle === 'monthly' ? 'font-bold text-black' : 'font-normal text-black'
                    }`}
                >
                  Monthly
                </div>
              </div>
              <div
                className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-[46px] px-4 py-3 transition-all md:gap-2 md:px-8 md:py-4 ${billingCycle === 'yearly' ? 'bg-white shadow-sm' : ''
                  }`}
                onClick={() => setBillingCycle('yearly')}
              >
                <div className="justify-start font-['Inter'] text-sm font-normal text-black md:text-base">
                  Yearly
                </div>
                <div className="justify-start font-['Inter'] text-xs font-bold text-green-600 md:text-base">
                  SAVE 20%
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="mt-8 grid w-full grid-cols-1 gap-6 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
            {pricingPlans.map((plan, index) => (
              <PricingCard
                key={index}
                plan={plan}
                billingCycle={billingCycle}
                isSelected={selectedPlan === plan.name}
                onClick={() => setSelectedPlan(plan.name)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
