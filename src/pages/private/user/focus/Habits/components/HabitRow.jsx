import { Flame, MoreHorizontal, Pencil, Sparkles, Check, Pause, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TODAY_INDEX = (new Date().getDay() + 6) % 7; // Mon=0 ... Sun=6

// Day cell states: 'unscheduled' (invisible spacer), 'empty' (not done yet),
// 'checked' (completed), 'today' (partial-fill bar + "{done}/{total}" label).
function DayCell({ state, todayProgress, dimmed }) {
  if (state === 'unscheduled') {
    // opacity-0 only — must stay in the layout flow (not display:none) so it still
    // occupies its grid/flex slot, keeping the visible cells aligned under the
    // correct weekday at every breakpoint.
    return <div className="size-10 shrink-0 rounded-[10px] opacity-0 max-lg:size-9" />;
  }

  if (state === 'today' && todayProgress) {
    const pct = Math.min(100, Math.round((todayProgress.done / todayProgress.total) * 100));
    return (
      <div className="flex shrink-0 flex-col items-center gap-1">
        <div
          className={`relative size-10 overflow-hidden rounded-[10px] border border-[#e9e9e9] bg-white max-lg:size-9 ${dimmed ? 'opacity-40' : ''}`}
        >
          <div className="absolute inset-y-0 left-0 bg-[#f9f4ff]" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-[10px] font-medium text-[#5d5d5d] dark:text-gray-400">
          {todayProgress.done}/{todayProgress.total}
        </p>
      </div>
    );
  }

  if (state === 'checked') {
    return (
      <div
        className={`flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-[#f9f4ff] max-lg:size-9 ${dimmed ? 'opacity-40' : ''}`}
      >
        <Check size={16} strokeWidth={3} className="text-[#8022fe]" />
      </div>
    );
  }

  return (
    <div
      className={`size-10 shrink-0 rounded-[10px] border border-[#e9e9e9] bg-white dark:border-zinc-600 dark:bg-zinc-700 max-lg:size-9 ${dimmed ? 'opacity-40' : ''}`}
    />
  );
}

function HabitRowMenu({ onEdit, onImprove, onComplete, onPause, onDelete }) {
  return (
    <div className="flex w-max flex-col overflow-hidden rounded-lg border border-[#f2f2f2] bg-white shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)] dark:border-zinc-700 dark:bg-zinc-800">
      <button
        type="button"
        onClick={onEdit}
        className="flex items-center gap-1.5 border-b border-[#f2f2f2] px-[10px] py-1.5 text-left text-sm font-medium whitespace-nowrap text-[#5d5d5d] hover:bg-[#fcfcfc] dark:border-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-700"
      >
        <Pencil size={10} className="shrink-0" />
        Edit
      </button>
      <button
        type="button"
        onClick={onImprove}
        className="flex items-center gap-1.5 border-b border-[#f2f2f2] px-[10px] py-1.5 text-left text-sm font-medium whitespace-nowrap text-[#8022fe] hover:bg-[#fcfcfc] dark:border-zinc-700 dark:hover:bg-zinc-700"
      >
        <Sparkles size={10} className="shrink-0" />
        Improve habit
      </button>
      <button
        type="button"
        onClick={onComplete}
        className="flex items-center gap-1.5 px-[10px] py-1.5 text-left text-sm font-medium whitespace-nowrap text-[#5d5d5d] hover:bg-[#fcfcfc] dark:text-gray-300 dark:hover:bg-zinc-700"
      >
        <Check size={10} className="shrink-0" />
        Complete
      </button>
      <button
        type="button"
        onClick={onPause}
        className="flex items-center gap-1.5 px-[10px] py-1.5 text-left text-sm font-medium whitespace-nowrap text-[#5d5d5d] hover:bg-[#fcfcfc] dark:text-gray-300 dark:hover:bg-zinc-700"
      >
        <Pause size={10} className="shrink-0" />
        Pause
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="flex items-center gap-1.5 px-[10px] py-1.5 text-left text-sm font-medium whitespace-nowrap text-[#5d5d5d] hover:bg-[#fcfcfc] dark:text-gray-300 dark:hover:bg-zinc-700"
      >
        <Trash2 size={10} className="shrink-0" />
        Delete
      </button>
    </div>
  );
}

// Real (non-ghost) habit row — used on the populated board (Step 2) and reused as the
// AI-generation result preview inside the New Habit modal (Step 3), per the confirmed
// "reuse the real row component" decision.
export default function HabitRow({
  habit,
  showMenu = true,
  compact = false,
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

  return (
    <div
      ref={rowRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex w-full shrink-0 items-start rounded-2xl border border-solid border-[#f2f2f2] bg-[#fcfcfc] p-3 max-lg:flex-col max-lg:gap-3 dark:border-zinc-700 dark:bg-zinc-800"
    >
      <div className={`flex shrink-0 flex-col gap-2.5 max-lg:w-full ${compact ? 'w-97' : 'w-56 2xl:w-97'}`}>
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
        <div className={`flex flex-wrap items-center gap-1 ${isPaused ? 'opacity-50' : ''}`}>
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
      </div>

      {!compact && (
        <div className="flex w-24 shrink-0 items-center gap-1.5 max-lg:w-auto 2xl:w-43.75">
          <Flame
            size={12}
            className={`shrink-0 ${
              habit.status === 'active' && habit.streak > 0 ? 'text-[#f97316]' : 'text-transparent'
            }`}
          />
          <p
            className={`text-sm font-medium ${
              habit.status === 'active' && habit.streak > 0 ? 'text-[#f97316]' : 'text-[#c2c2c2]'
            }`}
          >
            {habit.streak} days
          </p>
        </div>
      )}

      {!compact && !isCompleted && (
        <div className="grid w-full grid-cols-7 place-items-center gap-1 lg:hidden">
          {DAYS.map((day, i) => (
            <div key={day} className="flex items-center justify-center gap-1">
              <p
                className={`text-xs font-medium ${
                  i === TODAY_INDEX ? 'text-[#8022fe]' : 'text-[#5d5d5d] dark:text-gray-300'
                }`}
              >
                {day}
              </p>
              {i === TODAY_INDEX && <span className="size-1 shrink-0 rounded-full bg-[#8022fe]" />}
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
            compact ? 'w-[460px] shrink-0 justify-center gap-5' : `flex-1 justify-between ${showMenu ? 'pr-8 2xl:pr-41' : ''}`
          }`}
        >
          {DAYS.map((day, i) => (
            <DayCell
              key={day}
              state={habit.days[i]}
              todayProgress={habit.days[i] === 'today' ? habit.todayProgress : null}
              dimmed={isPaused}
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
            onEdit={() => {
              setMenuOpen(false);
              onEdit?.(habit);
            }}
            onImprove={() => {
              setMenuOpen(false);
              onImprove?.(habit);
            }}
            onComplete={() => {
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
