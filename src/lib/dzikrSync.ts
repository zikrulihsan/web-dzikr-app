import { supabase, ensureAnonUser } from './supabase';
import { localDayKey } from './localDay';

export interface LeaderboardRow {
  user_id: string;
  display_name: string;
  total: number;
}

export interface DayStats {
  /** Reps everyone has read today. */
  total: number;
  /** People who read at least one rep today. */
  people: number;
}

export const DEFAULT_DISPLAY_NAME = 'Hamba Allah';
export const MAX_DISPLAY_NAME = 30;

export const cleanDisplayName = (name: string): string =>
  name.replace(/\s+/g, ' ').trim().slice(0, MAX_DISPLAY_NAME) || DEFAULT_DISPLAY_NAME;

/**
 * Upserts the signed-in (anonymous) user's total reps for today.
 * No-op when Supabase isn't configured.
 */
export async function syncDailyTotal(total: number): Promise<void> {
  if (!supabase) return;
  const uid = await ensureAnonUser();
  if (!uid) return;

  // Make sure a profile row exists (ignore conflict if it already does).
  await supabase.from('profiles').upsert({ id: uid }, { onConflict: 'id', ignoreDuplicates: true });

  await supabase
    .from('scores')
    .upsert(
      { user_id: uid, day: localDayKey(), total, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,day' },
    );
}

/** Lets the user pick a display name shown on the leaderboard and community page. */
export async function setDisplayName(name: string): Promise<void> {
  if (!supabase) return;
  const uid = await ensureAnonUser();
  if (!uid) return;
  await supabase.from('profiles').upsert({ id: uid, display_name: cleanDisplayName(name) }, { onConflict: 'id' });
}

/** Top entries for the reader's today, highest total first. */
export async function fetchLeaderboard(limit = 50): Promise<LeaderboardRow[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.rpc('leaderboard_for_day', { p_day: localDayKey(), p_limit: limit });
  if (error) {
    console.error('fetchLeaderboard failed:', error.message);
    return [];
  }
  return (data as LeaderboardRow[] | null) ?? [];
}

/** Everyone's reps for the reader's today. Null when unavailable. */
export async function fetchDayStats(day = localDayKey()): Promise<DayStats | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.rpc('dzikr_day_stats', { p_day: day });
  if (error) {
    console.error('fetchDayStats failed:', error.message);
    return null;
  }
  const row = (Array.isArray(data) ? data[0] : data) as { total: number | string; people: number | string } | undefined;
  return { total: Number(row?.total ?? 0), people: Number(row?.people ?? 0) };
}

/**
 * Subscribes to any change in today's scores and invokes `onChange`.
 * Returns an unsubscribe function.
 */
export function subscribeLeaderboard(onChange: () => void, day = localDayKey()): () => void {
  const client = supabase;
  if (!client) return () => {};
  const channel = client
    .channel(`scores-changes-${day}-${Math.random().toString(36).slice(2, 8)}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'scores', filter: `day=eq.${day}` }, onChange)
    .subscribe();
  return () => {
    client.removeChannel(channel);
  };
}
