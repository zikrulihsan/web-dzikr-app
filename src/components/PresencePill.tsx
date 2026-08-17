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
  const { currentIndex, progress } = useDzikrStore();
  const tag = dzikrData[currentIndex]?.category ?? '';
  const myTotal = progress.reduce((s, p) => s + p.completed, 0);
  // Real shared presence (replaces the simulated counter).
  const { count: live } = usePresence(tag, myTotal);

  return (
    <Link
      href="/community"
      className="presence-pill"
    >
      <span className="presence-dot" />
      <span>
        {live > 0 ? `${formatId(live)} ` : ''}sedang berdzikr bersama
      </span>
      <span aria-hidden="true">→</span>
    </Link>
  );
};

export default PresencePill;
