import { supabase, ensureAnonUser } from './supabase';

export interface LeaderboardRow {
  user_id: string;
  display_name: string;
  total: number;
}

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

  const today = new Date().toISOString().slice(0, 10);
  await supabase
    .from('scores')
    .upsert({ user_id: uid, day: today, total, updated_at: new Date().toISOString() }, { onConflict: 'user_id,day' });
}

/** Lets the user pick a display name shown on the leaderboard. */
export async function setDisplayName(name: string): Promise<void> {
  if (!supabase) return;
  const uid = await ensureAnonUser();
  if (!uid) return;
  await supabase.from('profiles').upsert({ id: uid, display_name: name.trim() || 'Hamba Allah' }, { onConflict: 'id' });
}

/** Top entries for today, highest total first. */
export async function fetchLeaderboard(limit = 50): Promise<LeaderboardRow[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('leaderboard_today')
    .select('user_id, display_name, total')
    .limit(limit);
  if (error) {
    console.error('fetchLeaderboard failed:', error.message);
    return [];
  }
  return data ?? [];
}

/**
 * Subscribes to any change in today's scores and invokes `onChange`.
 * Returns an unsubscribe function.
 */
export function subscribeLeaderboard(onChange: () => void): () => void {
  const client = supabase;
  if (!client) return () => {};
  const channel = client
    .channel('scores-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'scores' }, onChange)
    .subscribe();
  return () => {
    client.removeChannel(channel);
  };
}
