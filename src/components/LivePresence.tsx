'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useDzikrStore } from '@/store/dzikrStore';
import { getDzikrList } from '@/data/dzikrData';
import { useActivePeriod } from '@/lib/useDzikrPeriod';
import { updatePresence, usePresence } from '@/lib/usePresence';
import { useDayStats } from '@/lib/useDayStats';
import { DEFAULT_DISPLAY_NAME } from '@/lib/dzikrSync';
import { supabase } from '@/lib/supabase';
import { formatId } from '@/lib/formatId';

const ROTATE_MS = 4000;
// An arrival is announced first for this long, then joins the rotation.
const FRESH_JOIN_MS = 8000;

/**
 * Ambient "you are not alone" strip on the main dzikr screen: how many people
 * are reading right now, everyone's dzikr today, and a gentle ticker naming
 * who else is here. Opens the community page.
 */
const LivePresence: React.FC = () => {
  const currentIndex = useDzikrStore((s) => s.currentIndex);
  const period = useActivePeriod();
  const tag = getDzikrList(period)[currentIndex]?.category ?? '';
  const { ready, count, people, joins } = usePresence();
  const stats = useDayStats();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    updatePresence({ tag });
  }, [tag]);

  useEffect(() => {
    const timer = window.setInterval(() => setTick((t) => t + 1), ROTATE_MS);
    return () => window.clearInterval(timer);
  }, []);

  const others = useMemo(() => people.filter((p) => !p.isMe), [people]);

  const message = useMemo(() => {
    const fresh = joins.find((j) => Date.now() - j.at < FRESH_JOIN_MS && others.some((p) => p.key === j.key));
    if (fresh) return { key: `join-${fresh.key}-${fresh.at}`, name: fresh.name || DEFAULT_DISPLAY_NAME, text: 'baru mulai berdzikr' };
    if (others.length === 0) return null;
    const person = others[tick % others.length];
    return {
      key: `${person.key}-${tick}`,
      name: person.name || DEFAULT_DISPLAY_NAME,
      text: person.tag ? `sedang berdzikr · ${person.tag}` : 'sedang berdzikr',
    };
  }, [joins, others, tick]);

  if (!supabase) return null;

  return (
    <div className="live-presence">
      <Link href="/community" className="live-pill" aria-label="Buka halaman Bersama Berdzikr">
        <span className={`live-dot ${ready ? 'is-live' : ''}`} aria-hidden="true" />
        {ready ? (
          <span>
            <strong>{formatId(count)}</strong> sedang berdzikr
          </span>
        ) : (
          <span>Berdzikr bersama</span>
        )}
        {stats && (
          <>
            <span className="live-sep" aria-hidden="true">·</span>
            <span>
              <strong>{formatId(stats.total)}</strong> dzikr hari ini
            </span>
          </>
        )}
        <span className="live-chevron" aria-hidden="true">›</span>
      </Link>
      {message && (
        <div className="live-ticker" role="status" aria-live="polite">
          <span key={message.key} className="live-ticker-line">
            <strong>{message.name}</strong> {message.text}
          </span>
        </div>
      )}
    </div>
  );
};

export default LivePresence;
