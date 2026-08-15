import axiosInstance from '../../services/axiosInstance';

const BASE = '/api/v1/planner';
const ONBOARDING_SUGGESTIONS = '/api/v1/onboarding/suggestions';

function cleanParams(params = {}) {
  const query = { ...params };
  Object.keys(query).forEach((key) => {
    if (query[key] === undefined || query[key] === null || query[key] === '') {
      delete query[key];
    }
  });
  return query;
}

/** GET /api/v1/planner/summary?date=YYYY-MM-DD */
export async function fetchPlannerSummaryApi(date) {
  const response = await axiosInstance.get(`${BASE}/summary`, {
    params: cleanParams({ date }),
  });
  const body = response?.data;
  return body?.summary ?? body?.data?.summary ?? body;
}

/**
 * GET /api/v1/planner/board?viewType=DAILY|WEEKLY|MONTHLY&date=YYYY-MM-DD
 */
export async function fetchPlannerBoardApi({ viewType = 'DAILY', date } = {}) {
  const response = await axiosInstance.get(`${BASE}/board`, {
    params: cleanParams({ viewType, date }),
  });
  const body = response?.data;
  return body?.board ?? body?.data?.board ?? body;
}

/** GET /api/v1/planner/available?date=YYYY-MM-DD */
export async function fetchPlannerAvailableApi(date) {
  const response = await axiosInstance.get(`${BASE}/available`, {
    params: cleanParams({ date }),
  });
  return response?.data ?? { tasks: [], habits: [] };
}

/**
 * GET /api/v1/onboarding/suggestions?type=PLAN_ADJUSTMENT&status=pending
 * Empty Planner Board ghost placements.
 */
export async function fetchPlannerGhostSuggestionsApi() {
  const response = await axiosInstance.get(ONBOARDING_SUGGESTIONS, {
    params: { type: 'PLAN_ADJUSTMENT', status: 'pending' },
  });
  const body = response?.data;
  if (Array.isArray(body?.suggestions)) return body.suggestions;
  if (Array.isArray(body?.data?.suggestions)) return body.data.suggestions;
  if (Array.isArray(body) && Array.isArray(body[0]?.suggestions)) {
    return body[0].suggestions;
  }
  return [];
}

/**
 * POST /api/v1/planner/create-plan
 * Body: { prompt, dateRange: TODAY|THIS_WEEK|THIS_MONTH|CUSTOM, startDate?, endDate? }
 */
export async function createPlannerPlanApi(payload) {
  const response = await axiosInstance.post(`${BASE}/create-plan`, payload);
  return response?.data;
}

/**
 * POST /api/v1/planner/ai/suggest
 * Body: { action, viewType, date, energyLevel?, message? }
 * Actions: RECALIBRATE_DAY | REDUCE_OVERLOAD | OPTIMIZE_SCHEDULE | BALANCE_SCHEDULE | FREE_EVENING | CHAT
 */
export async function suggestPlannerAiApi(payload, dateQuery) {
  const response = await axiosInstance.post(
    `${BASE}/ai/suggest`,
    payload,
    { params: cleanParams({ date: dateQuery }) }
  );
  return response?.data;
}

/** GET /api/v1/planner/ai/suggestions/:suggestionId */
export async function fetchPlannerSuggestionApi(suggestionId) {
  const response = await axiosInstance.get(`${BASE}/ai/suggestions/${suggestionId}`);
  return response?.data;
}

/** POST /api/v1/planner/ai/suggestions/:suggestionId/accept */
export async function acceptPlannerSuggestionApi(suggestionId) {
  const response = await axiosInstance.post(`${BASE}/ai/suggestions/${suggestionId}/accept`);
  return response?.data;
}

/** POST /api/v1/planner/ai/suggestions/:suggestionId/dismiss */
export async function dismissPlannerSuggestionApi(suggestionId) {
  const response = await axiosInstance.post(`${BASE}/ai/suggestions/${suggestionId}/dismiss`);
  return response?.data;
}

/** POST /api/v1/planner/ai/undo */
export async function undoPlannerAiApi() {
  const response = await axiosInstance.post(`${BASE}/ai/undo`);
  return response?.data;
}

/** PATCH /api/v1/planner/:plannerItemId — optional move/reorder */
export async function updatePlannerItemApi(plannerItemId, payload) {
  const response = await axiosInstance.patch(`${BASE}/${plannerItemId}`, payload);
  return response?.data;
}

/** PATCH /api/v1/planner/:plannerItemId/complete */
export async function completePlannerItemApi(plannerItemId) {
  const response = await axiosInstance.patch(`${BASE}/${plannerItemId}/complete`);
  return response?.data;
}
