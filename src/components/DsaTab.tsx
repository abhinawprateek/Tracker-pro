import { useState } from 'react';
import { useAppStore } from '../context/StoreContext';
import { Target, AlertTriangle, Lightbulb } from 'lucide-react';

export default function DsaTab() {
  const { timetable, goals, updateGoals } = useAppStore();
  const [dsaGoalInput, setDsaGoalInput] = useState(goals.dsaCount || 10);

  // Analyze Timetable for DSA progress
  let dsaTotal = 0;
  let dsaCompleted = 0;
  
  // Weak area string map
  const topicFrequency: Record<string, { total: number; missed: number }> = {};

  timetable.forEach(day => {
    day.sessions.forEach(s => {
      // Find sessions labeled DSA
      if (s.topic.toUpperCase().includes('DSA') || s.topic.toUpperCase().includes('DATA STRUCTURE')) {
        dsaTotal++;
        if (s.completed) dsaCompleted++;
        
        // Extract subtopic (e.g. "DSA -> Arrays")
        const subtopic = s.topic.split('->')[1]?.trim() || 'General';
        if (!topicFrequency[subtopic]) topicFrequency[subtopic] = { total: 0, missed: 0 };
        topicFrequency[subtopic].total++;
        if (!s.completed) topicFrequency[subtopic].missed++;
      }
    });
  });

  // Calculate weak areas (highest miss rate min 1 missed)
  const weakAreas = Object.entries(topicFrequency)
    .filter(([_, stats]) => stats.missed > 0)
    .sort((a, b) => (b[1].missed / b[1].total) - (a[1].missed / a[1].total))
    .slice(0, 3)
    .map(entry => entry[0]);

  const saveGoal = () => {
    updateGoals({ ...goals, dsaCount: dsaGoalInput });
  };

  return (
    <div className="p-4 md:p-8 w-full max-w-5xl mx-auto">
      <header className="mb-8">
        <h2 className="text-3xl font-extrabold text-white">DSA Tracker & Analysis</h2>
        <p className="text-gray-400 mt-2">Intelligent assessment of your Algorithms practice.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Goal System */}
        <div className="bg-secondary p-6 rounded-3xl border border-gray-800 shadow-xl">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Target className="text-primary"/> Weekly DSA Goal</h3>
          <div className="flex gap-4 items-center">
             <input type="number" value={dsaGoalInput} onChange={e => setDsaGoalInput(Number(e.target.value))} className="w-24 bg-[#121212] border border-gray-700 rounded-xl px-4 py-2 text-white text-xl text-center focus:border-primary focus:outline-none" />
             <button onClick={saveGoal} className="bg-primary/20 hover:bg-primary/40 text-primary px-4 py-3 rounded-xl font-bold transition">Set Goal</button>
          </div>
          
          <div className="mt-8 relative pt-6">
            <span className="absolute top-0 right-0 text-sm text-gray-500 font-bold">{dsaCompleted}/{goals.dsaCount || 10}</span>
            <div className="w-full bg-[#121212] h-4 rounded-full overflow-hidden">
               <div className="h-full bg-blue-500 transition-all duration-1000" style={{width: `${Math.min(100, (dsaCompleted / (goals.dsaCount || 10)) * 100)}%`}}></div>
            </div>
            {dsaCompleted >= (goals.dsaCount || 10) && <p className="text-green-400 mt-2 font-medium">Goal Achieved! Great job.</p>}
          </div>
        </div>

        {/* Intelligence / Weak Areas */}
        <div className="bg-secondary p-6 rounded-3xl border border-red-500/20 shadow-xl">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-red-400"><AlertTriangle /> Weak Area Detection</h3>
          {weakAreas.length > 0 ? (
            <div className="space-y-4">
               <p className="text-sm text-gray-300">Based on your incomplete timetable sessions, you are struggling with:</p>
               <div className="flex flex-wrap gap-2">
                 {weakAreas.map(wa => (
                   <span key={wa} className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-500 font-bold rounded-lg">{wa}</span>
                 ))}
               </div>
               <div className="mt-4 p-3 bg-[#121212] border border-gray-800 rounded-xl flex items-start gap-3">
                 <Lightbulb className="text-yellow-500 flex-shrink-0" size={20} />
                 <p className="text-xs text-gray-400 leading-relaxed">
                   <strong>Suggestion:</strong> Dedicate tomorrow's first focus session entirely to '{weakAreas[0]}'.
                 </p>
               </div>
            </div>
          ) : (
            <p className="text-gray-400">You don't have any major weak areas detected yet! Keep resolving your scheduled sessions.</p>
          )}
        </div>
      </div>
      
    </div>
  );
}
