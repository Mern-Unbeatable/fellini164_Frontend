import { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { PUT } from '../../../services/httpMethods';
import { API_ENDPOINTS } from '../../../services/httpEndpoint';

const Accent = ({ children }) => <span className="text-[#8022FE]">{children}</span>;
const Dot = () => <span className="text-[#14F1D9]">.</span>;

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

const SkipBtn = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full cursor-pointer border-0 bg-transparent p-0 text-center font-['Inter',sans-serif] text-[14px] font-semibold text-[#C5C5C5] md:w-45 md:text-[16px] md:font-medium"
  >
    Skip for now
  </button>
);

const handleTimeChange = (e, setter) => {
  // Strip non-digits, auto-insert colon after 2 hour digits
  const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
  const formatted = digits.length > 2
    ? digits.slice(0, 2) + ':' + digits.slice(2)
    : digits;
  setter(formatted);
};

const TimeBox = ({ time, setTime, meridiem, setMeridiem }) => (
  <div className="flex w-35 items-center justify-between rounded-xl border border-[#F2F2F2] bg-white px-3.5 py-2.5 sm:w-52.5 sm:rounded-2xl sm:px-5">
    <input
      type="text"
      inputMode="numeric"
      value={time}
      onChange={(e) => handleTimeChange(e, setTime)}
      placeholder="Time"
      maxLength={5}
      className="min-w-0 flex-1 border-0 bg-transparent font-['Inter',sans-serif] text-[22px] font-bold leading-[1.3] text-[#181818] outline-none placeholder:font-bold placeholder:text-[#E2E2E2] sm:text-[34px]"
    />
    <button
      type="button"
      onClick={() => setMeridiem(meridiem === 'AM' ? 'PM' : 'AM')}
      className="shrink-0 cursor-pointer border-0 bg-transparent font-['Inter',sans-serif] text-[22px] font-bold leading-[1.3] text-[#C2C2C2] transition-colors hover:text-[#8022FE] sm:text-[34px]"
    >
      {meridiem}
    </button>
  </div>
);

const to24HourTime = (time, meridiem) => {
  const [hoursStr, minutesStr = '00'] = time.split(':');
  let hours = parseInt(hoursStr, 10);
  const minutes = minutesStr.padEnd(2, '0').slice(0, 2);

  if (Number.isNaN(hours)) return null;

  if (meridiem === 'AM') {
    if (hours === 12) hours = 0;
  } else if (hours !== 12) {
    hours += 12;
  }

  return `${String(hours).padStart(2, '0')}:${minutes}`;
};

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
}) => {
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (loading || !canContinue) return;

    const dayStartTime = to24HourTime(startTime, startMeridiem);
    const dayEndTime = to24HourTime(endTime, endMeridiem);
    if (!dayStartTime || !dayEndTime) return;

    const payload = {
      step: 4,
      dayStartTime,
      dayEndTime,
    };

    try {
      setLoading(true);
      console.log('[Onboarding Step 4] request body', payload);
      const response = await PUT(API_ENDPOINTS.ONBOARDING.STEP, payload);
      console.log('[Onboarding Step 4] response', response);
      onContinue?.();
    } catch (error) {
      console.error('[Onboarding Step 4]', error?.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="flex w-full flex-col items-center gap-7.5 sm:gap-12.5">
    {/* Heading */}
    <div className="flex w-full flex-col items-center gap-2.5 text-center sm:gap-7.5">
      <h1 className="font-['Inter',sans-serif] text-[26px] font-bold leading-[1.3] text-[#181818] sm:text-[clamp(32px,4vw,54px)]">
        When you start and end your <Accent>Day</Accent>
        <Dot />
      </h1>
      <p className="font-['Inter',sans-serif] text-[14px] font-medium leading-normal text-[#272727] sm:text-[16px] sm:whitespace-nowrap">
        Your AI uses this to plan your day around your energy. Adjust if needed.
      </p>
    </div>

    {/* Time card */}
    <div className="mx-auto w-full rounded-2xl border border-[#F2F2F2] bg-[#FCFCFC] p-5 sm:w-143.25 sm:rounded-[20px] sm:p-7.5">
      {/* Mobile: column; Desktop: row */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-center sm:gap-12.5">

        {/* Start Your Day */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center gap-2.5">
            <div className="flex size-7.5 shrink-0 items-center justify-center rounded-lg bg-[#F9F4FF] sm:size-8.5">
              <Sun className="h-4 w-4 text-[#8022FE]" />
            </div>
            <span className="font-['Inter',sans-serif] text-[16px] font-medium leading-normal text-[#181818] sm:text-[20px]">
              Start Your Day
            </span>
          </div>
          <TimeBox
            time={startTime}
            setTime={setStartTime}
            meridiem={startMeridiem}
            setMeridiem={setStartMeridiem}
          />
        </div>

        {/* Divider — horizontal on mobile, vertical on desktop */}
        <div className="flex flex-row items-center gap-5 sm:flex-col sm:self-stretch sm:gap-4">
          <div className="h-px flex-1 bg-[#F2F2F2] sm:h-auto sm:w-px" />
          <span className="shrink-0 font-['Inter',sans-serif] text-[12px] font-normal text-[#C2C2C2] sm:text-[14px]">
            To
          </span>
          <div className="h-px flex-1 bg-[#F2F2F2] sm:h-auto sm:w-px" />
        </div>

        {/* End Your Day */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center gap-2.5">
            <div className="flex size-7.5 shrink-0 items-center justify-center rounded-lg bg-[#F9F4FF] sm:size-8.5">
              <Moon className="h-4 w-4 text-[#8022FE]" />
            </div>
            <span className="font-['Inter',sans-serif] text-[16px] font-medium leading-normal text-[#181818] sm:text-[20px]">
              End Your Day
            </span>
          </div>
          <TimeBox
            time={endTime}
            setTime={setEndTime}
            meridiem={endMeridiem}
            setMeridiem={setEndMeridiem}
          />
        </div>

      </div>
    </div>

    {/* Buttons */}
    <div className="flex w-full flex-col items-center gap-4 pb-16 md:w-auto md:flex-row-reverse md:items-center md:gap-5 md:pb-0">
      <PrimaryBtn onClick={handleContinue} disabled={!canContinue || loading}>
        {loading ? 'Saving…' : 'Continue'}
      </PrimaryBtn>
      <SkipBtn onClick={onBack} />
    </div>
  </div>
  );
};

export default Step4;
