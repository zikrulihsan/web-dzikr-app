'use client';

import React from 'react';
import { useDzikrStore } from '@/store/dzikrStore';
import Icon from './Icon';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings, toggleTheme } = useDzikrStore();
  if (!isOpen) return null;

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
