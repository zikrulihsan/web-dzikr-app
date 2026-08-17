'use client';

import React from 'react';
import Link from 'next/link';
import { useDzikrStore } from '@/store/dzikrStore';
import { usePresence } from '@/lib/usePresence';
import Icon from './Icon';

// Avatar gradients cycled across anonymous presence rows.
const AVATARS = [
  'linear-gradient(135deg,#ee6a3b,#f0a88b)',
  'linear-gradient(135deg,#173d32,#9fc9ae)',
  'linear-gradient(135deg,#f2bd3a,#f6cf59)',
  'linear-gradient(135deg,#7e6c93,#d9c8e9)',
  'linear-gradient(135deg,#6a9fb8,#bbd8e8)',
];

const formatId = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

const pulse = (delay: number): React.CSSProperties => ({
  position: 'absolute',
  width: 128,
  height: 128,
  borderRadius: '50%',
  border: '1.5px solid rgb(var(--secondary-color))',
  animation: `presence-pulse 3s ease-out ${delay}s infinite`,
});

const CommunityPresence: React.FC = () => {
  const { progress } = useDzikrStore();
  const myTotal = progress.reduce((s, p) => s + p.completed, 0);
  // Real shared presence via Supabase Realtime.
  const { count: live, people } = usePresence('', myTotal);

  const text = 'var(--text-primary)';
  const sub = 'var(--text-secondary)';
  const rowBg = 'var(--surface-color)';
  const hairline = 'var(--border-color)';
  const accent = 'rgb(var(--secondary-color))';
  const accentSoft = 'rgba(var(--secondary-color), 0.13)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', color: text }}>
      {/* Header */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-color)',
          padding: '1.1rem 1.25rem',
        }}
      >
        <Link
          href="/"
          aria-label="Kembali"
          style={{ color: sub, display: 'flex', alignItems: 'center', padding: '0.5rem' }}
        >
          <Icon icon="fa-solid fa-chevron-left" size={18} />
        </Link>
        <h1 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.03em' }}>Bersama Berdzikr</h1>
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
              border: '1px solid var(--border-color)',
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
          Kamu tidak sendiri — banyak yang bersamamu.
        </div>
      </div>

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
          Beberapa di antara mereka
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
        {people.length === 0 && (
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
              background: rowBg,
              border: '1px solid var(--border-color)',
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                flex: 'none',
                background: AVATARS[i % AVATARS.length],
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)',
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Hamba Allah</span>
                <span style={{ fontSize: '0.72rem', color: sub, flex: 'none' }}>sekarang</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <span style={{ fontSize: '0.78rem', color: sub }}>membaca</span>
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
