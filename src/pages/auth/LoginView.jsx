import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, TriangleAlert } from 'lucide-react';
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

  // Redirect after successful login
  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on role
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

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

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#EEEEEE] dark:bg-black p-4 md:p-8">
      <div className="flex w-full max-w-7xl overflow-hidden rounded-2xl shadow-2xl dark:shadow-violet-900/20">
        {/* Left Side - Image/Content */}
        <div className="relative hidden items-center justify-start bg-[#462A94] dark:bg-violet-900 p-12 pl-16 lg:flex lg:w-1/2">
          <div className="relative z-10 max-w-md text-white">
            <Link to="/">
              <img src="/WhiteLogo.png" alt="Logo" className="h-10" />
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
            <h1 className="mb-6 w-90 text-4xl leading-tight font-bold">
              Design a life you're proud of.
            </h1>
            <p className="text-base text-purple-200">
              Join 50,000+ achievers using AI to master their time and habits.
            </p>
          </div>
        </div>

        {/* Right Side - Login Form */}

        <div className="flex w-full items-center justify-center bg-white dark:bg-zinc-800 p-4 md:p-8 lg:w-1/2">
          <div className="w-full max-w-md">
            {/* Header */}
            {/* Go to Home Button */}
            <div className="mt-4">
              <Link
                to="/"
                className="mb-12 inline-flex items-center  gap-2 text-sm text-gray-600 dark:text-white/90 hover:text-gray-800 dark:hover:text-white  no-underline hover:no-underline"
              >
                <ArrowLeft /> Back to Home
              </Link>
            </div>
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Welcome back</h2>
              <p className="mt-2 text-gray-600 dark:text-white/90">Enter your details to access your dashboard</p>
            </div>
            {error && (
              <div className="mb-6 flex items-center rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-800">
                <span className="mr-2 text-red-500"><TriangleAlert className="h-8 w-8" /></span>
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700 dark:text-white/90">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your@example.com"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-700 text-gray-900 dark:text-white px-4 py-3 transition focus:border-transparent focus:ring-2 focus:ring-purple-500 dark:focus:ring-violet-400 focus:outline-none"
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700 dark:text-white/90">
                  Password
                </label>
                <div className="relative pb-2">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="········"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-700 text-gray-900 dark:text-white px-4 py-3 pr-11 transition focus:border-transparent focus:ring-2 focus:ring-purple-500 dark:focus:ring-violet-400 focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400  dark:text-gray-300 hover:text-gray-300 dark:hover:text-gray-300"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <a href="/forgot-Password" className="text-sm text-purple-600  dark:text-violet-400">
                  Forgot Password
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#7C3AED] py-3 font-semibold text-white shadow-md transition duration-200 hover:shadow-lg disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="mr-2 h-5 w-5 animate-spin" viewBox="0 0 24 24">
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
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <p className="mt-6 text-center text-sm text-gray-600 dark:text-white/90">
              Don't have an account?{' '}
              <a
                href="/signup"
                className="font-semibold text-purple-600 dark:text-violet-400 hover:text-purple-700 dark:hover:text-violet-300 hover:no-underline"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
