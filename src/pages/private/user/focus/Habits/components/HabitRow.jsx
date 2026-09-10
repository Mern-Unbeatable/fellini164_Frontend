import { Flame, MoreHorizontal, Pencil, Sparkles, Check, Pause, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import HabitTagList from './HabitTagList';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Day states: 'unscheduled' | 'empty' | 'partial' | 'checked'
// Multi-slot (AI): click N times → fill 1/N … → full check when done === total
function DayCell({ state, progress, dimmed, interactive, onToggle }) {
  if (state === 'unscheduled') {
    return (
      <div className="w-10 shrink-0 max-lg:w-9" aria-hidden>
        <div className="size-10 rounded-[10px] opacity-0 max-lg:size-9" />
      </div>
    );
  }

  const wrapClass = `flex w-10 shrink-0 flex-col items-center max-lg:w-9 ${dimmed ? 'opacity-40' : ''}`;
  const boxClass = `box-border size-10 shrink-0 rounded-[10px] p-0 max-lg:size-9 ${
    interactive && !dimmed ? 'cursor-pointer' : ''
  }`;

  const done = Array.isArray(progress) ? Number(progress[0]) || 0 : 0;
  const total = Array.isArray(progress) ? Number(progress[1]) || 0 : 0;
  const isMultiSlot = total > 1;
  const isPartial = isMultiSlot && done > 0 && done < total;
  const isZeroProgress = isMultiSlot && done === 0 && state !== 'checked';

  // 0/N before first click — empty box + label (no fill / no mini-check)
  if (isZeroProgress) {
    return (
      <div className={`${wrapClass} gap-1`}>
        <button
          type="button"
          disabled={!interactive || dimmed}
          onClick={onToggle}
          aria-label={`0 of ${total} completed`}
          className={`border border-solid border-[#e9e9e9] bg-white disabled:cursor-default dark:border-zinc-600 dark:bg-zinc-700 ${boxClass}`}
        />
        <p className="text-[10px] font-medium whitespace-nowrap text-[#181818] dark:text-white">
          0/{total}
        </p>
      </div>
    );
  }

  if (isPartial || (progress && state === 'partial')) {
    const fillPct = Math.min(100, Math.max(0, (done / Math.max(total, 1)) * 100));
    return (
      <div className={`${wrapClass} gap-1`}>
        <button
          type="button"
          disabled={!interactive || dimmed}
          onClick={onToggle}
          aria-label={`${done} of ${total} completed`}
          className={`relative flex items-center overflow-hidden border border-solid border-[#e9e9e9] bg-white disabled:cursor-default dark:border-zinc-600 dark:bg-zinc-700 ${boxClass}`}
        >
          <span
            aria-hidden
            className="absolute top-0 left-0 h-full rounded-tr-[6px] rounded-br-[6px] bg-[#f9f4ff]"
            style={{ width: `${fillPct}%` }}
          />
          <Check
            size={10}
            strokeWidth={3}
            className="absolute bottom-1 left-1 z-[1] text-[#8022fe]"
            aria-hidden
          />
        </button>
        <p className="text-[10px] font-medium whitespace-nowrap text-[#181818] dark:text-white">
          {done}/{total}
        </p>
      </div>
    );
  }

  if (state === 'checked') {
    return (
      <div className={wrapClass}>
        <button
          type="button"
          disabled={!interactive || dimmed}
          onClick={onToggle}
          aria-label="Mark habit incomplete for this day"
          className={`flex items-center justify-center border-0 bg-[#f9f4ff] disabled:cursor-default ${boxClass}`}
        >
          <Check size={16} strokeWidth={3} className="text-[#8022fe]" />
        </button>
      </div>
    );
  }

  return (
    <div className={wrapClass}>
      <button
        type="button"
        disabled={!interactive || dimmed}
        onClick={onToggle}
        aria-label="Mark habit complete for this day"
        className={`border border-solid border-[#e9e9e9] bg-white disabled:cursor-default dark:border-zinc-600 dark:bg-zinc-700 ${boxClass}`}
      />
    </div>
  );
}

function HabitRowMenu({
  onEdit,
  onImprove,
  onComplete,
  onPause,
  onDelete,
  isPaused,
  isCompleted = false,
}) {
  const itemBase =
    'flex items-center gap-1.5 px-[10px] py-1.5 text-left text-sm font-medium whitespace-nowrap hover:bg-[#fcfcfc] dark:hover:bg-zinc-700';
  const itemDisabled =
    'flex cursor-not-allowed items-center gap-1.5 px-[10px] py-1.5 text-left text-sm font-medium whitespace-nowrap opacity-40';

  return (
    <div className="flex w-max flex-col overflow-hidden rounded-lg border border-[#f2f2f2] bg-white shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)] dark:border-zinc-700 dark:bg-zinc-800">
      <button
        type="button"
        onClick={onEdit}
        className={`${itemBase} border-b border-[#f2f2f2] text-[#5d5d5d] dark:border-zinc-700 dark:text-gray-300`}
      >
        <Pencil size={10} className="shrink-0" />
        Edit
      </button>
      <button
        type="button"
        onClick={onImprove}
        className={`${itemBase} border-b border-[#f2f2f2] text-[#8022fe] dark:border-zinc-700`}
      >
        <Sparkles size={10} className="shrink-0" />
        Improve habit
      </button>
      <button
        type="button"
        disabled={isCompleted}
        aria-disabled={isCompleted}
        onClick={() => {
          if (isCompleted) return;
          onComplete?.();
        }}
        className={
          isCompleted
            ? `${itemDisabled} text-[#5d5d5d] dark:text-gray-300`
            : `${itemBase} text-[#5d5d5d] dark:text-gray-300`
        }
      >
        <Check size={10} className="shrink-0" />
        Complete
      </button>
      <button
        type="button"
        onClick={onPause}
        className={`${itemBase} text-[#5d5d5d] dark:text-gray-300`}
      >
        <Pause size={10} className="shrink-0" />
        {isPaused ? 'Activate' : 'Pause'}
      </button>
      <button
        type="button"
        onClick={onDelete}
        className={`${itemBase} text-[#5d5d5d] dark:text-gray-300`}
      >
        <Trash2 size={10} className="shrink-0" />
        Delete
      </button>
    </div>
  );
}

function streakPresentation(habit) {
  const isPaused = habit.status === 'paused';
  const isCompleted = habit.status === 'completed';
  const showFlame = habit.status === 'active' && habit.streak >= 7;
  if (showFlame) {
    return { flame: true, className: 'text-[#f97316]' };
  }
  if (isPaused || isCompleted) {
    return { flame: false, className: 'text-[#c2c2c2]' };
  }
  return { flame: false, className: 'text-[#181818] dark:text-white' };
}

export default function HabitRow({
  habit,
  showMenu = true,
  compact = false,
  todayIndex = 0,
  onToggleDay,
  onEdit,
  onImprove,
  onComplete,
  onPause,
  onDelete,
}) {
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

  const isPaused = habit.status === 'paused';
  const isCompleted = habit.status === 'completed';
  const showMenuTrigger = showMenu && (isHovered || menuOpen);
  const streak = streakPresentation(habit);
  // Match Goals paused card — ash fade on content (no new colors)
  const ash = isPaused ? 'opacity-50' : '';

  return (
    <div
      ref={rowRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex w-full shrink-0 items-start rounded-2xl border border-solid border-[#f2f2f2] bg-[#fcfcfc] p-3 max-lg:flex-col max-lg:gap-3 dark:border-zinc-700 dark:bg-zinc-800"
    >
      <div className={`flex shrink-0 flex-col gap-2.5 max-lg:w-full ${compact ? 'w-97' : 'w-56 2xl:w-97'} ${ash}`}>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <p
              className={`text-base font-medium ${isPaused ? 'text-[#5d5d5d] dark:text-gray-400' : 'text-[#181818] dark:text-white'}`}
            >
              {habit.title}
            </p>
            {isPaused && (
              <span className="rounded-[6px] bg-[rgba(93,93,93,0.05)] px-[6px] py-[2px] text-xs font-medium text-[#5d5d5d] uppercase">
                Paused
              </span>
            )}
            {isCompleted && (
              <span className="rounded-[6px] bg-[rgba(42,157,0,0.05)] px-[6px] py-[2px] text-xs font-medium text-[#2a9d00] uppercase">
                Completed
              </span>
            )}
          </div>
          <p
            className={`overflow-hidden text-ellipsis whitespace-nowrap text-xs leading-normal ${isPaused ? 'text-[#c2c2c2]' : 'text-[#a3a3a3]'}`}
          >
            {habit.description}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1">
          <HabitTagList
            tags={habit.tags || []}
            maxVisible={
              // Manual: never show +N overflow. AI: keep Figma +N tag overflow.
              habit.source === 'manual'
                ? (habit.tags || []).length
                : compact
                  ? (habit.tags || []).length
                  : 2
            }
            wrap={compact || habit.source === 'manual'}
          />
          {habit.timesPerDayBadge && (
            <span className="flex shrink-0 items-center rounded-[6px] border border-[#f2f2f2] px-[6px] py-[2px] text-xs font-medium text-[#5d5d5d] dark:border-zinc-700 dark:text-gray-300">
              {habit.timesPerDayBadge}
            </span>
          )}
        </div>
      </div>

      {!compact && (
        <div className={`flex w-24 shrink-0 items-center gap-1.5 max-lg:w-auto 2xl:w-43.75 ${ash}`}>
          <Flame size={12} className={`shrink-0 ${streak.flame ? 'text-[#f97316]' : 'text-transparent'}`} />
          <p className={`text-sm font-medium ${streak.className}`}>{habit.streak} days</p>
        </div>
      )}

      {!compact && !isCompleted && (
        <div className={`grid w-full grid-cols-7 place-items-center gap-1 lg:hidden ${ash}`}>
          {DAYS.map((day, i) => (
            <div key={day} className="flex items-center justify-center gap-1">
              <p
                className={`text-xs font-medium ${
                  i === todayIndex && !isPaused ? 'text-[#8022fe]' : 'text-[#5d5d5d] dark:text-gray-300'
                }`}
              >
                {day}
              </p>
              {i === todayIndex && !isPaused && (
                <span className="size-1 shrink-0 rounded-full bg-[#8022fe]" />
              )}
            </div>
          ))}
        </div>
      )}

      {isCompleted ? (
        <div
          className={`flex items-start justify-between max-lg:w-full max-lg:pr-0 ${
            compact ? 'w-[460px] shrink-0' : `flex-1 ${showMenu ? 'pr-8 2xl:pr-41' : ''}`
          }`}
        >
          <div className="flex h-10 w-full items-center justify-center gap-2.5 rounded-[10px] bg-[rgba(42,157,0,0.05)]">
            <p className="text-sm font-medium text-[#2a9d00]">Habit reached</p>
            <Check size={12} strokeWidth={3} className="text-[#2a9d00]" />
          </div>
        </div>
      ) : (
        <div
          className={`flex items-start max-lg:grid max-lg:w-full max-lg:grid-cols-7 max-lg:place-items-center max-lg:gap-1 max-lg:pr-0 ${
            compact
              ? 'w-[460px] shrink-0 justify-center gap-5'
              : `flex-1 justify-between ${showMenu ? 'pr-8 2xl:pr-41' : ''}`
          } ${ash}`}
        >
          {DAYS.map((day, i) => (
            <DayCell
              key={day}
              state={habit.days?.[i] || 'empty'}
              progress={
                habit.dayProgress?.[i] ||
                (i === todayIndex && habit.todayProgress ? habit.todayProgress : null)
              }
              dimmed={false}
              interactive={Boolean(onToggleDay) && !isCompleted && !isPaused && i === todayIndex}
              onToggle={() => onToggleDay?.(habit.id, i)}
            />
          ))}
        </div>
      )}

      {showMenuTrigger && (
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Habit menu"
          aria-expanded={menuOpen}
          className={`animate-fade-in absolute right-3 top-3 z-20 shrink-0 rounded-[6px] p-1 text-[#a3a3a3] ${
            menuOpen ? 'bg-[#f2f2f2]' : 'hover:bg-[#f2f2f2]'
          }`}
        >
          <MoreHorizontal size={14} />
        </button>
      )}

      {showMenu && menuOpen && (
        <div className="absolute right-3 top-9 z-50">
          <HabitRowMenu
            isPaused={isPaused}
            isCompleted={isCompleted}
            onEdit={() => {
              setMenuOpen(false);
              onEdit?.(habit);
            }}
            onImprove={() => {
              setMenuOpen(false);
              onImprove?.(habit);
            }}
            onComplete={() => {
              if (isCompleted) return;
              setMenuOpen(false);
              onComplete?.(habit);
            }}
            onPause={() => {
              setMenuOpen(false);
              onPause?.(habit);
            }}
            onDelete={() => {
              setMenuOpen(false);
              onDelete?.(habit);
            }}
          />
        </div>
      )}
    </div>
  );
}
