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
 * Pause / Activate toggle.
 * Confirmed: PATCH /habits/:id/pause works (user: "Pause / Activate Toggle").
 * PATCH /habits/:id/activate does NOT exist → "Route not found".
 * Activate reuses /pause (toggle). If status stays PAUSED, falls back to PATCH body.
 */
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

function readHabitStatus(data) {
  const habit = data?.habit && typeof data.habit === 'object' ? data.habit : data;
  if (!habit || typeof habit !== 'object') return { status: '', isActive: undefined };
  return {
    status: String(habit.status || '').toUpperCase(),
    isActive: habit.isActive,
  };
}

export async function updateHabitStatusApi(habitId, status) {
  const upper = String(status || '').toUpperCase();
  const wantActive = upper === 'ACTIVE';
  const wantPaused = upper === 'PAUSED';

  const attempts = [
    // Canonical toggle (pause + activate)
    () => axiosInstance.patch(`${BASE}/${habitId}/pause`),
    () => axiosInstance.post(`${BASE}/${habitId}/pause`),
    // Body fallback if /pause cannot flip the other way
    () =>
      axiosInstance.patch(`${BASE}/${habitId}`, {
        status: upper,
        isActive: wantActive,
      }),
    ...(wantActive
      ? [
          () => axiosInstance.patch(`${BASE}/${habitId}/unpause`),
          () => axiosInstance.post(`${BASE}/${habitId}/unpause`),
        ]
      : []),
  ];

  let lastError;
  for (const attempt of attempts) {
    try {
      const response = await attempt();
      const data = unwrapData(response);
      const { status: next, isActive } = readHabitStatus(data);

      if (wantActive) {
        const ok = next === 'ACTIVE' || isActive === true || (!next && isActive !== false);
        if (!ok) {
          lastError = new Error('Habit still paused');
          continue;
        }
      }
      if (wantPaused) {
        const ok = next === 'PAUSED' || isActive === false;
        // Empty response after /pause — trust success (pause already worked in UI)
        if (!ok && next) {
          lastError = new Error('Habit still active');
          continue;
        }
      }
      return data;
    } catch (error) {
      lastError = error;
      if (isRouteMissing(error)) continue;
      throw error;
    }
  }

  throw lastError || new Error('Failed to update habit status');
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
