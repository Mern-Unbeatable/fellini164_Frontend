import { useCallback, useEffect, useRef, useState } from 'react';

const STAGGER_MS = 125;
const INITIAL_DELAY_MS = 400;

/**
 * Step 6 — stagger reveal: title → description → tags (125ms between each).
 * Returns revealStep: 0 = skeleton only, 1 = title, 2 = description, 3 = tags complete.
 */
export function useAiGenerationReveal() {
  const [revealStep, setRevealStep] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const timeoutsRef = useRef([]);

  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const startReveal = useCallback(
    () =>
      new Promise((resolve) => {
        clearTimeouts();
        setIsRevealing(true);
        setRevealStep(0);

        const schedule = (step, delay) => {
          const id = setTimeout(() => setRevealStep(step), delay);
          timeoutsRef.current.push(id);
        };

        schedule(1, INITIAL_DELAY_MS);
        schedule(2, INITIAL_DELAY_MS + STAGGER_MS);
        schedule(3, INITIAL_DELAY_MS + STAGGER_MS * 2);

        const doneId = setTimeout(() => {
          setIsRevealing(false);
          resolve();
        }, INITIAL_DELAY_MS + STAGGER_MS * 2 + STAGGER_MS);
        timeoutsRef.current.push(doneId);
      }),
    [clearTimeouts]
  );

  const resetReveal = useCallback(() => {
    clearTimeouts();
    setRevealStep(0);
    setIsRevealing(false);
  }, [clearTimeouts]);

  useEffect(() => clearTimeouts, [clearTimeouts]);

  return { revealStep, isRevealing, startReveal, resetReveal };
}
