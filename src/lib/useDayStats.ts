'use client';

import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { localDayKey } from './localDay';
import { fetchDayStats, subscribeLeaderboard, type DayStats } from './dzikrSync';

// Every rep anyone reads lands as a score change; batch the refetches.
const REFRESH_DEBOUNCE_MS = 1500;

/**
 * Live "dzikir hari ini" figures for the reader's local day: refetched shortly
 * after anyone's score changes, and from scratch when the date rolls over.
 * Null until loaded, or when Supabase isn't configured.
 */
export function useDayStats(): DayStats | null {
  const [stats, setStats] = useState<DayStats | null>(null);
  const [day, setDay] = useState(localDayKey);

  useEffect(() => {
    const check = () => setDay(localDayKey());
    const timer = window.setInterval(check, 60_000);
    document.addEventListener('visibilitychange', check);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', check);
    };
  }, []);

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    let pending: ReturnType<typeof setTimeout> | null = null;

    const load = async () => {
      const next = await fetchDayStats(day);
      if (active && next) setStats(next);
    };
    void load();

    const unsubscribe = subscribeLeaderboard(() => {
      if (pending) return;
      pending = setTimeout(() => {
        pending = null;
        void load();
      }, REFRESH_DEBOUNCE_MS);
    }, day);

    return () => {
      active = false;
      if (pending) clearTimeout(pending);
      unsubscribe();
    };
  }, [day]);

  return stats;
}
