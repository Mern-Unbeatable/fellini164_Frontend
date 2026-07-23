import axiosInstance from '../../services/axiosInstance';

const BASE = '/api/v1/habits';

export function unwrapData(response) {
  const body = response?.data;
  if (body?.habit) return body.habit;
  if (body?.data !== undefined) return body.data;
  return body;
}

/**
 * GET /api/v1/habits/summary
 * Envelope: { success, summary: { active, paused, completed, total, completedToday, remainingToday } }
 */
export async function fetchHabitsSummaryApi() {
  const response = await axiosInstance.get(`${BASE}/summary`);
  const body = response?.data;
  return body?.summary ?? unwrapData(response);
}

/**
 * GET /api/v1/habits/stats/overview
 * Envelope: { success, stats: { … } }
 */
export async function fetchHabitsStatsOverviewApi() {
  const response = await axiosInstance.get(`${BASE}/stats/overview`);
  const body = response?.data;
  return body?.stats ?? unwrapData(response);
}

/**
 * GET /api/v1/habits — List Habits with Search and Filters.
 * Envelope: { success, count, habits, pagination }
 */
export async function fetchHabitsApi(params = {}) {
  const query = { ...params };
  Object.keys(query).forEach((key) => {
    if (query[key] === undefined || query[key] === null || query[key] === '') {
      delete query[key];
    }
  });
  const response = await axiosInstance.get(BASE, { params: query });
  const body = response?.data;
  if (body && Array.isArray(body.habits)) return body;
  if (Array.isArray(body?.data)) {
    return { habits: body.data, count: body.count, pagination: body.pagination, summary: body.summary };
  }
  if (Array.isArray(body)) return { habits: body, count: body.length };
  return { habits: [], count: 0, pagination: null };
}

/** GET /api/v1/habits/:habitId */
export async function fetchHabitByIdApi(habitId) {
  const response = await axiosInstance.get(`${BASE}/${habitId}`);
  return unwrapData(response);
}

/**
 * POST /api/v1/habits
 * Body: { name, description, category, frequency, difficulty, targetDays, targetTimesPerDay, reminderTime, goalId? }
 */
export async function createHabitApi(payload) {
  const response = await axiosInstance.post(BASE, payload);
  return unwrapData(response);
}

/**
 * PATCH /api/v1/habits/:habitId
 * Partial body e.g. { difficulty, reminderTime, name?, goalId? }
 */
export async function updateHabitApi(habitId, payload) {
  const response = await axiosInstance.patch(`${BASE}/${habitId}`, payload);
  return unwrapData(response);
}

/**
 * POST /api/v1/habits/:habitId/complete
 * Body: { notes? }
 */
export async function completeHabitTodayApi(habitId, payload = {}) {
  const response = await axiosInstance.post(`${BASE}/${habitId}/complete`, payload);
  return unwrapData(response);
}

/** DELETE /api/v1/habits/:habitId/complete — Undo today's completion */
export async function undoHabitCompletionApi(habitId) {
  const response = await axiosInstance.delete(`${BASE}/${habitId}/complete`);
  return unwrapData(response);
}

/**
 * POST /api/v1/habits/:habitId/skip
 * Body: { reason }
 */
export async function skipHabitApi(habitId, payload = {}) {
  const response = await axiosInstance.post(`${BASE}/${habitId}/skip`, payload);
  return unwrapData(response);
}

/**
 * Pause / Activate toggle — same path style as Goals Postman:
 *   PATCH /habits/:id/pause
 *   PATCH /habits/:id/activate
 * (User listed method PATCH without full path; Goals-confirmed pattern.)
 */
export async function updateHabitStatusApi(habitId, status) {
  const upper = String(status || '').toUpperCase();
  if (upper === 'PAUSED') {
    const response = await axiosInstance.patch(`${BASE}/${habitId}/pause`);
    return unwrapData(response);
  }
  if (upper === 'ACTIVE') {
    const response = await axiosInstance.patch(`${BASE}/${habitId}/activate`);
    return unwrapData(response);
  }
  const response = await axiosInstance.patch(`${BASE}/${habitId}`, { status: upper });
  return unwrapData(response);
}

/**
 * PATCH /api/v1/habits/:habitId/complete-status
 * Marks habit status COMPLETED (lifetime), not today's check-in.
 */
export async function markHabitStatusCompletedApi(habitId) {
  const response = await axiosInstance.patch(`${BASE}/${habitId}/complete-status`);
  return unwrapData(response);
}

/** GET /api/v1/habits/:habitId/history?days=30 */
export async function fetchHabitHistoryApi(habitId, days = 30) {
  const response = await axiosInstance.get(`${BASE}/${habitId}/history`, { params: { days } });
  return unwrapData(response);
}

/** DELETE /api/v1/habits/:habitId */
export async function deleteHabitApi(habitId) {
  await axiosInstance.delete(`${BASE}/${habitId}`);
  return habitId;
}

/**
 * POST /api/v1/habits/ai/generate
 * Body: { prompt, category, goalId? }
 * Response: { success, message, habit } — server persists immediately.
 */
export async function generateHabitApi(payload) {
  const response = await axiosInstance.post(`${BASE}/ai/generate`, payload);
  const body = response?.data;
  if (body?.habit) return body.habit;
  return unwrapData(response);
}

/**
 * POST /api/v1/habits/:habitId/ai/improve
 * Body: { instructions }
 */
export async function improveHabitApi(habitId, payload) {
  const response = await axiosInstance.post(`${BASE}/${habitId}/ai/improve`, payload);
  return unwrapData(response);
}
