'use client';

import { useEffect, useState } from 'react';
import { supabase, ensureAnonUser } from './supabase';

export interface PresentPerson {
  key: string;
  tag: string;       // dzikr currently being read
  total: number;     // reps completed today (their progress)
  online_at: string;
}

interface PresenceMeta {
  tag: string;
  total: number;
  online_at: string;
}

const TOPIC = 'realtime:dzikr-presence';

/**
 * Joins a shared Realtime Presence channel and reports who's online.
 *
 * @param tag    the dzikr the local user is currently reading (broadcast to others)
 * @param total  the local user's reps completed today (broadcast as their progress)
 * @returns      live count (distinct people) and the list of present people
 *
 * Falls back to count 0 / empty list when Supabase isn't configured.
 */
export function usePresence(tag: string, total: number) {
  const [count, setCount] = useState(0);
  const [people, setPeople] = useState<PresentPerson[]>([]);

  // Join once.
  useEffect(() => {
    if (!supabase) return;
    let channel: ReturnType<NonNullable<typeof supabase>['channel']> | null = null;
    let cancelled = false;

    (async () => {
      const uid = await ensureAnonUser();
      if (cancelled || !supabase) return;
      const key = uid ?? Math.random().toString(36).slice(2);

      channel = supabase.channel('dzikr-presence', { config: { presence: { key } } });

      channel
        .on('presence', { event: 'sync' }, () => {
          const state = channel!.presenceState<PresenceMeta>();
          // One entry per distinct key — count people, not presence metas.
          const list: PresentPerson[] = Object.entries(state).map(([k, metas]) => {
            const latest = metas[metas.length - 1];
            return { key: k, tag: latest?.tag ?? '', total: latest?.total ?? 0, online_at: latest?.online_at ?? '' };
          });
          setCount(Object.keys(state).length);
          setPeople(list);
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await channel!.track({ tag, total, online_at: new Date().toISOString() });
          }
        });
    })();

    return () => {
      cancelled = true;
      if (channel && supabase) supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update the broadcast payload (tag / progress) without re-joining.
  useEffect(() => {
    if (!supabase) return;
    const ch = supabase.getChannels().find((c) => c.topic === TOPIC);
    if (ch && ch.state === 'joined') {
      ch.track({ tag, total, online_at: new Date().toISOString() });
    }
  }, [tag, total]);

  return { count, people };
}
