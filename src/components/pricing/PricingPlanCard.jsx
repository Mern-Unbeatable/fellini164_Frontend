const PRICING_CARD_SHADOW =
  'shadow-[0px_171px_48px_0px_rgba(0,0,0,0),0px_109px_44px_0px_rgba(0,0,0,0),0px_61px_37px_0px_rgba(0,0,0,0.01),0px_27px_27px_0px_rgba(0,0,0,0.02),0px_7px_15px_0px_rgba(0,0,0,0.02)]';

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

/**
 * `isCurrent` swaps the CTA for a disabled "Current plan" button and highlights the card;
 * `ctaDisabled` greys the CTA out without changing its label.
 */
export default function PricingPlanCard({ plan, cardRef, billing, onCtaClick, loading, isCurrent = false, ctaDisabled = false }) {
  const isYearly = billing === 'yearly';
  const showDiscount = isYearly && plan.originalPrice;
  const highlighted = isCurrent || plan.featured;
  const borderClass = highlighted ? 'border-2 border-[#8022fe]' : 'border border-[#f2f2f2]';
  const badge = isCurrent ? 'Current plan' : plan.badge;

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
          disabled={loading || isCurrent || ctaDisabled}
          onClick={() => onCtaClick?.(plan)}
          className={`w-full rounded-[10px] px-5 py-3 font-['Inter',sans-serif] text-[14px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 md:text-[16px] ${
            plan.ctaFilled && !isCurrent
              ? 'bg-[#8022fe] text-white hover:bg-[#6b1bdb]'
              : 'border-2 border-[#8022fe] bg-white text-[#8022fe] hover:bg-[#f9f4ff]'
          }`}
        >
          {isCurrent ? 'Current plan' : loading ? 'Processing...' : plan.cta}
        </button>
      </div>
    </>
  );

  if (badge) {
    return (
      <div ref={cardRef} className="relative flex w-full flex-col items-center md:h-full">
        <div
          className={`relative flex h-115 w-full flex-col justify-between overflow-hidden rounded-2xl bg-white md:h-full md:min-h-155 md:rounded-[20px] ${borderClass} ${PRICING_CARD_SHADOW}`}
        >
          {cardBody}
        </div>
        <div className="absolute top-[-8.5px] left-1/2 z-10 flex -translate-x-1/2 items-center justify-center rounded-[40px] bg-[#8022fe] px-2 py-0.5 drop-shadow-[0px_0px_5px_rgba(128,34,254,0.3)] md:-top-2.5">
          <p className="font-['Inter',sans-serif] text-[10px] leading-normal font-medium whitespace-nowrap text-white md:text-[12px]">
            {badge}
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
}
