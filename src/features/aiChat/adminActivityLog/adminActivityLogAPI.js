import axiosInstance from '../../../services/axiosInstance';

/**
 * Fetch all users activity logs (Admin)
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.type - Activity type filter (optional)
 * @param {string} params.userId - User ID filter (optional)
 * @returns {Promise} API response
 */
export const fetchAdminActivityLogs = async ({ page = 1, limit = 10, type, userId }) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (type && type !== 'ALL') {
    params.append('type', type);
  }

  if (userId) {
    params.append('userId', userId);
  }

  const response = await axiosInstance.get(`/api/v1/admin/activity-logs?${params.toString()}`);
  return response.data;
};

/**
 * Fetch single user's activity logs (Admin)
 * @param {string} userId - User ID
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.type - Activity type filter (optional)
 * @returns {Promise} API response
 */
export const fetchUserActivityLogs = async (userId, params = {}) => {
  const { page = 1, limit = 10, type } = params;
  
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (type && type !== 'ALL') {
    queryParams.append('type', type);
  }

  const response = await axiosInstance.get(`/api/v1/admin/users/${userId}/activity-logs?${queryParams.toString()}`);
  return response.data;
};
