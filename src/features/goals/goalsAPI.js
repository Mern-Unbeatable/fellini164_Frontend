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

/**
 * POST /api/v1/tasks/ai/generate
 * Body: { prompt, category, goalId? } — category CAREER|HEALTH|FINANCE|PERSONAL|EDUCATION
 * Response: { success, message, task, tokensUsed } — task is already persisted (often with goalId).
 */
export async function generateTaskApi(payload) {
  const response = await axiosInstance.post('/api/v1/tasks/ai/generate', payload);
  const body = response?.data;
  if (body?.task) return body.task;
  return unwrapData(response);
}

/**
 * POST /api/v1/habits/ai/generate
 * Body: { prompt, category, goalId? }
 * category: CAREER|HEALTH|FINANCE|FITNESS|WELLNESS|PRODUCTIVITY|PERSONAL|EDUCATION
 * Response: { success, message, habit, tokensUsed } — habit is already persisted (often with goalId).
 */
export async function generateHabitApi(payload) {
  const response = await axiosInstance.post('/api/v1/habits/ai/generate', payload);
  const body = response?.data;
  if (body?.habit) return body.habit;
  return unwrapData(response);
}

/**
 * POST /api/v1/goals/:goalId/ai/suggest
 * Body: { action, message }
 * action: IMPROVE_DESCRIPTION | ADD_TASKS | ADD_HABITS | CHAT
 * Response: { success, message, suggestionId, action, proposedGoal, proposedTasks, proposedHabits, goal, tokensUsed }
 */
export async function suggestGoalApi(goalId, payload) {
  const response = await axiosInstance.post(`${BASE}/${goalId}/ai/suggest`, payload);
  return response?.data;
}

/**
 * GET /api/v1/tasks — List Tasks (filters & pagination).
 * Envelope: { success, count, tasks, pagination }
 * Link-picker default: parentOnly + page/limit (do not pass goalId — that filters already-linked tasks).
 */
export async function fetchTasksForLinkApi(params = {}) {
  const query = {
    parentOnly: true,
    page: 1,
    limit: 50,
    ...params,
  };
  // Drop empty / undefined keys
  Object.keys(query).forEach((key) => {
    if (query[key] === undefined || query[key] === null || query[key] === '') {
      delete query[key];
    }
  });
  const response = await axiosInstance.get('/api/v1/tasks', { params: query });
  const body = response?.data;
  if (Array.isArray(body?.tasks)) return body.tasks;
  if (Array.isArray(body?.data)) return body.data;
  if (Array.isArray(body)) return body;
  return [];
}

/**
 * GET /api/v1/habits — List Habits with Search and Filters.
 * Envelope: { success, count, habits, pagination }
 * Link-picker default: page/limit + isActive=true (do not pass goalId — that filters already-linked habits).
 * Optional params: status, category, frequency, difficulty, goalId, isActive, aiSuggested, search, page, limit
 */
export async function fetchHabitsForLinkApi(params = {}) {
  const query = {
    page: 1,
    limit: 50,
    isActive: true,
    ...params,
  };
  Object.keys(query).forEach((key) => {
    if (query[key] === undefined || query[key] === null || query[key] === '') {
      delete query[key];
    }
  });
  const response = await axiosInstance.get('/api/v1/habits', { params: query });
  const body = response?.data;
  if (Array.isArray(body?.habits)) return body.habits;
  if (Array.isArray(body?.data)) return body.data;
  if (Array.isArray(body)) return body;
  return [];
}

/**
 * PATCH /api/v1/tasks/:taskId
 * Sample body: { priority, status } — also accepts title, description, category, dueDate, etc.
 * Response: { success, message, task }
 */
export async function updateTaskApi(taskId, payload) {
  const response = await axiosInstance.patch(`/api/v1/tasks/${taskId}`, payload);
  const body = response?.data;
  if (body?.task) return body.task;
  return unwrapData(response);
}

/**
 * POST /api/v1/tasks/:taskId/complete
 * Body: { actualMinutes }
 * Response: { success, message, task }
 */
export async function completeTaskApi(taskId, payload = {}) {
  const response = await axiosInstance.post(`/api/v1/tasks/${taskId}/complete`, payload);
  const body = response?.data;
  if (body?.task) return body.task;
  return unwrapData(response);
}

/**
 * DELETE /api/v1/tasks/:taskId
 */
export async function deleteTaskApi(taskId) {
  await axiosInstance.delete(`/api/v1/tasks/${taskId}`);
  return taskId;
}

/**
 * PATCH /api/v1/habits/:habitId
 * Sample body: { difficulty, reminderTime } — also accepts name, description, category, goalId
 * Response: { success, message, habit } (or habit in data)
 */
export async function updateHabitApi(habitId, payload) {
  const response = await axiosInstance.patch(`/api/v1/habits/${habitId}`, payload);
  const body = response?.data;
  if (body?.habit) return body.habit;
  return unwrapData(response);
}

/**
 * POST /api/v1/habits/:habitId/skip
 * Body: { reason }
 */
export async function skipHabitApi(habitId, payload = {}) {
  const response = await axiosInstance.post(`/api/v1/habits/${habitId}/skip`, payload);
  const body = response?.data;
  if (body?.habit) return body.habit;
  return unwrapData(response);
}

/**
 * DELETE /api/v1/habits/:habitId
 */
export async function deleteHabitApi(habitId) {
  await axiosInstance.delete(`/api/v1/habits/${habitId}`);
  return habitId;
}
