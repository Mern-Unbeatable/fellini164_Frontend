import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader2, TriangleAlert } from 'lucide-react';
import { clearError, selectAuth } from '../../features/auth/authSlice';
import { verifyOTP, resendOtp } from '../../features/auth/authAPI';

const RESEND_SECONDS = 30;
const OTP_LENGTH = 6;

const OTPVerifyView = () => {
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''));
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useSelector(selectAuth);

  const email = location.state?.email || '';

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        const next = [...digits];
        next[index] = '';
        setDigits(next);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        const next = [...digits];
        next[index - 1] = '';
        setDigits(next);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = [...digits];
    pasted.split('').forEach((ch, i) => {
      next[i] = ch;
    });
    setDigits(next);
    const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIdx]?.focus();
  };

  const handleResend = async () => {
    if (!canResend || resending) return;
    setResending(true);
    dispatch(clearError());
    try {
      await dispatch(resendOtp({ email }));
    } finally {
      setResending(false);
      setCanResend(false);
      setCountdown(RESEND_SECONDS);
      setDigits(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otp = digits.join('');
    if (otp.length < OTP_LENGTH) return;
    dispatch(clearError());
    const result = await dispatch(verifyOTP({ email, otp }));
    if (result.type === 'auth/verifyOTP/fulfilled') {
      const user = result.payload?.user;
      if (user?.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  };

  const otpComplete = digits.every((d) => d !== '');

  return (
    <div className="min-h-screen bg-[#efefef] p-3 md:p-6">
      <div className="mx-auto w-full max-w-345 rounded-[30px] bg-[#efefef] p-3 md:p-4">
        <div className="grid min-h-[calc(100vh-3rem)] grid-cols-1 gap-4 rounded-3xl md:min-h-205 md:grid-cols-2 md:gap-5">
          {/* ── Left Visual Panel ── */}
          <div className="order-2 overflow-hidden rounded-[18px] bg-[#23206f] md:order-1">
            <div className="relative h-full min-h-70 px-5 pt-5 pb-0 md:px-8 md:pt-7">
              <div className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-[#7b56f4]/40 blur-3xl md:h-72 md:w-72" />
              <div className="absolute -top-20 right-6 h-44 w-44 rounded-full bg-[#4f80ff]/30 blur-3xl" />

              <div className="relative z-10 flex h-full flex-col">
                <div className="flex items-center gap-2">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="22" height="22" rx="6" fill="#6b39f4" />
                    <path
                      d="M6 16L11 6L16 16"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path d="M8 13h6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <span className="font-['Inter'] text-[15px] font-semibold tracking-tight text-white">
                    Elyxa.Ai
                  </span>
                </div>

                <div className="mt-10 max-w-107.5 md:mt-auto md:mb-7">
                  <h1 className="font-['Inter'] text-[34px] leading-[1.1] font-semibold text-white md:text-[44px]">
                    Design a life you&rsquo;re proud of
                    <br />
                    with AI that plans your <span className="text-[#30D6FB]">Day.</span>
                  </h1>
                  <p className="mt-3 font-['Inter'] text-sm text-white/85 md:text-[15px]">
                    Plan your day with AI and build habits that stick
                  </p>
                </div>

                <div className="mt-8 overflow-hidden rounded-t-2xl border border-white/15 bg-white/98 md:mt-auto">
                  <img
                    src="/images/Step1.png"
                    alt="Elyxa planner preview"
                    className="h-44 w-full object-cover object-top md:h-80"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Right OTP Panel ── */}
          <div className="order-1 flex items-center justify-center rounded-[18px] bg-[#efefef] px-5 py-8 md:order-2 md:px-10 md:py-10">
            <div className="w-full max-w-107.5">
              <div className="mb-8 text-center">
                <h2 className="font-['Inter'] text-[32px] leading-tight font-semibold text-[#1f1f1f]">
                  Check your <span className="text-[#6b39f4]">Email.</span>
                </h2>
                <p className="mt-2 font-['Inter'] text-sm text-[#4b4b4b]">
                  We&rsquo;ve sent a code to{' '}
                  <span className="font-medium text-[#1f1f1f]">{email || 'your email'}</span>
                </p>
                <p className="mt-1 font-['Inter'] text-sm text-[#4b4b4b]">
                  Wrong email?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/signup')}
                    className="cursor-pointer border-none bg-transparent p-0 font-medium text-[#6b39f4] hover:text-[#5d2fea]"
                  >
                    Change it
                  </button>
                </p>
              </div>

              {error && (
                <div className="mb-5 flex items-start rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <TriangleAlert className="mt-0.5 mr-2 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <p className="mb-3 font-['Inter'] text-xs font-medium text-[#2b2b2b]">
                  Enter the 6-digit code
                </p>

                <div className="flex justify-between gap-2.5" onPaste={handlePaste}>
                  {digits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className={`h-14 w-full rounded-lg border bg-[#f6f6f6] text-center font-['Inter'] text-xl font-semibold text-[#1f1f1f] caret-transparent transition outline-none ${
                        digit
                          ? 'border-[#6b39f4] bg-white'
                          : 'border-[#e5e5e5] focus:border-[#6b39f4]'
                      }`}
                      aria-label={`Digit ${index + 1}`}
                    />
                  ))}
                </div>

                <div className="mt-4 text-center">
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={resending}
                      className="cursor-pointer border-none bg-transparent p-0 font-['Inter'] text-sm font-medium text-[#6b39f4] hover:text-[#5d2fea] disabled:opacity-60"
                    >
                      {resending ? 'Sending...' : 'Resend code'}
                    </button>
                  ) : (
                    <p className="font-['Inter'] text-sm text-[#b2b2b2]">
                      Resend code in {countdown}s
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || !otpComplete}
                  className={`mt-6 flex h-11 w-full items-center justify-center rounded-lg font-['Inter'] text-sm font-semibold transition ${
                    otpComplete && !loading
                      ? 'cursor-pointer bg-[#6b39f4] text-white hover:bg-[#5d2fea]'
                      : 'cursor-not-allowed bg-[#e7e7e7] text-[#bdbdbd]'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Verifying...
                    </span>
                  ) : (
                    'Verify Code'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerifyView;
