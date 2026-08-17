'use client';

import { useEffect, useState } from 'react';
import {
  getPresenceSnapshot,
  setPresencePayload,
  subscribePresence,
  type PresenceSnapshot,
} from './presenceChannel';

export type { PresentPerson, PresenceStatus, PresenceSnapshot } from './presenceChannel';

/**
 * Reports who else is reading dzikr right now, via a shared Supabase Realtime
 * Presence channel.
 *
 * @param tag    the dzikr the local user is currently reading (broadcast to others)
 * @param total  the local user's reps completed today (broadcast as their progress)
 *
 * The channel itself is a module-level singleton (see presenceChannel.ts), so
 * mounting this hook on several components — or on both routes that show
 * presence — still results in one join and one presence entry.
 *
 * Falls back to count 0 / empty list with status 'disabled' when Supabase isn't
 * configured.
 */
export function usePresence(tag: string, total: number): PresenceSnapshot {
  const [snapshot, setSnapshot] = useState<PresenceSnapshot>(getPresenceSnapshot);

  useEffect(() => subscribePresence(setSnapshot), []);

  useEffect(() => {
    setPresencePayload(tag, total);
  }, [tag, total]);

  return snapshot;
}
