// src/components/MockPanel.tsx
'use client';
import { useRef, useState } from 'react';
import { CheckCircle2, Circle, ExternalLink, Timer } from 'lucide-react';
import { allProblems, leetcodeUrl, mockPresets, MockPreset, Problem } from '../lib/studyContent';
import { fmtTime, useTimer } from '../lib/useTimer';
import type { PracticeApi } from '../lib/usePractice';
import { btnGhost, btnPrimary, card, shuffle } from './planUi';

const randomPreset = (): MockPreset => {
  const easy = shuffle(allProblems.filter((p) => p.difficulty === 'Easy')).slice(0, 1);
  const medium = shuffle(allProblems.filter((p) => p.difficulty === 'Medium')).slice(0, 2);
  return { id: 'random', title: 'Random mock (1 easy, 2 medium)', minutes: 45, problems: [...easy, ...medium] };
};

type Result = { title: string; solved: number; total: number; minutesUsed: number; limit: number };

export default function MockPanel({ practice, initialPreset }: { practice: PracticeApi; initialPreset?: string }) {
  const timer = useTimer();
  const [active, setActive] = useState<MockPreset | null>(null);
  const [startedAt, setStartedAt] = useState(0);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [result, setResult] = useState<Result | null>(null);
  const finishRef = useRef<() => void>(() => {});

  const begin = (preset: MockPreset) => {
    setActive(preset);
    setDone({});
    setResult(null);
    setStartedAt(Date.now());
    timer.start(preset.minutes * 60, () => finishRef.current());
  };

  const finish = () => {
    if (!active) return;
    timer.stop();
    const solved = active.problems.filter((p) => done[p.slug]).length;
    const minutesUsed = Math.min(active.minutes, Math.max(1, Math.round((Date.now() - startedAt) / 60000)));
    const r: Result = { title: active.title, solved, total: active.problems.length, minutesUsed, limit: active.minutes };
    practice.addMock({ date: new Date().toISOString(), ...r });
    setResult(r);
    setActive(null);
  };
  finishRef.current = finish;

  const toggle = (p: Problem) => {
    const on = !done[p.slug];
    setDone((d) => ({ ...d, [p.slug]: on }));
    practice.setSolved(p.slug, on);
  };

  const recent = practice.data.mocks.slice(-5).reverse();

  // Running mock
  if (active) {
    return (
      <section className={`${card} space-y-4 p-4`}>
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base font-semibold">{active.title}</h2>
          <span className={`inline-flex items-center gap-1 text-lg font-bold tabular-nums ${timer.left <= 300 ? 'text-red-400' : 'text-primary'}`} aria-live="off">
            <Timer size={18} /> {fmtTime(timer.left)}
          </span>
        </div>
        <p className="text-sm text-gray-400">Open each problem on LeetCode, solve it without hints, then tick it here. The mock ends when time runs out or when you finish.</p>
        <ul className="space-y-2">
          {active.problems.map((p) => (
            <li key={p.slug} className="flex items-center gap-3 rounded-xl border border-gray-800 p-3">
              <button
                onClick={() => toggle(p)}
                aria-pressed={!!done[p.slug]}
                aria-label={`Mark ${p.title} as solved`}
                className="shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {done[p.slug] ? <CheckCircle2 size={22} className="text-green-500" /> : <Circle size={22} className="text-gray-500" />}
              </button>
              <span className="min-w-0 flex-1 text-sm">
                <span className={done[p.slug] ? 'line-through opacity-60' : ''}>{p.title}</span>
                <span className="ml-2 text-xs text-gray-500">{p.difficulty}</span>
              </span>
              <a href={leetcodeUrl(p.slug)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-primary underline underline-offset-2">
                Open <ExternalLink size={12} />
              </a>
            </li>
          ))}
        </ul>
        <button onClick={finish} className={btnPrimary}>Finish mock</button>
      </section>
    );
  }

  return (
    <div className="space-y-4">
      {result && (
        <section className={`${card} space-y-1 p-4`}>
          <h2 className="text-lg font-semibold">Mock complete</h2>
          <p className="text-sm text-gray-300">
            {result.title}: solved {result.solved} of {result.total} in {result.minutesUsed} of {result.limit} minutes.
          </p>
          <p className="text-sm text-gray-400">
            {result.solved === result.total ? 'Every problem solved. Note which ones felt slow and repeat them tomorrow.' : 'For each unsolved problem, read the editorial, close it, and re-solve it from memory tomorrow. Add it to your notes.'}
          </p>
        </section>
      )}

      <section className={`${card} space-y-3 p-4`}>
        <h2 className="text-lg font-semibold">Timed coding mocks</h2>
        <p className="text-sm text-gray-400">Practise under interview conditions: a fixed time, no hints, and problems you have not seen.</p>
        <ul className="space-y-2">
          {mockPresets.map((m) => (
            <li key={m.id} className={`flex flex-wrap items-center justify-between gap-2 rounded-xl border p-3 ${initialPreset === m.id ? 'border-primary' : 'border-gray-800'}`}>
              <span className="text-sm">
                <span className="block font-medium">{m.title}</span>
                <span className="text-xs text-gray-400">{m.problems.length} problems · {m.minutes} minutes</span>
              </span>
              <button onClick={() => begin(m)} className={btnPrimary}>Start</button>
            </li>
          ))}
          <li className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gray-800 p-3">
            <span className="text-sm">
              <span className="block font-medium">Random mock</span>
              <span className="text-xs text-gray-400">1 easy and 2 medium problems from the plan · 45 minutes</span>
            </span>
            <button onClick={() => begin(randomPreset())} className={btnGhost}>Start</button>
          </li>
        </ul>
      </section>

      {recent.length > 0 && (
        <section className={`${card} space-y-2 p-4`}>
          <h3 className="text-sm font-semibold">Recent mocks</h3>
          <ul className="space-y-1 text-sm text-gray-300">
            {recent.map((r, i) => (
              <li key={i} className="flex justify-between gap-2">
                <span>{r.title}</span>
                <span className="text-gray-400">{r.solved} of {r.total} · {new Date(r.date).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
