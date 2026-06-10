import { useMemo } from 'react';

const Accent = ({ children }) => <span className="text-[#8022FE]">{children}</span>;

const MESSAGES = [
  { text: 'Analyzing your inputs…',                      mobile: 'text-[14px]', desktop: 'sm:text-[16px]', color: 'text-[#181818]' },
  { text: 'Setting up your AI behavior…',                mobile: 'text-[12px]', desktop: 'sm:text-[14px]', color: 'text-[#5D5D5D]' },
  { text: 'Personalizing your experience…',              mobile: 'text-[10px]', desktop: 'sm:text-[12px]', color: 'text-[#A3A3A3]' },
  { text: 'Calibrating your focus and energy patterns…', mobile: 'text-[8px]',  desktop: 'sm:text-[10px]', color: 'text-[#C2C2C2]' },
  { text: 'Preparing your AI guidance style…',           mobile: 'text-[6px]',  desktop: 'sm:text-[8px]',  color: 'text-[#F2F2F2]' },
];

const GeneratingPlan = ({ progress }) => {
  const circumference = 2 * Math.PI * 88;
  const strokeDashoffset = useMemo(
    () => circumference - (progress / 100) * circumference,
    [progress, circumference],
  );

  // Active message index based on progress (0–4)
  const activeIdx = Math.min(Math.floor(progress / 20), 4);

  return (
    <div className="mx-auto mt-10 flex w-full max-w-325 flex-col items-center gap-7.5 px-4 text-center sm:mt-0 sm:gap-12.5 sm:px-0">
      {/* Title */}
      <div className="flex flex-col items-center gap-2.5 sm:gap-7.5">
        <h1 className="font-['Inter',sans-serif] text-[26px] font-bold leading-[1.3] text-[#181818] sm:text-[clamp(32px,4vw,54px)]">
          Creating your AI <Accent>Plan</Accent>
          <span className="text-[#14F1D9]">...</span>
        </h1>
        <p className="font-['Inter',sans-serif] text-[14px] font-medium leading-normal text-[#272727] sm:text-[16px] sm:whitespace-nowrap">
          Personalizing your AI to match your goals and routine
        </p>
      </div>

      {/* Progress ring */}
      <div className="relative h-42.5 w-42.5 sm:h-55 sm:w-55">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 200 200">
          {/* Track */}
          <circle cx="100" cy="100" r="88" stroke="#ECE5FA" strokeWidth="10" fill="none" />
          {/* Progress arc */}
          <circle
            cx="100"
            cy="100"
            r="88"
            stroke="#8022FE"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-[stroke-dashoffset] duration-260 ease-out"
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          <p className="font-['Inter',sans-serif] text-[34px] font-bold leading-none text-[#8022FE] sm:text-[54px]">
            {progress}%
          </p>
          <p className="font-['Inter',sans-serif] text-[10px] font-medium leading-normal text-[#C2C2C2] sm:text-[12px]">
            Usually under a minute
          </p>
        </div>
      </div>

      {/* Fading messages — active at top, cascading below */}
      <div className="flex flex-col items-center gap-4">
        {MESSAGES.map((msg, i) => {
          const rank = i - activeIdx;
          if (rank < 0 || rank >= MESSAGES.length) return null;
          const style = MESSAGES[rank];
          return (
            <p
              key={msg.text}
              className={`font-['Inter',sans-serif] font-medium leading-normal transition-all duration-500 ${style.mobile} ${style.desktop} ${style.color}`}
            >
              {msg.text}
            </p>
          );
        })}
      </div>
    </div>
  );
};

export default GeneratingPlan;
