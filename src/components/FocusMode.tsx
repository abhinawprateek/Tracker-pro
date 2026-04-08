import { useState, useEffect } from 'react';
import { X, Play, Pause, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../context/StoreContext';

export default function FocusMode({ session, onClose }: { session: any, onClose: () => void }) {
  const { logTimeSpent, markSessionComplete, timetable } = useAppStore();
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 mins by default
  const [isActive, setIsActive] = useState(false);
  const [timeLogged, setTimeLogged] = useState(0);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
        setTimeLogged(t => t + 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      logTimeSpent(Math.floor(timeLogged / 60));
      // Optionally auto-complete
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, timeLogged, logTimeSpent]);

  const handleClose = () => {
    if (timeLogged > 60) logTimeSpent(Math.floor(timeLogged / 60));
    onClose();
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-secondary border border-gray-700 shadow-2xl rounded-3xl p-8 relative flex flex-col items-center">
        <button onClick={handleClose} className="absolute top-6 right-6 text-gray-400 hover:text-white">
          <X size={28} />
        </button>

        <h2 className="text-xl font-bold text-gray-300 uppercase tracking-widest mb-2">Focus Mode</h2>
        <h3 className="text-2xl text-white font-black text-center mb-8">{session.topic}</h3>

        <div className="text-8xl font-black tabular-nums tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-primary to-blue-500 my-8">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>

        <div className="flex gap-4 w-full mt-6">
          <button 
            onClick={() => setIsActive(!isActive)} 
            className="flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 text-white transition-all shadow-lg shadow-primary/20"
          >
            {isActive ? <><Pause /> Pause</> : <><Play /> Start Focus</>}
          </button>
          <button 
            onClick={() => {
              const currentDayName = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
              markSessionComplete(currentDayName, session.id);
              handleClose();
            }} 
            className="w-16 h-[56px] rounded-2xl border border-gray-700 bg-[#121212] flex items-center justify-center text-green-500 hover:bg-gray-800 transition-all"
          >
            <CheckCircle2 size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
