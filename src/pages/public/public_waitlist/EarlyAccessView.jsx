// /import { useState } from 'react';
// import WaitlistSuccessModal from './components/WaitlistSuccessModal';
// import WaitlistModal from './components/WaitlistModal';
// import EarlyAccessHero from './components/EarlyAccessHero';
// import WhatElyxaDoes from './components/WhatElyxaDoes';
// import EarlyAccessBenefits from './components/EarlyAccessBenefits';
// import TrustSection from './components/TrustSection';

// const EarlyAccessView = () => {

//     const [firstName, setFirstName] = useState('');
//     const [submitted, setSubmitted] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [referralLink, setReferralLink] = useState('');
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);

//         try {
//             // TODO: Replace with actual API call
//             // const response = await POST('/api/v1/waitlist/join', { email, firstName });

//             // Simulate API call
//             await new Promise(resolve => setTimeout(resolve, 1000));

//             // Generate referral link (this will come from backend)
//             const mockReferralCode = Math.random().toString(36).substring(7);
//             setReferralLink(`${window.location.origin}/early-access?ref=${mockReferralCode}`);

//             setSubmitted(true);
//         } catch (error) {
//             console.error('Waitlist signup error:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const copyReferralLink = () => {
//         navigator.clipboard.writeText(referralLink);
//         // Could add toast notification here
//     };

//     if (submitted) {
//         return (
//             <WaitlistSuccessModal
//                 referralLink={referralLink}
//                 copyReferralLink={copyReferralLink}
//             />
//         );
//     }

//     return (
//         <div className="min-h-screen relative overflow-hidden">
//             <EarlyAccessHero onJoinClick={() => setIsModalOpen(true)} />

//             <WaitlistModal
//                 isOpen={isModalOpen}
//                 onClose={() => setIsModalOpen(false)}
//                 firstName={firstName}
//                 setFirstName={setFirstName}
//                 loading={loading}
//                 handleSubmit={handleSubmit}
//             />
//             <WhatElyxaDoes />

//             <EarlyAccessBenefits />

//             <TrustSection />
//         </div>
//     );
// };

// export default EarlyAccessView;

// import { useState } from 'react';
// import {
//   Calendar,
//   Target,
//   Zap,
//   Lightbulb,
//   CheckCircle,
//   Shield,
//   Loader2,
// } from 'lucide-react';
// import WaitlistSuccessModal from './components/WaitlistSuccessModal';

// const EarlyAccessView = () => {
//   const [firstName, setFirstName] = useState('');
//   const [email, setEmail] = useState('');
//   const [submitted, setSubmitted] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [referralLink, setReferralLink] = useState('');

//   const features = [
//     { icon: Calendar, text: 'Adaptive daily planning' },
//     { icon: Target, text: 'Weekly & monthly goal structure' },
//     { icon: Zap, text: 'AI habit tracking' },
//     { icon: Lightbulb, text: 'Personalized recommendations' },
//     { icon: CheckCircle, text: 'Early feature access' },
//   ];

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);

//         try {
//             // TODO: Replace with actual API call
//             // const response = await POST('/api/v1/waitlist/join', { email, firstName });

//             // Simulate API call
//             await new Promise(resolve => setTimeout(resolve, 1000));

//             // Generate referral link (this will come from backend)
//             const mockReferralCode = Math.random().toString(36).substring(7);
//             setReferralLink(`${window.location.origin}/early-access?ref=${mockReferralCode}`);

//             setSubmitted(true);
//         } catch (error) {
//             console.error('Waitlist signup error:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const copyReferralLink = () => {
//         navigator.clipboard.writeText(referralLink);
//         // Could add toast notification here
//     };

//     if (submitted) {
//         return (
//             <WaitlistSuccessModal
//                 referralLink={referralLink}
//                 copyReferralLink={copyReferralLink}
//             />
//         );
//     }

//   return (
//     <div className=" flex items-center justify-center px-4 sm:px-6 lg:px-8">
//       <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg p-6 sm:p-10 lg:p-16">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

//           {/* LEFT */}
//           <div>
//             <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 leading-tight">
//               Get Early Access <br />
//               to <span className="text-blue-600">Elyxa</span>
//             </h1>

//             <p className="text-gray-600 text-base sm:text-lg mt-4 mb-8 max-w-xl">
//               An adaptive AI that builds daily, weekly, and monthly plans around how you actually live.
//             </p>

//             <div className="mb-10">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                 What You'll Get:
//               </h3>

//               <div className="space-y-4">
//                 {features.map((f, i) => {
//                   const Icon = f.icon;
//                   return (
//                     <div key={i} className="flex items-center gap-3">
//                       <Icon className="w-5 h-5 text-blue-600" />
//                       <span className="text-gray-700">{f.text}</span>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             <div className="max-w-md bg-gray-50 border border-gray-200 rounded-xl p-4 shadow">
//               <div className="flex gap-3">
//                 <Shield className="w-5 h-5 text-green-600 mt-0.5" />
//                 <div>
//                   <h4 className="font-semibold text-gray-900">Privacy First</h4>
//                   <p className="text-sm text-gray-600 mt-1">
//                     Built with privacy, security, and long-term consistency in mind.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* RIGHT */}
//           <div className="bg-[#F6F5FF] rounded-2xl p-6 sm:p-8 max-w-md w-full mx-auto">
//             <h2 className="text-2xl font-bold text-gray-900 mb-1">
//               Join the Waitlist
//             </h2>
//             <p className="text-sm text-gray-600 mb-6">
//               Limited spots. Invitations are sent gradually.
//             </p>

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
//                   First Name (Optional)
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Jane"
//                   value={firstName}
//                   onChange={(e) => setFirstName(e.target.value)}
//                   className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
//                 />
//               </div>

//               <div>
//                 <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
//                   Email Address
//                 </label>
//                 <input
//                   type="email"
//                   required
//                   placeholder="jane@gmail.com"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
//                 />
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
//               >
//                 {loading ? (
//                   <>
//                     <Loader2 className="w-5 h-5 animate-spin" />
//                     Joining...
//                   </>
//                 ) : (
//                   'Join Waitlist'
//                 )}
//               </button>

//               <p className="text-xs text-gray-500 text-center">
//                 By joining, you agree to receive waitlist updates.
//               </p>
//             </form>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default EarlyAccessView;

// import { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux'; // Added Redux hooks
// import { inviteToWaitlist } from '../../../features/users/referralSlice'; // Import the thunk
// import {
//   Calendar, Target, Zap, Lightbulb,
//   CheckCircle, Shield, Loader2
// } from 'lucide-react';
// import WaitlistSuccessModal from './components/WaitlistSuccessModal';

// const EarlyAccessView = () => {
//   const [firstName, setFirstName] = useState('');
//   const [email, setEmail] = useState('');

//   const dispatch = useDispatch();
//   // Get state from Redux
//   const { loading, success, referralLink, error } = useSelector((state) => state.referral);

//   const features = [
//     { icon: Calendar, text: 'Adaptive daily planning' },
//     { icon: Target, text: 'Weekly & monthly goal structure' },
//     { icon: Zap, text: 'AI habit tracking' },
//     { icon: Lightbulb, text: 'Personalized recommendations' },
//     { icon: CheckCircle, text: 'Early feature access' },
//   ];

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     // Dispatch the Redux action with only email as requested
//     dispatch(inviteToWaitlist(email));
//   };

//   const copyReferralLink = () => {
//     navigator.clipboard.writeText(referralLink);
//   };

//   // If Redux state shows success, show the Success Modal
//   if (success) {
//     return (
//       <WaitlistSuccessModal
//         referralLink={referralLink}
//         copyReferralLink={copyReferralLink}
//       />
//     );
//   }

//   return (
//     <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8">
//       <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg p-6 sm:p-10 lg:p-16">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

//           {/* LEFT SECTION */}
//           <div>
//             <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 leading-tight">
//               Get Early Access <br />
//               to <span className="text-blue-600">Elyxa</span>
//             </h1>
//             <p className="text-gray-600 text-base sm:text-lg mt-4 mb-8 max-w-xl">
//               An adaptive AI that builds daily, weekly, and monthly plans around how you actually live.
//             </p>

//             <div className="mb-10">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">What You'll Get:</h3>
//               <div className="space-y-4">
//                 {features.map((f, i) => {
//                   const Icon = f.icon;
//                   return (
//                     <div key={i} className="flex items-center gap-3">
//                       <Icon className="w-5 h-5 text-blue-600" />
//                       <span className="text-gray-700">{f.text}</span>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>

//           {/* RIGHT SECTION (FORM) */}
//           <div className="bg-[#F6F5FF] rounded-2xl p-6 sm:p-8 max-w-md w-full mx-auto">
//             <h2 className="text-2xl font-bold text-gray-900 mb-1">Join the Waitlist</h2>
//             <p className="text-sm text-gray-600 mb-6">Limited spots. Invitations are sent gradually.</p>

//             <form onSubmit={handleSubmit} className="space-y-4">
//               {/* Error Message Display */}
//               {error && <p className="text-red-500 text-xs">{error.message || "Email registration failed"}</p>}

//               <div>
//                 <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">First Name (Optional)</label>
//                 <input
//                   type="text"
//                   placeholder="Jane"
//                   value={firstName}
//                   onChange={(e) => setFirstName(e.target.value)}
//                   className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
//                 />
//               </div>

//               <div>
//                 <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Email Address</label>
//                 <input
//                   type="email"
//                   required
//                   placeholder="jane@gmail.com"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
//                 />
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
//               >
//                 {loading ? (
//                   <>
//                     <Loader2 className="w-5 h-5 animate-spin" />
//                     Joining...
//                   </>
//                 ) : (
//                   'Join Waitlist'
//                 )}
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EarlyAccessView;

import { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { joinWaitlist, resetState } from '../../../features/users/referralSlice';
import { useLocation } from 'react-router-dom';
import { POST } from '../../../services/httpMethods';
import WaitlistSuccessModal from './components/WaitlistSuccessModal';
import {
  Calendar,
  Target,
  Zap,
  Lightbulb,
  CheckCircle,
  Shield,
  Loader2,
  ShieldCheck,
  Sparkles,
  Tag,
} from 'lucide-react';

const EarlyAccessView = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [referralData, setReferralData] = useState(null);

  const location = useLocation();

  // Extract referral code from URL query parameter
  const getReferralCode = () => {
    const params = new URLSearchParams(location.search);
    const refCode = params.get('ref');
    console.log('🔍 URL Search:', location.search);
    console.log('🔍 Referral Code:', refCode);
    return refCode;
  };

  const referralCode = getReferralCode();
  console.log('✅ Final Referral Code:', referralCode);

  // const dispatch = useDispatch();
  // const { loading, success, error } = useSelector((state) => state.referral);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError(null);

    try {
      // Prepare payload - include referralCode if it exists
      const payload = { email };
      if (referralCode) {
        payload.referralCode = referralCode; // Changed from referredBy to referralCode
      }

      console.log('📤 Sending payload:', payload);
      const response = await POST('/api/v1/auth/join-waitlist', payload);
      console.log('📥 Response:', response);

      if (response.success) {
        setSuccess(true);
        setReferralData(response.data);
      } else {
        setError(response.message || 'Failed to join waitlist');
      }
    } catch (err) {
      console.error('❌ Error:', err);
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    if (referralData?.referralLink) {
      navigator.clipboard.writeText(referralData.referralLink);
      // TODO: Add toast notification
    }
  };


  // Show success modal with referral link
  if (success && referralData) {
    return (
      <WaitlistSuccessModal
        referralLink={referralData.referralLink}
        referralCode={referralData.referralCode}
        email={referralData.email}
        copyReferralLink={copyReferralLink}
      />
    );
  }

  return (
    <div className="w-full py-12 md:py-20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-20">
        {/* HERO SECTION */}
        <div className="mb-16 text-center">
          {/* Badge - Show referral badge if coming from referral link */}
          {referralCode ? (
            <div className="mb-6 inline-flex items-center justify-center gap-3.5 rounded-[53.07px] bg-violet-100 px-6 py-3">
              <CheckCircle className="h-5 w-5 text-violet-600" />
              <div className="font-['Inter'] text-sm font-medium text-violet-900 uppercase md:text-base">
                Referred by a friend - Join faster!
              </div>
            </div>
          ) : (
            <div className="mb-6 inline-flex items-center justify-center gap-3.5 rounded-[53.07px] bg-violet-100 px-6 py-3">
              <div className="font-['Inter'] text-sm font-medium text-violet-900 uppercase md:text-base">
                LIMITED EARLY ACCESS
              </div>
            </div>
          )}

          <h1 className="mb-6 font-['Inter'] text-4xl leading-tight font-semibold text-zinc-800 sm:text-5xl lg:text-6xl dark:text-white">
            Get notified when the AI that <br className="hidden md:block" />
            <span className="text-indigo-600 italic dark:text-indigo-400">
              plans your life
            </span>{' '}
            launches
          </h1>
          <p className="mx-auto mt-4 mb-10 max-w-2xl font-['Inter'] text-base leading-6 text-zinc-600 md:text-lg dark:text-zinc-200">
            Elyxa adapts your routines, goals, and energy so you finally stay on track — no weekly
            resets.
          </p>

          {/* Email Form - Inline */}
          <div className="mx-auto mb-8 max-w-xl">
            {/* Success Message */}
            {success && (
              <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-4">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <p className="text-center font-['Inter'] text-base font-medium text-green-800">
                     You're on the waitlist! Check your email for confirmation.
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-center font-['Inter'] text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                placeholder="Your email for early access"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 font-['Inter'] text-base text-zinc-800 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500 dark:border-white dark:bg-black dark:text-white dark:focus:ring-violet-400"
              />
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-8 py-3 font-['Inter'] font-medium whitespace-nowrap text-white shadow-[0px_10px_20px_0px_rgba(188,150,255,0.3)] transition-all hover:bg-violet-700 disabled:bg-violet-400 md:shadow-[0px_20px_37px_0px_rgba(188,150,255,0.5)] dark:shadow-[0px_6px_12px_0px_rgba(139,92,246,0.25)] dark:md:shadow-[0px_18px_33px_0px_rgba(139,92,246,0.4)]"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Joining...
                  </>
                ) : (
                  'Join Early Access'
                )}
              </button>
            </form>
            <p className="mt-3 font-['Inter'] text-sm text-zinc-500 dark:text-white">
              No spam — early invites & updates only.
            </p>
          </div>

          {/* Live Counter */}
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-5 py-2.5 text-sm dark:bg-violet-900">
            <CheckCircle className="h-4 w-4 text-violet-500 dark:text-white" />
            <span className="font-['Inter'] font-medium text-violet-700 dark:text-white">
              Join 1,247 people waiting
            </span>
          </div>
        </div>

        {/* WHY IT MATTERS SECTION */}
        <div className="mb-12 text-center">
          <div className="mx-auto max-w-3xl rounded-2xl border border-violet-100 bg-linear-to-br from-indigo-50 via-violet-50 to-purple-50 p-8 md:p-10 dark:from-zinc-800 dark:via-zinc-800 dark:to-zinc-800">
            <div className="mb-4 inline-flex items-center justify-center rounded-full bg-violet-100 p-3">
              <Sparkles className="h-6 w-6 text-violet-600 dark:text-violet-400" />
            </div>
            <h2 className="mb-4 font-['Inter'] text-2xl font-semibold text-zinc-800 md:text-3xl dark:text-white">
              Why it matters
            </h2>
            <p className="font-['Inter'] text-base leading-relaxed text-zinc-700 md:text-lg dark:text-white">
              Sign up to be the first to use the AI that plans your life, adapts to your habits, and
              boosts productivity automatically.
            </p>
          </div>
        </div>

        {/* PRICING HINT + EARLY ACCESS INCENTIVE */}
        <div className="mb-12">
          <div className="mx-auto max-w-4xl rounded-2xl border border-violet-200 bg-white p-8 shadow-sm md:p-10 dark:bg-zinc-900">
            <div className="mb-6 text-center">
              <div className="mb-4 inline-flex items-center justify-center rounded-full bg-violet-100 px-4 py-2">
                <Tag className="mr-2 h-5 w-5 text-violet-600" />
                <span className="font-['Inter'] text-sm font-semibold text-violet-900 uppercase">
                  Early Access Pricing
                </span>
              </div>
              <h2 className="mb-3 font-['Inter'] text-2xl font-semibold text-zinc-800 md:text-3xl dark:text-white">
                Lock in exclusive early-bird pricing
              </h2>
              <p className="font-['Inter'] text-base text-zinc-600 dark:text-white/80">
                Join the waitlist and get special discounted rates when we launch.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center dark:bg-zinc-700">
                <div className="mb-2 font-['Inter'] text-sm font-medium text-zinc-500 uppercase dark:text-white/80">
                  Free
                </div>
                <div className="mb-1 font-['Inter'] text-3xl font-bold text-zinc-800 dark:text-white">
                  $0
                </div>
                <div className="font-['Inter'] text-sm text-zinc-600 dark:text-white/80">
                  Try core features
                </div>
              </div>

              <div className="relative rounded-xl border-2 border-violet-500 bg-violet-50 p-6 text-center dark:bg-zinc-800">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-violet-600 px-3 py-1 text-xs font-semibold text-white">
                  Most Popular
                </div>
                <div className="mb-2 font-['Inter'] text-sm font-medium text-violet-700 uppercase dark:text-white">
                  Pro
                </div>
                <div className="mb-1 font-['Inter'] text-3xl font-bold text-zinc-800 dark:text-white">
                  <span className="text-xl text-zinc-400 line-through dark:text-zinc-400">
                    $17.99
                  </span>
                  <span className="ml-2">$10.99</span>
                </div>
                <div className="font-['Inter'] text-sm font-semibold text-violet-600 dark:text-violet-400">
                  40% Early-bird discount
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center dark:bg-zinc-700">
                <div className="mb-2 font-['Inter'] text-sm font-medium text-zinc-500 uppercase dark:text-white/80">
                  Ultimate
                </div>
                <div className="mb-1 font-['Inter'] text-3xl font-bold text-zinc-800 dark:text-white">
                  <span className="text-xl text-zinc-400 line-through dark:text-zinc-600">
                    $39.99
                  </span>
                  <span className="ml-2">$23.99</span>
                </div>
                <div className="font-['Inter'] text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                  40% Early-bird discount
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="font-['Inter'] text-sm text-zinc-500 dark:text-white/90">
                Pricing shown is monthly. Annual plans save even more!
              </p>
            </div>
          </div>
        </div>

        {/* VALUE BULLETS */}
        <div className="mb-12 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm md:p-12 dark:bg-black">
          <h2 className="mb-8 text-center font-['Inter'] text-2xl font-semibold text-zinc-800 md:text-3xl dark:text-white">
            Why this is worth waiting for
          </h2>
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:gap-8">
            <div className="flex items-start gap-4 rounded-xl p-4 transition-colors hover:bg-violet-50 dark:hover:bg-zinc-600">
              <div className="shrink-0 rounded-lg bg-violet-100 p-2.5 dark:bg-white">
                <CheckCircle className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <h3 className="mb-1 font-['Inter'] font-semibold text-zinc-800 dark:text-white">
                  Adaptive plans that adjust when life changes
                </h3>
                <p className="font-['Inter'] text-sm text-zinc-600 dark:text-white/80">
                  No more rigid schedules that fall apart
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl p-4 transition-colors hover:bg-violet-50 dark:hover:bg-zinc-600">
              <div className="shrink-0 rounded-lg bg-violet-100 p-2.5 dark:bg-white">
                <CheckCircle className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <h3 className="mb-1 font-['Inter'] font-semibold text-zinc-800 dark:text-white">
                  Daily & weekly routines tailored to your schedule
                </h3>
                <p className="font-['Inter'] text-sm text-zinc-600 dark:text-white/80">
                  Plans that work with your actual life
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl p-4 transition-colors hover:bg-violet-50 dark:hover:bg-zinc-600">
              <div className="shrink-0 rounded-lg bg-violet-100 p-2.5 dark:bg-white">
                <CheckCircle className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <h3 className="mb-1 font-['Inter'] font-semibold text-zinc-800 dark:text-white">
                  Habit tracking that learns from your behavior
                </h3>
                <p className="font-['Inter'] text-sm text-zinc-600 dark:text-white/80">
                  AI that adapts to how you actually work
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl p-4 transition-colors hover:bg-violet-50 dark:hover:bg-zinc-600">
              <div className="shrink-0 rounded-lg bg-violet-100 p-2.5 dark:bg-white">
                <CheckCircle className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <h3 className="mb-1 font-['Inter'] font-semibold text-zinc-800 dark:text-white">
                  No rigid throw-away planner
                </h3>
                <p className="font-['Inter'] text-sm text-zinc-600 dark:text-white/80">
                  One system that evolves with you
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* WHY JOIN SECTION */}
        <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
          {/* LEFT SECTION */}
          <div className="rounded-2xl border border-violet-100 bg-linear-to-br from-violet-50 to-indigo-50 p-8 md:p-10 dark:from-zinc-800 dark:via-zinc-800 dark:to-zinc-800">
            <h2 className="mb-6 font-['Inter'] text-2xl font-semibold text-zinc-800 dark:text-white">
              Why join early?
            </h2>

            <div className="space-y-4">
              {[
                { icon: Target, text: 'Join early for exclusive updates' },
                { icon: Zap, text: 'First access to features' },
                { icon: Shield, text: 'Priority onboarding' },
                { icon: Lightbulb, text: 'Bonus insights during development' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="rounded-lg bg-violet-200 p-2.5 dark:bg-white">
                      <Icon className="h-5 w-5 text-violet-700 dark:text-violet-500" />
                    </div>
                    <span className="font-['Inter'] font-medium text-zinc-700 dark:text-white">
                      {item.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT SECTION - TRUST */}
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm md:p-10 dark:bg-zinc-800">
            <div className="mb-6 flex items-start gap-4">
              <div className="rounded-xl bg-green-100 p-3">
                <ShieldCheck className="h-7 w-7 text-green-600" />
              </div>
              <div>
                <h3 className="mb-2 font-['Inter'] text-xl font-semibold text-zinc-800 dark:text-white">
                  Privacy First
                </h3>
                <p className="font-['Inter'] text-zinc-600 dark:text-white/80">
                  Built with privacy, security, and long-term consistency in mind.
                </p>
              </div>
            </div>

            <div className="space-y-3 font-['Inter'] text-sm text-zinc-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 shrink-0 text-violet-500" />
                <span className="dark:text-white">No spam, ever</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 shrink-0 text-violet-500" />
                <span className="dark:text-white">Unsubscribe anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 shrink-0 text-violet-500" />
                <span className="dark:text-white">Your data is encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 shrink-0 text-violet-500" />
                <span className="dark:text-white">GDPR compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarlyAccessView;
