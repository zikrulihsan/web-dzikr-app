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
  /** For a fallback location: the city it stands for, shown next to the times. */
  place?: string;
}

export const prayerLabel: Record<PrayerName, string> = {
  subuh: 'Subuh',
  dzuhur: 'Dzuhur',
  ashar: 'Ashar',
  maghrib: 'Maghrib',
  isya: 'Isya',
};

/** Used on the server and wherever the device's time zone can't be read. */
export const FALLBACK_LOCATION: PrayerLocation = {
  latitude: -6.2088,
  longitude: 106.8456,
  isDevice: false,
  place: 'Jakarta',
};

// A representative city per time zone, so a reader who hasn't shared their
// location still gets times for roughly where they are.
const TIMEZONE_CITIES: Record<string, [place: string, latitude: number, longitude: number]> = {
  'Asia/Jakarta': ['Jakarta', -6.21, 106.85],
  'Asia/Pontianak': ['Pontianak', -0.03, 109.33],
  'Asia/Makassar': ['Makassar', -5.15, 119.43],
  'Asia/Ujung_Pandang': ['Makassar', -5.15, 119.43],
  'Asia/Jayapura': ['Jayapura', -2.53, 140.72],
  'Asia/Kuala_Lumpur': ['Kuala Lumpur', 3.14, 101.69],
  'Asia/Kuching': ['Kuching', 1.55, 110.36],
  'Asia/Singapore': ['Singapura', 1.35, 103.82],
  'Asia/Brunei': ['Bandar Seri Begawan', 4.9, 114.94],
  'Asia/Manila': ['Manila', 14.6, 120.98],
  'Asia/Bangkok': ['Bangkok', 13.76, 100.5],
  'Asia/Dili': ['Dili', -8.56, 125.57],
  'Asia/Riyadh': ['Riyadh', 24.71, 46.68],
  'Asia/Dubai': ['Dubai', 25.2, 55.27],
  'Asia/Qatar': ['Doha', 25.29, 51.53],
  'Asia/Kuwait': ['Kuwait', 29.38, 47.98],
  'Asia/Karachi': ['Karachi', 24.86, 67.0],
  'Asia/Kolkata': ['New Delhi', 28.61, 77.21],
  'Asia/Dhaka': ['Dhaka', 23.81, 90.41],
  'Asia/Tokyo': ['Tokyo', 35.68, 139.69],
  'Asia/Seoul': ['Seoul', 37.57, 126.98],
  'Asia/Shanghai': ['Beijing', 39.9, 116.4],
  'Asia/Hong_Kong': ['Hong Kong', 22.32, 114.17],
  'Asia/Taipei': ['Taipei', 25.03, 121.57],
  'Europe/Istanbul': ['Istanbul', 41.01, 28.98],
  'Africa/Cairo': ['Kairo', 30.04, 31.24],
  'Europe/London': ['London', 51.51, -0.13],
  'Europe/Amsterdam': ['Amsterdam', 52.37, 4.9],
  'Europe/Berlin': ['Berlin', 52.52, 13.4],
  'Europe/Paris': ['Paris', 48.86, 2.35],
  'Australia/Perth': ['Perth', -31.95, 115.86],
  'Australia/Sydney': ['Sydney', -33.87, 151.21],
  'Australia/Melbourne': ['Melbourne', -37.81, 144.96],
  'America/New_York': ['New York', 40.71, -74.01],
  'America/Chicago': ['Chicago', 41.88, -87.63],
  'America/Los_Angeles': ['Los Angeles', 34.05, -118.24],
};

/**
 * Where to compute times for when the device location isn't known: the
 * time zone's city, or else a point on the zone's meridian (keeping
 * Jakarta's latitude) so at least the clock lines up with the sun.
 */
export function timezoneLocation(now: Date = new Date()): PrayerLocation {
  let zone = '';
  try {
    zone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? '';
  } catch {
    return FALLBACK_LOCATION;
  }
  const city = TIMEZONE_CITIES[zone];
  if (city) return { place: city[0], latitude: city[1], longitude: city[2], isDevice: false };
  if (zone === 'UTC' || !zone) return FALLBACK_LOCATION;
  return {
    latitude: FALLBACK_LOCATION.latitude,
    longitude: -now.getTimezoneOffset() / 4,
    isDevice: false,
    place: 'perkiraan zona waktu',
  };
}

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
    if (!raw) return timezoneLocation();
    const parsed = JSON.parse(raw) as Partial<Coordinates>;
    if (typeof parsed.latitude === 'number' && typeof parsed.longitude === 'number') {
      return { latitude: parsed.latitude, longitude: parsed.longitude, isDevice: true };
    }
  } catch {
    /* storage blocked or corrupt: fall through */
  }
  return timezoneLocation();
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
