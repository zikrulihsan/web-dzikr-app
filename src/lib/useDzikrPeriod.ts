'use client';

import { useEffect } from 'react';
import type { DzikrPeriod } from '@/data/dzikrData';
import { useDzikrStore } from '@/store/dzikrStore';
import { detectPeriod } from './dzikrPeriod';

/** The period on screen right now: the reader's explicit choice, or the clock. */
export function useActivePeriod(): DzikrPeriod {
  const preference = useDzikrStore((state) => state.settings.periodPreference ?? 'auto');
  const detected = useDzikrStore((state) => state.detectedPeriod);
  return preference === 'auto' ? detected : preference;
}

/**
 * Keeps the detected part of the day in step with the device clock so an open
 * tab flips from pagi to petang on its own, and starts a fresh checklist when
 * the date changes. Mount once (in DzikrSlider).
 */
export function usePeriodWatcher(): DzikrPeriod {
  const setDetectedPeriod = useDzikrStore((state) => state.setDetectedPeriod);
  const rolloverDay = useDzikrStore((state) => state.rolloverDay);

  useEffect(() => {
    const sync = () => {
      rolloverDay();
      setDetectedPeriod(detectPeriod());
    };
    sync();

    // A minute is plenty: the boundary only moves once per hour block, and a
    // phone waking from sleep is caught by the focus/visibility listeners.
    const timer = window.setInterval(sync, 60_000);
    document.addEventListener('visibilitychange', sync);
    window.addEventListener('focus', sync);

    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', sync);
      window.removeEventListener('focus', sync);
    };
  }, [rolloverDay, setDetectedPeriod]);

  return useActivePeriod();
}
