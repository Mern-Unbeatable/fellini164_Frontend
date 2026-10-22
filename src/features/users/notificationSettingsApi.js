import { GET, PATCH } from '../../services/httpMethods';

const NOTIFICATION_SETTINGS_URL = '/api/v1/users/notification-settings';

// Returns `{ habitReminders, alerts, productUpdates }`.
export async function getNotificationSettingsApi() {
  const response = await GET(NOTIFICATION_SETTINGS_URL);
  if (!response?.success) {
    throw new Error(response?.message || 'Failed to load notification settings');
  }
  return response.data || {};
}

// Accepts any subset of the settings keys; returns the full updated settings.
export async function updateNotificationSettingsApi(patch) {
  const response = await PATCH(NOTIFICATION_SETTINGS_URL, patch);
  if (!response?.success) {
    throw new Error(response?.message || 'Failed to update notification settings');
  }
  return response.data || {};
}
