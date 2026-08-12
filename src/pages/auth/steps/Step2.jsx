import { GOAL_OPTIONS } from '../../../constants';

const Accent = ({ children }) => <span className="text-[#8022FE]">{children}</span>;

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

const GoalChip = ({ goal, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={[
      'flex w-full items-center gap-2 rounded-[10px] border px-3 py-2.5 text-left transition-colors md:gap-3 md:rounded-xl md:px-4 md:py-3',
      selected
        ? 'border-[#8022FE] bg-white'
        : 'border-[#F2F2F2] bg-[#FCFCFC] hover:border-[#D0D0D0]',
    ].join(' ')}
  >
    <span
      className={[
        'flex size-4 shrink-0 items-center justify-center rounded-[5px] border transition-colors md:size-5 md:rounded-md',
        selected ? 'border-[#8022FE] bg-[#8022FE]' : 'border-[#C2C2C2] bg-transparent',
      ].join(' ')}
    >
      {selected && (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path
            d="M1.5 5L4 7.5L8.5 2.5"
            stroke="white"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
    <span
      className={[
        "font-['Inter',sans-serif] text-[14px] leading-normal font-medium md:text-[20px]",
        selected ? 'text-[#8022FE]' : 'text-[#181818]',
      ].join(' ')}
    >
      {goal}
    </span>
  </button>
);

const PriorityChip = ({ goal, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={[
      'flex w-full items-center gap-2 rounded-[10px] border px-3 py-2.5 text-left transition-colors md:gap-3 md:rounded-xl md:px-4 md:py-3',
      selected
        ? 'border-[#8022FE] bg-white shadow-[0_0_0_1px_#8022FE]'
        : 'border-[#F2F2F2] bg-[#FCFCFC] hover:border-[#D0D0D0]',
    ].join(' ')}
  >
    <span
      className={[
        'flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors md:size-5',
        selected ? 'border-[#8022FE] bg-white' : 'border-[#C2C2C2] bg-transparent',
      ].join(' ')}
    >
      {selected && (
        <span className="size-2 rounded-full bg-[#8022FE] md:size-2.5" />
      )}
    </span>
    <span
      className={[
        "font-['Inter',sans-serif] text-[14px] leading-normal font-medium md:text-[20px]",
        selected ? 'text-[#8022FE]' : 'text-[#181818]',
      ].join(' ')}
    >
      {goal}
    </span>
  </button>
);

const Step2 = ({
  selectedGoals,
  toggleGoal,
  onContinue,
  onBack,
  canContinue,
  phase = 1,
  setPhase,
  mainFocus,
  setMainFocus,
}) => {
  if (phase === 2) {
    return (
      <div className="flex w-full flex-col gap-7.5 px-5 md:items-center md:px-0">
        <div className="flex flex-col items-center gap-2.5 text-center">
          <h1 className="w-full text-center font-['Inter',sans-serif] text-[26px] leading-[1.3] font-bold text-[#181818] md:text-[54px]">
            Where should your AI focus <Accent>First</Accent>
            <span className="text-[#14F1D9]">?</span>
          </h1>
          <p className="text-center font-['Inter',sans-serif] text-[14px] leading-normal font-medium text-[#272727] md:text-base">
            Choose your AI's main focus. Wrong focus?{' '}
            <button
              type="button"
              onClick={() => setPhase(1)}
              className="text-[#8022FE] underline cursor-pointer hover:text-[#6B1BDB] font-semibold bg-transparent border-0 p-0 inline-block align-baseline"
            >
              Change selection
            </button>
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-2.5 md:max-w-180 md:grid-cols-2 md:gap-5">
          {selectedGoals.map((goal) => (
            <PriorityChip
              key={goal}
              goal={goal}
              selected={mainFocus === goal}
              onClick={() => setMainFocus(goal)}
            />
          ))}
        </div>

        <div className="flex w-full flex-col items-center gap-4 pb-16 md:w-auto md:flex-row-reverse md:justify-center md:gap-5 md:pb-0">
          <PrimaryBtn onClick={onContinue} disabled={!mainFocus}>
            Continue
          </PrimaryBtn>
          <SkipBtn onClick={onBack} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-7.5 px-5 md:items-center md:px-0">
      <div className="flex flex-col items-center gap-2.5 text-center">
        <h1 className="w-full text-center font-['Inter',sans-serif] text-[26px] leading-[1.3] font-bold text-[#181818] md:text-[54px]">
          Where should your AI focus <Accent>First</Accent>
          <span className="text-[#14F1D9]">?</span>
        </h1>
        <p className="text-center font-['Inter',sans-serif] text-[14px] leading-normal font-medium text-[#272727] md:text-base">
          Pick 2 focus areas, then choose your main priority
        </p>
      </div>

      <div className="grid w-full grid-cols-1 gap-2.5 md:max-w-180 md:grid-cols-2 md:gap-5">
        {GOAL_OPTIONS.map((goal) => (
          <GoalChip
            key={goal}
            goal={goal}
            selected={selectedGoals.includes(goal)}
            onClick={() => toggleGoal(goal)}
          />
        ))}
      </div>

      <div className="flex w-full flex-col items-center gap-4 pb-16 md:w-auto md:flex-row-reverse md:justify-center md:gap-5 md:pb-0">
        <PrimaryBtn onClick={onContinue} disabled={selectedGoals.length !== 2}>
          Continue
        </PrimaryBtn>
        <SkipBtn onClick={onBack} />
      </div>
    </div>
  );
};

export default Step2;
