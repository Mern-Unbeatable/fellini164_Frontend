/**
 * Planner Board — contract audit (TestAPIs.md Appendix E).
 * Run: node scripts/audit-planner-board.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  AI_ACTION_TO_API,
  DATE_RANGE_FROM_VIEW,
  ENERGY_TO_API,
  VIEW_UI_TO_API,
  boardToPlansMap,
  createPlanPromptForView,
  mapPlannerBoardFromApi,
  mapPlannerItemFromApi,
  startTimeToDisplay,
} from '../src/features/planner/plannerMappers.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const apiSource = fs.readFileSync(
  path.join(__dirname, '../src/features/planner/plannerAPI.js'),
  'utf8'
);
const sliceSource = fs.readFileSync(
  path.join(__dirname, '../src/features/planner/plannerSlice.js'),
  'utf8'
);
const storeSource = fs.readFileSync(
  path.join(__dirname, '../src/features/store.js'),
  'utf8'
);
const dailyPlannerSource = fs.readFileSync(
  path.join(__dirname, '../src/pages/private/user/planng/DailyPlan/DailyPlanner.jsx'),
  'utf8'
);

let failed = 0;
function assert(name, condition, detail = '') {
  if (condition) {
    console.log(`PASS  ${name}`);
  } else {
    failed += 1;
    console.log(`FAIL  ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

console.log('\n=== API paths present ===');
const paths = [
  ['summary', '/summary'],
  ['board', '/board'],
  ['available', '/available'],
  ['create-plan', '/create-plan'],
  ['ai/suggest', '/ai/suggest'],
  ['ai/suggestions accept', '/accept'],
  ['ai/suggestions dismiss', '/dismiss'],
  ['ai/undo', '/ai/undo'],
  ['patch item', 'patch(`${BASE}/${plannerItemId}`'],
  ['complete', '/complete'],
];
for (const [label, needle] of paths) {
  assert(`API: ${label}`, apiSource.includes(needle));
}

console.log('\n=== Store registration ===');
assert('store imports plannerReducer', storeSource.includes('planner/plannerSlice'));
assert('store has planner key', storeSource.includes('planner: plannerReducer'));

console.log('\n=== View / dateRange mapping ===');
assert('Daily → DAILY', VIEW_UI_TO_API.Daily === 'DAILY');
assert('Weekly → WEEKLY', VIEW_UI_TO_API.Weekly === 'WEEKLY');
assert('Monthly → MONTHLY', VIEW_UI_TO_API.Monthly === 'MONTHLY');
assert('Daily dateRange TODAY', DATE_RANGE_FROM_VIEW.Daily === 'TODAY');
assert('Weekly dateRange THIS_WEEK', DATE_RANGE_FROM_VIEW.Weekly === 'THIS_WEEK');
assert('Monthly dateRange THIS_MONTH', DATE_RANGE_FROM_VIEW.Monthly === 'THIS_MONTH');

console.log('\n=== AI actions ===');
for (const [ui, api] of [
  ['recalibrate_day', 'RECALIBRATE_DAY'],
  ['reduce_overload', 'REDUCE_OVERLOAD'],
  ['optimize_schedule', 'OPTIMIZE_SCHEDULE'],
  ['balance', 'BALANCE_SCHEDULE'],
  ['free_evening', 'FREE_EVENING'],
  ['CHAT', 'CHAT'],
]) {
  assert(`${ui} → ${api}`, AI_ACTION_TO_API[ui] === api);
}
assert('energy medium → MEDIUM', ENERGY_TO_API.medium === 'MEDIUM');

console.log('\n=== startTime → display ===');
assert('09:00 → 9 AM', startTimeToDisplay('09:00') === '9 AM');
assert('14:00 → 2 PM', startTimeToDisplay('14:00') === '2 PM');
assert('00:00 → 12 AM', startTimeToDisplay('00:00') === '12 AM');
assert('12:00 → 12 PM', startTimeToDisplay('12:00') === '12 PM');

console.log('\n=== Item mapper ===');
const taskItem = mapPlannerItemFromApi({
  id: 'p1',
  itemType: 'TASK',
  taskId: 't1',
  date: '2026-07-26',
  startTime: '09:00',
  endTime: '09:37',
  orderIndex: 0,
  title: 'Prepare Daily cost report',
  priority: 'HIGH',
  status: 'TODO',
  category: 'FINANCE',
  aiScheduled: true,
  estimatedMinutes: 37,
  progress: { type: 'STEPS', completed: 0, total: 4, label: '0/4 Steps' },
  goalTitle: 'Establish a Retirement Savings Plan',
});
assert('task kind', taskItem.kind === 'task');
assert('task time 9 AM', taskItem.time === '9 AM');
assert('task priority HIGH', taskItem.priority === 'HIGH');
assert('task status To Do', taskItem.status === 'To Do');
assert('task category Finance', taskItem.category === 'Finance');
assert('task stepsLabel', taskItem.stepsLabel === '0/4 Steps');
assert('task durationLabel', taskItem.durationLabel === '37 Min');
assert('task source ai', taskItem.source === 'ai');

const habitItem = mapPlannerItemFromApi({
  id: 'p2',
  itemType: 'HABIT',
  habitId: 'h1',
  date: '2026-07-26',
  startTime: '08:00',
  title: 'Daily Expense Tracking',
  status: 'ACTIVE',
  category: 'FINANCE',
  aiScheduled: true,
  progress: { type: 'HABIT', completed: 0, total: 1, label: '0/1' },
});
assert('habit kind', habitItem.kind === 'habit');
assert('habit time 8 AM', habitItem.time === '8 AM');
assert('habit progress', habitItem.progress?.done === 0 && habitItem.progress?.total === 1);

console.log('\n=== Board mapper (weekly days) ===');
const board = mapPlannerBoardFromApi({
  viewType: 'WEEKLY',
  startDate: '2026-07-20',
  endDate: '2026-07-26',
  days: {
    '2026-07-26': [
      {
        id: 'x1',
        itemType: 'TASK',
        date: '2026-07-26',
        startTime: '09:00',
        title: 'Meeting',
        status: 'TODO',
        priority: 'MEDIUM',
      },
    ],
  },
  items: [],
});
assert('board view WEEKLY', board.viewType === 'WEEKLY');
assert('board itemsByDate has day', (board.itemsByDate['2026-07-26'] || []).length === 1);
const plans = boardToPlansMap(board, '2026-07-26');
assert('plans map has day', (plans['2026-07-26'] || []).length === 1);

console.log('\n=== Create-plan prompts ===');
assert('Daily prompt non-empty', createPlanPromptForView('Daily').length > 10);
assert('Weekly prompt non-empty', createPlanPromptForView('Weekly').length > 10);
assert('Monthly prompt non-empty', createPlanPromptForView('Monthly').length > 10);

console.log('\n=== DailyPlanner wires Redux ===');
assert('dispatches fetchPlannerBoard', dailyPlannerSource.includes('fetchPlannerBoard'));
assert('dispatches createPlannerPlan', dailyPlannerSource.includes('createPlannerPlan'));
assert('dispatches suggestPlannerAi', dailyPlannerSource.includes('suggestPlannerAi'));
assert('dispatches acceptPlannerSuggestion', dailyPlannerSource.includes('acceptPlannerSuggestion'));
assert('dispatches dismissPlannerSuggestion', dailyPlannerSource.includes('dismissPlannerSuggestion'));
assert('dispatches undoPlannerAi', dailyPlannerSource.includes('undoPlannerAi'));
assert('slice exports fetchPlannerBoard', sliceSource.includes('fetchPlannerBoard'));

console.log(`\n=== Result: ${failed === 0 ? 'ALL PASS' : `${failed} FAILED`} ===\n`);
process.exit(failed === 0 ? 0 : 1);
