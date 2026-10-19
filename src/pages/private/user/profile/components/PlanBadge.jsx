export default function PlanBadge({ plan }) {
  const normalizedPlan = String(plan || 'FREE').toUpperCase();
  const className =
    normalizedPlan === 'PRO' || normalizedPlan === 'ULTIMATE'
      ? 'bg-[rgba(128,34,254,0.1)] text-[#8022fe] dark:bg-purple-950/40 dark:text-purple-300'
      : normalizedPlan === 'STARTER'
        ? 'bg-[rgba(59,130,246,0.1)] text-[#2563eb] dark:bg-blue-950/40 dark:text-blue-300'
        : 'bg-[rgba(107,114,128,0.12)] text-[#4b5563] dark:bg-zinc-700 dark:text-zinc-300';

  return (
    <span className={`rounded-md px-2.5 py-1 text-[12px] font-semibold ${className}`}>{normalizedPlan}</span>
  );
}
