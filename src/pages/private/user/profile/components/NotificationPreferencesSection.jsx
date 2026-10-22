import { useCallback, useEffect, useRef, useState } from 'react';
import { Bell } from 'lucide-react';
import { toast } from 'react-toastify';
import SettingsCard from './SettingsCard';
import {
  getNotificationSettingsApi,
  updateNotificationSettingsApi,
} from '../../../../../features/users/notificationSettingsApi';

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

function normalizePreferences(data) {
  return Object.fromEntries(
    PREFERENCES.map((p) => [p.key, typeof data?.[p.key] === 'boolean' ? data[p.key] : DEFAULT_PREFERENCES[p.key]])
  );
}

function errorMessage(error, fallback) {
  return error?.response?.data?.message || error?.message || fallback;
}

function Toggle({ checked, onChange, label, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
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

export default function NotificationPreferencesSection({ id }) {
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [pendingKeys, setPendingKeys] = useState(() => new Set());
  const pendingKeysRef = useRef(new Set());
  const mountedRef = useRef(true);

  const loadPreferences = useCallback(() => {
    return getNotificationSettingsApi()
      .then((data) => {
        if (!mountedRef.current) return;
        setPreferences(normalizePreferences(data));
        setLoadError('');
      })
      .catch((error) => {
        if (!mountedRef.current) return;
        setLoadError(errorMessage(error, 'Failed to load notification settings'));
      })
      .finally(() => {
        if (mountedRef.current) setLoading(false);
      });
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    loadPreferences();
    return () => {
      mountedRef.current = false;
    };
  }, [loadPreferences]);

  const handleRetry = () => {
    setLoading(true);
    setLoadError('');
    loadPreferences();
  };

  const setKeyPending = (key, isPending) => {
    if (isPending) pendingKeysRef.current.add(key);
    else pendingKeysRef.current.delete(key);
    setPendingKeys(new Set(pendingKeysRef.current));
  };

  const handleToggle = async (pref) => {
    if (loading || loadError || pendingKeysRef.current.has(pref.key)) return;
    const previous = preferences[pref.key];
    const nextValue = !previous;

    setKeyPending(pref.key, true);
    setPreferences((prev) => ({ ...prev, [pref.key]: nextValue }));
    try {
      const data = await updateNotificationSettingsApi({ [pref.key]: nextValue });
      if (!mountedRef.current) return;
      setPreferences((prev) => ({
        ...prev,
        [pref.key]: typeof data?.[pref.key] === 'boolean' ? data[pref.key] : nextValue,
      }));
      toast.success(`${pref.label} ${nextValue ? 'turned on' : 'turned off'}`);
    } catch (error) {
      if (!mountedRef.current) return;
      setPreferences((prev) => ({ ...prev, [pref.key]: previous }));
      toast.error(errorMessage(error, 'Failed to update notification settings'));
    } finally {
      if (mountedRef.current) setKeyPending(pref.key, false);
    }
  };

  return (
    <SettingsCard
      id={id}
      icon={Bell}
      title="Notification Preferences"
      description="Choose which notifications you want to receive"
    >
      {loadError && (
        <div className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          <span>{loadError}</span>
          <button
            type="button"
            onClick={handleRetry}
            className="shrink-0 rounded-lg px-2 py-1 font-semibold underline transition-colors hover:text-red-700"
          >
            Retry
          </button>
        </div>
      )}
      <div className="divide-y divide-[#f2f2f2] rounded-xl border border-[#f2f2f2] dark:divide-zinc-700 dark:border-zinc-700">
        {PREFERENCES.map((pref) => (
          <div key={pref.key} className="flex items-center justify-between gap-4 px-4 py-3.5">
            <div className="min-w-0">
              <p className="text-[14px] font-medium text-[#181818] dark:text-white">{pref.label}</p>
              <p className="mt-0.5 text-[12px] font-medium text-[#c2c2c2] dark:text-zinc-500">{pref.description}</p>
            </div>
            <Toggle
              checked={preferences[pref.key]}
              onChange={() => handleToggle(pref)}
              label={pref.label}
              disabled={loading || Boolean(loadError) || pendingKeys.has(pref.key)}
            />
          </div>
        ))}
      </div>
    </SettingsCard>
  );
}
