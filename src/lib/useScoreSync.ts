'use client';

import { useEffect, useRef } from 'react';
import { useDzikrStore } from '@/store/dzikrStore';
import { syncDailyTotal } from './dzikrSync';
import { isSupabaseConfigured } from './supabase';

/**
 * Watches local dzikr progress and debounce-pushes the day's total reps to
 * Supabase so it counts toward the leaderboard. Mount once (e.g. in DzikrSlider).
 * Keeps the checklist offline-first: local state is the source of truth, the
 * backend just mirrors the running total.
 */
export function useScoreSync() {
  const progress = useDzikrStore((s) => s.progress);
  const ensureToday = useDzikrStore((s) => s.ensureToday);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSent = useRef<number | null>(null);

  // Roll over to a clean day before anything reads the persisted progress.
  useEffect(() => {
    ensureToday();
  }, [ensureToday]);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const total = progress.reduce((sum, p) => sum + p.completed, 0);
    // Nothing read yet today — don't create an empty row just because the app
    // was opened. Also skip re-sending a total the server already has.
    if (total === 0 || total === lastSent.current) return;

    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      void syncDailyTotal(total).then((ok) => {
        if (ok) lastSent.current = total;
      });
    }, 1500);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [progress]);
}
