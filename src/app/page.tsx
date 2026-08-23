'use client';

import React from 'react';
import Header from '@/components/Header';
import DzikrSlider from '@/components/DzikrSlider';
import Icon from '@/components/Icon';
import { useFocusMode } from '@/lib/useFocusMode';

export default function Home() {
  const { isFocusMode, exitFocusMode } = useFocusMode();

  return (
    <div className={`app-shell ${isFocusMode ? 'is-focus' : ''}`}>
      <Header />

      <div className="app-body">
        <DzikrSlider />
      </div>

      {isFocusMode && (
        <button
          className="focus-exit"
          type="button"
          onClick={exitFocusMode}
          aria-label="Keluar dari mode fokus"
          title="Keluar dari mode fokus (Esc)"
        >
          <Icon icon="fa-solid fa-compress" size={14} />
        </button>
      )}
    </div>
  );
}
