'use client';

import React, { useState } from 'react';
import { useDzikrStore } from '@/store/dzikrStore';
import type { DzikrItem } from '@/data/dzikrData';
import Icon from './Icon';

interface DzikrCardProps {
  dzikr: DzikrItem;
  /** Which half of the card was tapped: right reads on, left goes back. */
  onTap?: (side: 'left' | 'right') => void;
}

const DzikrCard: React.FC<DzikrCardProps> = ({ dzikr, onTap }) => {
  const [expanded, setExpanded] = useState(false);
  const { getProgress, getCompletionPercentage, settings } = useDzikrStore();

  const progress = getProgress(dzikr.id);
  const percentage = getCompletionPercentage(dzikr.id);
  const isCompleted = progress >= dzikr.count;
  const arabicDensity =
    dzikr.arabic.length > 240
      ? 'is-long'
      : dzikr.arabic.length > 110
        ? 'is-medium'
        : '';
  const categoryPrefix = dzikr.category.startsWith('Membaca Surah ')
    ? 'Membaca surah'
    : dzikr.category.startsWith('Membaca ')
      ? 'Membaca'
      : 'Dzikir harian';
  const categoryTitle = dzikr.category
    .replace(/^Membaca Surah /, '')
    .replace(/^Membaca /, '');
  // One tap marks the whole dzikr, so the card shows how many times to read
  // and a single done mark instead of a running 0/3.
  const isOneTap = settings.countingMethod === 'penanda';
  const markerCount = Math.min(dzikr.count, 10);
  const filledMarkers = dzikr.count <= 10
    ? progress
    : Math.ceil((progress / dzikr.count) * markerCount);
  const arabicFontSize = settings.arabicFontSize ?? 'medium';
  const latinFontSize = settings.latinFontSize ?? 'medium';
  const translationFontSize = settings.translationFontSize ?? 'medium';

  const handleCardTap = (event: React.MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    if (!onTap || target.closest('button, a, input, label') || window.getSelection()?.toString()) return;
    const rect = event.currentTarget.getBoundingClientRect();
    onTap(event.clientX < rect.left + rect.width / 2 ? 'left' : 'right');
  };

  return (
    <article
      className={`dzikr-card font-arabic-${arabicFontSize} font-latin-${latinFontSize} font-translation-${translationFontSize} ${onTap ? 'is-tappable' : ''}`}
      onClick={handleCardTap}
    >
      <div className="card-head">
        <span className="card-eyebrow">{categoryPrefix}</span>
        <div className="card-title-row">
          <h1>{categoryTitle}</h1>
          {isOneTap ? (
            <span
              className={`done-mark ${isCompleted ? 'is-done' : ''}`}
              aria-label={isCompleted ? 'Sudah dibaca' : 'Belum dibaca'}
            >
              {isCompleted && <Icon icon="fa-solid fa-check" size={11} />}
            </span>
          ) : (
            <span className="counter-badge" aria-label={`${progress} dari ${dzikr.count} bacaan`}>
              {progress} <span>/</span> {dzikr.count}
            </span>
          )}
        </div>

        {isOneTap ? (
          <span className="read-count">{dzikr.count}×</span>
        ) : (
          <div className="count-markers" aria-label={`Progres ${Math.round(percentage)} persen`}>
            {Array.from({ length: markerCount }, (_, index) => (
              <span
                className={`count-marker ${index < filledMarkers ? 'is-filled' : ''}`}
                key={index}
              />
            ))}
          </div>
        )}
      </div>

      <div className="dzikr-copy">
        <div
          className={`arabic dzikr-arabic ${arabicDensity}`}
          dir="rtl"
          lang="ar"
        >
          {dzikr.arabic}
        </div>

        {settings.showLatin && <div className="dzikr-latin">{dzikr.latin}</div>}

        {settings.showTranslation && (
          <p className="dzikr-translation">{dzikr.translation}</p>
        )}

        {dzikr.note && <p className="dzikr-note">{dzikr.note}</p>}
      </div>

      {settings.showDescription && (dzikr.description || dzikr.source) && (
        <button
          className="description-toggle"
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
        >
          <span className="description-toggle-head">
            <span>Keterangan & sumber</span>
            <span aria-hidden="true">{expanded ? '−' : '+'}</span>
          </span>
          {expanded && (
            <span className="description-body">
              {dzikr.description && <span>{dzikr.description}</span>}
              {dzikr.source && <span className="description-source">Sumber: {dzikr.source}</span>}
            </span>
          )}
        </button>
      )}
    </article>
  );
};

export default DzikrCard;
