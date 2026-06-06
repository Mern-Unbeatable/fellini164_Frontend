import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Construction, Home, LogOut, Copy, Check, Gift, Users, Zap, Crown } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectUser } from '../../../features/auth/authSlice';
import { getReferralStats } from '../../../features/user/userAPI';
import ReferralsModal from './components/ReferralsModal';
import { toast } from 'react-toastify';

const WorkInProgressView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const referral = useSelector((state) => state.user.referral);
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch referral stats on component mount
  useEffect(() => {
    dispatch(getReferralStats());
  }, [dispatch]);

  // Get referral link from API
  const referralLink = referral?.referralLink || `${window.location.origin}/early-access?ref=${user?.id || user?.email || 'user'}`;
  const totalReferrals = referral?.totalReferrals || 0;
  const referralsList = referral?.referrals || [];

  const handleGoHome = () => {
    navigate('/');
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('Referral link copied!', {
          position: 'top-center',
          autoClose: 2000,
        });
        setTimeout(() => setCopied(false), 2000);
    setTimeout(() => setCopied(false), 2000);
  };

  const referralTiers = [
    { count: 1, reward: 'Priority access', icon: Zap, color: 'from-yellow-400 to-orange-400' },
    { count: 3, reward: 'Early feature unlocks', icon: Gift, color: 'from-blue-400 to-cyan-400' },
    { count: 5, reward: 'Free premium days', icon: Users, color: 'from-purple-400 to-pink-400' },
    { count: 10, reward: 'Lifetime discount or bonus AI features', icon: Crown, color: 'from-amber-400 to-yellow-500' },
  ];

  return (
    <div className=" flex items-center justify-center p-4 mb-4">
      <div className="max-w-4xl w-full text-center">
        {/* Logo */}
        <div className="mb-6">
          <img src="/logo.png" alt="Logo" className="h-16 w-auto mx-auto dark:hidden" />
          <img src="/WhiteLogo.png" alt="Logo" className="h-8 w-auto mx-auto hidden dark:block" />
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-6 md:p-8 lg:p-12 border border-gray-100 dark:border-gray-700">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            You're on the Waitlist!
          </h1>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 px-4">
            Move up the waitlist by inviting friends
          </p>

          {/* Referral Message */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-violet-900/30 dark:to-blue-900/30 rounded-xl p-4 md:p-6 mb-8 border border-purple-200 dark:border-violet-700">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-3">
              Want access sooner?
            </h2>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-4">
              Share your invite link.
              Each friend who joins moves you closer to early access.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 items-stretch">
              <div className="flex-1 flex items-center gap-2 bg-white dark:bg-gray-700 rounded-lg px-3 py-3 border border-gray-300 dark:border-gray-600 overflow-hidden min-w-0">
                <span className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm md:text-base truncate w-full text-left">
                  {referralLink}
                </span>
              </div>
              <button
                onClick={handleCopyLink}
                className="flex-shrink-0 inline-flex items-center justify-center gap-2 bg-[#7C3AED] text-white px-6 py-3 rounded-lg font-semibold  transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Referral Rewards */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">Referral Rewards</h3>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg font-semibold text-sm hover:bg-violet-700 transition-all duration-200 w-full sm:w-auto"
              >
                <Users className="w-4 h-4" />
                View Referrals ({totalReferrals})
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {referralTiers.map((tier, index) => {
                const IconComponent = tier.icon;
                return (
                  <div
                    key={index}
                    className="bg-linear-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-lg p-4 md:p-5 border border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-violet-500 transition-all duration-200 hover:shadow-md"
                  >
                    <div className="flex items-start gap-3 md:gap-4">

                      <div className="flex-1 min-w-0">
                        <div className="text-base md:text-lg font-bold text-gray-800 dark:text-white mb-1">
                          Invite {tier.count} friend{tier.count > 1 ? 's' : ''}
                        </div>
                        <div className="text-xs md:text-sm text-gray-600 dark:text-gray-300">
                          {tier.reward}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleGoHome}
              className="inline-flex items-center justify-center gap-2 bg-linear-to-r from-violet-600 to-blue-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold text-base md:text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Home className="w-5 h-5" />
              Go to Home Page
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-white border-2 border-gray-300 dark:border-gray-600 px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold text-base md:text-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>

        {/* Referrals Modal */}
        <ReferralsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          referralsList={referralsList}
          totalReferrals={totalReferrals}
        />
      </div>
    </div>
  );
};

export default WorkInProgressView;
