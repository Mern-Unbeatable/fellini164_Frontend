import { ROUTINE_OPTIONS } from '../../../constants';
import { Accent, Body, Dot, OptionCard, SectionHeading } from './common';

const Step3 = ({ routine, onSelectRoutine }) => (
  <>
    <SectionHeading>
      How your day is <Accent>Structured</Accent>
      <Dot />
    </SectionHeading>
    <Body maxWidth={470}>Your AI uses this to tailor your plan to your real daily routine.</Body>

    <div className="mt-8 grid w-full grid-cols-2 gap-3 max-sm:grid-cols-1">
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
