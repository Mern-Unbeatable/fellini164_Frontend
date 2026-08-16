import { useState } from 'react';
import { ROUTINE_OPTIONS } from '../../../constants';
import { PUT } from '../../../services/httpMethods';
import { API_ENDPOINTS } from '../../../services/httpEndpoint';

const Accent = ({ children }) => <span className="text-[#8022FE]">{children}</span>;
const Dot = () => <span className="text-[#14F1D9]">.</span>;

const PrimaryBtn = ({ onClick, disabled, children }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`w-full rounded-[10px] h-11 px-10 font-['Inter',sans-serif] text-[16px] leading-none font-semibold text-white transition-colors md:w-auto ${
      disabled ? 'cursor-not-allowed bg-[#E2E2E2] text-[#C3C3C3]' : 'bg-[#8022FE] hover:bg-[#6B1BDB]'
    }`}
  >
    {children}
  </button>
);

const SkipBtn = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full cursor-pointer border-0 bg-transparent p-0 text-center font-['Inter',sans-serif] text-[14px] font-semibold text-[#C5C5C5] md:w-45 md:text-[16px] md:font-medium"
  >
    Skip for now
  </button>
);

const OptionCard = ({ selected, onClick, icon, title, description }) => {
  const Icon = icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full flex-col gap-1 rounded-xl border p-2.5 text-left transition-colors sm:gap-1.5 sm:p-3 ${
        selected
          ? 'border-[#8022FE] bg-white'
          : 'border-[#F2F2F2] bg-[#FCFCFC] hover:border-[#D0D0D0]'
      }`}
    >
      <div className="flex h-8.5 items-center gap-2.5">
        <div className="flex size-7.5 shrink-0 items-center justify-center rounded-lg bg-[#F9F4FF] sm:size-8.5">
          <Icon className="h-4 w-4 text-[#8022FE] sm:h-5 sm:w-5" />
        </div>
        <span
          className={`font-['Inter',sans-serif] text-[16px] font-medium leading-normal sm:text-[20px] ${
            selected ? 'text-[#8022FE]' : 'text-[#181818]'
          }`}
        >
          {title}
        </span>
      </div>
      <p className="m-0 font-['Inter',sans-serif] text-[12px] font-medium leading-normal text-[#C2C2C2] sm:text-[14px]">
        {description}
      </p>
    </button>
  );
};

const Step3 = ({ routine, onSelectRoutine, onContinue, onBack, canContinue }) => {
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (loading || !routine) return;

    const selected = ROUTINE_OPTIONS.find((opt) => opt.id === routine);
    if (!selected) return;

    const payload = {
      step: 3,
      routineType: selected.title,
    };

    try {
      setLoading(true);
      await PUT(API_ENDPOINTS.ONBOARDING.STEP, payload);
      onContinue?.();
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="flex w-full flex-col items-center gap-7.5">
    <div className="flex w-full flex-col items-center gap-2.5 text-center">
      <h1 className="font-['Inter',sans-serif] text-[26px] font-bold leading-[1.3] text-[#181818] sm:text-[clamp(32px,4vw,54px)]">
        How your day is <Accent>Structured</Accent>
        <Dot />
      </h1>
      <p className="font-['Inter',sans-serif] text-[14px] font-medium leading-normal text-[#272727] sm:text-[16px] sm:whitespace-nowrap">
        Your AI uses this to tailor your plan to your real daily routine.
      </p>
    </div>

    <div className="grid w-full grid-cols-1 gap-2.5 sm:max-w-180 sm:grid-cols-2 sm:gap-5">
      {ROUTINE_OPTIONS.map((opt) => (
        <OptionCard
          key={opt.id}
          selected={routine === opt.id}
          onClick={() => onSelectRoutine(opt.id)}
          icon={opt.icon}
          title={opt.title}
          description={opt.description}
        />
      ))}
    </div>

    <div className="flex w-full flex-col items-center gap-4 pb-16 md:w-auto md:flex-row-reverse md:items-center md:gap-5 md:pb-0">
      <PrimaryBtn onClick={handleContinue} disabled={!canContinue || loading}>
        {loading ? 'Saving…' : 'Continue'}
      </PrimaryBtn>
      <SkipBtn onClick={onBack} />
    </div>
  </div>
  );
};

export default Step3;
