'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDzikrStore } from '@/store/dzikrStore';
import { useResolvedTheme } from '@/lib/useResolvedTheme';
import { usePresence } from '@/lib/usePresence';
import { useDayStats } from '@/lib/useDayStats';
import { useScoreSync } from '@/lib/useScoreSync';
import { DEFAULT_DISPLAY_NAME, MAX_DISPLAY_NAME } from '@/lib/dzikrSync';
import { supabase } from '@/lib/supabase';
import { formatId } from '@/lib/formatId';
import Icon from './Icon';

// Avatar gradients cycled across anonymous presence rows.
const AVATARS = [
  'linear-gradient(135deg,#3a4d44,#26332e)',
  'linear-gradient(135deg,#4a4233,#2f2a20)',
  'linear-gradient(135deg,#33454d,#222e33)',
  'linear-gradient(135deg,#44384a,#2c2430)',
  'linear-gradient(135deg,#4a3a3a,#2f2424)',
];

/** "baru saja", "5 mnt", "1 jam" — how long someone has been here. */
const sinceLabel = (iso: string, now: number) => {
  const minutes = Math.floor((now - new Date(iso).getTime()) / 60_000);
  if (!Number.isFinite(minutes) || minutes < 1) return 'baru saja';
  if (minutes < 60) return `${minutes} mnt`;
  return `${Math.floor(minutes / 60)} jam`;
};

const initial = (name: string) => (name.trim()[0] ?? 'H').toUpperCase();

const pulse = (delay: number): React.CSSProperties => ({
  position: 'absolute',
  width: 128,
  height: 128,
  borderRadius: '50%',
  border: '1.5px solid rgb(var(--primary-color))',
  animation: `presence-pulse 3s ease-out ${delay}s infinite`,
});

const CommunityPresence: React.FC = () => {
  const displayName = useDzikrStore((state) => state.settings.displayName ?? '');
  const updateSettings = useDzikrStore((state) => state.updateSettings);
  const dark = useResolvedTheme() === 'dark';
  // Keeps your total and name current for others even if you land here first.
  useScoreSync();
  const { count: live, people } = usePresence();
  const stats = useDayStats();
  const [draftName, setDraftName] = useState(displayName);
  const [editingName, setEditingName] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const saveName = (event: React.FormEvent) => {
    event.preventDefault();
    updateSettings({ displayName: draftName.replace(/\s+/g, ' ').trim().slice(0, MAX_DISPLAY_NAME) });
    setEditingName(false);
  };

  const text = dark ? 'white' : '#333';
  const sub = dark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.55)';
  const rowBg = dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';
  const hairline = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const accent = 'rgb(var(--primary-color))';
  const accentSoft = 'rgba(var(--primary-color), 0.14)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', color: text }}>
      {/* Header */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem',
        }}
      >
        <Link
          href="/"
          aria-label="Kembali"
          style={{ color: sub, display: 'flex', alignItems: 'center', padding: '0.5rem' }}
        >
          <Icon icon="fa-solid fa-chevron-left" size={18} />
        </Link>
        <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Bersama Berdzikr</h1>
        <Link
          href="/leaderboard"
          aria-label="Peringkat"
          style={{ color: sub, display: 'flex', alignItems: 'center', padding: '0.5rem' }}
        >
          <Icon icon="fa-solid fa-trophy" size={18} />
        </Link>
      </header>

      {/* Hero — live presence count */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '1.5rem 1rem 1.25rem',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: 128,
            height: 128,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={pulse(0)} />
          <span style={pulse(1.5)} />
          <div
            style={{
              width: 118,
              height: 118,
              borderRadius: '50%',
              background: `radial-gradient(circle at 50% 38%, ${accentSoft}, rgba(255,255,255,0.02))`,
              border: dark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.06)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1 }}>{formatId(live)}</div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.04em',
                color: accent,
                marginTop: 4,
              }}
            >
              SEKARANG
            </div>
          </div>
        </div>
        <div style={{ fontSize: '1rem', fontWeight: 600, marginTop: '1.1rem' }}>
          sedang berdzikr sekarang
        </div>
        <div style={{ fontSize: '0.85rem', color: sub, marginTop: 4 }}>
          {live > 1 ? 'Kamu tidak sendiri, mereka bersamamu.' : 'Ajak teman berdzikr bersamamu.'}
        </div>

        {stats && (
          <div
            style={{
              display: 'flex',
              gap: 8,
              marginTop: '1.1rem',
              width: '100%',
              maxWidth: 360,
            }}
          >
            {[
              { value: formatId(stats.total), label: 'dzikr dibaca hari ini' },
              { value: formatId(stats.people), label: 'orang berdzikr hari ini' },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  flex: 1,
                  padding: '0.75rem 0.5rem',
                  borderRadius: 16,
                  background: rowBg,
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: accent, fontVariantNumeric: 'tabular-nums' }}>
                  {item.value}
                </div>
                <div style={{ fontSize: '0.72rem', color: sub, marginTop: 2 }}>{item.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Your name, as others see it */}
      {supabase && (
        <form
          onSubmit={saveName}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            margin: '0 1rem 0.9rem',
            padding: '0.55rem 0.6rem 0.55rem 0.9rem',
            borderRadius: 16,
            border: `1px dashed ${hairline}`,
            fontSize: '0.82rem',
          }}
        >
          {editingName ? (
            <>
              <input
                autoFocus
                value={draftName}
                maxLength={MAX_DISPLAY_NAME}
                onChange={(event) => setDraftName(event.target.value)}
                placeholder="Tulis namamu"
                aria-label="Nama yang dilihat orang lain"
                style={{
                  flex: 1,
                  minWidth: 0,
                  border: 0,
                  background: 'transparent',
                  color: text,
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                style={{
                  border: 0,
                  borderRadius: 999,
                  padding: '0.4rem 0.9rem',
                  background: accent,
                  color: 'var(--background-color)',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Simpan
              </button>
            </>
          ) : (
            <>
              <span style={{ flex: 1, minWidth: 0, color: sub }}>
                Orang lain melihatmu sebagai{' '}
                <strong style={{ color: text }}>{displayName || DEFAULT_DISPLAY_NAME}</strong>
              </span>
              <button
                type="button"
                onClick={() => {
                  setDraftName(displayName);
                  setEditingName(true);
                }}
                style={{
                  border: 0,
                  background: 'transparent',
                  color: accent,
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '0.4rem 0.5rem',
                }}
              >
                {displayName ? 'Ubah' : 'Tulis nama'}
              </button>
            </>
          )}
        </form>
      )}

      {/* Divider label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 1.25rem 0.25rem' }}>
        <span
          style={{
            fontSize: 11,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: sub,
            fontWeight: 600,
          }}
        >
          Yang hadir saat ini
        </span>
        <span style={{ flex: 1, height: 1, background: hairline }} />
      </div>

      {/* Anonymous feed */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0.75rem 1rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        {!supabase && (
          <div style={{ textAlign: 'center', fontSize: '0.85rem', color: sub, padding: '1.5rem 0' }}>
            Fitur bersama belum aktif. Tambahkan konfigurasi Supabase untuk mengaktifkannya.
          </div>
        )}
        {supabase && people.length <= 1 && (
          <div style={{ textAlign: 'center', fontSize: '0.85rem', color: sub, padding: '1.5rem 0' }}>
            Menunggu yang lain bergabung…
          </div>
        )}
        {people.map((p, i) => (
          <div
            key={p.key}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 13,
              padding: '0.7rem 0.75rem',
              borderRadius: 18,
              background: p.isMe ? accentSoft : rowBg,
            }}
          >
            <div
              aria-hidden="true"
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                flex: 'none',
                background: AVATARS[i % AVATARS.length],
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255,255,255,0.85)',
                fontWeight: 700,
              }}
            >
              {initial(p.name || DEFAULT_DISPLAY_NAME)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <span
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {p.name || DEFAULT_DISPLAY_NAME}
                  {p.isMe ? ' (kamu)' : ''}
                </span>
                <span style={{ fontSize: '0.72rem', color: sub, flex: 'none' }}>{sinceLabel(p.since, now)}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <span style={{ fontSize: '0.78rem', color: sub }}>sedang membaca</span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    padding: '2px 9px',
                    borderRadius: 999,
                    background: accentSoft,
                    color: accent,
                    fontWeight: 500,
                  }}
                >
                  {p.tag || 'Berdzikr'}
                </span>
              </div>
            </div>
            <div style={{ flex: 'none', textAlign: 'right', minWidth: 44 }}>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: accent, lineHeight: 1 }}>{p.total}</div>
              <div style={{ fontSize: '0.65rem', color: sub, marginTop: 2 }}>dibaca</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityPresence;
