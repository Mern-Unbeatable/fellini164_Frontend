// A paid plan picked on the public pricing section while logged out. It survives the login / sign-up /
// onboarding steps in this tab so the user lands on checkout afterwards instead of the dashboard.
const STORAGE_KEY = 'elyxa.pendingCheckout';
const MAX_AGE_MS = 60 * 60 * 1000;

export const CHECKOUT_RESUME_PATH = '/checkout/resume';

export function savePendingCheckout({ plan, billingPeriod }) {
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ plan, billingPeriod, savedAt: Date.now() })
    );
  } catch {
    /* Storage unavailable (private mode / quota) — user just lands on the dashboard as before. */
  }
}

export function readPendingCheckout() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    const fresh = Date.now() - Number(data?.savedAt || 0) < MAX_AGE_MS;
    if (!fresh || !data?.plan || !data?.billingPeriod) {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return { plan: data.plan, billingPeriod: data.billingPeriod };
  } catch {
    return null;
  }
}

export function hasPendingCheckout() {
  return readPendingCheckout() !== null;
}

export function clearPendingCheckout() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
