import { GOAL_OPTIONS } from '../../../constants';
import { Accent, Body, GoalChip, SectionHeading } from './common';

const Step2 = ({ selectedGoals, toggleGoal }) => (
  <>
    <div className="-mt-6">
      <SectionHeading>
        Where should your AI focus <Accent>First</Accent>
        <span className="text-[#f11495]">?</span>
      </SectionHeading>
      <Body maxWidth={470}>Pick 2 focus areas, then choose your main priority</Body>
    </div>

    <div className="mt-8 grid w-full max-w-lg grid-cols-1 gap-3 sm:grid-cols-2">
      {GOAL_OPTIONS.map((goal) => (
        <GoalChip
          key={goal}
          goal={goal}
          selected={selectedGoals.includes(goal)}
          onClick={() => toggleGoal(goal)}
        />
      ))}
    </div>
  </>
);

export default Step2;
