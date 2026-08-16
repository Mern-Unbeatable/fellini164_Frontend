import { useState } from 'react';
import { Zap } from 'lucide-react';
import { PUT } from '../../../services/httpMethods';
import { API_ENDPOINTS } from '../../../services/httpEndpoint';

const Accent = ({ children }) => <span className="text-[#8022FE]">{children}</span>;
const Dot = () => <span className="text-[#14F1D9]">.</span>;

const SectionHeading = ({ children }) => (
  <h1 className="text-center font-['Inter',sans-serif] text-[26px] leading-[1.3] font-bold text-[#181818] md:text-[54px]">
    {children}
  </h1>
);

const Body = ({ children, className }) => (
  <p
    className={`mx-auto text-center font-['Inter',sans-serif] text-[14px] leading-normal font-medium text-[#272727] md:text-base ${className}`}
  >
    {children}
  </p>
);

const PrimaryBtn = ({ onClick, disabled = false, children }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`h-13 w-full rounded-[10px] px-10 font-['Inter',sans-serif] text-base leading-none font-semibold text-white transition-colors md:h-11 md:w-auto ${
      disabled
        ? 'cursor-not-allowed bg-[#E2E2E2] text-[#C3C3C3]'
        : 'bg-[#8022FE] hover:bg-[#6B1BDB] active:bg-[#5A17BB]'
    }`}
  >
    {children}
  </button>
);

const Step1 = ({ onContinue }) => {
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    if (loading) return;

    try {
      setLoading(true);
      await PUT(API_ENDPOINTS.ONBOARDING.STEP, {
        step: 1,
        markStart: true,
      });
      onContinue?.();
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Content — same on both */}
      <div className="flex flex-col items-center text-center">
        <SectionHeading>
          Let&rsquo;s set up your personal <Accent>AI</Accent>
          <Dot />
        </SectionHeading>
        <Body className="mt-4 max-w-75 md:max-w-117.5">
          Answer a few quick questions so your AI can understand your goals and build a plan around
          you
        </Body>
      </div>

      {/* CTA — fixed bottom on mobile, normal flow on desktop */}
      <div className="fixed right-0 bottom-0 left-0 z-10 flex flex-col items-center gap-4 px-5 pt-4 pb-28 md:static md:mt-12 md:gap-5 md:px-0 md:pt-0 md:pb-0">
        <PrimaryBtn onClick={handleStart} disabled={loading}>
          {loading ? 'Starting…' : 'Start Building My Plan'}
        </PrimaryBtn>
        <p className="m-0 inline-flex items-center gap-1.5 font-['Inter',sans-serif] text-sm text-[#C2C2C2]">
          <Zap className="h-3.5 w-3.5 text-[#8022FE]/40" />
          Take less than a minute
        </p>
      </div>
    </>
  );
};

export default Step1;
