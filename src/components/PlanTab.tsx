// src/components/PlanTab.tsx
'use client';
import { useState } from 'react';
import { CheckCircle2, Circle, Clock, Flame, RotateCcw, ArrowRightCircle, Plus, Trash2, AlertTriangle, ExternalLink } from 'lucide-react';
import { useStudyPlan } from '../lib/useStudyPlan';
import { usePractice } from '../lib/usePractice';
import { PlanSession, RoundStatus } from '../lib/StudyPlan';
import { allProblems, contentFor, leetcodeUrl, TestAction } from '../lib/studyContent';
import QuizPanel from './QuizPanel';
import MockPanel from './MockPanel';
import InterviewPanel from './InterviewPanel';
import GdPanel from './GdPanel';

type Block = PlanSession['block'];
type View = 'plan' | 'quiz' | 'mock' | 'interview' | 'gd';

const VIEWS: { id: View; label: string }[] = [
  { id: 'plan', label: 'Plan' },
  { id: 'quiz', label: 'Quizzes' },
  { id: 'mock', label: 'Mock tests' },
  { id: 'interview', label: 'Interviews' },
  { id: 'gd', label: 'GD' },
];

const DIFF_STYLE: Record<string, string> = {
  Easy: 'text-green-400',
  Medium: 'text-amber-300',
  Hard: 'text-red-300',
};

const STATUS_LABEL: Record<RoundStatus, string> = {
  pending: 'Pending',
  scheduled: 'Scheduled',
  cleared: 'Cleared',
  not_cleared: 'Not cleared',
};

const CONF: { level: 1 | 2 | 3; label: string; on: string }[] = [
  { level: 1, label: 'Weak', on: 'border-red-500/60 bg-red-500/15 text-red-300' },
  { level: 2, label: 'Okay', on: 'border-amber-500/60 bg-amber-500/15 text-amber-300' },
  { level: 3, label: 'Strong', on: 'border-green-500/60 bg-green-500/15 text-green-300' },
];

const card = 'rounded-2xl border border-gray-800 bg-gray-900/60';
const field =
  'rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary [color-scheme:dark]';

const daysBetween = (from: string, to: string) =>
  Math.round((new Date(to + 'T00:00:00').getTime() - new Date(from + 'T00:00:00').getTime()) / 86400000);

export default function PlanTab() {
  const {
    plan, drive, isLoaded, today, todayDay, missedCount, stats,
    toggleSession, setConfidence, setNotes, addTask, removeTask, updateRound, carryOverMissed, resetPlan,
  } = useStudyPlan();

  const practice = usePractice();
  const [view, setView] = useState<View>('plan');
  const [intent, setIntent] = useState<TestAction | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [filter, setFilter] = useState<'All' | Block>('All');
  const [newTopic, setNewTopic] = useState('');
  const [newBlock, setNewBlock] = useState<Block>('DSA');
  const [newMinutes, setNewMinutes] = useState(30);

  // Default to today's day; before the plan starts show Day 1, after it ends show the last day.
  const defaultDay = todayDay
    ? todayDay.dayNumber
    : plan.length && today && today < plan[0].date
    ? 1
    : plan.length;
  const activeNumber = selected ?? defaultDay;
  const day = plan.find((d) => d.dayNumber === activeNumber) ?? plan[0];

  const openAction = (a: TestAction) => {
    setIntent(a);
    setView(a.type);
  };

  if (!isLoaded || !day) {
    return <div className="mx-auto max-w-3xl p-4 text-gray-400">Loading your plan…</div>;
  }

  const live = day.sessions.filter((x) => !x.carriedOver);
  const dayDone = live.filter((x) => x.completed).length;
  const visible = day.sessions.filter((x) => filter === 'All' || x.block === filter);

  // Next scheduled round that has a date on or after today.
  const upcoming = drive.rounds
    .filter((r) => r.status === 'scheduled' && r.date && r.date >= today)
    .sort((a, b) => (a.date < b.date ? -1 : 1))[0];
  const upcomingText = upcoming
    ? (() => {
        const n = daysBetween(today, upcoming.date);
        return `Next: ${upcoming.name}, ${n === 0 ? 'today' : n === 1 ? 'tomorrow' : `in ${n} days`} (${upcoming.date})`;
      })()
    : '';

  return (
    <div className="mx-auto max-w-3xl space-y-5 p-4 pb-16">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">CRED backend intern: 14-day plan</h1>
        <p className="text-sm text-gray-400">9 to 22 October 2026</p>
      </header>

      <nav className="flex gap-2 overflow-x-auto pb-1" aria-label="Study sections">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            onClick={() => {
              setIntent(null);
              setView(v.id);
            }}
            aria-current={view === v.id ? 'page' : undefined}
            className={`shrink-0 rounded-xl border px-4 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              view === v.id ? 'border-primary bg-primary/20 font-bold text-primary' : 'border-gray-800 text-gray-400'
            }`}
          >
            {v.label}
          </button>
        ))}
      </nav>

      {view === 'quiz' && <QuizPanel key={`quiz-${intent ? JSON.stringify(intent) : ''}`} practice={practice} initialTopic={intent?.type === 'quiz' ? intent.topic : undefined} />}
      {view === 'mock' && <MockPanel key={`mock-${intent ? JSON.stringify(intent) : ''}`} practice={practice} initialPreset={intent?.type === 'mock' ? intent.preset : undefined} />}
      {view === 'interview' && (
        <InterviewPanel
          key={`iv-${intent ? JSON.stringify(intent) : ''}`}
          practice={practice}
          initialKind={intent?.type === 'interview' ? intent.kind : undefined}
          initialCount={intent?.type === 'interview' ? intent.count : undefined}
        />
      )}
      {view === 'gd' && <GdPanel key={`gd-${intent ? JSON.stringify(intent) : ''}`} practice={practice} initialTopicId={intent?.type === 'gd' ? intent.topicId : undefined} />}

      {view === 'plan' && (
        <>
      {/* Drive status */}
      <section className={`${card} space-y-3 p-4`}>
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold">CRED drive status</h2>
          {drive.registered && (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-500/15 px-2.5 py-1 text-xs font-medium text-green-400">
              <CheckCircle2 size={12} /> Registered
            </span>
          )}
        </div>
        {upcomingText && <p className="text-sm font-medium text-primary">{upcomingText}</p>}
        <ul className="space-y-2">
          {drive.rounds.map((r) => (
            <li key={r.id} className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[1fr_auto_auto]">
              <span className="text-sm">{r.name}</span>
              <select
                aria-label={`${r.name} status`}
                value={r.status}
                onChange={(e) => updateRound(r.id, { status: e.target.value as RoundStatus })}
                className={field}
              >
                {(Object.keys(STATUS_LABEL) as RoundStatus[]).map((k) => (
                  <option key={k} value={k}>
                    {STATUS_LABEL[k]}
                  </option>
                ))}
              </select>
              <input
                type="date"
                aria-label={`${r.name} date`}
                value={r.date}
                onChange={(e) => updateRound(r.id, { date: e.target.value })}
                className={field}
              />
            </li>
          ))}
        </ul>
        <p className="text-xs text-gray-500">Dates are announced by the placement office. Enter them here as they arrive.</p>
      </section>

      {/* Progress */}
      <section className={`${card} p-4`}>
        <div className="flex justify-between text-sm">
          <span>
            {stats.done} of {stats.total} tasks done
          </span>
          <span className="font-medium">{stats.percent}%</span>
        </div>
        <div
          className="mt-1 h-2 w-full overflow-hidden rounded bg-gray-800"
          role="progressbar"
          aria-valuenow={stats.percent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="h-full bg-primary" style={{ width: `${stats.percent}%` }} />
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Flame size={16} className="text-orange-400" />
            <dt className="text-gray-400">Streak</dt>
            <dd className="font-medium">
              {stats.streak} {stats.streak === 1 ? 'day' : 'days'}
            </dd>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-gray-400" />
            <dt className="text-gray-400">Study time</dt>
            <dd className="font-medium">
              {stats.doneHours} of {stats.totalHours} hours
            </dd>
          </div>
        </dl>

        <ul className="mt-4 space-y-2">
          {stats.blocks.map((b) => {
            const pct = b.total ? Math.round((b.done / b.total) * 100) : 0;
            return (
              <li key={b.block} className="grid grid-cols-[5.5rem_1fr_auto] items-center gap-3 text-xs">
                <span className="text-gray-300">{b.block}</span>
                <div className="h-1.5 overflow-hidden rounded bg-gray-800">
                  <div className="h-full bg-primary/80" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-gray-400">
                  {Math.round((b.done / 60) * 10) / 10} of {Math.round((b.total / 60) * 10) / 10} h
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Practice summary */}
      {(() => {
        const slugs = allProblems.map((p) => p.slug);
        const solvedCount = slugs.filter((s) => practice.data.solved[s]).length;
        const quizzes = practice.data.quizzes;
        const last = quizzes[quizzes.length - 1];
        const rated = Object.keys(practice.data.interviews).length;
        return (
          <section className={`${card} p-4`}>
            <h2 className="mb-3 text-sm font-semibold">Practice summary</h2>
            <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-5">
              <div><dt className="text-xs text-gray-400">Problems solved</dt><dd className="font-medium">{solvedCount} of {slugs.length}</dd></div>
              <div><dt className="text-xs text-gray-400">Quizzes taken</dt><dd className="font-medium">{quizzes.length}{last ? ` (last ${Math.round((last.score / last.total) * 100)}%)` : ''}</dd></div>
              <div><dt className="text-xs text-gray-400">Mock tests</dt><dd className="font-medium">{practice.data.mocks.length}</dd></div>
              <div><dt className="text-xs text-gray-400">Interview answers rated</dt><dd className="font-medium">{rated}</dd></div>
              <div><dt className="text-xs text-gray-400">GD sessions</dt><dd className="font-medium">{practice.data.gd.length}</dd></div>
            </dl>
          </section>
        );
      })()}

      {missedCount > 0 && (
        <section className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-300">
          <span>
            {missedCount} unfinished {missedCount === 1 ? 'task' : 'tasks'} from earlier days.
          </span>
          <button
            onClick={carryOverMissed}
            className="inline-flex items-center gap-1 rounded-xl bg-amber-500 px-3 py-1.5 font-bold text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <ArrowRightCircle size={14} /> Move to today
          </button>
        </section>
      )}

      {stats.weak.length > 0 && (
        <section className={`${card} space-y-2 p-4`}>
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <AlertTriangle size={16} className="text-red-400" /> Needs revision
          </h2>
          <ul className="space-y-1">
            {stats.weak.map((w) => (
              <li key={w.id}>
                <button
                  onClick={() => {
                    setSelected(w.dayNumber);
                    setFilter('All');
                  }}
                  className="text-left text-sm text-gray-300 underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {w.topic} <span className="text-gray-500">({w.label})</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Day selector */}
      <nav className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1" aria-label="Plan days">
        {plan.map((d) => {
          const complete = stats.isDayComplete(d);
          const isActive = d.dayNumber === day.dayNumber;
          const isToday = d.date === today;
          return (
            <button
              key={d.dayNumber}
              onClick={() => setSelected(d.dayNumber)}
              aria-current={isActive ? 'true' : undefined}
              className={`shrink-0 rounded-xl border px-3 py-2 text-left text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                isActive ? 'border-primary bg-primary/20 text-primary' : 'border-gray-800 bg-gray-900/60 text-gray-300'
              }`}
            >
              <span className="block font-medium">Day {d.dayNumber}</span>
              <span className="block opacity-80">{d.label}</span>
              <span className="block opacity-80">{complete ? 'Complete' : isToday ? 'Today' : ' '}</span>
            </button>
          );
        })}
      </nav>

      {/* Day detail */}
      <section className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">
            Day {day.dayNumber}, {day.label}
          </h2>
          <span className="text-sm text-gray-400">
            {dayDone} of {live.length} done
          </span>
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter tasks by type">
          {(['All', ...BLOCKS] as ('All' | Block)[]).map((b) => (
            <button
              key={b}
              onClick={() => setFilter(b)}
              aria-pressed={filter === b}
              className={`rounded-full border px-3 py-1 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                filter === b ? 'border-primary bg-primary/20 text-primary' : 'border-gray-800 text-gray-400'
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        <ul className="space-y-2">
          {visible.map((sess) => (
            <li
              key={sess.id}
              className={`rounded-2xl border p-3 text-gray-100 ${
                sess.carriedOver ? 'border-dashed border-gray-700 bg-transparent opacity-60' : 'border-gray-800 bg-gray-900/60'
              }`}
            >
              <div className="flex items-start gap-2">
                <button
                  onClick={() => !sess.carriedOver && toggleSession(day.dayNumber, sess.id)}
                  disabled={sess.carriedOver}
                  aria-pressed={sess.completed}
                  className="flex min-w-0 flex-1 items-start gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {sess.completed ? (
                    <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-green-500" />
                  ) : (
                    <Circle size={22} className="mt-0.5 shrink-0 text-gray-500" />
                  )}
                  <span className="min-w-0 flex-1">
                    <span className={`block font-medium ${sess.completed ? 'line-through opacity-60' : ''}`}>{sess.topic}</span>
                    <span className="mt-0.5 block text-sm text-gray-400">{sess.details}</span>
                    <span className="mt-1 block text-xs text-gray-500">
                      {sess.block} · {sess.timeSlot}
                      {sess.carriedOver ? ' · moved to a later day' : ''}
                    </span>
                  </span>
                </button>
                {sess.custom && (
                  <button
                    onClick={() => removeTask(day.dayNumber, sess.id)}
                    aria-label={`Remove ${sess.topic}`}
                    className="shrink-0 rounded-lg p-1.5 text-gray-500 hover:text-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              {(() => {
                const c = contentFor(sess.id);
                if (!c || sess.carriedOver) return null;
                const problems = c.problems || [];
                const resources = c.resources || [];
                const solved = problems.filter((p) => practice.data.solved[p.slug]).length;
                return (
                  <div className="mt-2 space-y-2 pl-9 text-sm">
                    {(problems.length > 0 || resources.length > 0) && (
                      <details className="group">
                        <summary className="cursor-pointer text-xs font-medium text-primary">
                          {problems.length > 0 ? `Problems (${solved} of ${problems.length} solved)` : ''}
                          {problems.length > 0 && resources.length > 0 ? ' and ' : ''}
                          {resources.length > 0 ? `study material (${resources.length})` : ''}
                        </summary>
                        <div className="mt-2 space-y-3">
                          {resources.length > 0 && (
                            <ul className="space-y-1">
                              {resources.map((r) => (
                                <li key={r.url}>
                                  <a href={r.url} target="_blank" rel="noreferrer" className="inline-flex items-start gap-1 text-gray-300 underline underline-offset-2 hover:text-primary">
                                    {r.title} <ExternalLink size={12} className="mt-1 shrink-0" />
                                  </a>
                                </li>
                              ))}
                            </ul>
                          )}
                          {problems.length > 0 && (
                            <ul className="space-y-1">
                              {problems.map((p) => (
                                <li key={p.slug} className="flex items-center gap-2">
                                  <button
                                    onClick={() => practice.toggleSolved(p.slug)}
                                    aria-pressed={!!practice.data.solved[p.slug]}
                                    aria-label={`Mark ${p.title} as solved`}
                                    className="shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                  >
                                    {practice.data.solved[p.slug] ? <CheckCircle2 size={18} className="text-green-500" /> : <Circle size={18} className="text-gray-500" />}
                                  </button>
                                  <a href={leetcodeUrl(p.slug)} target="_blank" rel="noreferrer" className={`min-w-0 flex-1 underline-offset-2 hover:underline ${practice.data.solved[p.slug] ? 'line-through opacity-60' : 'text-gray-200'}`}>
                                    {p.title}
                                  </a>
                                  <span className={`shrink-0 text-xs ${DIFF_STYLE[p.difficulty]}`}>{p.difficulty}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </details>
                    )}
                    {c.actions && c.actions.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {c.actions.map((a) => (
                          <button
                            key={a.label}
                            onClick={() => openAction(a)}
                            className="rounded-xl border border-primary/50 px-3 py-1 text-xs font-bold text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                          >
                            {a.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

              {sess.completed && !sess.carriedOver && (
                <div className="mt-2 flex flex-wrap items-center gap-2 pl-9 text-xs">
                  <span className="text-gray-500">How well do you know this?</span>
                  {CONF.map((c) => (
                    <button
                      key={c.level}
                      onClick={() => setConfidence(day.dayNumber, sess.id, c.level)}
                      aria-pressed={sess.confidence === c.level}
                      className={`rounded-full border px-2.5 py-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                        sess.confidence === c.level ? c.on : 'border-gray-700 text-gray-400'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              )}
            </li>
          ))}
          {visible.length === 0 && <li className="text-sm text-gray-500">No {filter} tasks on this day.</li>}
        </ul>

        {/* Add a task */}
        <div className={`${card} flex flex-wrap items-center gap-2 p-3`}>
          <input
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                addTask(day.dayNumber, newTopic, newBlock, newMinutes);
                setNewTopic('');
              }
            }}
            placeholder="Add your own task to this day"
            aria-label="New task name"
            className={`${field} min-w-[12rem] flex-1`}
          />
          <select aria-label="Task type" value={newBlock} onChange={(e) => setNewBlock(e.target.value as Block)} className={field}>
            {BLOCKS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          <input
            type="number"
            min={5}
            max={480}
            step={5}
            value={newMinutes}
            onChange={(e) => setNewMinutes(Number(e.target.value))}
            aria-label="Minutes"
            className={`${field} w-20`}
          />
          <button
            onClick={() => {
              addTask(day.dayNumber, newTopic, newBlock, newMinutes);
              setNewTopic('');
            }}
            className="inline-flex items-center gap-1 rounded-xl bg-primary/20 px-3 py-2 text-sm font-bold text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Plus size={14} /> Add task
          </button>
        </div>

        {/* Notes */}
        <div className="space-y-1">
          <label htmlFor="day-notes" className="text-sm font-medium">
            Notes and mistakes for this day
          </label>
          <textarea
            id="day-notes"
            value={day.notes ?? ''}
            onChange={(e) => setNotes(day.dayNumber, e.target.value)}
            rows={4}
            placeholder="Problems you got stuck on, mistakes to avoid, questions to look up…"
            className={`${field} w-full`}
          />
        </div>
      </section>

      <footer className="pt-2">
        <button
          onClick={() => {
            if (window.confirm('Reset the whole plan? All ticks, ratings, notes and added tasks will be cleared. Your drive status is kept.')) resetPlan();
          }}
          className="inline-flex items-center gap-1 text-sm text-gray-500 underline underline-offset-2"
        >
          <RotateCcw size={14} /> Reset plan
        </button>
      </footer>
        </>
      )}
    </div>
  );
}