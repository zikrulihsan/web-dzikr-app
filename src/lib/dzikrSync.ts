import { supabase, ensureAnonUser } from './supabase';
import { localDayKey } from './day';

export interface LeaderboardRow {
  user_id: string;
  display_name: string;
  total: number;
}

/** Matches the profiles_display_name_len constraint in supabase/schema.sql. */
export const MAX_DISPLAY_NAME = 24;
export const DEFAULT_DISPLAY_NAME = 'Hamba Allah';

/** Normalises a name to something the database will accept. */
export function normalizeDisplayName(name: string): string {
  return name.trim().slice(0, MAX_DISPLAY_NAME) || DEFAULT_DISPLAY_NAME;
}

/**
 * Upserts the signed-in (anonymous) user's total reps for today.
 * No-op when Supabase isn't configured.
 *
 * @returns true when the row was written
 */
export async function syncDailyTotal(total: number): Promise<boolean> {
  if (!supabase) return false;
  const uid = await ensureAnonUser();
  if (!uid) return false;

  // scores.user_id has an FK to profiles, so the profile has to exist first.
  // ignoreDuplicates keeps this from clobbering a display name the user chose.
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({ id: uid }, { onConflict: 'id', ignoreDuplicates: true });
  if (profileError) {
    console.error('[dzikr] could not ensure profile:', profileError.message);
    return false;
  }

  const { error } = await supabase
    .from('scores')
    .upsert(
      { user_id: uid, day: localDayKey(), total, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,day' }
    );
  if (error) {
    console.error('[dzikr] could not sync daily total:', error.message);
    return false;
  }
  return true;
}

/** Lets the user pick a display name shown on the leaderboard. */
export async function setDisplayName(name: string): Promise<boolean> {
  if (!supabase) return false;
  const uid = await ensureAnonUser();
  if (!uid) return false;

  const { error } = await supabase
    .from('profiles')
    .upsert({ id: uid, display_name: normalizeDisplayName(name) }, { onConflict: 'id' });
  if (error) {
    console.error('[dzikr] could not save display name:', error.message);
    return false;
  }
  return true;
}

export interface LeaderboardResult {
  rows: LeaderboardRow[];
  /** False when the fetch failed — an empty board and a broken one differ. */
  ok: boolean;
}

/**
 * Top entries for the given local day, highest total first.
 *
 * The ordering is applied here rather than left to the view: PostgREST wraps the
 * view in its own query, so a view-level ORDER BY is not guaranteed to survive.
 *
 * Never throws — callers use the result to clear a loading state.
 */
export async function fetchLeaderboard(
  limit = 50,
  day: string = localDayKey()
): Promise<LeaderboardResult> {
  if (!supabase) return { rows: [], ok: false };
  try {
    const { data, error } = await supabase
      .from('leaderboard_daily')
      .select('user_id, display_name, total')
      .eq('day', day)
      .order('total', { ascending: false })
      .limit(limit);
    if (error) {
      console.error('[dzikr] fetchLeaderboard failed:', error.message);
      return { rows: [], ok: false };
    }
    return { rows: data ?? [], ok: true };
  } catch (err) {
    console.error('[dzikr] fetchLeaderboard failed:', (err as Error).message);
    return { rows: [], ok: false };
  }
}

/**
 * Subscribes to any change in scores and invokes `onChange`.
 * Returns an unsubscribe function.
 */
export function subscribeLeaderboard(onChange: () => void): () => void {
  const client = supabase;
  if (!client) return () => {};
  const channel = client
    .channel('scores-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'scores' }, onChange)
    .subscribe((status, err) => {
      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        console.error(`[dzikr] scores channel ${status}:`, err?.message ?? '');
      }
    });
  return () => {
    void client.removeChannel(channel);
  };
}
