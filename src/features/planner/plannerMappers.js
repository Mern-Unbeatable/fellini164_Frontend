/** Map Planner API ↔ Planner Board UI */

export const VIEW_UI_TO_API = {
  Daily: 'DAILY',
  Weekly: 'WEEKLY',
  Monthly: 'MONTHLY',
};

export const VIEW_API_TO_UI = {
  DAILY: 'Daily',
  WEEKLY: 'Weekly',
  MONTHLY: 'Monthly',
};

export const DATE_RANGE_FROM_VIEW = {
  Daily: 'TODAY',
  Weekly: 'THIS_WEEK',
  Monthly: 'THIS_MONTH',
};

/** New Plan modal labels → API dateRange */
export const DATE_RANGE_FROM_MODAL = {
  Today: 'TODAY',
  'This Week': 'THIS_WEEK',
  'This Month': 'THIS_MONTH',
  Custom: 'CUSTOM',
};

export const VIEW_FROM_DATE_RANGE = {
  TODAY: 'Daily',
  THIS_WEEK: 'Weekly',
  THIS_MONTH: 'Monthly',
  CUSTOM: 'Monthly',
};

/** Build POST /planner/create-plan body from New Plan modal form */
export function buildCreatePlanPayload({
  prompt,
  dateRangeLabel,
  customStart,
  customEnd,
}) {
  const trimmed = String(prompt || '').trim();
  const dateRange = DATE_RANGE_FROM_MODAL[dateRangeLabel] || 'TODAY';
  const payload = {
    prompt: trimmed,
    dateRange,
  };
  if (dateRange === 'CUSTOM') {
    if (customStart) payload.startDate = customStart;
    if (customEnd) payload.endDate = customEnd;
  }
  return payload;
}

export const AI_ACTION_TO_API = {
  GENERATE_PLAN: 'GENERATE_PLAN',
  generate_plan: 'GENERATE_PLAN',
  generate_daily_plan: 'GENERATE_PLAN',
  generate_weekly_plan: 'GENERATE_PLAN',
  generate_monthly_plan: 'GENERATE_PLAN',
  recalibrate_day: 'RECALIBRATE_DAY',
  reduce_overload: 'REDUCE_OVERLOAD',
  optimize_schedule: 'OPTIMIZE_SCHEDULE',
  balance: 'BALANCE_SCHEDULE',
  balance_schedule: 'BALANCE_SCHEDULE',
  free_evening: 'FREE_EVENING',
  CHAT: 'CHAT',
  chat: 'CHAT',
};

export const ENERGY_TO_API = {
  low: 'LOW',
  medium: 'MEDIUM',
  high: 'HIGH',
  Low: 'LOW',
  Medium: 'MEDIUM',
  High: 'HIGH',
};

/** "09:00" | "9:00" → "9 AM" */
export function startTimeToDisplay(startTime) {
  if (!startTime || typeof startTime !== 'string') return null;
  const match = startTime.trim().match(/^(\d{1,2}):(\d{2})/);
  if (!match) return null;
  let h = Number(match[1]);
  if (Number.isNaN(h)) return null;
  const period = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h} ${period}`;
}

/** "9 AM" | "2 PM" → "09:00" (API startTime) */
export function displayTimeToStartTime(display) {
  if (!display || typeof display !== 'string') return null;
  const match = display.trim().match(/^(\d{1,2})\s*(AM|PM)$/i);
  if (!match) return null;
  let h = Number(match[1]);
  const period = match[2].toUpperCase();
  if (Number.isNaN(h) || h < 1 || h > 12) return null;
  if (period === 'AM') {
    if (h === 12) h = 0;
  } else if (h !== 12) {
    h += 12;
  }
  return `${String(h).padStart(2, '0')}:00`;
}

/** PATCH /planner/:id body from UI reschedule */
export function buildPlannerPatchPayload({ startTime, endTime, orderIndex, displayTime }) {
  const payload = {};
  const apiStart =
    startTime ||
    (displayTime ? displayTimeToStartTime(displayTime) : null);
  if (apiStart) payload.startTime = apiStart;
  if (endTime != null && endTime !== '') payload.endTime = endTime;
  if (orderIndex != null && orderIndex !== '') payload.orderIndex = Number(orderIndex);
  return payload;
}

export function normalizePlannerSummary(summary) {
  const s = summary || {};
  return {
    date: s.date || null,
    scheduledToday: Number(s.scheduledToday) || 0,
    completedToday: Number(s.completedToday) || 0,
    remainingToday: Number(s.remainingToday) || 0,
    aiScheduledToday: Number(s.aiScheduledToday) || 0,
    unscheduledTasks: Number(s.unscheduledTasks) || 0,
    activeHabits: Number(s.activeHabits) || 0,
  };
}

export function categoryFromApi(category) {
  if (!category) return null;
  const normalized = String(category).toLowerCase();
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

export function priorityFromApi(value) {
  if (!value) return null;
  const upper = String(value).toUpperCase();
  if (['URGENT', 'HIGH', 'MEDIUM', 'LOW'].includes(upper)) return upper;
  return 'MEDIUM';
}

export function statusUiFromApi(status, itemType) {
  if (!status) return itemType === 'HABIT' ? 'Active' : 'To Do';
  const key = String(status).toUpperCase();
  if (key === 'TODO') return 'To Do';
  if (key === 'IN_PROGRESS') return 'In Progress';
  if (key === 'COMPLETED' || key === 'DONE') return 'Done';
  if (key === 'ACTIVE') return 'Active';
  return status;
}

/**
 * Map one API planner item → DailyView card shape.
 * Preserves API ids for complete/patch.
 */
export function mapPlannerItemFromApi(apiItem) {
  if (!apiItem) return null;
  const itemType = String(apiItem.itemType || '').toUpperCase();
  const kind = itemType === 'HABIT' ? 'habit' : 'task';
  const title =
    apiItem.title ||
    apiItem.task?.title ||
    apiItem.habit?.name ||
    'Untitled';
  const description =
    apiItem.description ||
    apiItem.task?.description ||
    apiItem.habit?.description ||
    '';
  const progress = apiItem.progress;
  const stepsLabel = progress?.label || null;
  const habitProgress =
    kind === 'habit'
      ? {
          done: progress?.completed ?? progress?.done ?? 0,
          total: progress?.total ?? 1,
        }
      : null;

  // Skip empty/invalid AI placeholders (e.g. habitId null + title Unknown)
  const resolvedId = apiItem.id || apiItem.taskId || apiItem.habitId || apiItem.task?.id || apiItem.habit?.id;
  if (!resolvedId && (title === 'Unknown' || title === 'Untitled')) {
    return null;
  }

  return {
    id: resolvedId || `tmp-${itemType}-${apiItem.orderIndex ?? 0}`,
    plannerItemId: apiItem.id || null,
    taskId: apiItem.taskId || apiItem.task?.id || null,
    habitId: apiItem.habitId || apiItem.habit?.id || null,
    kind,
    itemType,
    time: startTimeToDisplay(apiItem.startTime) || '9 AM',
    startTime: apiItem.startTime || null,
    endTime: apiItem.endTime || null,
    date: apiItem.date || null,
    orderIndex: apiItem.orderIndex ?? 0,
    title,
    description,
    priority: priorityFromApi(apiItem.priority || apiItem.task?.priority),
    status: statusUiFromApi(apiItem.status || apiItem.task?.status, itemType),
    category: categoryFromApi(apiItem.category || apiItem.task?.category || apiItem.habit?.category),
    source: apiItem.isAi || apiItem.aiScheduled || apiItem.task?.aiGenerated || apiItem.habit?.aiSuggested
      ? 'ai'
      : 'manual',
    durationLabel:
      apiItem.estimatedMinutes != null
        ? `${apiItem.estimatedMinutes} Min`
        : apiItem.task?.estimatedMinutes != null
          ? `${apiItem.task.estimatedMinutes} Min`
          : null,
    stepsLabel: kind === 'task' ? stepsLabel : null,
    progress: habitProgress,
    goalLabel: apiItem.goalTitle || apiItem.goal?.title || null,
    goalId: apiItem.goalId || apiItem.goal?.id || null,
    isCompleted: Boolean(apiItem.isCompleted),
    aiScheduled: Boolean(apiItem.aiScheduled),
    layout: null,
  };
}

export function mapPlannerItemsFromApi(list) {
  if (!Array.isArray(list)) return [];
  return list
    .map(mapPlannerItemFromApi)
    .filter(Boolean)
    .sort((a, b) => {
      if (a.date !== b.date) return String(a.date || '').localeCompare(String(b.date || ''));
      return (a.orderIndex ?? 0) - (b.orderIndex ?? 0);
    });
}

/**
 * PLAN_ADJUSTMENT onboarding suggestions → existing date-keyed Planner card fields.
 * Only planner.placements are used; suggestion metadata does not create new UI.
 */
export function plannerGhostSuggestionsToPlans(suggestions) {
  const plans = {};
  if (!Array.isArray(suggestions)) return plans;

  suggestions.forEach((suggestion) => {
    const placements = suggestion?.planner?.placements;
    if (!Array.isArray(placements)) return;

    placements.forEach((placement, index) => {
      const mapped = mapPlannerItemFromApi({
        ...placement,
        date: placement?.date || suggestion?.planner?.date || suggestion?.date,
        id: `ghost-${suggestion.suggestionId || 'plan'}-${index}`,
        aiScheduled: true,
      });
      if (!mapped?.date) return;
      mapped.date = plannerDateKey(mapped.date) || mapped.date;
      if (!plans[mapped.date]) plans[mapped.date] = [];
      plans[mapped.date].push(mapped);
    });
  });

  Object.values(plans).forEach((items) => {
    items.sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
  });
  return plans;
}

/** "2026-05-13" or ISO datetime → "YYYY-MM-DD" so Daily/Weekly/Monthly share one key. */
export function plannerDateKey(value) {
  if (!value) return null;
  const match = String(value).match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : null;
}

function unwrapBoardEnvelope(board) {
  if (!board || typeof board !== 'object') return null;
  if (Array.isArray(board)) return { items: board };
  if (board.board && typeof board.board === 'object') return unwrapBoardEnvelope(board.board);
  if (
    board.data &&
    typeof board.data === 'object' &&
    !Array.isArray(board.data) &&
    (board.data.board || board.data.items || board.data.days || board.data.viewType)
  ) {
    return unwrapBoardEnvelope(board.data.board || board.data);
  }
  return board;
}

function rawItemsFromDay(entry) {
  if (Array.isArray(entry)) return entry;
  if (!entry || typeof entry !== 'object') return [];
  if (Array.isArray(entry.items)) return entry.items;
  if (Array.isArray(entry.plannerItems)) return entry.plannerItems;
  if (Array.isArray(entry.placements)) return entry.placements;
  if (entry.itemType || entry.taskId || entry.habitId || entry.title) return [entry];
  return [];
}

/** Board envelope → { viewType, date, startDate, endDate, itemsByDate, items } */
export function mapPlannerBoardFromApi(board) {
  const empty = {
    viewType: 'DAILY',
    date: null,
    startDate: null,
    endDate: null,
    items: [],
    itemsByDate: {},
    days: {},
  };
  const source = unwrapBoardEnvelope(board);
  if (!source) return empty;

  const viewType = String(source.viewType || 'DAILY').toUpperCase();
  const itemsByDate = {};

  const addRaw = (raw, fallbackDate) => {
    if (!raw || typeof raw !== 'object') return;
    const date = plannerDateKey(raw.date) || plannerDateKey(fallbackDate);
    const mapped = mapPlannerItemFromApi({ ...raw, date });
    if (!mapped) return;
    const key = plannerDateKey(mapped.date) || date;
    if (!key) return;
    mapped.date = key;
    if (!itemsByDate[key]) itemsByDate[key] = [];
    const id = mapped.plannerItemId || mapped.id;
    if (itemsByDate[key].some((item) => (item.plannerItemId || item.id) === id)) return;
    itemsByDate[key].push(mapped);
  };

  const days = source.days;
  if (Array.isArray(days)) {
    days.forEach((day) => {
      const dayDate = plannerDateKey(day?.date);
      rawItemsFromDay(day).forEach((item) => addRaw(item, dayDate));
    });
  } else if (days && typeof days === 'object') {
    Object.entries(days).forEach(([dateKey, dayItems]) => {
      rawItemsFromDay(dayItems).forEach((item) => addRaw(item, dateKey));
    });
  }

  (source.items || []).forEach((item) => addRaw(item, source.date));

  const items = Object.values(itemsByDate).flat();

  return {
    viewType,
    date: plannerDateKey(source.date),
    startDate: plannerDateKey(source.startDate) || plannerDateKey(source.date),
    endDate: plannerDateKey(source.endDate) || plannerDateKey(source.date),
    items,
    itemsByDate,
    days: itemsByDate,
  };
}

/** POST /planner/ai/suggest response → date-keyed plans map for board preview */
export function suggestionResponseToPlans(suggestPayload, sourceItems = [], fallbackDateKey) {
  const board = suggestPayload?.board;
  if (board && !Array.isArray(board) && typeof board === 'object' && (board.items || board.days)) {
    return boardToPlansMap(mapPlannerBoardFromApi(board), fallbackDateKey);
  }
  if (Array.isArray(board)) {
    const items = mapPlannerItemsFromApi(board);
    const plans = {};
    items.forEach((item) => {
      const key = item.date || fallbackDateKey;
      if (!key) return;
      if (!plans[key]) plans[key] = [];
      plans[key].push(item);
    });
    return plans;
  }

  const placements = suggestPayload?.placements;
  if (Array.isArray(placements) && placements.length) {
    const sourceByKey = new Map();
    (sourceItems || []).forEach((item) => {
      if (item?.taskId) sourceByKey.set(`task:${item.taskId}`, item);
      if (item?.habitId) sourceByKey.set(`habit:${item.habitId}`, item);
      if (item?.id) sourceByKey.set(`id:${item.id}`, item);
    });

    const plans = {};
    placements.forEach((placement) => {
      if (!placement?.taskId && !placement?.habitId) return;
      const lookupKey = placement.taskId
        ? `task:${placement.taskId}`
        : placement.habitId
          ? `habit:${placement.habitId}`
          : null;
      const existing = lookupKey ? sourceByKey.get(lookupKey) : null;
      const merged = {
        ...(existing || {}),
        ...placement,
        id: placement.plannerItemId || existing?.plannerItemId || existing?.id || placement.taskId || placement.habitId,
        title: existing?.title || placement.title,
        aiScheduled: true,
        source: 'ai',
      };
      const mapped = mapPlannerItemFromApi(merged);
      if (!mapped) return;
      const dateKey = mapped.date || fallbackDateKey;
      if (!dateKey) return;
      if (!plans[dateKey]) plans[dateKey] = [];
      plans[dateKey].push(mapped);
    });
    return plans;
  }

  return { [fallbackDateKey]: [] };
}

/** Flatten board + available pool for suggest preview merge */
export function buildPlannerSuggestSourceItems(plans = {}, available = {}) {
  const fromBoard = Object.values(plans || {}).flat();
  const fromTasks = (available?.tasks || []).map((task) => ({
    kind: 'task',
    taskId: task.id,
    id: task.id,
    title: task.title,
    priority: task.priority,
    status: task.status,
    category: task.category,
    estimatedMinutes: task.estimatedMinutes,
    goalTitle: task.goalTitle,
  }));
  const fromHabits = (available?.habits || []).map((habit) => ({
    kind: 'habit',
    habitId: habit.id,
    id: habit.id,
    title: habit.name || habit.title,
    category: habit.category,
    goalTitle: habit.goalTitle,
  }));
  return [...fromBoard, ...fromTasks, ...fromHabits];
}

/** Convert date-keyed UI plans map from board mapping */
export function boardToPlansMap(mappedBoard, fallbackDateKey) {
  const plans = {};
  const byDate = mappedBoard?.itemsByDate || {};
  Object.keys(byDate).forEach((key) => {
    plans[key] = byDate[key];
  });
  if (Object.keys(plans).length === 0 && fallbackDateKey) {
    plans[fallbackDateKey] = mappedBoard?.items || [];
  }
  return plans;
}

export function mapAvailableFromApi(envelope) {
  const body = envelope || {};
  return {
    date: body.date || null,
    tasks: Array.isArray(body.tasks) ? body.tasks : [],
    habits: Array.isArray(body.habits) ? body.habits : [],
  };
}

export function createPlanPromptForView(viewMode) {
  if (viewMode === 'Weekly') {
    return 'Spread my tasks and habits across the week without overload';
  }
  if (viewMode === 'Monthly') {
    return 'Create a monthly schedule from my existing tasks and habits. Keep evenings lighter.';
  }
  return 'Plan my day using my existing tasks and habits. Balance work and health.';
}

export function formatIsoDate(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return null;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function plannerChatList(envelope) {
  if (Array.isArray(envelope)) return envelope;
  if (Array.isArray(envelope?.messages)) return envelope.messages;
  if (Array.isArray(envelope?.chat)) return envelope.chat;
  if (Array.isArray(envelope?.history)) return envelope.history;
  if (Array.isArray(envelope?.items)) return envelope.items;
  if (Array.isArray(envelope?.data?.messages)) return envelope.data.messages;
  if (Array.isArray(envelope?.data?.chat)) return envelope.data.chat;
  if (Array.isArray(envelope?.data?.history)) return envelope.data.history;
  if (Array.isArray(envelope?.data)) return envelope.data;
  return [];
}

function plannerChatTimestamp(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  const dayPart = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
  const timePart = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
  return `${dayPart} • ${timePart}`;
}

function plannerChatResolved(status) {
  return ['ACCEPTED', 'APPLIED', 'COMPLETED', 'DONE', 'DISMISSED', 'REJECTED', 'CANCELLED', 'CANCELED'].includes(
    status
  );
}

/**
 * GET /planner/ai/chat → existing AI Assistant bubbles.
 * Pending suggestions keep Accept plan / Dismiss.
 */
export function mapPlannerChatToMessages(envelope) {
  const list = plannerChatList(envelope);
  const sorted = [...list].sort((a, b) => {
    const ta = new Date(a?.createdAt || a?.timestamp || a?.sentAt || 0).getTime();
    const tb = new Date(b?.createdAt || b?.timestamp || b?.sentAt || 0).getTime();
    return ta - tb;
  });

  const messages = [];
  let pending = null;

  sorted.forEach((item, index) => {
    if (!item || typeof item !== 'object') return;
    const role = String(item.role || item.sender || item.from || item.author || '').toLowerCase();
    const sender = role === 'user' || role === 'human' ? 'user' : 'ai';
    const text = String(item.text || item.message || item.content || item.body || '').trim();
    if (!text) return;

    const suggestionId = item.suggestionId || item.suggestion?.id || item.suggestion?.suggestionId || null;
    const status = String(item.status || item.suggestionStatus || '').toUpperCase();
    const resolved = plannerChatResolved(status) || item.isApplied === true || item.isDismissed === true;
    const id = String(item.id || item.messageId || `planner-chat-${index}`);

    const message = {
      id,
      sender,
      text,
      timestamp: plannerChatTimestamp(item.createdAt || item.timestamp || item.sentAt),
      suggestionId: suggestionId || undefined,
      resolved: resolved || undefined,
    };

    const canAct = sender === 'ai' && suggestionId && !resolved;
    if (canAct) {
      const transactionId = `history_${suggestionId}`;
      message.actions = [
        { label: 'Accept plan', actionId: `accept_change:${transactionId}` },
        { label: 'Dismiss', actionId: `dismiss_change:${transactionId}` },
      ];
      pending = {
        id: transactionId,
        suggestionId,
        source: 'planner',
        label: 'Suggested plan',
        beforePlans: {},
        beforeAccepted: false,
        afterPlans: null,
        afterAccepted: true,
        type: 'ai_suggest',
      };
    }

    messages.push(message);
  });

  if (pending) {
    messages.forEach((message) => {
      if (message.suggestionId && message.suggestionId !== pending.suggestionId && message.actions) {
        message.resolved = true;
        message.actions = undefined;
      }
    });
  }

  return { messages, pending };
}
