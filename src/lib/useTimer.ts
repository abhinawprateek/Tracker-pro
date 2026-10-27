// src/lib/useTimer.ts
'use client';
import { useEffect, useRef, useState } from 'react';

export const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

// Countdown based on wall-clock time, so it stays accurate even when the tab is throttled.
export function useTimer() {
  const [endAt, setEndAt] = useState<number | null>(null);
  const [left, setLeft] = useState(0);
  const doneRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (endAt === null) return;
    const tick = () => {
      const l = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
      setLeft(l);
      if (l === 0) {
        setEndAt(null);
        const cb = doneRef.current;
        doneRef.current = null;
        if (cb) cb();
      }
    };
    tick();
    const id = setInterval(tick, 500);
    return () => clearInterval(id);
  }, [endAt]);

  const start = (seconds: number, onDone?: () => void) => {
    doneRef.current = onDone ?? null;
    setLeft(seconds);
    setEndAt(Date.now() + seconds * 1000);
  };
  const stop = () => {
    doneRef.current = null;
    setEndAt(null);
  };

  return { left, running: endAt !== null, start, stop };
}
