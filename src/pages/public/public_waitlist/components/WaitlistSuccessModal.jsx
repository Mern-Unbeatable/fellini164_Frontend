// import { CheckCircle2, Link2, Copy } from 'lucide-react';
// import { toast } from 'react-toastify';

// const WaitlistSuccessModal = ({ referralLink, referralCode, email, copyReferralLink }) => {
//   const handleCopyLink = () => {
//     copyReferralLink();
//     toast.success('Referral link copied to clipboard!', {
//       position: 'top-center',
//       autoClose: 2000,
//     });
//   };

//   return (
//     <div className="flex items-center justify-center p-2 min-h-screen md:p-6">
//       <div className="w-full max-w-2xl rounded-2xl bg-white p-4 text-center shadow-xl md:p-12 dark:bg-zinc-700">
//         <div className="mb-6">
//           <h2 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
//             You're on the Waitlist!
//           </h2>
//           <p className="text-lg text-gray-600 dark:text-white/90">
//             Check your email at <span className="font-semibold">{email}</span> for login
//             credentials.
//           </p>
//         </div>

//         <div className="mb-8 rounded-xl bg-purple-50 p-6 dark:bg-black">
//           <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
//              Get Early Access Faster!
//           </h3>
//           <p className="mb-4 text-gray-600 dark:text-white">
//             Share your referral link. For every friend who joins, you both get closer to early
//             access!
//           </p>

//           {/* Referral Link Display */}
//           <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3 dark:bg-zinc-900">
//             <div className="flex min-w-0 flex-1 items-center gap-3">
//               <Link2 className="h-5 w-5 shrink-0 text-gray-400 dark:text-white" />
//               <input
//                 type="text"
//                 value={referralLink}
//                 readOnly
//                 className="flex-1 truncate bg-transparent text-sm text-gray-600 outline-none dark:text-white"
//               />
//             </div>
//             <button
//               onClick={handleCopyLink}
//               className="flex shrink-0 items-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 font-semibold text-white transition-all hover:scale-105 hover:bg-violet-700"
//             >
//               <Copy className="h-4 w-4" />
//               <span className="hidden sm:inline">Copy Link</span>
//               <span className="sm:hidden">Copy</span>
//             </button>
//           </div>

//           <div className="mt-4 space-y-1.5 text-left text-sm">
//             <div className="flex items-center gap-3">
//               <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 font-semibold text-violet-600">
//                 1
//               </div>
//               <span className="text-gray-700 dark:text-white">
//                 Invite 1 friend → Priority access
//               </span>
//             </div>
//             <div className="flex items-center gap-3">
//               <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 font-semibold text-violet-600">
//                 3
//               </div>
//               <span className="text-gray-700 dark:text-white">
//                 Invite 3 friends → Early feature unlocks
//               </span>
//             </div>
//             <div className="flex items-center gap-3">
//               <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 font-semibold text-violet-600">
//                 5
//               </div>
//               <span className="text-gray-700 dark:text-white">
//                 Invite 5 friends → Free premium days
//               </span>
//             </div>
//             <div className="flex items-center gap-3">
//               <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 p-2 font-semibold text-violet-600">
//                 10
//               </div>
//               <span className="text-gray-700 dark:text-white">
//                 Invite 10 friends → Lifetime discount or bonus AI features
//               </span>
//             </div>
//           </div>
//         </div>

//         <p className="text-sm text-gray-500 dark:text-white/80">
//          Check your email for login credentials and next steps.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default WaitlistSuccessModal;






import { Copy, Check, Users, Zap, Gift, Crown, Link2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useState } from 'react';

const WaitlistSuccessModal = ({
  referralLink,
  referralCode,
  email,
  copyReferralLink,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    copyReferralLink();
    setCopied(true);
    toast.success('Referral link copied!', {
      position: 'top-center',
      autoClose: 2000,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const referralTiers = [
    { count: 1, reward: 'Priority access', icon: Zap },
    { count: 3, reward: 'Early feature unlocks', icon: Gift },
    { count: 5, reward: 'Free premium days', icon: Users },
    { count: 10, reward: 'Lifetime discount or bonus AI features', icon: Crown },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="w-full max-w-4xl text-center">
        {/* Card */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-6 md:p-10 border border-gray-100 dark:border-gray-700">
          {/* Heading */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-3">
            You're on the Waitlist!
          </h1>

          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-8">
            We’ve sent login details to{' '}
            <span className="font-semibold text-gray-800 dark:text-white">
              {email}
            </span>
          </p>

          {/* Referral Box */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-violet-900/30 dark:to-blue-900/30 rounded-xl p-5 md:p-6 mb-8 border border-purple-200 dark:border-violet-700">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Get Early Access Faster
            </h2>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-4">
              Share your referral link. Every successful invite moves you up the
              waitlist.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 items-stretch">
              <div className="flex-1 flex items-center gap-2 bg-white dark:bg-gray-700 rounded-lg px-3 py-3 border border-gray-300 dark:border-gray-600 overflow-hidden min-w-0">
                <span className="text-gray-600 dark:text-gray-200 text-xs sm:text-sm md:text-base truncate w-full text-left">
                  {referralLink}
                </span>
              </div>

              <button
                onClick={handleCopyLink}
                className="inline-flex items-center justify-center gap-2 bg-[#7C3AED] text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    Copy Link
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Rewards */}
          <div className="mb-6">
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-5">
              Referral Rewards
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {referralTiers.map((tier, index) => {
                const Icon = tier.icon;
                return (
                  <div
                    key={index}
                    className="rounded-lg p-4 border border-gray-200 dark:border-gray-600 bg-linear-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-3">
                      {/* <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/40">
                        <Icon className="w-5 h-5 text-violet-600 dark:text-violet-300" />
                      </div> */}
                      <div className="text-left">
                        <p className="font-bold text-gray-800 dark:text-white">
                          Invite {tier.count} friend{tier.count > 1 ? 's' : ''}
                        </p>
                        <p className="text-base text-gray-600 dark:text-gray-300">
                          {tier.reward}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <p className="text-sm text-gray-500 dark:text-gray-200 mt-6">
            Check your email for login credentials and next steps.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WaitlistSuccessModal;
