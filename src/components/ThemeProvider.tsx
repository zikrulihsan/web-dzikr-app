'use client';

import React, { useEffect } from 'react';
import { useResolvedTheme } from '@/lib/useResolvedTheme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

// Mirrors --background-color for each palette, used for the browser chrome.
const THEME_COLOR = {
  light: '#f3f0e8',
  dark: '#212121',
} as const;

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const theme = useResolvedTheme();

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);

    // Keep the browser/status bar in step with the chosen theme rather than
    // with the system preference, which may well differ from it.
    let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.appendChild(meta);
    }
    meta.removeAttribute('media');
    meta.content = THEME_COLOR[theme];
  }, [theme]);

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
