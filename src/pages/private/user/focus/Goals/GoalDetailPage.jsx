import { useRef, useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import {
  Sparkles,
  MoreHorizontal,
  Flag,
  Plus,
  ChevronDown,
  Clock,
  TrendingUp,
  CircleX,
  History,
  Check,
  Flame,
  Hourglass,
  Pencil,
  Pause,
  Trash2,
} from 'lucide-react';
import { getGoalById, getPageTasks, getPageHabits, WEEKDAY_LABELS } from './goalsData';
import GoalAiAssistant from './components/GoalAiAssistant';

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

const TODAY_INDEX = (new Date().getDay() + 6) % 7; // Mon=0 ... Sun=6

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
  return goal.due;
}

function PillBadge({ children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border border-[#f2f2f2] px-2 pt-0.5 pb-[3px] text-[14px] font-medium text-[#5d5d5d] dark:border-zinc-700 dark:text-gray-300 ${className}`}
    >
      {children}
    </span>
  );
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

function MetaTag({ tag }) {
  const Icon = tag.icon === 'clock' ? Clock : tag.linkedGoal ? TrendingUp : null;
  return (
    <span className="flex items-center gap-1.5 rounded-md border border-[#f2f2f2] px-1.5 py-0.5 text-[12px] font-medium text-[#5d5d5d] dark:border-zinc-700 dark:text-gray-300">
      {Icon && <Icon size={12} className="shrink-0" />}
      {tag.label}
    </span>
  );
}

function PageTaskCard({ task }) {
  const isDone = task.faded;

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-[#f2f2f2] bg-[#fcfcfc] dark:border-zinc-700 dark:bg-zinc-800">
      <div className="flex flex-col gap-2.5 p-3">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-3">
              <div className={`flex items-center gap-1 ${isDone ? 'opacity-40' : ''}`}>
                <span
                  className={`rounded-md px-1.5 py-0.5 text-[12px] font-medium uppercase ${PRIORITY_STYLES[task.priority]}`}
                >
                  {PRIORITY_LABELS[task.priority]}
                </span>
                {task.source === 'ai' && (
                  <span className="flex items-center gap-1 rounded-md bg-[#f9f4ff] px-1.5 py-0.5 text-[12px] font-medium text-[#8022fe]">
                    <Sparkles size={10} />
                    AI
                  </span>
                )}
              </div>
              {task.status && (
                <>
                  <span className="h-3 w-px bg-[#e9e9e9] dark:bg-zinc-600" />
                  <span
                    className={`rounded-md bg-[#f2f2f2] px-1.5 py-0.5 text-[12px] font-medium text-[#a3a3a3] dark:bg-zinc-700 ${
                      task.statusUppercase ? 'uppercase' : ''
                    }`}
                  >
                    {task.status}
                  </span>
                </>
              )}
            </div>
            <MoreHorizontal size={15} className="shrink-0 text-[#a3a3a3]" />
          </div>
          <div className="flex flex-col gap-1">
            <p
              className={`text-[16px] font-medium ${isDone ? 'text-[#5d5d5d] opacity-40' : 'text-[#181818]'} dark:text-gray-300`}
            >
              {task.title}
            </p>
            <p
              className={`line-clamp-1 text-[12px] font-medium ${isDone ? 'text-[#a3a3a3] opacity-40' : 'text-[#a3a3a3]'}`}
            >
              {task.description}
            </p>
          </div>
        </div>
        {task.tags?.length > 0 && (
          <div className="flex flex-wrap items-center gap-1">
            {task.tags.map((tag) => (
              <MetaTag key={tag.label} tag={tag} />
            ))}
          </div>
        )}
      </div>
      <div className="flex min-h-[42px] items-center justify-between border-t border-[#f2f2f2] px-3 py-2.5 dark:border-zinc-700">
        {task.completedLabel ? (
          <p className="w-full text-[12px] font-medium text-[#5d5d5d] dark:text-gray-300">
            {task.completedLabel}
          </p>
        ) : (
          <>
            <p className="text-[12px] font-medium">
              <span className="text-[#c2c2c2]">Due:</span>
              <span className="text-[#5d5d5d] dark:text-gray-300"> {task.due}</span>
            </p>
            {task.overdueDays != null && (
              <span className="flex items-center gap-1.5 rounded-md bg-[rgba(220,38,38,0.05)] px-1.5 py-0.5 text-[12px] font-medium text-[#dc2626]">
                <CircleX size={12} />
                Overdue {task.overdueDays}d
              </span>
            )}
            {task.overdueLabel && (
              <span
                className={`flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-[12px] font-medium ${
                  task.overdueOrange
                    ? 'bg-[rgba(249,115,22,0.05)] text-[#f97316]'
                    : 'bg-[rgba(220,38,38,0.05)] text-[#dc2626]'
                }`}
              >
                <History size={12} />
                {task.overdueLabel}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function HabitDayCell({ state, todayProgress }) {
  if (state === 'checked') {
    return (
      <div className="flex size-[30px] shrink-0 items-center justify-center rounded-lg bg-[#f9f4ff]">
        <Check size={12} strokeWidth={3} className="text-[#8022fe]" />
      </div>
    );
  }
  if (state === 'today' && todayProgress) {
    return (
      <div className="flex shrink-0 flex-col items-center gap-2">
        <div className="relative size-[30px] overflow-hidden rounded-lg border border-[#e9e9e9] bg-white dark:border-zinc-600">
          <div className="absolute inset-y-0 left-0 w-1/2 rounded-br rounded-tr-sm bg-[#f9f4ff]" />
        </div>
        <p className="text-[10px] font-medium text-[#181818] dark:text-gray-200">
          {todayProgress.done}/{todayProgress.total}
        </p>
      </div>
    );
  }
  return (
    <div className="size-[30px] shrink-0 rounded-lg border border-[#e9e9e9] bg-white dark:border-zinc-600 dark:bg-zinc-800" />
  );
}

function PageHabitRow({ habit }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-2xl border border-[#f2f2f2] bg-[#fcfcfc] p-3 dark:border-zinc-700 dark:bg-zinc-800">
      <div className="flex min-w-0 flex-1 items-start gap-5">
        <div className="w-full max-w-[250px] shrink-0 pr-5">
          <div className="flex flex-col gap-2.5">
            <div className="flex flex-col gap-1">
              <p className="text-[16px] font-medium text-[#181818] dark:text-white">{habit.title}</p>
              <p className="truncate text-[12px] font-medium text-[#a3a3a3]">{habit.description}</p>
            </div>
            <div className="flex flex-wrap items-center gap-1">
              {habit.tags.map((tag) => {
                const Icon =
                  tag.icon === 'flame' ? Flame : tag.icon === 'hourglass' ? Hourglass : null;
                return (
                  <span
                    key={tag.label}
                    className="flex items-center gap-1.5 rounded-md border border-[#f2f2f2] px-1.5 py-0.5 text-[12px] font-medium dark:border-zinc-700"
                  >
                    {Icon && (
                      <Icon
                        size={11}
                        className={`shrink-0 ${tag.accent ? 'text-[#f97316]' : 'text-[#5d5d5d]'}`}
                      />
                    )}
                    <span
                      className={tag.accent ? 'text-[#f97316]' : 'text-[#5d5d5d] dark:text-gray-300'}
                    >
                      {tag.label}
                    </span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>
        <div className="hidden items-start gap-5 lg:flex">
          {habit.days.map((day, i) => (
            <HabitDayCell
              key={WEEKDAY_LABELS[i]}
              state={day}
              todayProgress={day === 'today' ? habit.todayProgress : null}
            />
          ))}
        </div>
      </div>
      <MoreHorizontal size={15} className="shrink-0 text-[#a3a3a3]" />
    </div>
  );
}

function LinkedSectionHeader({ label, count, weekdays, onAdd, onAi }) {
  return (
    <div className="flex w-full items-center justify-between gap-3">
      <div className="flex shrink-0 items-center gap-1.5">
        <p className="text-[12px] font-medium text-[#c2c2c2]">{label}</p>
        {count > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-[5px] bg-[#fcfcfc] text-[12px] font-medium text-[#c2c2c2] dark:bg-zinc-800">
            {count}
          </span>
        )}
      </div>
      {weekdays && (
        <div className="hidden min-w-0 flex-1 items-center justify-center gap-5 pl-[178px] lg:flex">
          {weekdays.map((day, i) => (
            <span
              key={day}
              className={`w-[30px] text-center text-[12px] font-medium ${
                i === TODAY_INDEX ? 'text-[#8022fe]' : 'text-[#5d5d5d] dark:text-gray-300'
              }`}
            >
              {day}
            </span>
          ))}
        </div>
      )}
      <div className="flex shrink-0 items-center gap-5">
        <button type="button" onClick={onAdd} aria-label={`Add ${label}`} className="text-[#a3a3a3]">
          <Plus size={12} />
        </button>
        <button type="button" onClick={onAi} aria-label={`AI suggest ${label}`} className="text-[#8022fe]">
          <Sparkles size={12} />
        </button>
      </div>
    </div>
  );
}

function EmptyLinkedState({ message }) {
  return (
    <div className="flex min-h-[81px] w-full items-center justify-center rounded-2xl border border-dashed border-[#e9e9e9] bg-[#fcfcfc] px-3 py-4 dark:border-zinc-700 dark:bg-zinc-800">
      <p className="text-[12px] font-medium text-[#c2c2c2]">{message}</p>
    </div>
  );
}

export default function GoalDetailPage() {
  const { goalId } = useParams();
  const goal = getGoalById(goalId);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(true);
  const [isAssistantExpanded, setIsAssistantExpanded] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!goal) return <Navigate to="/user/goals" replace />;

  const tasks = getPageTasks(goal);
  const habits = getPageHabits(goal);
  const hasDue = goal.dueDetail || goal.due;

  const closeAssistant = () => {
    setIsAssistantOpen(false);
    setIsAssistantExpanded(false);
  };
  const toggleExpandAssistant = () => setIsAssistantExpanded((e) => !e);

  return (
    <div className="-mx-10 flex min-h-[calc(100vh-3.25rem)] flex-col py-7.5 max-lg:-mx-4 max-lg:py-4 max-lg:sm:-mx-6 max-lg:sm:py-6">
      <div className="flex flex-1 flex-col gap-7.5 xl:flex-row xl:items-stretch">
        <div className="relative scrollbar-hidden flex min-h-[min(70vh,798px)] min-w-0 flex-1 flex-col gap-6 overflow-y-auto rounded-2xl border border-[#f2f2f2] bg-white py-5 pl-5 pr-[26px] xl:min-h-0 dark:border-zinc-700 dark:bg-zinc-900">
          {!isAssistantOpen && (
            <button
              type="button"
              onClick={() => setIsAssistantOpen(true)}
              aria-label="Open AI Assistant"
              className="absolute top-4 right-12 z-10 flex items-center gap-1.5 rounded-lg bg-[#f9f4ff] px-2.5 py-1.5 text-[12px] font-medium text-[#8022fe]"
            >
              <Sparkles size={12} />
              AI Assistant
            </button>
          )}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
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
                <div ref={menuRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setMenuOpen((o) => !o)}
                    aria-label="Goal options"
                    className="text-[#a3a3a3]"
                  >
                    <MoreHorizontal size={16} />
                  </button>
                  {menuOpen && (
                    <GoalDetailMenu
                      onClose={() => setMenuOpen(false)}
                      onEdit={() => setMenuOpen(false)}
                      onImprove={() => setMenuOpen(false)}
                      onPause={() => setMenuOpen(false)}
                      onDelete={() => setMenuOpen(false)}
                    />
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <h1 className="text-[20px] font-medium text-[#181818] dark:text-white">{goal.title}</h1>
                <p className="text-[12px] font-medium text-[#c2c2c2]">{goal.description}</p>
              </div>
            </div>

            {goal.status !== 'completed' && !goal.completedDate && (
              <div className="flex flex-col gap-2">
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

          <div className="h-px w-full bg-[#f2f2f2] dark:bg-zinc-700" />

          <div className="flex flex-col gap-[50px]">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1.5">
                <p className="text-[12px] font-medium text-[#c2c2c2]">Category</p>
                <PillBadge>{goal.category}</PillBadge>
              </div>
              {hasDue && (
                <div className="flex flex-col gap-1.5">
                  <p className="text-[12px] font-medium text-[#c2c2c2]">Due Date</p>
                  <PillBadge className="gap-1.5">
                    <Flag size={12} className="shrink-0 text-[#5d5d5d]" />
                    <DueDetailPill goal={goal} />
                  </PillBadge>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <LinkedSectionHeader
                  label="Linked Tasks"
                  count={goal.tasks ?? tasks.length}
                  onAdd={() => {}}
                  onAi={() => {}}
                />
                {tasks.length === 0 ? (
                  <EmptyLinkedState message="No linked tasks yet" />
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="grid w-full grid-cols-1 gap-2.5 md:grid-cols-2">
                      {tasks.map((task) => (
                        <PageTaskCard key={task.id} task={task} />
                      ))}
                    </div>
                    {(goal.tasks ?? 0) > tasks.length && (
                      <button
                        type="button"
                        className="flex items-center gap-2 text-[12px] font-medium text-[#c2c2c2] hover:text-[#8022fe]"
                      >
                        View All {goal.tasks} tasks
                        <ChevronDown size={10} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <LinkedSectionHeader
                label="Linked Habits"
                count={goal.habits ?? habits.length}
                weekdays={habits.length > 0 ? WEEKDAY_LABELS : null}
                onAdd={() => {}}
                onAi={() => {}}
              />
              {habits.length === 0 ? (
                <EmptyLinkedState message="No linked habits yet" />
              ) : (
                <div className="flex flex-col gap-2">
                  {habits.map((habit) => (
                    <PageHabitRow key={habit.id} habit={habit} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {isAssistantOpen && !isAssistantExpanded && (
          <div className="flex h-125 w-full shrink-0 flex-col xl:h-full xl:w-100">
            <GoalAiAssistant
              onClose={closeAssistant}
              onToggleExpand={toggleExpandAssistant}
              isExpanded={false}
            />
          </div>
        )}
      </div>

      {isAssistantOpen && isAssistantExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="h-[85vh] w-full max-w-2xl">
            <GoalAiAssistant onClose={closeAssistant} onToggleExpand={toggleExpandAssistant} isExpanded />
          </div>
        </div>
      )}
    </div>
  );
}
