import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import gsap from 'gsap';
import { BACK_LABELS, ROUTINE_TIMES, STEP_META } from '../../constants';
import Step1 from './steps/Step1';
import Step2 from './steps/Step2';
import Step3 from './steps/Step3';
import Step4 from './steps/Step4';
import Step5 from './steps/Step5';
import GeneratingPlan from './steps/GeneratingPlan';

const BackLink = ({ step, onBack }) => (
  <button
    type="button"
    onClick={onBack}
    className="inline-flex items-center gap-1.5 text-sm text-[#A7A7A7] transition-colors hover:text-[#7A7A7A]"
  >
    <ChevronLeft className="h-4 w-4" />
    <span>{BACK_LABELS[step - 1] ?? 'Back to Schedule'}</span>
  </button>
);

const Brand = () => (
  <div className="flex shrink-0 items-center">
    <img src="/logo.png" alt="Elyxa.Ai" className="h-9 w-auto sm:h-12" />
  </div>
);

const Stepper = ({ step }) => (
  <div className="flex w-full items-start justify-between gap-3 sm:w-200 sm:gap-0 md:w-full md:gap-3 lg:w-200 lg:gap-0">
    {STEP_META.map((item, index) => {
      const number = index + 1;
      const active = number === step;
      const done = number < step;

      return (
        <div
          key={item.key}
          className="flex min-w-0 flex-1 flex-col items-center sm:w-40 sm:flex-none md:flex-1 md:w-auto lg:w-40 lg:flex-none"
        >
          <div className="relative flex h-8 w-full items-center justify-center sm:h-9">
            {number > 1 && (
              <span
                className={`absolute top-1/2 right-[calc(50%+16px)] left-0 h-px -translate-y-1/2 sm:right-[calc(50%+18px)] ${done || active ? 'bg-[#8022FE]' : 'bg-[#ECECEC]'}`}
              />
            )}
            {number < STEP_META.length && (
              <span
                className={`absolute top-1/2 right-0 left-[calc(50%+16px)] h-px -translate-y-1/2 sm:left-[calc(50%+18px)] ${done ? 'bg-[#8022FE]' : 'bg-[#ECECEC]'}`}
              />
            )}
            <span className="relative z-10 flex h-8 w-8 items-center justify-center sm:h-9 sm:w-9">
              {active && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(173,118,255,0.82)_0%,rgba(173,118,255,0.48)_32%,rgba(173,118,255,0.18)_58%,transparent_80%)] blur-md sm:h-20 sm:w-20"
                />
              )}
              <span
                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full font-['Inter',sans-serif] text-[14px] leading-none sm:h-9 sm:w-9 sm:text-[16px] ${active ? 'bg-[#B06CFF] font-bold text-white shadow-[0_0_14px_rgba(176,108,255,0.35)]' : done ? 'border-[1.5px] border-[#8022FE] bg-white font-semibold text-[#8022FE]' : 'border-[1.5px] border-[#E6E6E6] bg-[#F8F8F8] font-medium text-[#CDCDCD]'}`}
              >
                {number}
              </span>
            </span>
          </div>
          <p
            className={`mt-2 text-center font-['Inter',sans-serif] text-[14px] leading-normal font-medium sm:mt-2.5 sm:text-[16px] ${active || done ? 'text-[#181818]' : 'text-[#AFAFAF]'}`}
          >
            {item.title}
          </p>
          <p className="mt-0.5 hidden text-center font-['Inter',sans-serif] text-[14px] leading-none font-normal text-[#C2C2C2] sm:block">
            {item.subtitle}
          </p>
        </div>
      );
    })}
  </div>
);

const Glow = ({ step }) => {
  const innerRef = useRef(null);
  const idleTweenRef = useRef(null);
  const prevStepRef = useRef(step);

  // Idle breathing — smooth infinite yoyo loop
  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    idleTweenRef.current = gsap.fromTo(
      el,
      { scale: 0.97, opacity: 0.62 },
      { scale: 1.06, opacity: 0.82, duration: 3.0, ease: 'sine.inOut', repeat: -1, yoyo: true }
    );
    return () => idleTweenRef.current?.kill();
  }, []);

  // Step-change pulse — pause idle, swell briefly, return, resume
  useEffect(() => {
    const el = innerRef.current;
    if (!el || step === prevStepRef.current) {
      prevStepRef.current = step;
      return;
    }
    prevStepRef.current = step;
    idleTweenRef.current?.pause();
    gsap.to(el, {
      scale: 1.13,
      opacity: 0.96,
      duration: 0.9,
      ease: 'power1.inOut',
      onComplete: () => {
        gsap.to(el, {
          scale: 1,
          opacity: 0.7,
          duration: 1.6,
          ease: 'sine.out',
          onComplete: () => idleTweenRef.current?.restart(),
        });
      },
    });
  }, [step]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -bottom-20 left-1/2 -translate-x-1/2 sm:top-207.5 sm:left-10.75 sm:translate-x-0"
    >
      <div
        ref={innerRef}
        className="h-40 w-[140vw] rounded-[9999px] bg-[radial-gradient(ellipse_at_center,rgba(128,34,254,0.45)_0%,rgba(128,34,254,0)_70%)] sm:h-175 sm:w-458.5 sm:bg-[linear-gradient(158deg,#8022FE_0%,white_100%)] sm:blur-[48.93px]"
      />
    </div>
  );
};

const OnboardingFlowView = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [routine, setRoutine] = useState('');
  const [startTime, setStartTime] = useState('07:00');
  const [startMeridiem, setStartMeridiem] = useState('AM');
  const [endTime, setEndTime] = useState('11:00');
  const [endMeridiem, setEndMeridiem] = useState('PM');
  const [style, setStyle] = useState('');
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

  const onSelectStyle = (id) => setStyle(id);

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
        <div className="sm:grid sm:grid-cols-[1.2fr_auto_1.4fr] sm:items-center md:block lg:grid lg:grid-cols-[1.2fr_auto_1.4fr] lg:items-center">
          <div className="flex items-center justify-between sm:contents md:flex md:items-center md:justify-between lg:contents">
            <div>
              <BackLink step={step} onBack={onBack} />
            </div>
            <div className="sm:col-start-3 sm:flex sm:justify-end">
              <Brand />
            </div>
          </div>
          <div className="mt-8 sm:col-start-2 sm:row-start-1 sm:mt-0 md:mt-4 lg:mt-0">
            <Stepper step={step} />
          </div>
        </div>

        {!isGenerating && (
          <div className="relative mx-auto mt-10 flex w-full max-w-325 flex-col items-center justify-start gap-7.5 px-1 text-center sm:absolute sm:top-1/2 sm:left-1/2 sm:w-325 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:gap-12.5 sm:px-0 sm:pb-0 md:static md:top-auto md:left-auto md:w-full md:translate-x-0 md:translate-y-0 md:gap-7.5 md:px-1 lg:absolute lg:top-1/2 lg:left-1/2 lg:w-325 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:gap-12.5 lg:px-0">
            {step === 1 && <Step1 onContinue={onContinue} />}
            {step === 2 && (
              <Step2
                selectedGoals={selectedGoals}
                toggleGoal={toggleGoal}
                onContinue={onContinue}
                onBack={onBack}
                canContinue={canContinue}
              />
            )}
            {step === 3 && (
              <Step3
                routine={routine}
                onSelectRoutine={onSelectRoutine}
                onContinue={onContinue}
                onBack={onBack}
                canContinue={canContinue}
              />
            )}
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
                onContinue={onContinue}
                onBack={onBack}
                canContinue={canContinue}
              />
            )}
            {step === 5 && (
              <Step5
                style={style}
                onSelectStyle={onSelectStyle}
                onContinue={onContinue}
                canContinue={canContinue}
              />
            )}
          </div>
        )}

        {isGenerating && <GeneratingPlan progress={progress} />}
      </div>

      <Glow step={step} />
    </div>
  );
};

export default OnboardingFlowView;
