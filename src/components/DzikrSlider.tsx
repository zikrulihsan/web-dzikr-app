'use client';

import React, { useState, useEffect } from 'react';
import { dzikrData } from '@/data/dzikrData';
import { useDzikrStore } from '@/store/dzikrStore';
import DzikrCard from './DzikrCard';
import Icon from './Icon';
// Import Swiper and required modules
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { EffectCoverflow, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import '@/styles/swiper-custom.css';



const DzikrSlider: React.FC = () => {
  const { 
    currentIndex, 
    setCurrentIndex, 
    getCompletionPercentage, 
    getProgress,
    incrementCount,
    decrementCount,
    resetCount,
    settings,
  } = useDzikrStore();
  const [isClient, setIsClient] = useState(false);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  // Custom styles for Swiper
const swiperStyles = {
  container: {
    position: 'relative' as const,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
  },
  contentContainer: {
    flex: 1,
    overflow: 'auto',
    paddingBottom: '7rem', // Add padding to ensure content isn't hidden behind the fixed buttons
  },
  buttonsContainer: {
    position: 'fixed' as const,
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0.75rem 0',
    backgroundColor: settings.theme === 'dark' ? '#121212' : '#f5f5f5', // Match app background color
    backdropFilter: 'blur(8px)',
    zIndex: 10,
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.75rem',
    margin: '0.5rem 0',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    textAlign: 'center' as const,
    color: 'white',
  },
  progressContainer: {
    display: 'flex',
    gap: '0.25rem',
    marginTop: '1.5rem',
    marginBottom: '1.5rem',
    justifyContent: 'center',
    padding: '0 1rem',
  },
  progressDot: (isActive: boolean, isCompleted: boolean) => ({
    height: '0.25rem',
    flex: 1,
    maxWidth: '2rem',
    borderRadius: '9999px',
    backgroundColor: isCompleted 
      ? '#4CAF50' 
      : (isActive ? 'rgb(var(--primary-color))' : 'rgba(128, 128, 128, 0.3)'),
    transition: 'background-color 0.3s ease'
  }),
  swiperContainer: {
    flex: 1,
    width: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  footer: {
    textAlign: 'center' as const,
    fontSize: '0.75rem',
    color: settings.theme === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
    marginTop: '1rem',
    marginBottom: '1rem',
    padding: '0 2rem',
  },
};


  // Client-side only code
  useEffect(() => {
    setIsClient(true);
    
    // Add keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && currentIndex < dzikrData.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex, setCurrentIndex]);
  
  // Effect to update Swiper when currentIndex changes
  useEffect(() => {
    if (swiperInstance && swiperInstance.activeIndex !== currentIndex) {
      swiperInstance.slideTo(currentIndex);
    }
  }, [currentIndex, swiperInstance]);

  // Button handlers
  const handleIncrement = () => {
    const currentDzikr = dzikrData[currentIndex];
    const progress = getProgress(currentDzikr.id);
    const isCompleted = progress >= currentDzikr.count;
    
    if (!isCompleted) {
      if (settings.countingMethod === 'penanda') {
        // For 'penanda' method, complete the dzikr in one click
        for (let i = progress; i < currentDzikr.count; i++) {
          incrementCount(currentDzikr.id);
        }
        
        // In penanda mode, automatically move to the next page after marking as complete
        if (currentIndex < dzikrData.length - 1) {
          setTimeout(() => {
            setCurrentIndex(currentIndex + 1);
          }, 300); // Small delay for better user experience
        }
      } else {
        // For 'counter' method, increment by one
        incrementCount(currentDzikr.id);
      }
    } else {
      // Move to next dzikr if there is one
      if (currentIndex < dzikrData.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    }
  };
  
  const handleDecrement = () => {
    const currentDzikr = dzikrData[currentIndex];
    decrementCount(currentDzikr.id);
  };
  
  const handleReset = () => {
    const currentDzikr = dzikrData[currentIndex];
    resetCount(currentDzikr.id);
  };

  return (
    <div style={swiperStyles.container}>
      {/* Progress indicator dots */}
      <div style={swiperStyles.progressContainer}>
        {dzikrData.map((dzikr, index) => {
          const percentage = getCompletionPercentage(dzikr.id);
          const isCompleted = percentage === 100;
          return (
            <div
              key={index}
              style={swiperStyles.progressDot(index === currentIndex, isCompleted)}
            />
          );
        })}
      </div>

      {/* Swiper container */}
      <div style={swiperStyles.contentContainer}>
        <div style={swiperStyles.swiperContainer}>
          {isClient ? (
            <Swiper
              effect={'coverflow'}
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={'auto'}
              coverflowEffect={{
                rotate: 0,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: false,
              }}
              pagination={false}
              modules={[EffectCoverflow, Pagination]}
              className="mySwiper"
              initialSlide={currentIndex}
              onSwiper={(swiper) => setSwiperInstance(swiper)}
              onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
              style={{ 
                width: '100%', 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {dzikrData.map((dzikr, index) => (
                <SwiperSlide key={dzikr.id} style={{ height: 'auto', display: 'flex', alignItems: 'center' }}>
                  <DzikrCard dzikr={dzikr} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            /* Simple placeholder during server rendering */
            <div style={{ 
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <div style={{ width: '90%', height: '90%', display: 'flex', alignItems: 'center' }}>
                <DzikrCard dzikr={dzikrData[0]} />
              </div>
            </div>
          )}
          
          {/* Source is now displayed below the buttons */}
        </div>
      </div>
      
      {/* Action buttons - sticky at the bottom */}
      {isClient && (
        <div style={swiperStyles.buttonsContainer}>
          {/* Display Note above buttons if available */}
          {dzikrData[currentIndex].note && (
            <p style={{
              fontSize: '0.875rem',
              fontStyle: 'italic',
              marginBottom: '0.75rem',
              textAlign: 'center',
              color: settings.theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
              padding: '0 1rem'
            }}>
              {dzikrData[currentIndex].note}
            </p>
          )}
          {/* Button group for all action buttons */}
          <div style={swiperStyles.buttonGroup}>
            {/* Only show minus button if counter > 0 */}
            {getProgress(dzikrData[currentIndex].id) > 0 && (
              <button 
                onClick={handleDecrement}
                style={{ 
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '50%',
                  backgroundColor: settings.theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                  color: 'white',
                  border: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  cursor: 'pointer'
                }}
              >
                -
              </button>            
            )}
            
            {/* Main add/next button */}
            <button 
              onClick={handleIncrement}
              style={{ 
                width: '3rem',
                height: '3rem',
                borderRadius: '50%',
                backgroundColor: getProgress(dzikrData[currentIndex].id) >= dzikrData[currentIndex].count 
                  ? '#4CAF50' 
                  : 'rgb(var(--primary-color))',
                color: 'white',
                border: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                cursor: 'pointer',
                zIndex: 2 // Make sure it's above other buttons
              }}
            >
              {getProgress(dzikrData[currentIndex].id) >= dzikrData[currentIndex].count 
                ? <Icon icon="fa-solid fa-arrow-right" size={24} /> 
                : (settings.countingMethod === 'penanda' 
                  ? <Icon icon="fa-solid fa-check" size={24} /> 
                  : '+')}
            </button>

            {/* Only show reset button if counter > 0 */}
            {getProgress(dzikrData[currentIndex].id) > 0 && (
              <button 
                onClick={handleReset}
                style={{ 
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '50%',
                  backgroundColor: settings.theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                  color: 'white',
                  border: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                <Icon icon="fa-solid fa-rotate-left" size={14} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DzikrSlider;
