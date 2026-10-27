// src/components/InterviewPanel.tsx
'use client';
import { useState } from 'react';
import { Timer } from 'lucide-react';
import { interviewBank, InterviewQuestion } from '../lib/interviewBank';
import { fmtTime, useTimer } from '../lib/useTimer';
import type { PracticeApi, Rating } from '../lib/usePractice';
import { btnGhost, btnPrimary, card, chip, shuffle } from './planUi';

type Kind = 'All' | 'HR' | 'Technical';
const RATINGS: { value: Rating; label: string; on: string }[] = [
  { value: 1, label: 'Needs work', on: 'border-red-500/60 bg-red-500/15 text-red-300' },
  { value: 2, label: 'Decent', on: 'border-amber-500/60 bg-amber-500/15 text-amber-300' },
  { value: 3, label: 'Strong', on: 'border-green-500/60 bg-green-500/15 text-green-300' },
];
const ANSWER_SECONDS = 120;

export default function InterviewPanel({ practice, initialKind, initialCount }: { practice: PracticeApi; initialKind?: Kind; initialCount?: number }) {
  const timer = useTimer();
  const [kind, setKind] = useState<Kind>(initialKind ?? 'All');
  const [count, setCount] = useState(initialCount ?? 5);
  const [session, setSession] = useState<InterviewQuestion[] | null>(null);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [rated, setRated] = useState<Rating | null>(null);
  const [finished, setFinished] = useState(false);
  const [ratings, setRatings] = useState<Record<string, Rating>>({});

  const pool = interviewBank.filter((q) => kind === 'All' || q.kind === kind);

  const begin = () => {
    // Put questions you rated "needs work" before those you have not tried or rated higher.
    const sorted = shuffle(pool).sort((a, b) => (practice.data.interviews[a.id] ?? 2) - (practice.data.interviews[b.id] ?? 2));
    const qs = sorted.slice(0, Math.min(count, pool.length));
    setSession(shuffle(qs));
    setIndex(0);
    setRevealed(false);
    setRated(null);
    setFinished(false);
    setRatings({});
    timer.start(ANSWER_SECONDS);
  };

  const rate = (q: InterviewQuestion, r: Rating) => {
    setRated(r);
    setRatings((x) => ({ ...x, [q.id]: r }));
    practice.rateInterview(q.id, r);
  };

  const next = () => {
    if (!session) return;
    if (index + 1 < session.length) {
      setIndex(index + 1);
      setRevealed(false);
      setRated(null);
      timer.start(ANSWER_SECONDS);
    } else {
      timer.stop();
      setFinished(true);
    }
  };

  if (!session) {
    const rated_ = Object.keys(practice.data.interviews).length;
    return (
      <section className={`${card} space-y-4 p-4`}>
        <h2 className="text-lg font-semibold">Mock interview</h2>
        <p className="text-sm text-gray-400">
          Answer each question aloud within two minutes before revealing the guide. Questions you rated "needs work" come up first next time.
        </p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Question type">
          {(['All', 'HR', 'Technical'] as Kind[]).map((k) => (
            <button key={k} onClick={() => setKind(k)} aria-pressed={kind === k} className={chip(kind === k)}>{k}</button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <label htmlFor="iv-count" className="text-gray-400">Questions</label>
          <select
            id="iv-count"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 [color-scheme:dark]"
          >
            {[3, 5, 8, 10].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <span className="text-xs text-gray-500">{pool.length} questions in this set · {rated_} rated so far</span>
        </div>
        <button onClick={begin} className={btnPrimary}>Start interview</button>
      </section>
    );
  }

  if (finished) {
    const list = session.map((q) => ({ q, r: ratings[q.id] }));
    const weak = list.filter((x) => x.r === 1);
    return (
      <div className="space-y-4">
        <section className={`${card} space-y-2 p-4`}>
          <h2 className="text-lg font-semibold">Interview complete</h2>
          <p className="text-sm text-gray-400">
            {weak.length === 0 ? 'No question was rated as needing work. Run another set to test different questions.' : `${weak.length} ${weak.length === 1 ? 'question needs' : 'questions need'} more practice. Re-read the guide, write bullet points, and answer again aloud.`}
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <button onClick={begin} className={btnPrimary}>Another round</button>
            <button onClick={() => setSession(null)} className={btnGhost}>Change settings</button>
          </div>
        </section>
        <ul className="space-y-2">
          {list.map(({ q, r }) => (
            <li key={q.id} className={`${card} flex items-start justify-between gap-3 p-3 text-sm`}>
              <span>{q.q}</span>
              <span className="shrink-0 text-xs text-gray-400">{RATINGS.find((x) => x.value === r)?.label ?? 'Not rated'}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const q = session[index];
  return (
    <section className={`${card} space-y-4 p-4`}>
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{q.kind} · question {index + 1} of {session.length}</span>
        <span className={`inline-flex items-center gap-1 text-base font-bold tabular-nums ${timer.left === 0 ? 'text-red-400' : 'text-primary'}`}>
          <Timer size={16} /> {fmtTime(timer.left)}
        </span>
      </div>
      <h2 className="text-base font-semibold">{q.q}</h2>

      {!revealed ? (
        <button onClick={() => setRevealed(true)} className={btnPrimary}>Show what a strong answer covers</button>
      ) : (
        <div className="space-y-3">
          <ul className="list-disc space-y-1 rounded-xl bg-gray-800/60 p-3 pl-7 text-sm text-gray-300">
            {q.covers.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-gray-500">How did your answer compare?</span>
            {RATINGS.map((r) => (
              <button
                key={r.value}
                onClick={() => rate(q, r.value)}
                aria-pressed={rated === r.value}
                className={`rounded-full border px-2.5 py-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${rated === r.value ? r.on : 'border-gray-700 text-gray-400'}`}
              >
                {r.label}
              </button>
            ))}
          </div>
          <button onClick={next} disabled={rated === null} className={`${btnPrimary} disabled:opacity-40`}>
            {index + 1 < session.length ? 'Next question' : 'Finish'}
          </button>
        </div>
      )}
    </section>
  );
}
