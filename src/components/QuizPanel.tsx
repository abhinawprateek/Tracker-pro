// src/components/QuizPanel.tsx
'use client';
import { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { quizBank, QUIZ_TOPICS, QuizQuestion } from '../lib/quizBank';
import type { PracticeApi } from '../lib/usePractice';
import { btnGhost, btnPrimary, card, chip, shuffle } from './planUi';

// Shuffles the options of a question and keeps track of where the correct one moved to.
const withShuffledOptions = (q: QuizQuestion): QuizQuestion => {
  const order = shuffle(q.options.map((_, i) => i));
  return { ...q, options: order.map((i) => q.options[i]), answer: order.indexOf(q.answer) };
};

export default function QuizPanel({ practice, initialTopic }: { practice: PracticeApi; initialTopic?: string }) {
  const [topic, setTopic] = useState(initialTopic ?? 'Mixed');
  const [count, setCount] = useState(10);
  const [session, setSession] = useState<QuizQuestion[] | null>(null);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ q: QuizQuestion; picked: number }[]>([]);
  const [finished, setFinished] = useState(false);

  const pool = topic === 'Mixed' ? quizBank : quizBank.filter((q) => q.topic === topic);

  const start = () => {
    const qs = shuffle(pool).slice(0, Math.min(count, pool.length)).map(withShuffledOptions);
    setSession(qs);
    setIndex(0);
    setPicked(null);
    setAnswers([]);
    setFinished(false);
  };

  const choose = (i: number) => {
    if (!session || picked !== null) return;
    setPicked(i);
    setAnswers((a) => [...a, { q: session[index], picked: i }]);
  };

  const next = () => {
    if (!session) return;
    if (index + 1 < session.length) {
      setIndex(index + 1);
      setPicked(null);
      return;
    }
    const score = answers.filter((a) => a.picked === a.q.answer).length;
    practice.addQuiz({ date: new Date().toISOString(), topic, score, total: session.length });
    setFinished(true);
  };

  const recent = practice.data.quizzes.slice(-5).reverse();

  // Setup screen
  if (!session) {
    return (
      <div className="space-y-4">
        <section className={`${card} space-y-4 p-4`}>
          <h2 className="text-lg font-semibold">Quizzes</h2>
          <p className="text-sm text-gray-400">Pick a topic. Each answer shows an explanation straight away.</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Quiz topic">
            {['Mixed', ...QUIZ_TOPICS].map((t) => (
              <button key={t} onClick={() => setTopic(t)} aria-pressed={topic === t} className={chip(topic === t)}>
                {t}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <label htmlFor="quiz-count" className="text-gray-400">Questions</label>
            <select
              id="quiz-count"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 [color-scheme:dark]"
            >
              {[5, 10, 15, 20].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <span className="text-xs text-gray-500">{pool.length} available for this topic</span>
          </div>
          <button onClick={start} className={btnPrimary}>Start quiz</button>
        </section>

        {recent.length > 0 && (
          <section className={`${card} space-y-2 p-4`}>
            <h3 className="text-sm font-semibold">Recent results</h3>
            <ul className="space-y-1 text-sm text-gray-300">
              {recent.map((r, i) => (
                <li key={i} className="flex justify-between gap-2">
                  <span>{r.topic}</span>
                  <span className="text-gray-400">{r.score} of {r.total} · {new Date(r.date).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    );
  }

  // Results screen
  if (finished) {
    const score = answers.filter((a) => a.picked === a.q.answer).length;
    const wrong = answers.filter((a) => a.picked !== a.q.answer);
    const pct = Math.round((score / session.length) * 100);
    return (
      <div className="space-y-4">
        <section className={`${card} space-y-2 p-4`}>
          <h2 className="text-lg font-semibold">Result: {score} of {session.length} ({pct}%)</h2>
          <p className="text-sm text-gray-400">
            {pct >= 80 ? 'Strong result. Move on and revisit this topic once more before the interview.' : pct >= 50 ? 'A fair start. Review the explanations below and retry this topic tomorrow.' : 'This topic needs more study. Read the linked material for it and retry.'}
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <button onClick={start} className={btnPrimary}>Try again</button>
            <button onClick={() => setSession(null)} className={btnGhost}>Change topic</button>
          </div>
        </section>
        {wrong.length > 0 && (
          <section className="space-y-2">
            <h3 className="text-sm font-semibold">Review your mistakes</h3>
            <ul className="space-y-2">
              {wrong.map((a) => (
                <li key={a.q.id} className={`${card} space-y-1 p-3 text-sm`}>
                  <p className="font-medium">{a.q.q}</p>
                  <p className="text-red-300">Your answer: {a.q.options[a.picked]}</p>
                  <p className="text-green-400">Correct answer: {a.q.options[a.q.answer]}</p>
                  <p className="text-gray-400">{a.q.explanation}</p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    );
  }

  // Question screen
  const q = session[index];
  return (
    <section className={`${card} space-y-4 p-4`}>
      <div className="flex justify-between text-xs text-gray-400">
        <span>{q.topic}</span>
        <span>Question {index + 1} of {session.length}</span>
      </div>
      <h2 className="text-base font-semibold">{q.q}</h2>
      <ul className="space-y-2">
        {q.options.map((opt, i) => {
          const isCorrect = i === q.answer;
          const isPicked = picked === i;
          let style = 'border-gray-700 hover:border-gray-500';
          if (picked !== null) {
            if (isCorrect) style = 'border-green-500/60 bg-green-500/10';
            else if (isPicked) style = 'border-red-500/60 bg-red-500/10';
            else style = 'border-gray-800 opacity-60';
          }
          return (
            <li key={i}>
              <button
                onClick={() => choose(i)}
                disabled={picked !== null}
                className={`flex w-full items-start gap-2 rounded-xl border p-3 text-left text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${style}`}
              >
                {picked !== null && isCorrect && <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-green-500" />}
                {picked !== null && isPicked && !isCorrect && <XCircle size={18} className="mt-0.5 shrink-0 text-red-400" />}
                <span>{opt}</span>
              </button>
            </li>
          );
        })}
      </ul>
      {picked !== null && (
        <div className="space-y-3">
          <p className="rounded-xl bg-gray-800/60 p-3 text-sm text-gray-300">{q.explanation}</p>
          <button onClick={next} className={btnPrimary}>{index + 1 < session.length ? 'Next question' : 'See result'}</button>
        </div>
      )}
    </section>
  );
}
