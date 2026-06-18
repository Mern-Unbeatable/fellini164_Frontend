import { useState } from 'react';
import { X, Calendar, Sparkles } from 'lucide-react';
import TypewriterPlaceholder from '../../../../../../components/ui/TypewriterPlaceholder';

const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];
const CATEGORIES = ['Career', 'Health', 'Finance', 'Personal', 'Education'];
const STATUSES = ['To Do', 'In Progress', 'Done'];
const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = ['00', '15', '30', '45'];
const LINKED_GOALS = ['Improve Rate', 'Save $10,000', 'Run 500km'];

const AI_PROMPT_PHRASES = [
  'Create a task for updating my portfolio...',
  'Plan a weekly workout routine with subtasks...',
  'Draft a task to prepare for my job interview...',
  'Generate a task to review my monthly budget...',
];

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
  linkedGoal: 'Improve Rate',
  description: '',
};

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

function TabToggle({ activeTab, onChange, showTabs }) {
  if (!showTabs) return null;

  return (
    <div className="flex w-full items-center justify-between rounded-[10px] border border-[#f2f2f2] bg-white p-1 dark:border-zinc-700 dark:bg-zinc-800">
      <button
        type="button"
        onClick={() => onChange('ai')}
        className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-[12px] font-medium ${
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
        onClick={() => onChange('manual')}
        className={`flex flex-1 items-center justify-center rounded-md px-2 py-1.5 text-[12px] font-medium ${
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

function ManualFormFields({ form, update }) {
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

      <div className="grid grid-cols-2 gap-2">
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

      <div className="grid grid-cols-2 gap-2">
        <Field label="Due Date">
          <div className="relative">
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => update('dueDate', e.target.value)}
              className={`${inputClasses} pr-8`}
            />
            <Calendar
              size={12}
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[#a3a3a3]"
            />
          </div>
        </Field>
        <Field label="Due Time">
          <div className="flex items-center gap-1 rounded-lg border border-[#f2f2f2] bg-white px-2 py-2 dark:border-zinc-700 dark:bg-zinc-800">
            <select
              value={form.dueHour}
              onChange={(e) => update('dueHour', Number(e.target.value))}
              className="w-7 appearance-none bg-transparent text-[12px] text-[#181818] outline-none dark:text-white"
            >
              {HOURS.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
            <span className="text-[#a3a3a3]">:</span>
            <select
              value={form.dueMinute}
              onChange={(e) => update('dueMinute', e.target.value)}
              className="w-8 appearance-none bg-transparent text-[12px] text-[#181818] outline-none dark:text-white"
            >
              {MINUTES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={form.duePeriod}
              onChange={(e) => update('duePeriod', e.target.value)}
              className="ml-auto appearance-none bg-transparent text-[12px] text-[#181818] outline-none dark:text-white"
            >
              <option>AM</option>
              <option>PM</option>
            </select>
          </div>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-2">
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
          {LINKED_GOALS.map((g, i) => (
            <option key={g} value={g}>
              {i === 0 ? `✦ ${g} (AI recommended)` : g}
            </option>
          ))}
          <option value="__create_new__">+ Create new goal</option>
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
  const isEdit = mode === 'edit';
  const [activeTab, setActiveTab] = useState('ai');
  const [aiPrompt, setAiPrompt] = useState('');

  const [form, setForm] = useState(() => {
    if (isEdit && initialTask) {
      return {
        ...EMPTY_FORM,
        title: initialTask.title || '',
        priority: initialTask.priority
          ? initialTask.priority[0] + initialTask.priority.slice(1).toLowerCase()
          : 'Medium',
        category: initialTask.tags?.[0]?.label || initialTask.category || 'Career',
        description: initialTask.description || '',
        estMinutes: initialTask.tags?.find((t) => t.label?.includes('Min'))?.label?.replace(/\D/g, '') || '',
        linkedGoal: initialTask.tags?.find((t) => t.icon)?.label || 'Improve Rate',
        status: initialTask.status || 'To Do',
      };
    }
    return EMPTY_FORM;
  });

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleManualSubmit = () => {
    onSubmit(form);
    onClose();
  };

  const canSubmitManual = form.title.trim().length > 0;
  const canGenerate = aiPrompt.trim().length > 0;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-[450px] flex-col overflow-hidden rounded-2xl border border-[#f2f2f2] bg-[#fcfcfc] dark:border-zinc-700 dark:bg-zinc-900"
      >
        <div className="flex items-center justify-between border-b border-[#f2f2f2] px-3 py-2.5 dark:border-zinc-700">
          <p className="text-[12px] font-medium text-[#5d5d5d] dark:text-gray-300">
            {isEdit ? 'Edit Task' : 'New Task'}
          </p>
          <button type="button" onClick={onClose} className="text-[#5d5d5d] dark:text-gray-300">
            <X size={14} />
          </button>
        </div>

        <div className="flex flex-col gap-6 p-3">
          {!isEdit && (
            <TabToggle activeTab={activeTab} onChange={setActiveTab} showTabs />
          )}

          {isEdit || activeTab === 'manual' ? (
            <ManualFormFields form={form} update={update} />
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
                  className={`${inputClasses} relative z-10 h-[140px] resize-none rounded-xl bg-transparent`}
                />
                <TypewriterPlaceholder phrases={AI_PROMPT_PHRASES} visible={!aiPrompt.trim()} />
              </div>
            </div>
          )}

          <div className="flex items-center gap-2.5">
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
                Edit
              </button>
            ) : activeTab === 'ai' ? (
              <button
                type="button"
                disabled={!canGenerate}
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
                Add to Board
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
