'use client';
import { useState } from 'react';
import Navigation from '../components/Navigation';
import DashboardTab from '../components/DashboardTab';
import DsaTab from '../components/DsaTab';
import ProjectTab from '../components/ProjectTab';
import AnalyticsTab from '../components/AnalyticsTab';
import WeeklyReviewTab from '../components/WeeklyReviewTab';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background relative pb-20 md:pb-0">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 w-full overflow-y-auto">
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'dsa' && <DsaTab />}
        {activeTab === 'projects' && <ProjectTab />}
        {activeTab === 'analytics' && <AnalyticsTab />}
        {activeTab === 'review' && <WeeklyReviewTab />}
      </main>
    </div>
  );
}
