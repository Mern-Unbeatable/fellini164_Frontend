import { useState, useRef, useEffect } from 'react';
import { Sparkles, Check, X, MoreHorizontal } from 'lucide-react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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

export default function GhostHabitRow({ habit, onDismiss, onRegenerate }) {
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
      className={`relative flex w-full shrink-0 items-start rounded-2xl border p-3 transition-all max-lg:flex-col max-lg:gap-3 ${
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
          <p className="overflow-hidden text-ellipsis whitespace-nowrap text-xs leading-normal text-[#a3a3a3]">
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
            className="flex w-max items-center gap-1.5 rounded-[6px] bg-[#f9f4ff] px-[8px] py-[2px] text-xs font-medium text-[#8022fe]"
          >
            Accept Habit
            <Check size={10} strokeWidth={2.5} />
          </button>
        )}
      </div>

      <p className={`w-[175px] shrink-0 text-sm font-medium text-[#181818] transition-opacity duration-200 dark:text-white max-lg:w-auto ${isActive ? 'opacity-100' : 'opacity-40'}`}>
        0 days
      </p>

      <div className={`flex flex-1 items-center justify-between pr-44 transition-opacity duration-200 max-lg:w-full max-lg:flex-wrap max-lg:justify-start max-lg:gap-2 max-lg:pr-0 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
        {DAYS.map((day, i) => (
          <div
            key={day}
            className={`size-10 shrink-0 rounded-[10px] border border-[#e9e9e9] bg-white dark:border-zinc-600 dark:bg-zinc-700 max-lg:size-9 ${
              habit.scheduledDays[i] ? '' : 'opacity-0 max-lg:hidden'
            }`}
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
