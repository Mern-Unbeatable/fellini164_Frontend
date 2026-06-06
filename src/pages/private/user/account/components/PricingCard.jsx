import { CircleCheck } from 'lucide-react';

const PricingCard = ({ plan, isActive, price, onSelect, onStartClick, period }) => {
  const planNameClass = isActive ? 'text-[#7C3AED]' : '';
  const btnClass = isActive
    ? 'bg-[#7C3AED] text-white dark:text-white hover:bg-[#6829d6]'
    : plan.id === 'free'
      ? 'bg-gray-100 text-[#00000] dark:text-black hover:bg-gray-200'
      : 'bg-[#EDE9FE] text-[#000000]';

  return (
    <div
      onClick={onSelect}
      className={`relative rounded-lg bg-white dark:bg-zinc-800 p-6 text-[#000000] dark:text-white shadow-sm ${isActive ? 'border border-[#7C3AED] bg-[#F7F3FF] mb-4 md:mb-0 z-10' : ''} flex flex-col items-start text-left w-full`}
    >
      {(plan.id === 'pro' || plan.name === 'PRO') && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
          Most Popular
        </div>
      )}
      <div className="w-full grow">
        <div className="mb-4 w-full">
          <div className={`text-xl font-medium uppercase md:text-2xl ${planNameClass}`}>
            {plan.name}
          </div>
        </div>
        <div className="mb-4 w-full">
          <div className="text-[32px] font-semibold md:text-[40px]">
            ${price}
            <span className="text-base font-medium text-[#A2A2A2]">
              {period === 'monthly' ? '/month' : '  /Year'}
            </span>
          </div>
        </div>
        <ul className="mb-6 list-none space-y-3 pl-0 text-sm text-gray-600 dark:text-white">
          {plan.features.map((f, i) => (
            <li key={i} className="flex items-center gap-3">
              <span className="shrink-0">
                <CircleCheck className="h-5 w-5 text-[#7C3AED]" />
              </span>
              <span className="text-base font-normal text-[#595959] dark:text-white/80">{f}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={onStartClick}
        className={`mt-auto w-full rounded-md py-3 text-center text-base font-normal ${btnClass}`}
      >
        Start
      </button>
    </div>
  );
};

export default PricingCard;
