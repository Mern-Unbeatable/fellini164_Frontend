export default function NormalInfoSection({
  inputClassName,
  currentPlan,
  fullName,
  email,
  setFullName,
  saving = false,
  onSubmit,
}) {
  const normalizedPlan = String(currentPlan || 'FREE').toUpperCase();
  const planBadgeClass =
    normalizedPlan === 'PRO' || normalizedPlan === 'ULTIMATE'
      ? 'bg-[rgba(128,34,254,0.1)] text-[#8022fe] dark:bg-purple-950/40 dark:text-purple-300'
      : normalizedPlan === 'STARTER'
        ? 'bg-[rgba(59,130,246,0.1)] text-[#2563eb] dark:bg-blue-950/40 dark:text-blue-300'
        : 'bg-[rgba(107,114,128,0.12)] text-[#4b5563] dark:bg-zinc-700 dark:text-zinc-300';

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-lg border border-[#f2f2f2] bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900"
    >
      <h2 className="text-[16px] font-semibold text-[#181818] dark:text-white">Profile Info</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
   
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
          <div className="flex h-10.5 items-center rounded-xl border border-[#f2f2f2] bg-[#f8f8f8] px-3 select-none dark:border-zinc-700 dark:bg-zinc-800/70">
      
              {email || '—'}
            
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-[12px] font-medium text-[#5d5d5d] dark:text-gray-300">
            Current Plan
          </label>
          <div className="flex h-10.5 items-center rounded-xl border border-[#f2f2f2] bg-[#f8f8f8] px-3 dark:border-zinc-700 dark:bg-zinc-800/70">
            <span className={`rounded-md px-2.5 py-1 text-[12px] font-semibold ${planBadgeClass}`}>
              {normalizedPlan}
            </span>
          </div>
        </div>
        <div />
      </div>
      <div className="mt-5 flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-[#8022fe] px-4 py-2 text-[13px] font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Info'}
        </button>
      </div>
    </form>
  );
}
