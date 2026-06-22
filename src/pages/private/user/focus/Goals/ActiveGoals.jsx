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
} from 'lucide-react';
import { useState, useRef, useEffect, useMemo } from 'react';
import NewGoalModal from './components/NewGoalModal';
import GoalProgressModal from './components/GoalProgressModal';
import TypewriterText from '../../../../../components/ui/TypewriterText';

// First phrase matches the Figma frame's static subtitle text exactly; the rest are the
// user's explicitly suggested rotation phrases.
const GOALS_SUBTITLE_PHRASES = [
  'Set goals, track progress, and stay accountable...',
  'Set your goals and let AI build the path...',
  'Track progress across tasks and habits...',
  'AI helps you stay on track every day...',
];

// AI-suggested ghost goals — shown only when the board has no real goals yet.
// Sample content from the Figma "Empty States" frame (illustrative, not fixed copy).
const GHOST_GOALS = [
  {
    id: 'ghost-goal-1',
    priority: 'URGENT',
    title: 'Fitness Regimen',
    description: 'Adhere to your workout schedule or participate in a fitness class.',
    category: 'Fitness',
    tasks: 1,
    habits: 6,
    due: 'May 21, 2026',
  },
  {
    id: 'ghost-goal-2',
    priority: 'HIGH',
    title: 'Physical Activity',
    description: 'Commit to your fitness routine or join a workout session.',
    category: 'Health',
    tasks: 4,
    habits: 2,
    due: 'In 2 days',
  },
  {
    id: 'ghost-goal-3',
    priority: 'MEDIUM',
    title: 'Improve Rate',
    description: 'Stick to your professional growth plan or engage in a skill-building session.',
    category: 'Career',
    tasks: 6,
    habits: 2,
    due: 'In 6 days',
  },
];

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
  const faded = isActive ? 'opacity-100' : 'opacity-50';

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative flex w-full flex-col justify-between overflow-hidden rounded-2xl border transition-all ${
        menuOpen ? 'overflow-visible' : ''
      } ${
        isActive
          ? 'h-auto border-solid border-[#e9e9e9] bg-[#fcfcfc] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)] dark:border-zinc-700 dark:bg-zinc-800'
          : 'h-[186px] border-dashed border-[#e9e9e9] dark:border-zinc-700'
      }`}
    >
      <div className="flex flex-col gap-2.5 p-3">
        <div className={`flex flex-col gap-2 transition-opacity duration-200 ${faded}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span
                className={`rounded-[6px] px-[6px] py-[2px] text-xs font-medium uppercase ${PRIORITY_STYLES[goal.priority]}`}
              >
                {PRIORITY_LABELS[goal.priority]}
              </span>
              <span className="flex items-center gap-1 rounded-[6px] bg-[#f9f4ff] px-[6px] py-[2px] text-xs font-medium text-[#8022fe]">
                <Sparkles size={10} />
                AI
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-base font-medium text-[#181818] dark:text-white">{goal.title}</p>
            <p className="overflow-hidden text-ellipsis whitespace-nowrap text-xs leading-normal text-[#a3a3a3]">
              {goal.description}
            </p>
          </div>
        </div>

        <div className={`flex flex-wrap items-center gap-1 transition-opacity duration-200 ${faded}`}>
          <span className="rounded-[6px] border border-[#f2f2f2] px-[6px] py-[2px] text-xs font-medium text-[#5d5d5d] dark:border-zinc-700 dark:text-gray-300">
            {goal.category}
          </span>
          <span className="flex items-center gap-1.5 rounded-[6px] border border-[#f2f2f2] px-[6px] py-[2px] text-xs font-medium text-[#5d5d5d] dark:border-zinc-700 dark:text-gray-300">
            <ListTodo size={12} className="shrink-0" />
            {goal.tasks} Tasks
          </span>
          <span className="flex items-center gap-1.5 rounded-[6px] border border-[#f2f2f2] px-[6px] py-[2px] text-xs font-medium text-[#5d5d5d] dark:border-zinc-700 dark:text-gray-300">
            <Repeat size={12} className="shrink-0" />
            {goal.habits} Habits
          </span>
          <span className="flex items-center gap-1.5 rounded-[6px] border border-[#f2f2f2] px-[6px] py-[2px] text-xs font-medium text-[#5d5d5d] dark:border-zinc-700 dark:text-gray-300">
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
        className={`relative flex h-[54px] w-full shrink-0 items-center px-3 py-2.5 ${
          isActive ? 'border-t border-solid border-[#e9e9e9] dark:border-zinc-700' : 'border-t border-dashed border-[#e9e9e9] dark:border-zinc-700'
        }`}
      >
        <div
          className={`absolute inset-0 flex w-full flex-col gap-1.5 px-3 py-2.5 transition-opacity duration-200 ${
            isActive ? 'pointer-events-none opacity-0' : faded
          }`}
        >
          <div className="flex w-full items-center justify-between text-xs font-medium">
            <p className="text-[#c2c2c2]">Progress</p>
            <p className="text-[#5d5d5d] dark:text-gray-300">0%</p>
          </div>
          <div className="h-2 w-full rounded-full bg-[#e9e9e9] dark:bg-zinc-600" />
        </div>
        <div
          className={`absolute inset-0 flex w-full items-center justify-between gap-2 px-3 py-2.5 transition-opacity duration-200 ${
            isActive ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          <p className="min-w-0 truncate text-xs font-medium text-[#c2c2c2]">AI suggested based on your profile</p>
          <button
            type="button"
            className="flex shrink-0 items-center gap-1.5 rounded-[6px] bg-[#f9f4ff] px-[8px] py-[2px] text-xs font-medium text-[#8022fe]"
          >
            Accept Goal
            <Check size={10} strokeWidth={2.5} />
          </button>
        </div>
      </div>
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
    <div ref={ref} className="relative max-lg:w-full">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-30 items-center justify-between rounded-lg border border-[#f2f2f2] bg-white px-3 py-1.75 text-[12px] font-medium text-[#181818] dark:border-zinc-700 dark:bg-zinc-800 dark:text-white max-lg:w-full max-lg:gap-2 max-lg:py-2.5 max-lg:text-base"
      >
        <span className="truncate max-lg:min-w-0 max-lg:flex-1 max-lg:text-center">{displayLabel}</span>
        <ChevronDown size={10} className="shrink-0 text-[#a3a3a3]" />
      </button>

      {open && (
        <div className="absolute right-0 top-8 z-50 max-h-60 w-30 overflow-y-auto rounded-lg border border-[#f2f2f2] bg-white shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)] dark:border-zinc-700 dark:bg-zinc-800 max-lg:top-full max-lg:mt-1 max-lg:w-auto lg:left-0 lg:right-auto">
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
  const [goals] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalProgress, setModalProgress] = useState(false);
  const [ghostGoals, setGhostGoals] = useState(GHOST_GOALS);
  const [searchQuery, setSearchQuery] = useState('');

  const handleOpenModal = () => setModal(true);
  const handleCloseModal = () => setModal(false);
  const handleCloseModalProgress = () => setModalProgress(false);
  const handleSavePlan = (data) => {
    console.log('Saved plan:', data);
  };

  const handleDismissGhost = (id) => {
    setGhostGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const handleRegenerateGhost = () => {
    // Visual-only for Step 1 — AI regeneration wired in a later step.
  };

  const filteredGhostGoals = useMemo(
    () => ghostGoals.filter((g) => goalMatchesSearch(g, searchQuery)),
    [ghostGoals, searchQuery]
  );

  const boardIsEmpty = goals.length === 0;
  const isSearching = searchQuery.trim().length > 0;
  const showGhostCards = boardIsEmpty && filteredGhostGoals.length > 0;

  const activeCount = goals.filter((g) => g.status === 'active').length;
  const pausedCount = goals.filter((g) => g.status === 'paused').length;
  const completedThisMonth = goals.filter((g) => g.status === 'completed').length;

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
            placeholder="Search goals in board..."
            aria-label="Search goals in board"
            className="w-full bg-transparent text-[12px] font-medium text-[#181818] outline-none placeholder:text-[#c2c2c2] dark:text-white max-lg:text-base"
          />
        </label>
      </div>

      {/* Action row */}
      <div className="mb-5 flex w-full items-center justify-between max-lg:mb-4 max-lg:flex-col max-lg:items-stretch max-lg:gap-4">
        <button
          onClick={handleOpenModal}
          className="flex items-center gap-2 rounded-lg bg-[#8022fe] px-3 py-2 text-[12px] font-semibold text-white max-lg:w-full max-lg:justify-center max-lg:py-2.5 max-lg:text-base"
        >
          <Plus size={10} />
          New Goal
        </button>

        <div className="flex flex-wrap items-center justify-end gap-2.5 max-lg:w-full max-lg:flex-col max-lg:gap-2">
          {FILTER_CONFIG.map(({ key, defaultLabel, options }) => (
            <FilterDropdown key={key} defaultLabel={defaultLabel} options={options} />
          ))}
        </div>
      </div>

      {/* Board panel */}
      <div className="relative flex w-full flex-col gap-2.5 rounded-2xl border border-[#f2f2f2] bg-white p-3 dark:border-zinc-700 dark:bg-zinc-800">
        <div className="flex items-center gap-2">
          {showGhostCards ? (
            <>
              <Target size={13} className="shrink-0 text-[#c2c2c2]" />
              <span className="flex shrink-0 items-center gap-1 rounded-[6px] bg-[#f9f4ff] px-[6px] py-[2px] text-xs font-medium text-[#8022fe]">
                <Sparkles size={10} />
                {filteredGhostGoals.length} AI Suggestions
              </span>
            </>
          ) : (
            <>
              <Target size={13} className="shrink-0 text-[#c2c2c2]" />
              <p className="text-sm font-medium text-[#5d5d5d] dark:text-gray-300">{activeCount} active</p>
              <span className="rounded-[6px] bg-[#f2f2f2] px-[6px] py-[2px] text-xs font-medium text-[#5d5d5d] dark:bg-zinc-700 dark:text-gray-300">
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
            <div className="scrollbar-hidden grid grid-cols-1 gap-2.5 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3 lg:max-h-[610px]">
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
        ) : (
          <p className="py-10 text-center text-sm font-medium text-[#c2c2c2] dark:text-gray-500">
            {isSearching ? 'No matching goals.' : 'No goals to show yet.'}
          </p>
        )}
      </div>

      <GoalProgressModal open={modalProgress} onClose={handleCloseModalProgress} onSave={handleSavePlan} />
      <NewGoalModal open={modal} onClose={handleCloseModal} onSave={handleSavePlan} />
    </div>
  );
}
