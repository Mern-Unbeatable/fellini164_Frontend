import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { X, Calendar, Sparkles, Clock, Watch } from 'lucide-react';
import TypewriterPlaceholder from '../../../../../../components/ui/TypewriterPlaceholder';
import SkeletonBar from '../../../../../../components/ui/SkeletonBar';
import { useAiGenerationReveal } from '../../../../../../hooks/useAiGenerationReveal';
import { generateTask } from '../../../../../../features/tasks/tasksSlice';
import { formatTaskDueDateLabel } from '../../../../../../features/tasks/tasksMappers';
import { fetchGoalsApi } from '../../../../../../features/goals/goalsAPI';

const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];
const CATEGORIES = ['Career', 'Health', 'Finance', 'Personal', 'Education'];
const STATUSES = ['To Do', 'In Progress', 'Done'];
const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
const PERIODS = ['AM', 'PM'];

const AI_PROMPT_PHRASES = [
  'Create a task for updating my portfolio...',
  'Plan a weekly workout routine with subtasks...',
  'Draft a task to prepare for my job interview...',
  'Generate a task to review my monthly budget...',
];

const PRIORITY_STYLES = {
  URGENT: 'bg-[rgba(220,38,38,0.05)] text-[#dc2626]',
  HIGH: 'bg-[rgba(249,115,22,0.05)] text-[#f97316]',
  MEDIUM: 'bg-[rgba(202,138,4,0.05)] text-[#ca8a04]',
  LOW: 'bg-[rgba(107,114,128,0.05)] text-[#6b7280]',
};

const PRIORITY_LABELS = {
  URGENT: 'Urgent',
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
};

const EMPTY_FORM = {
  title: '',
  priority: 'Medium',
  category: 'Career',
  dueDate: '',
  dueHour: 9,
  dueMinute: '00',
  duePeriod: 'PM',
  estMinutes: '',
  status: 'To Do',
  linkedGoal: '__none__',
  description: '',
};

function toIsoDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Card due labels ("May 13, 2026", "Today", "Tomorrow") → input[type=date] value. */
function dueLabelToIso(due) {
  if (!due || due === 'No date') return '';
  const lower = String(due).toLowerCase().trim();
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  if (lower === 'today') return toIsoDate(today);
  if (lower === 'tomorrow') {
    const t = new Date(today);
    t.setDate(t.getDate() + 1);
    return toIsoDate(t);
  }
  const parsed = new Date(due);
  if (!Number.isNaN(parsed.getTime())) return toIsoDate(parsed);
  return '';
}

function formFromTask(task) {
  if (!task) return EMPTY_FORM;

  const tags = task.tags || [];
  const category =
    tags.find((t) => CATEGORIES.includes(t.label))?.label ||
    task.category ||
    EMPTY_FORM.category;

  const minTag = tags.find(
    (t) =>
      /min/i.test(t.label || '') ||
      t.icon === 'clock' ||
      t.icon === Clock ||
      t.icon === Watch
  );

  const linkedGoal =
    task.goalId ||
    tags.find((t) => t.linkedGoal)?.label ||
    task.linkedGoal ||
    '__none__';

  const statusKey = String(task.status || '').toLowerCase();
  const statusMap = {
    'to do': 'To Do',
    todo: 'To Do',
    'in progress': 'In Progress',
    done: 'Done',
  };

  const priorityRaw = task.priority || 'MEDIUM';
  const priority =
    priorityRaw[0] + String(priorityRaw).slice(1).toLowerCase();

  return {
    ...EMPTY_FORM,
    title: task.title || '',
    priority: PRIORITIES.includes(priority) ? priority : 'Medium',
    category,
    description: task.description || '',
    estMinutes:
      minTag?.label?.replace(/\D/g, '') ||
      (task.estimatedMinutes != null ? String(task.estimatedMinutes) : '') ||
      (task.estMinutes != null ? String(task.estMinutes) : '') ||
      '',
    linkedGoal,
    status: statusMap[statusKey] || (STATUSES.includes(task.status) ? task.status : 'To Do'),
    dueDate: task.dueDate || dueLabelToIso(task.due || task.dueLabel),
    dueHour: task.dueHour ?? EMPTY_FORM.dueHour,
    dueMinute: task.dueMinute ?? EMPTY_FORM.dueMinute,
    duePeriod: task.duePeriod ?? EMPTY_FORM.duePeriod,
  };
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-[12px] font-medium text-[#c2c2c2] dark:text-zinc-500">{label}</p>
      {children}
    </div>
  );
}

const inputClasses =
  'w-full rounded-lg border border-[#f2f2f2] bg-white px-3 py-2 text-[12px] text-[#181818] outline-none focus:border-[#8022fe] dark:border-zinc-700 dark:bg-zinc-800 dark:text-white';

function TabToggle({ activeTab, onChange, showTabs, disabled }) {
  if (!showTabs) return null;

  return (
    <div className="flex w-full items-center justify-between rounded-[10px] border border-[#f2f2f2] bg-white p-1 dark:border-zinc-700 dark:bg-zinc-800">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange('ai')}
        className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-[12px] font-medium disabled:cursor-default ${
          activeTab === 'ai'
            ? 'bg-[#f9f4ff] text-[#8022fe]'
            : 'text-[#c2c2c2]'
        }`}
      >
        <Sparkles size={10} />
        AI Generation
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange('manual')}
        className={`flex flex-1 items-center justify-center rounded-md px-2 py-1.5 text-[12px] font-medium disabled:cursor-default ${
          activeTab === 'manual'
            ? 'bg-[#f2f2f2] text-[#181818] dark:bg-zinc-700 dark:text-white'
            : 'text-[#c2c2c2]'
        }`}
      >
        Manual
      </button>
    </div>
  );
}

function AIGeneratedPreviewCard({ task, revealStep = 3 }) {
  const showTitle = revealStep >= 1;
  const showDescription = revealStep >= 2;
  // Due footer: API dueDate → "Today" / date label (mapper defaults to today if missing)
  const dueLabel =
    formatTaskDueDateLabel(task?.dueDate) || task?.due || 'Today';

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-[#f2f2f2] bg-white dark:border-zinc-700 dark:bg-zinc-800">
      <div className="flex flex-col gap-2.5 p-3">
        <div className="flex items-center gap-1">
          <span
            className={`rounded-md px-1.5 py-0.5 text-[12px] font-medium uppercase ${PRIORITY_STYLES[task.priority]}`}
          >
            {PRIORITY_LABELS[task.priority]}
          </span>
          <span className="flex items-center gap-1 rounded-md bg-[#f9f4ff] px-1.5 py-0.5 text-[12px] font-medium text-[#8022fe]">
            <Sparkles size={10} />
            AI
          </span>
        </div>
        <div className="flex flex-col gap-1">
          {showTitle ? (
            <p className="text-[16px] font-medium text-[#181818] dark:text-white">{task.title}</p>
          ) : (
            <SkeletonBar variant="ai" className="h-5 w-[75%] rounded-[8px]" />
          )}
          {showDescription ? (
            <p className="overflow-hidden text-ellipsis text-[12px] whitespace-nowrap text-[#a3a3a3]">
              {task.description}
            </p>
          ) : (
            <SkeletonBar variant="ai" className="h-3 w-full rounded-[5px]" />
          )}
        </div>
        {/* Rule 6: category + time stay visible (not skeletonized) during generate */}
        <div className="flex items-center gap-1">
          <span className="rounded-md border border-[#f2f2f2] px-1.5 py-0.5 text-[12px] font-medium text-[#5d5d5d] dark:border-zinc-700 dark:text-gray-300">
            {task.category}
          </span>
          {task.estMinutes != null && (
            <span className="flex items-center gap-1.5 rounded-md border border-[#f2f2f2] px-1.5 py-0.5 text-[12px] font-medium text-[#5d5d5d] dark:border-zinc-700 dark:text-gray-300">
              <Clock size={12} />
              {task.estMinutes} Min
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center border-t border-[#f2f2f2] px-3 py-2.5 dark:border-zinc-700">
        <p className="text-[12px]">
          <span className="text-[#c2c2c2]">Due:</span>{' '}
          <span className="text-[#5d5d5d]">{dueLabel}</span>
        </p>
      </div>
    </div>
  );
}

function TimeColumn({ values, selected, onSelect, showDivider }) {
  const listRef = useRef(null);

  useEffect(() => {
    const selectedEl = listRef.current?.querySelector('[data-selected="true"]');
    selectedEl?.scrollIntoView({ block: 'center' });
  }, []);

  return (
    <div
      className={`flex h-32 w-12 flex-col gap-0.5 overflow-y-auto scrollbar-hidden ${
        showDivider ? 'border-l border-[#f2f2f2] dark:border-zinc-700' : ''
      }`}
    >
      <div ref={listRef} className="flex flex-col gap-0.5 px-0.5">
        {values.map((v) => {
          const isSelected = v === selected;
          return (
            <button
              key={v}
              type="button"
              data-selected={isSelected}
              onClick={() => onSelect(v)}
              className={`shrink-0 rounded-md px-2 py-1.5 text-center text-[12px] font-medium ${
                isSelected
                  ? 'bg-[#f9f4ff] text-[#8022fe]'
                  : 'text-[#5d5d5d] hover:bg-[#f2f2f2] dark:text-gray-300 dark:hover:bg-zinc-700'
              }`}
            >
              {v}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TimePickerField({ hour, minute, period, onChangeHour, onChangeMinute, onChangePeriod }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`${inputClasses} flex items-center justify-between gap-1.5 text-left`}
      >
        <span>
          {minute === '00' ? `${hour} ${period}` : `${hour}:${minute} ${period}`}
        </span>
        <Watch size={16} className="shrink-0 text-[#a3a3a3]" />
      </button>

      {open && (
        <div className="absolute top-full left-0 z-20 mt-1 flex items-start gap-1 rounded-lg border border-[#f2f2f2] bg-white p-1.5 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.06)] dark:border-zinc-700 dark:bg-zinc-800">
          <TimeColumn values={HOURS} selected={hour} onSelect={onChangeHour} />
          <TimeColumn values={MINUTES} selected={minute} onSelect={onChangeMinute} showDivider />
          <TimeColumn values={PERIODS} selected={period} onSelect={onChangePeriod} showDivider />
        </div>
      )}
    </div>
  );
}

function ManualFormFields({ form, update, goalOptions = [] }) {
  const dateInputRef = useRef(null);

  return (
    <div className="flex flex-col gap-4">
      <Field label="Title">
        <input
          type="text"
          value={form.title}
          onChange={(e) => update('title', e.target.value)}
          placeholder="e.g. Update LinkedIn profile"
          className={inputClasses}
        />
      </Field>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Field label="Priority">
          <select
            value={form.priority}
            onChange={(e) => update('priority', e.target.value)}
            className={inputClasses}
          >
            {PRIORITIES.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </Field>
        <Field label="Category">
          <select
            value={form.category}
            onChange={(e) => update('category', e.target.value)}
            className={inputClasses}
          >
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Field label="Due Date">
          <div
            className="relative cursor-pointer"
            onClick={() => dateInputRef.current?.showPicker?.()}
          >
            <input
              ref={dateInputRef}
              type="date"
              value={form.dueDate}
              onChange={(e) => update('dueDate', e.target.value)}
              className={`${inputClasses} cursor-pointer pr-8 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-8 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0`}
            />
            <Calendar
              size={16}
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[#a3a3a3]"
            />
          </div>
        </Field>
        <Field label="Due Time">
          <TimePickerField
            hour={form.dueHour}
            minute={form.dueMinute}
            period={form.duePeriod}
            onChangeHour={(h) => update('dueHour', h)}
            onChangeMinute={(m) => update('dueMinute', m)}
            onChangePeriod={(p) => update('duePeriod', p)}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Field label="Est. Minutes">
          <input
            type="number"
            value={form.estMinutes}
            onChange={(e) => update('estMinutes', e.target.value)}
            placeholder="e.g. 45"
            className={inputClasses}
          />
        </Field>
        <Field label="Status">
          <select
            value={form.status}
            onChange={(e) => update('status', e.target.value)}
            className={inputClasses}
          >
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Linked Goal">
        <select
          value={form.linkedGoal}
          onChange={(e) => update('linkedGoal', e.target.value)}
          className={inputClasses}
        >
          <option value="__none__">No linked goal</option>
          {goalOptions.map((g) => (
            <option key={g.id} value={g.id}>
              {g.title}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Description">
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          placeholder="Add details..."
          className={`${inputClasses} resize-none rounded-xl`}
        />
      </Field>
    </div>
  );
}

export default function TaskFormModal({ mode = 'create', initialTask, onClose, onSubmit }) {
  const dispatch = useDispatch();
  const isEdit = mode === 'edit';
  const [activeTab, setActiveTab] = useState(isEdit ? 'manual' : 'ai');
  const [aiPhase, setAiPhase] = useState('input');
  const [aiPrompt, setAiPrompt] = useState('');
  const [changeRequest, setChangeRequest] = useState('');
  const [generatedTask, setGeneratedTask] = useState(null);
  const [pendingTask, setPendingTask] = useState(null);
  const [goalOptions, setGoalOptions] = useState([]);
  const [addingToBoard, setAddingToBoard] = useState(false);
  const { revealStep, isRevealing, startReveal } = useAiGenerationReveal();

  const [form, setForm] = useState(() => (isEdit && initialTask ? formFromTask(initialTask) : EMPTY_FORM));

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const envelope = await fetchGoalsApi({ page: 1, limit: 50, status: 'ACTIVE' });
        const list = Array.isArray(envelope?.goals)
          ? envelope.goals
          : Array.isArray(envelope?.data)
            ? envelope.data
            : Array.isArray(envelope)
              ? envelope
              : [];
        if (!cancelled) {
          setGoalOptions(
            list
              .filter((g) => g?.id)
              .map((g) => ({ id: g.id, title: g.title || 'Untitled goal' }))
          );
        }
      } catch {
        if (!cancelled) setGoalOptions([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const runAiGeneration = async (prompt) => {
    setPendingTask({
      priority: 'MEDIUM',
      title: '',
      description: '',
      category: form.category || 'Career',
      estMinutes: 30,
      due: 'Today',
    });
    setAiPhase('generating');
    setChangeRequest('');
    const revealPromise = startReveal();
    const result = await dispatch(
      generateTask({
        prompt,
        category: form.category || 'Career',
        goalId: form.linkedGoal !== '__none__' ? form.linkedGoal : undefined,
      })
    );
    await revealPromise;
    if (generateTask.fulfilled.match(result)) {
      const task = result.payload;
      setGeneratedTask({
        ...task,
        priority: task.priority || 'MEDIUM',
        category: task.category || form.category || 'Career',
        estMinutes: task.estimatedMinutes ?? task.estMinutes ?? 30,
        dueDate: task.dueDate || null,
        dueTime: task.dueTime || null,
        due: formatTaskDueDateLabel(task.dueDate) || task.due || null,
      });
      setPendingTask(null);
      setAiPhase('preview');
      return;
    }
    setPendingTask(null);
    setAiPhase('input');
  };

  const handleManualSubmit = async () => {
    try {
      await Promise.resolve(
        onSubmit({
          ...form,
          goalId: form.linkedGoal !== '__none__' ? form.linkedGoal : null,
          source: 'manual',
        })
      );
      onClose();
    } catch {
      // Parent handles error UI; keep modal open
    }
  };

  const handleGenerate = () => {
    if (!aiPrompt.trim() || isRevealing) return;
    runAiGeneration(aiPrompt);
  };

  const handleRegenerate = () => {
    if (isRevealing) return;
    runAiGeneration(aiPrompt);
  };

  const handleUpdatePreview = () => {
    if (!changeRequest.trim() || isRevealing) return;
    runAiGeneration(`${aiPrompt} ${changeRequest}`);
  };

  const handleAddGeneratedToBoard = async () => {
    if (!generatedTask?.id || addingToBoard) return;
    setAddingToBoard(true);
    try {
      await Promise.resolve(
        onSubmit({ ...generatedTask, alreadyPersisted: true, source: 'ai' })
      );
      onClose();
    } finally {
      setAddingToBoard(false);
    }
  };

  const canSubmitManual = form.title.trim().length > 0;
  const canGenerate = aiPrompt.trim().length > 0 && !isRevealing;
  const showAiPreview = !isEdit && activeTab === 'ai' && aiPhase === 'preview';
  const showAiGenerating = !isEdit && activeTab === 'ai' && aiPhase === 'generating';
  const aiBusy = isRevealing || addingToBoard;

  const handleTabChange = (tab) => {
    if (aiBusy) return;
    setActiveTab(tab);
    if (tab === 'ai') {
      setAiPhase(generatedTask ? 'preview' : 'input');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-112.5 flex-col overflow-hidden rounded-2xl border border-[#f2f2f2] bg-[#fcfcfc] dark:border-zinc-700 dark:bg-zinc-900"
      >
        <div className="flex items-center justify-between border-b border-[#f2f2f2] px-3 py-2.5 dark:border-zinc-700">
          <p className="text-[12px] font-medium text-[#5d5d5d] dark:text-gray-300">
            {isEdit ? 'Edit Task' : 'New Task'}
          </p>
          <button type="button" onClick={onClose} className="text-[#5d5d5d] dark:text-gray-300">
            <X size={14} />
          </button>
        </div>

        <div className="scrollbar-hidden flex flex-col gap-6 overflow-y-auto p-3">
          {!isEdit && (
            <TabToggle
              activeTab={activeTab}
              onChange={handleTabChange}
              showTabs
              disabled={aiBusy}
            />
          )}

          {isEdit || activeTab === 'manual' ? (
            <ManualFormFields form={form} update={update} goalOptions={goalOptions} />
          ) : showAiGenerating ? (
            <AIGeneratedPreviewCard task={pendingTask} revealStep={revealStep} />
          ) : showAiPreview ? (
            <div className="flex flex-col gap-4">
              <AIGeneratedPreviewCard task={generatedTask} />
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-[12px] font-medium text-[#5d5d5d] dark:text-gray-300">
                    Anything to change?
                  </p>
                  <button
                    type="button"
                    onClick={handleUpdatePreview}
                    disabled={!changeRequest.trim()}
                    className={`rounded-md px-2 py-0.5 text-[12px] font-medium ${
                      changeRequest.trim()
                        ? 'bg-[#f9f4ff] text-[#8022fe]'
                        : 'cursor-default bg-[#f9f4ff] text-[#8022fe] opacity-60'
                    }`}
                  >
                    Update
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={changeRequest}
                  onChange={(e) => setChangeRequest(e.target.value)}
                  placeholder="Type here..."
                  className={`${inputClasses} h-[70px] resize-none rounded-xl`}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-[12px] font-medium text-[#5d5d5d] dark:text-gray-300">
                Describe the task you want to generate
              </p>
              <div className="relative">
                <textarea
                  rows={5}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className={`${inputClasses} relative z-10 h-[140px] resize-none rounded-xl bg-transparent!`}
                />
                <TypewriterPlaceholder phrases={AI_PROMPT_PHRASES} visible={!aiPrompt.trim()} />
              </div>
            </div>
          )}

          <div className="flex items-center gap-2.5">
            {showAiPreview ? (
              <>
                <button
                  type="button"
                  onClick={handleRegenerate}
                  disabled={aiBusy}
                  className="flex flex-1 items-center justify-center rounded-lg bg-[#f2f2f2] px-3 py-2 text-[12px] font-medium text-[#5d5d5d] disabled:opacity-60 dark:bg-zinc-700 dark:text-gray-300"
                >
                  Regenerate
                </button>
                <button
                  type="button"
                  onClick={handleAddGeneratedToBoard}
                  disabled={aiBusy || addingToBoard}
                  className="flex flex-1 items-center justify-center rounded-lg bg-[#8022fe] px-3 py-2 text-[12px] font-semibold text-white disabled:opacity-60"
                >
                  Add to Board
                </button>
              </>
            ) : showAiGenerating ? (
              <>
                <button
                  type="button"
                  disabled
                  className="flex flex-1 cursor-not-allowed items-center justify-center rounded-lg bg-[#f2f2f2] px-3 py-2 text-[12px] font-medium text-[#5d5d5d] opacity-60 dark:bg-zinc-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled
                  className="flex flex-1 cursor-not-allowed items-center justify-center rounded-lg bg-[#f1f1f1] px-3 py-2 text-[12px] font-semibold text-[#dedede]"
                >
                  Generating...
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex flex-1 items-center justify-center rounded-lg bg-[#f2f2f2] px-3 py-2 text-[12px] font-medium text-[#5d5d5d] dark:bg-zinc-700 dark:text-gray-300"
                >
                  Cancel
                </button>

                {isEdit ? (
                  <button
                    type="button"
                    onClick={handleManualSubmit}
                    className="flex flex-1 items-center justify-center rounded-lg bg-[#8022fe] px-3 py-2 text-[12px] font-semibold text-white"
                  >
                    Update
                  </button>
                ) : activeTab === 'ai' ? (
                  <button
                    type="button"
                    disabled={!canGenerate}
                    onClick={handleGenerate}
                    className={`flex flex-1 items-center justify-center rounded-lg px-3 py-2 text-[12px] font-semibold ${
                      canGenerate
                        ? 'bg-[#8022fe] text-white'
                        : 'cursor-not-allowed bg-[#f1f1f1] text-[#dedede]'
                    }`}
                  >
                    Generate
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={!canSubmitManual}
                    onClick={handleManualSubmit}
                    className={`flex flex-1 items-center justify-center rounded-lg px-3 py-2 text-[12px] font-semibold ${
                      canSubmitManual
                        ? 'bg-[#8022fe] text-white'
                        : 'cursor-not-allowed bg-[#f1f1f1] text-[#dedede]'
                    }`}
                  >
                    Create
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
