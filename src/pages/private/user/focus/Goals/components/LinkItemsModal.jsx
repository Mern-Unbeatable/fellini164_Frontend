import { useEffect, useState } from 'react';
import { X, Check, ChevronDown } from 'lucide-react';
import {
  fetchHabitsForLinkApi,
  fetchTasksForLinkApi,
} from '../../../../../../features/goals/goalsAPI';
import {
  normalizeLinkPickerOptions,
  orderedLinkPickerOptions,
} from '../../../../../../features/goals/goalsMappers';

const EMPTY_IDS = [];

function OptionBadge({ type }) {
  if (type === 'aiSuggested') {
    return (
      <span className="rounded-[4px] bg-[#f9f4ff] px-[4px] py-px text-[10px] font-medium leading-[1.5] text-[#8022fe]">
        ✦ AI Suggested
      </span>
    );
  }
  if (type === 'paused') {
    return (
      <span className="rounded-[4px] bg-[rgba(93,93,93,0.05)] px-[4px] py-px text-[10px] font-medium uppercase leading-[1.5] text-[#5d5d5d]">
        Paused
      </span>
    );
  }
  if (type === 'completed') {
    return (
      <span className="rounded-[4px] bg-[rgba(42,157,0,0.05)] px-[4px] py-px text-[10px] font-medium uppercase leading-[1.5] text-[#2a9d00]">
        Completed
      </span>
    );
  }
  return null;
}

/**
 * Plus (+) on Linked Tasks / Habits — multi-select from live GET /tasks | /habits.
 * Same list API as Spark → Find & Attach.
 */
export default function LinkItemsModal({
  open,
  type,
  goalTitle,
  onClose,
  onConfirm,
  confirming,
  excludeIds = EMPTY_IDS,
}) {
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState([]);
  const [listOpen, setListOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isTasks = type === 'tasks';
  const label = isTasks ? 'Linked Tasks' : 'Linked Habits';
  const placeholder = isTasks ? 'Select Tasks' : 'Select Habits';
  const excludeKey = (excludeIds || EMPTY_IDS).join(',');

  useEffect(() => {
    if (!open) return undefined;

    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        // GET /api/v1/tasks|habits — same contract as Spark Find & Attach
        const data = isTasks ? await fetchTasksForLinkApi() : await fetchHabitsForLinkApi();
        if (cancelled) return;
        const excluded = new Set(excludeIds || EMPTY_IDS);
        setOptions(
          orderedLinkPickerOptions(normalizeLinkPickerOptions(data)).filter(
            (o) => !excluded.has(o.id),
          ),
        );
        setSelected([]);
        setListOpen(true);
      } catch (err) {
        if (cancelled) return;
        setError(err?.response?.data?.message || `Failed to load ${isTasks ? 'tasks' : 'habits'}`);
        setOptions([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- excludeKey stands in for excludeIds
  }, [open, isTasks, excludeKey]);

  if (!open) return null;

  const toggle = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const selectedItems = options.filter((o) => selected.includes(o.id));
  const canSubmit = selected.length > 0 && !confirming && !loading;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className="flex w-full max-w-[450px] flex-col overflow-hidden rounded-2xl border border-[#f2f2f2] bg-[#fcfcfc] dark:border-zinc-700 dark:bg-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#f2f2f2] px-3 py-2.5 dark:border-zinc-700">
          <div>
            <p className="text-[12px] font-medium text-[#5d5d5d] dark:text-gray-300">{label}</p>
            {goalTitle && (
              <p className="mt-0.5 text-[11px] font-medium text-[#a3a3a3] line-clamp-1">{goalTitle}</p>
            )}
          </div>
          <button type="button" onClick={onClose} className="text-[#5d5d5d] dark:text-gray-300" aria-label="Close">
            <X size={14} />
          </button>
        </div>

        <div className="flex flex-col gap-6 p-3">
          <div className="relative flex flex-col gap-[6px]">
            <p className="text-[12px] font-medium leading-[1.5] text-[#c2c2c2] dark:text-zinc-500">{label}</p>
            <button
              type="button"
              onClick={() => setListOpen((v) => !v)}
              className="flex h-[31px] w-full items-center justify-between rounded-[8px] border border-[#f2f2f2] bg-white px-[12px] py-[8px] text-left dark:border-zinc-700 dark:bg-zinc-800"
            >
              <span className="truncate text-[12px] font-medium leading-normal text-[#c2c2c2]">
                {loading
                  ? 'Loading…'
                  : selectedItems.length > 0
                    ? selectedItems.map((i) => i.label).join(', ')
                    : placeholder}
              </span>
              <ChevronDown
                size={12}
                className={`shrink-0 text-[#a3a3a3] transition-transform ${listOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {listOpen && (
              <div className="max-h-60 overflow-y-auto overflow-x-hidden rounded-[8px] border border-[#f2f2f2] bg-white shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)] dark:border-zinc-700 dark:bg-zinc-800">
                {loading && (
                  <p className="px-[10px] py-3 text-[12px] font-medium text-[#c2c2c2]">
                    Loading {isTasks ? 'tasks' : 'habits'}…
                  </p>
                )}
                {!loading && error && (
                  <p className="px-[10px] py-3 text-[12px] font-medium text-red-500">{error}</p>
                )}
                {!loading && !error && options.length === 0 && (
                  <p className="px-[10px] py-3 text-[12px] font-medium text-[#c2c2c2]">
                    No {isTasks ? 'tasks' : 'habits'} available to link.
                  </p>
                )}
                {!loading &&
                  !error &&
                  options.map((option) => {
                    const checked = selected.includes(option.id);
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => toggle(option.id)}
                        className="flex h-[30px] w-full items-center gap-[6px] px-[10px] py-[6px] text-left hover:bg-[#fcfcfc] dark:hover:bg-zinc-700"
                      >
                        <span
                          className={`flex size-[14px] shrink-0 items-center justify-center rounded-[4px] border ${
                            checked
                              ? 'border-[#8022fe] bg-[#8022fe] text-white'
                              : 'border-[#e9e9e9] bg-white dark:border-zinc-600 dark:bg-zinc-800'
                          }`}
                        >
                          {checked && <Check size={10} strokeWidth={3} />}
                        </span>
                        <span className="text-[12px] font-medium leading-[1.5] text-[#5d5d5d] dark:text-gray-300">
                          {option.label}
                        </span>
                        {option.aiSuggested && <OptionBadge type="aiSuggested" />}
                        {option.status === 'paused' && <OptionBadge type="paused" />}
                        {option.status === 'completed' && <OptionBadge type="completed" />}
                      </button>
                    );
                  })}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="flex flex-1 items-center justify-center rounded-lg bg-[#f2f2f2] px-3 py-2 text-[12px] font-medium text-[#5d5d5d] dark:bg-zinc-700 dark:text-gray-300"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!canSubmit}
              onClick={() => onConfirm(selected, selectedItems)}
              className={`flex flex-1 items-center justify-center rounded-lg px-3 py-2 text-[12px] font-semibold ${
                canSubmit
                  ? 'bg-[#8022fe] text-white'
                  : 'cursor-not-allowed bg-[#f1f1f1] text-[#dedede]'
              }`}
            >
              {confirming ? 'Linking…' : 'Attach'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
