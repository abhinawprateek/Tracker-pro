import { useAppStore } from '../context/StoreContext';
import { Calendar, CheckCircle, TrendingUp, Download } from 'lucide-react';
import React, { useRef } from 'react';

export default function WeeklyReviewTab() {
  const { stats, timetable, missedTasksCount } = useAppStore();
  const reportRef = useRef<HTMLDivElement>(null);

  const totalSessions = timetable.reduce((acc, curr) => acc + curr.sessions.length, 0);
  const completedSessions = timetable.reduce((acc, curr) => acc + curr.sessions.filter(s => s.completed).length, 0);
  const percentComplete = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

  const downloadPDF = async () => {
    // Basic dynamic import for html2pdf
    const html2pdf = (await import('html2pdf.js' as any)).default;
    const element = reportRef.current;
    if (!element) return;
    html2pdf().from(element).set({
      margin: 1,
      filename: `Weekly_Report_${new Date().toLocaleDateString()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }).save();
  };

  return (
    <div className="p-4 md:p-8 w-full max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <header>
          <h2 className="text-3xl font-extrabold text-white">Weekly Review</h2>
          <p className="text-gray-400 mt-2">Analyze your past week's performance.</p>
        </header>

        <button onClick={downloadPDF} className="bg-primary/20 hover:bg-primary/40 text-primary px-4 py-2 rounded-xl flex items-center gap-2 font-bold transition">
          <Download size={20} /> <span className="hidden sm:block">Export PDF</span>
        </button>
      </div>

      {/* The Printable Container */}
      <div ref={reportRef} className="space-y-6">
        <div className="bg-secondary p-6 rounded-3xl border border-gray-800 shadow-xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-500/20 text-blue-500 rounded-2xl"><Calendar /></div>
            <h3 className="text-xl font-bold">Week at a Glance</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-[#121212] rounded-2xl border border-gray-800 text-center">
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wide">Total Hours</span>
              <p className="text-3xl font-black text-white mt-1">{stats.totalHoursStudied.toFixed(1)}h</p>
            </div>
            <div className="p-4 bg-[#121212] rounded-2xl border border-gray-800 text-center">
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wide">Completed</span>
              <p className="text-3xl font-black text-white mt-1">{completedSessions}/{totalSessions}</p>
            </div>
            <div className="p-4 bg-[#121212] rounded-2xl border border-gray-800 text-center">
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wide">Success Rate</span>
              <p className="text-3xl font-black text-green-400 mt-1">{percentComplete}%</p>
            </div>
            <div className="p-4 bg-[#121212] rounded-2xl border border-gray-800 text-center">
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wide">Missed</span>
              <p className="text-3xl font-black text-red-500 mt-1">{missedTasksCount}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-secondary p-6 rounded-3xl border border-gray-800">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><TrendingUp size={20} className="text-primary"/> Performance By Day</h3>
              <div className="space-y-3">
                 {timetable.map(d => {
                   const dComplete = d.sessions.filter(s => s.completed).length;
                   const dTotal = d.sessions.length;
                   const pct = dTotal > 0 ? (dComplete/dTotal)*100 : 0;
                   return (
                     <div key={d.day}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-300 font-medium">{d.day}</span>
                          <span className="text-gray-500">{dComplete}/{dTotal}</span>
                        </div>
                        <div className="w-full bg-[#121212] h-2 rounded-full overflow-hidden">
                          <div className={`h-full ${pct === 100 ? 'bg-green-500' : 'bg-primary'} transition-all`} style={{width: `${pct}%`}}></div>
                        </div>
                     </div>
                   );
                 })}
              </div>
           </div>

           <div className="bg-gradient-to-tr from-green-900/20 to-blue-900/20 p-6 rounded-3xl border border-green-500/20">
              <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center gap-2"><CheckCircle /> Week Summary</h3>
              {percentComplete >= 80 ? (
                <p className="text-gray-300 text-lg leading-relaxed">
                  Stellar performance! You maintained excellent consistency. With a <strong>{percentComplete}%</strong> completion rate, you are well on your way to mastering everything assigned.
                </p>
              ) : percentComplete > 40 ? (
                <p className="text-gray-300 text-lg leading-relaxed">
                  Decent effort! You're making progress. Focus on hitting the remaining sessions you skipped ({missedTasksCount} missed). Utilize the Carry Forward feature to stay caught up.
                </p>
              ) : (
                <p className="text-gray-300 text-lg leading-relaxed">
                  It was a slow week. Your completion rested at <strong>{percentComplete}%</strong>. Take time to analyze distractions on the Analytics tab and adjust your weekly volume if it's too high.
                </p>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
