import {
  Plus,
  Search,
  Sparkles,
  MoreHorizontal,
  ChevronDown,
  RotateCw,
  Flame,
  Bell,
  Flag,
  Hourglass,
  Check,
  X,
} from 'lucide-react';
import { useState, useRef, useEffect, useMemo } from 'react';
import NewHabitsModal from './components/NewHabitsModal';
import HabitRow from './components/HabitRow';
import GhostHabitRow from './components/GhostHabitRow';
import {
  FILTER_CONFIG,
  DEFAULT_FILTERS,
  FilterDropdown,
  habitMatchesFilters,
} from './components/HabitFilters';
import TypewriterText from '../../../../../components/ui/TypewriterText';

const HABITS_SUBTITLE_PHRASES = [
  'Build daily habits and keep your streaks alive...',
  'Let AI suggest habits based on your goals...',
  'Stay consistent, one check-in at a time...',
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TODAY_INDEX = (new Date().getDay() + 6) % 7; // Mon=0 ... Sun=6

// AI-suggested ghost habits — shown only when the board has no real habits yet.
// scheduledDays follows DAYS order (Mon..Sun); unscheduled days render as invisible
const GHOST_HABITS = [
  {
    id: 'ghost-1',
    title: 'Drink Water',
    description: 'Stay hydrated throughout the day',
    tags: [
      { label: 'Health' },
      { label: '7:00 AM • 8:00 PM', icon: Bell },
      { label: '+3' },
    ],
    scheduledDays: [true, true, true, true, true, true, true],
  },
  {
    id: 'ghost-2',
    title: 'Take Breaks',
    description: 'Step away from your screen regularly',
    tags: [{ label: 'Productivity' }, { label: '6:30 PM', icon: Bell }, { label: 'New Job', icon: Flag }],
    scheduledDays: [true, true, true, true, true, false, false],
  },
  {
    id: 'ghost-3',
    title: 'Meditate',
    description: 'Practice mindfulness for mental clarity',
    tags: [{ label: 'Wellness' }, { label: '12 days left', icon: Hourglass }],
    scheduledDays: [true, true, true, false, true, true, false],
  },
];

// Step 2 — populated board sample data (Figma node 1234-11897). Day-state per habit
// follows DAYS order (Mon..Sun): 'empty' | 'checked' | 'today' | 'unscheduled'.
const REAL_HABITS = [
  {
    id: 'habit-1',
    title: 'Drink Water',
    description: 'Stay hydrated throughout the day',
    tags: [
      { label: 'Health' },
      { label: '7:00 AM • 8:00 PM', icon: Bell },
      { label: '+3' },
    ],
    status: 'active',
    streak: 4,
    days: ['empty', 'checked', 'today', 'empty', 'empty', 'empty', 'empty'],
    todayProgress: { done: 1, total: 2 },
  },
  {
    id: 'habit-2',
    title: 'Take Breaks',
    description: 'Step away from your screen regularly',
    tags: [{ label: 'Productivity' }, { label: '6:30 PM', icon: Bell }, { label: 'New Job', icon: Flag }],
    status: 'active',
    streak: 7,
    days: ['checked', 'checked', 'checked', 'empty', 'empty', 'empty', 'empty'],
  },
  {
    id: 'habit-3',
    title: 'Meditate',
    description: 'Practice mindfulness for mental clarity',
    tags: [{ label: 'Wellness' }, { label: '12 days left', icon: Hourglass }],
    status: 'paused',
    streak: 3,
    days: ['checked', 'checked', 'checked', 'unscheduled', 'empty', 'empty', 'unscheduled'],
  },
  {
    id: 'habit-4',
    title: 'Exercise',
    description: 'Engage in physical activity',
    tags: [
      { label: 'Fitness' },
      { label: '7:00 AM • 8:00 PM • +1', icon: Bell },
      { label: '3x/Day' },
    ],
    status: 'active',
    streak: 0,
    days: ['empty', 'empty', 'today', 'empty', 'empty', 'empty', 'empty'],
    todayProgress: { done: 2, total: 3 },
  },
  {
    id: 'habit-5',
    title: 'Drink Water',
    description: 'Stay hydrated throughout the day',
    tags: [{ label: 'Health' }, { label: 'Improve Rate', icon: Sparkles }],
    status: 'completed',
    streak: 21,
    days: Array(7).fill('checked'),
  },
  {
    id: 'habit-6',
    title: 'Drink Water',
    description: 'Stay hydrated throughout the day',
    tags: [{ label: 'Health' }, { label: '7:00 AM • 8:00 PM', icon: Bell }, { label: '+3' }],
    status: 'active',
    streak: 4,
    days: ['empty', 'checked', 'today', 'empty', 'empty', 'empty', 'empty'],
    todayProgress: { done: 1, total: 2 },
  },
];

// FILTER_CONFIG and DEFAULT_FILTERS imported from HabitFilters

// GhostHabitMenu and GhostHabitRow component definition removed (refactored to components/GhostHabitRow.jsx)

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
  const [habits, setHabits] = useState(REAL_HABITS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState(DEFAULT_FILTERS);

  const updateFilter = (key, value) => setActiveFilters((prev) => ({ ...prev, [key]: value }));

  const handleOpenModal = () => setModal(true);
  const handleCloseModal = () => setModal(false);
  const handleSaveHabit = (data) => {
    setHabits((prev) => [
      {
        id: `habit-${Date.now()}`,
        title: data.title,
        description: data.description,
        tags: data.tags,
        status: 'active',
        streak: 0,
        days: Array(7).fill('empty'),
      },
      ...prev,
    ]);
  };

  const boardIsEmpty = habits.length === 0;

  const filteredGhostHabits = useMemo(
    () =>
      ghostHabits.filter(
        (h) => habitMatchesSearch(h, searchQuery) && habitMatchesFilters(h, activeFilters)
      ),
    [ghostHabits, searchQuery, activeFilters]
  );

  const filteredHabits = useMemo(
    () =>
      habits.filter(
        (h) => habitMatchesSearch(h, searchQuery) && habitMatchesFilters(h, activeFilters)
      ),
    [habits, searchQuery, activeFilters]
  );

  const activeCount = habits.filter((h) => h.status === 'active').length;
  const pausedCount = habits.filter((h) => h.status === 'paused').length;
  const completedCount = habits.filter((h) => h.status === 'completed').length;

  const handleDismissGhost = (id) => {
    setGhostHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const handleRegenerateGhost = () => {
    // Visual-only for Step 1 — AI regeneration wired in a later step.
  };

  const handleEditHabit = () => {
    // Edit flow reuses the New Habit modal in a later step — visual-only for now.
  };

  const handleImproveHabit = () => {
    // AI "Improve habit" action — visual-only for now.
  };

  const handleCompleteHabit = (habit) => {
    setHabits((prev) => prev.map((h) => (h.id === habit.id ? { ...h, status: 'completed' } : h)));
  };

  const handlePauseHabit = (habit) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === habit.id ? { ...h, status: h.status === 'paused' ? 'active' : 'paused' } : h))
    );
  };

  const handleDeleteHabit = (habit) => {
    setHabits((prev) => prev.filter((h) => h.id !== habit.id));
  };

  return (
    <div className="relative flex min-h-full flex-col py-7.5 max-lg:min-h-0 max-lg:py-4 max-lg:sm:py-6">
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
          <Search size={14} className="shrink-0 text-[#c2c2c2]" aria-hidden />
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
          <Plus size={14} strokeWidth={2.5} className="shrink-0 text-white" />
          New Habit
        </button>

        <div className="flex items-center gap-2.5 max-lg:w-full max-lg:flex-col max-lg:gap-2">
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

      {/* Board panel */}
      <div className="relative flex min-h-0 w-full flex-1 flex-col gap-2.5 overflow-hidden rounded-2xl border border-[#f2f2f2] bg-white p-3 max-lg:h-auto max-lg:flex-none dark:border-zinc-700 dark:bg-zinc-800">
        <div className="flex items-center max-lg:flex-wrap max-lg:gap-2 lg:px-3.25">
          {boardIsEmpty ? (
            <div className="flex w-56 shrink-0 items-center gap-2 max-lg:w-auto 2xl:w-100">
              <RotateCw size={16} className="shrink-0 text-[#c2c2c2]" />
              <span className="flex shrink-0 items-center gap-1 rounded-[6px] bg-[#f9f4ff] px-[6px] py-[2px] text-xs font-medium text-[#8022fe]">
                <Sparkles size={10} />
                {filteredGhostHabits.length} AI Suggestions
              </span>
            </div>
          ) : (
            <div className="flex w-56 shrink-0 items-center gap-2 max-lg:w-auto 2xl:w-100">
              <RotateCw size={16} className="shrink-0 text-[#c2c2c2]" />
              <p className="text-sm font-medium text-[#5d5d5d] dark:text-gray-300">{activeCount} active</p>
              <span className="rounded-[6px] bg-[#f2f2f2] px-[6px] py-[2px] text-xs font-medium text-[#5d5d5d] dark:bg-zinc-700 dark:text-gray-300">
                {pausedCount} paused<span className="max-xl:hidden"> <span className="text-[#c2c2c2]">•</span> {completedCount} completed this month</span>
              </span>
            </div>
          )}
          <div className="flex w-24 shrink-0 items-center gap-2 max-lg:hidden 2xl:w-44">
            <Flame size={12} className="shrink-0 text-[#5d5d5d] dark:text-gray-300" />
            <p className="text-sm font-medium text-[#5d5d5d] dark:text-gray-300">Streak</p>
          </div>
          <div className="flex flex-1 items-center justify-between pr-8 max-lg:hidden 2xl:pr-44">
            {DAYS.map((day, i) => (
              <div key={day} className="flex w-10 items-center justify-center gap-1">
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

        <div className="scrollbar-hidden relative -mx-3 flex flex-1 flex-col gap-2.5 overflow-y-auto px-3 lg:min-h-0 max-lg:max-h-[min(70vh,560px)]">
          {boardIsEmpty ? (
            filteredGhostHabits.length === 0 ? (
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
            )
          ) : filteredHabits.length === 0 ? (
            <p className="py-10 text-center text-sm font-medium text-[#c2c2c2] dark:text-gray-500">
              No habits match your search.
            </p>
          ) : (
            filteredHabits.map((habit) => (
              <HabitRow
                key={habit.id}
                habit={habit}
                onEdit={handleEditHabit}
                onImprove={handleImproveHabit}
                onComplete={handleCompleteHabit}
                onPause={handlePauseHabit}
                onDelete={handleDeleteHabit}
              />
            ))
          )}
        </div>

        {!boardIsEmpty && filteredHabits.length > 0 && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-15 rounded-b-2xl bg-gradient-to-b from-transparent to-white dark:to-zinc-800" />
        )}
      </div>

      <NewHabitsModal open={modal} onClose={handleCloseModal} onSave={handleSaveHabit} />
    </div>
  );
}
