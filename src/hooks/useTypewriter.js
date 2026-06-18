import { useEffect, useState } from 'react';

/**
 * Cycles through phrases with type-in → pause → char-by-char delete → next phrase.
 * Used for board subtitles, AI popup placeholders, and chat placeholders.
 */
export function useTypewriter(phrases, { typingDelay = 45, deletingDelay = 30, pauseDelay = 3000, active = true } = {}) {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    if (!active || !phrases?.length) {
      setDisplayText('');
      return undefined;
    }

    let phraseIndex = 0;
    let charIndex = 0;
    let phase = 'typing';
    let timeoutId;

    const currentPhrase = () => phrases[phraseIndex];

    const tick = () => {
      const phrase = currentPhrase();

      if (phase === 'typing') {
        if (charIndex < phrase.length) {
          charIndex += 1;
          setDisplayText(phrase.slice(0, charIndex));
          timeoutId = setTimeout(tick, typingDelay);
        } else {
          phase = 'pausing';
          timeoutId = setTimeout(tick, pauseDelay);
        }
      } else if (phase === 'pausing') {
        phase = 'deleting';
        timeoutId = setTimeout(tick, deletingDelay);
      } else if (phase === 'deleting') {
        if (charIndex > 0) {
          charIndex -= 1;
          setDisplayText(phrase.slice(0, charIndex));
          timeoutId = setTimeout(tick, deletingDelay);
        } else {
          phraseIndex = (phraseIndex + 1) % phrases.length;
          phase = 'typing';
          timeoutId = setTimeout(tick, typingDelay);
        }
      }
    };

    setDisplayText('');
    timeoutId = setTimeout(tick, typingDelay);

    return () => clearTimeout(timeoutId);
  }, [phrases, typingDelay, deletingDelay, pauseDelay, active]);

  return displayText;
}
