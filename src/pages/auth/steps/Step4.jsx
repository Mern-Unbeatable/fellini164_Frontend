import { Moon, Sun } from 'lucide-react';
import { Accent, Body, Dot, SectionHeading } from '../common';

const Step4 = ({
  startTime,
  setStartTime,
  startMeridiem,
  setStartMeridiem,
  endTime,
  setEndTime,
  endMeridiem,
  setEndMeridiem,
}) => (
  <>
    <SectionHeading>
      When you start and end your <Accent>Day</Accent>
      <Dot />
    </SectionHeading>
    <Body maxWidth={470}>
      Your AI uses this to plan your day around your energy. Adjust if needed.
    </Body>

    <div className="mt-8 box-border w-full max-w-160 rounded-2xl border-[1.5px] border-[#E2E2E2] bg-[#F2F2F2] p-4 sm:p-6">
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
  </>
);

export default Step4;
