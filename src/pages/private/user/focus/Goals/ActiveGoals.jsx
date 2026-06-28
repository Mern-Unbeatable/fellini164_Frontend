import {
  Plus,
  Search,
  Sparkles,
  Target,
  ChevronDown,
  ListTodo,
  Repeat,
  Flag,
  Check,
  MoreHorizontal,
  X,
  Pencil,
  Pause,
  Trash2,
} from 'lucide-react';
import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import NewGoalModal from './components/NewGoalModal';
import GoalProgressModal from './components/GoalProgressModal';
import GoalDetailPanel from './components/GoalDetailPanel';
import TypewriterText from '../../../../../components/ui/TypewriterText';
import { GHOST_GOALS, INITIAL_GOALS, FIGMA_BOARD_STATS } from './goalsData';

// First phrase matches the Figma frame's static subtitle text exactly; the rest are the
// user's explicitly suggested rotation phrases.
const GOALS_SUBTITLE_PHRASES = [
  'Set goals, track progress, and stay accountable...',
  'Set your goals and let AI build the path...',
  'Track progress across tasks and habits...',
  'AI helps you stay on track every day...',
];

const STATUS_STYLES = {
  paused: 'bg-[rgba(93,93,93,0.05)] text-[#5d5d5d]',
  completed: 'bg-[rgba(42,157,0,0.05)] text-[#2a9d00]',
};

const PRIORITY_STYLES = {
  URGENT: 'bg-[rgba(220,38,38,0.05)] text-[#dc2626]',
  HIGH: 'bg-[rgba(249,115,22,0.05)] text-[#f97316]',
  MEDIUM: 'bg-[rgba(202,138,4,0.05)] text-[#ca8a04]',
  LOW: 'bg-[rgba(107,114,128,0.05)] text-[#6b7280]',
};

const PRIORITY_LABELS = { URGENT: 'Urgent', HIGH: 'High', MEDIUM: 'Medium', LOW: 'Low' };

const FILTER_CONFIG = [
  {
    key: 'Status',
    defaultLabel: 'All Status',
    options: ['All Statuses', 'Active', 'Paused', 'Completed'],
  },
  {
    key: 'Progress',
    defaultLabel: 'All Progress',
    options: ['Any', '0-25%', '26-50%', '51-75%', '76-100%'],
  },
  {
    key: 'Priority',
    defaultLabel: 'All Priority',
    options: ['All Priorities', 'Urgent', 'High', 'Medium', 'Low'],
  },
  {
    key: 'Category',
    defaultLabel: 'All Category',
    options: ['All Categories', 'Career', 'Health', 'Finance', 'Personal', 'Education'],
  },
  {
    key: 'Source',
    defaultLabel: 'All Source',
    options: ['All Sources', 'Created by AI', 'Created manually'],
  },
  {
    key: 'Date',
    defaultLabel: 'All Date',
    options: ['All Dates', 'Today', 'Tomorrow', 'This week', 'This month', 'Overdue'],
  },
];

function GhostGoalMenu({ onRegenerate, onDismiss }) {
  return (
    <div className="absolute right-0 top-full z-30 mt-1 flex w-max flex-col overflow-hidden rounded-lg border border-[#f2f2f2] bg-white shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)] dark:border-zinc-700 dark:bg-zinc-800">
      <button
        type="button"
        onClick={onRegenerate}
        className="flex items-center gap-1.5 border-b border-[#f2f2f2] px-[10px] py-1.5 text-left text-sm font-medium whitespace-nowrap text-[#8022fe] hover:bg-[#fcfcfc] dark:border-zinc-700 dark:hover:bg-zinc-700"
      >
        <Sparkles size={10} className="shrink-0" />
        Regenerate suggestion
      </button>
      <button
        type="button"
        onClick={onDismiss}
        className="flex items-center gap-1.5 px-[10px] py-1.5 text-left text-sm font-medium whitespace-nowrap text-[#5d5d5d] hover:bg-[#fcfcfc] dark:text-gray-300 dark:hover:bg-zinc-700"
      >
        <X size={10} className="shrink-0" />
        Dismiss
      </button>
    </div>
  );
}

function GhostGoalCard({ goal, onDismiss, onRegenerate }) {
  const [isHovered, setIsHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = isHovered || menuOpen;
  const faded = isActive ? 'opacity-100' : 'opacity-40';

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative flex w-full flex-col justify-between overflow-hidden rounded-2xl border transition-all ${
        menuOpen ? 'overflow-visible' : ''
      } ${
        isActive
          ? 'min-h-[186px] border-solid border-[#e9e9e9] bg-[#fcfcfc] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)] dark:border-zinc-700 dark:bg-zinc-800'
          : 'h-[186px] border-dashed border-[#e9e9e9] bg-transparent dark:border-zinc-700'
      }`}
    >
      <div className="flex flex-col gap-[10px] p-3">
        <div className={`flex flex-col gap-2 transition-opacity duration-200 ${faded}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span
                className={`rounded-[6px] px-[6px] py-[2px] text-[12px] font-medium uppercase leading-[1.5] ${PRIORITY_STYLES[goal.priority]}`}
              >
                {PRIORITY_LABELS[goal.priority]}
              </span>
              <span className="flex items-center gap-1 rounded-[6px] bg-[#f9f4ff] px-[6px] py-[2px] text-[12px] font-medium leading-[1.5] text-[#8022fe]">
                <Sparkles size={10} />
                AI
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-[16px] font-medium leading-[1.5] text-[#181818] dark:text-white">{goal.title}</p>
            <p className="overflow-hidden text-ellipsis whitespace-nowrap text-[12px] font-medium leading-[1.5] text-[#a3a3a3]">
              {goal.description}
            </p>
          </div>
        </div>

        <div className={`flex flex-wrap items-center gap-1 transition-opacity duration-200 ${faded}`}>
          <span className="rounded-[6px] border border-[#f2f2f2] px-[6px] py-[2px] text-[12px] font-medium leading-[1.5] text-[#5d5d5d] dark:border-zinc-700 dark:text-gray-300">
            {goal.category}
          </span>
          <span className="flex items-center gap-1.5 rounded-[6px] border border-[#f2f2f2] px-[6px] py-[2px] text-[12px] font-medium leading-[1.5] text-[#5d5d5d] dark:border-zinc-700 dark:text-gray-300">
            <ListTodo size={12} className="shrink-0" />
            {goal.tasks} Tasks
          </span>
          <span className="flex items-center gap-1.5 rounded-[6px] border border-[#f2f2f2] px-[6px] py-[2px] text-[12px] font-medium leading-[1.5] text-[#5d5d5d] dark:border-zinc-700 dark:text-gray-300">
            <Repeat size={12} className="shrink-0" />
            {goal.habits} Habits
          </span>
          <span className="flex items-center gap-1.5 rounded-[6px] border border-[#f2f2f2] px-[6px] py-[2px] text-[12px] font-medium leading-[1.5] text-[#5d5d5d] dark:border-zinc-700 dark:text-gray-300">
            <Flag size={12} className="shrink-0" />
            {goal.due}
          </span>
        </div>
      </div>

      {isActive && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((o) => !o);
          }}
          aria-label="Ghost goal menu"
          aria-expanded={menuOpen}
          className={`animate-fade-in absolute right-3 top-3 z-20 shrink-0 rounded-[6px] p-1 text-[#5d5d5d] ${
            menuOpen ? 'bg-[#f2f2f2]' : 'hover:bg-[#f2f2f2]'
          }`}
        >
          <MoreHorizontal size={14} />
        </button>
      )}

      {menuOpen && (
        <div className="absolute right-3 top-9 z-50">
          <GhostGoalMenu
            onRegenerate={() => {
              setMenuOpen(false);
              onRegenerate(goal.id);
            }}
            onDismiss={() => {
              setMenuOpen(false);
              onDismiss(goal.id);
            }}
          />
        </div>
      )}

      <div
        className={`relative flex h-[54px] w-full shrink-0 items-center px-3 pt-[10px] pb-3 ${
          isActive ? 'border-t border-solid border-[#e9e9e9] dark:border-zinc-700' : 'border-t border-dashed border-[#e9e9e9] dark:border-zinc-700'
        }`}
      >
        <div
          className={`absolute inset-0 flex w-full flex-col gap-1.5 px-3 pt-[10px] pb-3 transition-opacity duration-200 ${
            isActive ? 'pointer-events-none opacity-0' : faded
          }`}
        >
          <div className="flex w-full items-center justify-between text-[12px] font-medium leading-[1.5]">
            <p className="text-[#c2c2c2]">Progress</p>
            <p className="text-[#5d5d5d] dark:text-gray-300">0%</p>
          </div>
          <div className="h-2 w-full rounded-[40px] bg-[#e9e9e9] dark:bg-zinc-600" />
        </div>
        <div
          className={`absolute inset-0 flex w-full items-center justify-between gap-2 px-3 pt-[10px] pb-3 transition-opacity duration-200 ${
            isActive ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          <p className="min-w-0 truncate text-[12px] font-medium leading-[1.5] text-[#c2c2c2]">AI suggested based on your profile</p>
          <button
            type="button"
            className="flex shrink-0 items-center gap-1.5 rounded-[6px] bg-[#f9f4ff] px-2 py-0.5 text-[12px] font-medium leading-[1.5] text-[#8022fe]"
          >
            Accept Goal
            <Check size={10} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}

// Figma hover frame 1250:10104 — menu: Edit | Add Task, Add Habit | Complete, Pause, Delete
function GoalCardMenu({ onEdit, onAddTask, onAddHabit, onComplete, onPause, onDelete }) {
  const itemBase =
    'flex w-full items-center gap-1.5 px-[10px] py-1.5 text-left text-[12px] font-medium leading-[1.5] whitespace-nowrap hover:bg-[#fcfcfc] dark:hover:bg-zinc-700';
  return (
    <div
      className="flex w-max flex-col overflow-hidden rounded-lg border border-[#f2f2f2] bg-white shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)] dark:border-zinc-700 dark:bg-zinc-800"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <button type="button" onClick={onEdit} className={`${itemBase} border-b border-[#f2f2f2] text-[#5d5d5d] dark:border-zinc-700 dark:text-gray-300`}>
        <Pencil size={10} className="shrink-0" />
        Edit
      </button>
      <button type="button" onClick={onAddTask} className={`${itemBase} text-[#8022fe]`}>
        <Sparkles size={10} className="shrink-0" />
        Add Task
      </button>
      <button type="button" onClick={onAddHabit} className={`${itemBase} text-[#8022fe]`}>
        <Sparkles size={10} className="shrink-0" />
        Add Habit
      </button>
      <button type="button" onClick={onComplete} className={`${itemBase} text-[#5d5d5d] dark:text-gray-300`}>
        <Check size={10} className="shrink-0" />
        Complete
      </button>
      <button type="button" onClick={onPause} className={`${itemBase} text-[#5d5d5d] dark:text-gray-300`}>
        <Pause size={10} className="shrink-0" />
        Pause
      </button>
      <button type="button" onClick={onDelete} className={`${itemBase} text-[#5d5d5d] dark:text-gray-300`}>
        <Trash2 size={10} className="shrink-0" />
        Delete
      </button>
    </div>
  );
}

function GoalCard({ goal, onSelect, onEdit, onAddTask, onAddHabit, onComplete, onPause, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isPaused = goal.status === 'paused';
  const isCompleted = goal.status === 'completed';
  const showMenuTrigger = isHovered || menuOpen;
  const faded = isPaused ? 'opacity-50' : '';

  return (
    <div
      ref={cardRef}
      role="button"
      tabIndex={0}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        if (e.target.closest('button')) return;
        onSelect?.(goal);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect?.(goal);
        }
      }}
      className={`relative flex min-h-[186px] w-full cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-[#f2f2f2] bg-[#fcfcfc] dark:border-zinc-700 dark:bg-zinc-800 ${
        menuOpen || isHovered
          ? 'z-10 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)]'
          : ''
      } ${menuOpen ? 'overflow-visible' : ''}`}
    >
      <div className="flex flex-col gap-[10px] p-3">
        <div className={`flex flex-col gap-2 ${faded}`}>
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-1">
              {!isCompleted && (
                <span
                  className={`rounded-[6px] px-[6px] py-[2px] text-[12px] font-medium uppercase leading-[1.5] ${PRIORITY_STYLES[goal.priority]}`}
                >
                  {PRIORITY_LABELS[goal.priority]}
                </span>
              )}
              {isPaused && (
                <span className={`rounded-[6px] px-[6px] py-[2px] text-[12px] font-medium leading-[1.5] ${STATUS_STYLES.paused}`}>
                  Paused
                </span>
              )}
              {isCompleted && (
                <span className={`rounded-[6px] px-[6px] py-[2px] text-[12px] font-medium leading-[1.5] ${STATUS_STYLES.completed}`}>
                  Completed
                </span>
              )}
              {goal.source === 'ai' && (
                <span className="flex items-center gap-1 rounded-[6px] bg-[#f9f4ff] px-[6px] py-[2px] text-[12px] font-medium leading-[1.5] text-[#8022fe]">
                  <Sparkles size={10} />
                  AI
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <p
              className={`text-[16px] font-medium leading-[1.5] ${isPaused ? 'text-[#5d5d5d] dark:text-gray-400' : 'text-[#181818] dark:text-white'}`}
            >
              {goal.title}
            </p>
            <p
              className={`overflow-hidden text-ellipsis whitespace-nowrap text-[12px] font-medium leading-[1.5] ${isPaused ? 'text-[#c2c2c2]' : 'text-[#a3a3a3]'}`}
            >
              {goal.description}
            </p>
          </div>
        </div>

        <div className={`flex flex-wrap items-center gap-1 ${faded}`}>
          <span className="rounded-[6px] border border-[#f2f2f2] px-[6px] py-[2px] text-[12px] font-medium leading-[1.5] text-[#5d5d5d] dark:border-zinc-700 dark:text-gray-300">
            {goal.category}
          </span>
          {goal.tasks > 0 && (
            <span className="flex items-center gap-1.5 rounded-[6px] border border-[#f2f2f2] px-[6px] py-[2px] text-[12px] font-medium leading-[1.5] text-[#5d5d5d] dark:border-zinc-700 dark:text-gray-300">
              <ListTodo size={12} className="shrink-0" />
              {goal.tasks} Tasks
            </span>
          )}
          {goal.habits > 0 && (
            <span className="flex items-center gap-1.5 rounded-[6px] border border-[#f2f2f2] px-[6px] py-[2px] text-[12px] font-medium leading-[1.5] text-[#5d5d5d] dark:border-zinc-700 dark:text-gray-300">
              <Repeat size={12} className="shrink-0" />
              {goal.habits} Habits
            </span>
          )}
          {goal.due && (
            <span className="flex items-center gap-1.5 rounded-[6px] border border-[#f2f2f2] px-[6px] py-[2px] text-[12px] font-medium leading-[1.5] text-[#5d5d5d] dark:border-zinc-700 dark:text-gray-300">
              <Flag size={12} className="shrink-0" />
              {goal.due}
            </span>
          )}
        </div>
      </div>

      {showMenuTrigger && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((o) => !o);
          }}
          aria-label="Goal menu"
          aria-expanded={menuOpen}
          className={`animate-fade-in absolute right-3 top-3 z-20 shrink-0 rounded-[6px] p-1 text-[#5d5d5d] ${
            menuOpen ? 'bg-[#f2f2f2] dark:bg-zinc-600' : 'hover:bg-[#f2f2f2] dark:hover:bg-zinc-600'
          }`}
        >
          <MoreHorizontal size={14} />
        </button>
      )}

      {menuOpen && (
        <div className="absolute right-3 top-9 z-50">
          <GoalCardMenu
            onEdit={() => {
              setMenuOpen(false);
              onEdit(goal);
            }}
            onAddTask={() => {
              setMenuOpen(false);
              onAddTask(goal);
            }}
            onAddHabit={() => {
              setMenuOpen(false);
              onAddHabit(goal);
            }}
            onComplete={() => {
              setMenuOpen(false);
              onComplete(goal);
            }}
            onPause={() => {
              setMenuOpen(false);
              onPause(goal);
            }}
            onDelete={() => {
              setMenuOpen(false);
              onDelete(goal);
            }}
          />
        </div>
      )}

      {isCompleted ? (
        <div className="border-t border-[#f2f2f2] px-3 pt-[10px] pb-3 dark:border-zinc-700">
          <div className="flex h-8 items-center justify-center gap-2 rounded-lg bg-[rgba(42,157,0,0.05)]">
            <p className="text-[12px] font-medium leading-[1.5] text-[#2a9d00]">Completed {goal.completedDate}</p>
            <Check size={11} className="shrink-0 text-[#2a9d00]" strokeWidth={2.5} />
          </div>
        </div>
      ) : (
        <div className="border-t border-[#f2f2f2] px-3 pt-[10px] pb-3 dark:border-zinc-700">
          <div className={`flex flex-col gap-1.5 ${faded}`}>
            <div className="flex w-full items-center justify-between text-[12px] font-medium leading-[1.5]">
              <p className="text-[#c2c2c2]">Progress</p>
              <p className="text-[#5d5d5d] dark:text-gray-300">{goal.progress}%</p>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-[40px] bg-[#e9e9e9] dark:bg-zinc-600">
              <div
                className={`h-full rounded-[18px] ${isPaused ? 'bg-[#c2c2c2]' : 'bg-[#8022fe]'}`}
                style={{ width: `${goal.progress}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterDropdown({ defaultLabel, options }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(options[0]);
  const [hovered, setHovered] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayLabel = selected === options[0] ? defaultLabel : selected;

  return (
    <div ref={ref} className="relative max-lg:w-full lg:flex-1 2xl:flex-none">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-lg border border-[#f2f2f2] bg-white px-3 py-[7px] text-[12px] font-medium leading-[1.5] text-[#181818] dark:border-zinc-700 dark:bg-zinc-800 dark:text-white max-lg:gap-2 max-lg:py-2.5 max-lg:text-base 2xl:w-30"
      >
        <span className="truncate max-lg:min-w-0 max-lg:flex-1 max-lg:text-center">{displayLabel}</span>
        <ChevronDown size={10} className="shrink-0 text-[#a3a3a3]" />
      </button>

      {open && (
        <div className="absolute right-0 top-8 z-50 max-h-60 w-25 overflow-y-auto rounded-lg border border-[#f2f2f2] bg-white shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)] dark:border-zinc-700 dark:bg-zinc-800 max-lg:top-full max-lg:mt-1 max-lg:w-auto lg:left-0 lg:right-auto 2xl:w-30">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onMouseEnter={() => setHovered(opt)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => {
                setSelected(opt);
                setOpen(false);
              }}
              className={`flex w-full items-center px-2 py-1.5 text-left text-[12px] font-medium whitespace-nowrap text-[#181818] dark:text-white max-lg:text-sm ${
                hovered === opt ? 'bg-[#f2f2f2] dark:bg-zinc-700' : ''
              }`}
            >
              {opt === options[0] ? defaultLabel : opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function goalMatchesSearch(goal, query) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [goal.title, goal.description, goal.category].join(' ').toLowerCase();
  return haystack.includes(q);
}

export default function ActiveGoals() {
  const navigate = useNavigate();
  const [goals, setGoals] = useState(INITIAL_GOALS);
  const [modal, setModal] = useState(false);
  const [modalProgress, setModalProgress] = useState(false);
  const [ghostGoals, setGhostGoals] = useState(GHOST_GOALS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGoalId, setSelectedGoalId] = useState(null);

  const selectedGoal = useMemo(
    () => goals.find((g) => g.id === selectedGoalId) ?? null,
    [goals, selectedGoalId]
  );

  const handleOpenModal = () => setModal(true);
  const handleCloseModal = () => setModal(false);
  const handleCloseModalProgress = () => setModalProgress(false);
  const handleSavePlan = (data) => {
    if (!data?.title) return;
    setGoals((prev) => [
      {
        id: `goal-${Date.now()}`,
        priority: data.priority || 'MEDIUM',
        title: data.title,
        description: data.description || '',
        category: data.category || 'Career',
        tasks: 0,
        habits: 0,
        due: data.due || 'Today',
        progress: 0,
        status: 'active',
        source: data.source || 'manual',
      },
      ...prev,
    ]);
  };

  const handleDismissGhost = (id) => {
    setGhostGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const handleRegenerateGhost = () => {
    // Visual-only for Step 1 — AI regeneration wired in a later step.
  };

  const handleEditGoal = () => {
    setModal(true);
  };

  const handleAddTask = () => {
    // Wired in a later step.
  };

  const handleAddHabit = () => {
    // Wired in a later step.
  };

  const handleCompleteGoal = (goal) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goal.id
          ? { ...g, status: 'completed', progress: 100, completedDate: 'May 8, 2026' }
          : g
      )
    );
  };

  const handlePauseGoal = (goal) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goal.id
          ? { ...g, status: g.status === 'paused' ? 'active' : 'paused' }
          : g
      )
    );
  };

  const handleDeleteGoal = (id) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    if (selectedGoalId === id) setSelectedGoalId(null);
  };

  const handleSelectGoal = (goal) => setSelectedGoalId(goal.id);
  const handleCloseGoalDetail = () => setSelectedGoalId(null);
  const handleOpenGoalPage = (goal) => navigate(`/user/goals/${goal.id}`);

  const filteredGoals = useMemo(
    () => goals.filter((g) => goalMatchesSearch(g, searchQuery)),
    [goals, searchQuery]
  );

  const filteredGhostGoals = useMemo(
    () => ghostGoals.filter((g) => goalMatchesSearch(g, searchQuery)),
    [ghostGoals, searchQuery]
  );

  const boardIsEmpty = goals.length === 0;
  const isSearching = searchQuery.trim().length > 0;
  const showGhostCards = boardIsEmpty && filteredGhostGoals.length > 0;

  const activeCount = FIGMA_BOARD_STATS.active;
  const pausedCount = FIGMA_BOARD_STATS.paused;
  const completedThisMonth = FIGMA_BOARD_STATS.completedThisMonth;

  return (
    <div className="py-7.5 max-lg:py-4 max-lg:sm:py-6">
      {/* Header */}
      <div className="mb-5 flex w-full items-start justify-between max-lg:mb-4 max-lg:flex-col max-lg:gap-4">
        <div className="flex flex-col items-start gap-2">
          <p className="text-[20px] font-medium text-[#181818] dark:text-white">Goals Board</p>
          <TypewriterText
            phrases={GOALS_SUBTITLE_PHRASES}
            className="text-[12px] font-medium text-[#c2c2c2] dark:text-gray-400 max-lg:text-sm"
          />
        </div>
        <label className="flex w-62.5 items-center gap-2 rounded-lg border border-[#f2f2f2] bg-white px-3 py-1.75 focus-within:border-[#e9e9e9] dark:border-zinc-700 dark:bg-zinc-800 dark:focus-within:border-zinc-600 max-lg:w-full max-lg:py-2">
          <Search size={12} className="shrink-0 text-[#c2c2c2]" aria-hidden />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search habits in board..."
            aria-label="Search habits in board"
            className="w-full bg-transparent text-[12px] font-medium text-[#181818] outline-none placeholder:text-[#c2c2c2] dark:text-white max-lg:text-base"
          />
        </label>
      </div>

      {/* Action row */}
      <div className="mb-5 flex w-full items-center justify-between gap-3 max-lg:mb-4 max-lg:flex-col max-lg:items-stretch max-lg:gap-4">
        <button
          onClick={handleOpenModal}
          className="flex shrink-0 items-center gap-2 rounded-lg bg-[#8022fe] px-3 py-2 text-[12px] font-semibold leading-normal whitespace-nowrap text-white max-lg:w-full max-lg:justify-center max-lg:py-2.5 max-lg:text-base"
        >
          <Plus size={10} />
          New Goal
        </button>

        <div className="flex flex-wrap items-center justify-end gap-1 max-lg:w-full max-lg:flex-col max-lg:gap-2 lg:flex-1 lg:flex-nowrap 2xl:flex-none 2xl:gap-2.5">
          {FILTER_CONFIG.map(({ key, defaultLabel, options }) => (
            <FilterDropdown key={key} defaultLabel={defaultLabel} options={options} />
          ))}
        </div>
      </div>

      {/* Board panel + detail drawer */}
      <div className="relative w-full">
      <div
        className={`flex w-full flex-col gap-[10px] rounded-2xl border border-[#f2f2f2] bg-white p-3 dark:border-zinc-700 dark:bg-zinc-800 ${
          selectedGoal ? 'lg:pr-[600px]' : ''
        }`}
      >
        <div className="flex items-center gap-2">
          {showGhostCards ? (
            <>
              <Target size={13} className="shrink-0 text-[#c2c2c2]" />
              <span className="flex shrink-0 items-center gap-1 rounded-[6px] bg-[#f9f4ff] px-[6px] py-[2px] text-[12px] font-medium leading-[1.5] text-[#8022fe]">
                <Sparkles size={10} />
                {filteredGhostGoals.length} AI Suggestions
              </span>
            </>
          ) : (
            <>
              <Target size={13} className="shrink-0 text-[#5d5d5d] dark:text-gray-300" />
              <p className="text-[14px] font-medium leading-[1.5] text-[#5d5d5d] dark:text-gray-300">{activeCount} active</p>
              <span className="rounded-[6px] bg-[#f2f2f2] px-[6px] py-[2px] text-[12px] font-medium leading-[1.5] text-[#5d5d5d] dark:bg-zinc-700 dark:text-gray-300">
                {pausedCount} paused <span className="text-[#c2c2c2]">•</span> {completedThisMonth} completed this month
              </span>
            </>
          )}
        </div>

        {showGhostCards ? (
          filteredGhostGoals.length === 0 && isSearching ? (
            <p className="py-10 text-center text-sm font-medium text-[#c2c2c2] dark:text-gray-500">
              No matching goals.
            </p>
          ) : (
            <div className="scrollbar-hidden grid grid-cols-1 gap-[10px] overflow-y-auto sm:grid-cols-2 lg:grid-cols-3 lg:max-h-[610px]">
              {filteredGhostGoals.map((goal) => (
                <GhostGoalCard
                  key={goal.id}
                  goal={goal}
                  onDismiss={handleDismissGhost}
                  onRegenerate={handleRegenerateGhost}
                />
              ))}
            </div>
          )
        ) : filteredGoals.length === 0 ? (
          <p className="py-10 text-center text-sm font-medium text-[#c2c2c2] dark:text-gray-500">
            {isSearching ? 'No matching goals.' : 'No goals to show yet.'}
          </p>
        ) : (
          <div className="scrollbar-hidden grid grid-cols-1 gap-[10px] overflow-y-auto sm:grid-cols-2 lg:grid-cols-3 lg:max-h-[610px]">
            {filteredGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onSelect={handleSelectGoal}
                onEdit={handleEditGoal}
                onAddTask={handleAddTask}
                onAddHabit={handleAddHabit}
                onComplete={handleCompleteGoal}
                onPause={handlePauseGoal}
                onDelete={(g) => handleDeleteGoal(g.id)}
              />
            ))}
          </div>
        )}
      </div>

      {selectedGoal && (
        <GoalDetailPanel
          goal={selectedGoal}
          onClose={handleCloseGoalDetail}
          onOpenFullPage={handleOpenGoalPage}
          onEdit={handleEditGoal}
          onImprove={handleEditGoal}
          onPause={handlePauseGoal}
          onDelete={(g) => handleDeleteGoal(g.id)}
        />
      )}
      </div>

      <GoalProgressModal open={modalProgress} onClose={handleCloseModalProgress} onSave={handleSavePlan} />
      <NewGoalModal open={modal} onClose={handleCloseModal} onSave={handleSavePlan} />
    </div>
  );
}
