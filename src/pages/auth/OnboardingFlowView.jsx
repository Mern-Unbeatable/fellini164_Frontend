import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { BACK_LABELS, ROUTINE_TIMES, STEP_META } from '../../constants';
import Step1 from './steps/Step1';
import Step2 from './steps/Step2';
import Step3 from './steps/Step3';
import Step4 from './steps/Step4';
import GeneratingPlan from './steps/GeneratingPlan';
import { PrimaryBtn } from './steps/common';

/* ─────────────────────────────────────────────
   BACK LINK
───────────────────────────────────────────── */

const BackLink = ({ step, onBack }) => (
  <button
    type="button"
    onClick={onBack}
    className="inline-flex items-center gap-1.5 text-sm text-[#A7A7A7] transition-colors hover:text-[#7A7A7A]"
  >
    <ChevronLeft className="h-4 w-4" />
    <span>{BACK_LABELS[step - 1]}</span>
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
    className="pointer-events-none absolute -bottom-20 left-1/2 h-40 w-[140vw] -translate-x-1/2 rounded-[9999px] bg-[radial-gradient(ellipse_at_center,rgba(128,34,254,0.45)_0%,rgba(128,34,254,0)_70%)] sm:top-207.5 sm:left-10.75 sm:h-175 sm:w-458.5 sm:translate-x-0 sm:rounded-[9999px] sm:bg-[linear-gradient(158deg,#8022FE_0%,white_100%)] sm:opacity-70 sm:blur-[48.93px]"
  />
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

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      <div className="mx-auto max-w-480 px-4 pt-4 pb-8 sm:px-7 sm:pt-7">
        <div className="sm:relative">
          <div className="flex items-center justify-between gap-3">
            <div className="pt-1 sm:pt-2.5">
              <BackLink step={step} onBack={onBack} />
            </div>

            <Brand />
          </div>

          <div className="mt-4 sm:absolute sm:top-0 sm:left-1/2 sm:mt-0 sm:-translate-x-1/2">
            <Stepper step={step} />
          </div>
        </div>

        {!isGenerating && (
          <div className="relative mx-auto mt-10 flex w-full max-w-325 flex-col items-center justify-start gap-7.5 px-1 pb-22 text-center sm:absolute sm:top-1/2 sm:left-1/2 sm:w-[1300px] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:gap-[50px] sm:px-0 sm:pb-0">
            {step === 1 && <Step1 onContinue={onContinue} />}
            {step === 2 && <Step2 selectedGoals={selectedGoals} toggleGoal={toggleGoal} />}
            {step === 3 && <Step3 routine={routine} onSelectRoutine={onSelectRoutine} />}
            {step === 4 && (
              <Step4
                startTime={startTime}
                setStartTime={setStartTime}
                startMeridiem={startMeridiem}
                setStartMeridiem={setStartMeridiem}
                endTime={endTime}
                setEndTime={setEndTime}
                endMeridiem={endMeridiem}
                setEndMeridiem={setEndMeridiem}
              />
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

        {isGenerating && <GeneratingPlan progress={progress} />}
      </div>

      <Glow />
    </div>
  );
};

export default OnboardingFlowView;
