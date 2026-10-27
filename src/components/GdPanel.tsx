// src/components/GdPanel.tsx
'use client';
import { useState } from 'react';
import { Timer } from 'lucide-react';
import { gdTopics, GdTopic } from '../lib/interviewBank';
import { fmtTime, useTimer } from '../lib/useTimer';
import type { PracticeApi } from '../lib/usePractice';
import { btnGhost, btnPrimary, card, chip, shuffle } from './planUi';

const PREP_SECONDS = 60;
const SPEAK_SECONDS = 180;
const CHECKLIST = [
  'I opened with a clear framing or definition',
  'I made two or three distinct points, each with an example',
  'I acknowledged or built on another view instead of only repeating mine',
  'I stayed within the time and did not ramble',
  'I closed with a short conclusion',
];

type Phase = 'choose' | 'prep' | 'speak' | 'reflect';

export default function GdPanel({ practice, initialTopicId }: { practice: PracticeApi; initialTopicId?: string }) {
  const timer = useTimer();
  const [phase, setPhase] = useState<Phase>('choose');
  const [topic, setTopic] = useState<GdTopic | null>(null);
  const [checks, setChecks] = useState<boolean[]>(CHECKLIST.map(() => false));
  const [showIdeas, setShowIdeas] = useState(false);
  const [saved, setSaved] = useState(false);

  const startSpeak = () => {
    setPhase('speak');
    timer.start(SPEAK_SECONDS, () => setPhase('reflect'));
  };

  const begin = (t: GdTopic) => {
    setTopic(t);
    setChecks(CHECKLIST.map(() => false));
    setShowIdeas(false);
    setSaved(false);
    setPhase('prep');
    timer.start(PREP_SECONDS, startSpeak);
  };

  const skip = () => {
    timer.stop();
    if (phase === 'prep') startSpeak();
    else setPhase('reflect');
  };

  const save = () => {
    if (!topic) return;
    practice.addGd({ date: new Date().toISOString(), topicId: topic.id, checks: checks.filter(Boolean).length, total: CHECKLIST.length });
    setSaved(true);
  };

  if (phase === 'choose' || !topic) {
    const recent = practice.data.gd.slice(-5).reverse();
    const initial = gdTopics.find((t) => t.id === initialTopicId);
    return (
      <div className="space-y-4">
        <section className={`${card} space-y-3 p-4`}>
          <h2 className="text-lg font-semibold">Group discussion practice</h2>
          <p className="text-sm text-gray-400">
            You get one minute to prepare and three minutes to speak. Speak aloud as if you were in the room. Afterwards, check yourself honestly and compare with the ideas.
          </p>
          {initial && (
            <button onClick={() => begin(initial)} className={btnPrimary}>Start the suggested topic: {initial.title}</button>
          )}
          <button onClick={() => begin(shuffle(gdTopics)[0])} className={btnGhost}>Start a random topic</button>
          <ul className="flex flex-col gap-2 pt-1">
            {gdTopics.map((t) => (
              <li key={t.id}>
                <button onClick={() => begin(t)} className={`w-full text-left ${chip(false)} rounded-xl py-2 text-sm`}>
                  {t.title}
                </button>
              </li>
            ))}
          </ul>
        </section>
        {recent.length > 0 && (
          <section className={`${card} space-y-2 p-4`}>
            <h3 className="text-sm font-semibold">Recent sessions</h3>
            <ul className="space-y-1 text-sm text-gray-300">
              {recent.map((r, i) => (
                <li key={i} className="flex justify-between gap-2">
                  <span>{gdTopics.find((t) => t.id === r.topicId)?.title ?? r.topicId}</span>
                  <span className="shrink-0 text-gray-400">{r.checks} of {r.total} · {new Date(r.date).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    );
  }

  if (phase === 'prep' || phase === 'speak') {
    return (
      <section className={`${card} space-y-4 p-4`}>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{phase === 'prep' ? 'Prepare: jot down your points' : 'Speak now'}</span>
          <span className="inline-flex items-center gap-1 text-lg font-bold tabular-nums text-primary">
            <Timer size={18} /> {fmtTime(timer.left)}
          </span>
        </div>
        <h2 className="text-lg font-semibold">{topic.title}</h2>
        <p className="text-sm text-gray-400">
          {phase === 'prep'
            ? 'Plan: a framing sentence, two or three points with examples, and a conclusion.'
            : 'Open with your framing, make your points, and finish with a one-line conclusion.'}
        </p>
        <button onClick={skip} className={btnGhost}>{phase === 'prep' ? 'Skip preparation' : 'Finish early'}</button>
      </section>
    );
  }

  // reflect
  return (
    <div className="space-y-4">
      <section className={`${card} space-y-3 p-4`}>
        <h2 className="text-lg font-semibold">Check yourself</h2>
        <p className="text-sm text-gray-400">{topic.title}</p>
        <ul className="space-y-2">
          {CHECKLIST.map((c, i) => (
            <li key={c}>
              <label className="flex cursor-pointer items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={checks[i]}
                  onChange={() => setChecks((x) => x.map((v, j) => (j === i ? !v : v)))}
                  className="mt-1 accent-primary"
                />
                <span>{c}</span>
              </label>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2">
          <button onClick={save} disabled={saved} className={`${btnPrimary} disabled:opacity-40`}>{saved ? 'Saved' : 'Save this session'}</button>
          <button onClick={() => setShowIdeas((v) => !v)} className={btnGhost}>{showIdeas ? 'Hide ideas' : 'Show ideas to compare'}</button>
        </div>
      </section>

      {showIdeas && (
        <section className={`${card} space-y-3 p-4 text-sm`}>
          <p className="text-gray-300"><span className="font-medium">Framing tip:</span> {topic.framing}</p>
          <div>
            <h3 className="font-medium text-green-400">Points in favour</h3>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-gray-300">{topic.pros.map((p) => <li key={p}>{p}</li>)}</ul>
          </div>
          <div>
            <h3 className="font-medium text-red-300">Points against or concerns</h3>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-gray-300">{topic.cons.map((p) => <li key={p}>{p}</li>)}</ul>
          </div>
          <p className="text-xs text-gray-500">In a real discussion, avoid quoting statistics unless you are certain of them. A balanced conclusion usually scores better than a one-sided one.</p>
        </section>
      )}

      <div className="flex flex-wrap gap-2">
        <button onClick={() => begin(topic)} className={btnGhost}>Repeat this topic</button>
        <button onClick={() => { timer.stop(); setPhase('choose'); }} className={btnGhost}>Choose another topic</button>
      </div>
    </div>
  );
}
