import {
  Plus,
  Search,
  Sparkles,
  ListTodo,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useOutletContext } from 'react-router-dom';
import TaskFormModal from './components/TaskFormModal';
import TaskDetailPanel, { TaskDetailDrawer } from './components/TaskDetailPanel';
import { TaskCard, GhostTaskCard } from './components/TaskCard';
import {
  FILTER_CONFIG,
  DEFAULT_FILTERS,
  FilterDropdown,
} from './components/TaskFilters';
import TypewriterText from '../../../../../components/ui/TypewriterText';
import {
  createTask,
  deleteTask,
  fetchSubtasks,
  fetchTaskById,
  fetchTasks,
  fetchTasksSummary,
  selectCurrentSubtasks,
  selectCurrentTask,
  selectTaskColumns,
  selectTasksLoading,
  updateTask,
} from '../../../../../features/tasks/tasksSlice';
import { taskMatchesClientFilters } from '../../../../../features/tasks/tasksMappers';

const TASKS_SUBTITLE_PHRASES = [
  'Plan, prioritize, and complete your tasks in one place...',
  'Let AI suggest tasks based on your goals and habits...',
  'Break big goals into manageable steps with AI...',
  'Stay on top of deadlines across all your columns...',
];

const GHOST_TASKS = [
  {
    id: 'ghost-1',
    priority: 'URGENT',
    title: 'Exercise Routine',
    description: 'Follow your fitness routine or do a workout session.',
    tags: [
      { label: 'Career' },
      { label: 'Improve Rate', iconKey: 'goal' },
      { label: '60 Min', iconKey: 'clock' },
      { label: '0/4 Steps' },
    ],
    due: 'Today',
    category: 'Career',
  },
  {
    id: 'ghost-2',
    priority: 'HIGH',
    title: 'Deliver message',
    description:
      'Communicate the expectations regarding maintaining a calm environment to the relevant individuals in a direct and respectful manner.',
    tags: [{ label: 'Health' }, { label: '0/8 Steps' }],
    due: 'Today',
    category: 'Health',
  },
  {
    id: 'ghost-3',
    priority: 'MEDIUM',
    title: 'Complete Work Task',
    description: 'Work on the main career task assigned for today.',
    tags: [{ label: 'Finance' }, { label: '30 Min', iconKey: 'clock' }],
    due: 'Tomorrow',
    category: 'Finance',
  },
];

const GHOST_REGENERATIONS = {
  'ghost-1': {
    priority: 'HIGH',
    title: 'Morning Mobility Session',
    description: 'Start with light stretches and a short cardio warm-up to build consistency.',
    tags: [
      { label: 'Health' },
      { label: 'Improve Rate', iconKey: 'goal' },
      { label: '30 Min', iconKey: 'clock' },
      { label: '0/3 Steps' },
    ],
    due: 'Today',
    category: 'Health',
  },
  'ghost-2': {
    priority: 'MEDIUM',
    title: 'Send weekly status update',
    description: 'Share progress, blockers, and next steps with your team in a clear message.',
    tags: [{ label: 'Career' }, { label: '0/4 Steps' }],
    due: 'Today',
    category: 'Career',
  },
  'ghost-3': {
    priority: 'HIGH',
    title: 'Prep tomorrow priorities',
    description: 'List the top three outcomes for tomorrow and block focus time for each.',
    tags: [{ label: 'Personal' }, { label: '20 Min', iconKey: 'clock' }],
    due: 'Tomorrow',
    category: 'Personal',
  },
};

function EmptyColumnPlaceholder({ text }) {
  return (
    <div className="flex w-full items-center justify-center pt-2.5">
      <p className="flex-1 text-center text-sm font-medium text-[#c2c2c2] md:text-base dark:text-gray-500">
        {text}
      </p>
    </div>
  );
}

const COLUMNS = [
  { key: 'todo', label: 'To Do', icon: ListTodo },
  { key: 'inProgress', label: 'In Progress', icon: TrendingUp },
  { key: 'done', label: 'Done', icon: CheckCircle2 },
];

const EMPTY_COLUMNS = { todo: [], inProgress: [], done: [] };

function resolveForceEmptyBoard() {
  return import.meta.env.DEV && new URLSearchParams(window.location.search).get('empty') === '1';
}

function isPixelPassMode() {
  return import.meta.env.DEV && new URLSearchParams(window.location.search).get('pixelPass') === '1';
}

export default function TasksBoard() {
  const dispatch = useDispatch();
  const { setTaskDetail, setBackToTasksBoard } = useOutletContext();
  const reduxColumns = useSelector(selectTaskColumns);
  const loadingList = useSelector(selectTasksLoading);
  const currentTask = useSelector(selectCurrentTask);
  const currentSubtasks = useSelector(selectCurrentSubtasks);

  const forceEmpty = resolveForceEmptyBoard();

  const [ghostTasks, setGhostTasks] = useState(GHOST_TASKS);
  const [taskModal, setTaskModal] = useState({ open: false, mode: 'create', task: null });
  const [enteringTaskIds, setEnteringTaskIds] = useState(() => new Set());
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isTaskExpanded, setIsTaskExpanded] = useState(false);
  const [triggerSubtasksAi, setTriggerSubtasksAi] = useState(false);
  const [triggerImproveAi, setTriggerImproveAi] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState(DEFAULT_FILTERS);

  const loadTasks = useCallback(() => {
    if (forceEmpty) return Promise.resolve();
    return dispatch(
      fetchTasks({
        filters: activeFilters,
        search: searchQuery,
        page: 1,
        limit: 50,
      })
    );
  }, [dispatch, activeFilters, searchQuery, forceEmpty]);

  useEffect(() => {
    if (forceEmpty) return undefined;
    const delay = searchQuery.trim() ? 300 : 0;
    const timer = setTimeout(() => {
      loadTasks();
      dispatch(fetchTasksSummary());
    }, delay);
    return () => clearTimeout(timer);
  }, [loadTasks, searchQuery, dispatch, forceEmpty]);

  const columns = forceEmpty ? EMPTY_COLUMNS : reduxColumns;

  const updateFilter = (key, value) => setActiveFilters((prev) => ({ ...prev, [key]: value }));

  const filteredColumns = useMemo(() => {
    const matches = (t) => taskMatchesClientFilters(t, activeFilters);
    return {
      todo: columns.todo.filter(matches),
      inProgress: columns.inProgress.filter(matches),
      done: columns.done.filter(matches),
    };
  }, [columns, activeFilters]);

  const filteredGhostTasks = useMemo(() => {
    const matches = (t) => taskMatchesClientFilters(t, activeFilters);
    return ghostTasks.filter(matches);
  }, [ghostTasks, activeFilters]);

  const isSearching =
    searchQuery.trim().length > 0 ||
    Object.entries(activeFilters).some(([key, value]) => value !== DEFAULT_FILTERS[key]);

  const findTaskById = (id) => {
    for (const key of ['todo', 'inProgress', 'done']) {
      const found = columns[key].find((t) => String(t.id) === String(id));
      if (found) return found;
    }
    return null;
  };

  const boardTask = selectedTaskId ? findTaskById(selectedTaskId) : null;
  const selectedTask = boardTask
    ? {
        ...boardTask,
        ...(currentTask && String(currentTask.id) === String(selectedTaskId) ? currentTask : {}),
        subtasks:
          currentTask && String(currentTask.id) === String(selectedTaskId) && currentSubtasks?.length
            ? currentSubtasks
            : boardTask.subtasks || currentSubtasks || [],
      }
    : null;

  useEffect(() => {
    setTaskDetail(isTaskExpanded ? selectedTask?.title ?? null : null);
    return () => setTaskDetail(null);
  }, [selectedTask, isTaskExpanded, setTaskDetail]);

  const refreshSelectedTask = useCallback(async () => {
    if (!selectedTaskId) return;
    await dispatch(fetchTaskById(selectedTaskId));
    await dispatch(fetchSubtasks(selectedTaskId));
    await loadTasks();
    await dispatch(fetchTasksSummary());
  }, [dispatch, selectedTaskId, loadTasks]);

  useEffect(() => {
    if (!selectedTaskId || forceEmpty) return;
    dispatch(fetchTaskById(selectedTaskId));
    dispatch(fetchSubtasks(selectedTaskId));
  }, [selectedTaskId, dispatch, forceEmpty]);

  const openTaskDetail = (task, runSubtasksAi = false, runImproveAi = false) => {
    setSelectedTaskId(task.id);
    setTriggerSubtasksAi(runSubtasksAi);
    setTriggerImproveAi(runImproveAi);
    setIsTaskExpanded(false);
  };

  const closeTaskDetail = useCallback(() => {
    setSelectedTaskId(null);
    setTriggerSubtasksAi(false);
    setTriggerImproveAi(false);
    setIsTaskExpanded(false);
  }, []);

  useEffect(() => {
    setBackToTasksBoard?.(closeTaskDetail);
    return () => setBackToTasksBoard?.(null);
  }, [setBackToTasksBoard, closeTaskDetail]);

  useEffect(() => {
    if (!isTaskExpanded) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeTaskDetail();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isTaskExpanded, closeTaskDetail]);

  const handleUpdateTaskFields = async (taskId, fields) => {
    const ALLOWED_KEYS = new Set([
      'title',
      'description',
      'category',
      'linkedGoal',
      'goalId',
      'tags',
    ]);
    const safeFields = Object.fromEntries(
      Object.entries(fields).filter(([key]) => ALLOWED_KEYS.has(key))
    );
    if (Object.keys(safeFields).length === 0) return;

    const formData = { ...safeFields };
    if (safeFields.linkedGoal && !safeFields.goalId) {
      formData.goalId = safeFields.linkedGoal;
    }
    await dispatch(updateTask({ taskId, formData }));
    await loadTasks();
    if (String(selectedTaskId) === String(taskId)) {
      await dispatch(fetchTaskById(taskId));
    }
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

  const handleAcceptGhost = async (ghost) => {
    const category =
      ghost.category ||
      ghost.tags?.find((tag) => typeof tag.label === 'string' && !tag.label.includes('/'))?.label ||
      'Career';
    const result = await dispatch(
      createTask({
        title: ghost.title,
        description: ghost.description,
        category,
        priority: ghost.priority || 'MEDIUM',
        status: 'To Do',
        source: 'ai',
      })
    );
    if (createTask.fulfilled.match(result)) {
      const taskId = result.payload?.id;
      setGhostTasks((prev) => prev.filter((t) => t.id !== ghost.id));
      if (taskId) {
        setEnteringTaskIds((prev) => new Set(prev).add(taskId));
        window.setTimeout(() => {
          setEnteringTaskIds((prev) => {
            const next = new Set(prev);
            next.delete(taskId);
            return next;
          });
        }, 300);
      }
      await loadTasks();
      await dispatch(fetchTasksSummary());
    }
  };

  const handleImproveDescription = (task) => {
    openTaskDetail(task, false, true);
  };

  const boardIsEmpty =
    columns.todo.length === 0 && columns.inProgress.length === 0 && columns.done.length === 0;

  const showGhostCards = boardIsEmpty && filteredGhostTasks.length > 0 && !loadingList;

  const handleDeleteTask = async (task) => {
    await dispatch(deleteTask(task.id));
    await dispatch(fetchTasksSummary());
    if (String(selectedTaskId) === String(task.id)) closeTaskDetail();
  };

  const handleSubmitTask = async (form) => {
    if (form?.alreadyPersisted) {
      const taskId = form.id;
      if (taskId) {
        setEnteringTaskIds((prev) => new Set(prev).add(taskId));
        window.setTimeout(() => {
          setEnteringTaskIds((prev) => {
            const next = new Set(prev);
            next.delete(taskId);
            return next;
          });
        }, 300);
      }
      await loadTasks();
      await dispatch(fetchTasksSummary());
      return;
    }

    if (taskModal.mode === 'edit' && taskModal.task?.id) {
      await dispatch(updateTask({ taskId: taskModal.task.id, formData: form }));
    } else {
      const result = await dispatch(createTask(form));
      if (createTask.fulfilled.match(result)) {
        const taskId = result.payload?.id;
        if (taskId) {
          setEnteringTaskIds((prev) => new Set(prev).add(taskId));
          window.setTimeout(() => {
            setEnteringTaskIds((prev) => {
              const next = new Set(prev);
              next.delete(taskId);
              return next;
            });
          }, 300);
        }
      } else {
        throw new Error('create failed');
      }
    }
    await loadTasks();
    await dispatch(fetchTasksSummary());
  };

  const autoAiAction = triggerImproveAi ? 'improve' : triggerSubtasksAi ? 'breakdown' : null;

  return (
    <div className="relative flex min-h-full flex-col py-7.5 max-lg:min-h-0 max-lg:py-4 max-lg:sm:py-6">
      {!isTaskExpanded && (
        <>
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

          <div className="mb-5 flex w-full items-center justify-between gap-3 max-lg:mb-4 max-lg:flex-col max-lg:items-stretch max-lg:gap-4">
            <button
              type="button"
              onClick={openNewTaskModal}
              className="flex shrink-0 items-center gap-2 rounded-lg bg-[#8022fe] px-3 py-2 text-[12px] font-semibold whitespace-nowrap text-white max-lg:w-full max-lg:justify-center max-lg:py-2.5 max-lg:text-base"
            >
              <Plus size={14} strokeWidth={2.5} className="shrink-0 text-white" />
              <span className="text-white">New Task</span>
            </button>

            <div className="flex items-center gap-2 max-lg:w-full max-lg:flex-col max-lg:gap-3 lg:flex-1 2xl:flex-none 2xl:gap-5">
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

      {isTaskExpanded && selectedTask ? (
        <div className="flex min-h-0 flex-1 flex-col">
          <TaskDetailPanel
            task={selectedTask}
            onBack={closeTaskDetail}
            onUpdateTaskFields={(fields) => handleUpdateTaskFields(selectedTask.id, fields)}
            onEdit={openEditTaskModal}
            onDelete={(t) => {
              handleDeleteTask(t);
            }}
            onRefreshTask={refreshSelectedTask}
            autoAiAction={autoAiAction}
            onAutoAiActionConsumed={() => {
              setTriggerSubtasksAi(false);
              setTriggerImproveAi(false);
            }}
            onTriggerSubtasksAi={() => setTriggerSubtasksAi(true)}
            onTriggerImproveAi={() => setTriggerImproveAi(true)}
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
                    <p className="text-sm font-medium leading-normal text-[#5d5d5d] lg:text-[14px] dark:text-gray-300">
                      {label}
                    </p>
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
                        text={
                          key === 'inProgress'
                            ? 'No tasks in progress'
                            : 'Completed tasks will appear here'
                        }
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

      {selectedTask && !isTaskExpanded && (
        <TaskDetailDrawer
          task={selectedTask}
          onClose={closeTaskDetail}
          onOpenFullPage={() => setIsTaskExpanded(true)}
          onUpdateTaskFields={(fields) => handleUpdateTaskFields(selectedTask.id, fields)}
          onEdit={openEditTaskModal}
          onDelete={(t) => {
            handleDeleteTask(t);
          }}
          onRefreshTask={refreshSelectedTask}
          autoAiAction={autoAiAction}
          onAutoAiActionConsumed={() => {
            setTriggerSubtasksAi(false);
            setTriggerImproveAi(false);
          }}
          onTriggerSubtasksAi={() => setTriggerSubtasksAi(true)}
          onTriggerImproveAi={() => setTriggerImproveAi(true)}
        />
      )}

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
