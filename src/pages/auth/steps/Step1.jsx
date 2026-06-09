import { Zap } from 'lucide-react';
import { Accent, Body, Dot, PrimaryBtn, SectionHeading } from '../common';

const Step1 = ({ onContinue }) => (
  <>
    <SectionHeading>
      Let&rsquo;s set up your personal <Accent>AI</Accent>
      <Dot />
    </SectionHeading>
    <Body maxWidth={470}>
      Answer a few quick questions so your AI can understand your goals and build a plan around you
    </Body>

    <div className="mt-24 flex flex-col items-center gap-5 sm:mt-0">
      <PrimaryBtn onClick={onContinue} fullWidthMobile>
        Start Building My Plan
      </PrimaryBtn>
      <p className="m-0 inline-flex items-center gap-1.5 font-['Inter',sans-serif] text-[14px] text-[#C2C2C2]">
        <Zap className="h-3.5 w-3.5 text-[#8022FE]/40" />
        Take less than a minute
      </p>
    </div>
  </>
);

export default Step1;
