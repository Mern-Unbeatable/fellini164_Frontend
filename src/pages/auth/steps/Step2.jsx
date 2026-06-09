import { GOAL_OPTIONS } from '../../../constants';

const Accent = ({ children }) => <span className="text-[#8022FE]">{children}</span>;

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

const Step2 = ({ selectedGoals, toggleGoal }) => (
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
  </div>
);

export default Step2;
