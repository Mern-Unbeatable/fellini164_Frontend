import { useState } from 'react';
import { X, Clock, Sparkles, Bell, Flag, Hourglass } from 'lucide-react';
import HabitRow from './HabitRow';
import TypewriterPlaceholder from '../../../../../../components/ui/TypewriterPlaceholder';
import { useAiGenerationReveal } from '../../../../../../hooks/useAiGenerationReveal';

const CATEGORIES = [
  'Career',
  'Health',
  'Finance',
  'Fitness',
  'Wellness',
  'Productivity',
  'Personal',
  'Education',
];
const LINKED_GOALS = ['Improve Rate', 'New Job', 'Save $10,000', 'Run 500km'];
const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = ['00', '15', '30', '45'];
const TARGET_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const AI_PROMPT_PHRASES = [
  'Create a habit for updating my portfolio...',
  'Build a daily meditation routine...',
  'Help me drink more water every day...',
  'Set up a habit to read before bed...',
];

const EMPTY_FORM = {
  title: '',
  category: 'Career',
  hour: 8,
  minute: '00',
  period: 'PM',
  targetDays: ['Tue', 'Thu'],
  linkedGoal: 'Improve Rate',
  description: '',
};

function mockGenerateHabit(prompt) {
  const lower = prompt.toLowerCase();
  if (lower.includes('water') || lower.includes('hydrat')) {
    return {
      title: 'Drink Water',
      description: 'Stay hydrated throughout the day',
      category: 'Health',
      tags: [{ label: 'Health' }, { label: 'New Job', icon: Flag }, { label: '12 days left', icon: Hourglass }, { label: '6:30 PM', icon: Bell }],
    };
  }
  if (lower.includes('meditat') || lower.includes('mindful')) {
    return {
      title: 'Meditate',
      description: 'Practice mindfulness for mental clarity',
      category: 'Wellness',
      tags: [{ label: 'Wellness' }, { label: '7:00 AM', icon: Bell }],
    };
  }
  if (lower.includes('read')) {
    return {
      title: 'Read Before Bed',
      description: 'Wind down with a few pages each night',
      category: 'Personal',
      tags: [{ label: 'Personal' }, { label: '9:30 PM', icon: Bell }],
    };
  }
  return {
    title: 'Update LinkedIn Profile',
    description: 'Refresh headline, summary, and recent projects',
    category: 'Career',
    tags: [{ label: 'Career' }, { label: '8:00 PM', icon: Bell }],
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

function TabToggle({ activeTab, onChange, disabled }) {
  return (
    <div className="flex w-full items-center justify-between rounded-[10px] border border-[#f2f2f2] bg-white p-1 dark:border-zinc-700 dark:bg-zinc-800">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange('ai')}
        className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-[12px] font-medium disabled:cursor-default ${
          activeTab === 'ai' ? 'bg-[#f9f4ff] text-[#8022fe]' : 'text-[#c2c2c2]'
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
          activeTab === 'manual' ? 'bg-[#f2f2f2] text-[#181818] dark:bg-zinc-700 dark:text-white' : 'text-[#c2c2c2]'
        }`}
      >
        Manual
      </button>
    </div>
  );
}

function ManualFormFields({ form, update }) {
  const toggleDay = (day) => {
    update(
      'targetDays',
      form.targetDays.includes(day) ? form.targetDays.filter((d) => d !== day) : [...form.targetDays, day]
    );
  };

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
        <Field label="Category">
          <select value={form.category} onChange={(e) => update('category', e.target.value)} className={inputClasses}>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="Reminder Time">
          <div className="flex items-center gap-1 rounded-lg border border-[#f2f2f2] bg-white px-2 py-2 dark:border-zinc-700 dark:bg-zinc-800">
            <select
              value={form.hour}
              onChange={(e) => update('hour', Number(e.target.value))}
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
              value={form.minute}
              onChange={(e) => update('minute', e.target.value)}
              className="w-8 appearance-none bg-transparent text-[12px] text-[#181818] outline-none dark:text-white"
            >
              {MINUTES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={form.period}
              onChange={(e) => update('period', e.target.value)}
              className="ml-auto appearance-none bg-transparent text-[12px] text-[#181818] outline-none dark:text-white"
            >
              <option>AM</option>
              <option>PM</option>
            </select>
            <Clock size={12} className="shrink-0 text-[#a3a3a3]" />
          </div>
        </Field>
      </div>

      <Field label="Target Days">
        <div className="flex w-max flex-wrap gap-1.5">
          {TARGET_DAYS.map((day) => {
            const selected = form.targetDays.includes(day);
            return (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={`flex w-11 items-center justify-center rounded-lg border px-2 py-2 text-[12px] font-medium ${
                  selected
                    ? 'border-[#8022fe] bg-[#f9f4ff] text-[#8022fe]'
                    : 'border-[#f2f2f2] text-[#181818] dark:border-zinc-700 dark:text-white'
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="Linked Goal">
        <select value={form.linkedGoal} onChange={(e) => update('linkedGoal', e.target.value)} className={inputClasses}>
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

export default function NewHabitsModal({ open, onClose, onSave }) {
  const [activeTab, setActiveTab] = useState('ai');
  const [aiPhase, setAiPhase] = useState('input');
  const [aiPrompt, setAiPrompt] = useState('');
  const [changeRequest, setChangeRequest] = useState('');
  const [generatedHabit, setGeneratedHabit] = useState(null);
  const { isRevealing, startReveal } = useAiGenerationReveal();
  const [form, setForm] = useState(EMPTY_FORM);

  if (!open) return null;

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const runAiGeneration = async (prompt) => {
    setAiPhase('generating');
    setChangeRequest('');
    await startReveal();
    setGeneratedHabit(mockGenerateHabit(prompt));
    setAiPhase('preview');
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

  const handleClose = () => {
    setActiveTab('ai');
    setAiPhase('input');
    setAiPrompt('');
    setChangeRequest('');
    setGeneratedHabit(null);
    setForm(EMPTY_FORM);
    onClose();
  };

  const handleManualSubmit = () => {
    onSave({
      title: form.title,
      description: form.description || 'New habit',
      category: form.category,
      tags: [{ label: form.category }, { label: `${form.hour}:${form.minute} ${form.period}`, icon: Bell }],
      source: 'manual',
    });
    handleClose();
  };

  const handleAddGeneratedToBoard = () => {
    if (!generatedHabit) return;
    onSave({ ...generatedHabit, source: 'ai' });
    handleClose();
  };

  const handleTabChange = (tab) => {
    if (isRevealing) return;
    setActiveTab(tab);
    if (tab === 'ai') setAiPhase(generatedHabit ? 'preview' : 'input');
  };

  const canSubmitManual = form.title.trim().length > 0;
  const canGenerate = aiPrompt.trim().length > 0 && !isRevealing;
  const showAiPreview = activeTab === 'ai' && aiPhase === 'preview';
  const showAiGenerating = activeTab === 'ai' && aiPhase === 'generating';

  // State 3 (AI result preview) widens to fit the real board-row preview; states 1/2 stay compact.
  const modalWidthClass = showAiPreview ? 'max-w-[920px]' : 'max-w-[450px]';

  const previewHabit = generatedHabit && {
    id: 'preview',
    title: generatedHabit.title,
    description: generatedHabit.description,
    tags: generatedHabit.tags,
    status: 'active',
    streak: 0,
    days: Array(7).fill('empty'),
  };

  return (
    <div onClick={handleClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        onClick={(e) => e.stopPropagation()}
        className={`flex w-full flex-col overflow-hidden rounded-2xl border border-[#f2f2f2] bg-[#fcfcfc] transition-all dark:border-zinc-700 dark:bg-zinc-900 ${modalWidthClass}`}
      >
        <div className="flex items-center justify-between border-b border-[#f2f2f2] px-3 py-2.5 dark:border-zinc-700">
          <p className="text-[12px] font-medium text-[#5d5d5d] dark:text-gray-300">New Habit</p>
          <button type="button" onClick={handleClose} className="text-[#5d5d5d] dark:text-gray-300">
            <X size={14} />
          </button>
        </div>

        <div className="flex flex-col gap-6 p-3">
          <TabToggle activeTab={activeTab} onChange={handleTabChange} disabled={isRevealing} />

          {activeTab === 'manual' ? (
            <ManualFormFields form={form} update={update} />
          ) : showAiGenerating ? (
            <div className="flex flex-col gap-2">
              <div className="h-5 w-1/2 animate-pulse rounded-md bg-[#f2f2f2] dark:bg-zinc-700" />
              <div className="h-3 w-full animate-pulse rounded-md bg-[#f2f2f2] dark:bg-zinc-700" />
            </div>
          ) : showAiPreview ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center">
                <div className="w-97 shrink-0" />
                <div className="w-[175px] shrink-0" />
                <div className="flex flex-1 items-center justify-between pr-44">
                  {TARGET_DAYS.map((day) => (
                    <p key={day} className="w-10 text-sm font-medium text-[#5d5d5d] dark:text-gray-300">
                      {day}
                    </p>
                  ))}
                </div>
              </div>
              <HabitRow habit={previewHabit} showMenu={false} />
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-[12px] font-medium text-[#5d5d5d] dark:text-gray-300">Anything to change?</p>
                  <button
                    type="button"
                    onClick={handleUpdatePreview}
                    disabled={!changeRequest.trim()}
                    className={`rounded-md px-2 py-0.5 text-[12px] font-medium ${
                      changeRequest.trim() ? 'bg-[#f9f4ff] text-[#8022fe]' : 'cursor-default bg-[#f9f4ff] text-[#8022fe] opacity-60'
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
                Describe the habit you want to generate
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
            {showAiPreview ? (
              <>
                <button
                  type="button"
                  onClick={handleRegenerate}
                  disabled={isRevealing}
                  className="flex flex-1 items-center justify-center rounded-lg bg-[#f2f2f2] px-3 py-2 text-[12px] font-medium text-[#5d5d5d] disabled:opacity-60 dark:bg-zinc-700 dark:text-gray-300"
                >
                  Regenerate
                </button>
                <button
                  type="button"
                  onClick={handleAddGeneratedToBoard}
                  disabled={isRevealing}
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
                  onClick={handleClose}
                  className="flex flex-1 items-center justify-center rounded-lg bg-[#f2f2f2] px-3 py-2 text-[12px] font-medium text-[#5d5d5d] dark:bg-zinc-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                {activeTab === 'ai' ? (
                  <button
                    type="button"
                    disabled={!canGenerate}
                    onClick={handleGenerate}
                    className={`flex flex-1 items-center justify-center rounded-lg px-3 py-2 text-[12px] font-semibold ${
                      canGenerate ? 'bg-[#8022fe] text-white' : 'cursor-not-allowed bg-[#f1f1f1] text-[#dedede]'
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
                      canSubmitManual ? 'bg-[#8022fe] text-white' : 'cursor-not-allowed bg-[#f1f1f1] text-[#dedede]'
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
