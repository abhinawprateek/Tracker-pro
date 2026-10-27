// src/lib/useStudyPlan.ts
'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { PLAN_VERSION, StudyDay, studyPlan } from './StudyPlan';
import { useAppStore } from '../context/StoreContext';

const KEY = 'prodStudyPlanV1';

// Local calendar date as YYYY-MM-DD (toISOString would use UTC and be a day off in India before 5:30 AM).
export const localISO = (d = new Date()) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));

export function useStudyPlan() {
  const { logTimeSpent } = useAppStore();
  const [plan, setPlan] = useState<StudyDay[]>(clone(studyPlan));
  const [isLoaded, setIsLoaded] = useState(false);
  const [today, setToday] = useState('');

  useEffect(() => {
    setToday(localISO());
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved?.version === PLAN_VERSION && Array.isArray(saved.plan)) {
          setPlan(saved.plan);
          setIsLoaded(true);
          return;
        }
      }
      localStorage.setItem(KEY, JSON.stringify({ version: PLAN_VERSION, plan: studyPlan }));
    } catch {
      // Storage unavailable: the plan still works for this session.
    }
    setIsLoaded(true);
  }, []);

  const persist = (next: StudyDay[]) => {
    setPlan(next);
    try {
      localStorage.setItem(KEY, JSON.stringify({ version: PLAN_VERSION, plan: next }));
    } catch {
      /* ignore */
    }
  };

  const toggleSession = useCallback(
    (dayNumber: number, sessionId: string) => {
      let delta = 0;
      const next = plan.map((day) => {
        if (day.dayNumber !== dayNumber) return day;
        return {
          ...day,
          sessions: day.sessions.map((sess) => {
            if (sess.id !== sessionId) return sess;
            delta = sess.completed ? -sess.minutes : sess.minutes;
            return { ...sess, completed: !sess.completed };
          }),
        };
      });
      persist(next);
      // Feeds the existing "total hours studied" statistic. Un-ticking removes the same time.
      if (delta !== 0) logTimeSpent(delta);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [plan, logTimeSpent]
  );

  // The plan day that matches today's date, if today falls inside the plan.
  const todayDay = useMemo(() => plan.find((d) => d.date === today), [plan, today]);

  const missedCount = useMemo(() => {
    if (!todayDay) return 0;
    return plan
      .filter((d) => d.date < today)
      .reduce((n, d) => n + d.sessions.filter((x) => !x.completed && !x.carriedOver).length, 0);
  }, [plan, today, todayDay]);

  // Moves unfinished tasks from earlier days to today. Originals are kept (marked) so history is preserved.
  const carryOverMissed = useCallback(() => {
    if (!todayDay) return;
    const moved = plan
      .filter((d) => d.date < today)
      .flatMap((d) => d.sessions.filter((x) => !x.completed && !x.carriedOver));
    if (moved.length === 0) return;
    const movedIds = new Set(moved.map((m) => m.id));
    const next = plan.map((d) => {
      if (d.date < today) {
        return { ...d, sessions: d.sessions.map((x) => (movedIds.has(x.id) ? { ...x, carriedOver: true } : x)) };
      }
      if (d.dayNumber === todayDay.dayNumber) {
        const copies = moved.map((m) => ({ ...m, id: `${m.id}_cf`, completed: false, carriedOver: false }));
        return { ...d, sessions: [...d.sessions, ...copies] };
      }
      return d;
    });
    persist(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan, today, todayDay]);

  const resetPlan = useCallback(() => {
    persist(clone(studyPlan));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = useMemo(() => {
    const active = plan.flatMap((d) => d.sessions.filter((x) => !x.carriedOver));
    const total = active.length;
    const done = active.filter((x) => x.completed).length;
    const totalMinutes = active.reduce((n, x) => n + x.minutes, 0);
    const doneMinutes = active.filter((x) => x.completed).reduce((n, x) => n + x.minutes, 0);

    const isDayComplete = (d: StudyDay) => {
      const live = d.sessions.filter((x) => !x.carriedOver);
      return live.length > 0 && live.every((x) => x.completed);
    };

    // Streak: consecutive fully completed days up to today. An unfinished today does not break it.
    let streak = 0;
    const upToToday = plan.filter((d) => d.date <= today).sort((a, b) => (a.date < b.date ? 1 : -1));
    for (const d of upToToday) {
      if (isDayComplete(d)) streak++;
      else if (d.date === today) continue;
      else break;
    }

    return {
      total,
      done,
      percent: total ? Math.round((done / total) * 100) : 0,
      totalHours: Math.round((totalMinutes / 60) * 10) / 10,
      doneHours: Math.round((doneMinutes / 60) * 10) / 10,
      streak,
      isDayComplete,
    };
  }, [plan, today]);

  return { plan, isLoaded, today, todayDay, missedCount, stats, toggleSession, carryOverMissed, resetPlan };
}