'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDzikrStore } from '@/store/dzikrStore';

const formatId = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

/**
 * Entry point to the community page, shown on the main dzikr screen.
 * Doubles as ambient presence: "you are not alone".
 */
const PresencePill: React.FC = () => {
  const { settings } = useDzikrStore();
  const dark = settings.theme === 'dark';
  const [live, setLive] = useState(1248);

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
        }}
      />
      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'rgb(var(--primary-color))' }}>
        {formatId(live)} sedang berdzikr bersama
      </span>
      <span style={{ color: 'rgb(var(--primary-color))' }}>→</span>
    </Link>
  );
};

export default PresencePill;
