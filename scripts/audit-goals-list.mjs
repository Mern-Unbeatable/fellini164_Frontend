/**
 * TestAPIs.md §1–§3 audit for GET /goals (list + filters).
 * Validates frontend mappers against Postman response samples (no invented fields).
 */
import {
  buildGoalsQueryParams,
  mapGoalFromApi,
  normalizeBoardSummary,
  parseGoalsListResponse,
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

// --- §1 Query params (exact Postman contract) ---
assert(
  'Query: default page/limit',
  JSON.stringify(buildGoalsQueryParams({})) === JSON.stringify({ page: 1, limit: 50 })
);

assert(
  'Query: status=ACTIVE + priorityLevel=HIGH',
  JSON.stringify(
    buildGoalsQueryParams({
      filters: { Status: 'Active', Priority: 'High' },
    })
  ) ===
    JSON.stringify({ page: 1, limit: 50, status: 'ACTIVE', priorityLevel: 'HIGH' })
);

assert(
  'Query: search + page + limit',
  JSON.stringify(
    buildGoalsQueryParams({ search: 'career', page: 1, limit: 10 })
  ) === JSON.stringify({ page: 1, limit: 10, search: 'career' })
);

assert(
  'Query: dueFilter=overdue',
  buildGoalsQueryParams({ filters: { Date: 'Overdue' } }).dueFilter === 'overdue'
);

assert(
  'Query: category=CAREER',
  buildGoalsQueryParams({ filters: { Category: 'Career' } }).category === 'CAREER'
);

assert(
  'Query: source=AI',
  buildGoalsQueryParams({ filters: { Source: 'Created by AI' } }).source === 'AI'
);

assert(
  'Query: source=MANUAL',
  buildGoalsQueryParams({ filters: { Source: 'Created manually' } }).source === 'MANUAL'
);

assert(
  'Query: progress 26-50%',
  JSON.stringify(
    buildGoalsQueryParams({ filters: { Progress: '26-50%' } })
  ).includes('"minProgress":26') &&
    JSON.stringify(
      buildGoalsQueryParams({ filters: { Progress: '26-50%' } })
    ).includes('"maxProgress":50')
);

assert(
  'Query: All Statuses omits status',
  buildGoalsQueryParams({ filters: { Status: 'All Statuses' } }).status === undefined
);

// --- §3 Postman list envelope (user-provided) ---
const listEnvelope = {
  success: true,
  count: 5,
  data: [
    {
      id: '3fb47fa4-7fa0-4f44-ba6a-1f5b03d7ce2d',
      title: 'Finish the work',
      description: 'Stick to your professional growth plan or engage in a skill-building session.',
      category: 'CAREER',
      status: 'ACTIVE',
      priority: 5,
      priorityLevel: 'MEDIUM',
      targetDate: '2026-05-27T00:00:00.000Z',
      source: 'MANUAL',
      progress: 0,
      completedAt: null,
      tasks: [],
      habits: [],
      _count: { tasks: 0, habits: 0 },
    },
    {
      id: '6434345e-0352-4485-9b6c-1fdaf07f9b88',
      title: 'Develop Math Learning Path for Career Advancement',
      category: 'CAREER',
      status: 'ACTIVE',
      priorityLevel: 'MEDIUM',
      targetDate: '2026-07-10T00:00:00.000Z',
      source: 'AI',
      progress: 0,
      _count: { tasks: 0, habits: 0 },
    },
  ],
  summary: {
    active: 3,
    paused: 0,
    completedThisMonth: 2,
    total: 5,
  },
  pagination: {
    page: 1,
    limit: 50,
    total: 5,
    totalPages: 1,
  },
};

const parsed = parseGoalsListResponse(listEnvelope);
assert('Parse: items length = 2 from sample', parsed.items.length === 2);
assert('Parse: count = 5', parsed.count === 5);
assert('Parse: keeps summary.active=3', parsed.summary?.active === 3);
assert('Parse: keeps pagination.limit=50', parsed.pagination?.limit === 50);

const mappedManual = mapGoalFromApi(listEnvelope.data[0]);
assert('Map: id preserved', mappedManual.id === listEnvelope.data[0].id);
assert('Map: category CAREER → Career', mappedManual.category === 'Career');
assert('Map: status ACTIVE → active', mappedManual.status === 'active');
assert('Map: priorityLevel MEDIUM → MEDIUM', mappedManual.priority === 'MEDIUM');
assert('Map: source MANUAL → manual', mappedManual.source === 'manual');
assert('Map: _count.tasks → tasks=0', mappedManual.tasks === 0);
assert('Map: progress=0', mappedManual.progress === 0);
assert('Map: targetDate ISO date slice', mappedManual.targetDate === '2026-05-27');

const mappedAi = mapGoalFromApi(listEnvelope.data[1]);
assert('Map: source AI → ai', mappedAi.source === 'ai');

const stats = normalizeBoardSummary(listEnvelope.summary);
assert('Summary: active=3', stats.active === 3);
assert('Summary: paused=0', stats.paused === 0);
assert('Summary: completedThisMonth=2', stats.completedThisMonth === 2);

// Empty filtered list (Postman: status=ACTIVE&priorityLevel=HIGH → count 0)
const emptyEnvelope = {
  success: true,
  count: 0,
  data: [],
  summary: { active: 3, paused: 0, completedThisMonth: 2, total: 5 },
  pagination: { page: 1, limit: 50, total: 0, totalPages: 0 },
};
const emptyParsed = parseGoalsListResponse(emptyEnvelope);
assert('Empty filter: items=[]', emptyParsed.items.length === 0);
assert('Empty filter: summary still present', emptyParsed.summary?.active === 3);

console.log('\n---');
if (failed) {
  console.log(`RESULT: ${failed} FAIL(s)`);
  process.exit(1);
}
console.log('RESULT: ALL PASS (GET /goals contract vs frontend mappers)');
