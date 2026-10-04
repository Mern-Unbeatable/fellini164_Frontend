export function getPostLoginPath(user) {
  if (user?.role === 'ADMIN') return '/admin/dashboard';
  if (user?.onboardingCompleted === false) return '/onboarding-setup';
  return '/dashboard';
}
