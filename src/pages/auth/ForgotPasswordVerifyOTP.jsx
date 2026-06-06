import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';

import { sendForgotOTP, verifyResetOTP } from '../../features/auth/authAPI';

const ForgotPasswordVerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const email = location.state?.email || '';

  const [otp, setOtp] = useState(Array(6).fill(''));
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);

  const [seconds, setSeconds] = useState(30);
  const [canResend, setCanResend] = useState(false);

  /* ================= TIMER ================= */
  useEffect(() => {
    if (seconds === 0) {
      setCanResend(true);
      return;
    }

    const timer = setTimeout(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [seconds]);

  /* ================= OTP INPUT ================= */
  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData?.getData('text') || '';
    const digits = pasted.replace(/\D/g, '').slice(0, 6).split('');
    if (!digits.length) return;

    const newOtp = Array(6).fill('');
    digits.forEach((d, i) => (newOtp[i] = d));
    setOtp(newOtp);
  };


  const handleNext = async (e) => {
    e.preventDefault();

    const finalOtp = otp.join('');
    if (finalOtp.length !== 6) {
      toast.error('OTP must be 6 digits');
      return;
    }

    try {
      setVerifying(true);

      
      await dispatch(
        verifyResetOTP({ email, otp: finalOtp })
      ).unwrap();

      toast.success('OTP verified successfully');

      navigate('/reset-Password', {
        state: { email, otp: finalOtp },
      });
    } catch (error) {
      toast.error(
        error?.message || error || 'OTP verification failed'
      );
    } finally {
      setVerifying(false);
    }
  };

  /* ================= RESEND OTP ================= */
  const handleResendOTP = async () => {
    try {
      setResending(true);

      await dispatch(sendForgotOTP({ email })).unwrap();

      setOtp(Array(6).fill(''));
      setSeconds(30);
      setCanResend(false);

      toast.success('New OTP sent to your email');
    } catch (error) {
      toast.error(
        error?.message || error || 'Failed to resend OTP'
      );
    } finally {
      setResending(false);
    }
  };

  const isDisabled = otp.some((d) => d === '');

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#D9D9D9] dark:bg-zinc-800 px-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl dark:bg-zinc-700">
        <Link
          to="/forgot-password"
          className="absolute top-5 left-5 text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
        >
          <ArrowLeft />
        </Link>

        <h2 className="text-center text-xl font-semibold md:text-3xl dark:text-gray-100">
          Verify OTP
        </h2>
        <p className="mb-6 text-center text-gray-500 dark:text-gray-300">
          Enter the 6-digit code sent to your email
        </p>

        <form onSubmit={handleNext} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 text-center dark:text-gray-200">
              Enter Verification Code
            </label>

            <div
              className="flex gap-2 justify-center"
              onPaste={handlePaste}
            >
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) =>
                    handleChange(index, e.target.value)
                  }
                  onKeyDown={(e) =>
                    handleKeyDown(index, e)
                  }
                  className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none dark:text-gray-200 dark:placeholder:text-gray-400"
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isDisabled || verifying}
            className="w-full bg-[#7C3AED] text-white py-3 rounded-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {verifying ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

      
        <div className="mt-4 text-center">
          {!canResend ? (
            <p className="text-sm text-gray-500">
              Resend OTP in{' '}
              <span className="font-semibold">{seconds}s</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={resending}
              className="text-sm font-semibold text-purple-500  dark:text-purple-400 hover:underline disabled:text-gray-400"
            >
              {resending ? 'Sending...' : 'Resend OTP'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordVerifyOTP;
