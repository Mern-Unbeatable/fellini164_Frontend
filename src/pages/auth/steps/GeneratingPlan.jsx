import { useMemo } from 'react';
import { Accent, Body, SectionHeading } from './common';

const GeneratingPlan = ({ progress }) => {
  const progressStrokeOffset = useMemo(() => {
    const r = 88;
    return 2 * Math.PI * r - (progress / 100) * 2 * Math.PI * r;
  }, [progress]);

  return (
    <div className="mx-auto mt-14 flex max-w-190 flex-col items-center px-4 text-center sm:mt-20 sm:px-0">
      <SectionHeading>
        Creating your AI <Accent>Plan</Accent>
        <span className="text-[#14F1D9]">...</span>
      </SectionHeading>
      <Body maxWidth={470}>Personalizing your AI to match your goals and routine</Body>

      <div className="relative mt-8 h-40 w-40 sm:h-47.5 sm:w-47.5">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="88" stroke="#ECE5FA" strokeWidth="10" fill="none" />
          <circle
            cx="100"
            cy="100"
            r="88"
            stroke="#8022FE"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 88}
            strokeDashoffset={progressStrokeOffset}
            className="transition-[stroke-dashoffset] duration-260 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="m-0 font-['Inter',sans-serif] text-[40px] leading-none font-bold text-[#8022FE] sm:text-[49px]">
            {progress}%
          </p>
          <p className="mt-1 font-['Inter',sans-serif] text-[12px] text-[#C7C7C7] sm:text-[13px]">
            Usually under a minute
          </p>
        </div>
      </div>

      <div className="mt-7 flex max-w-100 flex-col gap-3 px-2 sm:px-0">
        {[
          { text: 'Analyzing your inputs...', color: '#1f1f1f' },
          { text: 'Setting up your AI behavior...', color: '#C2C2C2' },
          { text: 'Personalizing your experience...', color: '#D1D1D1' },
          { text: 'Calibrating your focus and energy patterns...', color: '#DEDEDE' },
        ].map((line) => (
          <p
            key={line.text}
            className={`m-0 font-['Inter',sans-serif] text-[14px] sm:text-[16px] ${line.color === '#1f1f1f' ? 'text-[#1f1f1f]' : line.color === '#C2C2C2' ? 'text-[#C2C2C2]' : line.color === '#D1D1D1' ? 'text-[#D1D1D1]' : 'text-[#DEDEDE]'}`}
          >
            {line.text}
          </p>
        ))}
      </div>
    </div>
  );
};

export default GeneratingPlan;
