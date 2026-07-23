/** Map Habits API payloads ↔ Habits Board UI fields. */

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

const INDEX_TO_WEEKDAY = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
];

const UI_DAY_TO_API = {
  Mon: 'MONDAY',
  Tue: 'TUESDAY',
  Wed: 'WEDNESDAY',
  Thu: 'THURSDAY',
  Fri: 'FRIDAY',
  Sat: 'SATURDAY',
  Sun: 'SUNDAY',
};

const FREQUENCY_FILTER_TO_API = {
  Daily: 'DAILY',
  Weekly: 'WEEKLY',
  Monthly: 'MONTHLY',
};

const STREAK_FILTER_TO_API = {
  'Active streak': 'ACTIVE',
  'No streak': 'NONE',
  'Best streak': 'BEST',
};

const DAYS_LEFT_FILTER_TO_API = {
  '1-7 days': '1-7',
  '8-30 days': '8-30',
  '30+ days': '30plus',
};

export function categoryToApi(category) {
  const raw = String(category || 'Career').trim().toUpperCase();
  if (raw === 'HEAL') return 'HEALTH';
  return raw;
}

export function categoryFromApi(category) {
  if (!category) return 'Career';
  const normalized = String(category).toLowerCase();
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

export function statusFromApi(status) {
  if (!status) return 'active';
  return STATUS_FROM_API[String(status).toUpperCase()] || 'active';
}

export function statusToApi(status) {
  return STATUS_TO_API[status] || 'ACTIVE';
}

/** Mon=0 … Sun=6 for the live calendar (not Figma Wed lock). */
export function getTodayIndex() {
  const day = new Date().getDay();
  return day === 0 ? 6 : day - 1;
}

export function getWeekMonday(base = new Date()) {
  const d = new Date(base);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function toDateKey(value) {
  if (!value) return null;
  if (typeof value === 'string') {
    const m = value.match(/^(\d{4}-\d{2}-\d{2})/);
    if (m) return m[1];
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

function localDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function completionDateKeys(completions) {
  const keys = new Set();
  if (!Array.isArray(completions)) return keys;
  for (const entry of completions) {
    if (!entry) continue;
    const key =
      toDateKey(entry.date) ||
      toDateKey(entry.completedAt) ||
      toDateKey(entry.completionDate) ||
      toDateKey(entry.createdAt);
    if (key) keys.add(key);
  }
  return keys;
}

/** Convert API `HH:mm` (24h) → `h:mm AM/PM` tag label. */
export function reminderTimeFromApi(reminderTime) {
  if (!reminderTime || typeof reminderTime !== 'string') return null;
  const match = reminderTime.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return reminderTime;
  let hour = Number(match[1]);
  const minute = match[2];
  if (Number.isNaN(hour)) return reminderTime;
  const period = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  if (hour === 0) hour = 12;
  return `${hour}:${minute} ${period}`;
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

export function targetDaysToApi(uiDays) {
  if (!Array.isArray(uiDays) || uiDays.length === 0) {
    return [...INDEX_TO_WEEKDAY];
  }
  return uiDays.map((d) => UI_DAY_TO_API[d] || String(d).toUpperCase()).filter(Boolean);
}

export function targetDaysFromApi(apiDays) {
  if (!Array.isArray(apiDays) || apiDays.length === 0) return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const reverse = Object.fromEntries(Object.entries(UI_DAY_TO_API).map(([k, v]) => [v, k]));
  return apiDays.map((d) => reverse[String(d).toUpperCase()]).filter(Boolean);
}

/**
 * Build Mon–Sun day cell states from targetDays + completions.
 * States: 'unscheduled' | 'empty' | 'checked'
 * MVP: one check/day — no fractional todayProgress.
 */
export function buildWeekDayStates(habit) {
  const monday = getWeekMonday();
  const targetSet = new Set(
    (Array.isArray(habit?.targetDays) ? habit.targetDays : []).map((d) => String(d).toUpperCase())
  );
  const completed = completionDateKeys(habit?.completions);
  const todayKey = localDateKey(new Date());

  // Some list payloads omit today's completion in `completions` — honor explicit flags.
  if (habit?.completedToday === true) completed.add(todayKey);

  return INDEX_TO_WEEKDAY.map((name, i) => {
    if (targetSet.size > 0 && !targetSet.has(name)) return 'unscheduled';
    const cell = new Date(monday);
    cell.setDate(monday.getDate() + i);
    const key = localDateKey(cell);
    if (completed.has(key)) return 'checked';
    return 'empty';
  });
}

function daysLeftLabel(habit) {
  if (typeof habit.daysLeft === 'number' && Number.isFinite(habit.daysLeft)) {
    if (habit.daysLeft < 0) return null;
    return `${habit.daysLeft} days left`;
  }
  const raw =
    habit.daysRemaining ??
    habit.goal?.daysLeft ??
    habit.goal?.targetDate;
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    if (raw < 0) return null;
    return `${raw} days left`;
  }
  if (typeof raw === 'string' && /^\d{4}-\d{2}-\d{2}/.test(raw)) {
    const target = new Date(raw);
    if (Number.isNaN(target.getTime())) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    const diff = Math.round((target - today) / (1000 * 60 * 60 * 24));
    if (diff < 0) return null;
    return `${diff} days left`;
  }
  return null;
}

function buildTags(habit) {
  const tags = [];
  const category = categoryFromApi(habit.category);
  if (category) tags.push({ label: category });

  const timeLabel = reminderTimeFromApi(habit.reminderTime);
  if (timeLabel) tags.push({ label: timeLabel, iconKey: 'bell' });

  const goalTitle = habit.goal?.title || habit.linkedGoalTitle;
  if (goalTitle) tags.push({ label: goalTitle, iconKey: 'flag' });

  const left = daysLeftLabel(habit);
  if (left) tags.push({ label: left, iconKey: 'hourglass' });

  return tags;
}

export function mapHabitFromApi(apiHabit, preferredSource) {
  if (!apiHabit) return null;

  const sourceRaw = String(apiHabit.source || '').toUpperCase();
  const isAi =
    preferredSource === 'ai' ||
    Boolean(apiHabit.aiSuggested) ||
    sourceRaw === 'AI' ||
    sourceRaw === 'AI_GENERATED';

  return {
    id: apiHabit.id,
    title: apiHabit.name || apiHabit.title || '',
    description: apiHabit.description || '',
    category: categoryFromApi(apiHabit.category),
    frequency: apiHabit.frequency || 'DAILY',
    difficulty: apiHabit.difficulty || 'MEDIUM',
    targetDays: Array.isArray(apiHabit.targetDays) ? apiHabit.targetDays : [],
    targetTimesPerDay: apiHabit.targetTimesPerDay ?? 1,
    reminderTime: apiHabit.reminderTime || null,
    streak: Number(apiHabit.currentStreak) || 0,
    longestStreak: Number(apiHabit.longestStreak) || 0,
    totalCompletions: Number(apiHabit.totalCompletions) || 0,
    daysLeft: typeof apiHabit.daysLeft === 'number' ? apiHabit.daysLeft : null,
    status: statusFromApi(apiHabit.status || (apiHabit.isActive === false ? 'PAUSED' : 'ACTIVE')),
    source: isAi ? 'ai' : 'manual',
    aiSuggested: Boolean(apiHabit.aiSuggested) || isAi,
    goalId: apiHabit.goalId || apiHabit.goal?.id || null,
    goal: apiHabit.goal || null,
    completions: Array.isArray(apiHabit.completions) ? apiHabit.completions : [],
    tags: buildTags(apiHabit),
    days: buildWeekDayStates(apiHabit),
    // MVP: no fractional multi-check
    todayProgress: undefined,
  };
}

export function mapAiGeneratedHabitForPreview(apiHabit) {
  const mapped = mapHabitFromApi(apiHabit, 'ai');
  if (!mapped?.id) return null;
  return {
    ...mapped,
    alreadyPersisted: true,
  };
}

/** Map New Habit modal → POST /habits body. */
export function mapCreatePayload(form) {
  const payload = {
    name: String(form.title || form.name || '').trim(),
    description: String(form.description || '').trim() || 'New habit',
    category: categoryToApi(form.category),
    frequency: String(form.frequency || 'DAILY').toUpperCase(),
    difficulty: String(form.difficulty || 'MEDIUM').toUpperCase(),
    targetDays: targetDaysToApi(form.targetDays),
    targetTimesPerDay: 1,
    reminderTime:
      form.reminderTime || reminderTimeToApi(form.hour, form.minute, form.period),
  };

  const goalId = form.goalId || (form.linkedGoal && form.linkedGoal !== '__none__' ? form.linkedGoal : null);
  if (goalId && isUuid(goalId)) payload.goalId = goalId;

  return payload;
}

/** Map Edit Habit modal → PATCH /habits/:id body (partial). */
export function mapUpdatePayload(form) {
  const payload = {};
  const name = form.title || form.name;
  if (name != null && String(name).trim() !== '') payload.name = String(name).trim();
  if (form.description != null) payload.description = String(form.description);
  if (form.category) payload.category = categoryToApi(form.category);
  if (form.difficulty) payload.difficulty = String(form.difficulty).toUpperCase();
  if (form.frequency) payload.frequency = String(form.frequency).toUpperCase();
  if (Array.isArray(form.targetDays)) payload.targetDays = targetDaysToApi(form.targetDays);
  if (form.hour != null || form.reminderTime) {
    payload.reminderTime =
      form.reminderTime || reminderTimeToApi(form.hour, form.minute, form.period);
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
      active: Number(summary.active) || 0,
      paused: Number(summary.paused) || 0,
      completed: Number(summary.completed) || 0,
      total: Number(summary.total) || 0,
      completedToday: Number(summary.completedToday) || 0,
      remainingToday: Number(summary.remainingToday) || 0,
    };
  }
  return {
    active: items.filter((h) => h.status === 'active').length,
    paused: items.filter((h) => h.status === 'paused').length,
    completed: items.filter((h) => h.status === 'completed').length,
    total: items.length,
    completedToday: 0,
    remainingToday: items.filter((h) => h.status === 'active').length,
  };
}

export function parseHabitsListResponse(envelope) {
  const habits = Array.isArray(envelope?.habits)
    ? envelope.habits
    : Array.isArray(envelope?.data)
      ? envelope.data
      : Array.isArray(envelope)
        ? envelope
        : [];
  return {
    items: habits,
    pagination: envelope?.pagination ?? null,
    count: envelope?.count ?? habits.length,
    summary: envelope?.summary ?? null,
  };
}

/** Map Habits Board UI filters → GET /habits query params (Postman contract). */
export function buildHabitsQueryParams({ filters = {}, search = '', page = 1, limit = 50 } = {}) {
  const params = { page, limit };

  if (filters.Category && filters.Category !== 'All Category') {
    params.category = categoryToApi(filters.Category);
  }

  if (filters.Schedule && filters.Schedule !== 'All Schedule' && filters.Schedule !== 'Custom') {
    const frequency = FREQUENCY_FILTER_TO_API[filters.Schedule];
    if (frequency) params.frequency = frequency;
  }

  if (filters.Streak && filters.Streak !== 'All Streak') {
    const streak = STREAK_FILTER_TO_API[filters.Streak];
    if (streak) params.streak = streak;
  }

  if (filters['Days Left'] && filters['Days Left'] !== 'All Days Left') {
    const daysLeft = DAYS_LEFT_FILTER_TO_API[filters['Days Left']];
    if (daysLeft) params.daysLeft = daysLeft;
  }

  const q = String(search || '').trim();
  if (q) params.search = q;

  return params;
}

/**
 * Client-only leftover: Schedule "Custom" (API frequency has no Custom enum).
 * Streak + Days Left are server-filtered via `streak` / `daysLeft` query params.
 */
export function habitMatchesClientFilters(habit, filters = {}) {
  if (filters.Schedule === 'Custom') {
    const scheduled = (habit.days || []).filter((d) => d !== 'unscheduled').length;
    if (scheduled === 7) return false;
  }
  return true;
}

export function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    String(value)
  );
}
