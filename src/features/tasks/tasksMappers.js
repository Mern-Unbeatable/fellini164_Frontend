/** Map Tasks API ↔ Tasks Board UI (columns: todo / inProgress / done). */

const STATUS_UI_FROM_API = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Done',
  DONE: 'Done',
  CANCELED: 'To Do',
  CANCELLED: 'To Do',
  SKIPPED: 'To Do',
};

const STATUS_API_FROM_UI = {
  'To Do': 'TODO',
  'In Progress': 'IN_PROGRESS',
  Done: 'COMPLETED',
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
};

const COLUMN_FROM_API = {
  TODO: 'todo',
  IN_PROGRESS: 'inProgress',
  COMPLETED: 'done',
  DONE: 'done',
  CANCELED: 'todo',
  CANCELLED: 'todo',
  SKIPPED: 'todo',
};

const STATUS_FILTER_TO_API = {
  'To Do': 'TODO',
  'In Progress': 'IN_PROGRESS',
  Done: 'COMPLETED',
};

const PRIORITY_FILTER_TO_API = {
  Urgent: 'URGENT',
  High: 'HIGH',
  Medium: 'MEDIUM',
  Low: 'LOW',
};

const DATE_FILTER_TO_API = {
  Today: 'today',
  Tomorrow: 'tomorrow',
  'This week': 'this_week',
  'This month': 'this_month',
  Overdue: 'overdue',
};

export function categoryToApi(category) {
  return String(category || 'Career').trim().toUpperCase();
}

export function categoryFromApi(category) {
  if (!category) return 'Career';
  const normalized = String(category).toLowerCase();
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

export function priorityFromApi(value) {
  const upper = String(value || 'MEDIUM').toUpperCase();
  if (['URGENT', 'HIGH', 'MEDIUM', 'LOW'].includes(upper)) return upper;
  return 'MEDIUM';
}

export function priorityToApi(value) {
  return priorityFromApi(value);
}

export function statusUiFromApi(status) {
  const key = String(status || 'TODO').toUpperCase().replace(/\s+/g, '_');
  return STATUS_UI_FROM_API[key] || 'To Do';
}

export function statusApiFromUi(status) {
  if (!status) return 'TODO';
  if (STATUS_API_FROM_UI[status]) return STATUS_API_FROM_UI[status];
  const upper = String(status).toUpperCase().replace(/\s+/g, '_');
  return STATUS_API_FROM_UI[status] || upper;
}

export function columnKeyFromApiStatus(status) {
  const key = String(status || 'TODO').toUpperCase().replace(/\s+/g, '_');
  return COLUMN_FROM_API[key] || 'todo';
}

function formatDisplayDate(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDueLabel(iso) {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const diffDays = Math.round((target - today) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays < 0) return formatDisplayDate(iso) || String(iso);
  return formatDisplayDate(iso) || String(iso);
}

function overdueDaysFromDue(iso, status) {
  if (!iso) return null;
  const upper = String(status || '').toUpperCase();
  if (upper === 'COMPLETED' || upper === 'DONE') return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  const diff = Math.round((today - date) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : null;
}

/** Convert Manual form 12h → API dueTime `H:mm` or `HH:mm`. */
export function dueTimeToApi(hour, minute, period) {
  let h = Number(hour);
  if (Number.isNaN(h)) h = 9;
  const m = String(minute ?? '00').padStart(2, '0');
  const p = String(period || 'AM').toUpperCase();
  if (p === 'AM') {
    if (h === 12) h = 0;
  } else if (h !== 12) {
    h += 12;
  }
  return `${h}:${m}`;
}

export function mapSubtaskFromApi(sub) {
  if (!sub) return null;
  return {
    id: sub.id,
    title: sub.title || '',
    description: sub.description || '',
    done: ['COMPLETED', 'DONE'].includes(String(sub.status || '').toUpperCase()),
    status: statusUiFromApi(sub.status),
    priority: priorityFromApi(sub.priority),
    estimatedMinutes: sub.estimatedMinutes ?? null,
  };
}

export function mapTaskFromApi(apiTask, preferredSource) {
  if (!apiTask) return null;

  const sourceRaw = String(apiTask.source || '').toUpperCase();
  const isAi =
    preferredSource === 'ai' ||
    Boolean(apiTask.aiGenerated) ||
    sourceRaw === 'AI' ||
    sourceRaw === 'AI_GENERATED';

  const statusUi = statusUiFromApi(apiTask.status);
  const categoryLabel = categoryFromApi(apiTask.category);
  const dueLabel = formatDueLabel(apiTask.dueDate);
  const overdueDays = overdueDaysFromDue(apiTask.dueDate, apiTask.status);
  const isDone = statusUi === 'Done';

  const tags = [{ label: categoryLabel }];
  if (apiTask.estimatedMinutes) {
    tags.push({ label: `${apiTask.estimatedMinutes} Min`, iconKey: 'clock' });
  }
  if (apiTask.goal?.title) {
    tags.push({ label: apiTask.goal.title, iconKey: 'goal', linkedGoal: true });
  }

  const subtasks = Array.isArray(apiTask.subtasks)
    ? apiTask.subtasks.map(mapSubtaskFromApi).filter(Boolean)
    : [];
  const subCount =
    typeof apiTask._count?.subtasks === 'number' ? apiTask._count.subtasks : subtasks.length;

  return {
    id: apiTask.id,
    title: apiTask.title || '',
    description: apiTask.description || '',
    priority: priorityFromApi(apiTask.priority),
    status: statusUi,
    apiStatus: String(apiTask.status || 'TODO').toUpperCase(),
    category: categoryLabel,
    due: dueLabel,
    dueDate: apiTask.dueDate ? String(apiTask.dueDate).slice(0, 10) : null,
    dueTime: apiTask.dueTime || null,
    estimatedMinutes: apiTask.estimatedMinutes ?? null,
    actualMinutes: apiTask.actualMinutes ?? null,
    goalId: apiTask.goalId || apiTask.goal?.id || null,
    goal: apiTask.goal || null,
    linkedGoal: apiTask.goal?.title || null,
    source: isAi ? 'ai' : 'manual',
    aiGenerated: isAi,
    tags,
    subtasks,
    steps: subCount > 0 ? `${subtasks.filter((s) => s.done).length}/${subCount} Steps` : undefined,
    overdueDays,
    completed: isDone
      ? apiTask.completedAt
        ? `Completed ${formatDisplayDate(apiTask.completedAt) || ''}`.trim()
        : 'Completed'
      : undefined,
    columnKey: columnKeyFromApiStatus(apiTask.status),
  };
}

export function mapAiGeneratedTaskForPreview(apiTask) {
  const mapped = mapTaskFromApi(apiTask, 'ai');
  if (!mapped?.id) return null;
  return { ...mapped, alreadyPersisted: true };
}

export function mapCreatePayload(form) {
  const payload = {
    title: String(form.title || '').trim(),
    description: String(form.description || '').trim() || 'New task',
    category: categoryToApi(form.category),
    priority: priorityToApi(form.priority),
  };

  if (form.dueDate) payload.dueDate = form.dueDate;
  if (form.dueHour != null || form.dueTime) {
    payload.dueTime =
      form.dueTime || dueTimeToApi(form.dueHour, form.dueMinute, form.duePeriod);
  }
  if (form.estMinutes !== '' && form.estMinutes != null) {
    const mins = Number(form.estMinutes);
    if (!Number.isNaN(mins)) payload.estimatedMinutes = mins;
  }
  const goalId = form.goalId || (form.linkedGoal && form.linkedGoal !== '__none__' && form.linkedGoal !== '__create_new__' ? form.linkedGoal : null);
  if (goalId && isUuid(goalId)) payload.goalId = goalId;

  return payload;
}

export function mapUpdatePayload(form) {
  const payload = {};
  if (form.title != null && String(form.title).trim() !== '') payload.title = String(form.title).trim();
  if (form.description != null) payload.description = String(form.description);
  if (form.priority) payload.priority = priorityToApi(form.priority);
  if (form.status) payload.status = statusApiFromUi(form.status);
  if (form.category) payload.category = categoryToApi(form.category);
  if (form.dueDate) payload.dueDate = form.dueDate;
  if (form.dueHour != null || form.dueTime) {
    payload.dueTime =
      form.dueTime || dueTimeToApi(form.dueHour, form.dueMinute, form.duePeriod);
  }
  if (form.estMinutes !== '' && form.estMinutes != null) {
    const mins = Number(form.estMinutes);
    if (!Number.isNaN(mins)) payload.estimatedMinutes = mins;
  }
  if (form.goalId === null || form.linkedGoal === '__none__') {
    payload.goalId = null;
  } else {
    const goalId = form.goalId || form.linkedGoal;
    if (goalId && isUuid(goalId)) payload.goalId = goalId;
  }
  return payload;
}

export function normalizeBoardSummary(summary, items = []) {
  if (summary && typeof summary === 'object') {
    return {
      todo: Number(summary.todo) || 0,
      inProgress: Number(summary.inProgress) || 0,
      completed: Number(summary.completed) || 0,
      overdue: Number(summary.overdue) || 0,
      dueToday: Number(summary.dueToday) || 0,
      total: Number(summary.total) || 0,
    };
  }
  return {
    todo: items.filter((t) => t.status === 'To Do').length,
    inProgress: items.filter((t) => t.status === 'In Progress').length,
    completed: items.filter((t) => t.status === 'Done').length,
    overdue: items.filter((t) => t.overdueDays != null).length,
    dueToday: items.filter((t) => t.due === 'Today').length,
    total: items.length,
  };
}

export function parseTasksListResponse(envelope) {
  const tasks = Array.isArray(envelope?.tasks)
    ? envelope.tasks
    : Array.isArray(envelope?.data)
      ? envelope.data
      : Array.isArray(envelope)
        ? envelope
        : [];
  return {
    items: tasks,
    pagination: envelope?.pagination ?? null,
    count: envelope?.count ?? tasks.length,
    summary: envelope?.summary ?? null,
  };
}

export function tasksToColumns(mappedTasks) {
  const columns = { todo: [], inProgress: [], done: [] };
  for (const task of mappedTasks) {
    if (!task) continue;
    const key = task.columnKey || columnKeyFromApiStatus(task.apiStatus);
    if (columns[key]) columns[key].push(task);
    else columns.todo.push(task);
  }
  return columns;
}

/** Map Tasks Board UI filters → GET /tasks query params. */
export function buildTasksQueryParams({ filters = {}, search = '', page = 1, limit = 50 } = {}) {
  const params = {
    page,
    limit,
    parentOnly: true,
  };

  if (filters.Status && filters.Status !== 'All Statuses') {
    const status = STATUS_FILTER_TO_API[filters.Status];
    if (status) params.status = status;
  }

  if (filters.Priority && filters.Priority !== 'All Priorities') {
    const priority = PRIORITY_FILTER_TO_API[filters.Priority];
    if (priority) params.priority = priority;
  }

  if (filters.Category && filters.Category !== 'All Categories') {
    params.category = categoryToApi(filters.Category);
  }

  if (filters.Date && filters.Date !== 'All Dates' && DATE_FILTER_TO_API[filters.Date]) {
    params.dueFilter = DATE_FILTER_TO_API[filters.Date];
  }

  const q = String(search || '').trim();
  if (q) params.search = q;

  return params;
}

/** Client-only: Source (API list has no source query in Postman contract). */
export function taskMatchesClientFilters(task, filters = {}) {
  if (filters.Source && filters.Source !== 'All Sources') {
    const wantsAi = filters.Source === 'Created by AI';
    if ((task.source === 'ai') !== wantsAi) return false;
  }
  return true;
}

export function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    String(value)
  );
}

export function formatTaskSuggestionBody(data) {
  const lines = [data?.message || data?.assistantMessage || 'Here is what I suggest.'];
  const proposed = data?.proposedTask;
  if (proposed?.title || proposed?.description) {
    lines.push('');
    lines.push('Proposed task updates:');
    if (proposed.title) lines.push(`• Title: ${proposed.title}`);
    if (proposed.description) lines.push(`• Description: ${proposed.description}`);
  }
  const subs = Array.isArray(data?.proposedSubtasks) ? data.proposedSubtasks : [];
  if (subs.length) {
    lines.push('');
    lines.push(`Proposed subtasks (${subs.length}):`);
    subs.forEach((s, i) => {
      lines.push(`${i + 1}. ${s.title || 'Untitled subtask'}`);
    });
  }
  return lines.join('\n');
}

function suggestionStatus(item) {
  return String(item?.status || item?.state || 'PENDING').toUpperCase();
}

function isPendingSuggestion(status) {
  return [
    'PENDING',
    'OPEN',
    'ACTIVE',
    'AWAITING',
    'AWAITING_CONFIRMATION',
    'SUGGESTED',
    'PROPOSED',
  ].includes(status);
}

function isAcceptedSuggestion(status) {
  return ['ACCEPTED', 'APPLIED', 'COMPLETED', 'DONE'].includes(status);
}

function isDismissedSuggestion(status) {
  return ['DISMISSED', 'REJECTED', 'CANCELLED', 'CANCELED'].includes(status);
}

function defaultUserMessageForAction(action) {
  const key = String(action || '').toUpperCase();
  if (key === 'BREAKDOWN') return 'Break this task into subtasks';
  if (key === 'IMPROVE_DESCRIPTION') return 'Make it more specific';
  return null;
}

function doneMessageForHistoryAction(action) {
  const key = String(action || '').toUpperCase();
  if (key === 'BREAKDOWN') return 'Done. The subtasks were successfully added.';
  if (key === 'IMPROVE_DESCRIPTION') return 'Done. The title and description were updated.';
  return 'Done. The task has been updated.';
}

/** Map GET /tasks/:id/ai/suggestions → chat messages (Goals AI pattern). */
export function mapTaskAiSuggestionsToMessages(envelope) {
  const list = Array.isArray(envelope?.suggestions)
    ? envelope.suggestions
    : Array.isArray(envelope?.data)
      ? envelope.data
      : Array.isArray(envelope)
        ? envelope
        : [];
  const sorted = [...list].sort((a, b) => {
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
    const accepted = isAcceptedSuggestion(status) || item.isApplied === true;
    const dismissed = isDismissedSuggestion(status) || item.isDismissed === true;
    const pending =
      !accepted &&
      !dismissed &&
      (isPendingSuggestion(status) ||
        (item.isApplied === false && item.isDismissed !== true));

    const userText =
      item.userMessage ||
      item.prompt ||
      item.requestMessage ||
      defaultUserMessageForAction(item.action);
    if (userText) {
      messages.push({ id: `u-${suggestionId}`, role: 'user', text: String(userText) });
    }

    const suggestionPayload = {
      ...item,
      id: suggestionId,
      suggestionId,
      message: item.assistantMessage || item.message,
      proposedTask: item.proposedTask || null,
      proposedSubtasks: Array.isArray(item.proposedSubtasks) ? item.proposedSubtasks : [],
    };

    messages.push({
      id: `a-${suggestionId}`,
      role: 'assistant',
      text: formatTaskSuggestionBody(suggestionPayload),
      suggestion: pending ? suggestionPayload : null,
      suggestionId,
      dismissed: dismissed || (!pending && !accepted),
      action: item.action,
      fromHistory: true,
    });

    if (accepted) {
      messages.push({ id: `u-apply-${suggestionId}`, role: 'user', text: 'Yes, apply' });
      const doneId = `done-${suggestionId}`;
      messages.push({
        id: doneId,
        role: 'assistant',
        text: item.applyMessage || doneMessageForHistoryAction(item.action),
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
      m.id === lastAcceptedDoneId ? { ...m, canUndo: true } : m
    );
  }
  return messages;
}
