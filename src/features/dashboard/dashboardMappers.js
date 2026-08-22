function titleCase(value) {
  if (!value) return '';
  return String(value)
    .toLowerCase()
    .split(/[_\s]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function formatMinutes(totalMinutes) {
  const mins = Math.max(0, Number(totalMinutes) || 0);
  const hours = Math.floor(mins / 60);
  const rem = mins % 60;
  if (hours <= 0) return `${rem}m`;
  if (rem === 0) return `${hours}h`;
  return `${hours}h ${rem}m`;
}

function formatDateRange(startDate, endDate) {
  if (!startDate || !endDate) return '';
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return '';
  const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${fmt(start)} – ${fmt(end)}`;
}

function mapScheduleItem(item) {
  const priority = item.priority ? String(item.priority).toLowerCase() : null;
  const isHabit = String(item.itemType || '').toUpperCase() === 'HABIT';

  return {
    id: item.id,
    itemType: item.itemType,
    title: item.title || '',
    time: item.startTimeLabel || item.startTime || '',
    duration: item.durationLabel || formatMinutes(item.durationMinutes),
    category: item.categoryLabel || titleCase(item.category),
    extra: priority ? `${priority} priority` : isHabit ? 'habit' : null,
    extraIsPriority: Boolean(priority),
    isCompleted: Boolean(item.isCompleted),
    priority: item.priority,
    status: item.status,
  };
}

function mapHabit(habit) {
  return {
    id: habit.id,
    title: habit.name || '',
    category: titleCase(habit.category),
    progress: habit.label || `${habit.current || 0}/${habit.target || 0}`,
    streak: habit.streak || 0,
    percent: habit.percent || 0,
    completedToday: Boolean(habit.completedToday),
  };
}

function mapInsight(insight, index) {
  return {
    id: insight.type || `insight-${index}`,
    type: insight.type,
    title: insight.title || '',
    body: insight.message || '',
  };
}

export function parseDashboardResponse(response) {
  const data = response?.data ?? response ?? {};
  const stats = data.stats || {};
  const dailyProgress = data.dailyProgress || {};
  const greeting = data.greeting || {};
  const weeklyFocus = data.weeklyFocus || {};
  const days = Array.isArray(weeklyFocus.days) ? weeklyFocus.days : [];
  const schedule = Array.isArray(data.todaySchedule) ? data.todaySchedule : [];
  const habits = Array.isArray(data.habits) ? data.habits : [];
  const insights = Array.isArray(data.insights) ? data.insights : [];

  const weekMinutes = days.reduce((sum, day) => sum + (Number(day.minutes) || 0), 0);
  const plannedMinutes = schedule.reduce(
    (sum, item) => sum + (Number(item.durationMinutes) || 0),
    0
  );

  const tasksToday = stats.tasksToday || {};
  const focusTime = stats.focusTime || {};
  const habitScore = stats.habitScore || {};
  const goalProgress = stats.goalProgress || {};

  return {
    date: data.date || null,
    greeting: {
      text: greeting.text || '',
      subtitle: greeting.subtitle || '',
      firstName: greeting.firstName || '',
    },
    dailyProgress: {
      percent: Number(dailyProgress.percent) || 0,
      completed: Number(dailyProgress.completed) || 0,
      total: Number(dailyProgress.total) || 0,
      label: dailyProgress.label || '',
    },
    stats: {
      tasksValue: `${tasksToday.completed ?? 0}/${tasksToday.total ?? 0}`,
      tasksSubtitle: tasksToday.label || '0% completed',
      focusValue: formatMinutes(focusTime.minutes),
      focusSubtitle: focusTime.label || 'Today',
      habitValue: `${habitScore.percent ?? 0}%`,
      habitSubtitle:
        habitScore.label && habitScore.activeHabits != null
          ? `${habitScore.label} · ${habitScore.activeHabits} active habits`
          : habitScore.label || 'Start today',
      goalValue: `${goalProgress.percent ?? 0}%`,
      goalSubtitle:
        goalProgress.label && goalProgress.activeGoals != null
          ? `${goalProgress.label} · ${goalProgress.activeGoals} tracked`
          : goalProgress.label || 'No active goals',
    },
    todaySchedule: schedule.map(mapScheduleItem),
    scheduleMeta: {
      plannedLabel: `${formatMinutes(plannedMinutes)} planned`,
      doneCount: schedule.filter((item) => item.isCompleted).length,
    },
    weeklyFocus: {
      weekLabel: formatDateRange(weeklyFocus.startDate, weeklyFocus.endDate),
      weekTotal: formatMinutes(weekMinutes),
      days: days.map((day) => ({
        day: day.day,
        date: day.date,
        minutes: Number(day.minutes) || 0,
        hours: Number(day.hours) || 0,
      })),
    },
    habits: habits.map(mapHabit),
    habitsMeta: {
      shownOf: Number(habitScore.activeHabits) || habits.length,
      todayPercent: Number(habitScore.percent) || 0,
      completedToday: Number(habitScore.completedToday) || habits.filter((h) => h.completedToday).length,
    },
    insights: insights.map(mapInsight),
    goals: {
      activeGoals: Number(goalProgress.activeGoals) || 0,
      percent: Number(goalProgress.percent) || 0,
      label: goalProgress.label || 'No active goals',
    },
    focusTimeToday: {
      minutes: Number(focusTime.minutes) || 0,
      loggedLabel: `${formatMinutes(focusTime.minutes)} logged`,
      footer: focusTime.label || 'nothing logged yet',
    },
  };
}
