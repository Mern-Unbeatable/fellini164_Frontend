import { Moon, Sun } from 'lucide-react';

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

const Step4 = ({
  startTime,
  setStartTime,
  startMeridiem,
  setStartMeridiem,
  endTime,
  setEndTime,
  endMeridiem,
  setEndMeridiem,
  onContinue,
  onBack,
  canContinue,
}) => (
  <div className="flex w-full flex-col items-center gap-7.5 text-center sm:gap-12.5">
    <div className="flex w-full flex-col items-center gap-4 sm:gap-7.5">
      <h1 className="text-center font-['Inter',sans-serif] text-[clamp(28px,4vw,54px)] leading-[1.3] font-bold text-[#181818]">
        When you start and end your <Accent>Day</Accent>
        <Dot />
      </h1>
      <p className="mx-auto text-center font-['Inter',sans-serif] text-[16px] leading-normal font-medium text-[#272727] sm:whitespace-nowrap">
        Your AI uses this to plan your day around your energy. Adjust if needed.
      </p>
    </div>

    <div className="box-border w-full max-w-160 rounded-2xl border-[1.5px] border-[#E2E2E2] bg-[#F2F2F2] p-4 sm:p-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <p className="mb-2 flex items-center gap-2 font-['Inter',sans-serif] text-[15px] font-medium text-[#1F1F1F] sm:text-[16px]">
            <Sun className="h-4 w-4 text-[#8022FE]" />
            Start Your Day
          </p>
          <div className="flex items-center gap-2 rounded-xl border-[1.5px] border-[#E2E2E2] bg-[#F7F7F7] px-3 py-2">
            <input
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              placeholder="00:00"
              className="flex-1 border-0 bg-transparent font-['Inter',sans-serif] text-[26px] font-semibold text-[#1F1F1F] outline-none sm:text-[34px]"
            />
            <select
              value={startMeridiem}
              onChange={(e) => setStartMeridiem(e.target.value)}
              className="cursor-pointer border-0 bg-transparent font-['Inter',sans-serif] text-[26px] font-semibold text-[#B2B2B2] outline-none sm:text-[34px]"
            >
              <option>AM</option>
              <option>PM</option>
            </select>
          </div>
        </div>

        <div>
          <p className="mb-2 flex items-center gap-2 font-['Inter',sans-serif] text-[15px] font-medium text-[#1F1F1F] sm:text-[16px]">
            <Moon className="h-4 w-4 text-[#8022FE]" />
            End Your Day
          </p>
          <div className="flex items-center gap-2 rounded-xl border-[1.5px] border-[#E2E2E2] bg-[#F7F7F7] px-3 py-2">
            <input
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              placeholder="00:00"
              className="flex-1 border-0 bg-transparent font-['Inter',sans-serif] text-[26px] font-semibold text-[#1F1F1F] outline-none sm:text-[34px]"
            />
            <select
              value={endMeridiem}
              onChange={(e) => setEndMeridiem(e.target.value)}
              className="cursor-pointer border-0 bg-transparent font-['Inter',sans-serif] text-[26px] font-semibold text-[#B2B2B2] outline-none sm:text-[34px]"
            >
              <option>AM</option>
              <option>PM</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div className="flex w-full flex-col items-center gap-4 pb-6 md:w-auto md:flex-row-reverse md:items-center md:gap-5 md:pb-0">
      <PrimaryBtn onClick={onContinue} disabled={!canContinue}>Generate My Plan</PrimaryBtn>
      <SkipBtn onClick={onBack} />
    </div>
  </div>
);

export default Step4;
