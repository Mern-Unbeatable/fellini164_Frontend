import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export const FILTER_CONFIG = [
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
    key: 'Streak',
    defaultLabel: 'All Streak',
    options: ['All Streak', 'Active streak', 'No streak', 'Best streak'],
  },
  {
    key: 'Days Left',
    defaultLabel: 'All Days Left',
    options: ['All Days Left', '1-7 days', '8-30 days', '30+ days'],
  },
];

export const DEFAULT_FILTERS = FILTER_CONFIG.reduce(
  (acc, { key, defaultLabel }) => ({ ...acc, [key]: defaultLabel }),
  {}
);

export function FilterDropdown({ defaultLabel, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayLabel = value === options[0] ? defaultLabel : value;

  return (
    <div ref={ref} className="relative max-lg:w-full">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-30 items-center justify-between rounded-lg border border-[#f2f2f2] bg-white px-3 py-1.75 text-[12px] font-medium text-[#181818] dark:border-zinc-700 dark:bg-zinc-800 dark:text-white max-lg:w-full max-lg:gap-2 max-lg:py-2.5 max-lg:text-base"
      >
        <span className="truncate max-lg:min-w-0 max-lg:flex-1 max-lg:text-center">{displayLabel}</span>
        <ChevronDown
          size={14}
          className={`shrink-0 text-[#a3a3a3] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="scrollbar-white absolute left-0 top-8 z-50 max-h-60 w-30 overflow-y-auto rounded-lg border border-[#f2f2f2] bg-white shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)] dark:border-zinc-700 dark:bg-zinc-800 max-lg:right-0 max-lg:top-full max-lg:mt-1 max-lg:w-auto">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onMouseEnter={() => setHovered(opt)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => {
                onChange(opt);
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

function getHabitCategory(habit) {
  return habit.tags?.[0]?.label;
}

function getHabitScheduleType(habit) {
  const scheduledFlags =
    habit.scheduledDays ?? (habit.days ? habit.days.map((d) => d !== 'unscheduled') : null);
  if (!scheduledFlags) return null;
  return scheduledFlags.every(Boolean) ? 'Daily' : 'Custom';
}

function getHabitDaysLeftBucket(habit) {
  const tag = habit.tags?.find((t) => /\d+\s*days?\s*left/i.test(t.label));
  if (!tag) return null;
  const n = parseInt(tag.label, 10);
  if (Number.isNaN(n)) return null;
  if (n <= 7) return '1-7 days';
  if (n <= 30) return '8-30 days';
  return '30+ days';
}

function getHabitStreakBucket(habit) {
  const streak = habit.streak ?? 0;
  if (habit.status === 'active' && streak > 0) {
    if (streak >= 7) return 'Best streak';
    return 'Active streak';
  }
  if (streak === 0) return 'No streak';
  // paused/completed with streak still count as Active for filter purposes if > 0,
  // but "Best streak" is reserved for active high streaks above.
  if (streak >= 7) return 'Best streak';
  if (streak > 0) return 'Active streak';
  return 'No streak';
}

export function habitMatchesFilters(habit, filters) {
  if (filters.Category !== 'All Category' && getHabitCategory(habit) !== filters.Category) {
    return false;
  }
  if (filters.Schedule !== 'All Schedule' && getHabitScheduleType(habit) !== filters.Schedule) {
    return false;
  }
  if (filters.Streak && filters.Streak !== 'All Streak') {
    const bucket = getHabitStreakBucket(habit);
    if (filters.Streak === 'Best streak') {
      if (bucket !== 'Best streak') return false;
    } else if (filters.Streak === 'Active streak') {
      if (bucket !== 'Active streak' && bucket !== 'Best streak') return false;
    } else if (filters.Streak === 'No streak') {
      if (bucket !== 'No streak') return false;
    }
  }
  if (filters['Days Left'] !== 'All Days Left' && getHabitDaysLeftBucket(habit) !== filters['Days Left']) {
    return false;
  }
  return true;
}
