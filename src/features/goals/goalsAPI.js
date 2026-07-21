import axiosInstance from '../../services/axiosInstance';

const BASE = '/api/v1/goals';

export function unwrapData(response) {
  const body = response?.data;
  if (body?.data !== undefined) return body.data;
  return body;
}

/** GET /goals — returns full envelope { data, summary, pagination, count }. */
export async function fetchGoalsApi(params = {}) {
  const response = await axiosInstance.get(BASE, { params });
  const body = response?.data;
  if (body && Array.isArray(body.data)) return body;
  if (Array.isArray(body)) return { data: body, count: body.length };
  if (body?.data !== undefined) return body;
  return { data: [], count: 0 };
}

export async function fetchBoardSummaryApi() {
  const attempts = [`${BASE}/summary`, `${BASE}/board-summary`, `${BASE}/board/summary`];
  let lastError;

  for (const url of attempts) {
    try {
      const response = await axiosInstance.get(url);
      return unwrapData(response);
    } catch (error) {
      lastError = error;
      const status = error?.response?.status;
      if (status === 404) continue;
      throw error;
    }
  }

  throw lastError;
}

export async function fetchGoalByIdApi(id) {
  const response = await axiosInstance.get(`${BASE}/${id}`);
  return unwrapData(response);
}

export async function createGoalApi(payload) {
  const response = await axiosInstance.post(BASE, payload);
  return unwrapData(response);
}

/** POST /goals/ai/generate — creates an AI goal from prompt (server persists immediately). */
export async function generateGoalApi(payload) {
  const response = await axiosInstance.post(`${BASE}/ai/generate`, payload);
  return unwrapData(response);
}

export async function updateGoalApi(id, payload) {
  const url = `${BASE}/${id}`;
  const attempts = [
    () => axiosInstance.patch(url, payload),
    () => axiosInstance.put(url, payload),
    () => axiosInstance.post(url, payload),
  ];

  let lastError;
  for (const attempt of attempts) {
    try {
      const response = await attempt();
      return unwrapData(response);
    } catch (error) {
      lastError = error;
      const status = error?.response?.status;
      if (status === 404 || status === 405) continue;
      throw error;
    }
  }
  throw lastError;
}

/** True when backend has no matching route for this method/path. */
function isRouteMissing(error) {
  const status = error?.response?.status;
  const message = String(error?.response?.data?.message || error?.message || '');
  return (
    status === 404 ||
    status === 405 ||
    /route not found/i.test(message) ||
    /cannot (get|post|put|patch|delete)/i.test(message)
  );
}

/** PATCH complete — tries /complete then status COMPLETED */
export async function completeGoalApi(id) {
  const attempts = [
    () => axiosInstance.patch(`${BASE}/${id}/complete`),
    () => axiosInstance.post(`${BASE}/${id}/complete`),
  ];

  let lastError;
  for (const attempt of attempts) {
    try {
      const response = await attempt();
      return unwrapData(response);
    } catch (error) {
      lastError = error;
      if (isRouteMissing(error)) continue;
      throw error;
    }
  }

  try {
    return await updateGoalStatusApi(id, 'COMPLETED');
  } catch (error) {
    throw lastError || error;
  }
}

/**
 * Pause / Activate toggle.
 * Postman (Goals_Updated):
 *   PATCH {{baseUrl}}/goals/{{goalId}}/pause   → status PAUSED
 *   Activate uses /activate (or pause toggle reverse)
 */
export async function updateGoalStatusApi(id, status) {
  const upper = String(status || '').toUpperCase();
  const isPaused = upper === 'PAUSED';
  const isActive = upper === 'ACTIVE';
  const isCompleted = upper === 'COMPLETED';

  const attempts = [
    // Confirmed Postman: PATCH /goals/:id/pause
    ...(isPaused
      ? [
          () => axiosInstance.patch(`${BASE}/${id}/pause`),
          () => axiosInstance.post(`${BASE}/${id}/pause`),
        ]
      : []),
    // Activate counterpart
    ...(isActive
      ? [
          () => axiosInstance.patch(`${BASE}/${id}/activate`),
          () => axiosInstance.post(`${BASE}/${id}/activate`),
          () => axiosInstance.patch(`${BASE}/${id}/unpause`),
          () => axiosInstance.post(`${BASE}/${id}/unpause`),
        ]
      : []),
    ...(isCompleted
      ? [
          () => axiosInstance.patch(`${BASE}/${id}/complete`),
          () => axiosInstance.post(`${BASE}/${id}/complete`),
        ]
      : []),
    // Legacy /status (often 404 Route not found on this backend)
    () => axiosInstance.patch(`${BASE}/${id}/status`, { status: upper }),
    () => axiosInstance.post(`${BASE}/${id}/status`, { status: upper }),
    // Last resort: Update Goal body
    () => axiosInstance.patch(`${BASE}/${id}`, { status: upper }),
    () => axiosInstance.put(`${BASE}/${id}`, { status: upper }),
  ];

  let lastError;
  for (const attempt of attempts) {
    try {
      const response = await attempt();
      return unwrapData(response);
    } catch (error) {
      lastError = error;
      if (isRouteMissing(error)) continue;
      throw error;
    }
  }
  throw lastError;
}

export async function deleteGoalApi(id) {
  await axiosInstance.delete(`${BASE}/${id}`);
  return id;
}

export async function linkTasksToGoalApi(goalId, taskIds) {
  const attempts = [
    () => axiosInstance.post(`${BASE}/${goalId}/link-tasks`, { taskIds }),
    () => axiosInstance.post(`${BASE}/${goalId}/tasks`, { taskIds }),
  ];

  let lastError;
  for (const attempt of attempts) {
    try {
      const response = await attempt();
      return unwrapData(response);
    } catch (error) {
      lastError = error;
      if (error?.response?.status === 404) continue;
      throw error;
    }
  }
  throw lastError;
}

export async function linkHabitsToGoalApi(goalId, habitIds) {
  const attempts = [
    () => axiosInstance.post(`${BASE}/${goalId}/link-habits`, { habitIds }),
    () => axiosInstance.post(`${BASE}/${goalId}/habits`, { habitIds }),
  ];

  let lastError;
  for (const attempt of attempts) {
    try {
      const response = await attempt();
      return unwrapData(response);
    } catch (error) {
      lastError = error;
      if (error?.response?.status === 404) continue;
      throw error;
    }
  }
  throw lastError;
}

export async function fetchTasksForLinkApi() {
  const response = await axiosInstance.get('/api/v1/tasks');
  return unwrapData(response);
}

export async function fetchHabitsForLinkApi() {
  const response = await axiosInstance.get('/api/v1/habits');
  return unwrapData(response);
}
