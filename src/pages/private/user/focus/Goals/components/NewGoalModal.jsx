import { useState, useEffect, useRef } from 'react';
import {
  X,
  Sparkles,
  ChevronDown,
  Calendar,
  MoreHorizontal,
  Flag,
  Plus,
  Check,
} from 'lucide-react';
import TypewriterPlaceholder from '../../../../../../components/ui/TypewriterPlaceholder';
import SkeletonBar from '../../../../../../components/ui/SkeletonBar';
import { useAiGenerationReveal } from '../../../../../../hooks/useAiGenerationReveal';

const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];
const CATEGORIES = ['Career', 'Health', 'Finance', 'Personal', 'Education'];

const AI_PROMPT_PHRASES = [
  'Create a goal for updating my portfolio...',
  'Set a goal to run a half marathon...',
  'Build a savings goal for this year...',
  'Create a goal to learn a new skill...',
];

const TASK_OPTIONS = [
  { id: 'task-1', label: 'Exercise Routine', aiSuggested: true },
  { id: 'task-2', label: 'Deliver message' },
  { id: 'task-3', label: 'Work 3' },
  { id: 'task-4', label: 'Work 3' },
];

const HABIT_OPTIONS = [
  { id: 'habit-1', label: 'Drink Water', aiSuggested: true },
  { id: 'habit-2', label: 'Take Breaks' },
  { id: 'habit-3', label: 'Meditate', status: 'paused' },
  { id: 'habit-4', label: 'Exercise' },
  { id: 'habit-5', label: 'Drink Water 2', status: 'completed' },
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
  description: '',
  linkedTasks: [],
  linkedHabits: [],
};

const FIGMA_PREVIEW_GOAL = {
  priority: 'MEDIUM',
  title: 'Finish the work',
  description: 'Stick to your professional growth plan or engage in a skill-building session.',
  category: 'Career',
  due: 'May 28, 2026',
};

function mockGenerateGoal(prompt) {
  const lower = prompt.toLowerCase();
  if (lower.includes('portfolio') || lower.includes('linkedin') || lower.includes('career') || lower.includes('work')) {
    return { ...FIGMA_PREVIEW_GOAL };
  }
  if (lower.includes('marathon') || lower.includes('fitness') || lower.includes('workout')) {
    return {
      priority: 'URGENT',
      title: 'Fitness Regimen',
      description: 'Adhere to your workout schedule or participate in a fitness class.',
      category: 'Health',
      due: 'May 27, 2026',
    };
  }
  if (lower.includes('savings') || lower.includes('finance') || lower.includes('budget')) {
    return {
      priority: 'MEDIUM',
      title: 'Save $10,000',
      description: 'Build consistent savings habits and track monthly contributions.',
      category: 'Finance',
      due: 'Dec 31, 2026',
    };
  }
  return { ...FIGMA_PREVIEW_GOAL };
}

function formatDueDate(value) {
  if (!value) return '';
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-[6px]">
      <p className="text-[12px] font-medium leading-[1.5] text-[#c2c2c2] dark:text-zinc-500">{label}</p>
      {children}
    </div>
  );
}

const inputClasses =
  'w-full min-h-[31px] rounded-[8px] border border-[#f2f2f2] bg-white px-[12px] py-[8px] text-[12px] font-medium text-[#181818] outline-none placeholder:font-medium placeholder:text-[#c2c2c2] focus:border-[#8022fe] dark:border-zinc-700 dark:bg-zinc-800 dark:text-white';

const textareaClasses =
  'w-full rounded-[12px] border border-[#f2f2f2] bg-white p-[12px] text-[12px] font-medium text-[#181818] outline-none placeholder:font-medium placeholder:text-[#c2c2c2] focus:border-[#8022fe] dark:border-zinc-700 dark:bg-zinc-800 dark:text-white';

function TabToggle({ activeTab, onChange, disabled }) {
  return (
    <div className="flex w-full items-center justify-between rounded-[10px] border border-[#f2f2f2] bg-white p-[4px] dark:border-zinc-700 dark:bg-zinc-800">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange('ai')}
        className={`flex flex-1 items-center justify-center gap-[6px] rounded-[6px] px-[8px] py-[6px] text-[12px] font-medium leading-normal disabled:cursor-default ${
          activeTab === 'ai' ? 'bg-[#f9f4ff] text-[#8022fe]' : 'rounded-[4px] text-[#c2c2c2]'
        }`}
      >
        <Sparkles size={10} />
        AI Generation
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange('manual')}
        className={`flex flex-1 items-center justify-center rounded-[6px] px-[8px] py-[6px] text-[12px] font-medium leading-normal disabled:cursor-default ${
          activeTab === 'manual'
            ? 'bg-[#f2f2f2] text-[#181818] dark:bg-zinc-700 dark:text-white'
            : 'rounded-[4px] text-[#c2c2c2]'
        }`}
      >
        Manual
      </button>
    </div>
  );
}

function OptionBadge({ type }) {
  if (type === 'aiSuggested') {
    return (
      <span className="flex items-center gap-[4px] rounded-[4px] bg-[#f9f4ff] px-[4px] py-px text-[10px] font-medium leading-[1.5] text-[#8022fe]">
        <Sparkles size={8} />
        AI Suggested
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

function LinkedMultiSelect({ label, placeholder, options, selectedIds, onChange, open, onToggle }) {
  const containerRef = useRef(null);
  const selected = options.filter((o) => selectedIds.includes(o.id));

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        if (open) onToggle(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, onToggle]);

  const toggleOption = (id) => {
    onChange(
      selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id]
    );
  };

  const removeTag = (id, e) => {
    e.stopPropagation();
    onChange(selectedIds.filter((x) => x !== id));
  };

  return (
    <div ref={containerRef} className="relative flex flex-col gap-[6px]">
      <p className="text-[12px] font-medium leading-[1.5] text-[#c2c2c2] dark:text-zinc-500">{label}</p>
      <button
        type="button"
        onClick={() => onToggle(!open)}
        className={`flex h-[31px] w-full items-center rounded-[8px] border border-[#f2f2f2] bg-white text-left dark:border-zinc-700 dark:bg-zinc-800 ${
          selected.length > 0 ? 'gap-[16px] px-[6px] py-[8px]' : 'justify-between px-[12px] py-[8px]'
        }`}
      >
        {selected.length === 0 ? (
          <>
            <span className="text-[12px] font-medium leading-normal text-[#c2c2c2]">{placeholder}</span>
            <ChevronDown
              size={8}
              className={`shrink-0 text-[#a3a3a3] transition-transform ${open ? 'rotate-180' : ''}`}
            />
          </>
        ) : (
          <>
            <div className="relative flex min-w-0 flex-1 items-center gap-[4px] overflow-hidden">
              {selected.map((item) => (
                <span
                  key={item.id}
                  className="flex shrink-0 items-center gap-[6px] rounded-[4px] bg-[#f2f2f2] px-[6px] py-[2px] text-[12px] font-medium leading-normal text-[#181818] dark:bg-zinc-700 dark:text-white"
                >
                  {item.label}
                  <button
                    type="button"
                    onClick={(e) => removeTag(item.id, e)}
                    className="text-[#5d5d5d] hover:text-[#181818] dark:hover:text-white"
                    aria-label={`Remove ${item.label}`}
                  >
                    <X size={6} strokeWidth={2.5} />
                  </button>
                </span>
              ))}
              <div className="pointer-events-none absolute inset-y-0 right-0 w-[60px] bg-gradient-to-l from-white to-transparent dark:from-zinc-800" />
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggle(true);
              }}
              className="flex shrink-0 items-center gap-[6px] rounded-[4px] bg-[#f9f4ff] px-[6px] py-[2px] text-[12px] font-medium leading-normal text-[#8022fe]"
            >
              <Plus size={8} strokeWidth={2.5} />
              Add
            </button>
          </>
        )}
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-[8px] border border-[#f2f2f2] bg-white shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)] dark:border-zinc-700 dark:bg-zinc-800">
          {options.map((option) => {
            const checked = selectedIds.includes(option.id);
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => toggleOption(option.id)}
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
  );
}

function AIGeneratedGoalPreviewCard({ goal, revealStep = 3 }) {
  const showTitle = revealStep >= 1;
  const showDescription = revealStep >= 2;
  const showMeta = revealStep >= 3;

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-[16px] border border-[#f2f2f2] bg-[#fcfcfc] dark:border-zinc-700 dark:bg-zinc-800">
      <div className="flex flex-col gap-[10px] p-3">
        <div className="flex flex-col gap-[8px]">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-[4px]">
              {showMeta ? (
                <>
                  <span
                    className={`rounded-[6px] px-[6px] py-[2px] text-[12px] font-medium uppercase leading-[1.5] ${PRIORITY_STYLES[goal.priority]}`}
                  >
                    {PRIORITY_LABELS[goal.priority]}
                  </span>
                  <span className="flex items-center gap-[4px] rounded-[6px] bg-[#f9f4ff] px-[6px] py-[2px] text-[12px] font-medium leading-[1.5] text-[#8022fe]">
                    <Sparkles size={10} />
                    AI
                  </span>
                </>
              ) : (
                <SkeletonBar className="h-[22px] w-24" />
              )}
            </div>
            <MoreHorizontal size={14} className="text-[#a3a3a3]" />
          </div>
          <div className="flex flex-col gap-[4px]">
            {showTitle ? (
              <p className="text-[16px] font-medium leading-[1.5] text-[#181818] dark:text-white">{goal.title}</p>
            ) : (
              <SkeletonBar className="h-6 w-[75%]" />
            )}
            {showDescription ? (
              <p className="overflow-hidden text-ellipsis whitespace-nowrap text-[12px] font-medium leading-[1.5] text-[#a3a3a3]">
                {goal.description}
              </p>
            ) : (
              <SkeletonBar className="h-[18px] w-full" />
            )}
          </div>
        </div>
        {showMeta && (
          <div className="flex items-center gap-[4px]">
            <span className="rounded-[6px] border border-[#f2f2f2] px-[6px] py-[2px] text-[12px] font-medium leading-[1.5] text-[#5d5d5d] dark:border-zinc-700 dark:text-gray-300">
              {goal.category}
            </span>
            <span className="flex items-center gap-[6px] rounded-[6px] border border-[#f2f2f2] px-[6px] py-[2px] text-[12px] font-medium leading-[1.5] text-[#5d5d5d] dark:border-zinc-700 dark:text-gray-300">
              <Flag size={12} className="h-3 w-2 shrink-0" />
              {goal.due}
            </span>
          </div>
        )}
      </div>
      <div className="border-t border-[#f2f2f2] px-3 pt-[10px] pb-[12px] dark:border-zinc-700">
        <div className="flex flex-col gap-[6px]">
          <div className="flex items-center justify-between text-[12px] font-medium leading-[1.5]">
            <span className="text-[#c2c2c2]">Progress</span>
            <span className="text-[#5d5d5d] dark:text-gray-300">0%</span>
          </div>
          <div className="h-[8px] w-full rounded-[40px] bg-[#e9e9e9] dark:bg-zinc-600" />
        </div>
      </div>
    </div>
  );
}

function AiPreviewChangeSection({ changeRequest, onChange, onUpdate }) {
  return (
    <div className="flex w-full flex-col gap-[8px]">
      <div className="flex h-[22px] items-center justify-between">
        <p className="text-[12px] font-medium leading-[1.5] text-[#5d5d5d] dark:text-gray-300">
          Anything to change?
        </p>
        <button
          type="button"
          onClick={onUpdate}
          disabled={!changeRequest.trim()}
          className={`rounded-[6px] px-[8px] py-[2px] text-[12px] font-medium leading-[1.5] ${
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
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type here..."
        className={`${textareaClasses} h-[70px] resize-none`}
      />
    </div>
  );
}

function ManualFormFields({ form, update, tasksOpen, habitsOpen, setTasksOpen, setHabitsOpen }) {
  return (
    <div className="flex flex-col gap-[16px]">
      <Field label="Title">
        <input
          type="text"
          value={form.title}
          onChange={(e) => update('title', e.target.value)}
          placeholder="e.g. Update LinkedIn profile"
          className={inputClasses}
        />
      </Field>

      <div className="grid grid-cols-2 gap-[8px]">
        <Field label="Priority">
          <div className="relative">
            <select
              value={form.priority}
              onChange={(e) => update('priority', e.target.value)}
              className={`${inputClasses} appearance-none pr-8`}
            >
              {PRIORITIES.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
            <ChevronDown
              size={8}
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[#a3a3a3]"
            />
          </div>
        </Field>
        <Field label="Category">
          <div className="relative">
            <select
              value={form.category}
              onChange={(e) => update('category', e.target.value)}
              className={`${inputClasses} appearance-none pr-8`}
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <ChevronDown
              size={8}
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[#a3a3a3]"
            />
          </div>
        </Field>
      </div>

      <Field label="Due Date">
        <div className="relative">
          <input
            type="date"
            value={form.dueDate}
            onChange={(e) => update('dueDate', e.target.value)}
            className={`${inputClasses} pr-8 text-transparent`}
          />
          <span
            className={`pointer-events-none absolute top-1/2 left-[12px] -translate-y-1/2 text-[12px] font-medium ${
              form.dueDate ? 'text-[#181818] dark:text-white' : 'text-[#c2c2c2]'
            }`}
          >
            {form.dueDate ? formatDueDate(form.dueDate) : ''}
          </span>
          <Calendar
            size={12}
            className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[#a3a3a3]"
          />
        </div>
      </Field>

      <LinkedMultiSelect
        label="Linked Tasks"
        placeholder="Select Tasks"
        options={TASK_OPTIONS}
        selectedIds={form.linkedTasks}
        onChange={(ids) => update('linkedTasks', ids)}
        open={tasksOpen}
        onToggle={setTasksOpen}
      />

      <LinkedMultiSelect
        label="Linked Habits"
        placeholder="Select Habits"
        options={HABIT_OPTIONS}
        selectedIds={form.linkedHabits}
        onChange={(ids) => update('linkedHabits', ids)}
        open={habitsOpen}
        onToggle={setHabitsOpen}
      />

      <Field label="Description">
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          placeholder="Add details..."
          className={`${textareaClasses} h-[80px] resize-none`}
        />
      </Field>
    </div>
  );
}

function ModalFooter({
  showAiPreview,
  showAiGenerating,
  activeTab,
  isRevealing,
  canGenerate,
  canSubmitManual,
  onClose,
  onRegenerate,
  onAddGeneratedToBoard,
  onGenerate,
  onManualSubmit,
}) {
  return (
    <div className="flex shrink-0 items-center gap-[10px]">
      {showAiPreview ? (
        <>
          <button
            type="button"
            onClick={onRegenerate}
            disabled={isRevealing}
            className="flex min-h-[31px] flex-1 items-center justify-center rounded-[8px] bg-[#f2f2f2] px-[12px] py-[8px] text-[12px] font-medium leading-normal text-[#5d5d5d] disabled:opacity-60 dark:bg-zinc-700 dark:text-gray-300"
          >
            Regenerate
          </button>
          <button
            type="button"
            onClick={onAddGeneratedToBoard}
            disabled={isRevealing}
            className="flex min-h-[31px] flex-1 items-center justify-center rounded-[8px] bg-[#8022fe] px-[12px] py-[8px] text-[12px] font-semibold leading-normal text-white disabled:opacity-60"
          >
            Add to Board
          </button>
        </>
      ) : showAiGenerating ? (
        <>
          <button
            type="button"
            disabled
            className="flex min-h-[31px] flex-1 cursor-not-allowed items-center justify-center rounded-[8px] bg-[#f2f2f2] px-[12px] py-[8px] text-[12px] font-medium leading-normal text-[#5d5d5d] opacity-60 dark:bg-zinc-700 dark:text-gray-300"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled
            className="flex min-h-[31px] flex-1 cursor-not-allowed items-center justify-center rounded-[8px] bg-[#f1f1f1] px-[12px] py-[8px] text-[12px] font-semibold leading-normal text-[#dedede]"
          >
            Generating...
          </button>
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-[31px] flex-1 items-center justify-center rounded-[8px] bg-[#f2f2f2] px-[12px] py-[8px] text-[12px] font-medium leading-normal text-[#5d5d5d] dark:bg-zinc-700 dark:text-gray-300"
          >
            Cancel
          </button>
          {activeTab === 'ai' ? (
            <button
              type="button"
              disabled={!canGenerate}
              onClick={onGenerate}
              className={`flex min-h-[31px] flex-1 items-center justify-center rounded-[8px] px-[12px] py-[8px] text-[12px] font-semibold leading-normal ${
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
              onClick={onManualSubmit}
              className={`flex min-h-[31px] flex-1 items-center justify-center rounded-[8px] px-[12px] py-[8px] text-[12px] font-semibold leading-normal ${
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
  );
}

export default function NewGoalModal({ open, onClose, onSave }) {
  const [activeTab, setActiveTab] = useState('ai');
  const [aiPhase, setAiPhase] = useState('input');
  const [aiPrompt, setAiPrompt] = useState('');
  const [changeRequest, setChangeRequest] = useState('');
  const [generatedGoal, setGeneratedGoal] = useState(null);
  const [pendingGoal, setPendingGoal] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [tasksOpen, setTasksOpen] = useState(false);
  const [habitsOpen, setHabitsOpen] = useState(false);
  const { revealStep, isRevealing, startReveal, resetReveal } = useAiGenerationReveal();

  const resetState = () => {
    setActiveTab('ai');
    setAiPhase('input');
    setAiPrompt('');
    setChangeRequest('');
    setGeneratedGoal(null);
    setPendingGoal(null);
    setForm(EMPTY_FORM);
    setTasksOpen(false);
    setHabitsOpen(false);
    resetReveal();
  };

  useEffect(() => {
    if (!open) resetState();
  }, [open]);

  if (!open) return null;

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const runAiGeneration = async (prompt) => {
    const goal = mockGenerateGoal(prompt);
    setPendingGoal(goal);
    setAiPhase('generating');
    setChangeRequest('');
    await startReveal();
    setGeneratedGoal(goal);
    setPendingGoal(null);
    setAiPhase('preview');
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleGenerate = () => {
    if (!aiPrompt.trim() || isRevealing) return;
    runAiGeneration(aiPrompt);
  };

  const handleRegenerate = () => {
    if (isRevealing) return;
    runAiGeneration(`${aiPrompt}${Date.now()}`);
  };

  const handleUpdatePreview = () => {
    if (!changeRequest.trim() || isRevealing) return;
    runAiGeneration(`${aiPrompt} ${changeRequest}`);
  };

  const handleAddGeneratedToBoard = () => {
    if (!generatedGoal) return;
    onSave({
      title: generatedGoal.title,
      description: generatedGoal.description,
      priority: generatedGoal.priority,
      category: generatedGoal.category,
      due: generatedGoal.due,
      linkedTasks: [],
      linkedHabits: [],
      source: 'ai',
    });
    handleClose();
  };

  const handleManualSubmit = () => {
    onSave({
      title: form.title,
      description: form.description,
      priority: form.priority.toUpperCase(),
      category: form.category,
      due: form.dueDate ? formatDueDate(form.dueDate) : 'Today',
      linkedTasks: form.linkedTasks,
      linkedHabits: form.linkedHabits,
      source: 'manual',
    });
    handleClose();
  };

  const handleTabChange = (tab) => {
    if (isRevealing) return;
    setActiveTab(tab);
    setTasksOpen(false);
    setHabitsOpen(false);
    if (tab === 'ai') setAiPhase(generatedGoal ? 'preview' : 'input');
  };

  const canSubmitManual = form.title.trim().length > 0;
  const canGenerate = aiPrompt.trim().length > 0 && !isRevealing;
  const showAiPreview = activeTab === 'ai' && aiPhase === 'preview';
  const showAiGenerating = activeTab === 'ai' && aiPhase === 'generating';
  const isAiInput = activeTab === 'ai' && aiPhase === 'input';
  const isAiPreviewState = showAiPreview || showAiGenerating;
  const tabContentGap = isAiInput || isAiPreviewState ? 'mt-[20px]' : 'mt-[24px]';

  const renderBodyContent = () => {
    if (activeTab === 'manual') {
      return (
        <ManualFormFields
          form={form}
          update={update}
          tasksOpen={tasksOpen}
          habitsOpen={habitsOpen}
          setTasksOpen={(next) => {
            setTasksOpen(next);
            if (next) setHabitsOpen(false);
          }}
          setHabitsOpen={(next) => {
            setHabitsOpen(next);
            if (next) setTasksOpen(false);
          }}
        />
      );
    }

    if (showAiGenerating) {
      return <AIGeneratedGoalPreviewCard goal={pendingGoal || generatedGoal || {}} revealStep={revealStep} />;
    }

    if (showAiPreview) {
      return (
        <div className="flex flex-col gap-[16px]">
          <AIGeneratedGoalPreviewCard goal={generatedGoal} />
          <AiPreviewChangeSection
            changeRequest={changeRequest}
            onChange={setChangeRequest}
            onUpdate={handleUpdatePreview}
          />
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-[6px]">
        <p className="text-[12px] font-medium leading-[1.5] text-[#c2c2c2] dark:text-zinc-500">
          Describe the goal you want to generate
        </p>
        <div className="relative">
          <textarea
            rows={5}
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            className={`${textareaClasses} relative z-10 h-[140px] resize-none`}
          />
          <TypewriterPlaceholder phrases={AI_PROMPT_PHRASES} visible={!aiPrompt.trim()} className="p-[12px]" />
        </div>
      </div>
    );
  };

  const modalHeightClass =
    activeTab === 'manual'
      ? 'max-h-[90vh] sm:h-[635px]'
      : showAiPreview
        ? 'sm:h-[474px]'
        : isAiInput
          ? 'sm:h-[336px]'
          : '';

  const contentOverflowClass =
    activeTab === 'manual' ? 'overflow-y-auto' : 'overflow-hidden';

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`flex w-full flex-col overflow-hidden rounded-[16px] border border-[#f2f2f2] bg-[#fcfcfc] dark:border-zinc-700 dark:bg-zinc-900 max-w-[450px] sm:w-[450px] ${modalHeightClass}`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#f2f2f2] px-[12px] py-[10px] dark:border-zinc-700">
          <p className="text-[12px] font-medium leading-[1.5] text-[#5d5d5d] dark:text-gray-300">New Goal</p>
          <button type="button" onClick={handleClose} className="text-[#5d5d5d] dark:text-gray-300">
            <X size={10} strokeWidth={2} />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-[24px] overflow-hidden p-[12px]">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <TabToggle activeTab={activeTab} onChange={handleTabChange} disabled={isRevealing} />
            <div className={`min-h-0 flex-1 ${contentOverflowClass} ${tabContentGap}`}>
              {renderBodyContent()}
            </div>
          </div>

          <ModalFooter
            showAiPreview={showAiPreview}
            showAiGenerating={showAiGenerating}
            activeTab={activeTab}
            isRevealing={isRevealing}
            canGenerate={canGenerate}
            canSubmitManual={canSubmitManual}
            onClose={handleClose}
            onRegenerate={handleRegenerate}
            onAddGeneratedToBoard={handleAddGeneratedToBoard}
            onGenerate={handleGenerate}
            onManualSubmit={handleManualSubmit}
          />
        </div>
      </div>
    </div>
  );
}
