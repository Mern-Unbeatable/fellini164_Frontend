import { ROUTINE_OPTIONS } from '../../../constants';
import { Accent, Body, Dot, OptionCard, SectionHeading } from './common';

const Step3 = ({ routine, onSelectRoutine }) => (
  <>
    <div className="flex flex-col items-center gap-[30px]">
      <SectionHeading>
        How your day is <Accent>Structured</Accent>
        <Dot />
      </SectionHeading>
      <Body>Your AI uses this to tailor your plan to your real daily routine.</Body>
    </div>

    <div className="mt-8 grid w-full max-w-[720px] grid-cols-1 gap-5 sm:grid-cols-2">
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
