import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Brain,
  Compass,
  Crown,
  GraduationCap,
  Laptop,
  Moon,
  Sparkles,
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

const STYLE_OPTIONS = [
  {
    id: 'direct',
    title: 'Direct & Goal-Oriented',
    description: 'Clear, focused, and efficient',
    icon: Sparkles,
  },
  {
    id: 'structured',
    title: 'Structured & Analytical',
    description: 'Logical, detailed, and consistent',
    icon: Brain,
  },
  {
    id: 'supportive',
    title: 'Supportive & Encouraging',
    description: 'Positive, motivating, and uplifting',
    icon: Compass,
  },
  {
    id: 'calm',
    title: 'Calm & Balanced',
    description: 'Steady, thoughtful, and low-pressure',
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
const BACK_LABELS = [
  'Back to Website',
  'Back to Start',
  'Back to Goals',
  'Back to Routine',
  'Back to Schedule',
];

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
    <span>{BACK_LABELS[Math.min(step - 1, 4)]}</span>
  </button>
);

/* ─────────────────────────────────────────────
   BRAND
───────────────────────────────────────────── */
const Brand = () => (
  <div className="flex shrink-0 items-center">
    <img src="/logo.png" alt="Elyxa.Ai" className="h-8 w-auto" />
  </div>
);

const Stepper = ({ step }) => (
  <div className="flex items-start" style={{ gap: 80 }}>
    {STEP_META.map((item, index) => {
      const number = index + 1;
      const active = number === step;
      const done = number < step;

      return (
        <div key={item.key} className="flex flex-col items-center" style={{ width: 120 }}>
          {/* Circle row with connectors */}
          <div className="relative flex w-full items-center justify-center" style={{ height: 36 }}>
            {/* Left connector */}
            {number > 1 && (
              <span
                className="absolute top-1/2 -translate-y-1/2"
                style={{
                  left: 0,
                  right: '50%',
                  height: 1,
                  background: done || active ? '#8022FE' : '#E0E0E0',
                }}
              />
            )}

            {/* Right connector */}
            {number < STEP_META.length && (
              <span
                className="absolute top-1/2 -translate-y-1/2"
                style={{
                  left: '50%',
                  right: 0,
                  height: 1,
                  background: done ? '#8022FE' : '#E0E0E0',
                }}
              />
            )}

            {/* Circle + glow */}
            <span
              className="relative z-10 flex items-center justify-center"
              style={{ width: 36, height: 36 }}
            >
              {/* Glow halo — active only, matches Figma ellipse blur */}
              {active && (
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    width: 80,
                    height: 80,
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    borderRadius: '50%',
                    background:
                      'radial-gradient(ellipse at center, rgba(128,34,254,0.75) 0%, rgba(128,34,254,0.40) 35%, rgba(128,34,254,0.12) 60%, transparent 78%)',
                    filter: 'blur(8px)',
                    pointerEvents: 'none',
                  }}
                />
              )}

              {/* Circle itself */}
              <span
                style={{
                  position: 'relative',
                  zIndex: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: active ? '#8022FE' : done ? '#ffffff' : '#F0F0F0',
                  border: active ? 'none' : done ? '1.5px solid #8022FE' : '1.5px solid #D9D9D9',
                  fontSize: 16,
                  fontWeight: active ? 700 : done ? 600 : 500,
                  fontFamily: 'Inter, sans-serif',
                  color: active ? '#ffffff' : done ? '#8022FE' : '#C2C2C2',
                  lineHeight: 1,
                }}
              >
                {number}
              </span>
            </span>
          </div>

          {/* Step title */}
          <p
            className="mt-2.5 text-center"
            style={{
              fontSize: 16,
              fontWeight: 500,
              fontFamily: 'Inter, sans-serif',
              color: active || done ? '#181818' : '#9E9E9E',
              lineHeight: 1.5,
            }}
          >
            {item.title}
          </p>

          {/* Subtitle — hidden on mobile */}
          <p
            className="hidden text-center sm:block"
            style={{
              fontSize: 14,
              fontWeight: 400,
              fontFamily: 'Inter, sans-serif',
              color: '#C2C2C2',
              lineHeight: 1,
              marginTop: 2,
            }}
          >
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
    style={{
      position: 'absolute',
      width: 1834,
      height: 700,
      left: 43,
      top: 830,
      opacity: 0.7,
      background: 'linear-gradient(158deg, #8022FE 0%, white 100%)',
      boxShadow: '97.86666870117188px 97.86666870117188px 97.86666870117188px rgba(0,0,0,0)',
      borderRadius: 9999,
      filter: 'blur(48.93px)',
      pointerEvents: 'none',
    }}
  />
);

const SectionHeading = ({ children }) => (
  <h1 className="text-center font-['Inter',sans-serif] text-[clamp(28px,4vw,54px)] leading-[1.3] font-bold text-[#181818]">
    {children}
  </h1>
);

const Accent = ({ children }) => <span className="text-[#8022FE]">{children}</span>;
const Dot = () => <span className="text-[#14F1D9]">.</span>;

const Body = ({ children, maxWidth = 470 }) => (
  <p
    className="mx-auto text-center font-['Inter',sans-serif] text-[16px] leading-normal font-medium text-[#272727]"
    style={{ maxWidth }}
  >
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
    className={`flex h-14 w-full items-center gap-3 rounded-xl border-[1.5px] px-4 text-left transition-colors ${selected ? 'border-[#8022FE] bg-white' : 'border-[#E2E2E2] bg-[#F2F2F2]'}`}
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
  const [style, setStyle] = useState('');
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
    (step === 4 && Boolean(startTime) && Boolean(endTime)) ||
    (step === 5 && Boolean(style));

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
    if (step === 5) {
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
      <div className="mx-auto max-w-480 px-7.5 pt-7">
        <div className="relative flex items-start justify-between">
          <div className="pt-2.5">
            <BackLink step={Math.min(step, 5)} onBack={onBack} />
          </div>

          <div className="absolute top-0 left-1/2 -translate-x-1/2">
            <Stepper step={Math.min(step, 5)} />
          </div>

          <Brand />
        </div>

        {!isGenerating && (
          <div className="absolute top-77.75 left-77.5 inline-flex w-325 flex-col items-center justify-start gap-7.5 text-center">
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

                <div className="flex flex-col items-center gap-5">
                  <PrimaryBtn onClick={onContinue} fullWidthMobile>
                    Start Building My Plan
                  </PrimaryBtn>
                  <p className="m-0 inline-flex items-center gap-1.5 font-['Inter',sans-serif] text-[14px] text-[#B5B5B5]">
                    <Zap style={{ width: 14, height: 14 }} />
                    Take less than a minute
                  </p>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <SectionHeading>
                  Where should your AI focus <Accent>First</Accent>
                  <span style={{ color: '#14F1D9' }}>?</span>
                </SectionHeading>
                <Body maxWidth={470}>Pick 2 focus areas, then choose your main priority</Body>

                <div className="mt-8 grid w-full grid-cols-2 gap-3 max-sm:grid-cols-1">
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
                <Body>
                  Your AI uses this to plan your day around your energy. Adjust if needed.
                </Body>

                <div className="mt-8 box-border w-full max-w-160 rounded-2xl border-[1.5px] border-[#E2E2E2] bg-[#F2F2F2] p-6">
                  <div className="grid grid-cols-2 gap-5 max-sm:grid-cols-1">
                    <div>
                      <p className="mb-2 flex items-center gap-2 font-['Inter',sans-serif] text-[16px] font-medium text-[#1F1F1F]">
                        <Sun style={{ width: 16, height: 16, color: '#8022FE' }} />
                        Start Your Day
                      </p>
                      <div className="flex items-center gap-2 rounded-xl border-[1.5px] border-[#E2E2E2] bg-[#F7F7F7] px-3 py-2">
                        <input
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          placeholder="00:00"
                          className="flex-1 border-0 bg-transparent font-['Inter',sans-serif] text-[34px] font-semibold text-[#1F1F1F] outline-none"
                        />
                        <select
                          value={startMeridiem}
                          onChange={(e) => setStartMeridiem(e.target.value)}
                          className="cursor-pointer border-0 bg-transparent font-['Inter',sans-serif] text-[34px] font-semibold text-[#B2B2B2] outline-none"
                        >
                          <option>AM</option>
                          <option>PM</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 flex items-center gap-2 font-['Inter',sans-serif] text-[16px] font-medium text-[#1F1F1F]">
                        <Moon style={{ width: 16, height: 16, color: '#8022FE' }} />
                        End Your Day
                      </p>
                      <div className="flex items-center gap-2 rounded-xl border-[1.5px] border-[#E2E2E2] bg-[#F7F7F7] px-3 py-2">
                        <input
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          placeholder="00:00"
                          className="flex-1 border-0 bg-transparent font-['Inter',sans-serif] text-[34px] font-semibold text-[#1F1F1F] outline-none"
                        />
                        <select
                          value={endMeridiem}
                          onChange={(e) => setEndMeridiem(e.target.value)}
                          className="cursor-pointer border-0 bg-transparent font-['Inter',sans-serif] text-[34px] font-semibold text-[#B2B2B2] outline-none"
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

            {step === 5 && (
              <>
                <SectionHeading>
                  How your AI should <Accent>Communicate</Accent>
                  <Dot />
                </SectionHeading>
                <Body maxWidth={470}>
                  This changes how your AI guides and interacts with you. You can change it anytime.
                </Body>

                <div className="mt-8 grid w-full grid-cols-2 gap-3 max-sm:grid-cols-1">
                  {STYLE_OPTIONS.map((opt) => (
                    <OptionCard
                      key={opt.id}
                      selected={style === opt.id}
                      onClick={() => setStyle(opt.id)}
                      icon={opt.icon}
                      title={opt.title}
                      description={opt.description}
                    />
                  ))}
                </div>
              </>
            )}

            {step !== 1 && (
              <div className="mt-8 flex items-center gap-6 max-sm:mt-10 max-sm:w-full max-sm:flex-col-reverse">
                <button
                  type="button"
                  onClick={onBack}
                  className="cursor-pointer border-0 bg-transparent p-0 font-['Inter',sans-serif] text-[16px] font-medium text-[#C5C5C5]"
                >
                  Skip for now
                </button>
                <PrimaryBtn onClick={onContinue} disabled={!canContinue} fullWidthMobile>
                  {step === 5 ? 'Generate My Plan' : 'Continue'}
                </PrimaryBtn>
              </div>
            )}
          </div>
        )}

        {isGenerating && (
          <div className="mx-auto mt-20 flex max-w-190 flex-col items-center text-center">
            <SectionHeading>
              Creating your AI <Accent>Plan</Accent>
              <span style={{ color: '#14F1D9' }}>...</span>
            </SectionHeading>
            <Body maxWidth={470}>Personalizing your AI to match your goals and routine</Body>

            <div className="relative mt-8 h-47.5 w-47.5">
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
                <p className="m-0 font-['Inter',sans-serif] text-[49px] leading-none font-bold text-[#8022FE]">
                  {progress}%
                </p>
                <p className="mt-1 font-['Inter',sans-serif] text-[13px] text-[#C7C7C7]">
                  Usually under a minute
                </p>
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-3">
              {[
                { text: 'Analyzing your inputs...', color: '#1f1f1f' },
                { text: 'Setting up your AI behavior...', color: '#C2C2C2' },
                { text: 'Personalizing your experience...', color: '#D1D1D1' },
                { text: 'Calibrating your focus and energy patterns...', color: '#DEDEDE' },
              ].map((line) => (
                <p
                  key={line.text}
                  className="m-0 font-['Inter',sans-serif] text-[16px]"
                  style={{ color: line.color }}
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
