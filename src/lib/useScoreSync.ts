'use client';

import { useEffect, useRef } from 'react';
import { useDzikrStore } from '@/store/dzikrStore';
import { syncDailyTotal } from './dzikrSync';

/**
 * Watches local dzikr progress and debounce-pushes the day's total reps to
 * Supabase so it counts toward the leaderboard. Mount once (e.g. in DzikrSlider).
 * Keeps the checklist offline-first: local state is the source of truth, the
 * backend just mirrors the running total.
 */
export function useScoreSync() {
  const progress = useDzikrStore((s) => s.progress);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const total = progress.reduce((sum, p) => sum + p.completed, 0);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      void syncDailyTotal(total);
    }, 1500);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [progress]);
}
