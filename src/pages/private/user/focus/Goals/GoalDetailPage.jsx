import { useRef, useState, useEffect } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Sparkles,
  MoreHorizontal,
  Flag,
  Plus,
  ArrowDown,
  ArrowUp,
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
import { WEEKDAY_LABELS } from './goalsData';
import {
  clearCurrentGoal,
  deleteGoal,
  fetchGoalById,
  selectCurrentGoal,
  selectCurrentGoalHabits,
  selectCurrentGoalTasks,
  selectGoalDetailLoading,
  selectGoals,
  updateGoalStatus,
} from '../../../../../features/goals/goalsSlice';
import GoalAiAssistant from './components/GoalAiAssistant';
import NewHabitsModal from '../Habits/components/NewHabitsModal';
import TaskFormModal from '../Tasks/components/TaskFormModal';

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

// Figma Frame 5.1 + Habits board lock today to Wed (Mon=0).
const TODAY_INDEX = 2;

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
      className={`inline-flex w-fit items-center rounded-md border border-[#f2f2f2] px-2 pt-0.5 pb-0.75 text-[14px] font-medium text-[#5d5d5d] dark:border-zinc-700 dark:text-gray-300 ${className}`}
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
        <Pencil size={12} className="shrink-0" />
        Edit goal
      </button>
      <button type="button" onClick={onImprove} className={`${itemBase} text-[#8022fe]`}>
        <Sparkles size={12} className="shrink-0" />
        Improve goal
      </button>
      <div className="h-px w-full bg-[#f2f2f2] dark:bg-zinc-700" />
      <button type="button" onClick={onPause} className={`${itemBase} text-[#5d5d5d] dark:text-gray-300`}>
        <Pause size={12} className="shrink-0" />
        Pause goal
      </button>
      <button type="button" onClick={onDelete} className={`${itemBase} text-[#5d5d5d] dark:text-gray-300`}>
        <Trash2 size={12} className="shrink-0" />
        Delete
      </button>
      <button type="button" onClick={onClose} className="sr-only">
        Close menu
      </button>
    </div>
  );
}

function TaskCardMenu({ onEdit, onClose }) {
  const itemBase =
    'flex w-full items-center gap-1.5 px-2.5 py-1.5 text-left text-[12px] font-medium whitespace-nowrap hover:bg-[#fcfcfc] dark:hover:bg-zinc-700';
  return (
    <div className="absolute right-0 top-full z-50 mt-1 flex w-max flex-col overflow-hidden rounded-lg border border-[#f2f2f2] bg-white shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)] dark:border-zinc-700 dark:bg-zinc-800">
      <button
        type="button"
        onClick={() => {
          onEdit?.();
          onClose();
        }}
        className={`${itemBase} text-[#5d5d5d] dark:text-gray-300`}
      >
        <Pencil size={12} className="shrink-0" />
        Edit task
      </button>
      <button type="button" onClick={onClose} className={`${itemBase} text-[#5d5d5d] dark:text-gray-300`}>
        <Check size={12} className="shrink-0" />
        Complete
      </button>
      <div className="h-px w-full bg-[#f2f2f2] dark:bg-zinc-700" />
      <button type="button" onClick={onClose} className={`${itemBase} text-[#dc2626]`}>
        <Trash2 size={12} className="shrink-0" />
        Delete
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

function PageTaskCard({ task, onEdit }) {
  const isDone = task.faded;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
                    <Sparkles size={12} className="shrink-0" />
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
            <div ref={menuRef} className="relative shrink-0">
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                aria-label="Task options"
                className="text-[#a3a3a3] hover:text-[#5d5d5d]"
              >
                <MoreHorizontal size={16} />
              </button>
              {menuOpen && (
                <TaskCardMenu
                  onClose={() => setMenuOpen(false)}
                  onEdit={() => onEdit?.(task)}
                />
              )}
            </div>
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

// Same MVP toggle as Habits board: empty / today / 1/2 → checked; checked → empty (or today).
function HabitDayCell({ state, todayProgress, onToggle }) {
  if (state === 'unscheduled') {
    return <div className="size-[30px] shrink-0" aria-hidden />;
  }

  const boxClass =
    'box-border size-[30px] shrink-0 cursor-pointer rounded-lg p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8022fe]/40';

  if (state === 'checked') {
    return (
      <button
        type="button"
        onClick={onToggle}
        aria-label="Mark habit incomplete for this day"
        className={`flex items-center justify-center border-0 bg-[#f9f4ff] ${boxClass}`}
      >
        <Check size={12} strokeWidth={3} className="text-[#8022fe]" />
      </button>
    );
  }

  if ((state === 'today' || state === 'empty') && todayProgress) {
    const fillPct = Math.min(100, Math.max(0, (todayProgress.done / todayProgress.total) * 100));
    return (
      <div className="flex shrink-0 flex-col items-center gap-2">
        <button
          type="button"
          onClick={onToggle}
          aria-label={`${todayProgress.done} of ${todayProgress.total} completed — mark complete`}
          className={`relative overflow-hidden border border-[#e9e9e9] bg-white dark:border-zinc-600 dark:bg-zinc-800 ${boxClass}`}
        >
          <span
            aria-hidden
            className="absolute inset-y-0 left-0 rounded-br rounded-tr-sm bg-[#f9f4ff]"
            style={{ width: `${fillPct}%` }}
          />
        </button>
        <p className="text-[10px] font-medium text-[#181818] dark:text-gray-200">
          {todayProgress.done}/{todayProgress.total}
        </p>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label="Mark habit complete for this day"
      className={`border border-[#e9e9e9] bg-white dark:border-zinc-600 dark:bg-zinc-800 ${boxClass}`}
    />
  );
}

function HabitRowMenu({ onEdit, onClose }) {
  const itemBase =
    'flex w-full items-center gap-1.5 px-2.5 py-1.5 text-left text-[12px] font-medium whitespace-nowrap hover:bg-[#fcfcfc] dark:hover:bg-zinc-700';
  return (
    <div className="absolute right-0 top-full z-50 mt-1 flex w-max flex-col overflow-hidden rounded-lg border border-[#f2f2f2] bg-white shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)] dark:border-zinc-700 dark:bg-zinc-800">
      <button
        type="button"
        onClick={() => {
          onEdit?.();
          onClose();
        }}
        className={`${itemBase} text-[#5d5d5d] dark:text-gray-300`}
      >
        <Pencil size={12} className="shrink-0" />
        Edit habit
      </button>
      <button type="button" onClick={onClose} className={`${itemBase} text-[#5d5d5d] dark:text-gray-300`}>
        <Pause size={12} className="shrink-0" />
        Skip today
      </button>
      <div className="h-px w-full bg-[#f2f2f2] dark:bg-zinc-700" />
      <button type="button" onClick={onClose} className={`${itemBase} text-[#dc2626]`}>
        <Trash2 size={12} className="shrink-0" />
        Delete
      </button>
    </div>
  );
}

function PageHabitRow({ habit, onEdit }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [days, setDays] = useState(habit.days);
  const cardRef = useRef(null);

  useEffect(() => {
    setDays(habit.days);
  }, [habit]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Match Habits board MVP: one click toggles empty/today/1/2 ↔ checked.
  const handleToggleDay = (dayIndex) => {
    setDays((prev) => {
      const current = prev[dayIndex];
      if (current === 'unscheduled') return prev;
      const next = [...prev];
      if (current === 'checked') {
        next[dayIndex] = dayIndex === TODAY_INDEX ? 'today' : 'empty';
      } else {
        next[dayIndex] = 'checked';
      }
      return next;
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex flex-col gap-2 rounded-2xl border border-[#f2f2f2] bg-[#fcfcfc] p-3 dark:border-zinc-700 dark:bg-zinc-800"
    >
      {/* Main row: name col + desktop day cells (menu is absolute, not in flex) */}
      <div className="flex items-start gap-3">
        <div className="w-[220px] shrink-0 flex flex-col gap-2.5">
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
                      size={12}
                      className={`shrink-0 ${tag.accent ? 'text-[#f97316]' : 'text-[#5d5d5d]'}`}
                    />
                  )}
                  <span className={tag.accent ? 'text-[#f97316]' : 'text-[#5d5d5d] dark:text-gray-300'}>
                    {tag.label}
                  </span>
                </span>
              );
            })}
          </div>
        </div>
        {/* Desktop day cells — flex-1 fills to card right; justify-evenly = equal gaps */}
        <div className="hidden flex-1 items-start justify-evenly lg:flex">
          {days.map((day, i) => (
            <HabitDayCell
              key={WEEKDAY_LABELS[i]}
              state={day}
              todayProgress={day === 'today' ? habit.todayProgress : null}
              onToggle={() => handleToggleDay(i)}
            />
          ))}
        </div>
      </div>
      {/* Mobile: day labels row + day cells row (hidden on lg+) */}
      <div className="flex flex-col gap-1.5 lg:hidden">
        <div className="flex items-center justify-between">
          {WEEKDAY_LABELS.map((day, i) => (
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
        <div className="flex items-start justify-between">
          {days.map((day, i) => (
            <HabitDayCell
              key={`m-${WEEKDAY_LABELS[i]}`}
              state={day}
              todayProgress={day === 'today' ? habit.todayProgress : null}
              onToggle={() => handleToggleDay(i)}
            />
          ))}
        </div>
      </div>
      {(isHovered || menuOpen) && (
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Habit options"
          aria-expanded={menuOpen}
          className={`absolute right-3 top-3 z-20 rounded-md p-1 text-[#a3a3a3] ${menuOpen ? 'bg-[#f2f2f2]' : 'hover:bg-[#f2f2f2]'}`}
        >
          <MoreHorizontal size={14} />
        </button>
      )}
      {menuOpen && (
        <div className="absolute right-3 top-9 z-50">
          <HabitRowMenu
            onClose={() => setMenuOpen(false)}
            onEdit={() => onEdit?.(habit)}
          />
        </div>
      )}
    </div>
  );
}

function LinkedSectionHeader({ label, count, weekdays, onAdd, onAi }) {
  const labelEl = (
    <div className="flex items-center gap-1.5">
      <p className="text-[12px] font-medium text-[#c2c2c2]">{label}</p>
      {count > 0 && (
        <span className="flex h-5 w-5 items-center justify-center rounded-[5px] bg-[#fcfcfc] text-[12px] font-medium text-[#c2c2c2] dark:bg-zinc-800">
          {count}
        </span>
      )}
    </div>
  );
  const buttons = (
    <div className="flex shrink-0 items-center gap-5">
      <button type="button" onClick={onAdd} aria-label={`Add ${label}`} className="text-[#a3a3a3]">
        <Plus size={14} />
      </button>
      <button type="button" onClick={onAi} aria-label={`AI suggest ${label}`} className="text-[#8022fe]">
        <Sparkles size={14} />
      </button>
    </div>
  );

  if (!weekdays) {
    return (
      <div className="flex w-full items-center justify-between gap-3">
        {labelEl}
        {buttons}
      </div>
    );
  }

  // Habits header: pr-3.25 (13px) matches the card's border+padding right inset so
  // the day labels section spans the SAME width as the row's flex-1 day cells.
  // Buttons are absolute so they don't consume width from the day labels flex-1.
  return (
    <div className="relative flex w-full items-center lg:pr-3.25">
      {/* Desktop: fixed 245px col — aligns with row day-cells start */}
      <div className="hidden w-61.25 shrink-0 lg:flex">
        {labelEl}
      </div>
      {/* Desktop: day labels — justify-evenly mirrors row cells for equal column spacing */}
      <div className="hidden min-w-0 flex-1 items-center justify-evenly lg:flex">
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
      {/* Desktop: buttons float at far right without consuming flex space */}
      <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 items-center lg:flex">{buttons}</div>
      {/* Mobile: just label + buttons, day labels are inside each row card */}
      <div className="flex w-full items-center justify-between lg:hidden">
        {labelEl}
        {buttons}
      </div>
    </div>
  );
}

// Rule 6 + Figma Frame 4/5 — 'No linked tasks yet' / 'No linked habits yet'; Plus + AI always visible above.
function EmptyLinkedState({ message }) {
  return (
    <div className="flex min-h-[81px] w-full items-center justify-center rounded-2xl border border-dashed border-[#e9e9e9] bg-[#fcfcfc] px-3 py-4 dark:border-zinc-700 dark:bg-zinc-800">
      <p className="text-[12px] font-medium text-[#c2c2c2]">{message}</p>
    </div>
  );
}

export default function GoalDetailPage() {
  const { goalId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const goals = useSelector(selectGoals);
  const currentGoal = useSelector(selectCurrentGoal);
  const apiTasks = useSelector(selectCurrentGoalTasks);
  const apiHabits = useSelector(selectCurrentGoalHabits);
  const loadingGoal = useSelector(selectGoalDetailLoading);
  const goal = currentGoal || goals.find((g) => String(g.id) === String(goalId)) || null;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(true);
  const [isAssistantExpanded, setIsAssistantExpanded] = useState(false);
  const [showAllTasks, setShowAllTasks] = useState(false);
  const [editedLists, setEditedLists] = useState({ goalId: null, tasks: null, habits: null });
  const [habitModal, setHabitModal] = useState({ open: false, habit: null });
  const [taskModal, setTaskModal] = useState({ open: false, task: null });
  const tasks =
    editedLists.goalId === goalId && editedLists.tasks ? editedLists.tasks : apiTasks;
  const habits =
    editedLists.goalId === goalId && editedLists.habits ? editedLists.habits : apiHabits;

  useEffect(() => {
    if (!goalId) return undefined;
    dispatch(fetchGoalById(goalId));
    return () => {
      dispatch(clearCurrentGoal());
    };
  }, [dispatch, goalId]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loadingGoal && !goal) return null;
  if (!loadingGoal && !goal) return <Navigate to="/user/goals" replace />;

  const hasDue = goal.dueDetail || goal.due;

  const closeAssistant = () => {
    setIsAssistantOpen(false);
    setIsAssistantExpanded(false);
  };
  const toggleExpandAssistant = () => setIsAssistantExpanded((e) => !e);

  const openEditTask = (task) => setTaskModal({ open: true, task });
  const closeTaskModal = () => setTaskModal({ open: false, task: null });
  const handleSubmitTask = (form) => {
    if (!taskModal.task) return;
    const tags = [{ label: form.category }];
    if (form.estMinutes) tags.push({ label: `${form.estMinutes} Min`, icon: 'clock' });
    if (form.linkedGoal && form.linkedGoal !== '__create_new__') {
      tags.push({ label: form.linkedGoal, linkedGoal: true });
    }
    const statusRaw = form.status || taskModal.task.status || 'to do';
    const dueLabel = form.dueDate
      ? (() => {
          const [year, month, day] = form.dueDate.split('-').map(Number);
          return new Date(year, month - 1, day).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });
        })()
      : taskModal.task.due;
    const baseTasks =
      editedLists.goalId === goalId && editedLists.tasks ? editedLists.tasks : apiTasks;
    setEditedLists({
      goalId,
      tasks: baseTasks.map((t) => {
        if (t.id !== taskModal.task.id) return t;
        return {
          ...t,
          title: form.title || t.title,
          description: form.description ?? t.description,
          priority: (form.priority || t.priority).toUpperCase(),
          category: form.category,
          tags,
          status: statusRaw,
          statusUppercase: /^(to do|done)$/i.test(statusRaw),
          due: dueLabel,
          faded: /done/i.test(statusRaw),
          completedLabel: /done/i.test(statusRaw) ? t.completedLabel || 'Completed' : undefined,
        };
      }),
      habits: editedLists.goalId === goalId ? editedLists.habits : null,
    });
  };

  const openEditHabit = (habit) => setHabitModal({ open: true, habit });
  const closeHabitModal = () => setHabitModal({ open: false, habit: null });
  const handleSaveHabit = (data) => {
    if (!habitModal.habit) return;
    const baseHabits =
      editedLists.goalId === goalId && editedLists.habits ? editedLists.habits : apiHabits;
    setEditedLists({
      goalId,
      habits: baseHabits.map((h) => {
        if (h.id !== habitModal.habit.id) return h;
        const nextDays =
          Array.isArray(data.targetDays) && data.targetDays.length > 0
            ? WEEKDAY_LABELS.map((day) => (data.targetDays.includes(day) ? 'empty' : 'unscheduled'))
            : h.days;
        const mergedDays = nextDays.map((state, i) => {
          if (state === 'unscheduled') return 'unscheduled';
          if (h.days?.[i] === 'checked' || h.days?.[i] === 'today') return h.days[i];
          return state;
        });
        return {
          ...h,
          title: data.title,
          description: data.description,
          days: mergedDays,
          todayProgress: mergedDays[TODAY_INDEX] === 'today' ? h.todayProgress : undefined,
        };
      }),
      tasks: editedLists.goalId === goalId ? editedLists.tasks : null,
    });
  };

  return (
    <div className="flex min-h-full flex-col py-7.5 max-lg:py-4 max-lg:sm:py-6">
      <div className="flex flex-1 min-h-0 flex-col gap-7.5 xl:flex-row xl:items-stretch">
        <div className="relative scrollbar-white flex min-h-[min(60vh,520px)] min-w-0 flex-1 flex-col gap-6 overflow-y-auto rounded-2xl border border-[#f2f2f2] bg-white py-5 pl-5 pr-[26px] xl:min-h-0 dark:border-zinc-700 dark:bg-zinc-900">
          {!isAssistantOpen && (
            <button
              type="button"
              onClick={() => setIsAssistantOpen(true)}
              aria-label="Open AI Assistant"
              className="absolute top-4 right-12 z-10 flex items-center gap-1.5 rounded-lg bg-[#f9f4ff] px-2.5 py-1.5 text-[12px] font-medium text-[#8022fe]"
            >
              <Sparkles size={14} />
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
                      <Sparkles size={14} />
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
                      onPause={async () => {
                        setMenuOpen(false);
                        const nextStatus = goal.status === 'paused' ? 'active' : 'paused';
                        await dispatch(updateGoalStatus({ goalId: goal.id, status: nextStatus }));
                      }}
                      onDelete={async () => {
                        setMenuOpen(false);
                        await dispatch(deleteGoal(goal.id));
                        navigate('/user/goals');
                      }}
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
                    <Flag size={14} className="shrink-0 text-[#5d5d5d]" />
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
                      {(showAllTasks ? tasks : tasks.slice(0, 4)).map((task) => (
                        <PageTaskCard key={task.id} task={task} onEdit={openEditTask} />
                      ))}
                    </div>
                    {(tasks.length > 4 || (goal.tasks ?? 0) > tasks.length) && (
                      <button
                        type="button"
                        onClick={() => setShowAllTasks((v) => !v)}
                        className="flex items-center gap-1.5 text-[13px] font-medium text-[#c2c2c2] hover:text-[#8022fe]"
                      >
                        {showAllTasks ? 'Show Less' : `View All ${goal.tasks ?? tasks.length} tasks`}
                        {showAllTasks ? <ArrowUp size={13} /> : <ArrowDown size={13} />}
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
                    <PageHabitRow key={habit.id} habit={habit} onEdit={openEditHabit} />
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

      {habitModal.open && (
        <NewHabitsModal
          key={habitModal.habit?.id ?? 'edit-habit'}
          open
          mode="edit"
          initialHabit={habitModal.habit}
          onClose={closeHabitModal}
          onSave={handleSaveHabit}
        />
      )}

      {taskModal.open && (
        <TaskFormModal
          key={taskModal.task?.id ?? 'edit-task'}
          mode="edit"
          initialTask={taskModal.task}
          onClose={closeTaskModal}
          onSubmit={handleSubmitTask}
        />
      )}
    </div>
  );
}
