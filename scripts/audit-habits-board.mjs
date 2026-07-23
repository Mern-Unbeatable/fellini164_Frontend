/**
 * Habits Board — filter + New Habit contract audit (TestAPIs.md Appendix C).
 * Run: node scripts/audit-habits-board.mjs
 */
import {
  buildHabitsQueryParams,
  categoryToApi,
  habitMatchesClientFilters,
  mapCreatePayload,
  mapHabitFromApi,
  mapUpdatePayload,
  reminderTimeToApi,
  targetDaysToApi,
} from '../src/features/habits/habitsMappers.js';

let failed = 0;
function assert(name, condition, detail = '') {
  if (condition) {
    console.log(`PASS  ${name}`);
  } else {
    failed += 1;
    console.log(`FAIL  ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

console.log('\n=== New Habit (Create payload) ===');
const create = mapCreatePayload({
  title: 'Morning walk',
  description: 'Walk for 20 minutes after waking up.',
  category: 'Health',
  hour: 7,
  minute: '30',
  period: 'AM',
  targetDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  difficulty: 'EASY',
});
assert('Create: name', create.name === 'Morning walk');
assert('Create: category HEALTH', create.category === 'HEALTH');
assert('Create: frequency DAILY', create.frequency === 'DAILY');
assert('Create: difficulty EASY', create.difficulty === 'EASY');
assert('Create: targetTimesPerDay 1', create.targetTimesPerDay === 1);
assert('Create: reminderTime 07:30', create.reminderTime === '07:30');
assert(
  'Create: targetDays MONDAY…FRIDAY',
  JSON.stringify(create.targetDays) ===
    JSON.stringify(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'])
);
assert('Create: no goalId when unset', create.goalId === undefined);

const createWithGoal = mapCreatePayload({
  title: 'Read',
  category: 'Career',
  linkedGoal: '6dbd828e-8c24-4f1c-87da-03dd240bc542',
  hour: 8,
  minute: '00',
  period: 'AM',
  targetDays: ['Mon'],
});
assert('Create: goalId when UUID', createWithGoal.goalId === '6dbd828e-8c24-4f1c-87da-03dd240bc542');

console.log('\n=== Update Habit (PATCH payload) ===');
const update = mapUpdatePayload({
  title: 'Updated',
  category: 'Finance',
  difficulty: 'MEDIUM',
  hour: 8,
  minute: '00',
  period: 'AM',
});
assert('Update: name', update.name === 'Updated');
assert('Update: category FINANCE', update.category === 'FINANCE');
assert('Update: reminderTime 08:00', update.reminderTime === '08:00');

console.log('\n=== Category filter → GET /habits?category= ===');
const catAll = buildHabitsQueryParams({ filters: { Category: 'All Category' } });
assert('All Category: no category param', catAll.category === undefined);
for (const ui of ['Career', 'Health', 'Finance', 'Fitness', 'Wellness', 'Productivity', 'Personal', 'Education']) {
  const p = buildHabitsQueryParams({ filters: { Category: ui } });
  assert(`Category ${ui} → ${categoryToApi(ui)}`, p.category === categoryToApi(ui));
}

console.log('\n=== Schedule filter → GET /habits?frequency= ===');
const schAll = buildHabitsQueryParams({ filters: { Schedule: 'All Schedule' } });
assert('All Schedule: no frequency', schAll.frequency === undefined);
assert(
  'Daily → DAILY',
  buildHabitsQueryParams({ filters: { Schedule: 'Daily' } }).frequency === 'DAILY'
);
assert(
  'Weekly → WEEKLY',
  buildHabitsQueryParams({ filters: { Schedule: 'Weekly' } }).frequency === 'WEEKLY'
);
assert(
  'Monthly → MONTHLY',
  buildHabitsQueryParams({ filters: { Schedule: 'Monthly' } }).frequency === 'MONTHLY'
);
assert(
  'Custom: no frequency (client-only)',
  buildHabitsQueryParams({ filters: { Schedule: 'Custom' } }).frequency === undefined
);

console.log('\n=== Streak filter (client-only — API has no streak query) ===');
const streakHabit = (n) => ({ streak: n, days: Array(7).fill('empty'), tags: [] });
assert(
  'Streak API param never sent',
  buildHabitsQueryParams({ filters: { Streak: 'Active streak' } }).streak === undefined &&
    buildHabitsQueryParams({ filters: { Streak: 'Active streak' } }).minStreak === undefined
);
assert(
  'Active streak matches streak>0',
  habitMatchesClientFilters(streakHabit(3), { Streak: 'Active streak' })
);
assert(
  'Active streak excludes 0',
  !habitMatchesClientFilters(streakHabit(0), { Streak: 'Active streak' })
);
assert(
  'No streak matches 0',
  habitMatchesClientFilters(streakHabit(0), { Streak: 'No streak' })
);
assert(
  'Best streak matches >=7',
  habitMatchesClientFilters(streakHabit(7), { Streak: 'Best streak' }) &&
    !habitMatchesClientFilters(streakHabit(6), { Streak: 'Best streak' })
);

console.log('\n=== Days Left filter (client-only — API has no daysLeft query) ===');
assert(
  'Days Left API param never sent',
  buildHabitsQueryParams({ filters: { 'Days Left': '1-7 days' } }).daysLeft === undefined
);
const withDays = {
  streak: 0,
  days: Array(7).fill('empty'),
  tags: [{ label: '12 days left' }],
};
assert(
  '8-30 days matches 12',
  habitMatchesClientFilters(withDays, { 'Days Left': '8-30 days' })
);
assert(
  '1-7 days excludes 12',
  !habitMatchesClientFilters(withDays, { 'Days Left': '1-7 days' })
);
assert(
  'No days-left tag → excluded when filter set',
  !habitMatchesClientFilters(streakHabit(0), { 'Days Left': '1-7 days' })
);

console.log('\n=== Search + pagination ===');
const search = buildHabitsQueryParams({ search: 'reading', page: 1, limit: 50 });
assert('search param', search.search === 'reading');
assert('page=1', search.page === 1);
assert('limit=50', search.limit === 50);

console.log('\n=== Helpers ===');
assert('reminder 8:00 AM → 08:00', reminderTimeToApi(8, '00', 'AM') === '08:00');
assert('reminder 7:30 PM → 19:30', reminderTimeToApi(7, '30', 'PM') === '19:30');
assert(
  'targetDays UI→API',
  targetDaysToApi(['Mon', 'Fri']).join() === 'MONDAY,FRIDAY'
);

const mapped = mapHabitFromApi({
  id: '0c369aba-1f02-4569-81ee-44efed7d7c7f',
  name: 'Daily Savings Challenge',
  category: 'FINANCE',
  frequency: 'DAILY',
  reminderTime: '08:00',
  currentStreak: 0,
  status: 'ACTIVE',
  targetDays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
  completions: [],
  goal: { id: '6dbd828e-8c24-4f1c-87da-03dd240bc542', title: 'Start a retirement savings plan' },
});
assert('mapHabit: title from name', mapped.title === 'Daily Savings Challenge');
assert('mapHabit: category Finance', mapped.category === 'Finance');
assert('mapHabit: streak 0', mapped.streak === 0);
assert('mapHabit: status active', mapped.status === 'active');
assert('mapHabit: has Finance tag', mapped.tags.some((t) => t.label === 'Finance'));
assert('mapHabit: has 8:00 AM tag', mapped.tags.some((t) => t.label === '8:00 AM'));

console.log('\n=== Integration matrix (expected) ===');
console.log('New Habit Manual     → POST /habits                         FULFILLED');
console.log('New Habit AI         → POST /habits/ai/generate             FULFILLED');
console.log('All Category         → GET /habits?category=ENUM            FULFILLED');
console.log('All Schedule D/W/M   → GET /habits?frequency=ENUM           FULFILLED');
console.log('All Schedule Custom  → client filter (no API param)         CLIENT');
console.log('All Streak           → client on currentStreak              CLIENT');
console.log('All Days Left        → client on days-left tag (if any)     CLIENT');

console.log(`\n${failed === 0 ? 'ALL PASS' : `${failed} FAILED`}`);
process.exit(failed === 0 ? 0 : 1);
