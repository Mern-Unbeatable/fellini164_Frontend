import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { selectAuth } from '../../features/auth/authSlice';

const PaymentCancelView = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(selectAuth);

  const retryPath = isAuthenticated ? '/user/subscription' : '/pricing';
  const backPath = isAuthenticated ? '/dashboard' : '/';

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      <div className="mx-auto flex max-w-480 justify-start px-4 pt-6 sm:px-7 sm:pt-7">
        <Link to="/">
          <img src="/logo.png" alt="Elyxa.Ai" className="h-9 w-auto sm:h-12" />
        </Link>
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-120px)] w-full max-w-130 flex-col items-center justify-center gap-7.5 px-5 py-10 text-center">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <span
            aria-hidden="true"
            className="absolute h-32 w-32 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,89,2,0.28)_0%,rgba(255,89,2,0.1)_50%,transparent_75%)] blur-md"
          />
          <span className="relative flex h-20 w-20 items-center justify-center rounded-full border-[1.5px] border-[#FFD8C2] bg-[#FFF7ED]">
            <X className="h-10 w-10 text-[#FF5902]" strokeWidth={3} />
          </span>
        </div>

        <div className="flex flex-col items-center gap-2.5">
          <h1 className="font-['Inter',sans-serif] text-[26px] leading-[1.3] font-bold text-[#181818] md:text-[44px]">
            Payment <span className="text-[#8022FE]">Cancelled</span>
            <span className="text-[#14F1D9]">.</span>
          </h1>
          <p className="font-['Inter',sans-serif] text-[14px] leading-normal font-medium text-[#272727] md:text-[16px]">
            Your checkout was cancelled and you have not been charged. You can pick a plan again
            whenever you&rsquo;re ready.
          </p>
        </div>

        <div className="w-full rounded-xl border border-[#F2F2F2] bg-[#FCFCFC] px-5 py-4 text-left">
          <p className="font-['Inter',sans-serif] text-[14px] font-semibold text-[#181818]">
            Having trouble paying?
          </p>
          <p className="mt-1 font-['Inter',sans-serif] text-[13px] leading-normal font-medium text-[#A7A7A7]">
            Check that your card details are correct, or try a different payment method. Your
            current plan stays the same until a payment goes through.
          </p>
        </div>

        <div className="flex w-full flex-col items-center gap-4 md:w-auto md:flex-row-reverse md:gap-5">
          <button
            type="button"
            onClick={() => navigate(retryPath, { replace: true })}
            className="h-11 w-full rounded-[10px] bg-[#8022FE] px-10 font-['Inter',sans-serif] text-[16px] leading-none font-semibold text-white transition-colors hover:bg-[#6B1BDB] md:w-auto"
          >
            Try Again
          </button>
          <button
            type="button"
            onClick={() => navigate(backPath, { replace: true })}
            className="cursor-pointer border-0 bg-transparent p-0 font-['Inter',sans-serif] text-[14px] font-semibold text-[#A7A7A7] transition-colors hover:text-[#7A7A7A] md:text-[16px]"
          >
            {isAuthenticated ? 'Back to Dashboard' : 'Back to Home'}
          </button>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[140vw] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(128,34,254,0.2)_0%,rgba(128,34,254,0)_70%)]"
      />
    </div>
  );
};

export default PaymentCancelView;
