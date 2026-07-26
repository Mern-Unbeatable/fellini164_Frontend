import { useEffect, useRef, useState } from 'react';
import { X, Calendar } from 'lucide-react';

function formatDisplayDate(value) {
  if (!value) return 'Select date';
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/** Native date picker field — opens system date picker on click. */
function DatePickerField({ label, value, onChange, inputRef }) {
  const openPicker = () => {
    const input = inputRef?.current;
    if (!input) return;
    if (typeof input.showPicker === 'function') {
      try {
        input.showPicker();
      } catch {
        input.focus();
        input.click();
      }
    } else {
      input.focus();
      input.click();
    }
  };

  return (
    <div className="relative min-w-0 flex-1">
      <p className="mb-1.5 text-[12px] font-medium text-[#C2C2C2]">{label}</p>
      <button
        type="button"
        onClick={openPicker}
        className="flex w-full items-center justify-between gap-2 rounded-[14px] border border-zinc-200 bg-white px-3.5 py-2.5 text-left text-[14px] font-medium text-zinc-800 transition-colors hover:bg-zinc-50"
      >
        <span className={value ? 'text-zinc-800' : 'text-zinc-300'}>{formatDisplayDate(value)}</span>
        <Calendar size={16} className="shrink-0 text-zinc-400" aria-hidden />
      </button>
      <input
        ref={inputRef}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        tabIndex={-1}
        aria-hidden
        className="pointer-events-none absolute top-[calc(100%+4px)] left-0 h-px w-full max-w-[220px] overflow-hidden border-0 p-0 opacity-0"
      />
    </div>
  );
}

export default function NewPlanModal({ open, onClose, onSave, isSubmitting = false }) {
  const [planText, setPlanText] = useState('');
  const [dateRange, setDateRange] = useState('Today');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [error, setError] = useState('');
  const startInputRef = useRef(null);
  const endInputRef = useRef(null);

  const isCustom = dateRange === 'Custom';
  const canSubmit =
    Boolean(planText.trim()) &&
    !isSubmitting &&
    (!isCustom || (Boolean(customStart) && Boolean(customEnd)));

  // When Custom is selected, open the start date picker (client: Custom → Date Picker).
  useEffect(() => {
    if (!open || !isCustom) return undefined;
    const timer = window.setTimeout(() => {
      const input = startInputRef.current;
      if (!input) return;
      if (typeof input.showPicker === 'function') {
        try {
          input.showPicker();
        } catch {
          /* ignore — field still visible for click */
        }
      }
    }, 50);
    return () => window.clearTimeout(timer);
  }, [open, isCustom]);

  useEffect(() => {
    if (!open) return;
    setError('');
  }, [open]);

  if (!open) return null;

  const resetAndClose = () => {
    if (isSubmitting) return;
    setPlanText('');
    setDateRange('Today');
    setCustomStart('');
    setCustomEnd('');
    setError('');
    onClose();
  };

  const handleCreate = async () => {
    if (!planText.trim()) {
      setError('Describe what you want to plan.');
      return;
    }
    if (isCustom && (!customStart || !customEnd)) {
      setError('Select start and end dates for a custom range.');
      return;
    }
    if (isCustom && customStart > customEnd) {
      setError('End date must be on or after the start date.');
      return;
    }

    setError('');
    try {
      await onSave({
        plan: planText.trim(),
        dateRange,
        ...(isCustom
          ? {
              customStart,
              customEnd,
            }
          : {}),
      });
      setPlanText('');
      setDateRange('Today');
      setCustomStart('');
      setCustomEnd('');
      setError('');
    } catch (err) {
      setError(err?.message || 'Failed to create plan. Please try again.');
    }
  };

  const dateOptions = ['Today', 'This Week', 'This Month', 'Custom'];

  const handleSelectDateOption = (option) => {
    setDateRange(option);
    if (option !== 'Custom') {
      setCustomStart('');
      setCustomEnd('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-[500px] rounded-[24px] bg-white p-7 shadow-xl">
        <div className="flex items-center justify-between pb-5">
          <h2 className="text-[17px] font-medium text-zinc-700">New Plan</h2>
          <button
            type="button"
            onClick={resetAndClose}
            className="text-zinc-400 transition-colors hover:text-zinc-600"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        <div className="mb-5">
          <label className="mb-2.5 block text-[13px] font-medium text-[#C2C2C2]">
            What do you want to plan?
          </label>
          <textarea
            value={planText}
            onChange={(e) => setPlanText(e.target.value)}
            placeholder="Need to updating my portfolio..."
            rows="5"
            className="w-full resize-none rounded-[18px] border border-zinc-200 p-4 text-[15px] text-zinc-800 placeholder-zinc-300/90 outline-none focus:border-zinc-300"
          />
        </div>

        <div className="mb-6">
          <label className="mb-2.5 block text-[13px] font-medium text-[#C2C2C2]">
            Date range
          </label>
          <div className="flex flex-wrap gap-2">
            {dateOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleSelectDateOption(option)}
                className={`rounded-[14px] border px-4.5 py-2 text-[14px] font-medium transition-colors ${
                  dateRange === option
                    ? 'bg-primary text-white'
                    : 'border-zinc-200 text-zinc-800 hover:bg-zinc-50'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Custom only — Date Picker (client Q1) */}
          {isCustom && (
            <div className="mt-3 flex flex-col gap-2.5 sm:flex-row sm:gap-3">
              <DatePickerField
                label="Start"
                value={customStart}
                onChange={setCustomStart}
                inputRef={startInputRef}
              />
              <DatePickerField
                label="End"
                value={customEnd}
                onChange={setCustomEnd}
                inputRef={endInputRef}
              />
            </div>
          )}
        </div>

        {error ? (
          <p className="mb-3 text-[13px] font-medium text-red-500" role="alert">
            {error}
          </p>
        ) : null}

        <div className="flex gap-3.5">
          <button
            type="button"
            onClick={resetAndClose}
            disabled={isSubmitting}
            className="flex-1 rounded-[16px] bg-[#F5F5F7] py-3.5 text-[15px] font-medium text-zinc-700 transition-colors hover:bg-zinc-200/80 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreate}
            disabled={!canSubmit}
            className={`flex-1 rounded-[16px] py-3.5 text-[15px] font-medium transition-colors ${
              canSubmit
                ? 'bg-primary text-white'
                : 'cursor-not-allowed bg-[#F5F5F7] text-zinc-300'
            }`}
          >
            {isSubmitting ? 'Creating…' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}
