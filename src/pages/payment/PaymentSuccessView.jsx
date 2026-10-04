import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Check, Loader2 } from 'lucide-react';
import { selectAuth, updateAuthUser } from '../../features/auth/authSlice';
import { getSubscriptionStatus } from '../../features/auth/profileApi';

function formatDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function titleCase(value) {
  if (!value) return null;
  const s = String(value).toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const DetailRow = ({ label, value }) => (
  <div className="flex items-center justify-between gap-4 py-3">
    <span className="font-['Inter',sans-serif] text-[14px] font-medium text-[#A7A7A7]">{label}</span>
    <span className="truncate font-['Inter',sans-serif] text-[14px] font-semibold text-[#181818]">
      {value}
    </span>
  </div>
);

const PaymentSuccessView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, user } = useSelector(selectAuth);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(isAuthenticated);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!isAuthenticated) return;
    let mounted = true;

    dispatch(getSubscriptionStatus())
      .unwrap()
      .then((data) => {
        if (!mounted) return;
        setSubscription(data || null);
        if (data?.plan) {
          dispatch(updateAuthUser({ subscriptionPlan: String(data.plan).toUpperCase() }));
        }
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [dispatch, isAuthenticated]);

  const plan = titleCase(subscription?.plan || user?.subscriptionPlan);
  const status = titleCase(subscription?.status);
  const billing = titleCase(subscription?.billingPeriod || subscription?.interval);
  const renews = formatDate(subscription?.endDate || subscription?.currentPeriodEnd);

  const primaryPath = isAuthenticated ? '/dashboard' : '/login';

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      <div className="mx-auto flex max-w-480 justify-center px-4 pt-6 sm:justify-end sm:px-7 sm:pt-7">
        <Link to="/">
          <img src="/logo.png" alt="Elyxa.Ai" className="h-9 w-auto sm:h-12" />
        </Link>
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-120px)] w-full max-w-130 flex-col items-center justify-center gap-7.5 px-5 py-10 text-center">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <span
            aria-hidden="true"
            className="absolute h-32 w-32 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(173,118,255,0.55)_0%,rgba(173,118,255,0.18)_50%,transparent_75%)] blur-md"
          />
          <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[#8022FE] shadow-[0_0_24px_rgba(128,34,254,0.35)]">
            <Check className="h-10 w-10 text-white" strokeWidth={3} />
          </span>
        </div>

        <div className="flex flex-col items-center gap-2.5">
          <h1 className="font-['Inter',sans-serif] text-[26px] leading-[1.3] font-bold text-[#181818] md:text-[44px]">
            Payment <span className="text-[#8022FE]">Successful</span>
            <span className="text-[#14F1D9]">.</span>
          </h1>
          <p className="font-['Inter',sans-serif] text-[14px] leading-normal font-medium text-[#272727] md:text-[16px]">
            {plan
              ? `Welcome to ${plan}! Your subscription is active and your new features are ready.`
              : 'Thanks for upgrading! Your subscription is being activated.'}
          </p>
        </div>

        {isAuthenticated && (
          <div className="w-full rounded-xl border border-[#F2F2F2] bg-[#FCFCFC] px-5 py-2 text-left">
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-6 font-['Inter',sans-serif] text-[14px] font-medium text-[#A7A7A7]">
                <Loader2 className="h-4 w-4 animate-spin" />
                Confirming your subscription…
              </div>
            ) : (
              <div className="divide-y divide-[#F2F2F2]">
                <DetailRow label="Plan" value={plan || 'Processing'} />
                {billing && <DetailRow label="Billing" value={billing} />}
                {status && <DetailRow label="Status" value={status} />}
                {renews && <DetailRow label="Renews on" value={renews} />}
                {sessionId && <DetailRow label="Reference" value={`…${sessionId.slice(-10)}`} />}
              </div>
            )}
          </div>
        )}

        <div className="flex w-full flex-col items-center gap-4 md:w-auto md:flex-row-reverse md:gap-5">
          <button
            type="button"
            onClick={() => navigate(primaryPath, { replace: true })}
            className="h-11 w-full rounded-[10px] bg-[#8022FE] px-10 font-['Inter',sans-serif] text-[16px] leading-none font-semibold text-white transition-colors hover:bg-[#6B1BDB] md:w-auto"
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Log In'}
          </button>
          {isAuthenticated && (
            <Link
              to="/user/subscription"
              className="font-['Inter',sans-serif] text-[14px] font-semibold text-[#A7A7A7] no-underline transition-colors hover:text-[#7A7A7A] md:text-[16px]"
            >
              View subscription
            </Link>
          )}
        </div>

        <p className="font-['Inter',sans-serif] text-[12px] font-medium text-[#C2C2C2] md:text-[14px]">
          A receipt has been sent to your email.
        </p>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[140vw] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(128,34,254,0.28)_0%,rgba(128,34,254,0)_70%)]"
      />
    </div>
  );
};

export default PaymentSuccessView;
