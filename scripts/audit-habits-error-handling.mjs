/**
 * Habits Board — Appendix C path + error-handling spot-check (TestAPIs.md).
 * Run: node scripts/audit-habits-error-handling.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const api = fs.readFileSync(path.join(root, 'src/features/habits/habitsAPI.js'), 'utf8');
const slice = fs.readFileSync(path.join(root, 'src/features/habits/habitsSlice.js'), 'utf8');
const habits = fs.readFileSync(
  path.join(root, 'src/pages/private/user/focus/Habits/Habits.jsx'),
  'utf8'
);
const row = fs.readFileSync(
  path.join(root, 'src/pages/private/user/focus/Habits/components/HabitRow.jsx'),
  'utf8'
);

let failed = 0;
function assert(name, condition, detail = '') {
  if (condition) console.log(`PASS  ${name}`);
  else {
    failed += 1;
    console.log(`FAIL  ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

console.log('\n=== Appendix C paths (habitsAPI.js) ===');
assert('BASE /api/v1/habits', api.includes("const BASE = '/api/v1/habits'"));
assert('GET summary', api.includes('/summary'));
assert('GET stats/overview', api.includes('/stats/overview'));
assert('POST ai/generate', api.includes('/ai/generate'));
assert('PATCH pause toggle', api.includes('/pause'));
assert(
  'does not call /activate endpoint',
  !/\$\{BASE\}\/\$\{habitId\}\/activate/.test(api) && !api.includes("`${BASE}/${habitId}/activate`")
);
assert('PATCH complete-status', api.includes('/complete-status'));
assert('POST ai/improve', api.includes('/ai/improve'));
assert('GET history', api.includes('/history'));
assert('complete today uses POST', /completeHabitTodayApi[\s\S]*?\.post\(/.test(api));
assert('undo uses DELETE .../complete', /undoHabitCompletionApi[\s\S]*?\.delete\(/.test(api));
assert('deleteHabitApi uses DELETE', /deleteHabitApi[\s\S]*?\.delete\(/.test(api));

console.log('\n=== Error toasts (habitsSlice.js) ===');
const errorMsgs = [
  'Failed to load habits',
  'Failed to create habit',
  'Failed to generate habit',
  'Failed to update habit',
  'Failed to complete habit',
  'Failed to undo completion',
  'Failed to mark habit completed',
  'Failed to update habit status',
  'Failed to improve habit',
  'Failed to delete habit',
];
for (const msg of errorMsgs) {
  assert(`toast.error: ${msg}`, slice.includes(`toast.error`) && slice.includes(msg));
}
assert("success: Habit completed", slice.includes("toast.success('Habit completed')"));
assert("success: Habit paused", slice.includes("toast.success('Habit paused')"));
assert("success: Habit activated", slice.includes("toast.success('Habit activated')"));

console.log('\n=== Soft / intentional gaps ===');
assert(
  'summary soft-fail (catch → local stats)',
  /fetchHabitsSummary[\s\S]*?catch \{/.test(slice)
);
const statsStart = slice.indexOf('export const fetchHabitsStatsOverview');
const createStart = slice.indexOf('export const createHabit');
const statsBlock =
  statsStart >= 0 && createStart > statsStart ? slice.slice(statsStart, createStart) : '';
assert('stats overview block found', statsBlock.length > 0);
assert(
  'stats overview: soft reject (no toast.error)',
  statsBlock.includes('rejectWithValue') && !statsBlock.includes('toast.error')
);

const improveEmpty = slice.match(
  /improveHabit[\s\S]*?if \(!trimmed\) return rejectWithValue\('Enter improvement instructions'\)/
);
assert(
  'improve empty instructions: reject (modal should validate)',
  Boolean(improveEmpty)
);

console.log('\n=== Board UI wiring ===');
assert('shared DeleteConfirmModal', habits.includes('DeleteConfirmModal'));
assert('delete confirm → deleteHabit', habits.includes('handleConfirmDeleteHabit'));
assert('Complete → markHabitCompleted', habits.includes('markHabitCompleted'));
assert('Pause → updateHabitStatus', habits.includes('updateHabitStatus'));
assert('Complete disabled when completed', row.includes('disabled={isCompleted}'));
assert('Paused ash opacity-50', row.includes('opacity-50'));

console.log(`\n${failed === 0 ? 'ALL PASS' : `${failed} FAILED`}`);
process.exit(failed === 0 ? 0 : 1);
