'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import '@/styles/swiper-custom.css';
import { getDzikrList, type DzikrPeriod } from '@/data/dzikrData';
import { useDzikrStore } from '@/store/dzikrStore';
import { useScoreSync } from '@/lib/useScoreSync';
import { usePeriodWatcher } from '@/lib/useDzikrPeriod';
import DzikrCard from './DzikrCard';
import Icon from './Icon';
import PeriodSwitch from './PeriodSwitch';

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
  const previousPeriodRef = useRef<DzikrPeriod | null>(null);

  useScoreSync();
  const activePeriod = usePeriodWatcher();
  const dzikrList = getDzikrList(activePeriod);
  // A stored index can outlive the list it belonged to (petang is shorter).
  const activeIndex = Math.min(Math.max(currentIndex, 0), dzikrList.length - 1);

  const scrollContentToTop = () => {
    if (contentContainerRef.current) contentContainerRef.current.scrollTop = 0;
  };

  useEffect(() => {
    setIsClient(true);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' && activeIndex < dzikrList.length - 1) {
        setCurrentIndex(activeIndex + 1);
      } else if (event.key === 'ArrowLeft' && activeIndex > 0) {
        setCurrentIndex(activeIndex - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (pulseTimerRef.current) window.clearTimeout(pulseTimerRef.current);
    };
  }, [activeIndex, dzikrList.length, setCurrentIndex]);

  // Crossing into the other part of the day starts a fresh reading session.
  useEffect(() => {
    if (previousPeriodRef.current && previousPeriodRef.current !== activePeriod) {
      setCurrentIndex(0);
      scrollContentToTop();
    }
    previousPeriodRef.current = activePeriod;
  }, [activePeriod, setCurrentIndex]);

  useEffect(() => {
    if (swiperInstance && swiperInstance.activeIndex !== activeIndex) {
      swiperInstance.slideTo(activeIndex);
      scrollContentToTop();
    }
  }, [activeIndex, swiperInstance]);

  const currentDzikr = dzikrList[activeIndex];
  const currentProgress = getProgress(currentDzikr.id);
  const isCompleted = currentProgress >= currentDzikr.count;

  const moveNext = (delay = 0) => {
    if (activeIndex < dzikrList.length - 1) {
      window.setTimeout(() => {
        setCurrentIndex(activeIndex + 1);
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
      <PeriodSwitch activePeriod={activePeriod} />

      <div className="progress-rail" aria-label="Daftar progres dzikr">
        {dzikrList.map((dzikr, index) => {
          const completed = getCompletionPercentage(dzikr.id) === 100;
          const state = completed ? 'is-complete' : index === activeIndex ? 'is-active' : '';
          return (
            <button
              className={`progress-segment ${state}`}
              key={dzikr.id}
              type="button"
              onClick={() => setCurrentIndex(index)}
              aria-label={`Buka dzikr ${index + 1}: ${dzikr.category}`}
              aria-current={index === activeIndex ? 'step' : undefined}
            />
          );
        })}
      </div>

      <nav className="slider-position" aria-label="Navigasi dzikr">
        <button
          type="button"
          onClick={() => setCurrentIndex(Math.max(0, activeIndex - 1))}
          disabled={activeIndex === 0}
          aria-label="Dzikr sebelumnya"
        >
          ‹
        </button>
        <span>{activeIndex + 1} / {dzikrList.length}</span>
        <button
          type="button"
          onClick={() => setCurrentIndex(Math.min(dzikrList.length - 1, activeIndex + 1))}
          disabled={activeIndex === dzikrList.length - 1}
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
            // Remount on a period change so the slides match the new list.
            key={activePeriod}
            initialSlide={activeIndex}
            onSwiper={setSwiperInstance}
            onSlideChange={(swiper) => {
              setCurrentIndex(swiper.activeIndex);
              scrollContentToTop();
            }}
          >
            {dzikrList.map((dzikr, index) => (
              <SwiperSlide key={dzikr.id}>
                <DzikrCard
                  dzikr={dzikr}
                  isPulsing={pulsingDzikrId === dzikr.id}
                  onTap={index === activeIndex ? handleIncrement : undefined}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div style={{ padding: '18px 0 24px' }}>
            <DzikrCard dzikr={dzikrList[0]} />
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
