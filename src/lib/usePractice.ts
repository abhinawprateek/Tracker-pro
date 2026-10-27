// src/lib/usePractice.ts
'use client';
import { useEffect, useRef, useState } from 'react';

const KEY = 'prodPracticeV1';

export type Rating = 1 | 2 | 3; // 1 needs work, 2 decent, 3 strong
export type QuizResult = { date: string; topic: string; score: number; total: number };
export type GdLog = { date: string; topicId: string; checks: number; total: number };
export type MockResult = { date: string; title: string; solved: number; total: number; minutesUsed: number; limit: number };

export type PracticeData = {
  solved: Record<string, string>; // problem slug -> ISO date solved
  quizzes: QuizResult[];
  interviews: Record<string, Rating>; // question id -> latest self-rating
  gd: GdLog[];
  mocks: MockResult[];
};

const empty: PracticeData = { solved: {}, quizzes: [], interviews: {}, gd: [], mocks: [] };

export function usePractice() {
  const [data, setData] = useState<PracticeData>(empty);
  const [isLoaded, setIsLoaded] = useState(false);
  const ref = useRef<PracticeData>(empty); // always the latest data, so back-to-back updates never overwrite each other

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const loaded = { ...empty, ...JSON.parse(raw) } as PracticeData;
        ref.current = loaded;
        setData(loaded);
      }
    } catch {
      /* ignore corrupt data */
    }
    setIsLoaded(true);
  }, []);

  const update = (fn: (d: PracticeData) => PracticeData) => {
    const next = fn(ref.current);
    ref.current = next;
    setData(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable */
    }
  };

  const setSolved = (slug: string, on: boolean) =>
    update((d) => {
      const solved = { ...d.solved };
      if (on) solved[slug] = new Date().toISOString();
      else delete solved[slug];
      return { ...d, solved };
    });

  const toggleSolved = (slug: string) => setSolved(slug, !ref.current.solved[slug]);

  const addQuiz = (r: QuizResult) => update((d) => ({ ...d, quizzes: [...d.quizzes, r].slice(-50) }));
  const rateInterview = (id: string, rating: Rating) => update((d) => ({ ...d, interviews: { ...d.interviews, [id]: rating } }));
  const addGd = (r: GdLog) => update((d) => ({ ...d, gd: [...d.gd, r].slice(-50) }));
  const addMock = (r: MockResult) => update((d) => ({ ...d, mocks: [...d.mocks, r].slice(-50) }));

  return { data, isLoaded, setSolved, toggleSolved, addQuiz, rateInterview, addGd, addMock };
}

export type PracticeApi = ReturnType<typeof usePractice>;
