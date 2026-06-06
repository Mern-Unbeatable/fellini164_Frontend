import { useState, useEffect } from 'react';
import { Clipboard, Check, Rocket, Award } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getReferralStats } from '../../../../features/user/userAPI';

export default function ReferFriend() {
  const [copied, setCopied] = useState(false);
  const dispatch = useDispatch();
  const referral = useSelector((state) => state.user.referral);

  useEffect(() => {
    dispatch(getReferralStats());
  }, [dispatch]);

  const inviteLink = referral?.referralLink;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy!', e);
    }
  };

  return (
    <div className="flex flex-col justify-center p-4 py-6 text-black sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex items-center justify-center">
          <div className="flex w-full max-w-2xl flex-col gap-5 rounded-3xl bg-white p-6 shadow-xl md:mt-12 md:gap-8 dark:bg-zinc-800">
            {/* Hero Image */}
            <div className="overflow-hidden rounded-2xl bg-white">
              <img
                src="/images/Rectangle.png"
                alt="referral"
                className="h-75 w-full object-cover"
              />
            </div>

            <div className="px-2">
              <h3 className="text-3xl font-bold text-gray-800 dark:text-white">
                Turn Referrals into Rewards
              </h3>
              <p className="mt-2 text-base text-gray-600 dark:text-gray-300">
                Share your personal AI referral code and unlock premium benefits together.
              </p>

              {/* Benefits List */}
              <ul className="mt-6 space-y-3">
                <li className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-500 text-xs">
                     <Rocket />
                  </span>
                  Easy one-click sharing
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-500 text-xs">
                 <Award />
                  </span>
                  Rewards for both you and your friend
                </li>
              </ul>

              {/* Input Section (Button inside Input) */}
              <div className="mt-8">
                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-white">
                  Your Invite Link
                </label>

                <div className="relative flex items-center">
                  <div className="flex w-full items-center gap-3 rounded-full border-2 border-gray-100 bg-gray-50 py-1.5 pr-1.5 pl-4 transition-all focus-within:border-purple-400 focus-within:bg-white dark:border-gray-400 dark:bg-gray-500 dark:focus-within:bg-gray-600">
                    <Clipboard className="h-4 w-4 text-gray-400 dark:text-white" />
                    <input
                      readOnly
                      value={inviteLink}
                      className="w-full bg-transparent text-sm font-medium text-gray-500 outline-none dark:text-white"
                    />
                    <button
                      onClick={handleCopy}
                      className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold text-white transition-all ${
                        copied ? 'bg-green-500' : 'bg-[#7C3AED] hover:bg-[#6827c6]'
                      }`}
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4" /> Copied
                        </>
                      ) : (
                        'Copy'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
