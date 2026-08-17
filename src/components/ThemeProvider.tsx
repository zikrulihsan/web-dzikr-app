'use client';

import React, { useEffect } from 'react';
import { useDzikrStore } from '@/store/dzikrStore';

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { settings, ensureToday } = useDzikrStore();

  // Progress is persisted without a date of its own, so drop yesterday's counts
  // before any screen reads them. Wraps every route, including /community and
  // /leaderboard, which show the day's total too.
  useEffect(() => {
    ensureToday();
  }, [ensureToday]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
  }, [settings.theme]);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      backgroundColor: 'var(--background-color)',
      color: 'var(--text-primary)',
      transition: 'background-color 0.3s ease, color 0.3s ease'
    }}>
      {children}
    </div>
  );
};

export default ThemeProvider;
