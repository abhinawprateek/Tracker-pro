import { useState, useEffect } from 'react';
import { useAppStore } from '../context/StoreContext';

type ProjectLog = { d: string, c: string };

export default function ProjectTab() {
  const [logs, setLogs] = useState<ProjectLog[]>([]);
  const [currentText, setCurrentText] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('prodProjectLogs');
    if (saved) setLogs(JSON.parse(saved));
    else {
      const defaults = [
        {d: 'Today', c: 'Started utilizing Tracker PRO V2 capabilities.'},
      ];
      setLogs(defaults);
      localStorage.setItem('prodProjectLogs', JSON.stringify(defaults));
    }
  }, []);

  const saveLog = () => {
    if (!currentText.trim()) return;
    const dateStr = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    const updated = [{ d: dateStr, c: currentText }, ...logs];
    setLogs(updated);
    localStorage.setItem('prodProjectLogs', JSON.stringify(updated));
    setCurrentText('');
  };

  return (
    <div className="p-4 md:p-8 w-full max-w-5xl mx-auto">
      <header className="mb-8">
        <h2 className="text-3xl font-extrabold text-white">Project Logbook</h2>
        <p className="text-gray-400 mt-2">Track daily specific application updates and monitor development speed.</p>
      </header>

      <div className="bg-secondary border border-gray-800 rounded-3xl p-6 shadow-xl mb-8">
        <h3 className="text-lg font-bold mb-4 text-purple-400">Log Today's Feature Shipped</h3>
        <textarea 
          value={currentText}
          onChange={e => setCurrentText(e.target.value)}
          placeholder="What did you build today?"
          className="w-full bg-[#121212] border border-gray-700 rounded-2xl p-4 text-white focus:outline-none focus:border-purple-500 transition-colors min-h-[100px]"
        ></textarea>
        <div className="mt-4 flex justify-end">
          <button onClick={saveLog} className="px-6 py-2 bg-purple-600 text-white font-bold rounded-xl shadow-lg hover:bg-purple-500 transition-colors">
            Ship It 🚀
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold mb-4">Development Timeline</h3>
        <div className="relative border-l-2 border-gray-800 pl-6 ml-4 space-y-8">
          {logs.map((log, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-[35px] top-1 w-4 h-4 rounded-full bg-purple-500 ring-4 ring-background"></div>
              <p className="text-xs text-purple-400 font-bold mb-1 uppercase tracking-wider">{log.d}</p>
              <div className="bg-[#121212] p-4 rounded-2xl border border-gray-800/50">
                <p className="text-gray-300">{log.c}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
