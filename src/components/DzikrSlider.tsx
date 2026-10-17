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

// Length of the tap pulse on a tap that does not finish the dzikr.
const TAP_FEEDBACK_MS = 260;
// A finished card is pressed in, so it keeps going in: it sinks away, then the
// next card rises up in its place. Swipes still slide sideways.
const SINK_MS = 150;
const RISE_MS = 300;

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
  const [sinkingDzikrId, setSinkingDzikrId] = useState<number | null>(null);
  const [risingDzikrId, setRisingDzikrId] = useState<number | null>(null);
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const pulseTimerRef = useRef<number | null>(null);
  const advanceTimerRef = useRef<number | null>(null);
  // Set while a card sinks, so taps land on nothing until the next one is up.
  const isAdvancingRef = useRef(false);
  // The next slideTo should jump instead of sliding (the depth effect covers it).
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
      if (pulseTimerRef.current) window.clearTimeout(pulseTimerRef.current);
      if (advanceTimerRef.current) window.clearTimeout(advanceTimerRef.current);
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

  // Layout effect: a jump must land before paint, or the old card shows for a frame.
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
  // While a finished card sinks, the controls already show the next card's
  // fresh state, so they do not flash "done" for a moment.
  const isSinking = sinkingDzikrId === currentDzikr.id;
  const showCompleted = isCompleted && !isSinking;
  const hideCorrections = currentProgress === 0 || isSinking;

  const moveNext = () => {
    if (activeIndex < dzikrList.length - 1) {
      setCurrentIndex(activeIndex + 1);
      scrollContentToTop();
    }
  };

  const hasNext = activeIndex < dzikrList.length - 1;

  const sinkToNext = () => {
    const nextDzikr = dzikrList[activeIndex + 1];
    isAdvancingRef.current = true;
    setSinkingDzikrId(currentDzikr.id);
    advanceTimerRef.current = window.setTimeout(() => {
      jumpNextSlideRef.current = true;
      setRisingDzikrId(nextDzikr.id);
      moveNext();
      isAdvancingRef.current = false;
      // The sunk card stays invisible until it is off screen, then resets.
      advanceTimerRef.current = window.setTimeout(() => {
        setSinkingDzikrId(null);
        setRisingDzikrId(null);
      }, RISE_MS);
    }, SINK_MS);
  };

  const handleIncrement = () => {
    if (isAdvancingRef.current) return;
    if (isCompleted) {
      if (hasNext) sinkToNext();
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

    if (finishes && hasNext) {
      sinkToNext();
      return;
    }

    if (pulseTimerRef.current) window.clearTimeout(pulseTimerRef.current);
    setPulsingDzikrId(currentDzikr.id);
    pulseTimerRef.current = window.setTimeout(() => setPulsingDzikrId(null), TAP_FEEDBACK_MS);
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
            speed={340}
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
                  motion={
                    sinkingDzikrId === dzikr.id ? 'sinking' : risingDzikrId === dzikr.id ? 'rising' : undefined
                  }
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
          <div className={`action-corrections ${hideCorrections ? 'is-hidden' : ''}`}>
            <button
              className="action-small"
              type="button"
              onClick={() => decrementCount(currentDzikr.id)}
              aria-label="Kurangi hitungan"
              tabIndex={hideCorrections ? -1 : 0}
            >
              −
            </button>

            <button
              className="action-small"
              type="button"
              onClick={() => resetCount(currentDzikr.id)}
              aria-label="Atur ulang dzikr ini"
              tabIndex={hideCorrections ? -1 : 0}
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
