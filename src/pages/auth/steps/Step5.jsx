import { useState } from 'react';
import { Grid, Heart, Target, Wind } from 'lucide-react';
import { PUT } from '../../../services/httpMethods';
import { API_ENDPOINTS } from '../../../services/httpEndpoint';

const Accent = ({ children }) => <span className="text-[#8022FE]">{children}</span>;
const Dot = () => <span className="text-[#14F1D9]">.</span>;

const STYLE_OPTIONS = [
  {
    id: 'direct',
    Icon: Target,
    title: 'Direct & Goal-Oriented',
    description: 'Clear, focused, and efficient',
  },
  {
    id: 'structured',
    Icon: Grid,
    title: 'Structured & Analytical',
    description: 'Logical, detailed, and consistent',
  },
  {
    id: 'supportive',
    Icon: Heart,
    title: 'Supportive & Encouraging',
    description: 'Positive, motivating, and uplifting',
  },
  {
    id: 'calm',
    Icon: Wind,
    title: 'Calm & Balanced',
    description: 'Steady, thoughtful, and low-pressure',
  },
];

const PrimaryBtn = ({ onClick, disabled, children }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`h-11 w-full rounded-[10px] px-10 font-['Inter',sans-serif] text-[14px] leading-none font-semibold text-white transition-colors sm:text-[16px] md:w-auto ${
      disabled ? 'cursor-not-allowed bg-[#E2E2E2] text-[#C3C3C3]' : 'bg-[#8022FE] hover:bg-[#6B1BDB]'
    }`}
  >
    {children}
  </button>
);

const StyleCard = ({ option, selected, onClick }) => {
  const { Icon, title, description } = option;
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
      <div className="flex items-center gap-2.5">
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

const Step5 = ({ style, onSelectStyle, onContinue, canContinue }) => {
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (loading || !style) return;

    const selected = STYLE_OPTIONS.find((opt) => opt.id === style);
    if (!selected) return;

    const payload = {
      step: 5,
      aiCommunicationStyle: selected.title,
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
    {/* Heading */}
    <div className="flex w-full flex-col items-center gap-2.5 text-center">
      <h1 className="font-['Inter',sans-serif] text-[26px] font-bold leading-[1.3] text-[#181818] sm:text-[clamp(32px,4vw,54px)]">
        How your AI should <Accent>Communicate</Accent>
        <Dot />
      </h1>
      <p className="font-['Inter',sans-serif] text-[14px] font-medium leading-normal text-[#272727] sm:text-[16px] sm:whitespace-nowrap">
        This changes how your AI guides and interacts with you. You can change it anytime.
      </p>
    </div>

    {/* Options — 1 col mobile, 2 col desktop */}
    <div className="grid w-full grid-cols-1 gap-2.5 sm:max-w-180 sm:grid-cols-2 sm:gap-5">
      {STYLE_OPTIONS.map((opt) => (
        <StyleCard
          key={opt.id}
          option={opt}
          selected={style === opt.id}
          onClick={() => onSelectStyle(opt.id)}
        />
      ))}
    </div>

    {/* Button */}
    <div className="flex w-full flex-col items-center gap-4 pb-16 md:w-auto md:pb-0">
      <PrimaryBtn onClick={handleContinue} disabled={!canContinue || loading}>
        {loading ? 'Saving…' : 'Generate My Plan'}
      </PrimaryBtn>
    </div>
  </div>
  );
};

export default Step5;
