import axiosInstance from '../../services/axiosInstance';

/**
 * Fetch user activity logs
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.type - Activity type filter (optional)
 * @param {string} params.startDate - Start date filter (optional)
 * @param {string} params.endDate - End date filter (optional)
 * @returns {Promise} API response
 */
export const fetchActivityLogs = async ({ page = 1, limit = 10, type, startDate, endDate }) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (type && type !== 'ALL') {
    params.append('type', type);
  }

  if (startDate) {
    params.append('startDate', startDate);
  }

  if (endDate) {
    params.append('endDate', endDate);
  }

  const response = await axiosInstance.get(`/api/v1/users/activity-logs?${params.toString()}`);
  return response.data;
};

/**
 * Fetch activity log statistics
 * @returns {Promise} API response with stats
 */
export const fetchActivityStats = async () => {
  const response = await axiosInstance.get('/api/v1/users/activity-logs/stats');
  return response.data;
};
