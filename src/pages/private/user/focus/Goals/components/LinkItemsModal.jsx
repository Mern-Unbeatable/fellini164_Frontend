import { useEffect, useState } from 'react';
import { X, Check } from 'lucide-react';
import { fetchHabitsForLinkApi, fetchTasksForLinkApi } from '../../../../../../features/goals/goalsAPI';

function normalizeList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.tasks)) return data.tasks;
  if (Array.isArray(data?.habits)) return data.habits;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function itemLabel(item) {
  return item.title || item.name || item.label || 'Untitled';
}

/**
 * Minimal picker to link existing tasks/habits to a goal.
 * UI kept simple — no board redesign.
 */
export default function LinkItemsModal({ open, type, goalTitle, onClose, onConfirm, confirming }) {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isTasks = type === 'tasks';
  const title = isTasks ? 'Link Tasks' : 'Link Habits';

  useEffect(() => {
    if (!open) return undefined;

    let cancelled = false;
    setSelected([]);
    setError(null);
    setLoading(true);

    (async () => {
      try {
        const data = isTasks ? await fetchTasksForLinkApi() : await fetchHabitsForLinkApi();
        if (cancelled) return;
        setItems(
          normalizeList(data).map((item) => ({
            id: item.id,
            label: itemLabel(item),
          }))
        );
      } catch (err) {
        if (cancelled) return;
        setError(err?.response?.data?.message || `Failed to load ${isTasks ? 'tasks' : 'habits'}`);
        setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, isTasks]);

  if (!open) return null;

  const toggle = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="flex max-h-[80vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-[#f2f2f2] bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-[#f2f2f2] px-4 py-3 dark:border-zinc-700">
          <div>
            <p className="text-[14px] font-semibold text-[#181818] dark:text-white">{title}</p>
            {goalTitle && (
              <p className="mt-0.5 text-[12px] font-medium text-[#a3a3a3] line-clamp-1">{goalTitle}</p>
            )}
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="text-[#a3a3a3]">
            <X size={16} />
          </button>
        </div>

        <div className="scrollbar-white min-h-0 flex-1 overflow-y-auto p-3">
          {loading && (
            <p className="py-8 text-center text-[12px] font-medium text-[#c2c2c2]">Loading…</p>
          )}
          {!loading && error && (
            <p className="py-8 text-center text-[12px] font-medium text-red-500">{error}</p>
          )}
          {!loading && !error && items.length === 0 && (
            <p className="py-8 text-center text-[12px] font-medium text-[#c2c2c2]">
              No {isTasks ? 'tasks' : 'habits'} available to link.
            </p>
          )}
          {!loading &&
            !error &&
            items.map((item) => {
              const isOn = selected.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggle(item.id)}
                  className={`mb-1.5 flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-[13px] font-medium transition ${
                    isOn
                      ? 'border-[#8022fe] bg-[#f9f4ff] text-[#8022fe]'
                      : 'border-[#f2f2f2] text-[#181818] hover:bg-[#fcfcfc] dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800'
                  }`}
                >
                  <span
                    className={`flex size-4 shrink-0 items-center justify-center rounded border ${
                      isOn ? 'border-[#8022fe] bg-[#8022fe] text-white' : 'border-[#e9e9e9]'
                    }`}
                  >
                    {isOn && <Check size={10} strokeWidth={3} />}
                  </span>
                  <span className="line-clamp-1">{item.label}</span>
                </button>
              );
            })}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-[#f2f2f2] px-4 py-3 dark:border-zinc-700">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1.5 text-[12px] font-semibold text-[#5d5d5d] hover:bg-[#f2f2f2] dark:text-gray-300"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!selected.length || confirming}
            onClick={() => onConfirm(selected)}
            className={`rounded-lg px-3 py-1.5 text-[12px] font-semibold text-white ${
              selected.length && !confirming
                ? 'bg-[#8022fe] hover:opacity-90'
                : 'cursor-not-allowed bg-[#dedede]'
            }`}
          >
            {confirming ? 'Linking…' : `Link ${selected.length || ''}`}
          </button>
        </div>
      </div>
    </div>
  );
}
