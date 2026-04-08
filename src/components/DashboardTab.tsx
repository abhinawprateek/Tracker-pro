import { useState } from 'react';
import { useAppStore } from '../context/StoreContext';
import { Target, Search, Clock, Award, Flame, CheckCircle, Circle, ArrowRight, PlayCircle } from 'lucide-react';
import FocusMode from './FocusMode';

export default function DashboardTab() {
  const { stats, timetable, markSessionComplete, isLoaded, missedTasksCount, carryForwardMissedTasks } = useAppStore();
  const [activeSession, setActiveSession] = useState<any>(null);

  if (!isLoaded) return <div className="flex h-screen items-center justify-center"><div className="animate-pulse">Loading Dashboard...</div></div>;

  const currentDayName = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  const todayPlan = timetable.find(d => d.day === currentDayName) || timetable[0];

  const completedToday = todayPlan.sessions.filter(s => s.completed).length;
  const totalToday = todayPlan.sessions.length;
  const dayProgress = totalToday === 0 ? 0 : Math.round((completedToday / totalToday) * 100);

  return (
    <div className="p-4 md:p-8 w-full max-w-7xl mx-auto relative">
      {activeSession && <FocusMode session={activeSession} onClose={() => setActiveSession(null)} />}

      {/* Header */}
      <header className="flex flex-col xl:flex-row xl:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
            Tracker PRO V2
          </h1>
          <p className="text-gray-400 text-sm mt-1">{new Date().toDateString()}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:gap-4 bg-secondary p-3 rounded-2xl border border-gray-800 shadow-xl overflow-x-auto">
          <div className="flex items-center gap-2 px-1 lg:px-3">
            <Award className="text-yellow-500" size={20} />
            <div><p className="text-xs text-gray-400">Level</p><p className="font-bold">{stats.level}</p></div>
          </div>
          <div className="w-px h-8 bg-gray-700"></div>
          <div className="flex items-center gap-2 px-1 lg:px-3">
            <Flame className="text-orange-500" size={20} />
            <div><p className="text-xs text-gray-400">Streak</p><p className="font-bold">{stats.currentStreak}</p></div>
          </div>
          <div className="w-px h-8 bg-gray-700"></div>
          <div className="flex items-center gap-2 px-1 lg:px-3 cursor-help border-b border-dotted border-gray-500" title="Productivity Score">
            <Target className="text-blue-500" size={20} />
            <div><p className="text-xs text-blue-400 font-bold">Score</p><p className="font-bold">{stats.productivityScore}%</p></div>
          </div>
        </div>
      </header>

      {/* Smart Carry Forward Alert */}
      {missedTasksCount > 0 && (
        <div className="mb-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex items-center justify-between">
          <div>
            <h3 className="font-bold text-yellow-500">Carry Forward Missed Tasks?</h3>
            <p className="text-sm text-gray-300 hidden sm:block">We detected {missedTasksCount} incomplete sessions from earlier days.</p>
          </div>
          <button onClick={() => carryForwardMissedTasks()} className="px-4 py-2 bg-yellow-500/20 text-yellow-400 font-bold rounded-xl whitespace-nowrap text-sm hover:bg-yellow-500/40 transition">
            Bring to Today
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <section className="bg-secondary bg-opacity-50 backdrop-blur-xl p-6 rounded-3xl border border-gray-800 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-800">
              <div className="h-full bg-gradient-to-r from-primary to-blue-500 transition-all duration-1000" style={{ width: `${dayProgress}%` }}></div>
            </div>
            <div className="flex justify-between items-end mb-6">
               <div>
                 <h2 className="text-2xl font-bold flex items-center gap-2"><Clock className="text-primary"/> Today's Plan</h2>
                 <p className="text-gray-400 text-sm">{completedToday} of {totalToday} completed</p>
               </div>
               <div className="text-3xl font-black text-primary">{dayProgress}%</div>
            </div>

            <div className="space-y-4">
              {todayPlan.sessions.map((session, idx) => (
                <div key={session.id} className="group p-4 bg-[#121212] border border-gray-800 rounded-2xl transition hover:border-gray-600">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <button onClick={() => markSessionComplete(todayPlan.day, session.id)} className={`mt-1 mr-1 p-0 transition-colors ${session.completed ? 'text-green-500' : 'text-gray-600 hover:text-gray-400'}`}>
                        {session.completed ? <CheckCircle size={24} /> : <Circle size={24} />}
                      </button>
                      <div className={session.completed ? 'opacity-50' : ''}>
                        <div className="text-xs text-primary font-bold mb-1 uppercase tracking-wider">{session.timeSlot}</div>
                        <h3 className={`font-bold text-lg mb-1 ${session.completed ? 'line-through text-gray-500' : 'text-white'}`}>{session.topic}</h3>
                        <p className="text-sm text-gray-400 leading-snug">{session.details}</p>
                      </div>
                    </div>
                    {!session.completed && (
                      <button onClick={() => setActiveSession(session)} className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-bold opacity-0 group-hover:opacity-100 transition shadow hover:bg-primary/20">
                        <PlayCircle size={16}/> Focus
                      </button>
                    )}
                  </div>
                  {/* Mobile active button */}
                  {!session.completed && (
                    <button onClick={() => setActiveSession(session)} className="mt-4 sm:hidden w-full flex justify-center items-center gap-1.5 py-2 rounded-xl bg-primary/10 text-primary font-bold">
                      <PlayCircle size={18}/> Enter Focus Mode
                    </button>
                  )}
                </div>
              ))}
              {todayPlan.sessions.length === 0 && (
                <p className="text-center text-gray-500 py-4">No sessions planned for today! You're free! 🏖️</p>
              )}
            </div>
          </section>
        </div>

        {/* Right side weekly overview remains similar but hooked to context correctly */}
        <div className="space-y-8">
           <section className="bg-secondary p-6 rounded-3xl border border-gray-800 shadow-lg">
             <h2 className="text-xl font-bold mb-6">Weekly Outlook</h2>
             <div className="space-y-3">
               {timetable.map(day => (
                 <div key={day.day} className={`px-4 py-3 rounded-xl border ${day.day === currentDayName ? 'border-primary bg-primary/10' : 'border-gray-800 bg-[#121212]'}`}>
                   <div className="flex justify-between items-center mb-2">
                     <h3 className={`font-bold text-xs uppercase tracking-wider ${day.day === currentDayName ? 'text-primary' : 'text-gray-400'}`}>{day.day}</h3>
                     <span className="text-xs text-gray-500 font-bold">{day.sessions.filter(s=>s.completed).length}/{day.sessions.length}</span>
                   </div>
                   <div className="flex gap-1 h-1.5">
                     {day.sessions.map((s, i) => (
                       <div key={i} className={`flex-1 rounded-full ${s.completed ? 'bg-primary' : 'bg-gray-700/50'}`}></div>
                     ))}
                   </div>
                 </div>
               ))}
             </div>
           </section>
        </div>
      </div>
    </div>
  );
}
