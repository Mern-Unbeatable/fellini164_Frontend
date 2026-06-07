import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Apple, Eye, EyeOff, TriangleAlert, Loader2 } from 'lucide-react';
import { loginUser } from '../../features/auth/authAPI';
import { clearError, selectAuth } from '../../features/auth/authSlice';
import { toast } from 'react-toastify';

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
    <div className="min-h-screen bg-[#efefef] p-3 md:p-6">
      <div className="mx-auto w-full max-w-[1380px] rounded-[30px] bg-[#efefef] p-3 md:p-4">
        <div className="grid min-h-[calc(100vh-3rem)] grid-cols-1 gap-4 rounded-3xl md:min-h-[820px] md:grid-cols-2 md:gap-5">
          {/* ── Left Visual Panel ── */}
          <div className="order-2 overflow-hidden rounded-[18px] bg-[#23206f] md:order-1">
            <div className="relative h-full min-h-[280px] px-5 pt-5 pb-0 md:px-8 md:pt-7">
              {/* Glow blobs */}
              <div className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-[#7b56f4]/40 blur-3xl md:h-72 md:w-72" />
              <div className="absolute -top-20 right-6 h-44 w-44 rounded-full bg-[#4f80ff]/30 blur-3xl" />

              <div className="relative z-10 flex h-full flex-col">
                {/* Logo */}
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

                {/* Hero copy */}
                <div className="mt-10 max-w-[430px] md:mt-auto md:mb-7">
                  <h1 className="font-['Inter'] text-[34px] leading-[1.1] font-semibold text-white md:text-[44px]">
                    Design a life you&rsquo;re proud of
                    <br />
                    with AI that plans your <span className="text-[#30D6FB]">Day.</span>
                  </h1>
                  <p className="mt-3 font-['Inter'] text-sm text-white/85 md:text-[15px]">
                    Plan your day with AI and build habits that stick
                  </p>
                </div>

                {/* App preview card — flush to bottom */}
                <div className="mt-8 overflow-hidden rounded-t-2xl border border-white/15 bg-white/98 md:mt-auto">
                  <img
                    src="/images/Step1.png"
                    alt="Elyxa planner preview"
                    className="h-44 w-full object-cover object-top md:h-[320px]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Form Panel ── */}
          <div className="order-1 flex items-center justify-center rounded-[18px] bg-[#efefef] px-5 py-8 md:order-2 md:px-10 md:py-10">
            <div className="w-full max-w-[430px]">
              {/* Back link */}
              <div className="mb-8 text-center">
                <Link
                  to="/"
                  className="mb-9 inline-flex items-center gap-1.5 text-xs text-gray-400 no-underline hover:text-gray-500"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to Home
                </Link>

                {/* Heading */}
                <h2 className="font-['Inter'] text-[32px] leading-tight font-semibold text-[#1f1f1f]">
                  Welcome <span className="text-[#6b39f4]">Back.</span>
                </h2>
                <p className="mt-2 font-['Inter'] text-sm text-[#4b4b4b]">Log In to your account</p>
              </div>

              {/* API error banner */}
              {error && (
                <div className="mb-5 flex items-start rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <TriangleAlert className="mt-0.5 mr-2 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* OAuth buttons */}
              <div className="space-y-3">
                <button
                  type="button"
                  className="flex h-11 w-full items-center justify-center gap-2.5 rounded-lg border border-[#e8e8e8] bg-[#f4f4f4] font-['Inter'] text-sm text-[#4d4d4d] transition hover:bg-[#ececec]"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
                      fill="#4285F4"
                    />
                    <path
                      d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
                      fill="#34A853"
                    />
                    <path
                      d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </button>

                <button
                  type="button"
                  className="flex h-11 w-full items-center justify-center gap-2.5 rounded-lg border border-[#e8e8e8] bg-[#f4f4f4] font-['Inter'] text-sm text-[#4d4d4d] transition hover:bg-[#ececec]"
                >
                  <Apple className="h-[17px] w-[17px]" />
                  Continue with Apple
                </button>
              </div>

              {/* Divider */}
              <div className="my-5 flex items-center">
                <span className="h-px flex-1 bg-[#e7e7e7]" />
                <span className="px-3 text-xs text-[#b6b6b6]">Or continue with email</span>
                <span className="h-px flex-1 bg-[#e7e7e7]" />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block font-['Inter'] text-xs font-medium text-[#2b2b2b]"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="You@example.com"
                    className="h-11 w-full rounded-lg border border-[#e5e5e5] bg-[#f6f6f6] px-3 text-sm text-[#202020] transition outline-none placeholder:text-[#a8a8a8] focus:border-[#cacaca]"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-1.5 block font-['Inter'] text-xs font-medium text-[#2b2b2b]"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="h-11 w-full rounded-lg border border-[#e5e5e5] bg-[#f6f6f6] px-3 pr-11 text-sm text-[#202020] transition outline-none placeholder:text-[#a8a8a8] focus:border-[#cacaca]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute inset-y-0 right-3 flex items-center text-[#9b9b9b] hover:text-[#6b6b6b]"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Forgot password — right aligned */}
                  <div className="mt-1.5 flex justify-end">
                    <Link
                      to="/forgot-password"
                      className="text-xs font-medium text-[#6b39f4] hover:text-[#5d2fea] hover:no-underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || !isFormValid}
                  className={`mt-1 flex h-11 w-full items-center justify-center rounded-lg font-['Inter'] text-sm font-semibold transition ${
                    isFormValid && !loading
                      ? 'cursor-pointer bg-[#6b39f4] text-white hover:bg-[#5d2fea]'
                      : 'cursor-not-allowed bg-[#e7e7e7] text-[#bdbdbd]'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    'Log In'
                  )}
                </button>
              </form>

              {/* Sign up link */}
              <p className="mt-6 text-center text-sm text-[#3d3d3d]">
                Don&rsquo;t have an account?{' '}
                <Link
                  to="/signup"
                  className="font-medium text-[#6b39f4] hover:text-[#5d2fea] hover:no-underline"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
