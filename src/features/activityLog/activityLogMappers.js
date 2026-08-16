export function parseActivityLogsResponse(response) {
  if (!response) {
    return { activities: [], total: 0 };
  }

  if (response.success === false) {
    throw new Error(response.message || 'Failed to fetch activity logs');
  }

  const activities = extractActivities(response);
  const pagination = response.pagination ?? response.data?.pagination ?? {};

  return {
    activities,
    total: pagination.total ?? activities.length,
  };
}

function extractActivities(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.data)) return response.data;
  if (Array.isArray(response.data?.data)) return response.data.data;
  if (Array.isArray(response.data?.activityLogs)) return response.data.activityLogs;
  if (Array.isArray(response.activityLogs)) return response.activityLogs;
  return [];
}
