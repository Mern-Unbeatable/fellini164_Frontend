import { CHECKOUT_RESUME_PATH, hasPendingCheckout } from '../users/pendingCheckout';

export function getPostLoginPath(user) {
  if (user?.role === 'ADMIN') return '/admin/dashboard';
  if (user?.onboardingCompleted === false) return '/onboarding-setup';
  if (hasPendingCheckout()) return CHECKOUT_RESUME_PATH;
  return '/dashboard';
}
