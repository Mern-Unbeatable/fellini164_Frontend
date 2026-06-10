import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, ArrowLeft, TriangleAlert, Apple, Eye, EyeOff } from 'lucide-react';
import { registerUser } from '../../features/auth/authAPI';
import { clearError, selectAuth } from '../../features/auth/authSlice';
import { FcGoogle } from 'react-icons/fc';

const RegisterView = () => {
  const [searchParams] = useSearchParams();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(selectAuth);

  useEffect(() => {
    const refCode = searchParams.get('ref');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (refCode) setReferralCode(refCode);
  }, [searchParams]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    setIsSubmitted(true);

    if (!fullName.trim() || !email.trim() || !password.trim() || password.length < 8) return;

    const userData = {
      fullName: fullName.trim(),
      email: email.trim(),
      password,
    };

    if (referralCode.trim()) userData.referralCode = referralCode.trim();

    const result = await dispatch(registerUser(userData));
    if (result.type === 'auth/register/fulfilled') {
      navigate('/verify-otp', { state: { email } });
    }
  };

  const hasNameError = isSubmitted && !fullName.trim();
  const hasEmailError = isSubmitted && !email.trim();
  const hasPasswordError = isSubmitted && password.length < 8;

  const getPasswordStrength = (value) => {
    if (!value) return null;
    let score = 0;
    if (value.length >= 8) score += 1;
    if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score += 1;
    if (/\d/.test(value) || /[^A-Za-z0-9]/.test(value)) score += 1;
    if (score <= 1) return { label: 'Weak', color: 'text-red-500' };
    if (score === 2) return { label: 'Medium', color: 'text-amber-500' };
    return { label: 'Strong', color: 'text-green-600' };
  };

  const passwordStrength = getPasswordStrength(password);
  const isFormValid = fullName.trim() && email.trim() && password.length >= 8;

  return (
    <div className="min-h-screen bg-[#efefef] p-3 md:p-6">
      <div className="mx-auto w-full max-w-345 rounded-[30px] bg-[#efefef] p-3 md:p-4">
        <div className="grid min-h-[calc(100vh-3rem)] grid-cols-1 gap-4 rounded-3xl md:min-h-205 md:grid-cols-2 md:gap-5">
          {/* ── Left Visual Panel ── */}
          <img src="/images/SignUp.png" alt="Auth Visual" />

          {/* ── Right Form Panel ── */}
          <div className="order-1 flex items-center justify-center rounded-[18px] bg-[#efefef] px-5 py-8 md:order-2 md:px-10 md:py-10">
            <div className="w-full max-w-107.5">
              {/* Back link + heading */}
              <div className="mb-8 text-center">
                <Link
                  to="/"
                  className="mb-9 inline-flex items-center gap-1.5 text-xs text-gray-400 no-underline hover:text-gray-500"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to Home
                </Link>

                <h2 className="font-['Inter'] text-[32px] leading-tight font-semibold text-[#1f1f1f]">
                  Get started with <span className="text-[#6b39f4]">Elyxa.</span>
                </h2>
                <p className="mt-2 font-['Inter'] text-sm text-[#4b4b4b]">
                  You&rsquo;re signing up for Starter plan
                </p>
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
                  {/* Google "G" icon */}
                  <FcGoogle className="h-4.25 w-4.25" />
                  Continue with Google
                </button>

                <button
                  type="button"
                  className="flex h-11 w-full items-center justify-center gap-2.5 rounded-lg border border-[#e8e8e8] bg-[#f4f4f4] font-['Inter'] text-sm text-[#4d4d4d] transition hover:bg-[#ececec]"
                >
                  <Apple className="h-4.25 w-4.25" />
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
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-1.5 block font-['Inter'] text-xs font-medium text-[#2b2b2b]"
                  >
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Oliver Thompson"
                    className={`h-11 w-full rounded-lg bg-[#f6f6f6] px-3 text-sm text-[#202020] transition outline-none placeholder:text-[#a8a8a8] ${
                      hasNameError
                        ? 'border border-red-400 focus:border-red-400'
                        : 'border border-[#e5e5e5] focus:border-[#cacaca]'
                    }`}
                  />
                  {hasNameError && (
                    <p className="mt-1 text-xs text-red-500">This field is required</p>
                  )}
                </div>

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
                    className={`h-11 w-full rounded-lg bg-[#f6f6f6] px-3 text-sm text-[#202020] transition outline-none placeholder:text-[#a8a8a8] ${
                      hasEmailError
                        ? 'border border-red-400 focus:border-red-400'
                        : 'border border-[#e5e5e5] focus:border-[#cacaca]'
                    }`}
                  />
                  {hasEmailError && (
                    <p className="mt-1 text-xs text-red-500">This field is required</p>
                  )}
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
                      placeholder="••••••"
                      className={`h-11 w-full rounded-lg bg-[#f6f6f6] px-3 pr-11 text-sm text-[#202020] transition outline-none ${
                        hasPasswordError
                          ? 'border border-red-400 focus:border-red-400'
                          : 'border border-[#6d46f8] focus:border-[#6d46f8]'
                      }`}
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

                  <div className="mt-1 flex items-center justify-between">
                    <p className="text-xs text-[#b2b2b2]">At least 8 characters</p>
                    {passwordStrength && (
                      <p className={`text-xs font-medium ${passwordStrength.color}`}>
                        {passwordStrength.label}
                      </p>
                    )}
                  </div>
                  {hasPasswordError && (
                    <p className="mt-1 text-xs text-red-500">
                      Password must be at least 8 characters
                    </p>
                  )}
                </div>

                {/* Hidden referral */}
                <input type="hidden" value={referralCode} readOnly />

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || !isFormValid}
                  className={`mt-2 flex h-11 w-full items-center justify-center rounded-lg font-['Inter'] text-sm font-semibold transition ${
                    isFormValid && !loading
                      ? 'cursor-pointer bg-[#6b39f4] text-white hover:bg-[#5d2fea]'
                      : 'cursor-not-allowed bg-[#e7e7e7] text-[#bdbdbd]'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating account...
                    </span>
                  ) : (
                    'Get Started'
                  )}
                </button>
              </form>

              {/* Log in link */}
              <p className="mt-6 text-center text-sm text-[#3d3d3d]">
                Already have an account?{' '}
                <Link
                  to="/login"
                  onClick={() => dispatch(clearError())}
                  className="font-medium text-[#6b39f4] hover:no-underline"
                >
                  Log In
                </Link>
              </p>

              {/* Legal */}
              <p className="mt-4 text-center text-[11px] text-[#b6b6b6]">
                By signing up, you agree to our{' '}
                <span className="cursor-pointer underline hover:text-[#888]">Terms</span> and{' '}
                <span className="cursor-pointer underline hover:text-[#888]">Privacy Policy</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterView;
