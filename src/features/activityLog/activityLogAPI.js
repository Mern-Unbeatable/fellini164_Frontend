import { GET } from '../../services/httpMethods';
import { API_ENDPOINTS } from '../../services/httpEndpoint';

/** Match Postman: GET /api/v1/users/activity-logs with optional type filter only. */
export async function fetchActivityLogs({ type, startDate, endDate } = {}) {
  const params = {};

  if (type && type !== 'ALL') params.type = type;
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  return GET(API_ENDPOINTS.USERS.ACTIVITY_LOGS, Object.keys(params).length ? params : undefined);
}

export async function fetchActivityStats() {
  return GET(API_ENDPOINTS.USERS.ACTIVITY_LOGS_STATS);
}
