import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { verifyOTP } from '../../features/auth/authAPI';
import { POST } from '../../services/httpMethods';
import { selectAuth } from '../../features/auth/authSlice';
import { toast } from 'react-toastify';

const OTPVerifyView = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error: authError } = useSelector(selectAuth);
  const [localError, setLocalError] = useState('');
  const email = location.state?.email || '';

  const handleChange = (index, value) => {
    // If cleared
    if (!value) {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      return;
    }

    // Only accept the last character and ensure it's a digit
    const char = value.slice(-1);
    if (!/\d/.test(char)) return;

    const newOtp = [...otp];
    newOtp[index] = char;
    setOtp(newOtp);

    // Auto focus next input
    if (index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index, e) => {

    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Handle paste of full OTP (e.g., from email) and distribute across inputs
  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData?.getData('Text') || '';
    const digits = paste.replace(/\D/g, '').slice(0, 6).split('');
    if (digits.length === 0) return;
    const newOtp = [...otp];
    for (let i = 0; i < digits.length; i++) {
      newOtp[i] = digits[i];
    }
    setOtp(newOtp);
    const focusIndex = Math.min(digits.length, 6) - 1;
    const focusEl = document.getElementById(`otp-${focusIndex}`);
    focusEl?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      setLocalError('Please enter all 6 digits');
      return;
    }

    setLocalError('');

    const result = await dispatch(verifyOTP({ email, otp: otpCode }));

    // If OTP verification successful, show modal then navigate
    if (result.type === 'auth/verifyOTP/fulfilled') {
      setShowSuccessModal(true);

      setTimeout(() => {
        const user = result.payload.user;
        if (user.role === 'ADMIN') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }, 2500);
    }
  };

  const handleResendOTP = async () => {
    setLocalError('');
    try {
      const response = await POST('/api/v1/auth/resend-otp', { email });
      if (response?.success) {
        toast.success(response.message || 'OTP sent to your email!');
      } else {
        const msg = response?.message || 'Failed to resend OTP.';
        setLocalError(msg);
        toast.error(msg);
      }
    } catch (err) {
      console.error('Resend OTP error:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to resend OTP. Please try again.';
      setLocalError(msg);
      toast.error(msg);
    }
  };

  // Show errors via toast instead of inline alert
  useEffect(() => {
    if (localError) {
      toast.error(localError);
    }
  }, [localError]);

  useEffect(() => {
    if (authError) {
      toast.error(authError);
    }
  }, [authError]);

  return (
    <div className="min-h-screen bg-[#EEEEEE] dark:bg-black flex items-center justify-center p-8">
      <div className="w-full max-w-7xl flex shadow-2xl rounded-2xl overflow-hidden">
        {/* Left Side - Image/Content */}
        <div className="hidden lg:flex lg:w-1/2 bg-[#462A94] relative items-center justify-start p-12 pl-16">
          <div className="relative z-10 text-white max-w-md">
            <Link to="/">
              <img src="/WhiteLogo.png" alt="Logo" className="h-10" />
            </Link>
            <div className="flex justify-start">
              <div className="w-72 h-72">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <g fill="none" stroke="#BCA4FF" strokeWidth="6">
                    <ellipse cx="100" cy="100" rx="70" ry="25" />
                    <ellipse cx="100" cy="100" rx="70" ry="25" transform="rotate(60 100 100)" />
                    <ellipse cx="100" cy="100" rx="70" ry="25" transform="rotate(120 100 100)" />
                  </g>
                </svg>
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-6 leading-tight da">Verify Your Email</h1>
            <p className="text-purple-200 text-base">
              We've sent a verification code to your email address. Please check your inbox.
            </p>
          </div>
        </div>

        {/* Right Side - OTP Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-zinc-800">
          <div className="w-full max-w-md">

            <Link
              to="/signup"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 dark:text-white dark:hover:text-white hover:no-underline mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign Up
            </Link>

            {/* Header */}
            <div className="mb-8 text-center">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Check Your Email</h2>
              <p className="text-gray-600 dark:text-white mt-2">
                We sent a verification code to
              </p>
              <p className="text-purple-600 dark:text-purple-400 font-semibold">{email || 'your email'}</p>
            </div>

            {/* Errors will be shown via toast notifications */}

            {/* OTP Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* OTP Input Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-3 text-center">
                  Enter Verification Code
                </label>
                <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 dark:border-gray-200 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                      required
                    />
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#7C3AED] text-white py-3 rounded-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200 shadow-md hover:shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Verifying...
                  </span>
                ) : (
                  'Verify Email'
                )}
              </button>
            </form>

            {/* Resend Code */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm dark:text-white">
                Didn't receive the code?{' '}
                <button
                  onClick={handleResendOTP}
                  className="text-purple-600 hover:text-purple-700 font-semibold hover:underline"
                >
                  Resend Code
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">You're on the Waitlist!</h2>
            <p className="text-gray-600 text-base">
              We'll notify you when early access opens.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OTPVerifyView;
