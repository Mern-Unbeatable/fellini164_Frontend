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

export const AI_ACTION_TO_API = {
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
    kind === 'habit' && progress
      ? { done: progress.completed ?? 0, total: progress.total ?? 1 }
      : null;

  return {
    id: apiItem.id || apiItem.taskId || apiItem.habitId,
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

/** Board envelope → { viewType, date, startDate, endDate, itemsByDate, items } */
export function mapPlannerBoardFromApi(board) {
  if (!board) {
    return {
      viewType: 'DAILY',
      date: null,
      startDate: null,
      endDate: null,
      items: [],
      itemsByDate: {},
      days: {},
    };
  }

  const viewType = String(board.viewType || 'DAILY').toUpperCase();
  const flatItems = mapPlannerItemsFromApi(board.items || []);

  const itemsByDate = {};
  if (board.days && typeof board.days === 'object') {
    Object.entries(board.days).forEach(([dateKey, dayItems]) => {
      itemsByDate[dateKey] = mapPlannerItemsFromApi(dayItems);
    });
  }

  flatItems.forEach((item) => {
    if (!item.date) return;
    if (!itemsByDate[item.date]) itemsByDate[item.date] = [];
    if (!itemsByDate[item.date].some((x) => x.id === item.id)) {
      itemsByDate[item.date].push(item);
    }
  });

  return {
    viewType,
    date: board.date || null,
    startDate: board.startDate || board.date || null,
    endDate: board.endDate || board.date || null,
    items: flatItems,
    itemsByDate,
    days: itemsByDate,
  };
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
