'use client';

import React, { useState } from 'react';
import { useDzikrStore } from '@/store/dzikrStore';
import type { DzikrItem } from '@/data/dzikrData';

interface DzikrCardProps {
  dzikr: DzikrItem;
  isPulsing?: boolean;
  onTap?: () => void;
}

const DzikrCard: React.FC<DzikrCardProps> = ({ dzikr, isPulsing = false, onTap }) => {
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
  const markerCount = Math.min(dzikr.count, 10);
  const filledMarkers = dzikr.count <= 10
    ? progress
    : Math.ceil((progress / dzikr.count) * markerCount);

  const handleCardTap = (event: React.MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    if (!onTap || target.closest('button, a, input, label') || window.getSelection()?.toString()) return;
    onTap();
  };

  return (
    <article
      className={`dzikr-card ${onTap ? 'is-tappable' : ''} ${isPulsing ? 'is-breathing' : ''}`}
      onClick={handleCardTap}
    >
      <div className="card-head">
        <span className="card-eyebrow">{categoryPrefix}</span>
        <div className="card-title-row">
          <h1>{categoryTitle}</h1>
          <span className="counter-badge" aria-label={`${progress} dari ${dzikr.count} bacaan`}>
            {progress} <span>/</span> {dzikr.count}
          </span>
        </div>

        <div className="count-markers" aria-label={`Progres ${Math.round(percentage)} persen`}>
          {Array.from({ length: markerCount }, (_, index) => (
            <span
              className={`count-marker ${index < filledMarkers ? 'is-filled' : ''}`}
              key={index}
            />
          ))}
        </div>
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
