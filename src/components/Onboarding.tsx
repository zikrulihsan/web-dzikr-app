'use client';

import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useDzikrStore } from '@/store/dzikrStore';

// Bumped when the walkthrough gains a step everyone should see once.
const ONBOARDING_KEY = 'dzikr-onboarding-v2';

const hasSeenOnboarding = () => {
  try {
    return window.localStorage.getItem(ONBOARDING_KEY) === '1';
  } catch {
    return true;
  }
};

interface Step {
  title: string;
  body: React.ReactNode;
  /** The control the step points at; none shows the bubble in the middle. */
  target?: string;
  /** Mark the two tap halves of the card behind the bubble. */
  showSides?: boolean;
}

/**
 * A first-visit walkthrough of the three ways to move through the dzikir:
 * tapping either side of the card, the round button, and the menu.
 */
const Onboarding: React.FC = () => {
  const countingMethod = useDzikrStore((state) => state.settings.countingMethod);
  const [stepIndex, setStepIndex] = useState<number | null>(null);
  const [spot, setSpot] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!hasSeenOnboarding()) setStepIndex(0);
  }, []);

  const isOneTap = countingMethod === 'penanda';
  const steps: Step[] = [
    {
      title: 'Metode hitung dzikr: hitung dengan jari',
      body: (
        <>
          Utamakan hitung dengan tangan untuk menghidupkan Sunnah Rasulullah ﷺ.{' '}
          {isOneTap ? (
            <>Sekali tap berarti selesai, jika butuh counter bisa diatur di <em>Pengaturan</em>.</>
          ) : (
            <>Counter sedang dipakai, dan bisa diganti ke sekali tap di <em>Pengaturan</em>.</>
          )}
        </>
      ),
    },
    {
      title: 'Tap kanan lanjut, tap kiri kembali',
      showSides: true,
      body: isOneTap
        ? 'Baca dzikirnya sesuai jumlahnya, lalu tap sisi kanan kartu untuk menandai selesai dan lanjut. Tap sisi kiri untuk kembali.'
        : 'Tap sisi kanan kartu setiap kali selesai membaca. Tap sisi kiri untuk kembali ke dzikir sebelumnya.',
    },
    {
      title: isOneTap ? 'Tombol selesai' : 'Tombol hitung',
      body: 'Tombol ini sama dengan tap sisi kanan. Kalau salah tandai, tombol − dan ↺ muncul di sebelahnya.',
      target: '.action-main',
    },
    {
      title: 'Menu ada di sini',
      body: 'Atur cara menghitung, tampilan, tema, atau mulai ulang dari tombol ini.',
      target: '.focus-menu-trigger',
    },
  ];
  const step = stepIndex === null ? null : steps[stepIndex];

  useLayoutEffect(() => {
    if (!step?.target) {
      setSpot(null);
      return;
    }
    const measure = () => setSpot(document.querySelector(step.target!)?.getBoundingClientRect() ?? null);
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [step?.target]);

  if (stepIndex === null || !step) return null;

  const isLast = stepIndex === steps.length - 1;
  const advance = () => {
    if (!isLast) {
      setStepIndex(stepIndex + 1);
      return;
    }
    setStepIndex(null);
    try {
      window.localStorage.setItem(ONBOARDING_KEY, '1');
    } catch {
      /* ignore */
    }
  };

  // Bubbles sit below a control near the top and above one near the bottom.
  const below = spot ? spot.top < window.innerHeight / 2 : false;
  const bubbleStyle: React.CSSProperties = spot
    ? {
        right: Math.max(14, window.innerWidth - spot.right),
        ...(below
          ? { top: spot.bottom + 14 }
          : { bottom: window.innerHeight - spot.top + 14 }),
      }
    : {};

  return (
    // The layer takes every tap, so nothing behind it counts a dzikr.
    <div className="onboarding" onClick={advance} role="dialog" aria-label="Petunjuk penggunaan">
      {step.showSides && (
        <div className="onboarding-sides" aria-hidden="true">
          <span data-label="‹ Kembali" />
          <span data-label="Lanjut ›" />
        </div>
      )}

      {spot && (
        <span
          className="onboarding-spot"
          aria-hidden="true"
          style={{
            height: spot.height + 12,
            left: spot.left - 6,
            top: spot.top - 6,
            width: spot.width + 12,
          }}
        />
      )}

      <div
        className={`onboarding-bubble ${spot ? (below ? 'is-below' : 'is-above') : 'is-center'}`}
        style={bubbleStyle}
        onClick={(event) => event.stopPropagation()}
      >
        <strong>{step.title}</strong>
        <span>{step.body}</span>
        <div className="onboarding-actions">
          <span>
            {stepIndex + 1} / {steps.length}
          </span>
          <button type="button" onClick={advance}>
            {isLast ? 'Mengerti' : 'Lanjut'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
