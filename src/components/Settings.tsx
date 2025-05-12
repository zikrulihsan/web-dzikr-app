'use client';

import React, { useState } from 'react';
import { useDzikrStore } from '@/store/dzikrStore';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings, toggleTheme } = useDzikrStore();
  
  if (!isOpen) return null;
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: settings.theme === 'dark' ? '#1e1e1e' : '#ffffff',
        borderRadius: '0.5rem',
        padding: '1.5rem',
        width: '90%',
        maxWidth: '400px',
        maxHeight: '80vh',
        overflow: 'auto',
        color: settings.theme === 'dark' ? '#ffffff' : '#333333',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Pengaturan</h2>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: settings.theme === 'dark' ? '#ffffff' : '#333333',
              padding: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            &times;
          </button>
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Tampilan</h3>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.75rem'
          }}>
            <span>Mode Tema</span>
            <button
              onClick={toggleTheme}
              style={{
                backgroundColor: 'rgb(var(--primary-color))',
                color: 'white',
                border: 'none',
                borderRadius: '0.25rem',
                padding: '0.5rem 0.75rem',
                fontSize: '0.875rem',
                cursor: 'pointer'
              }}
            >
              {settings.theme === 'dark' ? 'Terang' : 'Gelap'}
            </button>
          </div>
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Metode Penghitung</h3>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            marginBottom: '1rem'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer'
              }}>
                <input
                  type="radio"
                  name="countingMethod"
                  checked={settings.countingMethod === 'penanda'}
                  onChange={() => updateSettings({ countingMethod: 'penanda' })}
                  style={{ width: '1rem', height: '1rem' }}
                />
                <span>Penanda (tandai sebagai selesai)</span>
              </label>
              
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer'
              }}>
                <input
                  type="radio"
                  name="countingMethod"
                  checked={settings.countingMethod === 'counter'}
                  onChange={() => updateSettings({ countingMethod: 'counter' })}
                  style={{ width: '1rem', height: '1rem' }}
                />
                <span>Counter (hitung satu per satu)</span>
              </label>
            </div>
            
            {settings.countingMethod === 'counter' && (
              <div style={{
                backgroundColor: 'rgba(255, 165, 0, 0.1)',
                padding: '0.75rem',
                borderRadius: '0.25rem',
                borderLeft: '3px solid orange',
                fontSize: '0.875rem',
                color: settings.theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)'
              }}>
                Utamakan menghitung dengan tangan sebagaimana yang dicontohkan oleh Rasulullah
              </div>
            )}
          </div>
          
          <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Konten</h3>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}>
              <span>Tampilkan Terjemahan</span>
              <input
                type="checkbox"
                checked={settings.showTranslation}
                onChange={(e) => updateSettings({ showTranslation: e.target.checked })}
                style={{ width: '1.25rem', height: '1.25rem' }}
              />
            </label>
            
            <label style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}>
              <span>Tampilkan Latin</span>
              <input
                type="checkbox"
                checked={settings.showLatin}
                onChange={(e) => updateSettings({ showLatin: e.target.checked })}
                style={{ width: '1.25rem', height: '1.25rem' }}
              />
            </label>
            
            <label style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}>
              <span>Tampilkan Keterangan</span>
              <input
                type="checkbox"
                checked={settings.showDescription}
                onChange={(e) => updateSettings({ showDescription: e.target.checked })}
                style={{ width: '1.25rem', height: '1.25rem' }}
              />
            </label>
          </div>
        </div>
        
        <button
          onClick={onClose}
          style={{
            width: '100%',
            backgroundColor: 'rgb(var(--primary-color))',
            color: 'white',
            border: 'none',
            borderRadius: '0.25rem',
            padding: '0.75rem',
            fontSize: '1rem',
            cursor: 'pointer',
            marginTop: '1rem'
          }}
        >
          Tutup
        </button>
      </div>
    </div>
  );
};

export default Settings;
