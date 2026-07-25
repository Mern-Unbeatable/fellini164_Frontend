/**
 * Tasks Board — filter + create/AI contract audit (TestAPIs.md Appendix D).
 * Run: node scripts/audit-tasks-board.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildTasksQueryParams,
  categoryToApi,
  dueTimeToApi,
  formatTaskSuggestionBody,
  mapCreatePayload,
  mapTaskAiSuggestionsToMessages,
  mapTaskFromApi,
  mapUpdatePayload,
  priorityToApi,
  statusApiFromUi,
} from '../src/features/tasks/tasksMappers.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const apiSource = fs.readFileSync(
  path.join(__dirname, '../src/features/tasks/tasksAPI.js'),
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

console.log('\n=== Create Task (Manual payload) ===');
const create = mapCreatePayload({
  title: 'Prepare Daily cost report',
  description: 'My today cost report',
  category: 'Finance',
  priority: 'High',
  dueDate: '2026-07-23',
  dueHour: 9,
  dueMinute: '00',
  duePeriod: 'AM',
  estMinutes: '36',
});
assert('Create: title', create.title === 'Prepare Daily cost report');
assert('Create: category FINANCE', create.category === 'FINANCE');
assert('Create: priority HIGH', create.priority === 'HIGH');
assert('Create: dueDate', create.dueDate === '2026-07-23');
assert('Create: dueTime 9:00', create.dueTime === '9:00');
assert('Create: estimatedMinutes 36', create.estimatedMinutes === 36);
assert('Create: no goalId by default', create.goalId === undefined);

console.log('\n=== dueTime 12h → API ===');
assert('9:00 AM → 9:00', dueTimeToApi(9, '00', 'AM') === '9:00');
assert('9:00 PM → 21:00', dueTimeToApi(9, '00', 'PM') === '21:00');
assert('12:00 AM → 0:00', dueTimeToApi(12, '00', 'AM') === '0:00');
assert('12:30 PM → 12:30', dueTimeToApi(12, '30', 'PM') === '12:30');

console.log('\n=== Status / Priority mapping ===');
assert('UI To Do → TODO', statusApiFromUi('To Do') === 'TODO');
assert('UI In Progress → IN_PROGRESS', statusApiFromUi('In Progress') === 'IN_PROGRESS');
assert('UI Done → COMPLETED', statusApiFromUi('Done') === 'COMPLETED');
assert('priority High → HIGH', priorityToApi('High') === 'HIGH');
assert('priority URGENT stays', priorityToApi('URGENT') === 'URGENT');

console.log('\n=== Status filter → GET /tasks?status= ===');
assert(
  'All Statuses: no status',
  buildTasksQueryParams({ filters: { Status: 'All Statuses' } }).status === undefined
);
assert(
  'To Do → TODO',
  buildTasksQueryParams({ filters: { Status: 'To Do' } }).status === 'TODO'
);
assert(
  'In Progress → IN_PROGRESS',
  buildTasksQueryParams({ filters: { Status: 'In Progress' } }).status === 'IN_PROGRESS'
);
assert(
  'Done → COMPLETED',
  buildTasksQueryParams({ filters: { Status: 'Done' } }).status === 'COMPLETED'
);

console.log('\n=== Priority filter → GET /tasks?priority= ===');
for (const [ui, api] of [
  ['Urgent', 'URGENT'],
  ['High', 'HIGH'],
  ['Medium', 'MEDIUM'],
  ['Low', 'LOW'],
]) {
  assert(
    `${ui} → ${api}`,
    buildTasksQueryParams({ filters: { Priority: ui } }).priority === api
  );
}

console.log('\n=== Category filter → GET /tasks?category= ===');
for (const ui of ['Career', 'Health', 'Finance', 'Personal', 'Education']) {
  const p = buildTasksQueryParams({ filters: { Category: ui } });
  assert(`Category ${ui} → ${categoryToApi(ui)}`, p.category === categoryToApi(ui));
}

console.log('\n=== Date filter → GET /tasks?dueFilter= ===');
assert(
  'Today → today',
  buildTasksQueryParams({ filters: { Date: 'Today' } }).dueFilter === 'today'
);
assert(
  'Tomorrow → tomorrow',
  buildTasksQueryParams({ filters: { Date: 'Tomorrow' } }).dueFilter === 'tomorrow'
);
assert(
  'This week → this_week',
  buildTasksQueryParams({ filters: { Date: 'This week' } }).dueFilter === 'this_week'
);
assert(
  'This month → this_month',
  buildTasksQueryParams({ filters: { Date: 'This month' } }).dueFilter === 'this_month'
);
assert(
  'Overdue → overdue',
  buildTasksQueryParams({ filters: { Date: 'Overdue' } }).dueFilter === 'overdue'
);

console.log('\n=== List query defaults ===');
const base = buildTasksQueryParams({});
assert('parentOnly true', base.parentOnly === true);
assert('page 1', base.page === 1);
assert('limit 50', base.limit === 50);
assert(
  'search param',
  buildTasksQueryParams({ search: 'report' }).search === 'report'
);

console.log('\n=== Source filter → GET /tasks?source= ===');
assert(
  'All Sources: no source',
  buildTasksQueryParams({ filters: { Source: 'All Sources' } }).source === undefined
);
assert(
  'Created by AI → AI_GENERATED',
  buildTasksQueryParams({ filters: { Source: 'Created by AI' } }).source === 'AI_GENERATED'
);
assert(
  'Created manually → MANUAL',
  buildTasksQueryParams({ filters: { Source: 'Created manually' } }).source === 'MANUAL'
);
const withSource = buildTasksQueryParams({
  filters: { Source: 'Created by AI', Status: 'To Do' },
});
assert('Source + Status both sent', withSource.source === 'AI_GENERATED' && withSource.status === 'TODO');

console.log('\n=== mapTaskFromApi ===');
const mapped = mapTaskFromApi({
  id: 't1',
  title: 'Schedule Meeting',
  description: 'Meet advisor',
  status: 'TODO',
  priority: 'MEDIUM',
  category: 'FINANCE',
  dueDate: '2026-07-10T00:00:00.000Z',
  estimatedMinutes: 30,
  aiGenerated: true,
  source: 'AI_GENERATED',
  goal: { id: 'g1', title: 'Retirement', status: 'ACTIVE' },
  goalId: 'g1',
  subtasks: [],
  _count: { subtasks: 0 },
});
assert('Mapped id', mapped.id === 't1');
assert('Mapped status To Do', mapped.status === 'To Do');
assert('Mapped column todo', mapped.columnKey === 'todo');
assert('Mapped source ai', mapped.source === 'ai');
assert('Mapped category Finance', mapped.category === 'Finance');
assert('Mapped linkedGoal', mapped.linkedGoal === 'Retirement');

console.log('\n=== Update payload goal unlink ===');
const unlink = mapUpdatePayload({ linkedGoal: '__none__' });
assert('Unlink goalId null', unlink.goalId === null);

console.log('\n=== API paths (tasksAPI.js vs Appendix D) ===');
const pathChecks = [
  ['GET summary', /get\(`\$\{BASE\}\/summary`\)/],
  ['POST create', /post\(BASE,/],
  ['POST ai/generate', /post\(`\$\{BASE\}\/ai\/generate`/],
  ['POST ai/suggest', /post\(`\$\{BASE\}\/\$\{taskId\}\/ai\/suggest`/],
  ['GET ai/suggestions', /get\(`\$\{BASE\}\/\$\{taskId\}\/ai\/suggestions`/],
  ['POST accept', /post\(`\$\{BASE\}\/ai\/suggestions\/\$\{suggestionId\}\/accept`\)/],
  ['POST dismiss', /post\(`\$\{BASE\}\/ai\/suggestions\/\$\{suggestionId\}\/dismiss`\)/],
  ['POST undo', /post\(`\$\{BASE\}\/\$\{taskId\}\/ai\/undo`\)/],
  ['GET subtasks', /get\(`\$\{BASE\}\/\$\{taskId\}\/subtasks`\)/],
  ['PATCH task', /patch\(`\$\{BASE\}\/\$\{taskId\}`,/],
  ['PATCH status', /patch\(`\$\{BASE\}\/\$\{taskId\}\/status`/],
  ['POST complete', /post\(`\$\{BASE\}\/\$\{taskId\}\/complete`/],
  ['POST skip', /post\(`\$\{BASE\}\/\$\{taskId\}\/skip`/],
  ['DELETE task', /delete\(`\$\{BASE\}\/\$\{taskId\}`\)/],
];
for (const [name, re] of pathChecks) {
  assert(name, re.test(apiSource));
}
assert('BASE /api/v1/tasks', apiSource.includes("const BASE = '/api/v1/tasks'"));

console.log('\n=== AI suggest body formatting (IMPROVE / BREAKDOWN) ===');
const improveBody = formatTaskSuggestionBody({
  message: 'Sure, I can update this task. This will:\n• improve the title and description',
  proposedTask: {
    title: 'Create Daily Expense Report',
    description: "Compile a detailed report of today's expenses.",
  },
  proposedSubtasks: [],
});
assert('Improve shows proposed title', improveBody.includes('Create Daily Expense Report'));
assert('Improve shows proposed description', improveBody.includes('Compile a detailed report'));

const breakdownBody = formatTaskSuggestionBody({
  message: 'Sure, I can update this task. This will:\n• add subtasks',
  proposedSubtasks: [
    { title: 'Prepare Yoga Space' },
    { title: 'Warm-Up' },
    { title: 'Follow Yoga Routine' },
  ],
});
assert('Breakdown lists proposed subtasks', breakdownBody.includes('Proposed subtasks (3)'));
assert('Breakdown includes Warm-Up', breakdownBody.includes('Warm-Up'));

console.log('\n=== AI suggestions history → chat (Yes apply / Undo) ===');
const pendingId = 'sug-pending-1';
const acceptedId = 'sug-accepted-1';
const historyMsgs = mapTaskAiSuggestionsToMessages([
  {
    id: pendingId,
    status: 'PENDING',
    action: 'BREAKDOWN',
    message: 'Sure, I can update this task.',
    proposedSubtasks: [{ title: 'A' }, { title: 'B' }],
    createdAt: '2026-07-25T10:00:00.000Z',
  },
  {
    id: acceptedId,
    status: 'ACCEPTED',
    action: 'BREAKDOWN',
    message: 'Sure, I can update this task.',
    proposedSubtasks: [{ title: 'X' }],
    createdAt: '2026-07-25T11:00:00.000Z',
  },
]);
assert(
  'Pending keeps Yes/No suggestion payload',
  historyMsgs.some((m) => m.suggestionId === pendingId && m.suggestion)
);
assert(
  'Accepted synthesizes Yes, apply bubble',
  historyMsgs.some((m) => m.role === 'user' && m.text === 'Yes, apply' && m.id.includes(acceptedId))
);
assert(
  'Accepted Done message exists',
  historyMsgs.some((m) => m.id === `done-${acceptedId}`)
);
assert(
  'Latest accepted gets Undo',
  historyMsgs.some((m) => m.id === `done-${acceptedId}` && m.canUndo === true)
);
assert(
  'Array envelope parse (Goals-style)',
  mapTaskAiSuggestionsToMessages([{ id: 'x', status: 'PENDING', message: 'hi' }]).length >= 1
);
assert(
  'Nested { suggestions } envelope',
  mapTaskAiSuggestionsToMessages({
    suggestions: [{ id: 'y', status: 'PENDING', message: 'hi' }],
  }).some((m) => m.suggestionId === 'y')
);
assert(
  'Nested { data: { suggestions } } envelope',
  mapTaskAiSuggestionsToMessages({
    data: { suggestions: [{ id: 'z', status: 'PENDING', message: 'hi' }] },
  }).some((m) => m.suggestionId === 'z')
);

console.log('\n=== Detail route (refresh-safe) ===');
const routerSource = fs.readFileSync(
  path.join(__dirname, '../src/router/router.jsx'),
  'utf8'
);
assert(
  'Route /user/tasks/:taskId',
  routerSource.includes('path="/user/tasks/:taskId"')
);
assert('TaskDetailPage import', routerSource.includes('TaskDetailPage'));

console.log('\n=== Summary ===');
if (failed === 0) {
  console.log('\nALL PASS\n');
  process.exit(0);
}
console.log(`\n${failed} FAILED\n`);
process.exit(1);
