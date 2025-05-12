'use client';

import React, { useState } from 'react';
import { useDzikrStore } from '@/store/dzikrStore';
import { DzikrItem, dzikrData } from '@/data/dzikrData';

interface DzikrCardProps {
  dzikr: DzikrItem;
  onIncrement?: () => void;
  onDecrement?: () => void;
  onReset?: () => void;
}

const DzikrCard: React.FC<DzikrCardProps> = ({ dzikr, onIncrement, onDecrement, onReset }) => {
  const [expanded, setExpanded] = useState(false);
  const { 
    incrementCount, 
    decrementCount, 
    getProgress, 
    getCompletionPercentage, 
    resetCount, 
    settings,
    currentIndex,
    setCurrentIndex 
  } = useDzikrStore();
  
  const progress = getProgress(dzikr.id);
  const percentage = getCompletionPercentage(dzikr.id);
  const isCompleted = progress >= dzikr.count;
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  const handleIncrement = () => {
    if (!isCompleted) {
      incrementCount(dzikr.id);
    } else {
      // Move to next dzikr if there is one
      if (currentIndex < dzikrData.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    }
    // Call the callback if provided
    if (onIncrement) onIncrement();
  };
  
  const handleDecrement = () => {
    decrementCount(dzikr.id);
    // Call the callback if provided
    if (onDecrement) onDecrement();
  };
  
  const handleReset = () => {
    resetCount(dzikr.id);
    // Call the callback if provided
    if (onReset) onReset();
  };
  
  // Return only the card content without buttons
  return (
    <div style={{
      backgroundColor: settings.theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
      borderRadius: '1rem',
      padding: '1.5rem',
      margin: '0 auto',
      paddingBottom: '2rem',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      width: '100%',
      maxWidth: '90%',
      justifyContent: 'space-between',
      color: settings.theme === 'dark' ? 'white' : '#333'
    }}>
      {/* Main content */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between'}}>
        {/* Progress indicator */}
        <div style={{ marginBottom: '1rem' }}>
          {/* Loading-like progress bar */}
          <div style={{
            width: '100%',
            height: '4px',
            backgroundColor: settings.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            borderRadius: '2px',
            marginBottom: '0.5rem',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${percentage}%`,
              backgroundColor: isCompleted ? '#4CAF50' : 'rgb(var(--primary-color))',
              borderRadius: '2px',
              transition: 'width 0.3s ease, background-color 0.3s ease'
            }} />
          </div>
          
          {/* Counter text */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ 
              fontSize: '0.875rem', 
              color: isCompleted ? '#4CAF50' : (settings.theme === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)')
            }}>
              Dibaca {progress}x
            </span>
            <span style={{ 
              fontSize: '0.875rem', 
              color: isCompleted ? '#4CAF50' : (settings.theme === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)')
            }}>
              Target: {dzikr.count}x
            </span>
          </div>
        </div>   
        <div style={{flex: 1}}>
          <h2 style={{
            fontSize: settings.showLatin && settings.showTranslation ? '1.25rem' : '1.5rem',
            marginBottom: '1.5rem',
            fontWeight: 600,
            textAlign: 'center',
            color: isCompleted ? '#4CAF50' : 'rgb(var(--primary-color))',
            transition: 'font-size 0.3s ease'
          }}>{dzikr.category}</h2>
          <div style={{display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <div style={{ 
              marginBottom: settings.showLatin || settings.showTranslation ? '0.5rem' : '2rem', 
              textAlign: 'center', 
              fontSize: !settings.showLatin && !settings.showTranslation ? '2.5rem' : '1.5rem', 
              color: settings.theme === 'dark' ? 'white' : '#333',
              flex: !settings.showLatin && !settings.showTranslation ? 2 : 'initial',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'font-size 0.3s ease, margin-bottom 0.3s ease',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}>
              {dzikr.arabic}
            </div>
            
            {settings.showLatin && (
              <div style={{ 
                marginBottom: settings.showTranslation ? '1rem' : '2rem', 
                textAlign: 'center', 
                fontStyle: 'italic',
                fontSize: !settings.showTranslation ? '1.25rem' : '1rem', 
                color: settings.theme === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
                flex: !settings.showTranslation ? 1 : 'initial',
                transition: 'font-size 0.3s ease, margin-bottom 0.3s ease'
              }}>
                {dzikr.latin}
              </div>
            )}
            
            {settings.showTranslation && (
              <p style={{
                fontSize: !settings.showLatin ? '1rem' : '1rem',
                marginTop: '1rem',
                marginBottom: '1.5rem',
                textAlign: 'center',
                color: settings.theme === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
                flex: !settings.showLatin ? 1 : 'initial',
                transition: 'font-size 0.3s ease'
              }}>{dzikr.translation}</p>
            )}
          </div>
          {settings.showDescription && (dzikr.description || dzikr.source) && (
          <div style={{
            backgroundColor: settings.theme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
            borderRadius: '0.5rem',
            padding: !settings.showLatin && !settings.showTranslation ? '1rem' : '0.75rem',
            marginBottom: expanded ? '1rem' : 0, // Remove margin when not expanded
            flex: !settings.showLatin && !settings.showTranslation ? 1 : 'initial',
            transition: 'padding 0.3s ease, margin-bottom 0.3s ease'
          }}>
            <div 
              onClick={toggleExpanded}
              style={{
                cursor: 'pointer',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                marginBottom: expanded ? '0.5rem' : 0
              }}>
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: settings.theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)'
                }}>
                  Keterangan
                </span>
                <span style={{
                  color: 'rgb(var(--primary-color))',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  {expanded ? '▲' : '▼'}
                </span>
              </div>
              
              {expanded && (
                <div style={{ textAlign: 'left', marginTop: '0.5rem' }}>
                  {dzikr.description && (
                    <p style={{
                      fontSize: !settings.showLatin && !settings.showTranslation ? '1rem' : '0.875rem',
                      color: settings.theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                      marginBottom: dzikr.source ? '0.5rem' : 0,
                      lineHeight: !settings.showLatin && !settings.showTranslation ? '1.6' : '1.4',
                      transition: 'font-size 0.3s ease, line-height 0.3s ease'
                    }}>
                      {dzikr.description}
                    </p>
                  )}
                  {dzikr.source && (
                    <p style={{
                      fontSize: !settings.showLatin && !settings.showTranslation ? '1rem' : '0.875rem',
                      fontStyle: 'italic',
                      color: settings.theme === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                      marginTop: dzikr.description ? '0.5rem' : 0,
                      transition: 'font-size 0.3s ease'
                    }}>
                      Sumber: {dzikr.source}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        </div>
        {/* Note is now displayed in DzikrSlider component */}
        
        {/* Collapsible description section */}

        
        {/* No spacer needed since we're using justify-content: center */}
      </div>
    </div>
  );
};

export default DzikrCard;
