import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { X, Clock, Sparkles } from 'lucide-react';
import HabitRow from './HabitRow';
import TypewriterPlaceholder from '../../../../../../components/ui/TypewriterPlaceholder';
import { useAiGenerationReveal } from '../../../../../../hooks/useAiGenerationReveal';
import { generateHabit, updateHabit } from '../../../../../../features/habits/habitsSlice';
import {
  reminderTimeFromApi,
  targetDaysFromApi,
} from '../../../../../../features/habits/habitsMappers';
import { fetchGoalsApi } from '../../../../../../features/goals/goalsAPI';

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
const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
const PERIODS = ['AM', 'PM'];
const TARGET_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/** UI target days → Mon–Sun cell states for HabitRow preview. */
function daysFromTargetDays(uiDays) {
  const set = new Set(uiDays || []);
  return TARGET_DAYS.map((day) => (set.has(day) ? 'empty' : 'unscheduled'));
}

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
  period: 'AM',
  targetDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  linkedGoal: '__none__',
  description: '',
  difficulty: 'MEDIUM',
};

const TIME_TAG_RE = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i;

function parseReminderParts(reminderTime) {
  const label = reminderTimeFromApi(reminderTime) || reminderTime;
  if (!label) return { hour: 8, minute: '00', period: 'AM' };
  const match = String(label).match(TIME_TAG_RE);
  if (!match) return { hour: 8, minute: '00', period: 'AM' };
  return {
    hour: Number(match[1]),
    minute: match[2],
    period: match[3].toUpperCase(),
  };
}

function formFromHabit(habit) {
  if (!habit) return EMPTY_FORM;

  const tags = Array.isArray(habit.tags) ? habit.tags : [];
  const categoryTag = tags.find((t) => CATEGORIES.includes(t.label));
  const timeTag = tags.find((t) => TIME_TAG_RE.test(t.label || ''));
  const fromApi = habit.reminderTime ? parseReminderParts(habit.reminderTime) : null;

  let hour = fromApi?.hour ?? 8;
  let minute = fromApi?.minute ?? '00';
  let period = fromApi?.period ?? 'AM';
  if (!fromApi && timeTag) {
    const match = timeTag.label.match(TIME_TAG_RE);
    if (match) {
      hour = Number(match[1]);
      minute = match[2];
      period = match[3].toUpperCase();
    }
  }

  const targetDays = Array.isArray(habit.targetDays) && habit.targetDays.length
    ? targetDaysFromApi(habit.targetDays)
    : Array.isArray(habit.days) && habit.days.length === 7
      ? TARGET_DAYS.filter((_, i) => habit.days[i] !== 'unscheduled')
      : [...EMPTY_FORM.targetDays];

  return {
    title: habit.title || '',
    category: habit.category || categoryTag?.label || 'Health',
    hour,
    minute,
    period,
    targetDays: targetDays.length ? targetDays : [...EMPTY_FORM.targetDays],
    linkedGoal: habit.goalId || '__none__',
    description: habit.description || '',
    difficulty: habit.difficulty || 'MEDIUM',
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
          {hour}:{minute} {period}
        </span>
        <Clock size={16} className="shrink-0 text-[#a3a3a3]" />
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

function ManualFormFields({ form, update, goalOptions }) {
  const toggleDay = (day) => {
    update(
      'targetDays',
      form.targetDays.includes(day)
        ? form.targetDays.filter((d) => d !== day)
        : [...form.targetDays, day]
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

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
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
        <Field label="Reminder Time">
          <TimePickerField
            hour={form.hour}
            minute={form.minute}
            period={form.period}
            onChangeHour={(h) => update('hour', h)}
            onChangeMinute={(m) => update('minute', m)}
            onChangePeriod={(p) => update('period', p)}
          />
        </Field>
      </div>

      <Field label="Target Days">
        <div className="grid w-full grid-cols-7 gap-1 sm:gap-1.5">
          {TARGET_DAYS.map((day) => {
            const selected = form.targetDays.includes(day);
            return (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={`flex items-center justify-center rounded-lg px-1 py-2 text-[11px] font-medium sm:text-[12px] ${
                  selected
                    ? 'border-2 border-transparent bg-[#f9f4ff] text-[#8022fe]'
                    : 'border-2 border-[#f2f2f2] text-[#181818] dark:border-zinc-700 dark:text-white'
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </Field>

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

export default function NewHabitsModal({
  open,
  onClose,
  onSave,
  mode = 'create',
  initialHabit = null,
}) {
  const dispatch = useDispatch();
  const isEdit = mode === 'edit';
  const [activeTab, setActiveTab] = useState(isEdit ? 'manual' : 'ai');
  const [aiPhase, setAiPhase] = useState('input');
  const [aiPrompt, setAiPrompt] = useState('');
  const [changeRequest, setChangeRequest] = useState('');
  const [generatedHabit, setGeneratedHabit] = useState(null);
  const [previewTargetDays, setPreviewTargetDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [goalOptions, setGoalOptions] = useState([]);
  const { isRevealing, startReveal } = useAiGenerationReveal();
  const [form, setForm] = useState(() =>
    isEdit && initialHabit ? formFromHabit(initialHabit) : EMPTY_FORM,
  );
  const [addingToBoard, setAddingToBoard] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    let cancelled = false;
    (async () => {
      try {
        const envelope = await fetchGoalsApi({ page: 1, limit: 50, status: 'ACTIVE' });
        const list = Array.isArray(envelope?.data)
          ? envelope.data
          : Array.isArray(envelope?.goals)
            ? envelope.goals
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
  }, [open]);

  if (!open) return null;

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const runAiGeneration = async (prompt) => {
    setAiPhase('generating');
    setChangeRequest('');
    const revealPromise = startReveal();
    const result = await dispatch(
      generateHabit({
        prompt,
        category: form.category || 'Career',
        goalId: form.linkedGoal !== '__none__' ? form.linkedGoal : undefined,
      })
    );
    await revealPromise;
    if (generateHabit.fulfilled.match(result)) {
      const habit = result.payload;
      setGeneratedHabit(habit);
      const fromApi = targetDaysFromApi(habit.targetDays);
      setPreviewTargetDays(fromApi.length ? fromApi : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
      setAiPhase('preview');
      return;
    }
    setAiPhase('input');
  };

  const togglePreviewDay = (day) => {
    setPreviewTargetDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
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

  const handleClose = () => {
    setActiveTab(isEdit ? 'manual' : 'ai');
    setAiPhase('input');
    setAiPrompt('');
    setChangeRequest('');
    setGeneratedHabit(null);
    setPreviewTargetDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
    setAddingToBoard(false);
    setForm(isEdit && initialHabit ? formFromHabit(initialHabit) : EMPTY_FORM);
    onClose();
  };

  const handleManualSubmit = async () => {
    try {
      await Promise.resolve(
        onSave({
          title: form.title,
          description: form.description || 'New habit',
          category: form.category,
          hour: form.hour,
          minute: form.minute,
          period: form.period,
          difficulty: form.difficulty || 'MEDIUM',
          targetDays: form.targetDays,
          linkedGoal: form.linkedGoal,
          goalId: form.linkedGoal !== '__none__' ? form.linkedGoal : undefined,
          source: 'manual',
        }),
      );
      handleClose();
    } catch {
      // Parent handles error UI; keep modal open
    }
  };

  const handleAddGeneratedToBoard = async () => {
    if (!generatedHabit?.id || addingToBoard) return;
    setAddingToBoard(true);
    try {
      const original = targetDaysFromApi(generatedHabit.targetDays || []);
      const daysChanged =
        previewTargetDays.length !== original.length ||
        previewTargetDays.some((d) => !original.includes(d)) ||
        original.some((d) => !previewTargetDays.includes(d));

      // AI often returns Mon–Fri only — user can add Sat/Sun here before board.
      if (daysChanged && previewTargetDays.length > 0) {
        const result = await dispatch(
          updateHabit({
            habitId: generatedHabit.id,
            formData: { targetDays: previewTargetDays },
          })
        );
        if (!updateHabit.fulfilled.match(result)) return;
      }

      await Promise.resolve(
        onSave({ ...generatedHabit, alreadyPersisted: true, source: 'ai' })
      );
      handleClose();
    } finally {
      setAddingToBoard(false);
    }
  };

  const handleTabChange = (tab) => {
    if (isRevealing) return;
    setActiveTab(tab);
    if (tab === 'ai') setAiPhase(generatedHabit ? 'preview' : 'input');
  };

  const canSubmitManual = form.title.trim().length > 0;
  const canGenerate = aiPrompt.trim().length > 0 && !isRevealing;
  const showAiPreview = !isEdit && activeTab === 'ai' && aiPhase === 'preview';
  const showAiGenerating = !isEdit && activeTab === 'ai' && aiPhase === 'generating';

  const modalWidthClass = showAiPreview ? 'max-w-[920px]' : 'max-w-[450px]';

  const previewHabit = generatedHabit && {
    id: generatedHabit.id || 'preview',
    title: generatedHabit.title,
    description: generatedHabit.description,
    tags: generatedHabit.tags?.length
      ? generatedHabit.tags
      : [
          { label: generatedHabit.category || 'Career' },
          ...(generatedHabit.reminderTime
            ? [{ label: reminderTimeFromApi(generatedHabit.reminderTime), iconKey: 'bell' }]
            : []),
        ],
    status: 'active',
    streak: generatedHabit.streak || 0,
    days: daysFromTargetDays(previewTargetDays),
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className={`flex max-h-[90vh] w-full flex-col overflow-hidden rounded-2xl border border-[#f2f2f2] bg-[#fcfcfc] transition-all dark:border-zinc-700 dark:bg-zinc-900 ${modalWidthClass}`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#f2f2f2] px-3 py-2.5 dark:border-zinc-700">
          <p className="text-[12px] font-medium text-[#5d5d5d] dark:text-gray-300">
            {isEdit ? 'Edit Habit' : 'New Habit'}
          </p>
          <button type="button" onClick={handleClose} className="text-[#5d5d5d] dark:text-gray-300">
            <X size={14} />
          </button>
        </div>

        <div className="flex flex-col gap-6 overflow-y-auto p-3">
          {!isEdit && (
            <div className="mx-auto w-full max-w-[430px]">
              <TabToggle activeTab={activeTab} onChange={handleTabChange} disabled={isRevealing} />
            </div>
          )}

          {isEdit || activeTab === 'manual' ? (
            <ManualFormFields form={form} update={update} goalOptions={goalOptions} />
          ) : showAiGenerating ? (
            <div className="flex flex-col gap-2">
              <div className="h-5 w-1/2 animate-pulse rounded-md bg-[#f2f2f2] dark:bg-zinc-700" />
              <div className="h-3 w-full animate-pulse rounded-md bg-[#f2f2f2] dark:bg-zinc-700" />
            </div>
          ) : showAiPreview ? (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2.5 rounded-2xl border border-[#f2f2f2] bg-white p-3 dark:border-zinc-700 dark:bg-zinc-900">
                <div className="flex items-center pl-3 max-lg:hidden">
                  <div className="w-97 shrink-0" />
                  <div className="flex w-115 shrink-0 items-center justify-center gap-5">
                    {TARGET_DAYS.map((day) => (
                      <p
                        key={day}
                        className="w-10 text-center text-sm font-medium text-[#5d5d5d] dark:text-gray-300"
                      >
                        {day}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1 px-3 lg:hidden">
                  {TARGET_DAYS.map((day) => (
                    <p
                      key={day}
                      className="text-center text-[11px] font-medium text-[#5d5d5d] dark:text-gray-300"
                    >
                      {day}
                    </p>
                  ))}
                </div>
                <HabitRow habit={previewHabit} showMenu={false} compact />
              </div>
              <div className="mx-auto flex w-full max-w-[430px] flex-col gap-2">
                <p className="text-[12px] font-medium text-[#c2c2c2] dark:text-zinc-500">
                  Target Days
                </p>
                <div className="grid w-full grid-cols-7 gap-1 sm:gap-1.5">
                  {TARGET_DAYS.map((day) => {
                    const selected = previewTargetDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => togglePreviewDay(day)}
                        className={`flex items-center justify-center rounded-lg px-1 py-2 text-[11px] font-medium sm:text-[12px] ${
                          selected
                            ? 'border-2 border-transparent bg-[#f9f4ff] text-[#8022fe]'
                            : 'border-2 border-[#f2f2f2] text-[#181818] dark:border-zinc-700 dark:text-white'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] font-medium text-[#c2c2c2]">
                  AI often schedules weekdays only — tap Sat / Sun to include weekends.
                </p>
              </div>
              <div className="mx-auto flex w-full max-w-[430px] flex-col gap-2">
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
                Describe the habit you want to generate
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

          <div
            className={`flex items-center gap-2.5 ${showAiPreview ? 'mx-auto w-full max-w-[430px]' : ''}`}
          >
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
                  disabled={isRevealing || addingToBoard || previewTargetDays.length === 0}
                  className="flex flex-1 items-center justify-center rounded-lg bg-[#8022fe] px-3 py-2 text-[12px] font-semibold text-white disabled:opacity-60"
                >
                  {addingToBoard ? 'Adding...' : 'Add to Board'}
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
                {isEdit ? (
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
