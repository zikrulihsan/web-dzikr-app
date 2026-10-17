'use client';

import { useEffect, useSyncExternalStore } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { supabase, ensureAnonUser } from './supabase';

interface PresenceMeta {
  name: string;
  tag: string;     // dzikr currently being read
  total: number;   // reps completed today (their progress)
  since: string;   // when they opened the app this visit
}

export interface PresentPerson extends PresenceMeta {
  key: string;
  isMe: boolean;
}

export interface PresenceJoin {
  key: string;
  name: string;
  at: number;
}

export interface PresenceSnapshot {
  /** True once the channel has synced at least once. */
  ready: boolean;
  /** Everyone online, you included, newest arrival first. */
  people: PresentPerson[];
  /** People who arrived after you did, newest first (capped). */
  joins: PresenceJoin[];
}

const CHANNEL = 'dzikr-presence';
// Presence updates are rate limited server-side; a tap streak shouldn't hit it.
const TRACK_INTERVAL_MS = 2000;
// Moving between pages unmounts one user of the channel just before the next
// mounts; a short grace keeps that from showing up as a leave + join to others.
const LEAVE_GRACE_MS = 4000;
const MAX_JOINS = 8;

const EMPTY: PresenceSnapshot = { ready: false, people: [], joins: [] };

let snapshot: PresenceSnapshot = EMPTY;
const listeners = new Set<() => void>();

let channel: RealtimeChannel | null = null;
let joined = false;
let joining = false;
let myKey: string | null = null;
let users = 0;
let leaveTimer: ReturnType<typeof setTimeout> | null = null;
let trackTimer: ReturnType<typeof setTimeout> | null = null;
let lastTrackAt = 0;
let knownKeys: Set<string> | null = null;
let payload: PresenceMeta = { name: '', tag: '', total: 0, since: new Date().toISOString() };

function emit(next: PresenceSnapshot) {
  snapshot = next;
  listeners.forEach((listener) => listener());
}

function readState(ch: RealtimeChannel) {
  const state = ch.presenceState<PresenceMeta>();
  const people: PresentPerson[] = Object.entries(state).map(([key, metas]) => {
    const latest = metas[metas.length - 1];
    return {
      key,
      isMe: key === myKey,
      name: latest?.name ?? '',
      tag: latest?.tag ?? '',
      total: latest?.total ?? 0,
      since: latest?.since ?? '',
    };
  });
  people.sort((a, b) => b.since.localeCompare(a.since));

  // Keys new since the last sync are arrivals. The first sync is everyone who
  // was already here, which isn't news.
  const keys = new Set(people.map((p) => p.key));
  let joins = snapshot.joins;
  if (knownKeys) {
    const fresh = people
      .filter((p) => !p.isMe && !knownKeys!.has(p.key))
      .map((p) => ({ key: p.key, name: p.name, at: Date.now() }));
    if (fresh.length) joins = [...fresh, ...joins].slice(0, MAX_JOINS);
  }
  knownKeys = keys;

  emit({ ready: true, people, joins });
}

function track() {
  if (trackTimer) {
    clearTimeout(trackTimer);
    trackTimer = null;
  }
  if (!channel || !joined) return;
  lastTrackAt = Date.now();
  void channel.track(payload);
}

function scheduleTrack() {
  if (!channel || !joined || trackTimer) return;
  const wait = Math.max(0, lastTrackAt + TRACK_INTERVAL_MS - Date.now());
  trackTimer = setTimeout(track, wait);
}

async function join() {
  const client = supabase;
  if (!client || channel || joining) return;
  joining = true;
  const uid = await ensureAnonUser().finally(() => {
    joining = false;
  });
  // Everyone may have unmounted while signing in.
  if (users === 0 || channel) return;
  myKey = uid ?? `guest-${Math.random().toString(36).slice(2)}`;

  const ch = client.channel(CHANNEL, { config: { presence: { key: myKey } } });
  channel = ch;
  ch.on('presence', { event: 'sync' }, () => readState(ch)).subscribe((status) => {
    if (channel !== ch) return;
    if (status === 'SUBSCRIBED') {
      joined = true;
      track();
    } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
      joined = false;
    }
  });
}

function leave() {
  const ch = channel;
  channel = null;
  joined = false;
  knownKeys = null;
  if (trackTimer) clearTimeout(trackTimer);
  trackTimer = null;
  if (ch && supabase) void supabase.removeChannel(ch);
  emit(EMPTY);
}

function acquire() {
  users += 1;
  if (leaveTimer) {
    clearTimeout(leaveTimer);
    leaveTimer = null;
  }
  void join();
}

function release() {
  users = Math.max(0, users - 1);
  if (users > 0 || leaveTimer) return;
  leaveTimer = setTimeout(() => {
    leaveTimer = null;
    if (users === 0) leave();
  }, LEAVE_GRACE_MS);
}

/** Changes what others see about you; only the fields given are replaced. */
export function updatePresence(next: Partial<Omit<PresenceMeta, 'since'>>) {
  const changed = (Object.keys(next) as Array<keyof typeof next>).some((k) => next[k] !== payload[k]);
  if (!changed) return;
  payload = { ...payload, ...next };
  scheduleTrack();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => snapshot;
const getServerSnapshot = () => EMPTY;

/**
 * Joins the shared Realtime Presence channel while mounted and reports who's
 * online. Every component shares one channel, so the main screen and the
 * community page count you once. Returns an empty snapshot when Supabase
 * isn't configured.
 */
export function usePresence(): PresenceSnapshot & { count: number } {
  useEffect(() => {
    if (!supabase) return;
    acquire();
    return release;
  }, []);

  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { ...state, count: state.people.length };
}
