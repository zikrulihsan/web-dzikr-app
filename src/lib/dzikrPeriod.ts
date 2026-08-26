import type { DzikrPeriod } from '@/data/dzikrData';

/**
 * Dzikir pagi runs from before Shubuh until mid-afternoon; dzikir petang takes
 * over around Ashar and holds through the night. The boundaries are read off
 * the device clock, so the app follows whichever timezone the reader is in
 * without asking for a location.
 */
export const PAGI_START_HOUR = 3;
export const PETANG_START_HOUR = 15;

export function detectPeriod(now: Date = new Date()): DzikrPeriod {
  const hour = now.getHours();
  return hour >= PAGI_START_HOUR && hour < PETANG_START_HOUR ? 'pagi' : 'petang';
}

export const periodLabel: Record<DzikrPeriod, string> = {
  pagi: 'Dzikir Pagi',
  petang: 'Dzikir Petang',
};

export const periodShortLabel: Record<DzikrPeriod, string> = {
  pagi: 'Pagi',
  petang: 'Petang',
};
