import { UserRound } from 'lucide-react';
import SettingsCard from './SettingsCard';
import PlanBadge from './PlanBadge';

const readOnlyClassName =
  'flex h-10.5 items-center rounded-xl border border-[#f2f2f2] bg-[#f8f8f8] px-3 text-[14px] font-medium text-[#5d5d5d] select-none dark:border-zinc-700 dark:bg-zinc-800/70 dark:text-gray-300';

export default function NormalInfoSection({
  id,
  inputClassName,
  currentPlan,
  fullName,
  email,
  setFullName,
  saving = false,
  canSave = true,
  onSubmit,
}) {
  return (
    <SettingsCard
      as="form"
      id={id}
      onSubmit={onSubmit}
      icon={UserRound}
      title="Profile Info"
      description="Your name and account details"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-[12px] font-medium text-[#5d5d5d] dark:text-gray-300">
            Full Name
          </label>
          <input
            className={inputClassName}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[12px] font-medium text-[#5d5d5d] dark:text-gray-300">
            Email
          </label>
          <div className={readOnlyClassName}>
            <span className="truncate">{email || '—'}</span>
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-[12px] font-medium text-[#5d5d5d] dark:text-gray-300">
            Current Plan
          </label>
          <div className={readOnlyClassName}>
            <PlanBadge plan={currentPlan} />
          </div>
        </div>
      </div>
      <div className="mt-5 flex justify-end">
        <button
          type="submit"
          disabled={saving || !canSave}
          className="rounded-xl bg-[#8022fe] px-4 py-2 text-[13px] font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Info'}
        </button>
      </div>
    </SettingsCard>
  );
}
