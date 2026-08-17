'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import '@/styles/swiper-custom.css';
import { dzikrData } from '@/data/dzikrData';
import { useDzikrStore } from '@/store/dzikrStore';
import { useScoreSync } from '@/lib/useScoreSync';
import DzikrCard from './DzikrCard';
import PresencePill from './PresencePill';
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
  } = useDzikrStore();
  const [isClient, setIsClient] = useState(false);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const contentContainerRef = useRef<HTMLDivElement>(null);

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
    return () => window.removeEventListener('keydown', handleKeyDown);
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

    if (settings.countingMethod === 'penanda') {
      for (let count = currentProgress; count < currentDzikr.count; count += 1) {
        incrementCount(currentDzikr.id);
      }
      moveNext(300);
      return;
    }

    incrementCount(currentDzikr.id);
    if (currentProgress + 1 >= currentDzikr.count) moveNext(500);
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

      <PresencePill />

      <div className="slider-content" ref={contentContainerRef}>
        {isClient ? (
          <Swiper
            effect="coverflow"
            grabCursor
            centeredSlides
            slidesPerView="auto"
            coverflowEffect={{ rotate: 0, stretch: 0, depth: 80, modifier: 1, slideShadows: false }}
            modules={[EffectCoverflow]}
            initialSlide={currentIndex}
            onSwiper={setSwiperInstance}
            onSlideChange={(swiper) => {
              setCurrentIndex(swiper.activeIndex);
              scrollContentToTop();
            }}
          >
            {dzikrData.map((dzikr) => (
              <SwiperSlide key={dzikr.id}>
                <DzikrCard dzikr={dzikr} />
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
        <div className="action-dock">
          {currentDzikr.note && <p className="action-note">{currentDzikr.note}</p>}
          <div className="action-group">
            <button
              className={`action-small ${currentProgress === 0 ? 'is-hidden' : ''}`}
              type="button"
              onClick={() => decrementCount(currentDzikr.id)}
              aria-label="Kurangi hitungan"
              tabIndex={currentProgress === 0 ? -1 : 0}
            >
              −
            </button>

            <button
              className={`action-main ${isCompleted ? 'is-complete' : ''}`}
              type="button"
              onClick={handleIncrement}
              aria-label={isCompleted ? 'Lanjut ke dzikr berikutnya' : settings.countingMethod === 'penanda' ? 'Tandai selesai' : 'Tambah hitungan'}
            >
              {isCompleted ? (
                <Icon icon="fa-solid fa-arrow-right" size={20} />
              ) : settings.countingMethod === 'penanda' ? (
                <Icon icon="fa-solid fa-check" size={20} />
              ) : (
                '+'
              )}
            </button>

            <button
              className={`action-small ${currentProgress === 0 ? 'is-hidden' : ''}`}
              type="button"
              onClick={() => resetCount(currentDzikr.id)}
              aria-label="Atur ulang dzikr ini"
              tabIndex={currentProgress === 0 ? -1 : 0}
            >
              <Icon icon="fa-solid fa-rotate-left" size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DzikrSlider;
