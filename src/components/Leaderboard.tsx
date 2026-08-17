'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDzikrStore } from '@/store/dzikrStore';
import {
  fetchLeaderboard,
  subscribeLeaderboard,
  setDisplayName,
  normalizeDisplayName,
  DEFAULT_DISPLAY_NAME,
  MAX_DISPLAY_NAME,
  type LeaderboardRow,
} from '@/lib/dzikrSync';
import { supabase, ensureAnonUser } from '@/lib/supabase';
import Icon from './Icon';

const Leaderboard: React.FC = () => {
  const { settings, updateSettings } = useDzikrStore();
  const dark = settings.theme === 'dark';
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [meId, setMeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [draftName, setDraftName] = useState('');
  const [savingName, setSavingName] = useState(false);

  // Prefer the name the server actually has; the local copy is only a mirror and
  // would be wrong on a device whose storage was cleared.
  const myName =
    rows.find((r) => r.user_id === meId)?.display_name || settings.displayName || DEFAULT_DISPLAY_NAME;

  useEffect(() => {
    let active = true;
    ensureAnonUser().then((id) => active && setMeId(id));

    const load = async () => {
      try {
        const { rows: data, ok } = await fetchLeaderboard();
        if (!active) return;
        setRows(data);
        setLoadFailed(!ok);
      } finally {
        // Always clear the spinner — a stuck "Memuat…" is worse than an empty board.
        if (active) setLoading(false);
      }
    };
    load();

    // Re-fetch whenever anyone's score changes.
    const unsub = subscribeLeaderboard(load);
    return () => {
      active = false;
      unsub();
    };
  }, []);

  const saveName = async () => {
    const name = normalizeDisplayName(draftName);
    setSavingName(true);
    const ok = await setDisplayName(name);
    setSavingName(false);
    if (!ok) return;
    // Mirror it locally so the label survives a reload even before the next fetch.
    updateSettings({ displayName: name });
    setEditingName(false);
    const { rows: data, ok: fetched } = await fetchLeaderboard();
    if (fetched) setRows(data);
  };

  const text = dark ? 'white' : '#333';
  const sub = dark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.55)';
  const rowBg = dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';
  const gold = 'rgb(var(--gold-color))';
  const accent = 'rgb(var(--primary-color))';

  const medal = (rank: number) =>
    rank === 1 ? gold : rank === 2 ? '#c7ccd1' : rank === 3 ? '#cd8b5a' : sub;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', color: text }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem' }}>
        <Link href="/" aria-label="Kembali" style={{ color: sub, display: 'flex', alignItems: 'center', padding: '0.5rem' }}>
          <Icon icon="fa-solid fa-chevron-left" size={18} />
        </Link>
        <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Peringkat Hari Ini</h1>
        <span style={{ width: '2rem' }} />
      </header>

      {supabase && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            margin: '0 1rem 0.75rem',
            padding: '0.6rem 0.85rem',
            borderRadius: 14,
            background: rowBg,
            fontSize: '0.82rem',
          }}
        >
          {editingName ? (
            <>
              <input
                autoFocus
                value={draftName}
                maxLength={MAX_DISPLAY_NAME}
                placeholder={DEFAULT_DISPLAY_NAME}
                onChange={(e) => setDraftName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') void saveName();
                  if (e.key === 'Escape') setEditingName(false);
                }}
                style={{
                  flex: 1,
                  minWidth: 0,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: text,
                  fontSize: '0.9rem',
                  fontWeight: 600,
                }}
              />
              <button
                onClick={() => void saveName()}
                disabled={savingName}
                style={{
                  background: 'rgba(var(--primary-color), 0.16)',
                  color: accent,
                  border: 'none',
                  borderRadius: 999,
                  padding: '0.3rem 0.8rem',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  cursor: savingName ? 'default' : 'pointer',
                  flex: 'none',
                }}
              >
                {savingName ? 'Menyimpan…' : 'Simpan'}
              </button>
            </>
          ) : (
            <>
              <span style={{ color: sub, flex: 'none' }}>Kamu tampil sebagai</span>
              <span
                style={{
                  flex: 1,
                  minWidth: 0,
                  fontWeight: 600,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {myName}
              </span>
              <button
                onClick={() => {
                  setDraftName(settings.displayName);
                  setEditingName(true);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: accent,
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  padding: 0,
                  flex: 'none',
                }}
              >
                Ubah
              </button>
            </>
          )}
        </div>
      )}

      {!supabase ? (
        <div style={{ padding: '2rem 1.5rem', textAlign: 'center', color: sub, fontSize: '0.9rem' }}>
          Papan peringkat belum aktif. Tambahkan konfigurasi Supabase untuk mengaktifkannya.
        </div>
      ) : loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: sub }}>Memuat…</div>
      ) : rows.length === 0 ? (
        <div style={{ padding: '2rem 1.5rem', textAlign: 'center', color: sub, fontSize: '0.9rem' }}>
          {loadFailed
            ? 'Gagal memuat peringkat. Periksa koneksi, lalu buka lagi halaman ini.'
            : 'Belum ada yang berdzikr hari ini. Jadilah yang pertama!'}
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem 1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {rows.map((r, i) => {
            const rank = i + 1;
            const isMe = r.user_id === meId;
            return (
              <div
                key={r.user_id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 13,
                  padding: '0.7rem 0.85rem',
                  borderRadius: 18,
                  background: isMe ? 'rgba(var(--gold-color), 0.12)' : rowBg,
                  border: isMe ? '1px solid rgba(var(--gold-color),0.3)' : '1px solid transparent',
                }}
              >
                <span style={{ width: 26, textAlign: 'center', fontWeight: 700, color: medal(rank), flex: 'none' }}>
                  {rank}
                </span>
                <span style={{ flex: 1, minWidth: 0, fontSize: '0.95rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {r.display_name}{isMe ? ' (kamu)' : ''}
                </span>
                <span style={{ fontWeight: 700, color: accent, flex: 'none' }}>{r.total}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
