import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { createCheckout } from '../../features/users/paymentSlice';
import { clearPendingCheckout, readPendingCheckout } from '../../features/users/pendingCheckout';

const CheckoutResumeView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [pending] = useState(readPendingCheckout);
  const startedRef = useRef(false);

  useEffect(() => {
    // Guards StrictMode's double effect run so checkout is only requested once.
    if (startedRef.current) return;
    startedRef.current = true;
    clearPendingCheckout();

    if (!pending) {
      navigate('/dashboard', { replace: true });
      return;
    }

    dispatch(createCheckout(pending))
      .unwrap()
      .then((data) => {
        if (!data?.url) throw new Error('Checkout URL missing');
        // replace() keeps this interstitial out of history, so Back from Stripe doesn't land on a spinner.
        window.location.replace(data.url);
      })
      .catch((error) => {
        toast.error(typeof error === 'string' ? error : error?.message || 'Failed to start checkout');
        navigate('/dashboard', { replace: true });
      });
  }, [dispatch, navigate, pending]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-5 text-center">
      <img src="/logo.png" alt="Elyxa.Ai" className="h-9 w-auto sm:h-12" />
      <Loader2 className="h-8 w-8 animate-spin text-[#8022FE]" />
      <p className="font-['Inter',sans-serif] text-[14px] font-medium text-[#5d5d5d] md:text-[16px]">
        Redirecting to checkout…
      </p>
    </div>
  );
};

export default CheckoutResumeView;
