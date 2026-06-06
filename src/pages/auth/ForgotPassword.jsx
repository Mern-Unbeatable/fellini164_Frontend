import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import { sendForgotOTP } from '../../features/auth/authAPI';
import { selectAuth } from '../../features/auth/authSlice';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(selectAuth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(sendForgotOTP({ email }));

    if (result.type === 'auth/sendForgotOTP/fulfilled') {
      toast.success('OTP sent to your email');
      navigate('/forgot-Password-verifyotp', { state: { email } });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#D9D9D9] px-4 dark:bg-zinc-800">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-4xl dark:bg-zinc-700">
        {/* Back */}
        <Link to="/login" className="absolute top-5 left-5 text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100">
          <ArrowLeft />
        </Link>

        {/* Header */}
        <h2 className="text-center text-3xl font-bold text-gray-800 dark:text-gray-100">
          Forgot Password?
        </h2>
        <p className="mt-2 mb-6 text-center text-gray-500 dark:text-gray-200">
          Enter your email to receive a verification code
        </p>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-transparent focus:ring-2 focus:ring-violet-500 dark:text-gray-200 dark:placeholder:text-gray-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-purple-600 py-3 font-semibold text-white transition disabled:bg-gray-400"
          >
            {loading ? 'Sending OTP...' : 'Send  Email'}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-300">
          Remember your password?{' '}
          <Link to="/login" className="font-semibold text-purple-600 dark:text-purple-400 hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
