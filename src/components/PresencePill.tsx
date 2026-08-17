'use client';

import React from 'react';
import Link from 'next/link';
import { useDzikrStore } from '@/store/dzikrStore';
import { dzikrData } from '@/data/dzikrData';
import { usePresence } from '@/lib/usePresence';

const formatId = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

/**
 * Entry point to the community page, shown on the main dzikr screen.
 * Doubles as ambient presence: "you are not alone".
 */
const PresencePill: React.FC = () => {
  const { settings, currentIndex, progress } = useDzikrStore();
  const dark = settings.theme === 'dark';
  const tag = dzikrData[currentIndex]?.category ?? '';
  const myTotal = progress.reduce((s, p) => s + p.completed, 0);
  // Real shared presence (replaces the simulated counter).
  const { count, others, status } = usePresence(tag, myTotal);

  // Without a backend there is no community to link to — don't advertise one.
  if (status === 'disabled') return null;

  const live = status === 'live';
  // `count` includes you, so only claim company when somebody else is here.
  const label = others.length > 0 ? `${formatId(count)} sedang berdzikr bersama` : 'Berdzikr bersama';

  return (
    <Link
      href="/community"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 9,
        margin: '0.25rem auto 0',
        padding: '0.5rem 0.9rem',
        borderRadius: 999,
        background: 'rgba(var(--primary-color), 0.14)',
        border: dark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
        width: 'fit-content',
        textDecoration: 'none',
      }}
    >
      <span
        style={{
          width: 9,
          height: 9,
          borderRadius: '50%',
          background: 'rgb(var(--primary-color))',
          opacity: live ? 1 : 0.4,
        }}
      />
      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'rgb(var(--primary-color))' }}>
        {label}
      </span>
      <span style={{ color: 'rgb(var(--primary-color))' }}>→</span>
    </Link>
  );
};

export default PresencePill;
