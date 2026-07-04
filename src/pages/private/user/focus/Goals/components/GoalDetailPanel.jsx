import { useEffect, useRef, useState } from 'react';
import {
  Sparkles,
  MoreHorizontal,
  Flag,
  Plus,
  X,
  ExternalLink,
  Hourglass,
  Flame,
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

// Figma frame 1255:19596 — linked items for "Improve Rate" (goal-1).
const FIGMA_LINKED_TASKS = [
  {
    id: 'lt-1',
    priority: 'URGENT',
    source: 'ai',
    status: 'to do',
    statusUppercase: true,
    title: 'Exercise Routine',
    description: 'Follow your fitness routine or do a workout session.',
    due: 'May 11, 2026',
    overdueDays: 2,
  },
  {
    id: 'lt-2',
    priority: 'LOW',
    status: 'In Progress',
    statusUppercase: false,
    title: 'Update Resume and LinkedIn Profile',
    description:
      'Communicate the expectations regarding maintaining a calm environment to the relevant individuals in a direct and respectful manner.',
    due: 'Tomorrow',
  },
  {
    id: 'lt-3',
    priority: 'URGENT',
    source: 'ai',
    aiIcon: false,
    status: 'to do',
    statusUppercase: true,
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
      { icon: Flame, label: '4 days' },
      { label: 'Today' },
    ],
    todayProgress: { done: 0, total: 2 },
  },
  {
    id: 'lh-2',
    title: 'Take Breaks',
    description: 'Step away from your screen regularly',
    stats: [{ icon: Flame, label: '7 days', accent: true }, { label: 'Today' }],
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

function DueDetailPill({ goal }) {
  if (goal.dueDetail) {
    const parts = goal.dueDetail.split('•');
    if (parts.length === 2) {
      return (
        <>
          <span>{parts[0].trim()} </span>
          <span className="text-[#c2c2c2]">•</span>
          <span>{parts[1]}</span>
        </>
      );
    }
    return goal.dueDetail;
  }
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

function LinkedTaskCard({ task, compact = false }) {
  return (
    <div
      className={`flex shrink-0 flex-col overflow-hidden rounded-xl border border-[#f2f2f2] bg-[#fcfcfc] dark:border-zinc-700 dark:bg-zinc-800 ${
        compact ? 'w-[270px]' : 'w-[310px]'
      }`}
    >
      <div className="p-2.5">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1">
              <span
                className={`rounded px-1 py-0.5 text-[10px] font-medium uppercase ${PRIORITY_STYLES[task.priority]}`}
              >
                {PRIORITY_LABELS[task.priority]}
              </span>
              {task.source === 'ai' && (
                <span className="flex items-center gap-1 rounded bg-[#f9f4ff] px-1 py-0.5 text-[10px] font-medium text-[#8022fe]">
                  {task.aiIcon !== false && <Sparkles size={8} />}
                  AI
                </span>
              )}
            </div>
            {task.status && (
              <>
                <span className="h-2.5 w-px bg-[#e9e9e9] dark:bg-zinc-600" />
                <span
                  className={`rounded bg-[#f2f2f2] px-1 py-0.5 text-[10px] font-medium text-[#a3a3a3] dark:bg-zinc-700 ${
                    task.statusUppercase ? 'uppercase' : ''
                  }`}
                >
                  {task.status}
                </span>
              </>
            )}
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-[14px] font-medium text-[#5d5d5d] dark:text-gray-300">{task.title}</p>
            <p className="truncate text-[10px] font-medium text-[#c2c2c2]">{task.description}</p>
          </div>
        </div>
      </div>
      <div className="flex min-h-[35px] items-center justify-between border-t border-[#f2f2f2] px-2.5 py-2 dark:border-zinc-700">
        <p className="text-[10px] font-medium whitespace-nowrap">
          <span className="text-[#c2c2c2]">Due:</span>
          <span className="text-[#5d5d5d] dark:text-gray-300"> {task.due}</span>
        </p>
        {task.overdueDays != null && (
          <span className="flex items-center gap-1 rounded bg-[rgba(220,38,38,0.05)] px-1.5 py-0.5 text-[10px] font-medium text-[#dc2626]">
            <CircleX size={10} className="shrink-0" />
            Overdue {task.overdueDays}d
          </span>
        )}
      </div>
    </div>
  );
}

function LinkedHabitCard({ habit, compact = false }) {
  const progress = habit.todayProgress;

  return (
    <div
      className={`flex shrink-0 items-end overflow-hidden rounded-xl border border-[#f2f2f2] bg-[#fcfcfc] dark:border-zinc-700 dark:bg-zinc-800 ${
        compact ? 'w-[270px]' : 'w-[310px]'
      }`}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 px-2.5 pt-2 pb-2.5">
        <div className="flex flex-col gap-0.5">
          <p className="text-[14px] font-medium text-[#5d5d5d] dark:text-gray-300">{habit.title}</p>
          <p className="truncate text-[10px] font-medium text-[#c2c2c2]">{habit.description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-1">
          {habit.stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <span
                key={stat.label}
                className="flex items-center gap-1.5 rounded border border-[#f2f2f2] px-1.5 py-0.5 text-[10px] font-medium dark:border-zinc-700"
              >
                {Icon && (
                  <Icon
                    size={10}
                    className={`shrink-0 ${stat.accent ? 'text-[#f97316]' : 'text-[#5d5d5d]'}`}
                  />
                )}
                <span className={stat.accent ? 'text-[#f97316]' : 'text-[#5d5d5d] dark:text-gray-300'}>
                  {stat.label}
                </span>
              </span>
            );
          })}
        </div>
      </div>
      <div
        className={`flex shrink-0 flex-col items-center self-stretch border-l border-[#f2f2f2] p-2.5 dark:border-zinc-700 ${
          progress ? 'justify-between' : 'justify-start'
        }`}
      >
        <div className="size-[30px] shrink-0 rounded-lg border border-[#e9e9e9] bg-white dark:border-zinc-600 dark:bg-zinc-900" />
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
          <span className="flex h-5 w-5 items-center justify-center rounded-[5px] bg-[#fcfcfc] px-1 text-[12px] font-medium text-[#c2c2c2] dark:bg-zinc-800">
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
          <Plus size={14} />
        </button>
        <button
          type="button"
          onClick={onAi}
          aria-label={`AI suggest ${label.toLowerCase()}`}
          className="text-[#8022fe] hover:opacity-80"
        >
          <Sparkles size={14} />
        </button>
      </div>
    </div>
  );
}

function EmptyLinkedState({ message }) {
  return (
    <div className="flex min-h-[81px] w-full items-center justify-center rounded-xl border border-dashed border-[#e9e9e9] bg-[#fcfcfc] px-3 py-4 dark:border-zinc-700 dark:bg-zinc-800">
      <p className="text-[12px] font-medium text-[#c2c2c2]">{message}</p>
    </div>
  );
}

function PillBadge({ children, className = '' }) {
  return (
    <span
      className={`inline-flex w-fit items-center rounded-md border border-[#f2f2f2] px-2 pt-0.5 pb-[3px] text-[14px] font-medium text-[#5d5d5d] dark:border-zinc-700 dark:text-gray-300 ${className}`}
    >
      {children}
    </span>
  );
}

// Resizable drawer — matches TaskDetailDrawer's exact range (Tasks board).
const DRAWER_DEFAULT_WIDTH = 360;
const DRAWER_MIN_WIDTH = 360;
const DRAWER_MAX_WIDTH = 720;

export default function GoalDetailPanel({
  goal,
  onClose,
  onOpenFullPage,
  onEdit,
  onImprove,
  onPause,
  onDelete,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [width, setWidth] = useState(DRAWER_DEFAULT_WIDTH);
  const isResizing = useRef(false);
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.innerWidth >= 1024
  );

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

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing.current) return;
      const next = Math.min(
        DRAWER_MAX_WIDTH,
        Math.max(DRAWER_MIN_WIDTH, window.innerWidth - e.clientX)
      );
      setWidth(next);
    };
    const handleMouseUp = () => {
      isResizing.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const startResize = () => {
    isResizing.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  if (!goal) return null;

  const linkedTasks = getLinkedTasks(goal);
  const linkedHabits = getLinkedHabits(goal);
  const taskCount = goal.tasks ?? linkedTasks.length;
  const habitCount = goal.habits ?? linkedHabits.length;
  const hasDue = goal.dueDetail || goal.due;

  return (
    <div className="fixed inset-0 z-50 max-lg:bg-black/10 lg:top-13 lg:z-30 lg:bg-transparent">
      <button
        type="button"
        aria-label="Close goal detail"
        onClick={onClose}
        className="absolute inset-0"
      />

      <aside
        style={isDesktop ? { width } : undefined}
        className="absolute inset-y-0 right-0 flex w-full max-w-full flex-col items-start overflow-hidden border-l border-[#f2f2f2] bg-white dark:border-zinc-700 dark:bg-zinc-900 lg:max-w-[720px]"
        aria-label="Goal detail"
      >
        <button
          type="button"
          aria-label="Resize goal detail panel"
          onMouseDown={startResize}
          className="absolute inset-y-0 left-0 hidden w-1 -translate-x-1/2 cursor-col-resize hover:bg-[#8022fe]/20 lg:block"
        />

        <div className="flex w-full shrink-0 items-center justify-between border-b border-[#f2f2f2] px-5 py-4 dark:border-zinc-700">
          <button
            type="button"
            onClick={() => onOpenFullPage?.(goal)}
            aria-label="Open goal in full page"
            className="text-[#a3a3a3] hover:text-[#5d5d5d]"
          >
            <ExternalLink size={16} />
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close goal detail"
            className="text-[#a3a3a3] hover:text-[#5d5d5d]"
          >
            <X size={14} />
          </button>
        </div>

        <div className="scrollbar-hidden flex min-h-0 w-full flex-1 flex-col gap-6 overflow-y-auto py-5 pl-5 pr-[30px]">
          <div className="flex w-full flex-col gap-3">
            <div className="flex w-full flex-col gap-3">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-md px-2 pt-0.5 pb-[3px] text-[14px] font-medium uppercase ${PRIORITY_STYLES[goal.priority]}`}
                  >
                    {PRIORITY_LABELS[goal.priority]}
                  </span>
                  {goal.source === 'ai' && (
                    <span className="flex items-center gap-1.5 rounded-md bg-[#f9f4ff] px-2 pt-0.5 pb-[3px] text-[14px] font-medium text-[#8022fe]">
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
                    <MoreHorizontal size={16} />
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

              <div className="flex w-full flex-col gap-1">
                <h2 className="text-[24px] font-semibold leading-[1.3] text-[#181818] dark:text-white">
                  {goal.title}
                </h2>
                {goal.description && (
                  <p className="text-[14px] font-medium leading-normal text-[#a3a3a3]">{goal.description}</p>
                )}
              </div>
            </div>

            {!goal.completedDate && goal.status !== 'completed' && (
              <div className="flex w-full flex-col gap-2">
                <div className="flex items-center justify-between text-[14px] font-medium">
                  <span className="text-[#c2c2c2]">Progress</span>
                  <span className="text-[#5d5d5d] dark:text-gray-300">{goal.progress ?? 0}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-[40px] bg-[#f2f2f2] dark:bg-zinc-700">
                  <div
                    className="h-full rounded-[18px] bg-[#8022fe]"
                    style={{ width: `${goal.progress ?? 0}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="h-px w-full shrink-0 bg-[#f2f2f2] dark:bg-zinc-700" />

          <div className="flex w-full flex-col gap-6">
            <div className="flex w-full flex-col gap-1.5">
              <p className="text-[12px] font-medium text-[#c2c2c2]">Category</p>
              <PillBadge>{goal.category}</PillBadge>
            </div>

            {hasDue && (
              <div className="flex w-full flex-col gap-1.5">
                <p className="text-[12px] font-medium text-[#c2c2c2]">Due Date</p>
                <PillBadge className="gap-1.5">
                  <Flag size={12} className="shrink-0 text-[#5d5d5d]" />
                  <DueDetailPill goal={goal} />
                </PillBadge>
              </div>
            )}

            <div className="flex w-full flex-col gap-1.5">
              <LinkedSectionHeader label="Linked Tasks" count={taskCount} onAdd={() => {}} onAi={() => {}} />
              {linkedTasks.length === 0 ? (
                <EmptyLinkedState message="No linked tasks yet" />
              ) : (
                <div className="scrollbar-hidden flex w-full gap-2 overflow-x-auto pb-1">
                  {linkedTasks.map((task, index) => (
                    <LinkedTaskCard key={task.id} task={task} compact={index > 0} />
                  ))}
                </div>
              )}
            </div>

            <div className="flex w-full flex-col gap-1.5">
              <LinkedSectionHeader label="Linked Habits" count={habitCount} onAdd={() => {}} onAi={() => {}} />
              {linkedHabits.length === 0 ? (
                <EmptyLinkedState message="No linked habits yet" />
              ) : (
                <div className="scrollbar-hidden flex w-full gap-2 overflow-x-auto pb-1">
                  {linkedHabits.map((habit, index) => (
                    <LinkedHabitCard key={habit.id} habit={habit} compact={index > 0} />
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
