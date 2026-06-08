import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Compass,
  Crown,
  GraduationCap,
  Laptop,
  Moon,
  Sun,
  Zap,
  Users,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const STEP_META = [
  { key: 'start', title: 'Start', subtitle: 'Quick setup' },
  { key: 'goals', title: 'Goals', subtitle: 'Focus areas' },
  { key: 'routine', title: 'Routine', subtitle: 'Your daily life' },
  { key: 'schedule', title: 'Schedule', subtitle: 'Your day timing' },
  { key: 'style', title: 'Style', subtitle: 'AI communication' },
];

const GOAL_OPTIONS = [
  'Career Growth',
  'Reduce Stress',
  'Physical Fitness',
  'Productivity',
  'Mental Clarity',
  'Healthy Habits',
];

const ROUTINE_OPTIONS = [
  {
    id: 'corporate-professional',
    title: 'Corporate Professional',
    description: 'Fixed schedule, structured workdays',
    icon: Briefcase,
  },
  {
    id: 'remote-freelancer',
    title: 'Remote Freelancer',
    description: 'Flexible hours, self-managed work',
    icon: Laptop,
  },
  {
    id: 'full-time-student',
    title: 'Full-time Student',
    description: 'Study-focused with changing routines',
    icon: GraduationCap,
  },
  {
    id: 'entrepreneur',
    title: 'Entrepreneur',
    description: 'Unpredictable schedule, high workload',
    icon: Crown,
  },
  {
    id: 'creative-artist',
    title: 'Creative Artist',
    description: 'Non-linear workflow, flexible structure',
    icon: Compass,
  },
  {
    id: 'stay-at-home-parent',
    title: 'Stay-at-home Parent',
    description: 'Interrupted schedule, variable availability',
    icon: Users,
  },
];

const ROUTINE_TIMES = {
  'corporate-professional': {
    start: '07:00',
    startMeridiem: 'AM',
    end: '11:00',
    endMeridiem: 'PM',
  },
  'remote-freelancer': { start: '08:30', startMeridiem: 'AM', end: '12:00', endMeridiem: 'AM' },
  'full-time-student': { start: '06:30', startMeridiem: 'AM', end: '10:30', endMeridiem: 'PM' },
  entrepreneur: { start: '08:00', startMeridiem: 'AM', end: '12:30', endMeridiem: 'AM' },
  'creative-artist': { start: '10:00', startMeridiem: 'AM', end: '01:00', endMeridiem: 'AM' },
  'stay-at-home-parent': { start: '06:00', startMeridiem: 'AM', end: '10:00', endMeridiem: 'PM' },
};

/* ─────────────────────────────────────────────
   BACK LINK
───────────────────────────────────────────── */
const BACK_LABELS = ['Back to Website', 'Back to Start', 'Back to Goals', 'Back to Routine'];

const BackLink = ({ step, onBack }) => (
  <button
    type="button"
    onClick={onBack}
    className="inline-flex items-center gap-1.5 text-sm text-[#A7A7A7] transition-colors hover:text-[#7A7A7A]"
  >
    {/* Arrow — matches Figma exactly */}
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10 12L6 8L10 4"
        stroke="#A7A7A7"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <span>{BACK_LABELS[Math.min(step - 1, 3)]}</span>
  </button>
);

/* ─────────────────────────────────────────────
   BRAND
───────────────────────────────────────────── */
const Brand = () => (
  <div className="flex shrink-0 items-center">
    <img src="/logo.png" alt="Elyxa.Ai" className="h-9 w-auto sm:h-12" />
  </div>
);

const Stepper = ({ step }) => (
  <div className="flex w-full items-start justify-between gap-3 sm:w-200 sm:gap-0">
    {STEP_META.map((item, index) => {
      const number = index + 1;
      const active = number === step;
      const done = number < step;

      return (
        <div
          key={item.key}
          className="flex min-w-0 flex-1 flex-col items-center sm:w-40 sm:flex-none"
        >
          {/* Circle row with connectors */}
          <div className="relative flex h-8 w-full items-center justify-center sm:h-9">
            {/* Left connector */}
            {number > 1 && (
              <span
                className={`absolute top-1/2 right-[calc(50%+16px)] left-0 h-px -translate-y-1/2 sm:right-[calc(50%+18px)] ${done || active ? 'bg-[#8022FE]' : 'bg-[#ECECEC]'}`}
              />
            )}

            {/* Right connector */}
            {number < STEP_META.length && (
              <span
                className={`absolute top-1/2 right-0 left-[calc(50%+16px)] h-px -translate-y-1/2 sm:left-[calc(50%+18px)] ${done ? 'bg-[#8022FE]' : 'bg-[#ECECEC]'}`}
              />
            )}

            {/* Circle + glow */}
            <span className="relative z-10 flex h-8 w-8 items-center justify-center sm:h-9 sm:w-9">
              {/* Glow halo — active only, matches Figma ellipse blur */}
              {active && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(173,118,255,0.82)_0%,rgba(173,118,255,0.48)_32%,rgba(173,118,255,0.18)_58%,transparent_80%)] blur-md sm:h-20 sm:w-20"
                />
              )}

              {/* Circle itself */}
              <span
                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full font-['Inter',sans-serif] text-[14px] leading-none sm:h-9 sm:w-9 sm:text-[16px] ${active ? 'bg-[#B06CFF] font-bold text-white shadow-[0_0_14px_rgba(176,108,255,0.35)]' : done ? 'border-[1.5px] border-[#8022FE] bg-white font-semibold text-[#8022FE]' : 'border-[1.5px] border-[#E6E6E6] bg-[#F8F8F8] font-medium text-[#CDCDCD]'}`}
              >
                {number}
              </span>
            </span>
          </div>

          {/* Step title */}
          <p
            className={`mt-2 text-center font-['Inter',sans-serif] text-[14px] leading-normal font-medium sm:mt-2.5 sm:text-[16px] ${active || done ? 'text-[#181818]' : 'text-[#AFAFAF]'}`}
          >
            {item.title}
          </p>

          {/* Subtitle — hidden on mobile */}
          <p className="mt-0.5 hidden text-center font-['Inter',sans-serif] text-[14px] leading-none font-normal text-[#C2C2C2] sm:block">
            {item.subtitle}
          </p>
        </div>
      );
    })}
  </div>
);

/* ─────────────────────────────────────────────
   BOTTOM GLOW — matches Figma ellipse exactly
───────────────────────────────────────────── */
const Glow = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute -bottom-5 left-1/2 h-40 w-[140vw] -translate-x-1/2 scale-y-90 rounded-[9999px] bg-[linear-gradient(158deg,#8022FE_0%,white_100%)] opacity-80 blur-[60px] sm:top-207.5 sm:bottom-auto sm:left-10.75 sm:h-175 sm:w-458.5 sm:translate-x-0 sm:scale-y-100 sm:opacity-70 sm:shadow-[97.86666870117188px_97.86666870117188px_97.86666870117188px_rgba(0,0,0,0)] sm:blur-[48.93px]"
  />
);

const SectionHeading = ({ children }) => (
  <h1 className="text-center font-['Inter',sans-serif] text-[clamp(28px,4vw,54px)] leading-[1.3] font-bold text-[#181818]">
    {children}
  </h1>
);

const Accent = ({ children }) => <span className="text-[#8022FE]">{children}</span>;
const Dot = () => <span className="text-[#14F1D9]">.</span>;

const Body = ({ children }) => (
  <p className="mx-auto max-w-117.5 text-center font-['Inter',sans-serif] text-[16px] leading-normal font-medium text-[#272727]">
    {children}
  </p>
);

const PrimaryBtn = ({ onClick, disabled = false, children, fullWidthMobile = false }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`${fullWidthMobile ? 'w-full sm:w-auto' : ''} h-11 rounded-[10px] px-10 font-['Inter',sans-serif] text-[16px] leading-none font-semibold text-white transition-colors ${disabled ? 'cursor-not-allowed bg-[#E2E2E2] text-[#C3C3C3]' : 'bg-[#8022FE] hover:bg-[#6B1BDB]'}`}
  >
    {children}
  </button>
);

const OptionCard = ({ selected, onClick, icon, title, description }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex w-full flex-col items-start rounded-xl border-[1.5px] p-4 text-left transition-colors ${selected ? 'border-[#8022FE] bg-white' : 'border-[#E2E2E2] bg-[#F2F2F2]'}`}
  >
    <div className="mb-1 flex items-center gap-2">
      {icon({ className: `h-5 w-5 ${selected ? 'text-[#8022FE]' : 'text-[#181818]'}` })}
      <span
        className={`font-['Inter',sans-serif] text-[16px] font-medium ${selected ? 'text-[#8022FE]' : 'text-[#181818]'}`}
      >
        {title}
      </span>
    </div>
    <p className="m-0 font-['Inter',sans-serif] text-[14px] font-normal text-[#B7B7B7]">
      {description}
    </p>
  </button>
);

const GoalChip = ({ goal, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex h-14 w-full items-center gap-3 rounded-xl border-[1.5px] px-4 text-left transition-colors ${selected ? 'border-[#8022FE] bg-white' : 'border-[#E2E2E2]/50 bg-gray-50'}`}
  >
    <span
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-[1.5px] ${selected ? 'border-[#8022FE] bg-[#8022FE]' : 'border-[#D0D0D0] bg-transparent'}`}
    >
      {selected && (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M2 6L5 9L10 3"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
    <span
      className={`font-['Inter',sans-serif] text-[16px] font-medium ${selected ? 'text-[#8022FE]' : 'text-[#202020]'}`}
    >
      {goal}
    </span>
  </button>
);

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const OnboardingFlowView = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [routine, setRoutine] = useState('');
  const [startTime, setStartTime] = useState('07:00');
  const [startMeridiem, setStartMeridiem] = useState('AM');
  const [endTime, setEndTime] = useState('11:00');
  const [endMeridiem, setEndMeridiem] = useState('PM');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(17);

  const canContinue =
    step === 1 ||
    (step === 2 && selectedGoals.length > 0) ||
    (step === 3 && Boolean(routine)) ||
    (step === 4 && Boolean(startTime) && Boolean(endTime));

  useEffect(() => {
    if (!isGenerating) return;
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(id);
          return 100;
        }
        return Math.min(p + 7, 100);
      });
    }, 260);
    return () => clearInterval(id);
  }, [isGenerating]);

  useEffect(() => {
    if (progress < 100 || !isGenerating) return;
    const t = setTimeout(() => navigate('/dashboard', { replace: true }), 650);
    return () => clearTimeout(t);
  }, [progress, isGenerating, navigate]);

  const onBack = () => {
    if (step === 1) {
      navigate('/', { replace: true });
      return;
    }
    setStep((p) => Math.max(1, p - 1));
  };

  const onContinue = () => {
    if (!canContinue) return;
    if (step === 4) {
      setIsGenerating(true);
      return;
    }
    setStep((p) => p + 1);
  };

  const onSelectRoutine = (id) => {
    setRoutine(id);
    const s = ROUTINE_TIMES[id];
    if (!s) return;
    setStartTime(s.start);
    setStartMeridiem(s.startMeridiem);
    setEndTime(s.end);
    setEndMeridiem(s.endMeridiem);
  };

  const toggleGoal = (goal) =>
    setSelectedGoals((prev) => {
      if (prev.includes(goal)) return prev.filter((g) => g !== goal);
      if (prev.length >= 2) return [prev[1], goal];
      return [...prev, goal];
    });

  const progressStrokeOffset = useMemo(() => {
    const r = 88;
    return 2 * Math.PI * r - (progress / 100) * 2 * Math.PI * r;
  }, [progress]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      <div className="mx-auto max-w-480 px-4 pt-4 pb-8 sm:px-7 sm:pt-7">
        <div className="sm:relative">
          <div className="flex items-center justify-between gap-3">
            <div className="pt-1 sm:pt-2.5">
              <BackLink step={Math.min(step, 4)} onBack={onBack} />
            </div>

            <Brand />
          </div>

          <div className="mt-4 sm:absolute sm:top-0 sm:left-1/2 sm:mt-0 sm:-translate-x-1/2">
            <Stepper step={Math.min(step, 5)} />
          </div>
        </div>

        {!isGenerating && (
          <div className="relative mx-auto mt-10 flex w-full max-w-325 flex-col items-center justify-start gap-7.5 px-1 pb-22 text-center sm:absolute sm:top-77.75 sm:left-77.5 sm:mt-0 sm:px-0 sm:pb-0">
            {step === 1 && (
              <>
                <SectionHeading>
                  Let&rsquo;s set up your personal <Accent>AI</Accent>
                  <Dot />
                </SectionHeading>
                <Body maxWidth={470}>
                  Answer a few quick questions so your AI can understand your goals and build a plan
                  around you
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
            )}

            {step === 2 && (
              <>
                <div className="-mt-6">
                  <SectionHeading>
                    Where should your AI focus <Accent>First</Accent>
                    <span className="text-[#14F1D9]">?</span>
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
            )}

            {step === 3 && (
              <>
                <SectionHeading>
                  How your day is <Accent>Structured</Accent>
                  <Dot />
                </SectionHeading>
                <Body maxWidth={470}>
                  Your AI uses this to tailor your plan to your real daily routine.
                </Body>

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
            )}

            {step === 4 && (
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
            )}

            {step !== 1 && (
              <div
                className={`mt-4 flex w-full flex-col-reverse items-center gap-5 sm:mt-5 sm:flex-row sm:gap-5 ${step === 2 ? 'sm:justify-center' : 'sm:items-center'}`}
              >
                <button
                  type="button"
                  onClick={onBack}
                  className="w-full cursor-pointer border-0 bg-transparent p-0 font-['Inter',sans-serif] text-[15px] font-medium text-[#C5C5C5] sm:w-45 sm:text-[16px]"
                >
                  Skip for now
                </button>
                <PrimaryBtn onClick={onContinue} disabled={!canContinue} fullWidthMobile>
                  {step === 4 ? 'Generate My Plan' : 'Continue'}
                </PrimaryBtn>
              </div>
            )}
          </div>
        )}

        {isGenerating && (
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
        )}
      </div>

      <Glow />
    </div>
  );
};

export default OnboardingFlowView;
