'use client';

import React, { useState } from 'react';
import { useDzikrStore } from '@/store/dzikrStore';
import { useFocusMode } from '@/lib/useFocusMode';
import { useActivePeriod } from '@/lib/useDzikrPeriod';
import { periodLabel } from '@/lib/dzikrPeriod';
import Settings from './Settings';
import Icon from './Icon';

const Header: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { resetAllProgress } = useDzikrStore();
  const { enterFocusMode } = useFocusMode();
  const activePeriod = useActivePeriod();

  const handleSettingsClick = () => {
    setIsSettingsOpen(true);
  };

  const handleResetAll = () => {
    // Only the period on screen is cleared; the other half of the day stands.
    if (window.confirm(`Atur ulang semua progres ${periodLabel[activePeriod].toLowerCase()}?`)) {
      resetAllProgress();
    }
  };

  return (
    <>
      <header className="app-header">
        <button
          className="icon-button"
          onClick={handleResetAll}
          aria-label={`Atur ulang progres ${periodLabel[activePeriod].toLowerCase()}`}
        >
          <Icon icon="fa-solid fa-rotate-left" size={14} />
        </button>

        <div className="app-brand" aria-label="Tap Tap Dzikr">
          <span className="app-brand-mark">d.</span>
          <span className="app-brand-copy">
            <strong>Tap Tap Dzikr</strong>
            <span>{periodLabel[activePeriod]} · alihkan tap tap medsos ke dzikr</span>
          </span>
        </div>

        <div className="header-actions">
          <button
            className="icon-button"
            onClick={enterFocusMode}
            aria-label="Mode fokus layar penuh"
            title="Mode fokus — hanya kartu dzikr"
          >
            <Icon icon="fa-solid fa-expand" size={14} />
          </button>

          <button
            className="icon-button"
            id="settings-button"
            onClick={handleSettingsClick}
            aria-label="Buka pengaturan"
          >
            <Icon icon="fa-solid fa-sliders" size={15} />
          </button>
        </div>
      </header>

      <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
};

export default Header;
