import { DELETE, GET, PATCH } from '../../services/httpMethods';
import { API_ENDPOINTS, notificationById } from '../../services/httpEndpoint';

export async function fetchNotificationsApi() {
  return GET(API_ENDPOINTS.NOTIFICATIONS.BASE);
}

export async function markNotificationReadApi(id) {
  return PATCH(notificationById(id, 'read'));
}

export async function markAllNotificationsReadApi() {
  return PATCH(API_ENDPOINTS.NOTIFICATIONS.READ_ALL);
}

export async function deleteNotificationApi(id) {
  return DELETE(notificationById(id));
}
