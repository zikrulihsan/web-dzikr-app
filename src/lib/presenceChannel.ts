import type { RealtimeChannel } from '@supabase/supabase-js';
import { supabase, ensureAnonUser } from './supabase';

export interface PresentPerson {
  key: string;
  tag: string; // dzikr currently being read
  total: number; // reps completed today (their progress)
  online_at: string;
}

interface PresenceMeta {
  tag: string;
  total: number;
  online_at: string;
}

export type PresenceStatus = 'disabled' | 'connecting' | 'live' | 'error';

export interface PresenceSnapshot {
  /** People online, including you. */
  count: number;
  /** Everyone except you — what the community feed lists. */
  others: PresentPerson[];
  status: PresenceStatus;
}

const CHANNEL_NAME = 'dzikr-presence';

/**
 * Keep the channel alive briefly after the last component unmounts.
 *
 * This is not just an optimisation. `removeChannel()` awaits a leave round-trip
 * before dropping the channel from the client's list, while `client.channel()`
 * hands back any existing channel with the same topic. Tearing down and
 * rejoining on every route change (/ ↔ /community, both of which show presence)
 * therefore raced: the new page could grab the leaving channel, and
 * `subscribe()` on a non-closed channel is a silent no-op — presence would
 * never join again until a full page reload.
 */
const LEAVE_GRACE_MS = 3000;

/** Counting is rapid-fire; collapse bursts into one presence update. */
const TRACK_DEBOUNCE_MS = 800;

type Listener = (snapshot: PresenceSnapshot) => void;

const listeners = new Set<Listener>();

let channel: RealtimeChannel | null = null;
let selfKey: string | null = null;
let leaveTimer: ReturnType<typeof setTimeout> | null = null;
let trackTimer: ReturnType<typeof setTimeout> | null = null;

/** Serialises join/leave so a join never starts while a leave is in flight. */
let lifecycle: Promise<void> = Promise.resolve();

let payload: Pick<PresenceMeta, 'tag' | 'total'> = { tag: '', total: 0 };

const emptySnapshot: PresenceSnapshot = {
  count: 0,
  others: [],
  status: supabase ? 'connecting' : 'disabled',
};

let snapshot: PresenceSnapshot = emptySnapshot;

export function getPresenceSnapshot(): PresenceSnapshot {
  return snapshot;
}

function emit(next: Partial<PresenceSnapshot>): void {
  snapshot = { ...snapshot, ...next };
  listeners.forEach((listener) => listener(snapshot));
}

function readState(ch: RealtimeChannel): void {
  const state = ch.presenceState<PresenceMeta>();
  const entries = Object.entries(state);

  // One entry per distinct key — count people, not presence metas. Two tabs on
  // the same device share a key and correctly count once.
  const others: PresentPerson[] = entries
    .filter(([key]) => key !== selfKey)
    .map(([key, metas]) => {
      const latest = metas[metas.length - 1];
      return {
        key,
        tag: latest?.tag ?? '',
        total: latest?.total ?? 0,
        online_at: latest?.online_at ?? '',
      };
    });

  emit({ count: entries.length, others });
}

function pushTrack(): void {
  const ch = channel;
  if (!ch || ch.state !== 'joined') return;
  void ch.track({ ...payload, online_at: new Date().toISOString() });
}

function join(): void {
  lifecycle = lifecycle.then(async () => {
    if (channel || !supabase) return;

    const uid = await ensureAnonUser();
    // Everyone may have unsubscribed while we were signing in.
    if (!listeners.size || channel || !supabase) return;

    // Presence still works without a session — the key just isn't stable across
    // reloads. Only the leaderboard genuinely needs auth.
    const key = uid ?? `anon-${Math.random().toString(36).slice(2)}`;
    selfKey = key;

    const ch = supabase.channel(CHANNEL_NAME, { config: { presence: { key } } });
    channel = ch;
    emit({ status: 'connecting' });

    ch.on('presence', { event: 'sync' }, () => readState(ch)).subscribe((status, err) => {
      if (status === 'SUBSCRIBED') {
        emit({ status: 'live' });
        pushTrack();
      } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        console.error(`[dzikr] presence channel ${status}:`, err?.message ?? '');
        emit({ status: 'error' });
      }
    });
  });
}

function scheduleLeave(): void {
  if (leaveTimer) clearTimeout(leaveTimer);
  leaveTimer = setTimeout(() => {
    leaveTimer = null;
    if (listeners.size) return; // someone re-subscribed during the grace period

    lifecycle = lifecycle.then(async () => {
      if (listeners.size) return;
      const leaving = channel;
      channel = null;
      selfKey = null;
      if (trackTimer) {
        clearTimeout(trackTimer);
        trackTimer = null;
      }
      emit(emptySnapshot);
      if (leaving && supabase) await supabase.removeChannel(leaving);
    });
  }, LEAVE_GRACE_MS);
}

/**
 * Subscribes to the shared presence channel. The channel is joined on the first
 * subscriber and left once the last one goes away, so every component on every
 * route shares a single join.
 *
 * @returns an unsubscribe function
 */
export function subscribePresence(listener: Listener): () => void {
  listeners.add(listener);
  listener(snapshot);

  if (leaveTimer) {
    clearTimeout(leaveTimer);
    leaveTimer = null;
  }
  join();

  return () => {
    listeners.delete(listener);
    if (!listeners.size) scheduleLeave();
  };
}

/**
 * Updates what this client broadcasts about itself. Debounced: the counter fires
 * this on every tap, and each `track()` costs a message that fans out to every
 * subscriber — enough taps in a second and Realtime starts dropping them.
 */
export function setPresencePayload(tag: string, total: number): void {
  if (payload.tag === tag && payload.total === total) return;
  payload = { tag, total };

  if (trackTimer) clearTimeout(trackTimer);
  trackTimer = setTimeout(() => {
    trackTimer = null;
    pushTrack();
  }, TRACK_DEBOUNCE_MS);
}
