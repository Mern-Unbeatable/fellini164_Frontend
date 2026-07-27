import { AlertCircle, X } from 'lucide-react';

/**
 * Confirm before permanently deleting a goal.
 */
export default function GoalDeleteConfirmModal({
  open,
  goalTitle,
  submitting = false,
  onClose,
  onConfirm,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="goal-delete-title"
        className="w-full max-w-sm rounded-2xl border border-[#f2f2f2] bg-white p-5 shadow-xl dark:border-zinc-700 dark:bg-zinc-800"
      >
        <div className="flex items-center justify-between border-b border-[#f2f2f2] pb-3 dark:border-zinc-700">
          <div className="flex items-center gap-2 text-[#dc2626]">
            <AlertCircle size={18} className="shrink-0" />
            <h3
              id="goal-delete-title"
              className="text-[14px] font-semibold text-[#181818] dark:text-white"
            >
              Delete Goal
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close"
            className="rounded-lg p-1 text-[#a3a3a3] hover:bg-[#f2f2f2] disabled:opacity-50 dark:hover:bg-zinc-700"
          >
            <X size={16} />
          </button>
        </div>

        <p className="mt-4 text-[13px] font-medium leading-normal text-[#5d5d5d] dark:text-gray-300">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-[#181818] dark:text-white">
            {goalTitle || 'this goal'}
          </span>
          ? This action cannot be undone.
        </p>

        <div className="mt-5 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="h-[31px] rounded-[8px] border border-[#f2f2f2] bg-white px-3 text-[12px] font-medium text-[#5d5d5d] hover:bg-[#fcfcfc] disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={submitting}
            className="h-[31px] rounded-[8px] bg-[#dc2626] px-3 text-[12px] font-medium text-white hover:bg-[#b91c1c] disabled:opacity-60"
          >
            {submitting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
