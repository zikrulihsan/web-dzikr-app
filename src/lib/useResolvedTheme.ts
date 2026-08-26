'use client';

import { useEffect, useState } from 'react';
import { useDzikrStore } from '@/store/dzikrStore';

export type ResolvedTheme = 'light' | 'dark';

/**
 * Turns the stored preference into the theme actually painted. On 'auto' it
 * follows the operating system and keeps following it while the app is open.
 */
export function useResolvedTheme(): ResolvedTheme {
  const theme = useDzikrStore((state) => state.settings.theme ?? 'auto');
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>('light');

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;

    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const sync = () => setSystemTheme(query.matches ? 'dark' : 'light');
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  return theme === 'auto' ? systemTheme : theme;
}
