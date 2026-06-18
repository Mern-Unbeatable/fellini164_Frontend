import { useState } from 'react';
import { X, Calendar } from 'lucide-react';

const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];
const CATEGORIES = ['Career', 'Health', 'Finance', 'Personal', 'Education'];
const STATUSES = ['To Do', 'In Progress', 'Done'];
const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = ['00', '15', '30', '45'];
// First item is AI-recommended based on task category, last item lets the user create a new goal.
const LINKED_GOALS = ['Improve Rate', 'Save $10,000', 'Run 500km'];

const EMPTY_FORM = {
  title: '',
  priority: 'Medium',
  category: 'Career',
  dueDate: '',
  dueHour: 9,
  dueMinute: '00',
  duePeriod: 'AM',
  estMinutes: '',
  status: 'To Do',
  linkedGoal: '',
  description: '',
};

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-[12px] font-medium text-[#5d5d5d] dark:text-gray-300">{label}</p>
      {children}
    </div>
  );
}

const inputClasses =
  'w-full rounded-lg border border-[#f2f2f2] px-3 py-2 text-[14px] text-[#181818] outline-none focus:border-[#8022fe] dark:border-zinc-700 dark:bg-zinc-800 dark:text-white';

export default function TaskFormModal({ mode = 'create', initialTask, onClose, onSubmit }) {
  const [form, setForm] = useState(() => {
    if (mode === 'edit' && initialTask) {
      return {
        ...EMPTY_FORM,
        title: initialTask.title || '',
        priority: initialTask.priority
          ? initialTask.priority[0] + initialTask.priority.slice(1).toLowerCase()
          : 'Medium',
        category: initialTask.tags?.[0]?.label || 'Career',
        description: initialTask.description || '',
      };
    }
    return EMPTY_FORM;
  });

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = () => {
    onSubmit(form);
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-md flex-col overflow-y-auto rounded-2xl bg-white dark:bg-zinc-900"
      >
        <div className="flex items-center justify-between p-5 pb-4">
          <p className="text-[16px] font-medium text-[#181818] dark:text-white">
            {mode === 'edit' ? 'Edit Task' : 'New Task'}
          </p>
          <button type="button" onClick={onClose} className="text-[#5d5d5d] dark:text-gray-300">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-4 px-5 pb-5">
          <Field label="Title">
            <input
              type="text"
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="e.g., Exercise Routine"
              className={inputClasses}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
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

          <div className="grid grid-cols-2 gap-4">
            <Field label="Due Date">
              <div className="relative">
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => update('dueDate', e.target.value)}
                  className={`${inputClasses} pr-8`}
                />
                <Calendar
                  size={14}
                  className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[#a3a3a3]"
                />
              </div>
            </Field>
            <Field label="Due Time">
              <div className="flex items-center gap-1 rounded-lg border border-[#f2f2f2] px-2 py-1 dark:border-zinc-700 dark:bg-zinc-800">
                <select
                  value={form.dueHour}
                  onChange={(e) => update('dueHour', Number(e.target.value))}
                  className="w-7 appearance-none bg-transparent text-[14px] text-[#181818] outline-none dark:text-white"
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
                  className="w-8 appearance-none bg-transparent text-[14px] text-[#181818] outline-none dark:text-white"
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
                  className="ml-auto appearance-none bg-transparent text-[14px] text-[#181818] outline-none dark:text-white"
                >
                  <option>AM</option>
                  <option>PM</option>
                </select>
              </div>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Est. Minutes">
              <input
                type="number"
                min="0"
                value={form.estMinutes}
                onChange={(e) => update('estMinutes', e.target.value)}
                placeholder="60"
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
              <option value="">No linked goal</option>
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
              placeholder="Add details"
              className={`${inputClasses} resize-none`}
            />
          </Field>
        </div>

        <div className="flex items-center gap-3 p-5 pt-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-[#f2f2f2] py-2 text-[14px] font-medium text-[#5d5d5d] dark:border-zinc-700 dark:text-gray-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 rounded-lg bg-[#8022fe] py-2 text-[14px] font-medium text-white"
          >
            {mode === 'edit' ? 'Edit' : 'Add to Board'}
          </button>
        </div>
      </div>
    </div>
  );
}
