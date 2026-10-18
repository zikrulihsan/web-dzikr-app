/**
 * Prayer times computed on the device, following the Kemenag RI convention:
 * Subuh at 20° below the horizon, Isya at 18°, Ashar at shadow length 1
 * (Syafi'i), plus two minutes of ihtiyat on every time. No network call: the
 * sun's position only needs the date and the reader's coordinates.
 */

export type PrayerName = 'subuh' | 'dzuhur' | 'ashar' | 'maghrib' | 'isya';

export interface PrayerTime {
  name: PrayerName;
  time: Date;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface PrayerLocation extends Coordinates {
  /** True when the coordinates came from the device rather than the fallback. */
  isDevice: boolean;
}

export const prayerLabel: Record<PrayerName, string> = {
  subuh: 'Subuh',
  dzuhur: 'Dzuhur',
  ashar: 'Ashar',
  maghrib: 'Maghrib',
  isya: 'Isya',
};

/** Used until (or unless) the reader shares their location. */
export const FALLBACK_LOCATION: PrayerLocation = {
  latitude: -6.2088,
  longitude: 106.8456,
  isDevice: false,
};

const FAJR_ANGLE = 20;
const ISHA_ANGLE = 18;
const SUNSET_ANGLE = 0.833;
const IHTIYAT_MINUTES = 2;
const LOCATION_KEY = 'dzikr-location';

const rad = (degrees: number) => (degrees * Math.PI) / 180;
const deg = (radians: number) => (radians * 180) / Math.PI;

/** Sun declination (degrees) and equation of time (hours) for a Julian day. */
const sunPosition = (julianDay: number) => {
  const d = julianDay - 2451545.0;
  const g = rad((357.529 + 0.98560028 * d) % 360);
  const q = (280.459 + 0.98564736 * d) % 360;
  const l = rad((q + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) % 360);
  const e = rad(23.439 - 0.00000036 * d);

  const declination = deg(Math.asin(Math.sin(e) * Math.sin(l)));
  let rightAscension = deg(Math.atan2(Math.cos(e) * Math.sin(l), Math.cos(l))) / 15;
  rightAscension = ((rightAscension % 24) + 24) % 24;
  let equation = q / 15 - rightAscension;
  equation -= 24 * Math.round(equation / 24);

  return { declination, equation };
};

/** Hours between solar noon and the moment the sun reaches `altitude`. */
const hourAngle = (altitude: number, latitude: number, declination: number) => {
  const cosine =
    (Math.sin(rad(altitude)) - Math.sin(rad(latitude)) * Math.sin(rad(declination))) /
    (Math.cos(rad(latitude)) * Math.cos(rad(declination)));
  // Beyond the polar circles some times never happen; clamp to keep a value.
  return deg(Math.acos(Math.min(1, Math.max(-1, cosine)))) / 15;
};

/** The five prayers of the local calendar day containing `date`. */
export function getPrayerTimes(date: Date, { latitude, longitude }: Coordinates): PrayerTime[] {
  // Midnight UTC of the reader's local date; times are then offsets in UTC hours.
  const dayStart = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const julianDay = dayStart / 86_400_000 + 2440587.5 - longitude / 360 + 0.5;
  const { declination, equation } = sunPosition(julianDay);

  const noon = 12 - longitude / 15 - equation;
  const asrAltitude = deg(Math.atan(1 / (1 + Math.tan(rad(Math.abs(latitude - declination))))));

  const hours: Record<PrayerName, number> = {
    subuh: noon - hourAngle(-FAJR_ANGLE, latitude, declination),
    dzuhur: noon,
    ashar: noon + hourAngle(asrAltitude, latitude, declination),
    maghrib: noon + hourAngle(-SUNSET_ANGLE, latitude, declination),
    isya: noon + hourAngle(-ISHA_ANGLE, latitude, declination),
  };

  // An eastern longitude puts Subuh before 00:00 UTC, so the instants may land
  // on the neighbouring UTC date; that is still the right local moment.
  return (Object.keys(hours) as PrayerName[]).map((name) => ({
    name,
    time: new Date(
      Math.ceil((dayStart + (hours[name] * 60 + IHTIYAT_MINUTES) * 60_000) / 60_000) * 60_000,
    ),
  }));
}

/** The first prayer still ahead of `now`, rolling over to tomorrow's Subuh. */
export function getNextPrayer(now: Date, coordinates: Coordinates): PrayerTime {
  const upcoming = getPrayerTimes(now, coordinates).find((prayer) => prayer.time > now);
  if (upcoming) return upcoming;
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return getPrayerTimes(tomorrow, coordinates)[0];
}

/** The last prayer whose time has come, reaching back to yesterday's Isya. */
export function getPreviousPrayer(now: Date, coordinates: Coordinates): PrayerTime {
  const passed = getPrayerTimes(now, coordinates).filter((prayer) => prayer.time <= now);
  if (passed.length) return passed[passed.length - 1];
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  return getPrayerTimes(yesterday, coordinates)[4];
}

export function readStoredLocation(): PrayerLocation {
  try {
    const raw = window.localStorage.getItem(LOCATION_KEY);
    if (!raw) return FALLBACK_LOCATION;
    const parsed = JSON.parse(raw) as Partial<Coordinates>;
    if (typeof parsed.latitude === 'number' && typeof parsed.longitude === 'number') {
      return { latitude: parsed.latitude, longitude: parsed.longitude, isDevice: true };
    }
  } catch {
    /* storage blocked or corrupt: fall through */
  }
  return FALLBACK_LOCATION;
}

export function storeLocation({ latitude, longitude }: Coordinates) {
  try {
    // Two decimals (~1 km) is plenty for prayer times and keeps less detail.
    const rounded = { latitude: Number(latitude.toFixed(2)), longitude: Number(longitude.toFixed(2)) };
    window.localStorage.setItem(LOCATION_KEY, JSON.stringify(rounded));
  } catch {
    /* ignore */
  }
}
