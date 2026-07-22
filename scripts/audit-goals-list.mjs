/**
 * TestAPIs.md audit for GET /goals (list + filters + search).
 * Validates frontend mappers against Postman response samples (2026-07-22).
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

// --- Query params (exact Postman contract) ---
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
  ) === JSON.stringify({ page: 1, limit: 50, status: 'ACTIVE', priorityLevel: 'HIGH' })
);

assert(
  'Query: search + page + limit',
  JSON.stringify(buildGoalsQueryParams({ search: 'career', page: 1, limit: 10 })) ===
    JSON.stringify({ page: 1, limit: 10, search: 'career' })
);

assert(
  'Query: dueFilter=overdue',
  buildGoalsQueryParams({ filters: { Date: 'Overdue' } }).dueFilter === 'overdue'
);

assert(
  'Query: dueFilter=this_week',
  buildGoalsQueryParams({ filters: { Date: 'This week' } }).dueFilter === 'this_week'
);

assert(
  'Query: category=CAREER',
  buildGoalsQueryParams({ filters: { Category: 'Career' } }).category === 'CAREER'
);

assert(
  'Query: category=HEALTH',
  buildGoalsQueryParams({ filters: { Category: 'Health' } }).category === 'HEALTH'
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
  JSON.stringify(buildGoalsQueryParams({ filters: { Progress: '26-50%' } })).includes(
    '"minProgress":26'
  ) &&
    JSON.stringify(buildGoalsQueryParams({ filters: { Progress: '26-50%' } })).includes(
      '"maxProgress":50'
    )
);

assert(
  'Query: All Statuses omits status',
  buildGoalsQueryParams({ filters: { Status: 'All Statuses' } }).status === undefined
);

assert(
  'Query: priority URGENT',
  buildGoalsQueryParams({ filters: { Priority: 'Urgent' } }).priorityLevel === 'URGENT'
);

// --- Bare list envelope (Postman 2026-07-22, count 7) ---
const listEnvelope = {
  success: true,
  count: 7,
  data: [
    {
      id: 'cc1fe871-0fd7-480d-9db8-ed53cc4f8165',
      title: 'Improve Physical Fitness and Health',
      description: 'Commit to a regular exercise routine and healthy eating habits.',
      category: 'HEALTH',
      status: 'ACTIVE',
      priority: 5,
      priorityLevel: 'MEDIUM',
      targetDate: '2022-12-15T00:00:00.000Z',
      source: 'AI',
      progress: 0,
      completedAt: null,
      tasks: [],
      habits: [],
      _count: { tasks: 0, habits: 0 },
    },
    {
      id: '5065a29a-39bc-4e50-8a56-d4dc2bacb81e',
      title: 'Develop Math Learning Path',
      category: 'CAREER',
      status: 'ACTIVE',
      priorityLevel: 'MEDIUM',
      targetDate: '2026-07-10T00:00:00.000Z',
      source: 'AI',
      progress: 0,
      _count: { tasks: 0, habits: 0 },
    },
    {
      id: '3fb47fa4-7fa0-4f44-ba6a-1f5b03d7ce2d',
      title: 'Finish the work',
      category: 'CAREER',
      status: 'COMPLETED',
      priorityLevel: 'MEDIUM',
      targetDate: '2026-05-27T00:00:00.000Z',
      source: 'MANUAL',
      progress: 0,
      completedAt: '2026-07-21T11:33:20.854Z',
      _count: { tasks: 0, habits: 0 },
    },
  ],
  summary: {
    active: 4,
    paused: 0,
    completedThisMonth: 3,
    total: 7,
  },
  pagination: {
    page: 1,
    limit: 50,
    total: 7,
    totalPages: 1,
  },
};

const parsed = parseGoalsListResponse(listEnvelope);
assert('Parse: items length = 3 from sample slice', parsed.items.length === 3);
assert('Parse: count = 7', parsed.count === 7);
assert('Parse: keeps summary.active=4', parsed.summary?.active === 4);
assert('Parse: keeps pagination.limit=50', parsed.pagination?.limit === 50);

const mappedHealth = mapGoalFromApi(listEnvelope.data[0]);
assert('Map: id preserved', mappedHealth.id === listEnvelope.data[0].id);
assert('Map: category HEALTH → Health', mappedHealth.category === 'Health');
assert('Map: status ACTIVE → active', mappedHealth.status === 'active');
assert('Map: priorityLevel MEDIUM → MEDIUM', mappedHealth.priority === 'MEDIUM');
assert('Map: source AI → ai', mappedHealth.source === 'ai');
assert('Map: _count.tasks → tasks=0', mappedHealth.tasks === 0);
assert('Map: progress=0', mappedHealth.progress === 0);

const mappedCompleted = mapGoalFromApi(listEnvelope.data[2]);
assert('Map: COMPLETED → completed', mappedCompleted.status === 'completed');
assert('Map: source MANUAL → manual', mappedCompleted.source === 'manual');
assert('Map: completedDate set', Boolean(mappedCompleted.completedDate));

const stats = normalizeBoardSummary(listEnvelope.summary);
assert('Summary: active=4', stats.active === 4);
assert('Summary: paused=0', stats.paused === 0);
assert('Summary: completedThisMonth=3', stats.completedThisMonth === 3);

// Empty filtered list (status=ACTIVE&priorityLevel=HIGH → count 0)
const emptyEnvelope = {
  success: true,
  count: 0,
  data: [],
  summary: { active: 4, paused: 0, completedThisMonth: 3, total: 7 },
  pagination: { page: 1, limit: 50, total: 0, totalPages: 0 },
};
const emptyParsed = parseGoalsListResponse(emptyEnvelope);
assert('Empty filter: items=[]', emptyParsed.items.length === 0);
assert('Empty filter: summary still present', emptyParsed.summary?.active === 4);

// Search sample
const searchEnvelope = {
  success: true,
  count: 3,
  data: [
    {
      id: '5065a29a-39bc-4e50-8a56-d4dc2bacb81e',
      title: 'Develop Math Learning Path',
      category: 'CAREER',
      status: 'ACTIVE',
      priorityLevel: 'MEDIUM',
      source: 'AI',
      progress: 0,
      _count: { tasks: 0, habits: 0 },
    },
  ],
  summary: { active: 4, paused: 0, completedThisMonth: 3, total: 7 },
  pagination: { page: 1, limit: 10, total: 3, totalPages: 1 },
};
const searchParsed = parseGoalsListResponse(searchEnvelope);
assert('Search: count=3', searchParsed.count === 3);
assert('Search: pagination.limit=10', searchParsed.pagination?.limit === 10);

// Overdue sample
const overdueEnvelope = {
  success: true,
  count: 4,
  data: listEnvelope.data.slice(0, 2),
  summary: { active: 4, paused: 0, completedThisMonth: 3, total: 7 },
  pagination: { page: 1, limit: 50, total: 4, totalPages: 1 },
};
assert('Overdue: parse count=4', parseGoalsListResponse(overdueEnvelope).count === 4);

console.log('\n---');
if (failed) {
  console.log(`RESULT: ${failed} FAIL(s)`);
  process.exit(1);
}
console.log('RESULT: ALL PASS (GET /goals filters/search contract — FULFILLED)');
