'use client';

import React, { useEffect } from 'react';
import { useActivePeriod } from '@/lib/useDzikrPeriod';
import { periodLabel } from '@/lib/dzikrPeriod';
import { prayerLabel } from '@/lib/prayerTimes';
import { formatClock, formatCountdown, usePrayerTimes } from '@/lib/usePrayerTimes';

interface StartScreenProps {
  onStart: () => void;
}

/**
 * The first thing a visit shows: which dzikir is due now and the next prayer.
 * Any tap (or Enter/Space) starts, and doubles as the user gesture that the
 * browser needs before it allows fullscreen.
 */
const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const period = useActivePeriod();
  const { next, now, location } = usePrayerTimes();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onStart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStart]);

  return (
    <div
      className={`start-screen is-${period}`}
      role="button"
      tabIndex={0}
      aria-label={`Ketuk di mana saja untuk mulai ${periodLabel[period].toLowerCase()}`}
      onClick={onStart}
    >
      <div className="start-glow" aria-hidden="true" />

      <div className="start-top">
        <span className="app-brand-mark">d.</span>
        <span>Tap Tap Dzikr</span>
      </div>

      <div className="start-center">
        <span className="start-greeting">Assalamu'alaykum Warahmatullahi Wabarakatuh</span>
        <h1 className="start-title">{periodLabel[period]}</h1>

        <div className="start-tap" aria-hidden="true">
          <span className="start-ripple" />
          <span className="start-ripple is-late" />
          <span className="start-dot" />
        </div>

        <p className="start-hint">Ketuk di mana saja untuk mulai</p>

        <figure className="start-quote">
          <span className="arabic" dir="rtl" lang="ar">أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ</span>
          <blockquote>Ingatlah, hanya dengan mengingat Allah hati menjadi tenteram.</blockquote>
          <figcaption>QS. Ar-Ra&apos;d: 28</figcaption>
        </figure>

        <p className="start-mode">Sesuaikan tampilan di pengaturan ⋯ kanan atas.</p>
      </div>

      <div className="start-prayer" aria-live="polite">
        {next && now ? (
          <>
            <span className="start-prayer-label">
              Shalat berikutnya{location.isDevice ? '' : ' · Jakarta'}
            </span>
            <span className="start-prayer-main">
              <strong>{prayerLabel[next.name]}</strong>
              <span className="start-prayer-clock">{formatClock(next.time)}</span>
            </span>
            <span className="start-prayer-countdown">{formatCountdown(now, next.time)}</span>
          </>
        ) : (
          <span className="start-prayer-label">Menghitung waktu shalat…</span>
        )}
      </div>
    </div>
  );
};

export default StartScreen;
