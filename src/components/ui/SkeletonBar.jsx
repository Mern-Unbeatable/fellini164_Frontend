export default function SkeletonBar({ className = '' }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-[#f2f2f2] dark:bg-zinc-700 ${className}`}
      aria-hidden="true"
    />
  );
}
