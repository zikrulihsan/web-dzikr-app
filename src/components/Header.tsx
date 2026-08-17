'use client';

import React, { useEffect, useState } from 'react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { useDzikrStore } from '@/store/dzikrStore';
import Settings from './Settings';
import Icon from './Icon';

const Header: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const { resetAllProgress } = useDzikrStore();

  useEffect(() => {
    const hasOpenedBefore = localStorage.getItem('hasOpenedApp');
    if (!hasOpenedBefore) {
      localStorage.setItem('hasOpenedApp', 'true');
      setShowTooltip(true);
      const timer = setTimeout(() => setShowTooltip(false), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSettingsClick = () => {
    setIsSettingsOpen(true);
    setShowTooltip(false);
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
          data-tooltip-id="settings-tooltip"
          aria-label="Buka pengaturan"
        >
          <Icon icon="fa-solid fa-sliders" size={15} />
        </button>
      </header>

      <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {showTooltip && (
        <Tooltip
          id="settings-tooltip"
          place="bottom"
          content="Atur tampilan dan cara menghitung dzikr di sini"
          isOpen={showTooltip}
          style={{
            backgroundColor: 'var(--text-primary)',
            color: 'var(--background-color)',
            borderRadius: '12px',
            fontSize: '12px',
            maxWidth: '230px',
            padding: '9px 12px',
            textAlign: 'center',
            zIndex: 9999,
          }}
        />
      )}
    </>
  );
};

export default Header;
