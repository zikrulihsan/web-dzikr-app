'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDzikrStore } from '@/store/dzikrStore';
import Icon from './Icon';

interface Presence {
  name: string;
  tag: string;
  time: string;
  avatar: string;
}

// Anonymous presence — no real identity, just "someone is with you".
const NAMES = ['Seseorang', 'Hamba Allah'];
const TAGS = ['Ayat Kursi', 'Istighfar', 'Tasbih', 'Tahmid', 'Takbir', 'Shalawat'];
const TIMES = ['baru saja', 'baru saja', '1 mnt', '2 mnt', '3 mnt', '5 mnt', '7 mnt', '9 mnt'];
const AVATARS = [
  'linear-gradient(135deg,#3a4d44,#26332e)',
  'linear-gradient(135deg,#4a4233,#2f2a20)',
  'linear-gradient(135deg,#33454d,#222e33)',
  'linear-gradient(135deg,#44384a,#2c2430)',
  'linear-gradient(135deg,#4a3a3a,#2f2424)',
];

const PEOPLE: Presence[] = Array.from({ length: 8 }, (_, i) => ({
  name: NAMES[i % NAMES.length],
  tag: TAGS[i % TAGS.length],
  time: TIMES[i],
  avatar: AVATARS[i % AVATARS.length],
}));

const formatId = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

const pulse = (delay: number): React.CSSProperties => ({
  position: 'absolute',
  width: 128,
  height: 128,
  borderRadius: '50%',
  border: '1.5px solid rgb(var(--primary-color))',
  animation: `presence-pulse 3s ease-out ${delay}s infinite`,
});

const CommunityPresence: React.FC = () => {
  const { settings } = useDzikrStore();
  const dark = settings.theme === 'dark';
  const [live, setLive] = useState(1248);

  // Simulated live presence. Swap this for a real subscription
  // (e.g. websocket / Supabase realtime / polling) when you have a backend.
  useEffect(() => {
    const id = setInterval(() => {
      setLive((v) => {
        let n = v + (Math.floor(Math.random() * 7) - 2);
        if (n < 1180) n = 1180;
        if (n > 1340) n = 1340;
        return n;
      });
    }, 2600);
    return () => clearInterval(id);
  }, []);

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
        <span style={{ width: '2rem' }} />
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
        {PEOPLE.map((p, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 13,
              padding: '0.7rem 0.75rem',
              borderRadius: 18,
              background: rowBg,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                flex: 'none',
                background: p.avatar,
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)',
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{p.name}</span>
                <span style={{ fontSize: '0.72rem', color: sub, flex: 'none' }}>{p.time}</span>
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
                  {p.tag}
                </span>
              </div>
            </div>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                flex: 'none',
                background: accent,
                boxShadow: `0 0 10px -1px ${accent}`,
              }}
            />
          </div>
        ))}
        <div style={{ textAlign: 'center', fontSize: '0.78rem', color: sub, padding: '0.9rem 0 0.25rem' }}>
          dan ribuan lainnya di seluruh dunia
        </div>
      </div>
    </div>
  );
};

export default CommunityPresence;
