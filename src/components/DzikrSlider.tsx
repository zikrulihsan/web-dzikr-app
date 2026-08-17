'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import '@/styles/swiper-custom.css';
import { dzikrData } from '@/data/dzikrData';
import { useDzikrStore } from '@/store/dzikrStore';
import { useScoreSync } from '@/lib/useScoreSync';
import DzikrCard from './DzikrCard';
import Icon from './Icon';

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
    updateSettings,
  } = useDzikrStore();
  const [isClient, setIsClient] = useState(false);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [pulsingDzikrId, setPulsingDzikrId] = useState<number | null>(null);
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const pulseTimerRef = useRef<number | null>(null);

  useScoreSync();

  const scrollContentToTop = () => {
    if (contentContainerRef.current) contentContainerRef.current.scrollTop = 0;
  };

  useEffect(() => {
    setIsClient(true);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' && currentIndex < dzikrData.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else if (event.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (pulseTimerRef.current) window.clearTimeout(pulseTimerRef.current);
    };
  }, [currentIndex, setCurrentIndex]);

  useEffect(() => {
    if (swiperInstance && swiperInstance.activeIndex !== currentIndex) {
      swiperInstance.slideTo(currentIndex);
      scrollContentToTop();
    }
  }, [currentIndex, swiperInstance]);

  const currentDzikr = dzikrData[currentIndex];
  const currentProgress = getProgress(currentDzikr.id);
  const isCompleted = currentProgress >= currentDzikr.count;

  const moveNext = (delay = 0) => {
    if (currentIndex < dzikrData.length - 1) {
      window.setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        scrollContentToTop();
      }, delay);
    }
  };

  const handleIncrement = () => {
    if (isCompleted) {
      moveNext();
      return;
    }

    if ('vibrate' in navigator) navigator.vibrate(10);
    setPulsingDzikrId(currentDzikr.id);
    if (pulseTimerRef.current) window.clearTimeout(pulseTimerRef.current);
    pulseTimerRef.current = window.setTimeout(() => setPulsingDzikrId(null), 420);

    if (settings.countingMethod === 'penanda') {
      for (let count = currentProgress; count < currentDzikr.count; count += 1) {
        incrementCount(currentDzikr.id);
      }
      moveNext(500);
      return;
    }

    incrementCount(currentDzikr.id);
    if (currentProgress + 1 >= currentDzikr.count) moveNext(650);
  };

  return (
    <div className="slider-shell">
      <div className="progress-rail" aria-label="Daftar progres dzikr">
        {dzikrData.map((dzikr, index) => {
          const completed = getCompletionPercentage(dzikr.id) === 100;
          const state = completed ? 'is-complete' : index === currentIndex ? 'is-active' : '';
          return (
            <button
              className={`progress-segment ${state}`}
              key={dzikr.id}
              type="button"
              onClick={() => setCurrentIndex(index)}
              aria-label={`Buka dzikr ${index + 1}: ${dzikr.category}`}
              aria-current={index === currentIndex ? 'step' : undefined}
            />
          );
        })}
      </div>

      <nav className="slider-position" aria-label="Navigasi dzikr">
        <button
          type="button"
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          aria-label="Dzikr sebelumnya"
        >
          ‹
        </button>
        <span>{currentIndex + 1} / {dzikrData.length}</span>
        <button
          type="button"
          onClick={() => setCurrentIndex(Math.min(dzikrData.length - 1, currentIndex + 1))}
          disabled={currentIndex === dzikrData.length - 1}
          aria-label="Dzikr berikutnya"
        >
          ›
        </button>
      </nav>

      <div className="slider-content" ref={contentContainerRef}>
        {isClient ? (
          <Swiper
            grabCursor
            slidesPerView={1}
            initialSlide={currentIndex}
            onSwiper={setSwiperInstance}
            onSlideChange={(swiper) => {
              setCurrentIndex(swiper.activeIndex);
              scrollContentToTop();
            }}
          >
            {dzikrData.map((dzikr, index) => (
              <SwiperSlide key={dzikr.id}>
                <DzikrCard
                  dzikr={dzikr}
                  isPulsing={pulsingDzikrId === dzikr.id}
                  onTap={index === currentIndex ? handleIncrement : undefined}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div style={{ padding: '18px 0 24px' }}>
            <DzikrCard dzikr={dzikrData[0]} />
          </div>
        )}
      </div>

      {isClient && (
        <div className="action-float">
          {(settings.showActionHint ?? true) && (
            <div className="action-label" role="status">
              <span>
                {isCompleted
                  ? 'Lanjut dzikr berikutnya'
                  : settings.countingMethod === 'counter'
                    ? 'Tap + untuk 1 bacaan'
                    : 'Tap ✓ untuk tandai selesai'}
              </span>
              <button
                type="button"
                onClick={() => updateSettings({ showActionHint: false })}
                aria-label="Sembunyikan petunjuk tombol"
              >
                ×
              </button>
            </div>
          )}
          <div className={`action-corrections ${currentProgress === 0 ? 'is-hidden' : ''}`}>
            <button
              className="action-small"
              type="button"
              onClick={() => decrementCount(currentDzikr.id)}
              aria-label="Kurangi hitungan"
              tabIndex={currentProgress === 0 ? -1 : 0}
            >
              −
            </button>

            <button
              className="action-small"
              type="button"
              onClick={() => resetCount(currentDzikr.id)}
              aria-label="Atur ulang dzikr ini"
              tabIndex={currentProgress === 0 ? -1 : 0}
            >
              <Icon icon="fa-solid fa-rotate-left" size={13} />
            </button>
          </div>

          <button
            className={`action-main ${isCompleted ? 'is-complete' : ''}`}
            type="button"
            onClick={handleIncrement}
            aria-label={isCompleted ? 'Lanjut ke dzikr berikutnya' : settings.countingMethod === 'penanda' ? 'Tandai selesai' : 'Tambah hitungan'}
          >
            {isCompleted ? (
              <Icon icon="fa-solid fa-arrow-right" size={20} />
            ) : settings.countingMethod === 'counter' ? (
              <span className="action-plus" aria-hidden="true">+</span>
            ) : (
              <Icon icon="fa-solid fa-check" size={20} />
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default DzikrSlider;
