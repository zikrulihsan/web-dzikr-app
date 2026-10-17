/**
 * Today's date on the reader's own clock, as YYYY-MM-DD. The daily counters
 * reset at local midnight, not UTC midnight (07.00 WIB), so every "hari ini"
 * in the app is keyed by this.
 */
export function localDayKey(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
