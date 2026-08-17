'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDzikrStore } from '@/store/dzikrStore';
import { fetchLeaderboard, subscribeLeaderboard, type LeaderboardRow } from '@/lib/dzikrSync';
import { supabase, ensureAnonUser } from '@/lib/supabase';
import Icon from './Icon';

const Leaderboard: React.FC = () => {
  const { settings } = useDzikrStore();
  const dark = settings.theme === 'dark';
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [meId, setMeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    ensureAnonUser().then((id) => active && setMeId(id));

    const load = async () => {
      const data = await fetchLeaderboard();
      if (active) {
        setRows(data);
        setLoading(false);
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

      {!supabase ? (
        <div style={{ padding: '2rem 1.5rem', textAlign: 'center', color: sub, fontSize: '0.9rem' }}>
          Papan peringkat belum aktif. Tambahkan konfigurasi Supabase untuk mengaktifkannya.
        </div>
      ) : loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: sub }}>Memuat…</div>
      ) : rows.length === 0 ? (
        <div style={{ padding: '2rem 1.5rem', textAlign: 'center', color: sub, fontSize: '0.9rem' }}>
          Belum ada yang berdzikr hari ini. Jadilah yang pertama!
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
