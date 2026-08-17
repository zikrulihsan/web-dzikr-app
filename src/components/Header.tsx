'use client';

import React, { useState } from 'react';
import { useDzikrStore } from '@/store/dzikrStore';
import Settings from './Settings';
import Icon from './Icon';

const Header: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { resetAllProgress } = useDzikrStore();

  const handleSettingsClick = () => {
    setIsSettingsOpen(true);
  };

  const handleResetAll = () => {
    if (window.confirm('Apakah Anda yakin ingin mengatur ulang semua progres dzikr?')) {
      resetAllProgress();
    }
  };

  return (
    <>
      <header className="app-header">
        <button className="icon-button" onClick={handleResetAll} aria-label="Atur ulang semua progres">
          <Icon icon="fa-solid fa-rotate-left" size={14} />
        </button>

        <div className="app-brand" aria-label="Tap Tap Dzikr">
          <span className="app-brand-mark">d.</span>
          <span className="app-brand-copy">
            <strong>Tap Tap Dzikr</strong>
            <span>jeda kecil untuk hati</span>
          </span>
        </div>

        <button
          className="icon-button"
          id="settings-button"
          onClick={handleSettingsClick}
          aria-label="Buka pengaturan"
        >
          <Icon icon="fa-solid fa-sliders" size={15} />
        </button>
      </header>

      <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
};

export default Header;
