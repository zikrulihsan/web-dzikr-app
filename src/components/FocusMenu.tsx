'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useDzikrStore } from '@/store/dzikrStore';
import { useActivePeriod } from '@/lib/useDzikrPeriod';
import { periodLabel } from '@/lib/dzikrPeriod';
import { useResolvedTheme } from '@/lib/useResolvedTheme';
import { prayerLabel } from '@/lib/prayerTimes';
import { formatClock, usePrayerTimes } from '@/lib/usePrayerTimes';
import Settings from './Settings';
import Icon from './Icon';

const MENU_HINT_KEY = 'dzikr-menu-hint-seen';

const hasSeenMenuHint = () => {
  try {
    return window.localStorage.getItem(MENU_HINT_KEY) === '1';
  } catch {
    return true;
  }
};

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
  const menuRef = useRef<HTMLDivElement>(null);
  // First visit only: point at the button, since it is the one way to settings.
  const [showHint, setShowHint] = useState(false);

  useEffect(() => setShowHint(!hasSeenMenuHint()), []);

  const dismissHint = () => {
    setShowHint(false);
    try {
      window.localStorage.setItem(MENU_HINT_KEY, '1');
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
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
      {/* Catches taps so dismissing the hint does not also count a dzikr. */}
      {showHint && <div className="menu-hint-backdrop" onClick={dismissHint} aria-hidden="true" />}

      <div className="focus-menu" ref={menuRef}>
        <button
          className={`focus-menu-trigger ${isOpen ? 'is-open' : ''} ${showHint ? 'is-hinted' : ''}`}
          type="button"
          onClick={() => {
            if (showHint) dismissHint();
            setIsOpen((open) => !open);
          }}
          aria-label="Buka menu"
          aria-expanded={isOpen}
          aria-haspopup="menu"
        >
          <Icon icon={isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-ellipsis'} size={15} />
        </button>

        {showHint && (
          <div className="menu-hint" role="dialog" aria-label="Petunjuk menu">
            <strong>Menu ada di sini</strong>
            <span>Atur cara menghitung, tampilan, tema, atau mulai ulang dari tombol ini.</span>
            <button type="button" onClick={dismissHint}>Mengerti</button>
          </div>
        )}

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
