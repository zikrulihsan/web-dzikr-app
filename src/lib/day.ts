/**
 * Calendar-day helpers for the daily leaderboard.
 *
 * The day key is deliberately the *local* date, not the UTC one. Most users are
 * in WIB (UTC+7), where a UTC-based day would roll over at 07:00 local — right
 * in the middle of dzikr pagi. Both the local store and the rows pushed to
 * Supabase use this same key so they never disagree.
 */
export function localDayKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
