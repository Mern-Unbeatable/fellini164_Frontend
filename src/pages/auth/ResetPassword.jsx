
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import { selectAuth, resetPassword } from '../../features/auth/authSlice';

const ResetPassword = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const email = location.state?.email || '';
  const otp = location.state?.otp || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { loading, error } = useSelector(selectAuth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    const payload = { email, otp, password, confirmPassword };
    const result = await dispatch(resetPassword(payload));

    if (result.type === 'auth/resetPassword/fulfilled') {
      toast.success('Password successfully updated!');
      navigate('/login');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#D9D9D9] dark:bg-zinc-800 px-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-zinc-700 p-8 shadow-2xl">

        <Link
          to="/forgot-Password-verifyotp"
          className="absolute top-5 left-5 text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
        >
          <ArrowLeft />
        </Link>
      

        <h2 className="text-center text-xl font-semibold text-gray-800 dark:text-gray-100 md:text-3xl">
          Set New Password
        </h2>
        <p className="mb-6 text-center text-gray-500 md:mt-2 dark:text-gray-300">
          Create a strong password for your account
        </p>

        {error && (
          <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* NEW PASSWORD */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none dark:text-gray-200 dark:placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} className='dark:text-gray-100' /> : <Eye size={20} className='dark:text-gray-100' />}
              </button>
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none placeholder:text-white dark:placeholder:text-gray-500 dark:text-gray-200 dark:placeholder:text-gray-400 "
              />
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} className='dark:text-gray-100' />
                ) : (
                  <Eye size={20} className='dark:text-gray-100' />
                )}
              </button>
            </div>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-purple-600 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:bg-gray-400"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
