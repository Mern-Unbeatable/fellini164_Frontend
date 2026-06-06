import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PricingCard from './components/PricingCard';
import BillingPanel from './components/BillingPanel';
import { clearCheckout } from '../../../../features/users/paymentSlice';

const plans = [
  {
    id: 'free',
    name: 'FREE',
    priceMonthly: '0',
    priceYearly: '0',
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
    id: 'starter',
    name: 'STARTER',
    priceMonthly: '7.99',
    priceYearly: '79',
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
    id: 'pro',
    name: 'PRO',
    priceMonthly: '17.99',
    priceYearly: '179',
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
    id: 'ultimate',
    name: 'ULTIMATE',
    priceMonthly: '39.99',
    priceYearly: '399',
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

const Subscription = () => {
  const dispatch = useDispatch();
  const [period, setPeriod] = useState('monthly');
  const [selected, setSelected] = useState('pro');
  const [activeTab, setActiveTab] = useState('plans');

  // Selected plan
  const selectedPlan = plans.find((p) => p.id === selected);

  // Clear checkout data when switching to plans tab or selecting different plan
  useEffect(() => {
    if (activeTab === 'plans') {
      dispatch(clearCheckout());
    }
  }, [activeTab, dispatch]);

  useEffect(() => {
    dispatch(clearCheckout());
  }, [selected, dispatch]);

  // Amount in smallest currency unit (cents/paisa)
  const amount = Math.round(
    Number(period === 'monthly' ? selectedPlan.priceMonthly : selectedPlan.priceYearly) * 100
  );

  return (
    <div className="text-black dark:text-white p-4 sm:p-6 lg:p-8 ">
      <h1 className="mb-6 text-[25px] font-semibold md:text-[32px]">
        Simple Pricing. Powerful Results.
      </h1>

      {/* Tabs */}
      <div className="mb-4 overflow-hidden md:mb-6">
        <div className="bg-[#FBF8FF] dark:bg-[#1E1B2E] rounded-md">
          <div className="flex">
            <button
              onClick={() => setActiveTab('plans')}
              className={`flex-1 py-3 text-center text-base font-normal ${activeTab === 'plans'
                ? 'border-b-2 border-[#7C3AED] bg-[#F8FBFE] text-gray-800 dark:border-[#A78BFA] dark:bg-[#2A2446] dark:text-white'
                : 'border-b-2 border-transparent bg-[#F8FBFE] text-gray-600 dark:bg-[#1E1B2E] dark:text-gray-400'
                }`}
            >
              Available Plans
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              className={`flex-1 py-3 text-center text-base font-normal ${activeTab === 'billing'
                ? 'border-b-2 border-[#7C3AED] bg-[#F7F3FF] text-gray-800  dark:border-[#A78BFA] dark:bg-[#2A2446] dark:text-white'
                : 'border-b-2 border-transparent bg-[#F7F3FF] text-gray-600 dark:bg-[#1E1B2E] dark:text-gray-400'
                }`}
            >
              Billing & Invoices
            </button>
          </div>
        </div>
      </div>

      {/* Period Toggle */}
      {activeTab === 'plans' && (
        <div className="flex items-center justify-center p-4 md:p-6">
          <div className="flex w-full max-w-sm items-center justify-between rounded-full bg-[#C4C4C4] dark:bg-gray-400 px-2 py-2 md:w-80">
            <button
              onClick={() => setPeriod('monthly')}
              className={`rounded-full ${period === 'monthly' ? 'bg-white dark:bg-gray-700 px-4 py-2 shadow-md md:px-6 dark:text-white' : 'px-4 py-2 text-gray-600 dark:text-gray-300 md:px-6 '
                }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setPeriod('yearly')}
              className={`rounded-full ${period === 'yearly' ? 'bg-white dark:bg-gray-700 px-3 py-2 shadow-md md:px-4' : 'px-3 py-2 font-semibold md:px-4'
                }`}
            >
              <div className="flex gap-2">
                <span>Yearly</span>
                <span className="text-green-600">SAVE 20%</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="mt-4 md:mt-6">
        {activeTab === 'plans' ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4 xl:gap-6">
            {plans.map((p) => {
              const isActive = selected === p.id;
              const price = period === 'monthly' ? p.priceMonthly : p.priceYearly;
              return (
                <PricingCard
                  key={p.id}
                  plan={p}
                  isActive={isActive}
                  price={price}
                  period={period}
                  onSelect={() => setSelected(p.id)}
                  onStartClick={() => {
                    setSelected(p.id);
                    setActiveTab('billing');
                  }}
                />
              );
            })}
          </div>
        ) : (
          <BillingPanel
            amount={amount}
            productId={selectedPlan.id}
            planName={selectedPlan.name}
            selectedPlan={selectedPlan}
            period={period}
            currency="USD"
            customer={{ name: '', email: '' }} // Optional: pass customer info
          />
        )}
      </div>
    </div>
  );
};

export default Subscription;
