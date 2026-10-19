'use client';

import { useEffect, useState } from 'react';
import { useDzikrStore } from '@/store/dzikrStore';
import { detectPeriod } from './dzikrPeriod';
import {
  getNextPrayer,
  getPreviousPrayer,
  readStoredLocation,
  storeLocation,
  FALLBACK_LOCATION,
  type PrayerLocation,
  type PrayerTime,
} from './prayerTimes';

// One location request per page load, however many components ask.
let hasRequestedLocation = false;
const LOCATION_EVENT = 'dzikr-location-change';

interface PrayerState {
  location: PrayerLocation;
  next: PrayerTime | null;
  previous: PrayerTime | null;
  now: Date | null;
}

/**
 * The next prayer for the reader's location, refreshed every half minute.
 * Asks for the device location once per visit; a refusal (or no answer) keeps
 * the last known location, or a city in the device's time zone. A newly found location also re-checks
 * pagi/petang, since the Subuh and Ashar boundaries move with it.
 */
export function usePrayerTimes(): PrayerState {
  const setDetectedPeriod = useDzikrStore((state) => state.setDetectedPeriod);
  const [location, setLocation] = useState<PrayerLocation>(FALLBACK_LOCATION);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setLocation(readStoredLocation());
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 30_000);

    if (!hasRequestedLocation && 'geolocation' in navigator) {
      hasRequestedLocation = true;
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          storeLocation(coords);
          setLocation(readStoredLocation());
          setDetectedPeriod(detectPeriod());
          window.dispatchEvent(new Event(LOCATION_EVENT));
        },
        () => undefined,
        { maximumAge: 6 * 60 * 60 * 1000, timeout: 15_000 },
      );
    }

    const handleLocation = () => setLocation(readStoredLocation());
    window.addEventListener(LOCATION_EVENT, handleLocation);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener(LOCATION_EVENT, handleLocation);
    };
  }, [setDetectedPeriod]);

  return {
    location,
    now,
    next: now ? getNextPrayer(now, location) : null,
    previous: now ? getPreviousPrayer(now, location) : null,
  };
}

/** "2 jam 14 menit lagi", "14 menit lagi", "sebentar lagi". */
export function formatCountdown(from: Date, to: Date): string {
  const minutes = Math.max(0, Math.ceil((to.getTime() - from.getTime()) / 60_000));
  if (minutes < 1) return 'sebentar lagi';
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (!hours) return `${rest} menit lagi`;
  return rest ? `${hours} jam ${rest} menit lagi` : `${hours} jam lagi`;
}

export const formatClock = (date: Date) =>
  date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }).replace('.', ':');
