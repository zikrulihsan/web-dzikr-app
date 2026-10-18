'use client';

import React, { useEffect, useState } from 'react';
import { useDzikrStore } from '@/store/dzikrStore';
import { useActivePeriod } from '@/lib/useDzikrPeriod';
import { periodLabel } from '@/lib/dzikrPeriod';
import { useResolvedTheme } from '@/lib/useResolvedTheme';
import { prayerLabel } from '@/lib/prayerTimes';
import { formatClock, usePrayerTimes } from '@/lib/usePrayerTimes';
import Settings from './Settings';
import Icon from './Icon';

/**
 * The one control left on screen while reading full screen: a small button
 * that opens restart, the full menu and a light/dark switch.
 */
const FocusMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const resetAllProgress = useDzikrStore((state) => state.resetAllProgress);
  const updateSettings = useDzikrStore((state) => state.updateSettings);
  const activePeriod = useActivePeriod();
  const theme = useResolvedTheme();
  const { next } = usePrayerTimes();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleRestart = () => {
    setIsOpen(false);
    // Only the period on screen is cleared; the other half of the day stands.
    if (window.confirm(`Mulai ulang ${periodLabel[activePeriod].toLowerCase()} dari awal?`)) {
      resetAllProgress();
    }
  };

  const handleMenu = () => {
    setIsOpen(false);
    setIsSettingsOpen(true);
  };

  const handleTheme = () => {
    updateSettings({ theme: theme === 'dark' ? 'light' : 'dark' });
  };

  return (
    <>
      {/* A tap outside the open menu only closes it; it never counts a dzikr. */}
      {isOpen && <div className="focus-menu-backdrop" onClick={() => setIsOpen(false)} aria-hidden="true" />}

      <div className="focus-menu">
        <button
          className={`focus-menu-trigger ${isOpen ? 'is-open' : ''}`}
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-label="Buka menu"
          aria-expanded={isOpen}
          aria-haspopup="menu"
        >
          <Icon icon={isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-ellipsis'} size={15} />
        </button>

        {isOpen && (
          <div className="focus-menu-panel" role="menu" aria-label="Menu">
            {next && (
              <div className="focus-menu-prayer">
                <span>Shalat berikutnya</span>
                <strong>
                  {prayerLabel[next.name]} {formatClock(next.time)}
                </strong>
              </div>
            )}
            <button type="button" role="menuitem" onClick={handleRestart}>
              <Icon icon="fa-solid fa-rotate-left" size={14} />
              <span>Mulai ulang</span>
            </button>
            <button type="button" role="menuitem" onClick={handleMenu}>
              <Icon icon="fa-solid fa-sliders" size={14} />
              <span>Menu</span>
            </button>
            <button type="button" role="menuitem" onClick={handleTheme}>
              <Icon icon={theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon'} size={14} />
              <span>{theme === 'dark' ? 'Mode terang' : 'Mode gelap'}</span>
            </button>
          </div>
        )}
      </div>

      <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
};

export default FocusMenu;
