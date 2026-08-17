'use client';

import React, { useState } from 'react';
import { useDzikrStore } from '@/store/dzikrStore';
import type { DzikrItem } from '@/data/dzikrData';

interface DzikrCardProps {
  dzikr: DzikrItem;
}

const DzikrCard: React.FC<DzikrCardProps> = ({ dzikr }) => {
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

  return (
    <article className="dzikr-card">
      <div>
        <div className="card-meta">
          <span className="category-pill">{dzikr.category}</span>
          <span className="counter-badge">{isCompleted ? 'selesai ✦' : `${Math.round(percentage)}%`}</span>
        </div>

        <div className="card-progress" aria-label={`Progres ${Math.round(percentage)} persen`}>
          <div
            className={`card-progress-fill ${isCompleted ? 'is-complete' : ''}`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="card-counter">
          <span>Dibaca {progress}×</span>
          <span>Target {dzikr.count}×</span>
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
