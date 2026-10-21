# BUG 15 — Pricing Checkout: Login-এর পরে Dashboard-এ চলে যায়, Checkout-এ নয়

| | |
|---|---|
| **Bug ID** | BUG 15 |
| **Module** | Pricing → Checkout Workflow |
| **Severity** | High |
| **ধরন** | Frontend fix (backend-এ কিছু বদলাতে হয়নি) |
| **সিদ্ধান্ত** | Option (ক) — নতুন user আগে onboarding শেষ করবে, তারপর checkout |

---

## ১. QA কী পেয়েছে

1. Login না করে home page (`/`) বা `/pricing`-এ যাওয়া হলো
2. Paid plan বাছাই করা হলো ("Get Pro" / "Get Ultimate")
3. Login page-এ পাঠানো হলো → login করা হলো
4. **ফল:** user Dashboard-এ চলে যায়। কোন plan কিনতে চেয়েছিল সেটা হারিয়ে যায়।

**প্রত্যাশা:** login-এর পরে সেই plan-এর checkout (Stripe payment page)-এ যাবে।

---

## ২. কারণ

1. Pricing button login-এ পাঠানোর সময় বাছাই করা plan/billing কোথাও মনে রাখত না।
2. Login-এর পরের redirect (`getPostLoginPath`) সবসময় dashboard / onboarding / admin dashboard দিত — checkout-এর কথা জানত না।

### আগের code

`src/pages/public/prublic_home/components/how-it-works/PricingSection.jsx`

```js
if (!isAuthenticated) {
  toast.info('Please log in to continue checkout');
  navigate('/login');
  return;
}
```

`src/features/auth/authRedirect.js`

```js
export function getPostLoginPath(user) {
  if (user?.role === 'ADMIN') return '/admin/dashboard';
  if (user?.onboardingCompleted === false) return '/onboarding-setup';
  return '/dashboard';
}
```

`src/pages/auth/OnboardingFlowView.jsx`

```js
const t = setTimeout(() => navigate('/dashboard', { replace: true }), 650);
```

---

## ৩. সমাধান — কীভাবে কাজ করে

```
Pricing "Get Pro" (logout অবস্থায়)
   └─ plan + billing → sessionStorage  ("pending checkout")
   └─ /login
        ├─ পুরোনো user login / Google login
        │     └─ getPostLoginPath → /checkout/resume → Stripe
        └─ "Sign up" → OTP → /onboarding-setup → শেষে /checkout/resume → Stripe

/checkout/resume
   ├─ pending checkout মুছে দেয় (একবারই কাজ করবে)
   ├─ createCheckout API → Stripe URL → সেখানে চলে যায়
   └─ ব্যর্থ হলে → error toast → /dashboard
```

### ফাইল অনুযায়ী পরিবর্তন

| File | কী বদলেছে |
|---|---|
| `src/features/users/pendingCheckout.js` (নতুন) | Pending checkout save / read / clear। `sessionStorage`-এ থাকে (শুধু ওই tab-এ, tab বন্ধ হলে মুছে যায়)। ১ ঘণ্টা পরে নিজে থেকে বাতিল। |
| `PricingSection.jsx` | Logout অবস্থায় paid plan চাপলে login-এ পাঠানোর আগে `savePendingCheckout({ plan, billingPeriod })` |
| `src/features/auth/authRedirect.js` | Admin বা onboarding বাকি না থাকলে, pending checkout থাকলে → `/checkout/resume` |
| `OnboardingFlowView.jsx` | Onboarding শেষে pending checkout থাকলে `/checkout/resume`, নইলে আগের মতো `/dashboard` |
| `src/pages/payment/CheckoutResumeView.jsx` (নতুন) | "Redirecting to checkout…" page। `createCheckout` call করে Stripe-এ পাঠায়। |
| `src/router/router.jsx` | নতুন route `/checkout/resume` (`ProtectedRoute requiredRole="user"`) |

### নতুন / বদলানো code

`PricingSection.jsx`

```js
if (!isAuthenticated) {
  savePendingCheckout({ plan: plan.name.toUpperCase(), billingPeriod: billing });
  toast.info('Please log in to continue checkout');
  navigate('/login');
  return;
}
```

`authRedirect.js`

```js
export function getPostLoginPath(user) {
  if (user?.role === 'ADMIN') return '/admin/dashboard';
  if (user?.onboardingCompleted === false) return '/onboarding-setup';
  if (hasPendingCheckout()) return CHECKOUT_RESUME_PATH;
  return '/dashboard';
}
```

`OnboardingFlowView.jsx`

```js
const nextPath = hasPendingCheckout() ? CHECKOUT_RESUME_PATH : '/dashboard';
const t = setTimeout(() => navigate(nextPath, { replace: true }), 650);
```

`CheckoutResumeView.jsx` (মূল অংশ)

```js
const [pending] = useState(readPendingCheckout);
const startedRef = useRef(false);

useEffect(() => {
  if (startedRef.current) return;      // StrictMode-এ দুবার API call আটকায়
  startedRef.current = true;
  clearPendingCheckout();              // একবারই কাজ করবে

  if (!pending) {
    navigate('/dashboard', { replace: true });
    return;
  }

  dispatch(createCheckout(pending))
    .unwrap()
    .then((data) => {
      if (!data?.url) throw new Error('Checkout URL missing');
      window.location.replace(data.url); // Stripe থেকে Back চাপলে spinner page-এ আটকাবে না
    })
    .catch((error) => {
      toast.error(...);
      navigate('/dashboard', { replace: true });
    });
}, [dispatch, navigate, pending]);
```

---

## ৪. কোন ক্ষেত্রে কী হবে

| User | আগে | এখন |
|---|---|---|
| পুরোনো user, email/password login | Dashboard | Stripe checkout |
| Google দিয়ে login | Dashboard | Stripe checkout |
| নতুন user, sign-up | OTP → onboarding → Dashboard | OTP → onboarding → **Stripe checkout** |
| Login করা অবস্থায় plan চাপা | Stripe checkout | বদলায়নি |
| Free plan চাপা | Signup / Dashboard | বদলায়নি |
| Admin login | Admin dashboard | বদলায়নি (checkout হবে না) |
| Checkout API ব্যর্থ | — | Error toast → Dashboard |
| Stripe-এ Cancel | — | আগের মতো `/payment/cancel` page |
| Plan চেপে login না করে চলে গেল, ১ ঘণ্টা পরে login | — | Dashboard (pending বাতিল হয়ে গেছে) |
| অন্য tab-এ login | — | Dashboard (sessionStorage tab-ভিত্তিক) |
| Checkout শুরু হওয়ার পরে আবার login | — | Dashboard (pending আগেই মুছে গেছে) |

---

## ৫. Test-এর ধাপ

1. Logout করো।
2. Home page → Pricing → Monthly/Yearly বাছাই করে **Get Pro** চাপো → login page আসবে।
3. Login করো → "Redirecting to checkout…" → Stripe page খুলবে, সঠিক plan আর billing সহ।
4. Stripe-এ Back চাপো → pricing/home-এ ফেরত যাবে, spinner-এ আটকাবে না।
5. আবার logout → Get Ultimate → login page-এ **Sign up** → OTP → onboarding শেষ → Stripe খুলবে।
6. Logout → Get Pro → login page থেকে কিছু না করে home-এ ফিরে যাও → normal login → এখনো checkout-এ যাবে (একই tab, ১ ঘণ্টার মধ্যে)। এটা ইচ্ছাকৃত।
7. Admin দিয়ে login → admin dashboard (checkout নয়)।

---

## ৬. সীমাবদ্ধতা / Backend-এর জন্য নোট

- Plan শুধু browser-এর `sessionStorage`-এ থাকে। অন্য device বা tab-এ login করলে মনে থাকবে না।
- কেউ ইতিমধ্যে Pro থাকলে আবার Pro checkout চাইলে backend কী করবে সেটা backend-এর উপর নির্ভর করে। Error এলে toast দেখিয়ে dashboard-এ পাঠানো হয়।
