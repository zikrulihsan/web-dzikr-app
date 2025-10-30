'use client';

import React, { useState, useEffect } from 'react';
import { useDzikrStore } from '@/store/dzikrStore';
import Settings from './Settings';
import LoginButton from './LoginButton';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import Icon from './Icon';

const Header: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const { settings, resetAllProgress, updateSettings } = useDzikrStore();
  
  // Show tooltip only on first app open and never again
  useEffect(() => {
    // Check if this is the very first app open
    const hasOpenedBefore = localStorage.getItem('hasOpenedApp');
    
    if (!hasOpenedBefore) {
      // Mark that the app has been opened before
      localStorage.setItem('hasOpenedApp', 'true');
      
      // Show tooltip
      setShowTooltip(true);
      
      // Auto-hide tooltip after 5 seconds
      const timer = setTimeout(() => {
        setShowTooltip(false);
        // No need to update settings since we're using localStorage
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  const handleSettingsClick = () => {
    setIsSettingsOpen(true);
    if (showTooltip) {
      setShowTooltip(false);
    }
  };
  
  const handleResetAll = () => {
    if (window.confirm('Apakah Anda yakin ingin mengatur ulang semua progres dzikr?')) {
      resetAllProgress();
    }
  };
  
  return (
    <>
      <header style={{
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        backgroundColor: settings.theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
        borderBottom: settings.theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
        color: settings.theme === 'dark' ? 'white' : '#333',
        flexWrap: 'wrap'
      }}>
        {/* Left: Reset All Button */}
        <button
          onClick={handleResetAll}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: settings.theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            fontSize: '0.875rem',
            padding: '0.5rem'
          }}
          aria-label="Reset all progress"
        >
          <Icon icon="fa-solid fa-refresh" size={18} />
        </button>

        {/* Center: App Title */}
        <h1 style={{
          margin: 0,
          fontSize: '1.5rem',
          fontWeight: 600,
          color: settings.theme === 'dark' ? 'white' : '#333',
          flex: '1',
          textAlign: 'center'
        }}>Daily Dzikr</h1>

        {/* Right: Login Button and Settings */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <LoginButton />

          <button
            id="settings-button"
            onClick={handleSettingsClick}
            data-tooltip-id="settings-tooltip"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: settings.theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'center',
              fontSize: '0.875rem',
              padding: '0.5rem'
            }}
            aria-label="Open settings"
          >
           <Icon icon="fa-solid fa-gear" size={18} />
          </button>
        </div>
      </header>
      
      {/* Settings Modal */}
      <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      
      {/* Tooltip */}
      {showTooltip && (
        <Tooltip
          id="settings-tooltip"
          place="bottom"
          content="Klik di sini untuk mengatur tampilan dan metode penghitungan"
          isOpen={showTooltip}
          style={{
            backgroundColor: settings.theme === 'dark' ? '#f5f5f5' : '#333',
            color: settings.theme === 'dark' ? '#333' : '#f5f5f5',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '14px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
            zIndex: 9999,
            maxWidth: '250px',
            textAlign: 'center'
          }}
        />
      )}
    </>
  );
};

export default Header;
