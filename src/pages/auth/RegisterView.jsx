import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Orbit, Loader2, ArrowLeft, TriangleAlert } from 'lucide-react';
import { registerUser } from '../../features/auth/authAPI';
import { clearError, selectAuth } from '../../features/auth/authSlice';

const RegisterView = () => {
  const [searchParams] = useSearchParams();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(selectAuth);

  // Automatically fill referral code from URL query parameter
  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReferralCode(refCode);
    }
  }, [searchParams]);

  // Clear auth error when component unmounts (prevents error persisting across navigation)
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    const userData = {
      fullName,
      email,
      password,
    };

    // Only add referralCode if it's provided
    if (referralCode.trim()) {
      userData.referralCode = referralCode.trim();
    }

    const result = await dispatch(registerUser(userData));

    // If registration successful, navigate to OTP verification
    if (result.type === 'auth/register/fulfilled') {
      navigate('/verify-otp', { state: { email } });
    }
  };

  return (
    <div className="min-h-screen bg-[#EEEEEE] dark:bg-black flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-7xl flex shadow-2xl dark:shadow-violet-900/20 rounded-2xl overflow-hidden">
        {/* Left Side - Image/Content */}
        <div className="hidden lg:flex lg:w-1/2 bg-[#462A94] dark:bg-violet-900 relative items-center justify-start p-12 pl-16">
          <div className="relative z-10 text-white max-w-md">
            <Link to="/">
              <img src="/WhiteLogo.png" alt="Logo" className="h-10 " />
            </Link>
            <div className="flex justify-start">
              <div className="h-72 w-72">
                <svg viewBox="0 0 200 200" className="h-full w-full">
                  <g fill="none" stroke="#BCA4FF" strokeWidth="6">
                    <ellipse cx="100" cy="100" rx="70" ry="25" />
                    <ellipse cx="100" cy="100" rx="70" ry="25" transform="rotate(60 100 100)" />
                    <ellipse cx="100" cy="100" rx="70" ry="25" transform="rotate(120 100 100)" />
                  </g>
                </svg>
              </div>
            </div>
            <h1 className="text-4xl w-90 font-bold mb-6 leading-tight">Design a life you're proud of.</h1>
            <p className="text-purple-200 text-base">Join 50,000+ achievers using AI to master their time and habits.</p>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8 bg-white dark:bg-zinc-800">

          <div className="w-full max-w-md">
            {/* Go Back Home Button */}
            <Link
              to="/"
              className="inline-flex gap-1 items-center text-sm text-gray-600 dark:text-gray-300 no-underline hover:no-underline hover:text-gray-800 dark:hover:text-white mb-6"
            >
              <ArrowLeft />
              Back to Home
            </Link>

            {/* Header */}

            <div className="mb-4  text-left md:text-center">
              <h2 className="text-xl md:text-3xl font-semibold text-gray-800 dark:text-white">Create an account</h2>

            </div>

            {/* Error Alert */}
            {error && (
              <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-lg mb-6 flex items-start">
                <span className="text-red-500 mr-2"><TriangleAlert /></span>
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Register Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name Field */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-violet-400 focus:border-transparent transition"
                  required
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your@example.com"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-violet-400 focus:border-transparent transition"
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="········"
                    className="w-full px-4 py-3 pr-11 border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-violet-400 focus:border-transparent transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-300"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Referral Code Field (Optional) */}
              <div>
                <label htmlFor="referralCode" className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                  Referral Code <span className="text-gray-400 dark:text-gray-200 text-xs">(Optional)</span>
                </label>
                <input
                  id="referralCode"
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  placeholder="Enter referral code"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-violet-400 focus:border-transparent transition"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#7C3AED] text-white py-3 rounded-lg font-semibold  disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200 shadow-md hover:shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Creating account...
                  </span>
                ) : (
                  'Sign Up'
                )}
              </button>
            </form>

            {/* Login Link */}
            <p className="text-center text-gray-600 dark:text-white text-sm mt-6">
              Already have an account?{' '}
              <Link to="/login" onClick={() => dispatch(clearError())} className="text-purple-600 dark:text-violet-400 hover:text-purple-700 dark:hover:text-violet-300 font-semibold hover:no-underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterView;
