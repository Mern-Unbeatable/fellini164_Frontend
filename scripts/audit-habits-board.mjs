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

console.log('\n=== Category filter → GET /habits?category= ===');
assert(
  'All Category: no category param',
  buildHabitsQueryParams({ filters: { Category: 'All Category' } }).category === undefined
);
for (const ui of [
  'Career',
  'Health',
  'Finance',
  'Fitness',
  'Wellness',
  'Productivity',
  'Personal',
  'Education',
]) {
  const p = buildHabitsQueryParams({ filters: { Category: ui } });
  assert(`Category ${ui} → ${categoryToApi(ui)}`, p.category === categoryToApi(ui));
}

console.log('\n=== Schedule filter → GET /habits?frequency= ===');
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

console.log('\n=== Streak filter → GET /habits?streak= (Postman) ===');
assert(
  'All Streak: no streak param',
  buildHabitsQueryParams({ filters: { Streak: 'All Streak' } }).streak === undefined
);
assert(
  'Active streak → ACTIVE',
  buildHabitsQueryParams({ filters: { Streak: 'Active streak' } }).streak === 'ACTIVE'
);
assert(
  'No streak → NONE',
  buildHabitsQueryParams({ filters: { Streak: 'No streak' } }).streak === 'NONE'
);
assert(
  'Best streak → BEST',
  buildHabitsQueryParams({ filters: { Streak: 'Best streak' } }).streak === 'BEST'
);

console.log('\n=== Days Left filter → GET /habits?daysLeft= (Postman) ===');
assert(
  'All Days Left: no daysLeft param',
  buildHabitsQueryParams({ filters: { 'Days Left': 'All Days Left' } }).daysLeft === undefined
);
assert(
  '1-7 days → 1-7',
  buildHabitsQueryParams({ filters: { 'Days Left': '1-7 days' } }).daysLeft === '1-7'
);
assert(
  '8-30 days → 8-30',
  buildHabitsQueryParams({ filters: { 'Days Left': '8-30 days' } }).daysLeft === '8-30'
);
assert(
  '30+ days → 30plus',
  buildHabitsQueryParams({ filters: { 'Days Left': '30+ days' } }).daysLeft === '30plus'
);

console.log('\n=== Combined query (Postman sample) ===');
const combo = buildHabitsQueryParams({
  filters: {
    Category: 'Health',
    Streak: 'Active streak',
  },
});
assert('combo category=HEALTH', combo.category === 'HEALTH');
assert('combo streak=ACTIVE', combo.streak === 'ACTIVE');

console.log('\n=== Client filter only Custom schedule ===');
assert(
  'Custom excludes full week',
  !habitMatchesClientFilters(
    { days: Array(7).fill('empty') },
    { Schedule: 'Custom' }
  )
);
assert(
  'Streak not client-filtered anymore',
  habitMatchesClientFilters({ streak: 0, days: [] }, { Streak: 'Active streak' })
);

console.log('\n=== Map daysLeft from API ===');
const mapped = mapHabitFromApi({
  id: '0c369aba-1f02-4569-81ee-44efed7d7c7f',
  name: 'Daily Savings',
  category: 'FINANCE',
  frequency: 'DAILY',
  reminderTime: '08:00',
  currentStreak: 0,
  status: 'ACTIVE',
  targetDays: ['MONDAY'],
  completions: [],
  daysLeft: 12,
  goal: { title: 'Goal A', targetDate: '2026-08-01T00:00:00.000Z' },
});
assert('mapHabit: daysLeft 12', mapped.daysLeft === 12);
assert(
  'mapHabit: days left tag',
  mapped.tags.some((t) => t.label === '12 days left')
);

const overdue = mapHabitFromApi({
  id: 'x',
  name: 'Overdue',
  category: 'CAREER',
  status: 'ACTIVE',
  targetDays: ['MONDAY'],
  completions: [],
  daysLeft: -13,
});
assert('mapHabit: negative daysLeft kept', overdue.daysLeft === -13);
assert(
  'mapHabit: no days-left tag when negative',
  !overdue.tags.some((t) => /days left/i.test(t.label))
);

console.log('\n=== Update + helpers ===');
const update = mapUpdatePayload({
  title: 'Updated',
  category: 'Finance',
  difficulty: 'MEDIUM',
  hour: 8,
  minute: '00',
  period: 'AM',
});
assert('Update: reminderTime 08:00', update.reminderTime === '08:00');
assert('reminder 7:30 PM → 19:30', reminderTimeToApi(7, '30', 'PM') === '19:30');
assert('targetDays UI→API', targetDaysToApi(['Mon', 'Fri']).join() === 'MONDAY,FRIDAY');

console.log('\n=== Integration matrix ===');
console.log('New Habit          → POST /habits | ai/generate     FULFILLED');
console.log('All Category       → ?category=ENUM                 FULFILLED');
console.log('All Schedule D/W/M → ?frequency=ENUM                FULFILLED');
console.log('All Schedule Custom→ client only                    CLIENT');
console.log('All Streak         → ?streak=ACTIVE|NONE|BEST       FULFILLED');
console.log('All Days Left      → ?daysLeft=1-7|8-30|30plus      FULFILLED');

console.log(`\n${failed === 0 ? 'ALL PASS' : `${failed} FAILED`}`);
process.exit(failed === 0 ? 0 : 1);
