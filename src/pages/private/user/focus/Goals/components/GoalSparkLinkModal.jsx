import { useEffect, useState } from 'react';
import { X, Sparkles, Check, ChevronDown } from 'lucide-react';
import TypewriterPlaceholder from '../../../../../../components/ui/TypewriterPlaceholder';
import {
  fetchHabitsForLinkApi,
  fetchTasksForLinkApi,
} from '../../../../../../features/goals/goalsAPI';
import {
  normalizeLinkPickerOptions,
  orderedLinkPickerOptions,
} from '../../../../../../features/goals/goalsMappers';

const AI_TASK_PHRASES = [
  'Create a task for my weekly workout...',
  'Add a task to update my resume...',
  'Generate a task for skill practice...',
];

const AI_HABIT_PHRASES = [
  'Create a habit for drinking water...',
  'Build a daily stretch routine...',
  'Suggest a habit for better focus...',
];

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

function TabToggle({ activeTab, onChange }) {
  return (
    <div className="flex w-full gap-1 rounded-[8px] bg-[#fcfcfc] p-[2px] dark:bg-zinc-800">
      <button
        type="button"
        onClick={() => onChange('ai')}
        className={`flex flex-1 items-center justify-center gap-[6px] rounded-[6px] px-[8px] py-[6px] text-[12px] font-medium leading-normal ${
          activeTab === 'ai' ? 'bg-[#f9f4ff] text-[#8022fe]' : 'text-[#c2c2c2]'
        }`}
      >
        <Sparkles size={10} />
        AI Generation
      </button>
      <button
        type="button"
        onClick={() => onChange('find')}
        className={`flex flex-1 items-center justify-center rounded-[6px] px-[8px] py-[6px] text-[12px] font-medium leading-normal ${
          activeTab === 'find'
            ? 'bg-[#f2f2f2] text-[#181818] dark:bg-zinc-700 dark:text-white'
            : 'text-[#c2c2c2]'
        }`}
      >
        Find & Attach
      </button>
    </div>
  );
}

function mockGenerate(type, prompt) {
  const lower = (prompt || '').toLowerCase();
  if (type === 'tasks') {
    if (lower.includes('resume') || lower.includes('linkedin')) {
      return {
        id: `gen-task-${Date.now()}`,
        title: 'Update Resume and LinkedIn Profile',
        description: 'Refresh headline, summary, and recent projects.',
        priority: 'MEDIUM',
        status: 'to do',
        statusUppercase: true,
        source: 'ai',
        due: 'Tomorrow',
      };
    }
    return {
      id: `gen-task-${Date.now()}`,
      title: 'Exercise Routine',
      description: 'Follow your fitness routine or do a workout session.',
      priority: 'URGENT',
      status: 'to do',
      statusUppercase: true,
      source: 'ai',
      due: 'May 12, 2026',
      overdueDays: 2,
    };
  }
  if (lower.includes('meditat') || lower.includes('mindful')) {
    return {
      id: `gen-habit-${Date.now()}`,
      title: 'Meditate',
      description: 'Practice mindfulness for mental clarity',
      stats: [{ label: 'Today' }],
      source: 'ai',
    };
  }
  return {
    id: `gen-habit-${Date.now()}`,
    title: 'Drink Water',
    description: 'Stay hydrated throughout the day',
    stats: [{ label: 'Today' }],
    todayProgress: { done: 0, total: 2 },
    source: 'ai',
  };
}

/**
 * Spark on Linked Tasks / Habits — New Task / New Habit window:
 * 1) AI Generation (mock until backend)
 * 2) Find & Attach → GET /api/v1/tasks | /habits
 */
export default function GoalSparkLinkModal({
  open,
  type = 'tasks',
  goalTitle,
  onClose,
  onGenerate,
  onAttach,
  excludeIds = [],
  initialTab = 'find',
}) {
  const isTasks = type === 'tasks';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [aiPhase, setAiPhase] = useState('input');
  const [aiPrompt, setAiPrompt] = useState('');
  const [generated, setGenerated] = useState(null);
  const [selected, setSelected] = useState([]);
  const [listOpen, setListOpen] = useState(true);
  const [options, setOptions] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState(null);

  const phrases = isTasks ? AI_TASK_PHRASES : AI_HABIT_PHRASES;
  const title = isTasks ? 'New Task' : 'New Habit';
  const findLabel = isTasks ? 'Linked Tasks' : 'Linked Habits';
  const findPlaceholder = isTasks ? 'Select Tasks' : 'Select Habits';
  const excludeKey = (excludeIds || []).join(',');

  useEffect(() => {
    if (!open) return undefined;

    let cancelled = false;
    setListLoading(true);
    setListError(null);

    (async () => {
      try {
        // GET /api/v1/tasks|habits — Find & Attach (no goalId; that filters already-linked)
        const data = isTasks ? await fetchTasksForLinkApi() : await fetchHabitsForLinkApi();
        if (cancelled) return;
        const excluded = new Set(excludeIds);
        setOptions(
          orderedLinkPickerOptions(normalizeLinkPickerOptions(data)).filter(
            (o) => !excluded.has(o.id),
          ),
        );
      } catch (err) {
        if (cancelled) return;
        setOptions([]);
        setListError(
          err?.response?.data?.message ||
            `Failed to load ${isTasks ? 'tasks' : 'habits'}`,
        );
      } finally {
        if (!cancelled) setListLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- excludeKey stands in for excludeIds
  }, [open, type, isTasks, excludeKey]);

  if (!open) return null;

  const canGenerate = aiPrompt.trim().length > 0;
  const canAttach = selected.length > 0;
  const selectedItems = options.filter((o) => selected.includes(o.id));

  const handleClose = () => {
    onClose?.();
  };

  const handleGenerate = () => {
    if (!canGenerate) return;
    setAiPhase('generating');
    window.setTimeout(() => {
      setGenerated(mockGenerate(type, aiPrompt));
      setAiPhase('preview');
    }, 700);
  };

  const handleAddGenerated = () => {
    if (!generated) return;
    onGenerate?.(generated);
    handleClose();
  };

  const handleAttach = () => {
    if (!canAttach) return;
    onAttach?.(selected, selectedItems);
    handleClose();
  };

  const toggle = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const inputClasses =
    'w-full rounded-lg border border-[#f2f2f2] bg-white px-3 py-2 text-[12px] text-[#181818] outline-none focus:border-[#8022fe] dark:border-zinc-700 dark:bg-zinc-800 dark:text-white';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className="flex max-h-[90vh] w-full max-w-[450px] flex-col overflow-hidden rounded-2xl border border-[#f2f2f2] bg-[#fcfcfc] dark:border-zinc-700 dark:bg-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#f2f2f2] px-3 py-2.5 dark:border-zinc-700">
          <div>
            <p className="text-[12px] font-medium text-[#5d5d5d] dark:text-gray-300">{title}</p>
            {goalTitle && (
              <p className="mt-0.5 text-[11px] font-medium text-[#a3a3a3] line-clamp-1">{goalTitle}</p>
            )}
          </div>
          <button type="button" onClick={handleClose} aria-label="Close" className="text-[#a3a3a3]">
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-col gap-6 overflow-y-auto p-3">
          <TabToggle activeTab={activeTab} onChange={setActiveTab} />

          {activeTab === 'ai' ? (
            aiPhase === 'generating' ? (
              <div className="flex flex-col gap-2">
                <div className="h-5 w-1/2 animate-pulse rounded-md bg-[#f2f2f2] dark:bg-zinc-700" />
                <div className="h-3 w-full animate-pulse rounded-md bg-[#f2f2f2] dark:bg-zinc-700" />
              </div>
            ) : aiPhase === 'preview' && generated ? (
              <div className="flex flex-col gap-2 rounded-xl border border-[#f2f2f2] bg-white p-3 dark:border-zinc-700 dark:bg-zinc-800">
                <div className="flex items-center gap-1.5">
                  <span className="flex items-center gap-1 rounded-md bg-[#f9f4ff] px-1.5 py-0.5 text-[11px] font-medium text-[#8022fe]">
                    <Sparkles size={10} />
                    AI
                  </span>
                </div>
                <p className="text-[14px] font-medium text-[#181818] dark:text-white">{generated.title}</p>
                <p className="text-[12px] font-medium text-[#a3a3a3]">{generated.description}</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <p className="text-[12px] font-medium text-[#5d5d5d] dark:text-gray-300">
                  Describe what you want to generate
                </p>
                <div className="relative">
                  <textarea
                    rows={5}
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className={`${inputClasses} relative z-10 h-[140px] resize-none rounded-xl bg-transparent!`}
                  />
                  <TypewriterPlaceholder phrases={phrases} visible={!aiPrompt.trim()} />
                </div>
              </div>
            )
          ) : (
            <div className="relative flex flex-col gap-[6px]">
              <p className="text-[12px] font-medium leading-[1.5] text-[#c2c2c2]">{findLabel}</p>
              <button
                type="button"
                onClick={() => setListOpen((v) => !v)}
                className="flex h-[31px] w-full items-center justify-between rounded-[8px] border border-[#f2f2f2] bg-white px-[12px] py-[8px] text-left dark:border-zinc-700 dark:bg-zinc-800"
              >
                <span className="truncate text-[12px] font-medium text-[#c2c2c2]">
                  {selectedItems.length > 0
                    ? selectedItems.map((i) => i.label).join(', ')
                    : findPlaceholder}
                </span>
                <ChevronDown
                  size={12}
                  className={`shrink-0 text-[#a3a3a3] transition-transform ${listOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {listOpen && (
                <div className="max-h-48 overflow-y-auto overflow-x-hidden rounded-[8px] border border-[#f2f2f2] bg-white shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)] dark:border-zinc-700 dark:bg-zinc-800">
                  {listLoading ? (
                    <p className="px-[10px] py-3 text-[12px] font-medium text-[#c2c2c2]">
                      Loading {isTasks ? 'tasks' : 'habits'}…
                    </p>
                  ) : listError ? (
                    <p className="px-[10px] py-3 text-[12px] font-medium text-[#dc2626]">{listError}</p>
                  ) : options.length === 0 ? (
                    <p className="px-[10px] py-3 text-[12px] font-medium text-[#c2c2c2]">
                      No {isTasks ? 'tasks' : 'habits'} available to attach
                    </p>
                  ) : (
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
                    })
                  )}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-2.5">
            {activeTab === 'ai' && aiPhase === 'preview' ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setAiPhase('input');
                    setGenerated(null);
                  }}
                  className="flex flex-1 items-center justify-center rounded-lg bg-[#f2f2f2] px-3 py-2 text-[12px] font-medium text-[#5d5d5d] dark:bg-zinc-700 dark:text-gray-300"
                >
                  Regenerate
                </button>
                <button
                  type="button"
                  onClick={handleAddGenerated}
                  className="flex flex-1 items-center justify-center rounded-lg bg-[#8022fe] px-3 py-2 text-[12px] font-semibold text-white"
                >
                  Add to Goal
                </button>
              </>
            ) : activeTab === 'ai' && aiPhase === 'generating' ? (
              <>
                <button
                  type="button"
                  disabled
                  className="flex flex-1 cursor-not-allowed items-center justify-center rounded-lg bg-[#f2f2f2] px-3 py-2 text-[12px] font-medium text-[#5d5d5d] opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled
                  className="flex flex-1 cursor-not-allowed items-center justify-center rounded-lg bg-[#8022fe] px-3 py-2 text-[12px] font-semibold text-white opacity-60"
                >
                  Generating…
                </button>
              </>
            ) : activeTab === 'ai' ? (
              <>
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex flex-1 items-center justify-center rounded-lg bg-[#f2f2f2] px-3 py-2 text-[12px] font-medium text-[#5d5d5d] dark:bg-zinc-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!canGenerate}
                  onClick={handleGenerate}
                  className={`flex flex-1 items-center justify-center rounded-lg px-3 py-2 text-[12px] font-semibold text-white ${
                    canGenerate ? 'bg-[#8022fe]' : 'cursor-not-allowed bg-[#8022fe]/60'
                  }`}
                >
                  Generate
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex flex-1 items-center justify-center rounded-lg bg-[#f2f2f2] px-3 py-2 text-[12px] font-medium text-[#5d5d5d] dark:bg-zinc-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!canAttach}
                  onClick={handleAttach}
                  className={`flex flex-1 items-center justify-center rounded-lg px-3 py-2 text-[12px] font-semibold text-white ${
                    canAttach ? 'bg-[#8022fe]' : 'cursor-not-allowed bg-[#8022fe]/60'
                  }`}
                >
                  Attach
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
