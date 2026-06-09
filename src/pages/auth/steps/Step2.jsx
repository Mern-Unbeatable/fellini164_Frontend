import { GOAL_OPTIONS } from '../../../constants';

const Accent = ({ children }) => <span className="text-[#8022FE]">{children}</span>;

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

const GoalChip = ({ goal, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex h-14 w-full items-center gap-3 rounded-xl border-[1.5px] px-4 text-left transition-colors ${selected ? 'border-[#8022FE] bg-white' : 'border-[#E2E2E2]/50 bg-gray-50'}`}
  >
    <span
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-[1.5px] ${selected ? 'border-[#8022FE] bg-[#8022FE]' : 'border-[#D0D0D0] bg-transparent'}`}
    >
      {selected && (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M2 6L5 9L10 3"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
    <span
      className={`font-['Inter',sans-serif] text-[16px] font-medium ${selected ? 'text-[#8022FE]' : 'text-[#202020]'}`}
    >
      {goal}
    </span>
  </button>
);

/* ═══════════════════════════════════════════════════════════════════
   STEP 2 - MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════ */

const Step2 = ({ selectedGoals, toggleGoal }) => (
  <>
    <SectionHeading>
      Where should your AI focus <Accent>First</Accent>
      <span className="text-[#14f1e6]">?</span>
    </SectionHeading>
    <Body>Pick 2 focus areas, then choose your main priority</Body>

    <div className="mt-6 grid w-full max-w-137.5 grid-cols-1 gap-4 sm:grid-cols-2">
      {GOAL_OPTIONS.map((goal) => (
        <GoalChip
          key={goal}
          goal={goal}
          selected={selectedGoals.includes(goal)}
          onClick={() => toggleGoal(goal)}
        />
      ))}
    </div>
  </>
);

export default Step2;
