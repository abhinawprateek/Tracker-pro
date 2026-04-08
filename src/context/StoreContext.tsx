'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DayPlan, defaultTimetable, Session } from '../lib/data';

export type UserStats = {
  xp: number;
  level: number;
  currentStreak: number;
  highestStreak: number;
  lastLogin: string;
  productivityScore: number;
  totalHoursStudied: number;
};

export type StoreContextType = {
  stats: UserStats;
  timetable: DayPlan[];
  isLoaded: boolean;
  markSessionComplete: (dayName: string, sessionId: string) => void;
  logTimeSpent: (minutes: number) => void;
  carryForwardMissedTasks: () => void;
  missedTasksCount: number;
  // Goals and Distractions
  goals: { dsaCount: number; targetStudyHours: number };
  distractions: { reason: string; duration: number }[];
  addDistraction: (reason: string, duration: number) => void;
  updateGoals: (goals: any) => void;
};

const defaultContextVal: StoreContextType = {
  stats: { xp: 0, level: 1, currentStreak: 0, highestStreak: 0, lastLogin: '', productivityScore: 0, totalHoursStudied: 0 },
  timetable: defaultTimetable,
  isLoaded: false,
  markSessionComplete: () => {},
  logTimeSpent: () => {},
  carryForwardMissedTasks: () => {},
  missedTasksCount: 0,
  goals: { dsaCount: 0, targetStudyHours: 0 },
  distractions: [],
  addDistraction: () => {},
  updateGoals: () => {},
};

export const StoreContext = createContext<StoreContextType>(defaultContextVal);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState(defaultContextVal.stats);
  const [timetable, setTimetable] = useState(defaultContextVal.timetable);
  const [goals, setGoals] = useState(defaultContextVal.goals);
  const [distractions, setDistractions] = useState(defaultContextVal.distractions);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load state
    const savedStats = localStorage.getItem('prodStatsV2');
    const savedTimetable = localStorage.getItem('prodTimetableV2');
    const savedGoals = localStorage.getItem('prodGoals');
    const savedDistractions = localStorage.getItem('prodDistractions');

    if (savedStats) setStats(JSON.parse(savedStats));
    else localStorage.setItem('prodStatsV2', JSON.stringify(defaultContextVal.stats));

    if (savedTimetable) setTimetable(JSON.parse(savedTimetable));
    else localStorage.setItem('prodTimetableV2', JSON.stringify(defaultTimetable)); // Can keep default structure

    if (savedGoals) setGoals(JSON.parse(savedGoals));
    if (savedDistractions) setDistractions(JSON.parse(savedDistractions));

    setIsLoaded(true);
    
    // Check for streak logic on login (if last login was yesterday, keep, if earlier, reset)
    const today = new Date().toISOString().split('T')[0];
    // Basic streak integration goes here typically
  }, []);

  // Save wrappers
  const saveStats = (newStats: UserStats) => {
    setStats(newStats);
    localStorage.setItem('prodStatsV2', JSON.stringify(newStats));
  };
  const saveTimetable = (newTimetable: DayPlan[]) => {
    setTimetable(newTimetable);
    localStorage.setItem('prodTimetableV2', JSON.stringify(newTimetable));
  };

  const calculateLevel = (xp: number) => Math.floor(xp / 100) + 1;

  const getDayName = (dateStr?: string) => {
     const d = dateStr ? new Date(dateStr) : new Date();
     return d.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  };

  const markSessionComplete = (dayName: string, sessionId: string) => {
    const updated = timetable.map(day => {
      if (day.day !== dayName) return day;
      return {
        ...day,
        sessions: day.sessions.map(s => s.id === sessionId ? { ...s, completed: !s.completed } : s)
      };
    });

    saveTimetable(updated);

    // Productivity & Gamification hooks (Naive approach for checking toggles)
    const newXp = stats.xp + 10;
    saveStats({
      ...stats,
      xp: newXp,
      level: calculateLevel(newXp),
      // Boost productivity score artificially for completion
      productivityScore: Math.min(100, stats.productivityScore + 5)
    });
  };

  const logTimeSpent = (minutes: number) => {
    saveStats({
      ...stats,
      totalHoursStudied: stats.totalHoursStudied + (minutes / 60)
    });
  };

  const addDistraction = (reason: string, duration: number) => {
    const fresh = [...distractions, { reason, duration }];
    setDistractions(fresh);
    localStorage.setItem('prodDistractions', JSON.stringify(fresh));
    
    // Drop productivity score
    saveStats({
      ...stats,
      productivityScore: Math.max(0, stats.productivityScore - (duration > 15 ? 10 : 2))
    });
  };

  const updateGoals = (newGoals: any) => {
    setGoals(newGoals);
    localStorage.setItem('prodGoals', JSON.stringify(newGoals));
  };

  const missedTasksCount = timetable.reduce((acc, day) => {
    // Only grab missed tasks from days PRIOR to today.
    const dayIdx = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'].indexOf(day.day);
    const currDayIdx = new Date().getDay();
    if (dayIdx >= currDayIdx) return acc;
    return acc + day.sessions.filter(s => !s.completed).length;
  }, 0);

  const carryForwardMissedTasks = () => {
    // Collect all missed tasks prior to today
    const currDayIdx = new Date().getDay();
    let forwardTasks: Session[] = [];
    const clearedTimetable = timetable.map(day => {
      const idx = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'].indexOf(day.day);
      if (idx >= currDayIdx) return day; // Do not touch today or future
      
      const uncompleted = day.sessions.filter(s => !s.completed);
      forwardTasks = [...forwardTasks, ...uncompleted];
      
      return {
        ...day, 
        sessions: day.sessions.filter(s => s.completed) // Delete missed from old days
      };
    });

    // Append them to today
    const currentName = getDayName();
    const finalTable = clearedTimetable.map(d => {
      if (d.day === currentName) {
        return {
           ...d,
           sessions: [...d.sessions, ...forwardTasks.map(ft => ({...ft, id: ft.id+'_cf'}))] // Add suffix for duplicates
        };
      }
      return d;
    });

    saveTimetable(finalTable);
  };

  return (
    <StoreContext.Provider value={{
      stats, timetable, isLoaded, markSessionComplete, logTimeSpent,
      carryForwardMissedTasks, missedTasksCount,
      goals, distractions, addDistraction, updateGoals
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useAppStore = () => useContext(StoreContext);
