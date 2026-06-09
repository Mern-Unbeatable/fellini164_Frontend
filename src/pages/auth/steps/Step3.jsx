import { ROUTINE_OPTIONS } from '../../../constants';

/* ═══════════════════════════════════════════════════════════════════
   STEP 3 - INDEPENDENT UI COMPONENTS
   ───────────────────────────────────────────────────────────────────
   These components are isolated to Step3 only. Changes here will NOT
   affect Step1, Step2, Step4, or GeneratingPlan components.
   ═══════════════════════════════════════════════════════════════════ */

const Accent = ({ children }) => <span className="text-[#8022FE]">{children}</span>;

const Dot = () => <span className="text-[#14F1D9]">.</span>;

const SectionHeading = ({ children }) => (
  <h1 className="text-center font-['Inter',sans-serif] text-[clamp(28px,4vw,54px)] leading-[1.3] font-bold text-[#181818]">
    {children}
  </h1>
);

const Body = ({ children, maxWidth = '100%' }) => (
  <p
    className="mx-auto text-center font-['Inter',sans-serif] text-[16px] leading-normal font-medium text-[#272727] sm:whitespace-nowrap"
    style={{ maxWidth }}
  >
    {children}
  </p>
);

const OptionCard = ({ selected, onClick, icon: Icon, title, description }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex w-full flex-col items-start gap-1.5 rounded-xl border border-solid p-3 text-left transition-colors ${selected ? 'border-purple-600 bg-white' : 'border-gray-200 bg-gray-50'}`}
  >
    <div className="flex h-8.5 items-center gap-2.5">
      {Icon && (
        <div
          className={`flex h-8.5 w-8.5 items-center justify-center rounded-lg ${selected ? 'bg-purple-50' : 'bg-purple-50'}`}
        >
          <Icon className={`h-5 w-5 ${selected ? 'text-purple-600' : 'text-gray-800'}`} />
        </div>
      )}
      <span
        className={`font-['Inter',sans-serif] text-[20px] font-medium ${selected ? 'text-purple-600' : 'text-gray-800'}`}
      >
        {title}
      </span>
    </div>
    <p className="m-0 font-['Inter',sans-serif] text-[14px] font-medium text-gray-400">
      {description}
    </p>
  </button>
);

/* ═══════════════════════════════════════════════════════════════════
   STEP 3 - MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════ */

const Step3 = ({ routine, onSelectRoutine }) => (
  <>
    <div className="flex flex-col items-center gap-7.5">
      <SectionHeading>
        How your day is <Accent>Structured</Accent>
        <Dot />
      </SectionHeading>
      <Body>Your AI uses this to tailor your plan to your real daily routine.</Body>
    </div>

    <div className="mt-8 grid w-full max-w-180 grid-cols-1 gap-5 sm:grid-cols-2">
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
  </>
);

export default Step3;
