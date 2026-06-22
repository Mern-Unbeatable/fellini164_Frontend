import { useEffect, useRef, useState } from 'react';
import {
  Sparkles,
  MoreHorizontal,
  Flag,
  Plus,
  X,
  ExternalLink,
  Hourglass,
  RotateCw,
  CircleX,
  Pencil,
  Pause,
  Trash2,
} from 'lucide-react';

const PRIORITY_STYLES = {
  URGENT: 'bg-[rgba(220,38,38,0.05)] text-[#dc2626]',
  HIGH: 'bg-[rgba(249,115,22,0.05)] text-[#f97316]',
  MEDIUM: 'bg-[rgba(202,138,4,0.05)] text-[#ca8a04]',
  LOW: 'bg-[rgba(107,114,128,0.05)] text-[#6b7280]',
};

const PRIORITY_LABELS = {
  URGENT: 'Urgent',
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
};

const STATUS_STYLES = {
  'TO DO': 'bg-[rgba(93,93,93,0.05)] text-[#5d5d5d]',
  'IN PROGRESS': 'bg-[rgba(93,93,93,0.05)] text-[#5d5d5d]',
};

// Figma frame 1255:19596 — linked items for "Improve Rate" (goal-1).
const FIGMA_LINKED_TASKS = [
  {
    id: 'lt-1',
    priority: 'URGENT',
    source: 'ai',
    status: 'TO DO',
    title: 'Exercise Routine',
    description: 'Follow your fitness routine or do a workout session.',
    due: 'May 11, 2026',
    overdueDays: 2,
  },
  {
    id: 'lt-2',
    priority: 'LOW',
    status: 'IN PROGRESS',
    title: 'Update Resume and LinkedIn Profile',
    description:
      'Communicate the expectations regarding maintaining a calm environment to the relevant individuals in a direct and respectful manner.',
    due: 'Tomorrow',
  },
  {
    id: 'lt-3',
    priority: 'URGENT',
    source: 'ai',
    status: 'TO DO',
    title: 'Exercise Routine',
    description: 'Follow your fitness routine or do a workout session.',
    due: 'May 12, 2026',
    overdueDays: 2,
  },
];

const FIGMA_LINKED_HABITS = [
  {
    id: 'lh-1',
    title: 'Drink Water',
    description: 'Stay hydrated throughout the day Stay hydrated throughout the day',
    stats: [
      { icon: Hourglass, label: '12 days left' },
      { icon: RotateCw, label: '4 days' },
      { label: 'Today' },
    ],
    todayProgress: { done: 0, total: 2 },
  },
  {
    id: 'lh-2',
    title: 'Take Breaks',
    description: 'Step away from your screen regularly',
    stats: [{ icon: RotateCw, label: '7 days' }, { label: 'Today' }],
  },
];

function getLinkedTasks(goal) {
  if (!goal?.tasks) return [];
  if (goal.id === 'goal-1') return FIGMA_LINKED_TASKS;
  return FIGMA_LINKED_TASKS.slice(0, Math.min(goal.tasks, 3));
}

function getLinkedHabits(goal) {
  if (!goal?.habits) return [];
  if (goal.id === 'goal-1') return FIGMA_LINKED_HABITS;
  return FIGMA_LINKED_HABITS.slice(0, Math.min(goal.habits, 2));
}

function formatDueDetail(goal) {
  if (goal.dueDetail) return goal.dueDetail;
  if (!goal.due) return null;
  return goal.due;
}

function GoalDetailMenu({ onClose, onEdit, onImprove, onPause, onDelete }) {
  const itemBase =
    'flex w-full items-center gap-1.5 px-2.5 py-1.5 text-left text-[12px] font-medium whitespace-nowrap hover:bg-[#fcfcfc] dark:hover:bg-zinc-700';

  return (
    <div className="absolute right-0 top-full z-50 mt-1 flex w-max flex-col overflow-hidden rounded-lg border border-[#f2f2f2] bg-white shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)] dark:border-zinc-700 dark:bg-zinc-800">
      <button type="button" onClick={onEdit} className={`${itemBase} text-[#5d5d5d] dark:text-gray-300`}>
        <Pencil size={10} className="shrink-0" />
        Edit goal
      </button>
      <button type="button" onClick={onImprove} className={`${itemBase} text-[#8022fe]`}>
        <Sparkles size={10} className="shrink-0" />
        Improve goal
      </button>
      <div className="h-px w-full bg-[#f2f2f2] dark:bg-zinc-700" />
      <button type="button" onClick={onPause} className={`${itemBase} text-[#5d5d5d] dark:text-gray-300`}>
        <Pause size={10} className="shrink-0" />
        Pause goal
      </button>
      <button type="button" onClick={onDelete} className={`${itemBase} text-[#5d5d5d] dark:text-gray-300`}>
        <Trash2 size={10} className="shrink-0" />
        Delete
      </button>
      <button type="button" onClick={onClose} className="sr-only">
        Close menu
      </button>
    </div>
  );
}

function LinkedTaskCard({ task }) {
  return (
    <div className="flex w-[270px] shrink-0 flex-col overflow-hidden rounded-[10px] border border-[#f2f2f2] bg-[#fcfcfc] dark:border-zinc-700 dark:bg-zinc-800">
      <div className="flex flex-col gap-1.5 px-2.5 py-2.5">
        <div className="flex flex-wrap items-center gap-1">
          <span
            className={`rounded-[6px] px-1 py-0.5 text-[10px] font-medium uppercase leading-[1.5] ${PRIORITY_STYLES[task.priority]}`}
          >
            {PRIORITY_LABELS[task.priority]}
          </span>
          {task.source === 'ai' && (
            <span className="flex items-center gap-1 rounded-[6px] bg-[#f9f4ff] px-1 py-0.5 text-[10px] font-medium text-[#8022fe]">
              <Sparkles size={8} />
              AI
            </span>
          )}
          {task.status && (
            <>
              <span className="h-2.5 w-px bg-[#e9e9e9] dark:bg-zinc-600" />
              <span
                className={`rounded-[6px] px-1 py-0.5 text-[10px] font-medium uppercase leading-[1.5] ${STATUS_STYLES[task.status]}`}
              >
                {task.status}
              </span>
            </>
          )}
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="text-[14px] font-medium leading-[1.5] text-[#181818] dark:text-white">{task.title}</p>
          <p className="line-clamp-1 text-[10px] font-medium leading-[1.5] text-[#a3a3a3]">{task.description}</p>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-[#f2f2f2] px-2.5 py-2.5 dark:border-zinc-700">
        <p className="text-[10px] font-medium text-[#5d5d5d] dark:text-gray-300">Due: {task.due}</p>
        {task.overdueDays != null && (
          <span className="flex items-center gap-1 rounded-[6px] bg-[rgba(220,38,38,0.05)] px-1.5 py-0.5 text-[10px] font-medium text-[#dc2626]">
            <CircleX size={10} className="shrink-0" />
            Overdue {task.overdueDays}d
          </span>
        )}
      </div>
    </div>
  );
}

function LinkedHabitCard({ habit }) {
  const progress = habit.todayProgress;

  return (
    <div className="flex w-[270px] shrink-0 overflow-hidden rounded-[10px] border border-[#f2f2f2] bg-[#fcfcfc] dark:border-zinc-700 dark:bg-zinc-800">
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 px-2.5 py-2">
        <div className="flex flex-col gap-0.5">
          <p className="text-[14px] font-medium leading-[1.5] text-[#181818] dark:text-white">{habit.title}</p>
          <p className="line-clamp-1 text-[10px] font-medium leading-[1.5] text-[#a3a3a3]">{habit.description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-1">
          {habit.stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <span
                key={stat.label}
                className="flex items-center gap-1 rounded-[6px] border border-[#f2f2f2] px-1.5 py-0.5 text-[10px] font-medium text-[#5d5d5d] dark:border-zinc-700 dark:text-gray-300"
              >
                {Icon && <Icon size={9} className="shrink-0" />}
                {stat.label}
              </span>
            );
          })}
        </div>
      </div>
      <div className="flex w-[50px] shrink-0 flex-col items-center justify-between border-l border-[#f2f2f2] py-2.5 dark:border-zinc-700">
        <div className="size-[30px] rounded-md border border-[#e9e9e9] dark:border-zinc-600" />
        {progress && (
          <p className="text-[10px] font-medium text-[#5d5d5d] dark:text-gray-300">
            {progress.done}/{progress.total}
          </p>
        )}
      </div>
    </div>
  );
}

function LinkedSectionHeader({ label, count, onAdd, onAi }) {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-1.5">
        <p className="text-[12px] font-medium text-[#c2c2c2]">{label}</p>
        {count > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-[5px] bg-[#fcfcfc] px-1 text-[12px] font-medium text-[#c2c2c2] dark:bg-zinc-800">
            {count}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onAdd}
          aria-label={`Add ${label.toLowerCase()}`}
          className="text-[#a3a3a3] hover:text-[#5d5d5d]"
        >
          <Plus size={12} />
        </button>
        <button
          type="button"
          onClick={onAi}
          aria-label={`AI suggest ${label.toLowerCase()}`}
          className="text-[#8022fe] hover:opacity-80"
        >
          <Sparkles size={12} />
        </button>
      </div>
    </div>
  );
}

function EmptyLinkedState({ message }) {
  return (
    <div className="flex min-h-[81px] w-full items-center justify-center rounded-[10px] border border-dashed border-[#e9e9e9] bg-[#fcfcfc] px-3 py-4 dark:border-zinc-700 dark:bg-zinc-800">
      <p className="text-[12px] font-medium text-[#c2c2c2]">{message}</p>
    </div>
  );
}

export default function GoalDetailPanel({
  goal,
  onClose,
  onEdit,
  onImprove,
  onPause,
  onDelete,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!goal) return null;

  const linkedTasks = getLinkedTasks(goal);
  const linkedHabits = getLinkedHabits(goal);
  const dueDetail = formatDueDetail(goal);
  const taskCount = goal.tasks ?? linkedTasks.length;
  const habitCount = goal.habits ?? linkedHabits.length;

  return (
    <div className="fixed inset-0 z-40 max-lg:bg-black/10 lg:absolute lg:inset-0 lg:z-50 lg:bg-transparent">
      <button
        type="button"
        aria-label="Close goal detail"
        onClick={onClose}
        className="absolute inset-0"
      />

      <aside
        className="absolute inset-y-0 right-0 flex w-full max-w-[600px] flex-col border-l border-[#f2f2f2] bg-white shadow-[-4px_0_16px_rgba(0,0,0,0.04)] max-lg:max-w-none dark:border-zinc-700 dark:bg-zinc-900"
        aria-label="Goal detail"
      >
        <div className="flex h-[46px] shrink-0 items-center justify-between px-5">
          <button type="button" aria-label="Open goal in new tab" className="text-[#a3a3a3] hover:text-[#5d5d5d]">
            <ExternalLink size={14} />
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            className="text-[#a3a3a3] hover:text-[#5d5d5d]"
          >
            <X size={12} />
          </button>
        </div>

        <div className="scrollbar-hidden flex flex-1 flex-col gap-6 overflow-y-auto px-5 pb-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-md px-2 py-0.5 text-[14px] font-medium uppercase ${PRIORITY_STYLES[goal.priority]}`}
                >
                  {PRIORITY_LABELS[goal.priority]}
                </span>
                {goal.source === 'ai' && (
                  <span className="flex items-center gap-1.5 rounded-md bg-[#f9f4ff] px-2 py-0.5 text-[14px] font-medium text-[#8022fe]">
                    <Sparkles size={12} />
                    AI
                  </span>
                )}
              </div>
              <div ref={menuRef} className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setMenuOpen((o) => !o)}
                  aria-label="Goal options"
                  aria-expanded={menuOpen}
                  className="text-[#a3a3a3] hover:text-[#5d5d5d]"
                >
                  <MoreHorizontal size={15} />
                </button>
                {menuOpen && (
                  <GoalDetailMenu
                    onClose={() => setMenuOpen(false)}
                    onEdit={() => {
                      setMenuOpen(false);
                      onEdit?.(goal);
                    }}
                    onImprove={() => {
                      setMenuOpen(false);
                      onImprove?.(goal);
                    }}
                    onPause={() => {
                      setMenuOpen(false);
                      onPause?.(goal);
                    }}
                    onDelete={() => {
                      setMenuOpen(false);
                      onDelete?.(goal);
                    }}
                  />
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-medium text-[#181818] dark:text-white">{goal.title}</h2>
              {goal.description && (
                <p className="text-base leading-normal text-[#c2c2c2]">{goal.description}</p>
              )}
            </div>

            {!goal.completedDate && goal.status !== 'completed' && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-[14px] font-medium">
                  <span className="text-[#c2c2c2]">Progress</span>
                  <span className="text-[#5d5d5d] dark:text-gray-300">{goal.progress ?? 0}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-[40px] bg-[#e9e9e9] dark:bg-zinc-600">
                  <div
                    className="h-full rounded-[18px] bg-[#8022fe]"
                    style={{ width: `${goal.progress ?? 0}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="h-px w-full bg-[#f2f2f2] dark:bg-zinc-700" />

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <p className="text-[12px] font-medium text-[#c2c2c2]">Category</p>
              <span className="inline-flex w-fit rounded-md border border-[#f2f2f2] px-2 py-0.5 text-[14px] font-medium text-[#5d5d5d] dark:border-zinc-700 dark:text-gray-300">
                {goal.category}
              </span>
            </div>

            {dueDetail && (
              <div className="flex flex-col gap-1.5">
                <p className="text-[12px] font-medium text-[#c2c2c2]">Due Date</p>
                <span className="inline-flex w-fit items-center gap-1.5 rounded-md border border-[#f2f2f2] px-2 py-0.5 text-[14px] font-medium text-[#5d5d5d] dark:border-zinc-700 dark:text-gray-300">
                  <Flag size={12} className="shrink-0 text-[#dc2626]" />
                  {dueDetail}
                </span>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <LinkedSectionHeader label="Linked Tasks" count={taskCount} onAdd={() => {}} onAi={() => {}} />
              {linkedTasks.length === 0 ? (
                <EmptyLinkedState message="No linked tasks yet" />
              ) : (
                <div className="scrollbar-hidden -mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
                  {linkedTasks.map((task) => (
                    <LinkedTaskCard key={task.id} task={task} />
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <LinkedSectionHeader label="Linked Habits" count={habitCount} onAdd={() => {}} onAi={() => {}} />
              {linkedHabits.length === 0 ? (
                <EmptyLinkedState message="No linked habits yet" />
              ) : (
                <div className="scrollbar-hidden -mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
                  {linkedHabits.map((habit) => (
                    <LinkedHabitCard key={habit.id} habit={habit} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
