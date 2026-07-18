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

// Rule 7 — hardcoded typewriter phrases (Figma empty frame also shows a static subtitle;
// rotation uses the brief's suggested set).
const GOALS_SUBTITLE_PHRASES = [
  'Set goals, track progress, and stay accountable...',
  'Set your goals and let AI build the path...',
  'Track progress across tasks and habits...',
  'AI helps you stay on track every day...',
];

/** Goals Board icons — match Work boards (Tasks/Habits) existing sizes. */
const ICON = {
  search: 14,
  plus: 14,
  chevron: 14,
  target: 13,
  sparkles: 10,
  tasks: 12,
  habits: 12,
  flag: 12,
  more: 14,
  menu: 10,
};

const DEFAULT_FILTERS = {
  Status: 'All Statuses',
  Progress: 'Any',
  Priority: 'All Priorities',
  Category: 'All Categories',
  Source: 'All Sources',
  Date: 'All Dates',
};

const GHOST_REGENERATIONS = {
  'ghost-goal-1': {
    priority: 'HIGH',
    title: 'Strength Training',
    description: 'Follow a structured gym plan or join a strength class.',
    category: 'Fitness',
    tasks: 2,
    habits: 3,
    due: 'May 24, 2026',
  },
  'ghost-goal-2': {
    priority: 'MEDIUM',
    title: 'Daily Movement',
    description: 'Stay active with short walks or light mobility sessions.',
    category: 'Health',
    tasks: 3,
    habits: 2,
    due: 'In 4 days',
  },
  'ghost-goal-3': {
    priority: 'URGENT',
    title: 'Career Sprint',
    description: 'Ship one portfolio update and one skill practice block this week.',
    category: 'Career',
    tasks: 4,
    habits: 1,
    due: 'In 3 days',
  },
};

function resolveInitialGoals() {
  if (import.meta.env.DEV && new URLSearchParams(window.location.search).get('empty') === '1') {
    return [];
  }
  return INITIAL_GOALS;
}

function goalMatchesFilters(goal, filters) {
  if (filters.Status && filters.Status !== 'All Statuses') {
    const status = (goal.status || 'active').toLowerCase();
    if (filters.Status === 'Active' && status !== 'active') return false;
    if (filters.Status === 'Paused' && status !== 'paused') return false;
    if (filters.Status === 'Completed' && status !== 'completed') return false;
  }

  if (filters.Progress && filters.Progress !== 'Any') {
    const p = goal.progress ?? 0;
    if (filters.Progress === '0-25%' && !(p >= 0 && p <= 25)) return false;
    if (filters.Progress === '26-50%' && !(p >= 26 && p <= 50)) return false;
    if (filters.Progress === '51-75%' && !(p >= 51 && p <= 75)) return false;
    if (filters.Progress === '76-100%' && !(p >= 76 && p <= 100)) return false;
  }

  if (filters.Priority && filters.Priority !== 'All Priorities') {
    if (PRIORITY_LABELS[goal.priority] !== filters.Priority) return false;
  }

  if (filters.Category && filters.Category !== 'All Categories') {
    if (goal.category !== filters.Category) return false;
  }

  if (filters.Source && filters.Source !== 'All Sources') {
    const isAi = goal.source === 'ai';
    if (filters.Source === 'Created by AI' && !isAi) return false;
    if (filters.Source === 'Created manually' && isAi) return false;
  }

  // Date buckets need canonical dueAt from API — mock labels stay visible for Figma parity.
  return true;
}

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
    <div className="absolute top-full right-0 z-30 mt-1 flex w-max flex-col overflow-hidden rounded-lg border border-[#f2f2f2] bg-white shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)] dark:border-zinc-700 dark:bg-zinc-800">
      <button
        type="button"
        onClick={onRegenerate}
        className="flex items-center gap-1.5 border-b border-[#f2f2f2] px-[10px] py-1.5 text-left text-sm font-medium whitespace-nowrap text-[#8022fe] hover:bg-[#fcfcfc] dark:border-zinc-700 dark:hover:bg-zinc-700"
      >
        <Sparkles size={ICON.sparkles} className="size-2.5 shrink-0" />
        Regenerate suggestion
      </button>
      <button
        type="button"
        onClick={onDismiss}
        className="flex items-center gap-1.5 px-[10px] py-1.5 text-left text-sm font-medium whitespace-nowrap text-[#5d5d5d] hover:bg-[#fcfcfc] dark:text-gray-300 dark:hover:bg-zinc-700"
      >
        <X size={ICON.menu} className="size-2.5 shrink-0" />
        Dismiss
      </button>
    </div>
  );
}

function GhostGoalDashedBorder() {
  // Same mechanics as Task Board ghosts — SVG dash (not CSS border-dashed on rounded corners).
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      viewBox="0 0 379 186"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="0.5"
        y="0.5"
        width="378"
        height="185"
        rx="16"
        ry="16"
        fill="none"
        stroke="#e9e9e9"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
        strokeDasharray="5 5"
      />
    </svg>
  );
}

function GhostGoalDashedDivider() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute top-0 right-0 left-0 z-0 h-px w-full"
      viewBox="0 0 379 1"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="0"
        y1="0.5"
        x2="379"
        y2="0.5"
        stroke="#e9e9e9"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
        strokeDasharray="5 5"
      />
    </svg>
  );
}

function GhostGoalCard({ goal, onDismiss, onRegenerate, onAccept }) {
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
  // Rule 1 — content at ~50%; border stays full-opacity via SVG (not faded CSS dashes).
  const contentFade = isActive ? 'opacity-100' : 'opacity-50';

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative flex h-[186px] min-h-[186px] w-full flex-col justify-between overflow-hidden rounded-2xl transition-all ${
        menuOpen ? 'overflow-visible' : ''
      } ${
        isActive
          ? 'border border-solid border-[#e9e9e9] bg-[#fcfcfc] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)] dark:border-zinc-700 dark:bg-zinc-800'
          : 'border border-transparent bg-transparent'
      }`}
    >
      {!isActive && <GhostGoalDashedBorder />}

      <div className={`relative z-10 flex flex-col gap-[10px] p-3 ${contentFade}`}>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span
                className={`rounded-[6px] px-[6px] py-[2px] text-[12px] leading-[1.5] font-medium uppercase ${PRIORITY_STYLES[goal.priority]}`}
              >
                {PRIORITY_LABELS[goal.priority]}
              </span>
              <span className="flex items-center gap-1 rounded-[6px] bg-[#f9f4ff] px-[6px] py-[2px] text-[12px] leading-[1.5] font-medium text-[#8022fe]">
                <Sparkles size={ICON.sparkles} className="size-2.5 shrink-0" />
                AI
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-[16px] leading-[1.5] font-medium text-[#181818] dark:text-white">
              {goal.title}
            </p>
            <p className="overflow-hidden text-[12px] leading-[1.5] font-medium text-ellipsis whitespace-nowrap text-[#a3a3a3]">
              {goal.description}
            </p>
          </div>
        </div>

        <div className="flex h-[22px] min-w-0 shrink-0 items-center gap-1 overflow-hidden">
          <span className="shrink-0 whitespace-nowrap rounded-[6px] border border-[#f2f2f2] px-[6px] py-[2px] text-[12px] leading-[1.5] font-medium text-[#5d5d5d] dark:border-zinc-700 dark:text-gray-300">
            {goal.category}
          </span>
          <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[6px] border border-[#f2f2f2] px-[6px] py-[2px] text-[12px] leading-[1.5] font-medium text-[#5d5d5d] dark:border-zinc-700 dark:text-gray-300">
            <ListTodo size={ICON.tasks} className="size-3 shrink-0" />
            {goal.tasks} Tasks
          </span>
          <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[6px] border border-[#f2f2f2] px-[6px] py-[2px] text-[12px] leading-[1.5] font-medium text-[#5d5d5d] dark:border-zinc-700 dark:text-gray-300">
            <Repeat size={ICON.habits} className="h-3 w-[13px] shrink-0" />
            {goal.habits} Habits
          </span>
          <span className="flex min-w-0 shrink items-center gap-1.5 overflow-hidden whitespace-nowrap rounded-[6px] border border-[#f2f2f2] px-[6px] py-[2px] text-[12px] leading-[1.5] font-medium text-[#5d5d5d] dark:border-zinc-700 dark:text-gray-300">
            <Flag size={ICON.flag} className="h-3 w-2 shrink-0" />
            <span className="truncate">{goal.due}</span>
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
          className={`animate-fade-in absolute top-3 right-3 z-20 shrink-0 rounded-[6px] p-1 text-[#5d5d5d] ${
            menuOpen ? 'bg-[#f2f2f2]' : 'hover:bg-[#f2f2f2]'
          }`}
        >
          <MoreHorizontal size={ICON.more} className="size-3.5" />
        </button>
      )}

      {menuOpen && (
        <div className="absolute top-9 right-3 z-50">
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
        className={`relative z-10 box-border flex h-[54px] w-full shrink-0 flex-col px-3 pt-[10px] pb-3 ${
          isActive ? 'border-t border-solid border-[#e9e9e9] dark:border-zinc-700' : ''
        }`}
      >
        {!isActive && <GhostGoalDashedDivider />}
        <div
          className={`flex w-full flex-col gap-1.5 transition-opacity duration-200 ${
            isActive ? 'pointer-events-none opacity-0' : contentFade
          }`}
        >
          <div className="flex h-[18px] w-full items-center justify-between text-[12px] leading-[1.5] font-medium">
            <p className="text-[#c2c2c2]">Progress</p>
            <p className="text-[#5d5d5d] dark:text-gray-300">0%</p>
          </div>
          <div className="h-2 w-full shrink-0 rounded-[40px] bg-[#e9e9e9] dark:bg-zinc-600" />
        </div>
        <div
          className={`absolute inset-0 flex items-center justify-between gap-2 px-3 pt-[10px] pb-3 transition-opacity duration-200 ${
            isActive ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          <p className="min-w-0 truncate text-[12px] leading-[1.5] font-medium text-[#c2c2c2]">
            AI suggested based on your profile
          </p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAccept?.(goal);
            }}
            className="flex shrink-0 items-center gap-1.5 rounded-[6px] bg-[#f9f4ff] px-2 py-0.5 text-[12px] leading-[1.5] font-medium text-[#8022fe]"
          >
            Accept Goal
            <Check size={10} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}

// Figma Goals Board (1440) - 1.1 - hover (1250:10104)
// Menu: Edit | ✦ Add Task, ✦ Add Habit | Complete, Pause, Delete
function GoalCardMenu({ onEdit, onAddTask, onAddHabit, onComplete, onPause, onDelete }) {
  const itemBase =
    'flex w-full items-center gap-1.5 px-[10px] py-1.5 text-left text-[12px] font-medium leading-[1.5] whitespace-nowrap hover:bg-[#fcfcfc] dark:hover:bg-zinc-700';
  return (
    <div
      className="flex w-max flex-col overflow-hidden rounded-lg border border-[#f2f2f2] bg-white shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)] dark:border-zinc-700 dark:bg-zinc-800"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={onEdit}
        className={`${itemBase} border-b border-[#f2f2f2] text-[#5d5d5d] dark:border-zinc-700 dark:text-gray-300`}
      >
        <Pencil size={ICON.menu} className="size-2.5 shrink-0" />
        Edit
      </button>
      <button type="button" onClick={onAddTask} className={`${itemBase} text-[#8022fe]`}>
        <Sparkles size={ICON.sparkles} className="size-2.5 shrink-0" />
        Add Task
      </button>
      <button type="button" onClick={onAddHabit} className={`${itemBase} text-[#8022fe]`}>
        <Sparkles size={ICON.sparkles} className="size-2.5 shrink-0" />
        Add Habit
      </button>
      <button
        type="button"
        onClick={onComplete}
        className={`${itemBase} text-[#5d5d5d] dark:text-gray-300`}
      >
        <Check size={ICON.menu} className="size-2.5 shrink-0" />
        Complete
      </button>
      <button
        type="button"
        onClick={onPause}
        className={`${itemBase} text-[#5d5d5d] dark:text-gray-300`}
      >
        <Pause size={ICON.menu} className="size-2.5 shrink-0" />
        Pause
      </button>
      <button
        type="button"
        onClick={onDelete}
        className={`${itemBase} text-[#5d5d5d] dark:text-gray-300`}
      >
        <Trash2 size={ICON.menu} className="size-2.5 shrink-0" />
        Delete
      </button>
    </div>
  );
}

function GoalCard({
  goal,
  onSelect,
  onEdit,
  onAddTask,
  onAddHabit,
  onComplete,
  onPause,
  onDelete,
}) {
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
      className={`relative box-border flex h-full min-h-[186px] w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-[#f2f2f2] bg-[#fcfcfc] dark:border-zinc-700 dark:bg-zinc-800 ${
        menuOpen || isHovered ? 'z-10 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)]' : ''
      } ${menuOpen ? 'overflow-visible' : ''}`}
    >
      {/* Figma 1250:8542 — body 132px (p-12 + gap-10) + footer 54px (pt-10 pb-12) */}
      <div className="box-border flex h-[132px] w-full shrink-0 flex-col gap-[10px] p-3">
        <div className={`flex min-h-0 flex-1 flex-col gap-2 overflow-hidden ${faded}`}>
          <div className="flex min-h-[22px] shrink-0 items-center gap-1 overflow-hidden">
            {!isCompleted && (
              <span
                className={`shrink-0 rounded-[6px] px-[6px] py-[2px] text-[12px] leading-[1.5] font-medium uppercase ${PRIORITY_STYLES[goal.priority]}`}
              >
                {PRIORITY_LABELS[goal.priority]}
              </span>
            )}
            {isPaused && (
              <span
                className={`shrink-0 rounded-[6px] px-[6px] py-[2px] text-[12px] leading-[1.5] font-medium ${STATUS_STYLES.paused}`}
              >
                Paused
              </span>
            )}
            {isCompleted && (
              <span
                className={`shrink-0 rounded-[6px] px-[6px] py-[2px] text-[12px] leading-[1.5] font-medium ${STATUS_STYLES.completed}`}
              >
                Completed
              </span>
            )}
            {goal.source === 'ai' && (
              <span className="flex shrink-0 items-center gap-1 rounded-[6px] bg-[#f9f4ff] px-[6px] py-[2px] text-[12px] leading-[1.5] font-medium text-[#8022fe]">
                <Sparkles size={ICON.sparkles} className="size-2.5 shrink-0" />
                AI
              </span>
            )}
          </div>
          <div className="flex min-h-0 flex-col gap-1 overflow-hidden">
            <p
              className={`truncate text-[16px] leading-[1.5] font-medium ${isPaused ? 'text-[#5d5d5d] dark:text-gray-400' : 'text-[#181818] dark:text-white'}`}
            >
              {goal.title}
            </p>
            <p
              className={`truncate text-[12px] leading-[1.5] font-medium ${isPaused ? 'text-[#c2c2c2]' : 'text-[#a3a3a3]'}`}
            >
              {goal.description}
            </p>
          </div>
        </div>

        <div className={`flex h-[22px] min-w-0 shrink-0 items-center gap-1 overflow-hidden ${faded}`}>
          <span className="shrink-0 whitespace-nowrap rounded-[6px] border border-[#f2f2f2] px-[6px] py-[2px] text-[12px] leading-[1.5] font-medium text-[#5d5d5d] dark:border-zinc-700 dark:text-gray-300">
            {goal.category}
          </span>
          {goal.tasks > 0 && (
            <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[6px] border border-[#f2f2f2] px-[6px] py-[2px] text-[12px] leading-[1.5] font-medium text-[#5d5d5d] dark:border-zinc-700 dark:text-gray-300">
              <ListTodo size={ICON.tasks} className="size-3 shrink-0" />
              {goal.tasks} Tasks
            </span>
          )}
          {goal.habits > 0 && (
            <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[6px] border border-[#f2f2f2] px-[6px] py-[2px] text-[12px] leading-[1.5] font-medium text-[#5d5d5d] dark:border-zinc-700 dark:text-gray-300">
              <Repeat size={ICON.habits} className="h-3 w-[13px] shrink-0" />
              {goal.habits} Habits
            </span>
          )}
          {goal.due && (
            <span className="flex min-w-0 shrink items-center gap-1.5 overflow-hidden whitespace-nowrap rounded-[6px] border border-[#f2f2f2] px-[6px] py-[2px] text-[12px] leading-[1.5] font-medium text-[#5d5d5d] dark:border-zinc-700 dark:text-gray-300">
              <Flag size={ICON.flag} className="h-3 w-2 shrink-0" />
              <span className="truncate">{goal.due}</span>
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
          className={`animate-fade-in absolute top-3 right-3 z-20 shrink-0 rounded-[6px] p-1 text-[#5d5d5d] ${
            menuOpen ? 'bg-[#f2f2f2] dark:bg-zinc-600' : 'hover:bg-[#f2f2f2] dark:hover:bg-zinc-600'
          }`}
        >
          <MoreHorizontal size={ICON.more} className="size-3.5" />
        </button>
      )}

      {menuOpen && (
        <div className="absolute top-9 right-3 z-50">
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
        <div className="box-border flex h-[54px] w-full shrink-0 flex-col border-t border-[#f2f2f2] px-3 pt-[10px] pb-3 dark:border-zinc-700">
          <div className="flex h-8 w-full items-center justify-center gap-2 rounded-lg bg-[rgba(42,157,0,0.05)]">
            <p className="text-[12px] leading-[1.5] font-medium text-[#2a9d00]">
              Completed {goal.completedDate}
            </p>
            <Check size={11} className="h-2 w-[11px] shrink-0 text-[#2a9d00]" strokeWidth={2.5} />
          </div>
        </div>
      ) : (
        <div className="box-border flex h-[54px] w-full shrink-0 flex-col border-t border-[#f2f2f2] px-3 pt-[10px] pb-3 dark:border-zinc-700">
          <div className={`flex w-full min-w-0 flex-col gap-1.5 ${faded}`}>
            <div className="flex h-[18px] w-full items-center justify-between text-[12px] leading-[1.5] font-medium">
              <p className="text-[#c2c2c2]">Progress</p>
              <p className="text-[#5d5d5d] dark:text-gray-300">{goal.progress}%</p>
            </div>
            <div className="h-2 w-full shrink-0 overflow-hidden rounded-[40px] bg-[#e9e9e9] dark:bg-zinc-600">
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

function FilterDropdown({ filterKey, defaultLabel, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const ref = useRef(null);
  const selected = value ?? options[0];

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
        className="flex w-full items-center justify-between rounded-lg border border-[#f2f2f2] bg-white px-3 py-[7px] text-[12px] leading-[1.5] font-medium text-[#181818] max-lg:gap-2 max-lg:py-2.5 max-lg:text-base 2xl:w-30 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
      >
        <span className="truncate max-lg:min-w-0 max-lg:flex-1 max-lg:text-center">
          {displayLabel}
        </span>
        <ChevronDown
          size={ICON.chevron}
          className={`size-3.5 shrink-0 text-[#a3a3a3] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="scrollbar-white absolute top-full right-0 left-0 z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-[#f2f2f2] bg-white shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)] lg:top-8 lg:right-auto lg:mt-0 lg:w-25 2xl:w-30 dark:border-zinc-700 dark:bg-zinc-800">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onMouseEnter={() => setHovered(opt)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => {
                onChange?.(filterKey, opt);
                setOpen(false);
              }}
              className={`flex w-full items-center px-2 py-1.5 text-left text-[12px] font-medium text-[#181818] max-lg:px-3 max-lg:py-2.5 max-lg:text-sm dark:text-white ${
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
  const [goals, setGoals] = useState(resolveInitialGoals);
  const [modal, setModal] = useState(false);
  const [modalProgress, setModalProgress] = useState(false);
  const [ghostGoals, setGhostGoals] = useState(GHOST_GOALS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState(DEFAULT_FILTERS);
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
    const linkedTaskCount = Array.isArray(data.linkedTasks) ? data.linkedTasks.length : data.tasks ?? 0;
    const linkedHabitCount = Array.isArray(data.linkedHabits)
      ? data.linkedHabits.length
      : data.habits ?? 0;
    setGoals((prev) => [
      {
        id: `goal-${Date.now()}`,
        priority: data.priority || 'MEDIUM',
        title: data.title,
        description: data.description || '',
        category: data.category || 'Career',
        // Rule 3 — AI create starts with 0 links; Manual may count selected IDs (Rule 4).
        tasks: linkedTaskCount,
        habits: linkedHabitCount,
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

  const handleRegenerateGhost = (id) => {
    const alternate = GHOST_REGENERATIONS[id];
    if (!alternate) return;
    setGhostGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...alternate } : g)));
  };

  const handleAcceptGhost = (ghost) => {
    setGoals((prev) => [
      {
        id: `goal-${Date.now()}`,
        priority: ghost.priority,
        title: ghost.title,
        description: ghost.description,
        category: ghost.category,
        tasks: ghost.tasks ?? 0,
        habits: ghost.habits ?? 0,
        due: ghost.due,
        progress: 0,
        status: 'active',
        source: 'ai',
      },
      ...prev,
    ]);
    setGhostGoals((prev) => prev.filter((g) => g.id !== ghost.id));
  };

  const handleEditGoal = () => {
    setModal(true);
  };

  const handleAddTask = () => {
    // Opens detail linking flow in a later step — control stays for Figma 1.1 parity.
  };

  const handleAddHabit = () => {
    // Opens detail linking flow in a later step — control stays for Figma 1.1 parity.
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
        g.id === goal.id ? { ...g, status: g.status === 'paused' ? 'active' : 'paused' } : g
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

  const handleFilterChange = (key, value) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredGoals = useMemo(
    () =>
      goals.filter(
        (g) => goalMatchesSearch(g, searchQuery) && goalMatchesFilters(g, activeFilters)
      ),
    [goals, searchQuery, activeFilters]
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
    <div className="relative flex min-h-full flex-col py-7.5 max-lg:min-h-0 max-lg:py-4 max-lg:sm:py-6">
      {/* Header */}
      <div className="mb-5 flex w-full items-start justify-between max-lg:mb-4 max-lg:flex-col max-lg:gap-4">
        <div className="flex flex-col items-start gap-2">
          <p className="text-[20px] font-medium text-[#181818] dark:text-white">Goals Board</p>
          <TypewriterText
            phrases={GOALS_SUBTITLE_PHRASES}
            className="text-[12px] font-medium text-[#c2c2c2] max-lg:text-sm dark:text-gray-400"
          />
        </div>
        <label className="flex w-62.5 items-center gap-2 rounded-lg border border-[#f2f2f2] bg-white px-3 py-1.75 focus-within:border-[#e9e9e9] max-lg:w-full max-lg:py-2 dark:border-zinc-700 dark:bg-zinc-800 dark:focus-within:border-zinc-600">
          <Search size={ICON.search} className="size-3.5 shrink-0 text-[#c2c2c2]" aria-hidden />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search goals in board..."
            aria-label="Search goals in board"
            className="w-full bg-transparent text-[12px] font-medium text-[#181818] outline-none placeholder:text-[#c2c2c2] max-lg:text-base dark:text-white"
          />
        </label>
      </div>

      {/* Action row */}
      <div className="mb-5 flex w-full items-center justify-between gap-3 max-lg:mb-4 max-lg:flex-col max-lg:items-stretch max-lg:gap-4">
        <button
          onClick={handleOpenModal}
          className="flex shrink-0 items-center gap-2 rounded-lg bg-[#8022fe] px-3 py-2 text-[12px] leading-normal font-semibold whitespace-nowrap text-white max-lg:w-full max-lg:justify-center max-lg:py-2.5 max-lg:text-base"
        >
          <Plus size={ICON.plus} strokeWidth={2.5} className="size-3.5 shrink-0 text-white" />
          New Goal
        </button>

        <div className="flex flex-wrap items-center justify-end gap-1 max-lg:w-full max-lg:flex-col max-lg:gap-2 lg:flex-1 lg:flex-nowrap 2xl:flex-none 2xl:gap-2.5">
          {FILTER_CONFIG.map(({ key, defaultLabel, options }) => (
            <FilterDropdown
              key={key}
              filterKey={key}
              defaultLabel={defaultLabel}
              options={options}
              value={activeFilters[key]}
              onChange={handleFilterChange}
            />
          ))}
        </div>
      </div>

      {/* Board panel — Figma 1250:8534: stats bar + scrollable card grid */}
      <div className="relative flex min-h-0 w-full flex-1 flex-col gap-[10px] overflow-hidden rounded-2xl border border-[#f2f2f2] bg-white p-3 max-lg:h-auto max-lg:flex-none dark:border-zinc-700 dark:bg-zinc-800">
        <div className="flex shrink-0 items-center gap-2">
          {showGhostCards ? (
            <>
              <Target size={ICON.target} className="size-[13px] shrink-0 text-[#c2c2c2]" />
              <span className="flex shrink-0 items-center gap-1 rounded-[6px] bg-[#f9f4ff] px-[6px] py-[2px] text-[12px] leading-[1.5] font-medium text-[#8022fe]">
                <Sparkles size={ICON.sparkles} className="size-2.5 shrink-0" />
                {filteredGhostGoals.length} AI Suggestions
              </span>
            </>
          ) : (
            <>
              <Target size={ICON.target} className="size-[13px] shrink-0 text-[#5d5d5d] dark:text-gray-300" />
              <p className="text-[14px] leading-[1.5] font-medium text-[#5d5d5d] dark:text-gray-300">
                {activeCount} active
              </p>
              <span className="rounded-[6px] bg-[#f2f2f2] px-[6px] py-[2px] text-[12px] leading-[1.5] font-medium text-[#5d5d5d] dark:bg-zinc-700 dark:text-gray-300">
                {pausedCount} paused <span className="text-[#c2c2c2]">•</span> {completedThisMonth}{' '}
                completed this month
              </span>
            </>
          )}
        </div>

        <div className="scrollbar-hidden -mx-3 flex flex-1 flex-col gap-[10px] overflow-y-auto px-3 lg:min-h-0 max-lg:max-h-[min(70vh,560px)]">
          {showGhostCards ? (
            filteredGhostGoals.length === 0 && isSearching ? (
              <p className="py-10 text-center text-sm font-medium text-[#c2c2c2] dark:text-gray-500">
                No matching goals.
              </p>
            ) : (
              <div className="grid auto-rows-[186px] grid-cols-1 gap-[10px] sm:grid-cols-2 xl:grid-cols-3">
                  {filteredGhostGoals.map((goal) => (
                    <div key={goal.id} className="h-[186px] min-h-[186px]">
                      <GhostGoalCard
                      goal={goal}
                      onDismiss={handleDismissGhost}
                      onRegenerate={handleRegenerateGhost}
                      onAccept={handleAcceptGhost}
                    />
                    </div>
                  ))}
                </div>
            )
          ) : filteredGoals.length === 0 ? (
            <p className="py-10 text-center text-sm font-medium text-[#c2c2c2] dark:text-gray-500">
              {isSearching ? 'No matching goals.' : 'No goals to show yet.'}
            </p>
          ) : (
            <div className="grid auto-rows-[186px] grid-cols-1 gap-[10px] sm:grid-cols-2 xl:grid-cols-3">
                {filteredGoals.map((goal) => (
                  <div key={goal.id} className="h-[186px] min-h-[186px]">
                    <GoalCard
                    goal={goal}
                    onSelect={handleSelectGoal}
                    onEdit={handleEditGoal}
                    onAddTask={handleAddTask}
                    onAddHabit={handleAddHabit}
                    onComplete={handleCompleteGoal}
                    onPause={handlePauseGoal}
                    onDelete={(g) => handleDeleteGoal(g.id)}
                  />
                  </div>
                ))}
              </div>
          )}
        </div>
      </div>

      {/* Detail drawer — sibling of header/action-row/board panel for full-height peek */}
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

      <GoalProgressModal
        open={modalProgress}
        onClose={handleCloseModalProgress}
        onSave={handleSavePlan}
      />
      <NewGoalModal open={modal} onClose={handleCloseModal} onSave={handleSavePlan} />
    </div>
  );
}
