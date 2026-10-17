'use client';

import { useEffect, useRef } from 'react';
import { totalCompleted, useDzikrStore } from '@/store/dzikrStore';
import { setDisplayName, syncDailyTotal } from './dzikrSync';
import { updatePresence } from './usePresence';

/**
 * Watches local dzikr progress and debounce-pushes the day's total reps to
 * Supabase so it counts toward the leaderboard, and mirrors the reader's
 * display name to their profile. Mount once (e.g. in DzikrSlider).
 * Keeps the checklist offline-first: local state is the source of truth, the
 * backend just mirrors the running total.
 */
export function useScoreSync() {
  const progress = useDzikrStore((s) => s.progress);
  const displayName = useDzikrStore((s) => s.settings.displayName ?? '');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nameTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const syncedName = useRef<string | null>(null);

  useEffect(() => {
    const total = totalCompleted(progress);
    // Presence is throttled on its own, so others see the count move live.
    updatePresence({ total });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      void syncDailyTotal(total);
    }, 1500);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [progress]);

  useEffect(() => {
    const name = displayName.trim();
    updatePresence({ name });
    // Nothing chosen yet: the profile keeps its "Hamba Allah" default.
    if (syncedName.current === null && !name) return;
    if (syncedName.current === name) return;
    if (nameTimer.current) clearTimeout(nameTimer.current);
    nameTimer.current = setTimeout(() => {
      syncedName.current = name;
      void setDisplayName(name);
    }, 800);

    return () => {
      if (nameTimer.current) clearTimeout(nameTimer.current);
    };
  }, [displayName]);
}
