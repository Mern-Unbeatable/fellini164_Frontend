import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Opens a board's create modal when the URL has `?create=1` (sent by the sidebar
 * Create menu), then strips the param so a refresh doesn't reopen it.
 */
export function useCreateQueryParam(onCreate) {
  const [searchParams, setSearchParams] = useSearchParams();
  const shouldOpen = searchParams.get('create') === '1';
  const onCreateRef = useRef(onCreate);

  useEffect(() => {
    onCreateRef.current = onCreate;
  });

  useEffect(() => {
    if (!shouldOpen) return;
    onCreateRef.current?.();
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete('create');
        return next;
      },
      { replace: true }
    );
  }, [shouldOpen, setSearchParams]);
}
