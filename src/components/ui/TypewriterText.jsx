import { useTypewriter } from '../../hooks/useTypewriter';

export default function TypewriterText({ phrases, className = '', as: Tag = 'span' }) {
  const text = useTypewriter(phrases);
  return <Tag className={className}>{text}</Tag>;
}
