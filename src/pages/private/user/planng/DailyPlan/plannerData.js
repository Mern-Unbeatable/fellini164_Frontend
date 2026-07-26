// Shared mock content for the Planner board. Titles/descriptions intentionally mirror the
// existing Tasks/Habits board mock data (TasksBoard.jsx INITIAL_COLUMNS.todo, Habits.jsx
// habit-1) so the Planner reads as scheduling the *same* underlying items, not an invented
// vocabulary — the Planner AI only reorders/retimes items, it never owns their content.

export const PLANNER_HOURS = [
  '12 AM',
  '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM',
  '12 PM',
  '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM',
];

/** @deprecated Prefer today via dateKeyFromDate(new Date()) — kept for mock fallbacks */
export const SEED_DATE_KEY = '2026-05-13';

export function dateKeyFromDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

// Returns the Mon..Sun Date objects for the week containing `date`.
export function getWeekDays(date) {
  const mondayOffset = (date.getDay() + 6) % 7; // days since Monday (getDay: 0=Sun..6=Sat)
  const monday = new Date(date);
  monday.setDate(date.getDate() - mondayOffset);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

// item.kind: 'task' | 'habit'
// item.layout: 'half' groups same-time items two-up (matches the 7 AM Update Resume + Drink
// Water pair in Figma); omit for a full-width row.
export const INITIAL_DAILY_PLAN = [
  {
    id: '1',
    time: '1 AM',
    kind: 'task',
    title: 'Morning Workout Routine',
    priority: 'HIGH',
    status: 'To Do',
    source: 'ai',
  },
  {
    id: '2',
    time: '2 AM',
    kind: 'task',
    title: 'Complete Work Task',
    priority: 'MEDIUM',
    status: 'To Do',
  },
  {
    id: '3',
    time: '4 AM',
    kind: 'task',
    title: 'Exercise Routine',
    description: 'Follow your fitness routine or do a workout session.',
    priority: 'URGENT',
    status: 'To Do',
    source: 'ai',
  },
  {
    id: '5',
    time: '7 AM',
    kind: 'task',
    layout: 'half',
    title: 'Update Resume and LinkedIn Profile',
    description: 'Communicate the expectations regarding maintaining a calm...',
    priority: 'LOW',
    status: 'In Progress',
    category: 'Health',
    durationLabel: '115 Min',
  },
  {
    id: 'h1',
    time: '7 AM',
    kind: 'habit',
    layout: 'half',
    title: 'Drink Water',
    description: 'Stay hydrated throughout the day Stay hydrated throughout...',
    progress: { done: 0, total: 2 },
  },
  {
    id: '4',
    time: '11 AM',
    kind: 'task',
    title: 'Career Development Plan',
    description: 'Stick to your professional development plan or engage in a skills training session.',
    priority: 'HIGH',
    status: 'In Progress',
    source: 'ai',
    category: 'Career',
    goalLabel: 'Improve Rate',
    durationLabel: '60 Min',
    stepsLabel: '0/4 Steps',
  },
];

export const INITIAL_MESSAGE = {
  id: 'm1',
  sender: 'ai',
  text: 'I can build or adjust your schedule from existing tasks and habits. Generate a plan, or ask me to rebalance, reduce overload, or free your evening.',
  timestamp: null,
};
