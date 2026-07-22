/**
 * TestAPIs.md §A.7 / §A.8 / §B.2 / §B.3
 * Audit GET /tasks + GET /habits link-picker contracts (Postman samples).
 */
import {
  normalizeLinkPickerOptions,
} from '../src/features/goals/goalsMappers.js';

let failed = 0;
function assert(name, condition, detail = '') {
  if (condition) {
    console.log(`PASS  ${name}`);
  } else {
    failed += 1;
    console.log(`FAIL  ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

/** Mirrors fetchTasksForLinkApi default query (no goalId). */
function tasksLinkPickerParams(overrides = {}) {
  const query = {
    parentOnly: true,
    page: 1,
    limit: 50,
    ...overrides,
  };
  Object.keys(query).forEach((key) => {
    if (query[key] === undefined || query[key] === null || query[key] === '') {
      delete query[key];
    }
  });
  return query;
}

/** Mirrors fetchHabitsForLinkApi default query (no goalId). */
function habitsLinkPickerParams(overrides = {}) {
  const query = {
    page: 1,
    limit: 50,
    isActive: true,
    ...overrides,
  };
  Object.keys(query).forEach((key) => {
    if (query[key] === undefined || query[key] === null || query[key] === '') {
      delete query[key];
    }
  });
  return query;
}

function parseTasksEnvelope(body) {
  if (Array.isArray(body?.tasks)) return body.tasks;
  if (Array.isArray(body?.data)) return body.data;
  if (Array.isArray(body)) return body;
  return [];
}

function parseHabitsEnvelope(body) {
  if (Array.isArray(body?.habits)) return body.habits;
  if (Array.isArray(body?.data)) return body.data;
  if (Array.isArray(body)) return body;
  return [];
}

// --- Default query (TestAPIs B.2 / B.3) ---
const taskParams = tasksLinkPickerParams();
assert('Tasks query: parentOnly=true', taskParams.parentOnly === true);
assert('Tasks query: page=1', taskParams.page === 1);
assert('Tasks query: limit=50', taskParams.limit === 50);
assert('Tasks query: no goalId by default', taskParams.goalId === undefined);

const habitParams = habitsLinkPickerParams();
assert('Habits query: isActive=true', habitParams.isActive === true);
assert('Habits query: page=1', habitParams.page === 1);
assert('Habits query: limit=50', habitParams.limit === 50);
assert('Habits query: no goalId by default', habitParams.goalId === undefined);

// --- Empty Postman samples ---
const emptyTasks = {
  success: true,
  count: 0,
  tasks: [],
  pagination: { page: 1, limit: 50, total: 0, totalPages: 0 },
};
assert('Tasks empty envelope → []', parseTasksEnvelope(emptyTasks).length === 0);
assert(
  'Tasks empty → picker options []',
  normalizeLinkPickerOptions(parseTasksEnvelope(emptyTasks)).length === 0
);

const emptyHabits = {
  success: true,
  count: 0,
  habits: [],
  pagination: { page: 1, limit: 50, total: 0, totalPages: 0 },
};
assert('Habits empty envelope → []', parseHabitsEnvelope(emptyHabits).length === 0);

// --- Non-empty samples (UUID only) ---
const tasksSample = {
  success: true,
  count: 1,
  tasks: [
    {
      id: '11111111-1111-4111-8111-111111111111',
      title: 'Draft workout plan',
      status: 'TODO',
      source: 'AI',
    },
    {
      id: 'not-a-uuid',
      title: 'Should be dropped',
      status: 'TODO',
    },
  ],
  pagination: { page: 1, limit: 50, total: 1, totalPages: 1 },
};
const taskOpts = normalizeLinkPickerOptions(parseTasksEnvelope(tasksSample));
assert('Tasks: keeps UUID only', taskOpts.length === 1);
assert('Tasks: label from title', taskOpts[0].label === 'Draft workout plan');
assert('Tasks: AI suggested', taskOpts[0].aiSuggested === true);

const habitsSample = {
  success: true,
  count: 1,
  habits: [
    {
      id: '22222222-2222-4222-8222-222222222222',
      title: 'Drink Water',
      status: 'ACTIVE',
      source: 'MANUAL',
    },
  ],
  pagination: { page: 1, limit: 50, total: 1, totalPages: 1 },
};
const habitOpts = normalizeLinkPickerOptions(parseHabitsEnvelope(habitsSample));
assert('Habits: one option', habitOpts.length === 1);
assert('Habits: label', habitOpts[0].label === 'Drink Water');
assert('Habits: not AI', habitOpts[0].aiSuggested === false);

assert(
  'Tasks: COMPLETED maps to completed badge',
  normalizeLinkPickerOptions([
    {
      id: '33333333-3333-4333-8333-333333333333',
      title: 'Done item',
      status: 'COMPLETED',
    },
  ])[0].status === 'completed'
);

console.log('\n---');
if (failed) {
  console.log(`RESULT: ${failed} FAIL(s)`);
  process.exit(1);
}
console.log('RESULT: ALL PASS (GET /tasks + /habits link-picker — TestAPIs A.7/A.8)');
