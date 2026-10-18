'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
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

// A tap presses the card in (CSS :active) and flashes it. A tap that finishes
// the dzikr then swaps straight to the next card, with no slide, once the
// flash is over. Swipes keep the normal slide.
const FLASH_MS = 420;

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
  const [flashingDzikrId, setFlashingDzikrId] = useState<number | null>(null);
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const flashTimerRef = useRef<number | null>(null);
  // Set for the next slide change only: swap instead of sliding.
  const jumpNextSlideRef = useRef(false);
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
      if (flashTimerRef.current) window.clearTimeout(flashTimerRef.current);
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

  // Layout effect so a swap lands before paint, together with its flash.
  useLayoutEffect(() => {
    if (swiperInstance && swiperInstance.activeIndex !== activeIndex) {
      swiperInstance.slideTo(activeIndex, jumpNextSlideRef.current ? 0 : undefined);
      scrollContentToTop();
    }
    jumpNextSlideRef.current = false;
  }, [activeIndex, swiperInstance]);

  const currentDzikr = dzikrList[activeIndex];
  const currentProgress = getProgress(currentDzikr.id);
  const isCompleted = currentProgress >= currentDzikr.count;
  // Between a finishing tap and the swap the controls keep their fresh look,
  // so the button does not flash the "next" arrow for a moment.
  const isSwapping =
    isCompleted && flashingDzikrId === currentDzikr.id && activeIndex < dzikrList.length - 1;
  const showCompleted = isCompleted && !isSwapping;

  const moveNext = () => {
    if (activeIndex < dzikrList.length - 1) {
      setCurrentIndex(activeIndex + 1);
      scrollContentToTop();
    }
  };

  const flash = (dzikrId: number) => {
    if (flashTimerRef.current) window.clearTimeout(flashTimerRef.current);
    setFlashingDzikrId(dzikrId);
    flashTimerRef.current = window.setTimeout(() => setFlashingDzikrId(null), FLASH_MS);
  };

  // Flash the tapped card, then swap to the next one without a slide.
  const swapToNext = () => {
    const hasNext = activeIndex < dzikrList.length - 1;
    if (flashTimerRef.current) window.clearTimeout(flashTimerRef.current);
    setFlashingDzikrId(currentDzikr.id);
    flashTimerRef.current = window.setTimeout(() => {
      setFlashingDzikrId(null);
      if (!hasNext) return;
      jumpNextSlideRef.current = true;
      moveNext();
    }, FLASH_MS);
  };

  const handleIncrement = () => {
    // A tap during the flash before a swap would land on a finished card.
    if (isSwapping) return;
    if (isCompleted) {
      swapToNext();
      return;
    }

    if ('vibrate' in navigator) navigator.vibrate(10);

    const finishes =
      settings.countingMethod === 'penanda' || currentProgress + 1 >= currentDzikr.count;

    if (settings.countingMethod === 'penanda') {
      for (let count = currentProgress; count < currentDzikr.count; count += 1) {
        incrementCount(currentDzikr.id);
      }
    } else {
      incrementCount(currentDzikr.id);
    }

    if (finishes) swapToNext();
    else flash(currentDzikr.id);
  };

  return (
    <div className="slider-shell">
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
                  isFlashing={flashingDzikrId === dzikr.id}
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
                {showCompleted
                  ? 'Lanjut dzikr berikutnya'
                  : settings.countingMethod === 'counter'
                    ? 'Tap + untuk 1 bacaan'
                    : 'Sudah dibaca? Tap sekali untuk tandai selesai'}
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
          <div className={`action-corrections ${(currentProgress === 0 || isSwapping) ? 'is-hidden' : ''}`}>
            <button
              className="action-small"
              type="button"
              onClick={() => decrementCount(currentDzikr.id)}
              aria-label="Kurangi hitungan"
              tabIndex={(currentProgress === 0 || isSwapping) ? -1 : 0}
            >
              −
            </button>

            <button
              className="action-small"
              type="button"
              onClick={() => resetCount(currentDzikr.id)}
              aria-label="Atur ulang dzikr ini"
              tabIndex={(currentProgress === 0 || isSwapping) ? -1 : 0}
            >
              <Icon icon="fa-solid fa-rotate-left" size={13} />
            </button>
          </div>

          <button
            className={`action-main ${showCompleted ? 'is-complete' : ''}`}
            type="button"
            onClick={handleIncrement}
            aria-label={showCompleted ? 'Lanjut ke dzikr berikutnya' : settings.countingMethod === 'penanda' ? 'Tandai selesai' : 'Tambah hitungan'}
          >
            {showCompleted ? (
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
