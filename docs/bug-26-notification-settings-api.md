# BUG 26 — Notification Preferences backend-এ save হয় না

## সমস্যা
Profile → **Notification Preferences** এর toggle গুলো (Habit reminders / Alerts / Product updates)
শুধু browser `localStorage` এ save হত। Backend জানত না, তাই toggle off করলেও notification আসত,
আর অন্য browser/device এ login করলে সব আবার ON দেখাত।

Backend এখন API দিয়েছে:

| Method | URL | Body | Response `data` |
|---|---|---|---|
| GET | `/api/v1/users/notification-settings` | — | `{ habitReminders, alerts, productUpdates }` |
| PATCH | `/api/v1/users/notification-settings` | যেকোনো subset, যেমন `{ "productUpdates": false }` | updated পুরো object |

Key এর মানে (backend comment অনুযায়ী):
- `habitReminders` → habit reminder
- `alerts` → task / account activity alerts
- `productUpdates` → admin announcement

## পরিবর্তন

### নতুন file: `src/features/users/notificationSettingsApi.js`
`getNotificationSettingsApi()` আর `updateNotificationSettingsApi(patch)`।

### `src/pages/private/user/profile/components/NotificationPreferencesSection.jsx`
- localStorage code সরানো হয়েছে।
- Mount এ GET → toggle গুলো server value দেখায়। Load চলাকালীন toggle disabled।
- Load fail হলে error text + **Retry** button।
- Toggle click → optimistic flip → শুধু ওই key PATCH → success হলে server response দিয়ে state set + toast।
  Fail হলে আগের value তে rollback + error toast।
- Request চলাকালীন ওই toggle disabled (double click এ দুইটা request যায় না)।
- `userId` prop আর দরকার নেই।

### `src/pages/private/user/profile/ProfilePage.jsx`
- `<NotificationPreferencesSection id="notifications" />` (`userId` prop বাদ)।

## Scenario

| অবস্থা | আগে | এখন |
|---|---|---|
| Toggle off → refresh | localStorage থেকে off (একই browser এ) | server থেকে off |
| অন্য device এ login | সব ON | server value |
| Toggle off করার পর notification | আসত (backend জানত না) | backend বন্ধ রাখবে |
| Network fail | সবসময় "success" toast | rollback + error toast |
| দ্রুত দুইবার click | দুইবার flip | request শেষ না হওয়া পর্যন্ত disabled |

## Test
1. Profile → Notification Preferences খুলুন; Network tab এ `GET notification-settings` দেখুন।
2. "Product updates" off করুন → `PATCH` body `{"productUpdates":false}` → refresh করুন → off থাকবে।
3. Postman এ GET করে মিলিয়ে দেখুন।
4. Offline করে toggle করুন → আগের অবস্থায় ফিরে আসবে + error toast।
5. Offline অবস্থায় page খুলুন → error + Retry; online করে Retry চাপুন।

## Undo
```bash
git checkout -- src/pages/private/user/profile/components/NotificationPreferencesSection.jsx src/pages/private/user/profile/ProfilePage.jsx
del src\features\users\notificationSettingsApi.js
```

## আগের code (NotificationPreferencesSection.jsx — পুরো)
```jsx
import { useState } from 'react';
import { Bell } from 'lucide-react';
import { toast } from 'react-toastify';
import SettingsCard from './SettingsCard';

// No preferences API yet — persisted per user in localStorage until the backend exposes one.
const STORAGE_KEY_PREFIX = 'elyxa.notificationPreferences';

const PREFERENCES = [
  {
    key: 'habitReminders',
    label: 'Habit reminders',
    description: "Get a reminder at each habit's scheduled time",
  },
  {
    key: 'alerts',
    label: 'Alerts',
    description: 'Important updates about your account and activity',
  },
  {
    key: 'productUpdates',
    label: 'Product updates & announcements',
    description: 'New features and announcements from Elyxa',
  },
];

const DEFAULT_PREFERENCES = Object.fromEntries(PREFERENCES.map((p) => [p.key, true]));

function storageKey(userId) {
  return `${STORAGE_KEY_PREFIX}.${userId || 'me'}`;
}

function loadPreferences(userId) {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey(userId)) || '{}');
    return { ...DEFAULT_PREFERENCES, ...stored };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        checked ? 'bg-[#8022fe]' : 'bg-[#e5e5e5] dark:bg-zinc-600'
      }`}
    >
      <span
        className={`inline-block size-5 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-5.5' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}

export default function NotificationPreferencesSection({ id, userId }) {
  const [preferences, setPreferences] = useState(() => loadPreferences(userId));

  const handleToggle = (pref) => {
    const next = { ...preferences, [pref.key]: !preferences[pref.key] };
    setPreferences(next);
    localStorage.setItem(storageKey(userId), JSON.stringify(next));
    toast.success(`${pref.label} ${next[pref.key] ? 'turned on' : 'turned off'}`);
  };

  return (
    <SettingsCard
      id={id}
      icon={Bell}
      title="Notification Preferences"
      description="Choose which notifications you want to receive"
    >
      <div className="divide-y divide-[#f2f2f2] rounded-xl border border-[#f2f2f2] dark:divide-zinc-700 dark:border-zinc-700">
        {PREFERENCES.map((pref) => (
          <div key={pref.key} className="flex items-center justify-between gap-4 px-4 py-3.5">
            <div className="min-w-0">
              <p className="text-[14px] font-medium text-[#181818] dark:text-white">{pref.label}</p>
              <p className="mt-0.5 text-[12px] font-medium text-[#c2c2c2] dark:text-zinc-500">{pref.description}</p>
            </div>
            <Toggle checked={preferences[pref.key]} onChange={() => handleToggle(pref)} label={pref.label} />
          </div>
        ))}
      </div>
    </SettingsCard>
  );
}
```

## আগের code (ProfilePage.jsx line 145)
```jsx
<NotificationPreferencesSection id="notifications" userId={user?.id ?? user?._id} />
```
