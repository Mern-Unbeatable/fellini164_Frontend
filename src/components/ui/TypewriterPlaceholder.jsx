import { useTypewriter } from '../../hooks/useTypewriter';

export default function TypewriterPlaceholder({ phrases, visible = true, className = '' }) {
  const text = useTypewriter(phrases);

  if (!visible) return null;

  return (
    <span
      className={`pointer-events-none absolute inset-0 p-3 text-[12px] font-medium text-[#c2c2c2] ${className}`}
      aria-hidden="true"
    >
      {text}
    </span>
  );
}
