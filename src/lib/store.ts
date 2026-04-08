'use client';
import { useState, useEffect } from 'react';
import { DayPlan, defaultTimetable } from './data';

export type UserStats = {
  xp: number;
  level: number;
  currentStreak: number;
  highestStreak: number;
  lastLogin: string;
};

export type TimetableState = DayPlan[];

export const useStore = () => {
  const [stats, setStats] = useState<UserStats>({
    xp: 0,
    level: 1,
    currentStreak: 0,
    highestStreak: 0,
    lastLogin: new Date().toISOString().split('T')[0],
  });
  const [timetable, setTimetable] = useState<TimetableState>(defaultTimetable);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load from local storage
    const savedStats = localStorage.getItem('prodStats');
    const savedTimetable = localStorage.getItem('prodTimetable');

    if (savedStats) setStats(JSON.parse(savedStats));
    if (savedTimetable) setTimetable(JSON.parse(savedTimetable));
    
    setIsLoaded(true);
  }, []);

  const saveStats = (newStats: UserStats) => {
    setStats(newStats);
    localStorage.setItem('prodStats', JSON.stringify(newStats));
  };

  const saveTimetable = (newTimetable: TimetableState) => {
    setTimetable(newTimetable);
    localStorage.setItem('prodTimetable', JSON.stringify(newTimetable));
  };

  // Helper function to calculate level based on XP (e.g. 1 level per 100 XP)
  const calculateLevel = (xp: number) => Math.floor(xp / 100) + 1;

  const markSessionComplete = (dayName: string, sessionId: string) => {
    const updated = timetable.map(day => {
      if (day.day !== dayName) return day;
      const updatedSessions = day.sessions.map(s => {
        if (s.id !== sessionId) return s;
        return { ...s, completed: !s.completed };
      });
      return { ...day, sessions: updatedSessions };
    });

    saveTimetable(updated);

    // Simplistic XP addition (toggle gives 10xp)
    const newXp = stats.xp + 10;
    saveStats({
      ...stats,
      xp: newXp,
      level: calculateLevel(newXp)
    });
  };

  return { stats, timetable, markSessionComplete, isLoaded };
};
