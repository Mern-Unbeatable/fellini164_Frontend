import axiosInstance from '../../services/axiosInstance';

const BASE = '/api/v1/tasks';

export function unwrapData(response) {
  const body = response?.data;
  if (body?.task) return body.task;
  if (body?.data !== undefined) return body.data;
  return body;
}

/** GET /api/v1/tasks/summary */
export async function fetchTasksSummaryApi() {
  const response = await axiosInstance.get(`${BASE}/summary`);
  const body = response?.data;
  return body?.summary ?? unwrapData(response);
}

/**
 * GET /api/v1/tasks — List with filters & pagination.
 * Envelope: { success, count, tasks, pagination }
 */
export async function fetchTasksApi(params = {}) {
  const query = { ...params };
  Object.keys(query).forEach((key) => {
    if (query[key] === undefined || query[key] === null || query[key] === '') {
      delete query[key];
    }
  });
  const response = await axiosInstance.get(BASE, { params: query });
  const body = response?.data;
  if (body && Array.isArray(body.tasks)) return body;
  if (Array.isArray(body?.data)) {
    return { tasks: body.data, count: body.count, pagination: body.pagination, summary: body.summary };
  }
  if (Array.isArray(body)) return { tasks: body, count: body.length };
  return { tasks: [], count: 0, pagination: null };
}

/** GET /api/v1/tasks/:taskId */
export async function fetchTaskByIdApi(taskId) {
  const response = await axiosInstance.get(`${BASE}/${taskId}`);
  return unwrapData(response);
}

/** POST /api/v1/tasks */
export async function createTaskApi(payload) {
  const response = await axiosInstance.post(BASE, payload);
  return unwrapData(response);
}

/** PATCH /api/v1/tasks/:taskId */
export async function updateTaskApi(taskId, payload) {
  const response = await axiosInstance.patch(`${BASE}/${taskId}`, payload);
  return unwrapData(response);
}

/** PATCH /api/v1/tasks/:taskId/status — body { status } */
export async function updateTaskStatusApi(taskId, status) {
  const response = await axiosInstance.patch(`${BASE}/${taskId}/status`, { status });
  return unwrapData(response);
}

/** POST /api/v1/tasks/:taskId/complete — optional { actualMinutes } */
export async function completeTaskApi(taskId, payload = {}) {
  const response = await axiosInstance.post(`${BASE}/${taskId}/complete`, payload);
  return unwrapData(response);
}

/** POST /api/v1/tasks/:taskId/skip — body { reason } */
export async function skipTaskApi(taskId, payload = {}) {
  const response = await axiosInstance.post(`${BASE}/${taskId}/skip`, payload);
  return unwrapData(response);
}

/** DELETE /api/v1/tasks/:taskId */
export async function deleteTaskApi(taskId) {
  await axiosInstance.delete(`${BASE}/${taskId}`);
  return taskId;
}

/** GET /api/v1/tasks/:taskId/subtasks */
export async function fetchSubtasksApi(taskId) {
  const response = await axiosInstance.get(`${BASE}/${taskId}/subtasks`);
  const body = response?.data;
  if (Array.isArray(body?.subtasks)) return body.subtasks;
  if (Array.isArray(body?.data)) return body.data;
  if (Array.isArray(body)) return body;
  return [];
}

/**
 * POST /api/v1/tasks/ai/generate
 * Body: { prompt, category, goalId? } — server persists immediately.
 */
export async function generateTaskApi(payload) {
  const response = await axiosInstance.post(`${BASE}/ai/generate`, payload);
  const body = response?.data;
  if (body?.task) return body.task;
  return unwrapData(response);
}

/**
 * POST /api/v1/tasks/:taskId/ai/suggest
 * Body: { action: BREAKDOWN | IMPROVE_DESCRIPTION | CHAT, message?, regenerate? }
 * When BREAKDOWN and task already has subtasks, send regenerate: true.
 */
export async function suggestTaskAiApi(taskId, payload) {
  const response = await axiosInstance.post(`${BASE}/${taskId}/ai/suggest`, payload);
  return response?.data;
}

/**
 * GET /api/v1/tasks/:taskId/ai/suggestions
 * Omit status for full chat history (applied + dismissed + pending).
 * Pass status='pending' only when you need the open suggestion queue.
 */
export async function fetchTaskAiSuggestionsApi(taskId, status) {
  const response = await axiosInstance.get(`${BASE}/${taskId}/ai/suggestions`, {
    params: status ? { status } : undefined,
  });
  const body = response?.data;
  if (Array.isArray(body?.suggestions)) return body;
  if (Array.isArray(body?.data)) return { ...body, suggestions: body.data };
  if (Array.isArray(body?.items)) return { ...body, suggestions: body.items };
  if (Array.isArray(body)) return { suggestions: body };
  return body ?? { suggestions: [] };
}

/** POST /api/v1/tasks/ai/suggestions/:suggestionId/accept */
export async function acceptTaskSuggestionApi(suggestionId) {
  const response = await axiosInstance.post(`${BASE}/ai/suggestions/${suggestionId}/accept`);
  return response?.data;
}

/** POST /api/v1/tasks/ai/suggestions/:suggestionId/dismiss */
export async function dismissTaskSuggestionApi(suggestionId) {
  const response = await axiosInstance.post(`${BASE}/ai/suggestions/${suggestionId}/dismiss`);
  return response?.data;
}

/** POST /api/v1/tasks/:taskId/ai/undo */
export async function undoTaskAiApi(taskId) {
  const response = await axiosInstance.post(`${BASE}/${taskId}/ai/undo`);
  return response?.data;
}
