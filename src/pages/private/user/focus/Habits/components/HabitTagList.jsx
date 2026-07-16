import { useState } from 'react';

/**
 * Habit card tags with overflow (+N). Extra tags hide behind +N;
 * hover reveals them in a dropdown (product hover pattern).
 */
export default function HabitTagList({ tags = [], maxVisible = 2, className = '' }) {
  const [overflowOpen, setOverflowOpen] = useState(false);
  const visible = tags.slice(0, maxVisible);
  const hidden = tags.slice(maxVisible);

  if (tags.length === 0) return null;

  return (
    <div className={`flex flex-nowrap items-center gap-1 overflow-visible ${className}`}>
      {visible.map((tag) => (
        <span
          key={tag.label}
          className="flex shrink-0 items-center gap-1.5 rounded-[6px] border border-[#f2f2f2] px-[6px] py-[2px] text-xs font-medium whitespace-nowrap text-[#5d5d5d] dark:border-zinc-700 dark:text-gray-300"
        >
          {tag.icon && <tag.icon size={12} className="shrink-0" />}
          {tag.label}
        </span>
      ))}

      {hidden.length > 0 && (
        <div
          className="relative shrink-0"
          onMouseEnter={() => setOverflowOpen(true)}
          onMouseLeave={() => setOverflowOpen(false)}
        >
          <span className="flex cursor-default items-center rounded-[6px] border border-[#f2f2f2] px-[6px] py-[2px] text-xs font-medium text-[#5d5d5d] dark:border-zinc-700 dark:text-gray-300">
            +{hidden.length}
          </span>
          {overflowOpen && (
            <div className="absolute top-full left-0 z-40 mt-1 flex min-w-max flex-col gap-1 rounded-lg border border-[#f2f2f2] bg-white p-1.5 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)] dark:border-zinc-700 dark:bg-zinc-800">
              {hidden.map((tag) => (
                <span
                  key={tag.label}
                  className="flex items-center gap-1.5 rounded-[6px] border border-[#f2f2f2] px-[6px] py-[2px] text-xs font-medium whitespace-nowrap text-[#5d5d5d] dark:border-zinc-700 dark:text-gray-300"
                >
                  {tag.icon && <tag.icon size={12} className="shrink-0" />}
                  {tag.label}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
