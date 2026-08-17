'use client';

import React, { useState } from 'react';
import { useDzikrStore } from '@/store/dzikrStore';
import type { FontSizePreference } from '@/store/dzikrStore';
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

const Settings: React.FC<SettingsProps> = ({ isOpen, onClose }) => {
  const [isTextSizeOpen, setIsTextSizeOpen] = useState(false);
  const { settings, updateSettings, toggleTheme } = useDzikrStore();
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
          <h3>Tampilan</h3>
          <button className="setting-row" type="button" onClick={toggleTheme} style={{ width: '100%', background: 'none', borderLeft: 0, borderRight: 0, borderTop: 0, color: 'inherit' }}>
            <span className="setting-choice">
              <span>Mode tema</span>
              <small>Sesuaikan dengan kenyamanan mata</small>
            </span>
            <span className="category-pill">{settings.theme === 'dark' ? 'Gelap' : 'Terang'}</span>
          </button>

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

          <label className="setting-row">
            <span className="setting-choice">
              <span>Petunjuk tombol aksi</span>
              <small>Tampilkan kembali penjelasan tombol + atau ✓</small>
            </span>
            <input
              type="checkbox"
              checked={settings.showActionHint ?? true}
              onChange={(event) => updateSettings({ showActionHint: event.target.checked })}
            />
          </label>

          {isTextSizeOpen && (
            <div className="settings-submenu">
              {renderFontSizeControl('Arab', 'ع', 'arabicFontSize')}
              {renderFontSizeControl('Latin', 'Aa', 'latinFontSize')}
              {renderFontSizeControl('Arti', 'A', 'translationFontSize')}
            </div>
          )}
        </div>

        <div className="settings-section">
          <h3>Cara menghitung</h3>
          <label className="setting-row">
            <span className="setting-choice">
              <span>Penanda</span>
              <small>Satu tap untuk menandai selesai</small>
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
              <small>Hitung bacaan satu per satu</small>
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
