import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, TriangleAlert, Loader2 } from 'lucide-react';
import { loginUser } from '../../features/auth/authAPI';
import { clearError, selectAuth } from '../../features/auth/authSlice';
import { toast } from 'react-toastify';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';

const LoginView = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user } = useSelector(selectAuth);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(loginUser({ email, password }));
    if (result.type === 'auth/login/fulfilled') {
      toast.success('Login successful! Welcome back.', {
        position: 'top-right',
        autoClose: 2000,
      });
    }
  };

  const isFormValid = email.trim() && password.trim();

  return (
    <div className="flex min-h-screen flex-col bg-white md:h-screen md:flex-row md:gap-5 md:overflow-hidden md:p-5">
      {/* ── Left Visual Panel — bottom on mobile, left on desktop ── */}
      <div className="order-2 p-2 md:order-1 md:flex-1 md:p-0">
        <img
          src="/images/SignUp.png"
          alt="Auth Visual"
          className="h-auto w-full rounded-[20px] md:h-full md:rounded-[30px]"
        />
      </div>

      {/* ── Form Panel — top on mobile, right on desktop ── */}
      <div className="order-1 flex flex-col gap-12.5 px-5 py-10 md:order-2 md:flex-1 md:justify-center md:gap-8 md:overflow-hidden md:px-0 md:py-7.5">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2.5 font-['Inter',sans-serif] text-[12px] text-[#a3a3a3] no-underline transition-colors hover:text-[#7a7a7a] md:text-[14px]"
        >
          <ArrowLeft className="h-3.5 w-3.5 md:h-4 md:w-4" />
          Back to Home
        </Link>

        {/* Form content — max 530px, centered on desktop */}
        <div className="flex w-full flex-col gap-7.5 md:mx-auto md:max-w-132.5 md:gap-7.5">
          {/* Heading */}
          <div className="flex flex-col items-center gap-3.5 text-center md:gap-3.5">
            <p className="font-['Inter',sans-serif] text-[22px] leading-[1.3] font-bold text-[#181818] md:text-[34px]">
              {'Welcome '}
              <span className="text-[#8022fe]">Back</span>
              <span className="text-[#14f1d9]">.</span>
            </p>
            <p className="font-['Inter',sans-serif] text-[14px] leading-normal font-medium text-[#181818] md:text-[16px]">
              Log In to your account
            </p>
          </div>

          {/* Social + divider + form */}
          <div className="flex flex-col gap-7.5 md:gap-7.5">
            {/* Social buttons */}
            <div className="flex flex-col gap-2.5 md:gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-[10px] border border-[#f2f2f2] bg-[#fcfcfc] px-3 py-2.5 font-['Inter',sans-serif] text-[14px] leading-normal font-medium text-[#5d5d5d] transition-colors hover:bg-[#f5f5f5] md:text-[16px]"
              >
                <FcGoogle className="h-3.75 w-3.75 shrink-0 md:h-4.5 md:w-4.5" />
                Continue with Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-[10px] border border-[#f2f2f2] bg-[#fcfcfc] px-3 py-2.5 font-['Inter',sans-serif] text-[14px] leading-normal font-medium text-[#5d5d5d] transition-colors hover:bg-[#f5f5f5] md:text-[16px]"
              >
                <FaApple className="h-4.25 w-3.5 shrink-0 md:h-5 md:w-3.75" />
                Continue with Apple
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-5">
              <div className="h-px flex-1 bg-[#f2f2f2]" />
              <span className="font-['Inter',sans-serif] text-[12px] whitespace-nowrap text-[#c2c2c2] md:text-[14px]">
                Or continue with email
              </span>
              <div className="h-px flex-1 bg-[#f2f2f2]" />
            </div>

            {/* API error banner */}
            {error && (
              <div className="flex items-start gap-2 rounded-[10px] border border-red-300 bg-red-50 px-4 py-3">
                <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                <span className="font-['Inter',sans-serif] text-[12px] text-red-700 md:text-[14px]">
                  {error}
                </span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-7.5 md:gap-8">
              {/* Input fields */}
              <div className="flex flex-col gap-5 md:gap-5">
                {/* Email */}
                <div className="flex flex-col gap-2 md:gap-2.5">
                  <label className="font-['Inter',sans-serif] text-[12px] leading-normal font-medium text-[#181818] md:text-[14px]">
                    Email
                  </label>
                  <div className="flex items-center rounded-[10px] border border-[#f2f2f2] bg-white px-4 py-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="You@example.com"
                      className="min-w-0 flex-1 bg-transparent font-['Inter',sans-serif] text-[14px] leading-normal font-medium text-[#181818] outline-none placeholder:text-[#c2c2c2] md:text-[16px]"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="flex flex-col gap-2 md:gap-2.5">
                  <label className="font-['Inter',sans-serif] text-[12px] leading-normal font-medium text-[#181818] md:text-[14px]">
                    Password
                  </label>
                  <div className="flex items-center justify-between rounded-[10px] border border-[#8022fe] bg-white px-4 py-3">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="min-w-0 flex-1 bg-transparent font-['Inter',sans-serif] text-[14px] leading-normal font-medium text-[#181818] outline-none placeholder:text-[#c2c2c2] md:text-[16px]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="ml-2 shrink-0 text-[#c2c2c2] transition-colors hover:text-[#8022fe]"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4.5 w-4.5 md:h-5 md:w-5" />
                      ) : (
                        <Eye className="h-4.5 w-4.5 md:h-5 md:w-5" />
                      )}
                    </button>
                  </div>
                  <div className="flex justify-end">
                    <Link
                      to="/forgot-password"
                      className="font-['Inter',sans-serif] text-[12px] font-medium text-[#8022fe] no-underline hover:underline md:text-[14px]"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>
              </div>

              {/* Submit + sign up + terms */}
              <div className="flex flex-col gap-5 md:gap-5">
                <div className="flex flex-col items-center gap-5">
                  <button
                    type="submit"
                    disabled={loading || !isFormValid}
                    className={`w-full rounded-[10px] px-5 py-3 font-['Inter',sans-serif] text-[14px] leading-none font-semibold transition-colors md:text-[16px] ${
                      isFormValid && !loading
                        ? 'cursor-pointer bg-[#8022fe] text-white hover:bg-[#6b1bdb]'
                        : 'cursor-not-allowed bg-[#f1f1f1] text-[#dedede]'
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Signing in...
                      </span>
                    ) : (
                      'Log In'
                    )}
                  </button>
                  <p className="text-center font-['Inter',sans-serif] text-[14px] leading-normal font-medium text-[#181818] md:text-[16px]">
                    Don&rsquo;t have an account?{' '}
                    <Link
                      to="/signup"
                      onClick={() => dispatch(clearError())}
                      className="text-[#8022fe] no-underline hover:underline"
                    >
                      Sign Up
                    </Link>
                  </p>
                </div>
                <p className="text-center font-['Inter',sans-serif] text-[10px] leading-normal font-medium text-[#c2c2c2] md:text-[12px]">
                  By signing in, you agree to our{' '}
                  <span className="cursor-pointer underline">Terms</span>
                  {' and '}
                  <span className="cursor-pointer underline">Privacy Policy</span>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
