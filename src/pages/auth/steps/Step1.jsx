import { Zap } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════
   STEP 1 - INDEPENDENT UI COMPONENTS
   ───────────────────────────────────────────────────────────────────
   These components are isolated to Step1 only. Changes here will NOT
   affect Step2, Step3, Step4, or GeneratingPlan components.
   ═══════════════════════════════════════════════════════════════════ */

const Accent = ({ children }) => <span className="text-[#8022FE]">{children}</span>;

const Dot = () => <span className="text-[#14F1D9]">.</span>;

const SectionHeading = ({ children }) => (
  <h1 className="text-center font-['Inter',sans-serif] text-[clamp(28px,4vw,54px)] leading-[1.3] font-bold text-[#181818]">
    {children}
  </h1>
);

const Body = ({ children, className, maxWidth = '100%' }) => (
  <p
    className={`mx-auto text-center font-['Inter',sans-serif] text-base leading-normal font-medium text-[#272727] ${className}`}
    style={{ maxWidth }}
  >
    {children}
  </p>
);

const PrimaryBtn = ({ onClick, disabled = false, children, fullWidthMobile = false }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`${fullWidthMobile ? 'w-full sm:w-auto' : ''} h-11 rounded-[10px] px-10 font-['Inter',sans-serif] text-base leading-none font-semibold text-white transition-colors ${disabled ? 'cursor-not-allowed bg-[#E2E2E2] text-[#C3C3C3]' : 'bg-[#8022FE] hover:bg-[#6B1BDB]'}`}
  >
    {children}
  </button>
);

/* ═══════════════════════════════════════════════════════════════════
   STEP 1 - MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════ */

const Step1 = ({ onContinue }) => (
  <div className="flex h-full flex-col">
    <div className="flex grow flex-col items-center justify-center text-center">
      <SectionHeading>
        Let&rsquo;s set up your <br className="sm:hidden" /> personal <Accent>AI</Accent>
        <Dot />
      </SectionHeading>
      <Body className="mt-4 max-w-75 sm:max-w-117.5">
        Answer a few quick questions so your AI can understand
        <br className="hidden sm:inline" /> your goals and build a plan around you
      </Body>
    </div>

    <div className="mt-auto flex flex-col items-center gap-5 pt-12 pb-4 sm:mt-16 sm:pt-0">
      <PrimaryBtn onClick={onContinue} fullWidthMobile>
        Start Building My Plan
      </PrimaryBtn>
      <p className="m-0 inline-flex items-center gap-1.5 font-['Inter',sans-serif] text-sm text-[#C2C2C2]">
        <Zap className="h-3.5 w-3.5 text-[#8022FE]/40" />
        Take less than a minute
      </p>
    </div>
  </div>
);

export default Step1;
