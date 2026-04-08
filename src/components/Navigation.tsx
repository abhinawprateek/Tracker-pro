import { LayoutDashboard, Code2, FolderKanban, BarChart3, CalendarDays } from 'lucide-react';

export default function Navigation({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'dsa', label: 'DSA Tracker', icon: <Code2 size={20} /> },
    { id: 'projects', label: 'Projects', icon: <FolderKanban size={20} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
    { id: 'review', label: 'Review', icon: <CalendarDays size={20} /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-[#121212]/90 backdrop-blur-md border-t border-gray-800 z-50 md:sticky md:top-0 md:h-screen md:w-64 md:border-t-0 md:border-r flex md:flex-col justify-around md:justify-start py-4 md:p-6 transition-all">
      <div className="hidden md:block mb-10">
        <h2 className="text-2xl font-black bg-gradient-to-tr from-primary to-blue-500 bg-clip-text text-transparent">TrackerPRO</h2>
      </div>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex flex-col md:flex-row items-center gap-1 md:gap-3 p-3 md:py-4 md:px-5 rounded-2xl transition-all duration-300 md:mb-2 ${activeTab === tab.id ? 'bg-primary/20 text-primary font-bold' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'}`}
        >
          {tab.icon}
          <span className="text-[10px] md:text-sm uppercase tracking-wide">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
