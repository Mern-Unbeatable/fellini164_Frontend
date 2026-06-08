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

const BackLink = ({ step, onBack }) => {
  const label =
    step === 1
      ? 'Back to Website'
      : step === 2
        ? 'Back to Start'
        : step === 3
          ? 'Back to Goals'
          : step === 4
            ? 'Back to Routine'
            : 'Back to Schedule';

  return (
    <button
      type="button"
      onClick={onBack}
      className="inline-flex items-center gap-2 text-sm text-[#A7A7A7] transition hover:text-[#7A7A7A]"
    >
      <span className="text-base">←</span>
      {label}
    </button>
  );
};

const Brand = () => (
  <div className="flex items-center">
    <img src="/logo.png" alt="Elyxa.Ai" className="h-10 w-auto" />
  </div>
);

/* ── Stepper — sits centered in navbar row ── */
const Stepper = ({ step }) => (
  <div className="flex w-140 items-start justify-between">
    {STEP_META.map((item, index) => {
      const number = index + 1;
      const active = number === step;
      const completed = number < step;

      return (
        <div key={item.key} className="flex min-w-0 flex-1 flex-col items-center">
          {/* Connector lines + circle row */}
          <div className="relative flex w-full items-center justify-center">
            {/* Left connector */}
            {number > 1 && (
              <span
                className={`absolute right-1/2 left-0 h-px ${
                  completed || active ? 'bg-[#7A3DF2]' : 'bg-[#E0E0E0]'
                }`}
              />
            )}
            {/* Right connector */}
            {number < STEP_META.length && (
              <span
                className={`absolute right-0 left-1/2 h-px ${
                  completed ? 'bg-[#7A3DF2]' : 'bg-[#E0E0E0]'
                }`}
              />
            )}

            {/* Circle wrapper — holds glow + circle together */}
            <span className="relative z-10 flex h-10 w-10 items-center justify-center">
              {/* Radial glow blob — large soft lavender cloud, active only */}
              {active && (
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    width: '80px',
                    height: '80px',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    borderRadius: '50%',
                    background:
                      'radial-gradient(ellipse at center, rgba(162,118,245,0.85) 0%, rgba(162,118,245,0.45) 30%, rgba(162,118,245,0.15) 58%, transparent 75%)',
                    filter: 'blur(10px)',
                    pointerEvents: 'none',
                  }}
                />
              )}

              {/* Step circle */}
              <span
                className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold ${
                  active
                    ? 'border-[#C9A8F7] bg-white text-[#7A3DF2]'
                    : completed
                      ? 'border-[#7A3DF2] bg-white text-[#7A3DF2]'
                      : 'border-[#D9D9D9] bg-[#F0F0F0] text-[#B1B1B1]'
                }`}
              >
                {number}
              </span>
            </span>
          </div>

          {/* Step title */}
          <p
            className={`mt-1.5 text-sm font-medium ${
              active || completed ? 'text-[#1f1f1f]' : 'text-[#9E9E9E]'
            }`}
          >
            {item.title}
          </p>

          {/* Step subtitle */}
          <p className="text-xs text-[#BBBBBB]">{item.subtitle}</p>
        </div>
      );
    })}
  </div>
);

const Glow = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2"
    style={{
      width: '110vw',
      height: '340px',
      background:
        'radial-gradient(ellipse 80% 55% at 50% 100%, rgba(112,48,232,0.55) 0%, rgba(112,48,232,0.22) 45%, rgba(112,48,232,0.06) 70%, transparent 85%)',
      filter: 'blur(18px)',
    }}
  />
);

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
    if (!routine) return;
    const suggestion = ROUTINE_TIMES[routine];
    if (!suggestion) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStartTime(suggestion.start);
    setStartMeridiem(suggestion.startMeridiem);
    setEndTime(suggestion.end);
    setEndMeridiem(suggestion.endMeridiem);
  }, [routine]);

  useEffect(() => {
    if (!isGenerating) return;
    const id = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(id);
          return 100;
        }
        return Math.min(prev + 7, 100);
      });
    }, 260);
    return () => clearInterval(id);
  }, [isGenerating]);

  useEffect(() => {
    if (progress < 100 || !isGenerating) return;
    const timeoutId = setTimeout(() => {
      navigate('/dashboard', { replace: true });
    }, 650);
    return () => clearTimeout(timeoutId);
  }, [progress, isGenerating, navigate]);

  const onBack = () => {
    if (step === 1) {
      navigate('/', { replace: true });
      return;
    }
    setStep((prev) => Math.max(1, prev - 1));
  };

  const onContinue = () => {
    if (!canContinue) return;
    if (step === 5) {
      setIsGenerating(true);
      return;
    }
    setStep((prev) => prev + 1);
  };

  const toggleGoal = (goal) => {
    setSelectedGoals((prev) => {
      if (prev.includes(goal)) return prev.filter((item) => item !== goal);
      if (prev.length >= 2) return [prev[1], goal];
      return [...prev, goal];
    });
  };

  const progressStrokeOffset = useMemo(() => {
    const radius = 88;
    const circumference = 2 * Math.PI * radius;
    return circumference - (progress / 100) * circumference;
  }, [progress]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-white px-5 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-7xl">
        {/* ── Top navbar: back | stepper centered | brand ── */}
        <div className="relative flex items-center justify-between">
          <BackLink step={Math.min(step, 5)} onBack={onBack} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Stepper step={Math.min(step, 5)} />
          </div>
          <Brand />
        </div>

        {!isGenerating && (
          <div className="mx-auto mt-20 flex max-w-190 flex-col items-center text-center">
            {step === 1 && (
              <>
                <h1 className="font-['Inter'] text-[54px] leading-[1.3] font-bold text-[#1f1f1f] max-[480px]:text-[26px]">
                  Let&rsquo;s set up your personal <span className="text-[#7A3DF2]">AI</span>
                  <span className="text-[#31D1B9]">.</span>
                </h1>
                <p className="mt-4 max-w-130 text-base font-medium text-[#272727] max-[480px]:text-[14px]">
                  Answer a few quick questions so your AI can understand your goals and build a plan
                  around you
                </p>
                <button
                  type="button"
                  onClick={onContinue}
                  className="mt-8 h-11 rounded-lg bg-[#7A2FF0] px-10 text-base font-semibold text-white transition hover:bg-[#6921dd] max-[480px]:mt-[48vh] max-[480px]:w-full"
                >
                  Start Building My Plan
                </button>
                <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-[#B5B5B5]">
                  <Zap className="h-3.5 w-3.5" />
                  Take less than a minute
                </p>
              </>
            )}

            {step === 2 && (
              <>
                <h1 className="font-['Inter'] text-[54px] leading-tight font-bold text-[#1f1f1f] max-[480px]:text-[26px]">
                  Where should your AI focus <span className="text-[#7A3DF2]">First</span>
                  <span className="text-[#31D1B9]">?</span>
                </h1>
                <p className="mt-4 text-base font-medium text-[#272727] max-[480px]:text-[14px] max-[480px]:leading-normal">
                  Pick 2 focus areas, then choose your main priority
                </p>

                <div className="mt-8 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
                  {GOAL_OPTIONS.map((goal) => {
                    const selected = selectedGoals.includes(goal);
                    return (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => toggleGoal(goal)}
                        className={`flex h-14 items-center rounded-xl border px-4 text-left text-[31px] max-[480px]:text-[32px] sm:text-[20px] ${
                          selected
                            ? 'border-[#7A3DF2] bg-white text-[#6B39F4]'
                            : 'border-[#E2E2E2] bg-[#F2F2F2] text-[#202020]'
                        }`}
                      >
                        <span
                          className={`mr-3 h-5 w-5 rounded-md border ${selected ? 'border-[#7A3DF2] bg-[#7A3DF2]' : 'border-[#D0D0D0] bg-transparent'}`}
                        />
                        {goal}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h1 className="font-['Inter'] text-[54px] leading-tight font-bold text-[#1f1f1f] max-[480px]:text-[26px]">
                  How your day is <span className="text-[#7A3DF2]">Structured</span>
                  <span className="text-[#31D1B9]">.</span>
                </h1>
                <p className="mt-4 text-base font-medium text-[#272727] max-[480px]:text-[14px]">
                  Your AI uses this to tailor your plan to your real daily routine.
                </p>

                <div className="mt-8 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
                  {ROUTINE_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    const selected = routine === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setRoutine(option.id)}
                        className={`rounded-xl border p-4 text-left ${
                          selected ? 'border-[#7A3DF2] bg-white' : 'border-[#E2E2E2] bg-[#F2F2F2]'
                        }`}
                      >
                        <div
                          className={`mb-1 flex items-center gap-2 text-[20px] sm:text-[20px] ${selected ? 'text-[#6B39F4]' : 'text-[#1f1f1f]'}`}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="font-medium">{option.title}</span>
                        </div>
                        <p className="text-[14px] text-[#B7B7B7]">{option.description}</p>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <h1 className="font-['Inter'] text-[54px] leading-tight font-bold text-[#1f1f1f] max-[480px]:text-[26px]">
                  When you start and end your <span className="text-[#7A3DF2]">Day</span>
                  <span className="text-[#31D1B9]">.</span>
                </h1>
                <p className="mt-4 text-base font-medium text-[#272727] max-[480px]:text-[14px]">
                  Your AI uses this to plan your day around your energy. Adjust if needed.
                </p>

                <div className="mt-8 w-full max-w-160 rounded-2xl border border-[#E2E2E2] bg-[#F2F2F2] p-4 sm:p-6">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <p className="mb-2 flex items-center gap-2 text-lg font-medium text-[#1F1F1F]">
                        <Sun className="h-4 w-4 text-[#7A3DF2]" /> Start Your Day
                      </p>
                      <div className="flex items-center gap-2 rounded-xl border border-[#E2E2E2] bg-[#F7F7F7] px-3 py-2">
                        <input
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          placeholder="Time"
                          className="w-full bg-transparent text-[40px] font-semibold text-[#1F1F1F] outline-none sm:text-[34px]"
                        />
                        <select
                          value={startMeridiem}
                          onChange={(e) => setStartMeridiem(e.target.value)}
                          className="bg-transparent text-[40px] font-semibold text-[#B2B2B2] outline-none sm:text-[34px]"
                        >
                          <option>AM</option>
                          <option>PM</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 flex items-center gap-2 text-lg font-medium text-[#1F1F1F]">
                        <Moon className="h-4 w-4 text-[#7A3DF2]" /> End Your Day
                      </p>
                      <div className="flex items-center gap-2 rounded-xl border border-[#E2E2E2] bg-[#F7F7F7] px-3 py-2">
                        <input
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          placeholder="Time"
                          className="w-full bg-transparent text-[40px] font-semibold text-[#1F1F1F] outline-none sm:text-[34px]"
                        />
                        <select
                          value={endMeridiem}
                          onChange={(e) => setEndMeridiem(e.target.value)}
                          className="bg-transparent text-[40px] font-semibold text-[#B2B2B2] outline-none sm:text-[34px]"
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
                <h1 className="font-['Inter'] text-[54px] leading-tight font-bold text-[#1f1f1f] max-[480px]:text-[26px]">
                  How your AI should <span className="text-[#7A3DF2]">Communicate</span>
                  <span className="text-[#31D1B9]">.</span>
                </h1>
                <p className="mt-4 text-base font-medium text-[#272727] max-[480px]:text-[14px]">
                  This changes how your AI guides and interacts with you. You can change it anytime.
                </p>

                <div className="mt-8 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
                  {STYLE_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    const selected = style === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setStyle(option.id)}
                        className={`rounded-xl border p-4 text-left ${
                          selected ? 'border-[#7A3DF2] bg-white' : 'border-[#E2E2E2] bg-[#F2F2F2]'
                        }`}
                      >
                        <div
                          className={`mb-1 flex items-center gap-2 text-[20px] sm:text-[20px] ${selected ? 'text-[#6B39F4]' : 'text-[#1f1f1f]'}`}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="font-medium">{option.title}</span>
                        </div>
                        <p className="text-[14px] text-[#B7B7B7]">{option.description}</p>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {step !== 1 && (
              <div className="mt-8 flex items-center gap-6 max-[480px]:mt-10 max-[480px]:w-full max-[480px]:flex-col-reverse">
                <button
                  type="button"
                  onClick={onBack}
                  className="text-base font-medium text-[#C5C5C5]"
                >
                  Skip for now
                </button>
                <button
                  type="button"
                  onClick={onContinue}
                  disabled={!canContinue}
                  className={`h-11 rounded-lg px-9 text-base font-semibold transition max-[480px]:w-full ${
                    canContinue
                      ? 'bg-[#7A2FF0] text-white hover:bg-[#6921dd]'
                      : 'cursor-not-allowed bg-[#E2E2E2] text-[#C3C3C3]'
                  }`}
                >
                  {step === 5 ? 'Generate My Plan' : 'Continue'}
                </button>
              </div>
            )}
          </div>
        )}

        {isGenerating && (
          <div className="mx-auto mt-20 flex max-w-190 flex-col items-center text-center">
            <h1 className="font-['Inter'] text-[54px] leading-tight font-bold text-[#1f1f1f] max-[480px]:text-[26px]">
              Creating your AI <span className="text-[#7A3DF2]">Plan</span>
              <span className="text-[#31D1B9]">...</span>
            </h1>
            <p className="mt-4 text-base font-medium text-[#272727] max-[480px]:text-[14px]">
              Personalizing your AI to match your goals and routine
            </p>

            <div className="relative mt-8 h-47.5 w-47.5">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="88" stroke="#ECE5FA" strokeWidth="10" fill="none" />
                <circle
                  cx="100"
                  cy="100"
                  r="88"
                  stroke="#7A2FF0"
                  strokeWidth="10"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 88}
                  strokeDashoffset={progressStrokeOffset}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-[49px] font-bold text-[#7A2FF0]">{progress}%</p>
                <p className="text-sm text-[#C7C7C7]">Usually under a minute</p>
              </div>
            </div>

            <div className="mt-7 space-y-3 text-base">
              <p className="text-[#1f1f1f]">Analyzing your inputs...</p>
              <p className="text-[#C2C2C2]">Setting up your AI behavior...</p>
              <p className="text-[#D1D1D1]">Personalizing your experience...</p>
              <p className="text-[#DEDEDE]">Calibrating your focus and energy patterns...</p>
            </div>
          </div>
        )}
      </div>

      <Glow />
    </div>
  );
};

export default OnboardingFlowView;
