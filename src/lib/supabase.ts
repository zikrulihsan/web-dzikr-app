import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Browser Supabase client. Null when env vars are absent, so the app still
 * runs (checklist stays local-only) without a backend configured.
 */
export const supabase: SupabaseClient | null =
  url && anonKey
    ? createClient(url, anonKey, {
        auth: { persistSession: true, autoRefreshToken: true },
      })
    : null;

let signInPromise: Promise<string | null> | null = null;

/**
 * Ensures an anonymous session exists and returns the user id (auth.uid()).
 * Cached so concurrent callers share one sign-in. Returns null if Supabase
 * is not configured.
 */
export async function ensureAnonUser(): Promise<string | null> {
  if (!supabase) return null;
  if (signInPromise) return signInPromise;

  signInPromise = (async () => {
    const { data: existing } = await supabase.auth.getSession();
    if (existing.session?.user) return existing.session.user.id;

    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) {
      console.error('Supabase anonymous sign-in failed:', error.message);
      return null;
    }
    return data.user?.id ?? null;
  })();

  return signInPromise;
}
