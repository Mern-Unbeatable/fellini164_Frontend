export const EXERCISE_ROUTINE_SUBTASKS = [
  { id: 'st-1', label: 'Warm Up', minutes: 5, completed: false },
  { id: 'st-2', label: 'Cardio', minutes: 30, completed: false },
  { id: 'st-3', label: 'Strength Training', minutes: 15, completed: false },
  { id: 'st-4', label: 'Stretching', minutes: 10, completed: false },
];

export function generateSubtasksFromTitle(title) {
  const lower = (title || '').toLowerCase();
  if (lower.includes('exercise') || lower.includes('workout') || lower.includes('routine')) {
    return EXERCISE_ROUTINE_SUBTASKS.map((s, i) => ({
      ...s,
      id: `gen-${Date.now()}-${i}`,
      completed: false,
    }));
  }
  return [
    { id: `gen-${Date.now()}-0`, label: 'Plan the approach', minutes: 15, completed: false },
    { id: `gen-${Date.now()}-1`, label: 'Execute main work', minutes: 30, completed: false },
    { id: `gen-${Date.now()}-2`, label: 'Review and wrap up', minutes: 15, completed: false },
  ];
}

export function formatStepsProgress(subtasks) {
  if (!subtasks?.length) return null;
  const done = subtasks.filter((s) => s.completed).length;
  return `${done}/${subtasks.length} Steps`;
}
