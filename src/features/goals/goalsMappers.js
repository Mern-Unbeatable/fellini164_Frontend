/** Map Goals API payloads ↔ existing UI fields only (no extra API fields on cards). */

import { buildWeekDayStates, targetDaysToApi } from '../habits/habitsMappers';

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

/** PATCH /goals/:id body — partial fields only (no create-only keys). */
export function mapUpdatePayload(formData) {
  const payload = {};
  if (formData.title != null && String(formData.title).trim() !== '') {
    payload.title = String(formData.title).trim();
  }
  if (formData.description != null) payload.description = formData.description;
  if (formData.category) payload.category = categoryToApi(formData.category);
  if (formData.priority) payload.priorityLevel = priorityToApi(formData.priority);
  const targetDate = parseDueToIso(formData.dueDate, formData.due);
  if (targetDate) payload.targetDate = targetDate;
  if (formData.status) {
    const status = statusToApi(formData.status);
    if (status) payload.status = status;
  }
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
  const lower = raw.toLowerCase().replace(/_/g, ' ');
  const display =
    lower === 'todo' || lower === 'to do'
      ? 'TODO'
      : lower === 'in progress' || lower === 'in_progress'
        ? 'IN_PROGRESS'
        : lower === 'completed' || lower === 'done'
          ? 'COMPLETED'
          : raw;
  return {
    status: display,
    statusUppercase: true,
  };
}

/** Map TaskFormModal fields → PATCH /tasks/:id body (Postman contract). */
export function mapTaskUpdatePayload(form) {
  const statusMap = {
    'to do': 'TODO',
    todo: 'TODO',
    'in progress': 'IN_PROGRESS',
    done: 'COMPLETED',
    completed: 'COMPLETED',
  };
  const statusKey = String(form.status || '').toLowerCase();
  const payload = {};

  if (form.title != null) payload.title = form.title;
  if (form.description != null) payload.description = form.description;
  if (form.priority) payload.priority = String(form.priority).toUpperCase();
  if (form.status) payload.status = statusMap[statusKey] || String(form.status).toUpperCase().replace(/\s+/g, '_');
  if (form.category) payload.category = categoryToApi(form.category);
  if (form.dueDate) payload.dueDate = form.dueDate;
  if (form.estMinutes !== '' && form.estMinutes != null) {
    const mins = Number(form.estMinutes);
    if (!Number.isNaN(mins)) payload.estimatedMinutes = mins;
  }
  return payload;
}

export function mapLinkedTaskFromApi(task) {
  if (!task) return null;
  const statusFields = mapTaskStatus(task.status);
  const dueRaw = task.dueDate || task.due_date || task.due;
  const sourceRaw = String(task.source || '').toUpperCase();
  const isAi =
    Boolean(task.aiGenerated) ||
    Boolean(task.createdByAi) ||
    sourceRaw === 'AI' ||
    sourceRaw === 'AI_GENERATED';
  const isDone = ['done', 'completed'].includes(String(task.status || '').toLowerCase());
  const categoryLabel = task.category ? categoryFromApi(task.category) : null;
  const categoryKey = categoryLabel?.toLowerCase();
  const extraTags = Array.isArray(task.tags)
    ? task.tags
        .map((t) => (typeof t === 'string' ? { label: t } : t))
        .filter((t) => {
          const label = String(t?.label || '').toLowerCase();
          return label && label !== 'focus' && label !== categoryKey;
        })
    : [];
  const tags = [
    ...(categoryLabel ? [{ label: categoryLabel }] : []),
    ...extraTags,
  ];

  return {
    id: task.id,
    priority: priorityFromApi(task.priorityLevel || task.priority),
    source: isAi ? 'ai' : undefined,
    title: task.title || '',
    description: task.description || '',
    tags,
    category: categoryLabel || undefined,
    estimatedMinutes: task.estimatedMinutes ?? null,
    due: dueRaw ? formatDisplayDate(dueRaw) || String(dueRaw) : undefined,
    overdueDays: task.overdueDays,
    overdueLabel: task.overdueLabel,
    overdueOrange: task.overdueOrange,
    completedLabel: isDone
      ? task.completedLabel ||
        (task.completedAt
          ? `Completed ${formatDisplayDate(task.completedAt) || ''}`.trim()
          : 'Completed')
      : task.completedLabel,
    faded: isDone,
    ...statusFields,
  };
}

/** Map POST /tasks/ai/generate `task` → Spark AI preview / linked card. */
export function mapAiGeneratedTaskForPreview(apiTask) {
  const mapped = mapLinkedTaskFromApi(apiTask);
  if (!mapped?.id) return null;
  return {
    ...mapped,
    source: 'ai',
    alreadyPersisted: true,
  };
}

/** Convert NewHabitsModal 12h time → API `reminderTime` `HH:mm` (24h). */
export function reminderTimeToApi(hour, minute, period) {
  let h = Number(hour);
  if (Number.isNaN(h)) h = 8;
  const m = String(minute ?? '00').padStart(2, '0');
  const p = String(period || 'AM').toUpperCase();
  if (p === 'AM') {
    if (h === 12) h = 0;
  } else if (h !== 12) {
    h += 12;
  }
  return `${String(h).padStart(2, '0')}:${m}`;
}

/** Map NewHabitsModal fields → PATCH /habits/:id body (Postman contract). */
export function mapHabitUpdatePayload(form, { goalId } = {}) {
  const payload = {};
  const name = form.title || form.name;
  if (name != null && name !== '') {
    payload.name = name;
    payload.title = name;
  }
  if (form.description != null) payload.description = form.description;
  if (form.category) payload.category = categoryToApi(form.category);
  if (form.difficulty) payload.difficulty = String(form.difficulty).toUpperCase();
  else payload.difficulty = 'MEDIUM';
  // Persist Mon–Sun schedule (Sat/Sun add must survive refresh).
  if (Array.isArray(form.targetDays)) {
    payload.targetDays = targetDaysToApi(form.targetDays);
  }
  if (form.hour != null || form.reminderTime) {
    payload.reminderTime =
      form.reminderTime || reminderTimeToApi(form.hour, form.minute, form.period);
  }
  if (goalId && isUuid(goalId)) payload.goalId = goalId;
  return payload;
}

export function mapLinkedHabitFromApi(habit) {
  if (!habit) return null;

  const sourceRaw = String(habit.source || '').toUpperCase();
  const isAi =
    Boolean(habit.aiSuggested) ||
    Boolean(habit.aiGenerated) ||
    sourceRaw === 'AI' ||
    sourceRaw === 'AI_GENERATED';

  let days = Array.isArray(habit.days) ? habit.days : [];
  // Prefer Habits-board week builder when API sends schedule / completions.
  if (
    Array.isArray(habit.targetDays) ||
    Array.isArray(habit.completions) ||
    habit.completedToday === true
  ) {
    days = buildWeekDayStates(habit);
  } else if (!days.length) {
    days = Array(7).fill('empty');
  }

  return {
    id: habit.id,
    title: habit.title || habit.name || '',
    description: habit.description || '',
    tags: Array.isArray(habit.tags) && habit.tags.length
      ? habit.tags
      : [
          habit.category ? { label: categoryFromApi(habit.category) } : null,
          habit.reminderTime
            ? {
                label: (() => {
                  const m = String(habit.reminderTime).match(/^(\d{1,2}):(\d{2})$/);
                  if (!m) return habit.reminderTime;
                  let h = Number(m[1]);
                  const min = m[2];
                  const period = h >= 12 ? 'PM' : 'AM';
                  h = h % 12;
                  if (h === 0) h = 12;
                  return `${h}:${min} ${period}`;
                })(),
              }
            : null,
        ].filter(Boolean),
    days,
    targetDays: Array.isArray(habit.targetDays) ? habit.targetDays : [],
    completions: Array.isArray(habit.completions) ? habit.completions : [],
    completedToday: Boolean(habit.completedToday),
    todayProgress: habit.todayProgress || {
      done: 0,
      total: habit.targetTimesPerDay || 1,
    },
    stats: [{ label: habit.frequency ? String(habit.frequency).toLowerCase() : 'Today' }],
    source: isAi ? 'ai' : undefined,
    status:
      habit.status === 'PAUSED' ||
      habit.status === 'paused' ||
      habit.isActive === false
        ? 'paused'
        : undefined,
  };
}

/** Map POST /habits/ai/generate `habit` → Spark AI preview / linked card. */
export function mapAiGeneratedHabitForPreview(apiHabit) {
  const mapped = mapLinkedHabitFromApi(apiHabit);
  if (!mapped?.id) return null;
  return {
    ...mapped,
    source: 'ai',
    alreadyPersisted: true,
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
  else if (Array.isArray(list?.tasks)) arr = list.tasks;
  else if (Array.isArray(list?.habits)) arr = list.habits;
  else if (Array.isArray(list?.data)) arr = list.data;
  else if (Array.isArray(list?.items)) arr = list.items;

  return arr
    .map((item) => {
      if (!item?.id || !isUuid(item.id)) return null;
      const statusRaw = String(item.status || '').toUpperCase();
      let status;
      // Goals habit-style
      if (statusRaw === 'PAUSED') status = 'paused';
      // Tasks API: TODO / IN_PROGRESS / COMPLETED / CANCELED / SKIPPED
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

/** Format AI suggest / history payload for chat bubble text. */
export function formatGoalSuggestionBody(data) {
  const lines = [data?.message || data?.assistantMessage || 'Here is what I suggest.'];
  const goal = data?.proposedGoal;
  if (goal?.title || goal?.description) {
    lines.push('');
    lines.push('Proposed goal updates:');
    if (goal.title) lines.push(`• Title: ${goal.title}`);
    if (goal.description) lines.push(`• Description: ${goal.description}`);
    if (goal.priorityLevel) lines.push(`• Priority: ${goal.priorityLevel}`);
    if (goal.targetDate) lines.push(`• Target: ${goal.targetDate}`);
  }
  const tasks = Array.isArray(data?.proposedTasks) ? data.proposedTasks : [];
  if (tasks.length) {
    lines.push('');
    lines.push(`Proposed tasks (${tasks.length}):`);
    tasks.forEach((t, i) => {
      lines.push(`${i + 1}. ${t.title || t.name || 'Untitled task'}`);
    });
  }
  const habits = Array.isArray(data?.proposedHabits) ? data.proposedHabits : [];
  if (habits.length) {
    lines.push('');
    lines.push(`Proposed habits (${habits.length}):`);
    habits.forEach((h, i) => {
      lines.push(`${i + 1}. ${h.name || h.title || 'Untitled habit'}`);
    });
  }
  return lines.join('\n');
}

function suggestionStatus(item) {
  return String(item?.status || item?.state || 'PENDING').toUpperCase();
}

function isPendingSuggestion(status) {
  return ['PENDING', 'OPEN', 'ACTIVE', 'AWAITING', 'AWAITING_CONFIRMATION'].includes(status);
}

function isAcceptedSuggestion(status) {
  return ['ACCEPTED', 'APPLIED', 'COMPLETED', 'DONE'].includes(status);
}

function isDismissedSuggestion(status) {
  return ['DISMISSED', 'CANCELLED', 'CANCELED', 'REJECTED'].includes(status);
}

/**
 * Map GET /goals/:id/ai/suggestions → AI Assistant chat messages
 * (user + assistant bubbles, Yes/No for PENDING, Undo for latest ACCEPTED).
 */
export function mapGoalAiSuggestionsToMessages(list) {
  const items = Array.isArray(list) ? list : [];
  const sorted = [...items].sort((a, b) => {
    const ta = new Date(a.createdAt || a.updatedAt || 0).getTime();
    const tb = new Date(b.createdAt || b.updatedAt || 0).getTime();
    return ta - tb;
  });

  const messages = [];
  let lastAcceptedDoneId = null;

  sorted.forEach((item, index) => {
    const suggestionId = item.suggestionId || item.id;
    if (!suggestionId) return;
    const status = suggestionStatus(item);
    const pending = isPendingSuggestion(status);
    const accepted = isAcceptedSuggestion(status);
    const dismissed = isDismissedSuggestion(status);

    const userText =
      item.userMessage ||
      item.prompt ||
      item.requestMessage ||
      item.inputMessage ||
      item.request?.message;
    if (userText) {
      messages.push({
        id: `u-${suggestionId}`,
        role: 'user',
        text: String(userText),
      });
    }

    const suggestionPayload = {
      ...item,
      id: suggestionId,
      suggestionId,
      message: item.assistantMessage || item.responseMessage || item.message,
      proposedGoal:
        item.proposedGoal ||
        item.proposal?.goal ||
        item.payload?.proposedGoal ||
        item.data?.proposedGoal ||
        null,
      proposedTasks: Array.isArray(item.proposedTasks)
        ? item.proposedTasks
        : Array.isArray(item.proposal?.tasks)
          ? item.proposal.tasks
          : Array.isArray(item.payload?.proposedTasks)
            ? item.payload.proposedTasks
            : [],
      proposedHabits: Array.isArray(item.proposedHabits)
        ? item.proposedHabits
        : Array.isArray(item.proposal?.habits)
          ? item.proposal.habits
          : Array.isArray(item.payload?.proposedHabits)
            ? item.payload.proposedHabits
            : [],
      action: item.action,
    };

    // Keep Yes/No for any PENDING suggestion (proposals may be nested; pills still needed).
    messages.push({
      id: `a-${suggestionId}`,
      role: 'assistant',
      text: formatGoalSuggestionBody(suggestionPayload),
      suggestion: pending ? suggestionPayload : null,
      suggestionId,
      dismissed: dismissed || (!pending && !accepted),
      action: item.action,
      fromHistory: true,
    });

    if (accepted) {
      // Figma: user confirm bubble may be stored; otherwise synthesize apply/done
      if (!userText || String(userText).toLowerCase() !== 'yes, apply') {
        messages.push({
          id: `u-apply-${suggestionId}`,
          role: 'user',
          text: 'Yes, apply',
        });
      }
      const doneId = `done-${suggestionId}`;
      messages.push({
        id: doneId,
        role: 'assistant',
        text: item.applyMessage || 'Done. The goal has been updated.',
        canUndo: false,
        suggestionId,
        fromHistory: true,
      });
      lastAcceptedDoneId = doneId;
    } else if (dismissed) {
      messages.push({
        id: `u-cancel-${suggestionId}-${index}`,
        role: 'user',
        text: 'No, cancel',
      });
      messages.push({
        id: `c-${suggestionId}`,
        role: 'assistant',
        text: 'Okay, I discarded that suggestion.',
        fromHistory: true,
      });
    }
  });

  if (lastAcceptedDoneId) {
    return messages.map((m) =>
      m.id === lastAcceptedDoneId ? { ...m, canUndo: true } : m,
    );
  }
  return messages;
}

/**
 * Map GET /onboarding/suggestions item → existing ghost-card fields only.
 * UI: priority, title, description, category, tasks, habits, due, message.
 */
export function mapOnboardingGoalSuggestion(raw) {
  if (!raw || typeof raw !== 'object') return null;

  const proposed = raw.proposedGoal && typeof raw.proposedGoal === 'object' ? raw.proposedGoal : {};
  const suggestionId = raw.suggestionId || raw.id;
  if (!suggestionId) return null;

  const type = String(raw.type || '').toUpperCase();
  if (type && type !== 'GOAL') return null;

  const status = String(raw.status || '').toLowerCase();
  if (status && status !== 'pending') return null;

  const dueFields = proposed.targetDate ? formatRelativeDue(proposed.targetDate) : null;

  return {
    id: suggestionId,
    suggestionId,
    priority: priorityFromApi(proposed.priorityLevel),
    title: proposed.title || raw.title || '',
    description: proposed.description || '',
    category: categoryFromApi(proposed.category),
    tasks: Array.isArray(raw.proposedTasks) ? raw.proposedTasks.length : 0,
    habits: Array.isArray(raw.proposedHabits) ? raw.proposedHabits.length : 0,
    due: dueFields?.due || '',
    message: raw.message || 'AI suggested based on your profile',
  };
}
