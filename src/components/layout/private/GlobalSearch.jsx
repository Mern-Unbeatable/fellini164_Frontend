import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListTodo, Loader2, RotateCcw, Search, Target, X } from 'lucide-react';
import { fetchTasksApi } from '../../../features/tasks/tasksAPI';
import { fetchHabitsApi } from '../../../features/habits/habitsAPI';
import { fetchGoalsApi } from '../../../features/goals/goalsAPI';

const RESULTS_PER_GROUP = 5;
const FETCH_LIMIT = 20;
const DEBOUNCE_MS = 300;

const GROUPS = [
  {
    key: 'tasks',
    label: 'Tasks',
    icon: ListTodo,
    fetch: (search) => fetchTasksApi({ search, limit: FETCH_LIMIT }).then((env) => env?.tasks ?? []),
    getPath: (id) => `/user/tasks/${id}`,
  },
  {
    key: 'habits',
    label: 'Habits',
    icon: RotateCcw,
    fetch: (search) => fetchHabitsApi({ search, limit: FETCH_LIMIT }).then((env) => env?.habits ?? []),
    getPath: () => '/user/habits',
  },
  {
    key: 'goals',
    label: 'Goals',
    icon: Target,
    fetch: (search) => fetchGoalsApi({ search, limit: FETCH_LIMIT }).then((env) => env?.data ?? []),
    getPath: (id) => `/user/goals/${id}`,
  },
];

function toResults(items, group, query) {
  const needle = query.toLowerCase();
  return items
    .map((item) => ({
      id: item?.id ?? item?._id,
      title: item?.title ?? item?.name ?? '',
    }))
    .filter((r) => r.id && r.title && r.title.toLowerCase().includes(needle))
    .slice(0, RESULTS_PER_GROUP)
    .map((r) => ({ ...r, groupKey: group.key, path: group.getPath(r.id) }));
}

/** Mount only while open — unmounting on close resets the query and results. */
export default function GlobalSearch({ onClose }) {
  const navigate = useNavigate();
  const requestIdRef = useRef(0);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const trimmed = query.trim();

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
    setLoading(Boolean(e.target.value.trim()));
  };

  useEffect(() => {
    if (!trimmed) {
      requestIdRef.current += 1;
      return undefined;
    }
    const requestId = ++requestIdRef.current;
    const timeoutId = setTimeout(async () => {
      const settled = await Promise.allSettled(GROUPS.map((g) => g.fetch(trimmed)));
      if (requestId !== requestIdRef.current) return;
      const next = {};
      GROUPS.forEach((g, i) => {
        next[g.key] = settled[i].status === 'fulfilled' ? toResults(settled[i].value, g, trimmed) : [];
      });
      setResults(next);
      setActiveIndex(0);
      setLoading(false);
    }, DEBOUNCE_MS);
    return () => clearTimeout(timeoutId);
  }, [trimmed]);

  const visibleResults = useMemo(() => (trimmed ? results : {}), [trimmed, results]);
  const flatResults = useMemo(
    () => GROUPS.flatMap((g) => visibleResults[g.key] ?? []),
    [visibleResults]
  );

  const handleSelect = (result) => {
    onClose();
    navigate(result.path);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown' && flatResults.length) {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % flatResults.length);
    } else if (e.key === 'ArrowUp' && flatResults.length) {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + flatResults.length) % flatResults.length);
    } else if (e.key === 'Enter' && flatResults[activeIndex]) {
      e.preventDefault();
      handleSelect(flatResults[activeIndex]);
    }
  };

  const showEmpty = trimmed && !loading && flatResults.length === 0;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-black/25 px-4 pt-[12vh] backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        onMouseDown={(e) => e.stopPropagation()}
        className="w-full max-w-[560px] overflow-hidden rounded-[14px] border border-[#f2f2f2] bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
      >
        <div className="flex items-center gap-2.5 border-b border-[#f2f2f2] px-4 py-3 dark:border-zinc-700">
          <Search size={18} className="shrink-0 text-[#c2c2c2] dark:text-zinc-500" strokeWidth={1.75} />
          <input
            autoFocus
            value={query}
            onChange={handleQueryChange}
            onKeyDown={handleKeyDown}
            placeholder="Search tasks, habits and goals..."
            className="min-w-0 flex-1 bg-transparent text-[14px] text-[#2d2d2d] outline-none placeholder:text-[#c2c2c2] dark:text-gray-100 dark:placeholder:text-zinc-500"
          />
          {loading && <Loader2 size={16} className="shrink-0 animate-spin text-[#8022fe]" />}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="shrink-0 rounded p-0.5 text-[#c2c2c2] hover:bg-[#f2f2f2] hover:text-[#5d5d5d] dark:hover:bg-zinc-800"
          >
            <X size={16} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {!trimmed && (
            <p className="px-2.5 py-6 text-center text-[13px] text-[#c2c2c2] dark:text-zinc-500">
              Type to search your tasks, habits and goals.
            </p>
          )}

          {showEmpty && (
            <p className="px-2.5 py-6 text-center text-[13px] text-[#5d5d5d] dark:text-gray-300">
              No results found.
            </p>
          )}

          {GROUPS.map((group) => {
            const items = visibleResults[group.key] ?? [];
            if (!items.length) return null;
            const Icon = group.icon;
            return (
              <div key={group.key} className="mb-1">
                <p className="px-2.5 pt-2 pb-1 text-[12px] font-medium text-[#c2c2c2] dark:text-zinc-500">
                  {group.label}
                </p>
                {items.map((item) => {
                  const index = flatResults.indexOf(item);
                  const isActive = index === activeIndex;
                  return (
                    <button
                      key={`${group.key}-${item.id}`}
                      type="button"
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[14px] font-medium ${
                        isActive
                          ? 'bg-[#f9f4ff] text-[#8022fe] dark:bg-purple-950 dark:text-purple-300'
                          : 'text-[#5d5d5d] dark:text-gray-300'
                      }`}
                    >
                      <Icon size={16} className="shrink-0" strokeWidth={1.75} />
                      <span className="min-w-0 flex-1 truncate">{item.title}</span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-3 border-t border-[#f2f2f2] px-4 py-2 text-[11px] text-[#c2c2c2] dark:border-zinc-700 dark:text-zinc-500">
          <span>↑↓ to navigate</span>
          <span>Enter to open</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  );
}
