import { useTypewriter } from '../../hooks/useTypewriter';

// Zero-width space keeps the line box (and the layout below it) from collapsing between phrases.
const EMPTY_LINE_PLACEHOLDER = '\u200B';

export default function TypewriterText({ phrases, className = '', as = 'span' }) {
  const Tag = as;
  const text = useTypewriter(phrases);
  return <Tag className={className}>{text || EMPTY_LINE_PLACEHOLDER}</Tag>;
}
