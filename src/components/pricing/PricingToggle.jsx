export default function PricingToggle({ billing, onChange }) {
  return (
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
}
