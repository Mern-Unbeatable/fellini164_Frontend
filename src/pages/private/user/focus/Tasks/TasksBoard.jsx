import {
  Plus,
  Search,
  Sparkles,
  ListTodo,
  CheckCircle2,
  Clock,
  TrendingUp,
  Target,
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import TaskFormModal from './components/TaskFormModal';
import TaskDetailPanel, { TaskDetailDrawer } from './components/TaskDetailPanel';
import { TaskCard, GhostTaskCard } from './components/TaskCard';
import {
  FILTER_CONFIG,
  DEFAULT_FILTERS,
  taskMatchesFilters,
  FilterDropdown,
  PRIORITY_LABELS,
} from './components/TaskFilters';
import TypewriterText from '../../../../../components/ui/TypewriterText';
import { EXERCISE_ROUTINE_SUBTASKS, formatStepsProgress } from './utils/subtasks';

const TASKS_SUBTITLE_PHRASES = [
  'Plan, prioritize, and complete your tasks in one place...',
  'Let AI suggest tasks based on your goals and habits...',
  'Break big goals into manageable steps with AI...',
  'Stay on top of deadlines across all your columns...',
];

const STATUS_TO_COLUMN = { 'To Do': 'todo', 'In Progress': 'inProgress', Done: 'done' };

function formatDate(iso) {
  if (!iso) return 'No date';
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// PRIORITY_STYLES imported from TaskCard

// PRIORITY_LABELS imported from TaskFilters

// AI-suggested ghost tasks — shown only when the entire board has no real tasks.
const GHOST_TASKS = [
  {
    id: 'ghost-1',
    priority: 'URGENT',
    title: 'Exercise Routine',
    description: 'Follow your fitness routine or do a workout session.',
    tags: [
      { label: 'Career' },
      { label: 'Improve Rate', icon: Target },
      { label: '60 Min', icon: Clock },
      { label: '0/4 Steps' },
    ],
    due: 'Today',
  },
  {
    id: 'ghost-2',
    priority: 'HIGH',
    title: 'Deliver message',
    description:
      'Communicate the expectations regarding maintaining a calm environment to the relevant individuals in a direct and respectful manner.',
    tags: [{ label: 'Health' }, { label: '0/8 Steps' }],
    due: 'Today',
  },
  {
    id: 'ghost-3',
    priority: 'MEDIUM',
    title: 'Complete Work Task',
    description: 'Work on the main career task assigned for today.',
    tags: [{ label: 'Finance' }, { label: '30 Min', icon: Clock }],
    due: 'Tomorrow',
  },
];

// Alternate ghost content for Regenerate suggestion (Rules #2) — same ids, new placement copy.
const GHOST_REGENERATIONS = {
  'ghost-1': {
    priority: 'HIGH',
    title: 'Morning Mobility Session',
    description: 'Start with light stretches and a short cardio warm-up to build consistency.',
    tags: [
      { label: 'Health' },
      { label: 'Improve Rate', icon: Target },
      { label: '30 Min', icon: Clock },
      { label: '0/3 Steps' },
    ],
    due: 'Today',
  },
  'ghost-2': {
    priority: 'MEDIUM',
    title: 'Send weekly status update',
    description: 'Share progress, blockers, and next steps with your team in a clear message.',
    tags: [{ label: 'Career' }, { label: '0/4 Steps' }],
    due: 'Today',
  },
  'ghost-3': {
    priority: 'HIGH',
    title: 'Prep tomorrow priorities',
    description: 'List the top three outcomes for tomorrow and block focus time for each.',
    tags: [{ label: 'Personal' }, { label: '20 Min', icon: Clock }],
    due: 'Tomorrow',
  },
};

// FILTER_CONFIG imported from TaskFilters

// Step 3 populated board — Figma frame 3 sample data.
const INITIAL_COLUMNS = {
  todo: [
    {
      id: 'task-1',
      priority: 'URGENT',
      title: 'Exercise Routine',
      description: 'Follow your fitness routine or do a workout session.',
      tags: [
        { label: 'Career' },
        { label: 'Improve Rate', icon: Target, linkedGoal: true },
        { label: '60 Min', icon: Clock },
      ],
      steps: '0/4 Steps',
      due: 'Today',
      source: 'ai',
      category: 'Career',
      linkedGoal: 'Improve Rate',
      status: 'To Do',
      subtasks: EXERCISE_ROUTINE_SUBTASKS.map((s) => ({ ...s })),
    },
    {
      id: 'task-2',
      priority: 'HIGH',
      title: 'Deliver message',
      description:
        'Communicate the expectations regarding maintaining a calm environment to the relevant individuals in a direct and respectful manner.',
      tags: [{ label: 'Health' }],
      steps: '4/8 Steps',
      due: 'May 12, 2026',
      overdueDays: 2,
      source: 'manual',
      category: 'Health',
      status: 'To Do',
    },
    {
      id: 'task-3',
      priority: 'MEDIUM',
      title: 'Complete Work Task',
      description: 'Work on the main career task assigned for today.',
      tags: [{ label: 'Finance' }, { label: '30 Min', icon: Clock }],
      due: 'Tomorrow',
      source: 'manual',
      category: 'Finance',
      status: 'To Do',
    },
    {
      id: 'task-4',
      priority: 'HIGH',
      title: 'Morning Workout Routine',
      description:
        'Communicate the expectations regarding maintaining a calm environment to the relevant individuals in a direct and respectful manner.',
      tags: [{ label: 'Health' }, { label: '10 Min', icon: Clock }],
      due: 'May 13',
      overdueDays: 1,
      source: 'manual',
      category: 'Health',
      status: 'To Do',
    },
  ],
  inProgress: [
    {
      id: 'task-5',
      priority: 'LOW',
      title: 'Update Resume and LinkedIn Profile',
      description:
        'Communicate the expectations regarding maintaining a calm environment to the relevant individuals in a direct and respectful manner.',
      tags: [{ label: 'Health' }, { label: '25 Min', icon: Clock }],
      due: 'May 13, 2026',
      source: 'manual',
      category: 'Health',
      status: 'In Progress',
    },
  ],
  done: [
    {
      id: 'task-6',
      priority: 'MEDIUM',
      title: 'Focus Time Block',
      description: 'Work on the main career task assigned for today.',
      tags: [{ label: 'Finance' }, { label: '40 Min', icon: Clock }],
      steps: '3/3 Steps',
      completed: 'May 9, 2026',
      source: 'manual',
      category: 'Finance',
      status: 'Done',
    },
    {
      id: 'task-7',
      priority: 'URGENT',
      title: 'Implement stress-relief strategies',
      description:
        'Communicate the expectations regarding maintaining a calm environment to the relevant individuals in a direct and respectful manner.',
      tags: [{ label: 'Career' }, { label: 'New Job', icon: Target, linkedGoal: true }],
      completed: 'May 8, 2026',
      source: 'ai',
      category: 'Career',
      linkedGoal: 'New Job',
      status: 'Done',
    },
  ],
};// TaskCard, GhostTaskCard and menus refactored to TaskCard.jsx

// FilterDropdown imported from TaskFilters

function EmptyColumnPlaceholder({ text }) {
  return (
    <div className="flex w-full items-center justify-center pt-2.5">
      <p className="flex-1 text-center text-sm font-medium text-[#c2c2c2] md:text-base dark:text-gray-500">{text}</p>
    </div>
  );
}

const COLUMNS = [
  { key: 'todo', label: 'To Do', icon: ListTodo },
  { key: 'inProgress', label: 'In Progress', icon: TrendingUp },
  { key: 'done', label: 'Done', icon: CheckCircle2 },
];

function taskMatchesSearch(task, query) {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const haystack = [
    task.title,
    task.description,
    task.category,
    task.status,
    task.due,
    task.completed,
    task.steps,
    task.priority,
    PRIORITY_LABELS[task.priority],
    task.source === 'ai' ? 'ai created by ai' : 'manual created manually',
    ...(task.tags?.map((tag) => tag.label) ?? []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return haystack.includes(q);
}

// DEFAULT_FILTERS and taskMatchesFilters imported from TaskFilters

const EMPTY_COLUMNS = { todo: [], inProgress: [], done: [] };

function resolveInitialColumns() {
  if (import.meta.env.DEV && new URLSearchParams(window.location.search).get('empty') === '1') {
    return EMPTY_COLUMNS;
  }
  return INITIAL_COLUMNS;
}

function isPixelPassMode() {
  return import.meta.env.DEV && new URLSearchParams(window.location.search).get('pixelPass') === '1';
}

export default function TasksBoard() {
  const { setTaskDetail } = useOutletContext();
  const [columns, setColumns] = useState(resolveInitialColumns);
  const [ghostTasks, setGhostTasks] = useState(GHOST_TASKS);
  const [taskModal, setTaskModal] = useState({ open: false, mode: 'create', task: null });
  const [enteringTaskIds, setEnteringTaskIds] = useState(() => new Set());
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isTaskExpanded, setIsTaskExpanded] = useState(false);
  const [triggerSubtasksAi, setTriggerSubtasksAi] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState(DEFAULT_FILTERS);

  const updateFilter = (key, value) => setActiveFilters((prev) => ({ ...prev, [key]: value }));

  const filteredColumns = useMemo(() => {
    const matches = (t) => taskMatchesSearch(t, searchQuery) && taskMatchesFilters(t, activeFilters);
    return {
      todo: columns.todo.filter(matches),
      inProgress: columns.inProgress.filter(matches),
      done: columns.done.filter(matches),
    };
  }, [columns, searchQuery, activeFilters]);

  const filteredGhostTasks = useMemo(() => {
    const matches = (t) => taskMatchesSearch(t, searchQuery) && taskMatchesFilters(t, activeFilters);
    return ghostTasks.filter(matches);
  }, [ghostTasks, searchQuery, activeFilters]);

  const isSearching =
    searchQuery.trim().length > 0 ||
    Object.entries(activeFilters).some(([key, value]) => value !== DEFAULT_FILTERS[key]);

  const findTaskById = (id) => {
    for (const key of ['todo', 'inProgress', 'done']) {
      const found = columns[key].find((t) => t.id === id);
      if (found) return found;
    }
    return null;
  };

  const selectedTask = selectedTaskId ? findTaskById(selectedTaskId) : null;

  useEffect(() => {
    setTaskDetail(isTaskExpanded ? selectedTask?.title ?? null : null);
    return () => setTaskDetail(null);
  }, [selectedTask, isTaskExpanded, setTaskDetail]);

  const openTaskDetail = (task, runSubtasksAi = false) => {
    setSelectedTaskId(task.id);
    setTriggerSubtasksAi(runSubtasksAi);
    setIsTaskExpanded(false);
  };

  const closeTaskDetail = () => {
    setSelectedTaskId(null);
    setTriggerSubtasksAi(false);
    setIsTaskExpanded(false);
  };

  const handleUpdateSubtasks = (taskId, subtasks) => {
    setColumns((prev) => {
      const next = {
        todo: [...prev.todo],
        inProgress: [...prev.inProgress],
        done: [...prev.done],
      };
      for (const key of Object.keys(next)) {
        next[key] = next[key].map((t) =>
          t.id === taskId
            ? { ...t, subtasks, steps: formatStepsProgress(subtasks) ?? t.steps }
            : t
        );
      }
      return next;
    });
  };

  // AI Assistant edit boundary: only title, description, category, linked tasks/habits
  // may be changed this way — never due date, status, priority, or reminder/calendar fields.
  const handleUpdateTaskFields = (taskId, fields) => {
    const ALLOWED_KEYS = new Set(['title', 'description', 'category', 'linkedGoal', 'tags']);
    const safeFields = Object.fromEntries(
      Object.entries(fields).filter(([key]) => ALLOWED_KEYS.has(key))
    );
    setColumns((prev) => {
      const next = {
        todo: [...prev.todo],
        inProgress: [...prev.inProgress],
        done: [...prev.done],
      };
      for (const key of Object.keys(next)) {
        next[key] = next[key].map((t) => {
          if (t.id !== taskId) return t;
          const updated = { ...t, ...safeFields };
          if (safeFields.linkedGoal != null && safeFields.tags == null) {
            const withoutGoal = (t.tags ?? []).filter(
              (tag) => tag.icon !== Target && tag.icon !== TrendingUp && !tag.linkedGoal
            );
            updated.tags = [
              ...withoutGoal,
              { label: safeFields.linkedGoal, icon: TrendingUp, linkedGoal: true },
            ];
          }
          return updated;
        });
      }
      return next;
    });
  };

  const openNewTaskModal = () => setTaskModal({ open: true, mode: 'create', task: null });
  const openEditTaskModal = (task) => setTaskModal({ open: true, mode: 'edit', task });
  const closeTaskModal = () => setTaskModal((prev) => ({ ...prev, open: false }));

  const handleDismissGhost = (id) => {
    setGhostTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleRegenerateGhost = (id) => {
    setGhostTasks((prev) =>
      prev.map((ghost) => {
        if (ghost.id !== id) return ghost;
        const alternate = GHOST_REGENERATIONS[id];
        if (!alternate) return ghost;
        return { ...ghost, ...alternate, id: ghost.id };
      })
    );
  };

  const handleAcceptGhost = (ghost) => {
    const taskId = `task-${crypto.randomUUID()}`;
    const category =
      ghost.category ||
      ghost.tags?.find((tag) => typeof tag.label === 'string' && !tag.label.includes('/'))?.label ||
      'Career';
    const acceptedTask = {
      id: taskId,
      priority: ghost.priority,
      title: ghost.title,
      description: ghost.description,
      tags: ghost.tags || [{ label: category }],
      steps: ghost.tags?.find((tag) => tag.label?.includes('Steps'))?.label,
      due: ghost.due || 'Today',
      source: 'ai',
      category,
      status: 'To Do',
    };

    setGhostTasks((prev) => prev.filter((t) => t.id !== ghost.id));
    setColumns((prev) => ({
      ...prev,
      todo: [...prev.todo, acceptedTask],
    }));
    setEnteringTaskIds((prev) => new Set(prev).add(taskId));
    window.setTimeout(() => {
      setEnteringTaskIds((prev) => {
        const next = new Set(prev);
        next.delete(taskId);
        return next;
      });
    }, 300);
  };

  const handleImproveDescription = (task) => {
    const improved =
      `${task.description ?? ''} This task directly supports your linked goal — tackle it with focused effort today.`.trim();
    setColumns((prev) => {
      const next = {
        todo: [...prev.todo],
        inProgress: [...prev.inProgress],
        done: [...prev.done],
      };
      for (const key of Object.keys(next)) {
        next[key] = next[key].map((t) =>
          t.id === task.id ? { ...t, description: improved } : t
        );
      }
      return next;
    });
  };

  const boardIsEmpty =
    columns.todo.length === 0 && columns.inProgress.length === 0 && columns.done.length === 0;

  const showGhostCards = boardIsEmpty && filteredGhostTasks.length > 0;

  const handleDeleteTask = (task) => {
    setColumns((prev) => {
      const next = { todo: [...prev.todo], inProgress: [...prev.inProgress], done: [...prev.done] };
      for (const key of Object.keys(next)) {
        next[key] = next[key].filter((t) => t.id !== task.id);
      }
      return next;
    });
  };

  const handleSubmitTask = (form) => {
    const isCreate = taskModal.mode === 'create';
    const columnKey = STATUS_TO_COLUMN[form.status] || 'todo';
    const isAi = form.source === 'ai';
    const tags = [{ label: form.category }];
    if (form.estMinutes) {
      tags.push({ label: `${form.estMinutes} Min`, icon: Clock });
    }
    if (form.linkedGoal && form.linkedGoal !== '__create_new__') {
      tags.push({ label: form.linkedGoal, icon: TrendingUp, linkedGoal: true });
    }

    const taskId = isCreate ? Date.now() : taskModal.task.id;

    const taskData = {
      ...(isCreate ? {} : taskModal.task),
      id: taskId,
      priority: form.priority.toUpperCase(),
      title: form.title || 'Untitled Task',
      description: form.description,
      tags,
      due: form.dueLabel || (form.dueDate ? formatDate(form.dueDate) : 'No date'),
      source: isAi ? 'ai' : isCreate ? 'manual' : taskModal.task.source ?? 'manual',
      category: form.category,
      linkedGoal:
        form.linkedGoal && form.linkedGoal !== '__create_new__' ? form.linkedGoal : undefined,
      status: form.status || 'To Do',
    };

    setColumns((prev) => {
      const next = { todo: [...prev.todo], inProgress: [...prev.inProgress], done: [...prev.done] };
      if (!isCreate) {
        for (const key of Object.keys(next)) {
          next[key] = next[key].filter((t) => t.id !== taskData.id);
        }
      }
      next[columnKey] = [...next[columnKey], taskData];
      return next;
    });

    if (isCreate) {
      setEnteringTaskIds((prev) => new Set(prev).add(taskId));
      window.setTimeout(() => {
        setEnteringTaskIds((prev) => {
          const next = new Set(prev);
          next.delete(taskId);
          return next;
        });
      }, 300);
    }
  };

  return (
    <div className="relative flex min-h-full flex-col py-7.5 max-lg:min-h-0 max-lg:py-4 max-lg:sm:py-6">
      {!isTaskExpanded && (
        <>
          {/* Header */}
          <div className="mb-5 flex w-full items-start justify-between max-lg:mb-4 max-lg:flex-col max-lg:gap-4">
            <div className="flex flex-col items-start gap-2">
              <p className="text-[20px] font-medium text-[#181818] dark:text-white">Tasks Board</p>
              {isPixelPassMode() ? (
                <span className="text-[12px] font-medium text-[#c2c2c2] dark:text-gray-400 max-lg:text-sm">
                  {TASKS_SUBTITLE_PHRASES[0]}
                </span>
              ) : (
                <TypewriterText
                  phrases={TASKS_SUBTITLE_PHRASES}
                  className="text-[12px] font-medium text-[#c2c2c2] dark:text-gray-400 max-lg:text-sm"
                />
              )}
            </div>
            <label className="flex w-62.5 items-center gap-2 rounded-lg border border-[#f2f2f2] bg-white px-3 py-1.75 focus-within:border-[#e9e9e9] dark:border-zinc-700 dark:bg-zinc-800 dark:focus-within:border-zinc-600 max-lg:w-full max-lg:py-2">
              <Search size={14} className="shrink-0 text-[#c2c2c2]" aria-hidden />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks in board..."
                aria-label="Search tasks in board"
                className="w-full bg-transparent text-[12px] font-medium text-[#181818] outline-none placeholder:text-[#c2c2c2] dark:text-white max-lg:text-base"
              />
            </label>
          </div>

          {/* Action row */}
          <div className="mb-5 flex w-full items-center justify-between gap-3 max-lg:mb-4 max-lg:flex-col max-lg:items-stretch max-lg:gap-4">
            <button
              onClick={openNewTaskModal}
              className="flex shrink-0 items-center gap-2 rounded-lg bg-[#8022fe] px-3 py-2 text-[12px] font-semibold whitespace-nowrap text-white max-lg:w-full max-lg:justify-center max-lg:py-2.5 max-lg:text-base"
            >
              <Plus size={14} strokeWidth={2.5} className="shrink-0 text-white" />
              <span className="text-white">New Task</span>
            </button>

            <div className="flex items-center gap-2 max-lg:w-full max-lg:flex-col max-lg:gap-3 lg:flex-1 2xl:flex-none 2xl:gap-5">
              {/* Board/List — visible per Figma, non-functional in MVP */}
              <div className="flex shrink-0 items-center gap-1 rounded-lg border border-[#f2f2f2] bg-white p-1 dark:border-zinc-700 max-lg:w-full">
                <span className="rounded px-2 py-0.75 text-[12px] font-medium text-[#181818] bg-[#f2f2f2] dark:bg-zinc-700 dark:text-white max-lg:flex-1 max-lg:py-2 max-lg:text-center max-lg:text-base">
                  Board
                </span>
                <span className="flex w-12.5 items-center justify-center px-2 py-0.75 text-[12px] font-medium text-[#c2c2c2] max-lg:flex-1 max-lg:py-2 max-lg:text-base">
                  List
                </span>
              </div>

              <div className="h-4 w-px shrink-0 bg-[#f2f2f2] dark:bg-zinc-700 max-lg:hidden" />

              <div className="flex items-center gap-1 max-lg:w-full max-lg:flex-col max-lg:gap-2 lg:flex-1 2xl:flex-none 2xl:gap-2.5">
                {FILTER_CONFIG.map(({ key, defaultLabel, options }) => (
                  <FilterDropdown
                    key={key}
                    defaultLabel={defaultLabel}
                    options={options}
                    value={activeFilters[key]}
                    onChange={(value) => updateFilter(key, value)}
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Full page detail (Figma frame 8) replaces the board; otherwise show columns + drawer peek */}
      {isTaskExpanded && selectedTask ? (
        <div className="flex min-h-0 flex-1 flex-col">
          <TaskDetailPanel
          task={selectedTask}
          onUpdateSubtasks={(subtasks) => handleUpdateSubtasks(selectedTask.id, subtasks)}
          onUpdateTaskFields={(fields) => handleUpdateTaskFields(selectedTask.id, fields)}
          onEdit={openEditTaskModal}
          onDelete={(t) => {
            handleDeleteTask(t);
            closeTaskDetail();
          }}
          onTriggerSubtasksAi={() => setTriggerSubtasksAi(true)}
          autoTriggerSubtasksAi={triggerSubtasksAi}
          onAutoTriggerConsumed={() => setTriggerSubtasksAi(false)}
          />
        </div>
      ) : (
      <div className="flex min-h-0 flex-1 items-stretch gap-4 lg:min-h-0 max-lg:h-auto max-lg:flex-none max-lg:flex-col">
        {COLUMNS.map((column) => {
          const Icon = column.icon;
          const { key, label } = column;
          const cards = filteredColumns[key];
          const isTodo = key === 'todo';
          const isDone = key === 'done';
          const overdueCount = isTodo ? cards.filter((t) => t.overdueDays != null).length : 0;
          const hasSearchResults = cards.length > 0;
          return (
            <div
              key={key}
              className="scrollbar-hidden relative flex h-full w-full shrink-0 flex-col items-start gap-2.5 overflow-y-auto rounded-2xl border border-[#f2f2f2] bg-white p-3 lg:min-h-0 lg:flex-1 dark:border-zinc-700 dark:bg-zinc-800 max-lg:h-auto max-lg:max-h-[min(70vh,560px)]"
            >
              <div className="flex w-full shrink-0 items-center justify-between">
                <div className="flex min-w-0 items-center gap-2">
                  <Icon size={14} className="shrink-0 text-[#5d5d5d] dark:text-gray-300" />
                  <p className="text-sm font-medium leading-normal text-[#5d5d5d] lg:text-[14px] dark:text-gray-300">{label}</p>
                  {isTodo && overdueCount > 0 && (
                    <span className="flex items-center gap-1 rounded-[6px] bg-[rgba(220,38,38,0.05)] px-[6px] py-[2px] text-[10px] font-semibold leading-normal text-[#dc2626]">
                      <span className="size-[3px] shrink-0 rounded-full bg-[#dc2626]" />
                      {overdueCount} Overdue
                    </span>
                  )}
                </div>
                {isTodo && showGhostCards ? (
                  <span className="flex shrink-0 items-center gap-1 rounded-[6px] bg-[#f9f4ff] px-[6px] py-[2px] text-xs font-medium text-[#8022fe] lg:text-[12px]">
                    <Sparkles size={10} />
                    {filteredGhostTasks.length} AI Suggestions
                  </span>
                ) : (
                  <span className="flex w-[22px] shrink-0 items-center justify-center rounded-[6px] bg-[#f2f2f2] px-[6px] py-[2px] text-xs font-medium leading-normal text-[#5d5d5d] lg:text-[12px] dark:bg-zinc-700 dark:text-gray-300">
                    {cards.length}
                  </span>
                )}
              </div>

              {isTodo && showGhostCards
                ? filteredGhostTasks.map((task) => (
                    <GhostTaskCard
                      key={task.id}
                      task={task}
                      onDismiss={handleDismissGhost}
                      onRegenerate={handleRegenerateGhost}
                      onAccept={() => handleAcceptGhost(task)}
                    />
                  ))
                : !hasSearchResults && isSearching
                  ? (
                    <EmptyColumnPlaceholder text="No matching tasks" />
                  )
                : cards.length === 0 && !isTodo
                  ? (
                    <EmptyColumnPlaceholder
                      text={key === 'inProgress' ? 'No tasks in progress' : 'Completed tasks will appear here'}
                    />
                  )
                  : hasSearchResults
                  ? cards.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={openEditTaskModal}
                        onDelete={handleDeleteTask}
                        onSelect={(t) => openTaskDetail(t)}
                        onBreakIntoSubtasks={(t) => openTaskDetail(t, true)}
                        onImproveDescription={handleImproveDescription}
                        isDoneColumn={isDone}
                        isEntering={enteringTaskIds.has(task.id)}
                      />
                    ))
                  : null}
              {isTodo && cards.length > 3 && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[60px] rounded-b-2xl bg-gradient-to-b from-transparent to-white dark:to-zinc-800" />
              )}
            </div>
          );
        })}
      </div>
      )}

      {/* Drawer peek (Figma frames 6/6.1/7/7.1) — overlays the board, still visible behind it */}
      {selectedTask && !isTaskExpanded && (
        <TaskDetailDrawer
          task={selectedTask}
          onClose={closeTaskDetail}
          onOpenFullPage={() => setIsTaskExpanded(true)}
          onUpdateSubtasks={(subtasks) => handleUpdateSubtasks(selectedTask.id, subtasks)}
          onUpdateTaskFields={(fields) => handleUpdateTaskFields(selectedTask.id, fields)}
          onEdit={openEditTaskModal}
          onDelete={(t) => {
            handleDeleteTask(t);
            closeTaskDetail();
          }}
          onTriggerSubtasksAi={() => setTriggerSubtasksAi(true)}
          autoTriggerSubtasksAi={triggerSubtasksAi}
          onAutoTriggerConsumed={() => setTriggerSubtasksAi(false)}
        />
      )}

      {/* Modal */}
      {taskModal.open && (
        <TaskFormModal
          key={taskModal.task?.id ?? 'new'}
          mode={taskModal.mode}
          initialTask={taskModal.task}
          onClose={closeTaskModal}
          onSubmit={handleSubmitTask}
        />
      )}
    </div>
  );
}
