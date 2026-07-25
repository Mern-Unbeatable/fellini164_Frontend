import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export const FILTER_CONFIG = [
  {
    key: 'Status',
    defaultLabel: 'All Status',
    options: ['All Statuses', 'To Do', 'In Progress', 'Done'],
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

export const PRIORITY_LABELS = {
  URGENT: 'Urgent',
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
};

export const DEFAULT_FILTERS = FILTER_CONFIG.reduce(
  (acc, { key, options }) => ({ ...acc, [key]: options[0] }),
  {}
);

/** @deprecated Prefer buildTasksQueryParams (API filters including source). */
export function taskMatchesFilters(task, filters) {
  if (filters.Status !== 'All Statuses' && task.status && task.status !== filters.Status) {
    return false;
  }
  if (filters.Priority !== 'All Priorities' && PRIORITY_LABELS[task.priority] !== filters.Priority) {
    return false;
  }
  if (filters.Category !== 'All Categories') {
    const category = task.category || task.tags?.[0]?.label;
    if (category !== filters.Category) return false;
  }
  if (filters.Source !== 'All Sources') {
    const wantsAi = filters.Source === 'Created by AI';
    if ((task.source === 'ai') !== wantsAi) return false;
  }
  return true;
}

export function FilterDropdown({ defaultLabel, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const ref = useRef(null);
  const isFiltered = value !== options[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayLabel = isFiltered ? value : defaultLabel;

  return (
    <div ref={ref} className="relative max-lg:w-full lg:flex-1 2xl:flex-none">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between rounded-lg border px-3 py-1.75 text-[12px] font-medium max-lg:gap-2 max-lg:py-2.5 max-lg:text-base 2xl:w-30 ${
          isFiltered
            ? 'border-[#8022fe]/30 bg-[#f9f4ff] text-[#8022fe] dark:border-[#8022fe]/40 dark:bg-[#8022fe]/10 dark:text-[#b794f6]'
            : 'border-[#f2f2f2] bg-white text-[#181818] dark:border-zinc-700 dark:bg-zinc-800 dark:text-white'
        }`}
      >
        <span className="truncate max-lg:min-w-0 max-lg:flex-1 max-lg:text-center">{displayLabel}</span>
        <ChevronDown
          size={14}
          className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''} ${
            isFiltered ? 'text-[#8022fe]' : 'text-[#a3a3a3]'
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-8 z-50 w-25 overflow-hidden rounded-lg border border-[#f2f2f2] bg-white shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)] dark:border-zinc-700 dark:bg-zinc-800 max-lg:right-0 max-lg:top-full max-lg:mt-1 max-lg:w-auto 2xl:w-30">
          {options.map((opt) => {
            const isSelected = opt === value;
            return (
              <button
                key={opt}
                type="button"
                onMouseEnter={() => setHovered(opt)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={`flex w-full items-center px-2 py-1.5 text-left text-[12px] font-medium max-lg:text-sm ${
                  isSelected
                    ? 'bg-[#f9f4ff] text-[#8022fe] dark:bg-[#8022fe]/15 dark:text-[#b794f6]'
                    : hovered === opt
                      ? 'bg-[#f2f2f2] text-[#181818] dark:bg-zinc-700 dark:text-white'
                      : 'text-[#181818] dark:text-white'
                }`}
              >
                {opt === options[0] ? defaultLabel : opt}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
