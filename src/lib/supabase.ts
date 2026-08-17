import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * True when the build carried Supabase credentials. Components use this to say
 * "live features are off" instead of rendering a permanently empty screen.
 *
 * Note these are read at build time (NEXT_PUBLIC_*), so setting them on the
 * host without redeploying leaves this false.
 */
export const isSupabaseConfigured = Boolean(url && anonKey);

/**
 * Browser Supabase client. Null when env vars are absent, so the app still
 * runs (checklist stays local-only) without a backend configured.
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, anonKey!, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null;

let signInPromise: Promise<string | null> | null = null;

/**
 * Ensures an anonymous session exists and returns the user id (auth.uid()).
 * Cached so concurrent callers share one sign-in. Returns null if Supabase
 * is not configured.
 *
 * A failed sign-in is not cached: the usual cause is a flaky network or
 * Anonymous sign-ins still being disabled in the dashboard, and both are worth
 * retrying on the next call rather than staying broken until a page reload.
 */
export async function ensureAnonUser(): Promise<string | null> {
  if (!supabase) return null;
  if (signInPromise) return signInPromise;

  const attempt = (async () => {
    const { data: existing } = await supabase.auth.getSession();
    if (existing.session?.user) return existing.session.user.id;

    try {
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) {
        console.error(
          '[dzikr] Supabase anonymous sign-in was rejected:',
          error.message,
          '— check that Authentication → Sign In / Providers → Anonymous sign-ins is enabled.'
        );
        return null;
      }
      return data.user?.id ?? null;
    } catch (err) {
      // Network-level failure: unreachable project URL, offline, blocked request.
      console.error('[dzikr] could not reach Supabase to sign in:', (err as Error).message);
      return null;
    }
  })();

  signInPromise = attempt;
  const uid = await attempt;
  if (!uid && signInPromise === attempt) signInPromise = null;
  return uid;
}
