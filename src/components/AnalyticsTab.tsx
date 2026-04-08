import { useState } from 'react';
import { useAppStore } from '../context/StoreContext';
import { Target, Search, Clock, Award, Flame, CheckCircle, Bell } from 'lucide-react';

export default function AnalyticsTab() {
  const { stats, distractions, addDistraction } = useAppStore();
  const [distractionReason, setDistractionReason] = useState('');
  const [distractionMins, setDistractionMins] = useState('');

  const handleLog = () => {
    if (distractionReason && Number(distractionMins) > 0) {
      addDistraction(distractionReason, Number(distractionMins));
      setDistractionReason('');
      setDistractionMins('');
    }
  };

  const requestNotifications = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('Enabled!', { body: 'We will now send you smart session reminders and streak warnings.' });
        }
      });
    } else {
      alert("Browser doesn't support notifications");
    }
  };

  const totalDistractions = distractions.reduce((acc, curr) => acc + curr.duration, 0);

  return (
    <div className="p-4 md:p-8 w-full max-w-5xl mx-auto">
      <header className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-white">Analytics Hub</h2>
          <p className="text-gray-400 mt-2">Study hours, score intelligence, and distraction tracking.</p>
        </div>
        <button onClick={requestNotifications} className="bg-[#121212] border border-gray-700 hover:bg-gray-800 text-gray-300 px-4 py-2 rounded-xl flex items-center gap-2 font-bold transition text-sm">
          <Bell size={18} className="text-yellow-500" /> Notifications
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-secondary p-6 rounded-3xl border border-gray-800 shadow-xl flex flex-col justify-center text-center relative overflow-hidden">
           <div className={`absolute -right-4 -bottom-4 w-32 h-32 rounded-full blur-3xl opacity-20 ${stats.productivityScore > 75 ? 'bg-green-500' : stats.productivityScore > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
           <span className="text-sm text-gray-400 font-bold uppercase tracking-wider">Productivity Score</span>
           <span className={`text-6xl font-black mt-2 ${stats.productivityScore > 75 ? 'text-green-400' : stats.productivityScore > 40 ? 'text-yellow-400' : 'text-red-400'}`}>
             {stats.productivityScore}%
           </span>
        </div>
        
        <div className="md:col-span-2 bg-secondary p-6 rounded-3xl border border-gray-800 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold mb-2 text-white">Distraction / Time Waster Log</h3>
            <p className="text-sm text-gray-400 mb-4">Log wasted time to improve self-awareness. Heavy distractions drop your productivity score.</p>
            <div className="flex gap-2">
               <input 
                 type="text" value={distractionReason} onChange={e=>setDistractionReason(e.target.value)} 
                 placeholder="e.g. Scrolled reels" 
                 className="flex-1 bg-[#121212] border border-gray-700 rounded-xl px-4 text-white focus:border-red-500 focus:outline-none" 
               />
               <input 
                 type="number" value={distractionMins} onChange={e=>setDistractionMins(e.target.value)} 
                 placeholder="Mins" 
                 className="w-20 bg-[#121212] border border-gray-700 rounded-xl px-4 text-white focus:border-red-500 focus:outline-none" 
               />
               <button onClick={handleLog} className="bg-red-500/20 text-red-500 px-6 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-colors">Log</button>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-4">
             <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Total Wasted This Week</span>
                <span className="text-red-400 font-bold text-lg">{Math.floor(totalDistractions / 60)}h {totalDistractions % 60}m</span>
             </div>
          </div>
        </div>
      </div>
      
      {/* List of distractions */}
      {distractions.length > 0 && (
        <div className="bg-secondary p-6 rounded-3xl border border-gray-800">
           <h3 className="font-bold mb-4">Recent Distractions</h3>
           <div className="space-y-2">
             {distractions.slice().reverse().slice(0, 5).map((d, i) => (
                <div key={i} className="flex justify-between items-center bg-[#121212] p-3 rounded-xl border border-gray-800">
                   <span className="text-gray-300">{d.reason}</span>
                   <span className="text-red-400 bg-red-400/10 px-2 py-1 rounded font-bold text-xs">{d.duration}m</span>
                </div>
             ))}
           </div>
        </div>
      )}

    </div>
  );
}
