import type { DzikrPeriod } from '@/data/dzikrData';
import { getPrayerTimes, readStoredLocation, type Coordinates } from './prayerTimes';

/**
 * Dzikir pagi runs from Subuh until Ashar; dzikir petang takes over at Ashar
 * and holds through the night until the next Subuh. Both boundaries come from
 * prayer times for the reader's location (their time zone's city until they share one), so
 * the switch follows the sun rather than a fixed hour.
 */
export function detectPeriod(
  now: Date = new Date(),
  location: Coordinates = typeof window === 'undefined' ? { latitude: 0, longitude: 0 } : readStoredLocation(),
): DzikrPeriod {
  const times = getPrayerTimes(now, location);
  const subuh = times.find((prayer) => prayer.name === 'subuh')!.time;
  const ashar = times.find((prayer) => prayer.name === 'ashar')!.time;
  return now >= subuh && now < ashar ? 'pagi' : 'petang';
}

export const periodLabel: Record<DzikrPeriod, string> = {
  pagi: 'Dzikir Pagi',
  petang: 'Dzikir Petang',
};

export const periodShortLabel: Record<DzikrPeriod, string> = {
  pagi: 'Pagi',
  petang: 'Petang',
};
