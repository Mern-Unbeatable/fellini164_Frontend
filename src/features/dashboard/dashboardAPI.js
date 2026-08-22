import { GET } from '../../services/httpMethods';
import { API_ENDPOINTS } from '../../services/httpEndpoint';

export async function fetchDashboardApi() {
  return GET(API_ENDPOINTS.USERS.DASHBOARD);
}
