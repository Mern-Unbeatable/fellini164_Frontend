import { useState } from 'react';
import { Bell, Flag, Hourglass } from 'lucide-react';

const ICON_BY_KEY = {
  bell: Bell,
  flag: Flag,
  hourglass: Hourglass,
};

function TagIcon({ tag }) {
  const Icon = tag.icon || (tag.iconKey ? ICON_BY_KEY[tag.iconKey] : null);
  if (!Icon) return null;
  return <Icon size={12} className="shrink-0" />;
}

/**
 * Habit card tags with overflow (+N). Extra tags hide behind +N;
 * hover reveals them in a dropdown (product hover pattern).
 * Pass maxVisible >= tags.length (e.g. Frame 3 AI preview) to show all tags.
 */
export default function HabitTagList({ tags = [], maxVisible = 2, wrap = false, className = '' }) {
  const [overflowOpen, setOverflowOpen] = useState(false);
  const visible = tags.slice(0, maxVisible);
  const hidden = tags.slice(maxVisible);

  if (tags.length === 0) return null;

  return (
    <div
      className={`flex items-center gap-1 overflow-visible ${wrap ? 'flex-wrap' : 'flex-nowrap'} ${className}`}
    >
      {visible.map((tag) => (
        <span
          key={tag.label}
          className="flex shrink-0 items-center gap-1.5 rounded-[6px] border border-[#f2f2f2] px-[6px] py-[2px] text-xs font-medium whitespace-nowrap text-[#5d5d5d] dark:border-zinc-700 dark:text-gray-300"
        >
          <TagIcon tag={tag} />
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
                  <TagIcon tag={tag} />
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
