'use client';

import React, { useState } from 'react';
import { useDzikrStore } from '@/store/dzikrStore';
import type { FontSizePreference, PeriodPreference, ThemePreference } from '@/store/dzikrStore';
import { useFocusMode } from '@/lib/useFocusMode';
import { useResolvedTheme } from '@/lib/useResolvedTheme';
import { periodLabel } from '@/lib/dzikrPeriod';
import Icon from './Icon';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const fontSizeOptions: Array<{ label: string; value: FontSizePreference }> = [
  { label: 'Kecil', value: 'small' },
  { label: 'Sedang', value: 'medium' },
  { label: 'Besar', value: 'large' },
];

const themeOptions: Array<{ label: string; value: ThemePreference }> = [
  { label: 'Terang', value: 'light' },
  { label: 'Gelap', value: 'dark' },
  { label: 'Otomatis', value: 'auto' },
];

const periodOptions: Array<{ label: string; value: PeriodPreference }> = [
  { label: 'Pagi', value: 'pagi' },
  { label: 'Petang', value: 'petang' },
  { label: 'Otomatis', value: 'auto' },
];

const Settings: React.FC<SettingsProps> = ({ isOpen, onClose }) => {
  const [isTextSizeOpen, setIsTextSizeOpen] = useState(false);
  const { settings, updateSettings, detectedPeriod } = useDzikrStore();
  const { isFocusMode, enterFocusMode, exitFocusMode } = useFocusMode();
  const resolvedTheme = useResolvedTheme();

  const theme = settings.theme ?? 'auto';
  const periodPreference = settings.periodPreference ?? 'auto';

  const themeHint =
    theme === 'auto'
      ? `Mengikuti sistem — sekarang ${resolvedTheme === 'dark' ? 'gelap' : 'terang'}`
      : 'Sesuaikan dengan kenyamanan mata';

  const periodHint =
    periodPreference === 'auto'
      ? `Mengikuti waktu shalat — sekarang ${periodLabel[detectedPeriod]}`
      : `Dikunci pada ${periodLabel[periodPreference]}`;

  // Entering focus mode is pointless behind the panel, so hand the screen back.
  const handleFocusModeChange = (enabled: boolean) => {
    if (enabled) {
      enterFocusMode();
      onClose();
      return;
    }
    exitFocusMode();
  };

  if (!isOpen) return null;

  const renderFontSizeControl = (
    label: string,
    preview: string,
    settingKey: 'arabicFontSize' | 'latinFontSize' | 'translationFontSize',
  ) => {
    const currentValue = settings[settingKey] ?? 'medium';

    return (
      <div className="font-size-row">
        <div className="font-size-label">
          <span className={`font-preview is-${settingKey}`}>{preview}</span>
          <span>{label}</span>
        </div>
        <div className="font-size-options" role="radiogroup" aria-label={`Ukuran font ${label}`}>
          {fontSizeOptions.map((option) => (
            <button
              className={currentValue === option.value ? 'is-active' : ''}
              key={option.value}
              type="button"
              role="radio"
              aria-checked={currentValue === option.value}
              onClick={() => updateSettings({ [settingKey]: option.value })}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="settings-overlay" role="presentation" onMouseDown={onClose}>
      <section
        className="settings-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="settings-head">
          <div>
            <span className="category-pill">Preferensi</span>
            <h2 id="settings-title" style={{ marginTop: 12 }}>Pengaturan</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Tutup pengaturan">
            <Icon icon="fa-solid fa-xmark" size={16} />
          </button>
        </div>

        <div className="settings-section">
          <h3>Waktu dzikr</h3>
          <div className="setting-stack">
            <span className="setting-choice">
              <span>Dzikr pagi atau petang</span>
              <small>{periodHint}</small>
            </span>
            <div className="segmented" role="radiogroup" aria-label="Waktu dzikr">
              {periodOptions.map((option) => (
                <button
                  className={periodPreference === option.value ? 'is-active' : ''}
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={periodPreference === option.value}
                  onClick={() => updateSettings({ periodPreference: option.value })}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div className="settings-tip">
            Pada mode otomatis, dzikr pagi tampil dari Subuh sampai Ashar, lalu berganti ke dzikr
            petang sampai Subuh berikutnya, mengikuti waktu shalat di lokasi Anda (Jakarta bila
            lokasi tidak diizinkan).
          </div>
        </div>

        <div className="settings-section">
          <h3>Tampilan</h3>
          <div className="setting-stack">
            <span className="setting-choice">
              <span>Mode tema</span>
              <small>{themeHint}</small>
            </span>
            <div className="segmented" role="radiogroup" aria-label="Mode tema">
              {themeOptions.map((option) => (
                <button
                  className={theme === option.value ? 'is-active' : ''}
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={theme === option.value}
                  onClick={() => updateSettings({ theme: option.value })}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <button
            className="setting-row settings-submenu-trigger"
            type="button"
            onClick={() => setIsTextSizeOpen((value) => !value)}
            aria-expanded={isTextSizeOpen}
          >
            <span className="setting-choice">
              <span>Ukuran teks</span>
              <small>Atur Arab, Latin, dan Arti secara terpisah</small>
            </span>
            <span className="submenu-chevron" aria-hidden="true">{isTextSizeOpen ? '−' : '+'}</span>
          </button>

          {isTextSizeOpen && (
            <div className="settings-submenu">
              {renderFontSizeControl('Arab', 'ع', 'arabicFontSize')}
              {renderFontSizeControl('Latin', 'Aa', 'latinFontSize')}
              {renderFontSizeControl('Arti', 'A', 'translationFontSize')}
            </div>
          )}

          <label className="setting-row">
            <span className="setting-choice">
              <span>Mode fokus</span>
              <small>Layar penuh, hanya kartu dzikr yang tampil</small>
            </span>
            <input
              type="checkbox"
              checked={isFocusMode}
              onChange={(event) => handleFocusModeChange(event.target.checked)}
            />
          </label>

        </div>

        <div className="settings-section">
          <h3>Cara menghitung</h3>
          <label className="setting-row">
            <span className="setting-choice">
              <span>Sekali tap</span>
              <small>Satu tap menandai satu dzikr selesai, lalu langsung lanjut</small>
            </span>
            <input
              type="radio"
              name="countingMethod"
              checked={settings.countingMethod === 'penanda'}
              onChange={() => updateSettings({ countingMethod: 'penanda' })}
            />
          </label>
          <label className="setting-row">
            <span className="setting-choice">
              <span>Counter</span>
              <small>Tap setiap kali membaca, misalnya 3× atau 33×</small>
            </span>
            <input
              type="radio"
              name="countingMethod"
              checked={settings.countingMethod === 'counter'}
              onChange={() => updateSettings({ countingMethod: 'counter' })}
            />
          </label>
          {settings.countingMethod === 'counter' && (
            <div className="settings-tip">
              Utamakan menghitung dengan tangan sebagaimana yang dicontohkan Rasulullah.
            </div>
          )}
        </div>

        <div className="settings-section">
          <h3>Konten kartu</h3>
          <label className="setting-row">
            <span>Tampilkan terjemahan</span>
            <input
              type="checkbox"
              checked={settings.showTranslation}
              onChange={(event) => updateSettings({ showTranslation: event.target.checked })}
            />
          </label>
          <label className="setting-row">
            <span>Tampilkan latin</span>
            <input
              type="checkbox"
              checked={settings.showLatin}
              onChange={(event) => updateSettings({ showLatin: event.target.checked })}
            />
          </label>
          <label className="setting-row">
            <span>Tampilkan keterangan</span>
            <input
              type="checkbox"
              checked={settings.showDescription}
              onChange={(event) => updateSettings({ showDescription: event.target.checked })}
            />
          </label>
        </div>

        <button className="settings-close" type="button" onClick={onClose}>Simpan & tutup</button>
      </section>
    </div>
  );
};

export default Settings;
