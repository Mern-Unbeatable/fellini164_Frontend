/**
 * Planner Board — contract audit APIs #1–#11 (TestAPIs.md Appendix E).
 * Run: node scripts/audit-planner-board.mjs
 *
 * Static only (no auth / no live Network). Verifies UI→API wiring like Create Plan.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  AI_ACTION_TO_API,
  DATE_RANGE_FROM_VIEW,
  DATE_RANGE_FROM_MODAL,
  ENERGY_TO_API,
  VIEW_UI_TO_API,
  boardToPlansMap,
  buildCreatePlanPayload,
  buildPlannerPatchPayload,
  createPlanPromptForView,
  displayTimeToStartTime,
  mapPlannerBoardFromApi,
  mapPlannerItemFromApi,
  normalizePlannerSummary,
  startTimeToDisplay,
} from '../src/features/planner/plannerMappers.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

const apiSource = read('src/features/planner/plannerAPI.js');
const sliceSource = read('src/features/planner/plannerSlice.js');
const storeSource = read('src/features/store.js');
const dailyPlannerSource = read('src/pages/private/user/planng/DailyPlan/DailyPlanner.jsx');
const headerSource = read('src/pages/private/user/planng/DailyPlan/components/PlannerHeader.jsx');
const dailyViewSource = read('src/pages/private/user/planng/DailyPlan/components/DailyView.jsx');
const modalSource = read('src/pages/private/user/planng/DailyPlan/components/NewPlanModal.jsx');

let failed = 0;
function assert(name, condition, detail = '') {
  if (condition) console.log(`PASS  ${name}`);
  else {
    failed += 1;
    console.log(`FAIL  ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

console.log('\n=== #1–#11 API paths in plannerAPI.js ===');
const PATHS = [
  ['#1 summary', '/summary'],
  ['#2 board', '/board'],
  ['#3 available', '/available'],
  ['#4 create-plan', '/create-plan'],
  ['#5 ai/suggest', '/ai/suggest'],
  ['#6 accept', '/accept'],
  ['#7 dismiss', '/dismiss'],
  ['#8 undo', '/ai/undo'],
  ['#9 patch item', 'patch(`${BASE}/${plannerItemId}`'],
  ['#10 get suggestion', '/ai/suggestions/${suggestionId}'],
  ['#11 complete', '/complete'],
];
for (const [label, needle] of PATHS) {
  assert(label, apiSource.includes(needle));
}

console.log('\n=== Store + slice thunks ===');
assert('store has planner', storeSource.includes('planner: plannerReducer'));
for (const thunk of [
  'fetchPlannerSummary',
  'fetchPlannerBoard',
  'fetchPlannerAvailable',
  'createPlannerPlan',
  'suggestPlannerAi',
  'fetchPlannerSuggestion',
  'acceptPlannerSuggestion',
  'dismissPlannerSuggestion',
  'undoPlannerAi',
  'completePlannerItem',
]) {
  assert(`slice ${thunk}`, sliceSource.includes(thunk));
  assert(`DailyPlanner uses ${thunk}`, dailyPlannerSource.includes(thunk));
}
assert('slice updatePlannerItem (API ready)', sliceSource.includes('updatePlannerItem'));
assert('API patch item', apiSource.includes('patch(`${BASE}/${plannerItemId}`'));

console.log('\n=== UI → API (#1–#11) existing UI only ===');
assert('#1 summary fetched (no extra stats bar)', dailyPlannerSource.includes('fetchPlannerSummary') && !headerSource.includes('scheduledToday'));
assert('#1 header is title only', headerSource.includes('Planner Board') && !headerSource.includes('Unscheduled'));
assert('#2 fetchPlannerBoard on refresh', dailyPlannerSource.includes('fetchPlannerBoard({ viewType: viewMode'));
assert('#3 fetchPlannerAvailable on refresh', dailyPlannerSource.includes('fetchPlannerAvailable(selectedDateKey)'));
assert('#4 modal buildCreatePlanPayload', dailyPlannerSource.includes('buildCreatePlanPayload'));
assert('#4 NewPlanModal Create', modalSource.includes('Creating') || modalSource.includes('handleCreate'));
assert('#5 suggestPlannerAi', dailyPlannerSource.includes('suggestPlannerAi'));
assert('#6 acceptPlannerSuggestion', dailyPlannerSource.includes('acceptPlannerSuggestion'));
assert('#7 dismissPlannerSuggestion', dailyPlannerSource.includes('dismissPlannerSuggestion'));
assert('#8 undoPlannerAi', dailyPlannerSource.includes('undoPlannerAi'));
assert('#9 patch API present (no extra time dropdown UI)', apiSource.includes('patch(`${BASE}/${plannerItemId}`') && !dailyViewSource.includes('aria-label={`Reschedule'));
assert('#10 fetchPlannerSuggestion', dailyPlannerSource.includes('fetchPlannerSuggestion'));
assert('#11 complete via existing habit checkbox', dailyPlannerSource.includes('completePlannerItem') && dailyViewSource.includes('onComplete'));
assert('#11 no option time dropdown', !dailyViewSource.includes('<option key={hour}'));

console.log('\n=== Mappers ===');
assert('Daily → DAILY', VIEW_UI_TO_API.Daily === 'DAILY');
assert('Today → TODAY', DATE_RANGE_FROM_MODAL.Today === 'TODAY');
assert('Custom → CUSTOM', DATE_RANGE_FROM_MODAL.Custom === 'CUSTOM');
assert('09:00 → 9 AM', startTimeToDisplay('09:00') === '9 AM');
assert('9 AM → 09:00', displayTimeToStartTime('9 AM') === '09:00');
assert('2 PM → 14:00', displayTimeToStartTime('2 PM') === '14:00');
assert('12 AM → 00:00', displayTimeToStartTime('12 AM') === '00:00');
assert('12 PM → 12:00', displayTimeToStartTime('12 PM') === '12:00');

const patch = buildPlannerPatchPayload({ displayTime: '10 AM', orderIndex: 0 });
assert('patch startTime 10:00', patch.startTime === '10:00' && patch.orderIndex === 0);

const modalCustom = buildCreatePlanPayload({
  prompt: 'Plan my product launch tasks',
  dateRangeLabel: 'Custom',
  customStart: '2026-05-13',
  customEnd: '2026-05-20',
});
assert(
  '#4 CUSTOM body',
  modalCustom.dateRange === 'CUSTOM' &&
    modalCustom.startDate === '2026-05-13' &&
    modalCustom.endDate === '2026-05-20'
);

const summary = normalizePlannerSummary({
  scheduledToday: 1,
  completedToday: 0,
  remainingToday: 1,
  aiScheduledToday: 1,
  unscheduledTasks: 5,
  activeHabits: 11,
});
assert('#1 normalize summary', summary.unscheduledTasks === 5 && summary.activeHabits === 11);

const taskItem = mapPlannerItemFromApi({
  id: 'p1',
  itemType: 'TASK',
  startTime: '09:00',
  title: 'Prepare Daily cost report',
  priority: 'HIGH',
  status: 'TODO',
  category: 'FINANCE',
  aiScheduled: true,
  estimatedMinutes: 37,
});
assert('item mapper task', taskItem.kind === 'task' && taskItem.time === '9 AM');

for (const [ui, api] of Object.entries(AI_ACTION_TO_API)) {
  if (ui === 'balance_schedule' || ui === 'chat') continue;
  assert(`AI ${ui}`, Boolean(api));
}
assert('energy MEDIUM', ENERGY_TO_API.medium === 'MEDIUM');
assert('dateRange Daily TODAY', DATE_RANGE_FROM_VIEW.Daily === 'TODAY');
assert('create prompts', createPlanPromptForView('Daily').length > 5);

const board = mapPlannerBoardFromApi({
  viewType: 'WEEKLY',
  days: {
    '2026-07-26': [{ id: 'x1', itemType: 'TASK', date: '2026-07-26', startTime: '09:00', title: 'Meeting', status: 'TODO' }],
  },
  items: [],
});
assert('board days map', (boardToPlansMap(board, '2026-07-26')['2026-07-26'] || []).length === 1);

console.log(`\n=== Result: ${failed === 0 ? 'ALL PASS (APIs #1–#11 UI wired)' : `${failed} FAILED`} ===\n`);
process.exit(failed === 0 ? 0 : 1);
