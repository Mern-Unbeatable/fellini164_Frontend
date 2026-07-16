/** Gray pulse (default) or purple AI shimmer (Figma Frame 8 Animation). */
export default function SkeletonBar({ className = '', variant = 'default' }) {
  if (variant === 'ai') {
    return (
      <div
        className={`skeleton-ai-shimmer ${className}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className={`animate-pulse rounded-md bg-[#f2f2f2] dark:bg-zinc-700 ${className}`}
      aria-hidden="true"
    />
  );
}
