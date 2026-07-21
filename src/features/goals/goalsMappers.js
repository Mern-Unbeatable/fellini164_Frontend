/** Map Goals API payloads ↔ existing UI fields only (no extra API fields on cards). */

const PRIORITY_FROM_API = {
  URGENT: 'URGENT',
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
};

const STATUS_FROM_API = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  ARCHIVED: 'completed',
};

const STATUS_TO_API = {
  active: 'ACTIVE',
  paused: 'PAUSED',
  completed: 'COMPLETED',
};

export function categoryToApi(category) {
  return String(category || 'Career').toUpperCase();
}

export function categoryFromApi(category) {
  if (!category) return 'Career';
  const normalized = String(category).toLowerCase();
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

export function priorityFromApi(value) {
  if (typeof value === 'string') {
    const upper = value.toUpperCase();
    if (PRIORITY_FROM_API[upper]) return upper;
  }
  return 'MEDIUM';
}

export function priorityToApi(value) {
  return priorityFromApi(value);
}

export function statusFromApi(status) {
  if (!status) return 'active';
  return STATUS_FROM_API[String(status).toUpperCase()] || 'active';
}

export function statusToApi(status) {
  return STATUS_TO_API[status] || 'ACTIVE';
}

function formatDisplayDate(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatRelativeDue(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;

  const formatted = formatDisplayDate(iso);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const diffDays = Math.round((target - today) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return { due: 'Today', dueDetail: `${formatted} • Today` };
  if (diffDays === 1) return { due: 'Tomorrow', dueDetail: `${formatted} • Tomorrow` };
  if (diffDays > 1 && diffDays <= 14) {
    return { due: `In ${diffDays} days`, dueDetail: `${formatted} • In ${diffDays} days` };
  }
  return { due: formatted, dueDetail: formatted };
}

export function parseDueToIso(dueDate, displayDue) {
  if (dueDate && /^\d{4}-\d{2}-\d{2}$/.test(String(dueDate))) return dueDate;
  if (!displayDue || displayDue === 'Today') {
    return new Date().toISOString().slice(0, 10);
  }
  const parsed = new Date(displayDue);
  if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);
  return undefined;
}

function readCount(apiGoal, keys, arrayKey) {
  const countField = arrayKey === 'linkedTasks' ? 'tasks' : arrayKey === 'linkedHabits' ? 'habits' : null;
  if (countField && typeof apiGoal?._count?.[countField] === 'number') {
    return apiGoal._count[countField];
  }
  for (const key of keys) {
    if (typeof apiGoal?.[key] === 'number') return apiGoal[key];
  }
  if (Array.isArray(apiGoal?.[arrayKey])) return apiGoal[arrayKey].length;
  if (Array.isArray(apiGoal?.tasks) && arrayKey === 'linkedTasks') return apiGoal.tasks.length;
  if (Array.isArray(apiGoal?.habits) && arrayKey === 'linkedHabits') return apiGoal.habits.length;
  return 0;
}

const DATE_FILTER_TO_API = {
  Today: 'today',
  Tomorrow: 'tomorrow',
  'This week': 'this_week',
  'This month': 'this_month',
  Overdue: 'overdue',
};

const PROGRESS_RANGES = {
  '0-25%': { minProgress: 0, maxProgress: 25 },
  '26-50%': { minProgress: 26, maxProgress: 50 },
  '51-75%': { minProgress: 51, maxProgress: 75 },
  '76-100%': { minProgress: 76, maxProgress: 100 },
};

const STATUS_FILTER_TO_API = {
  Active: 'ACTIVE',
  Paused: 'PAUSED',
  Completed: 'COMPLETED',
};

/** Map Goals Board UI filters → GET /goals query params. */
export function buildGoalsQueryParams({ filters = {}, search = '', page = 1, limit = 50 } = {}) {
  const params = { page, limit };

  if (filters.Status && filters.Status !== 'All Statuses') {
    const status = STATUS_FILTER_TO_API[filters.Status];
    if (status) params.status = status;
  }

  if (filters.Priority && filters.Priority !== 'All Priorities') {
    params.priorityLevel = String(filters.Priority).toUpperCase();
  }

  if (filters.Category && filters.Category !== 'All Categories') {
    params.category = categoryToApi(filters.Category);
  }

  if (filters.Source && filters.Source !== 'All Sources') {
    params.source = filters.Source === 'Created by AI' ? 'AI' : 'MANUAL';
  }

  if (filters.Progress && filters.Progress !== 'Any' && PROGRESS_RANGES[filters.Progress]) {
    Object.assign(params, PROGRESS_RANGES[filters.Progress]);
  }

  if (filters.Date && filters.Date !== 'All Dates' && DATE_FILTER_TO_API[filters.Date]) {
    params.dueFilter = DATE_FILTER_TO_API[filters.Date];
  }

  const q = String(search || '').trim();
  if (q) params.search = q;

  return params;
}

/** Parse GET /goals envelope into items + summary + pagination. */
export function parseGoalsListResponse(envelope) {
  if (!envelope) {
    return { items: [], summary: null, pagination: null, count: 0 };
  }
  if (Array.isArray(envelope)) {
    return {
      items: envelope,
      summary: null,
      pagination: null,
      count: envelope.length,
    };
  }
  const items = normalizeGoalsList(envelope);
  return {
    items,
    summary: envelope.summary ?? null,
    pagination: envelope.pagination ?? null,
    count: envelope.count ?? items.length,
  };
}

export function mapGoalFromApi(apiGoal, sourceOverride) {
  if (!apiGoal) return null;

  const targetDate = apiGoal.targetDate || apiGoal.target_date || apiGoal.dueDate;
  const dueFields = targetDate ? formatRelativeDue(targetDate) : { due: null, dueDetail: null };

  const completedAt = apiGoal.completedAt || apiGoal.completed_at;
  const uiStatus = statusFromApi(apiGoal.status);

  let targetDateIso;
  if (targetDate) {
    const d = new Date(targetDate);
    if (!Number.isNaN(d.getTime())) targetDateIso = d.toISOString().slice(0, 10);
  }

  return {
    id: apiGoal.id,
    priority: priorityFromApi(apiGoal.priorityLevel || apiGoal.priority),
    title: apiGoal.title || '',
    description: apiGoal.description || '',
    category: categoryFromApi(apiGoal.category),
    tasks: readCount(apiGoal, ['taskCount', 'tasksCount', 'linkedTaskCount'], 'linkedTasks'),
    habits: readCount(apiGoal, ['habitCount', 'habitsCount', 'linkedHabitCount'], 'linkedHabits'),
    due: dueFields.due,
    dueDetail: dueFields.dueDetail,
    targetDate: targetDateIso,
    progress:
      uiStatus === 'completed'
        ? (apiGoal.progress ?? apiGoal.progressPercent ?? 100)
        : (apiGoal.progress ?? apiGoal.progressPercent ?? 0),
    status: uiStatus,
    source:
      sourceOverride ||
      (apiGoal.createdByAi || String(apiGoal.source || '').toUpperCase() === 'AI' ? 'ai' : 'manual'),
    completedDate:
      uiStatus === 'completed' && completedAt
        ? formatDisplayDate(completedAt)
        : undefined,
  };
}

export function mapCreatePayload(formData) {
  const payload = {
    title: formData.title,
    description: formData.description || '',
    category: categoryToApi(formData.category),
    priorityLevel: priorityToApi(formData.priority),
    isMainFocus: false,
    source:
      formData.source === 'ai' || String(formData.source || '').toUpperCase() === 'AI'
        ? 'AI'
        : 'MANUAL',
  };

  const targetDate = parseDueToIso(formData.dueDate, formData.due);
  if (targetDate) payload.targetDate = targetDate;

  // Only real UUIDs — backend rejects placeholders like "{{taskId}}"
  const taskIds = (formData.taskIds || formData.linkedTasks || []).filter(isUuid);
  const habitIds = (formData.habitIds || formData.linkedHabits || []).filter(isUuid);
  if (taskIds.length) payload.taskIds = taskIds;
  if (habitIds.length) payload.habitIds = habitIds;

  return payload;
}

/**
 * Map POST /goals/ai/generate `data` → New Goal AI preview card shape.
 */
export function mapAiGeneratedGoalForPreview(apiGoal) {
  const mapped = mapGoalFromApi(apiGoal, 'ai');
  if (!mapped) return null;

  return {
    id: mapped.id,
    priority: mapped.priority,
    title: mapped.title,
    description: mapped.description,
    category: mapped.category,
    due: mapped.due || mapped.dueDetail || mapped.targetDate || '',
    dueDate: mapped.targetDate,
    progress: mapped.progress ?? 0,
    source: 'ai',
  };
}

export function mapUpdatePayload(formData) {
  const payload = mapCreatePayload(formData);
  delete payload.isMainFocus;
  return payload;
}

export function normalizeGoalsList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.goals)) return data.goals;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

export function normalizeBoardSummary(data, goals = []) {
  if (data && typeof data.active === 'number') {
    return {
      active: data.active,
      paused: data.paused ?? 0,
      completedThisMonth: data.completedThisMonth ?? data.completedThisMonthCount ?? 0,
    };
  }

  return {
    active: goals.filter((g) => g.status === 'active').length,
    paused: goals.filter((g) => g.status === 'paused').length,
    completedThisMonth: goals.filter((g) => g.status === 'completed').length,
  };
}

function mapTaskStatus(status) {
  const raw = String(status || 'to do');
  const lower = raw.toLowerCase();
  const uppercaseStatuses = ['to do', 'todo'];
  return {
    status: raw,
    statusUppercase: uppercaseStatuses.includes(lower),
  };
}

export function mapLinkedTaskFromApi(task) {
  if (!task) return null;
  const statusFields = mapTaskStatus(task.status);
  const dueRaw = task.dueDate || task.due_date || task.due;

  return {
    id: task.id,
    priority: priorityFromApi(task.priorityLevel || task.priority),
    source: task.source === 'ai' || task.createdByAi ? 'ai' : undefined,
    title: task.title || '',
    description: task.description || '',
    tags: Array.isArray(task.tags)
      ? task.tags
      : task.category
        ? [{ label: categoryFromApi(task.category) }]
        : [],
    due: dueRaw ? formatDisplayDate(dueRaw) || String(dueRaw) : undefined,
    overdueDays: task.overdueDays,
    overdueLabel: task.overdueLabel,
    overdueOrange: task.overdueOrange,
    completedLabel: task.completedLabel,
    faded: ['done', 'completed'].includes(String(task.status || '').toLowerCase()),
    ...statusFields,
  };
}

export function mapLinkedHabitFromApi(habit) {
  if (!habit) return null;

  return {
    id: habit.id,
    title: habit.title || habit.name || '',
    description: habit.description || '',
    tags: Array.isArray(habit.tags) ? habit.tags : [],
    days: Array.isArray(habit.days) ? habit.days : [],
    todayProgress: habit.todayProgress || { done: 0, total: 0 },
  };
}

export function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    String(value)
  );
}

/** Normalize GET /tasks or /habits list → Linked multi-select options (UUID ids only). */
export function normalizeLinkPickerOptions(list) {
  let arr = [];
  if (Array.isArray(list)) arr = list;
  else if (Array.isArray(list?.data)) arr = list.data;
  else if (Array.isArray(list?.items)) arr = list.items;
  else if (Array.isArray(list?.tasks)) arr = list.tasks;
  else if (Array.isArray(list?.habits)) arr = list.habits;

  return arr
    .map((item) => {
      if (!item?.id || !isUuid(item.id)) return null;
      const statusRaw = String(item.status || '').toUpperCase();
      let status;
      if (statusRaw === 'PAUSED') status = 'paused';
      if (statusRaw === 'COMPLETED' || statusRaw === 'DONE') status = 'completed';
      return {
        id: item.id,
        label: item.title || item.name || 'Untitled',
        status,
        aiSuggested:
          String(item.source || '').toUpperCase() === 'AI' || Boolean(item.aiSuggested),
      };
    })
    .filter(Boolean);
}

/** Prefer AI-suggested items first (Rule 4). */
export function orderedLinkPickerOptions(options) {
  return [...(options || [])].sort(
    (a, b) => Number(Boolean(b.aiSuggested)) - Number(Boolean(a.aiSuggested))
  );
}
