import {
  Plus,
  Search,
  Sparkles,
  MoreHorizontal,
  ChevronDown,
  Flame,
  Clock,
  Hourglass,
  Check,
  X,
} from 'lucide-react';
import { useState, useRef, useEffect, useMemo } from 'react';
import NewHabitsModal from './components/NewHabitsModal';
import TypewriterText from '../../../../../components/ui/TypewriterText';

const HABITS_SUBTITLE_PHRASES = [
  'Build daily habits and keep your streaks alive...',
  'Let AI suggest habits based on your goals...',
  'Stay consistent, one check-in at a time...',
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TODAY_INDEX = (new Date().getDay() + 6) % 7; // Mon=0 ... Sun=6

// AI-suggested ghost habits — shown only when the board has no real habits yet.
const GHOST_HABITS = [
  {
    id: 'ghost-habit-1',
    title: 'Drink Water',
    description: 'Stay hydrated throughout the day',
    tags: [{ label: 'Health' }, { label: '7:00 AM', icon: Clock }],
  },
  {
    id: 'ghost-habit-2',
    title: 'Take Breaks',
    description: 'Step away from your screen regularly',
    tags: [{ label: 'Productivity' }, { label: '6:30 PM', icon: Clock }],
  },
  {
    id: 'ghost-habit-3',
    title: 'Meditate',
    description: 'Practice mindfulness for mental clarity',
    tags: [{ label: 'Wellness' }, { label: '12 days left', icon: Hourglass }],
  },
];

const FILTER_CONFIG = [
  {
    key: 'Category',
    defaultLabel: 'All Category',
    options: [
      'All Category',
      'Career',
      'Health',
      'Finance',
      'Fitness',
      'Wellness',
      'Productivity',
      'Personal',
      'Education',
    ],
  },
  {
    key: 'Schedule',
    defaultLabel: 'All Schedule',
    options: ['All Schedule', 'Daily', 'Weekly', 'Monthly', 'Custom'],
  },
  {
    key: 'Days Left',
    defaultLabel: 'All Days Left',
    options: ['All Days Left', '1-7 days', '8-30 days', '30+ days'],
  },
];

function GhostHabitMenu({ onRegenerate, onDismiss }) {
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

function GhostHabitRow({ habit, onDismiss, onRegenerate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const rowRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (rowRef.current && !rowRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = menuOpen || isHovered;

  return (
    <div
      ref={rowRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative flex w-full shrink-0 items-start gap-4 rounded-2xl border p-3 transition-all max-lg:flex-col max-lg:gap-3 ${
        isActive
          ? 'border-solid border-[#f2f2f2] bg-[#fcfcfc] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)] dark:border-zinc-700 dark:bg-zinc-800'
          : 'border-dashed border-[#e9e9e9] dark:border-zinc-700'
      }`}
    >
      <div className={`flex w-97 shrink-0 flex-col gap-2.5 transition-opacity duration-200 max-lg:w-full ${isActive ? 'opacity-100' : 'opacity-40'}`}>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <p className="text-base font-medium text-[#181818] dark:text-white">{habit.title}</p>
            <span className="flex items-center gap-1 rounded-[6px] bg-[#f9f4ff] px-[6px] py-[2px] text-xs font-medium text-[#8022fe]">
              <Sparkles size={10} />
              AI
            </span>
          </div>
          <p className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-[#a3a3a3]">
            {habit.description}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1">
          {habit.tags.map((tag) => (
            <span
              key={tag.label}
              className="flex items-center gap-1.5 rounded-[6px] border border-[#f2f2f2] px-[6px] py-[2px] text-xs font-medium text-[#5d5d5d] dark:border-zinc-700 dark:text-gray-300"
            >
              {tag.icon && <tag.icon size={11} className="shrink-0" />}
              {tag.label}
            </span>
          ))}
        </div>
        {isActive && (
          <button
            type="button"
            className="flex w-max items-center gap-1.5 rounded-[6px] bg-[#f9f4ff] px-[8px] py-[2px] text-sm font-medium text-[#8022fe]"
          >
            Accept Habit
            <Check size={10} strokeWidth={2.5} />
          </button>
        )}
      </div>

      <p className={`w-30 shrink-0 text-sm font-medium text-[#181818] transition-opacity duration-200 dark:text-white max-lg:w-auto ${isActive ? 'opacity-100' : 'opacity-40'}`}>
        0 days
      </p>

      <div className={`flex flex-1 items-center justify-between gap-2 transition-opacity duration-200 max-lg:w-full max-lg:flex-wrap ${isActive ? 'opacity-100' : 'opacity-40'}`}>
        {DAYS.map((day) => (
          <div
            key={day}
            className="size-10 shrink-0 rounded-[10px] border border-[#e9e9e9] bg-white dark:border-zinc-600 dark:bg-zinc-700 max-lg:size-9"
          />
        ))}
      </div>

      {isActive && (
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Ghost habit menu"
          aria-expanded={menuOpen}
          className={`animate-fade-in absolute right-3 top-3 z-20 shrink-0 rounded-[6px] p-1 text-[#a3a3a3] ${
            menuOpen ? 'bg-[#f2f2f2]' : 'hover:bg-[#f2f2f2]'
          }`}
        >
          <MoreHorizontal size={14} />
        </button>
      )}

      {menuOpen && (
        <div className="absolute right-3 top-9 z-50">
          <GhostHabitMenu
            onRegenerate={() => {
              setMenuOpen(false);
              onRegenerate(habit.id);
            }}
            onDismiss={() => {
              setMenuOpen(false);
              onDismiss(habit.id);
            }}
          />
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
        <div className="absolute left-0 top-8 z-50 max-h-60 w-30 overflow-y-auto rounded-lg border border-[#f2f2f2] bg-white shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)] dark:border-zinc-700 dark:bg-zinc-800 max-lg:right-0 max-lg:top-full max-lg:mt-1 max-lg:w-auto">
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

function habitMatchesSearch(habit, query) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [habit.title, habit.description, ...habit.tags.map((t) => t.label)]
    .join(' ')
    .toLowerCase();
  return haystack.includes(q);
}

export default function Habits() {
  const [modal, setModal] = useState(false);
  const [ghostHabits, setGhostHabits] = useState(GHOST_HABITS);
  const [searchQuery, setSearchQuery] = useState('');

  const handleOpenModal = () => setModal(true);
  const handleCloseModal = () => setModal(false);
  const handleSavePlan = (data) => {
    console.log('Saved plan:', data);
  };

  const filteredGhostHabits = useMemo(
    () => ghostHabits.filter((h) => habitMatchesSearch(h, searchQuery)),
    [ghostHabits, searchQuery]
  );

  const handleDismissGhost = (id) => {
    setGhostHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const handleRegenerateGhost = () => {
    // Visual-only for Step 1 — AI regeneration wired in a later step.
  };

  return (
    <div className="py-7.5 max-lg:py-4 max-lg:sm:py-6">
      {/* Header */}
      <div className="mb-5 flex w-full items-start justify-between max-lg:mb-4 max-lg:flex-col max-lg:gap-4">
        <div className="flex flex-col items-start gap-2">
          <p className="text-[20px] font-medium text-[#181818] dark:text-white">Habits Board</p>
          <TypewriterText
            phrases={HABITS_SUBTITLE_PHRASES}
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
      <div className="mb-5 flex w-full items-center justify-between max-lg:mb-4 max-lg:flex-col max-lg:items-stretch max-lg:gap-4">
        <button
          onClick={handleOpenModal}
          className="flex items-center gap-2 rounded-lg bg-[#8022fe] px-3 py-2 text-[12px] font-semibold text-white max-lg:w-full max-lg:justify-center max-lg:py-2.5 max-lg:text-base"
        >
          <Plus size={10} />
          New Habit
        </button>

        <div className="flex items-center gap-2.5 max-lg:w-full max-lg:flex-col max-lg:gap-2">
          {FILTER_CONFIG.map(({ key, defaultLabel, options }) => (
            <FilterDropdown key={key} defaultLabel={defaultLabel} options={options} />
          ))}
        </div>
      </div>

      {/* Board panel */}
      <div className="relative flex w-full flex-col gap-2.5 overflow-hidden rounded-2xl border border-[#f2f2f2] bg-white p-3 dark:border-zinc-700 dark:bg-zinc-800">
        <div className="flex items-center justify-between gap-4 max-lg:flex-wrap max-lg:gap-2">
          <div className="flex items-center gap-2">
            <span className="flex shrink-0 items-center gap-1 rounded-[6px] bg-[#f9f4ff] px-[6px] py-[2px] text-xs font-medium text-[#8022fe]">
              <Sparkles size={10} />
              {filteredGhostHabits.length} AI Suggestions
            </span>
          </div>
          <div className="flex flex-1 items-center gap-2 max-lg:hidden">
            <Flame size={12} className="shrink-0 text-[#5d5d5d] dark:text-gray-300" />
            <p className="text-sm font-medium text-[#5d5d5d] dark:text-gray-300">Streak</p>
          </div>
          <div className="flex items-center gap-7.5 max-lg:hidden">
            {DAYS.map((day, i) => (
              <div key={day} className="flex w-10 items-center justify-between">
                <p
                  className={`text-sm font-medium ${
                    i === TODAY_INDEX ? 'text-[#8022fe]' : 'text-[#5d5d5d] dark:text-gray-300'
                  }`}
                >
                  {day}
                </p>
                {i === TODAY_INDEX && <span className="size-1 shrink-0 rounded-full bg-[#8022fe]" />}
              </div>
            ))}
          </div>
        </div>

        {filteredGhostHabits.length === 0 ? (
          <p className="py-10 text-center text-sm font-medium text-[#c2c2c2] dark:text-gray-500">
            No habits to show yet.
          </p>
        ) : (
          filteredGhostHabits.map((habit) => (
            <GhostHabitRow
              key={habit.id}
              habit={habit}
              onDismiss={handleDismissGhost}
              onRegenerate={handleRegenerateGhost}
            />
          ))
        )}
      </div>

      <NewHabitsModal open={modal} onClose={handleCloseModal} onSave={handleSavePlan} />
    </div>
  );
}
