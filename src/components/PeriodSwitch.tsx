'use client';

import React from 'react';
import type { DzikrPeriod } from '@/data/dzikrData';
import { periodShortLabel } from '@/lib/dzikrPeriod';
import { useDzikrStore } from '@/store/dzikrStore';

interface PeriodSwitchProps {
  activePeriod: DzikrPeriod;
}

const PERIODS: DzikrPeriod[] = ['pagi', 'petang'];

/**
 * Quick switch between the two reading lists. Picking one pins it; "Otomatis"
 * hands the choice back to the device clock.
 */
const PeriodSwitch: React.FC<PeriodSwitchProps> = ({ activePeriod }) => {
  const preference = useDzikrStore((state) => state.settings.periodPreference ?? 'auto');
  const updateSettings = useDzikrStore((state) => state.updateSettings);
  const isAuto = preference === 'auto';

  return (
    <div className="period-switch" role="group" aria-label="Waktu dzikr">
      {PERIODS.map((period) => (
        <button
          className={activePeriod === period ? 'is-active' : ''}
          key={period}
          type="button"
          aria-pressed={activePeriod === period}
          onClick={() => updateSettings({ periodPreference: period })}
        >
          {periodShortLabel[period]}
        </button>
      ))}

      <button
        className={`period-auto ${isAuto ? 'is-active' : ''}`}
        type="button"
        aria-pressed={isAuto}
        title={isAuto ? 'Mengikuti jam di perangkat' : 'Ikuti kembali jam di perangkat'}
        onClick={() => updateSettings({ periodPreference: 'auto' })}
      >
        Otomatis
      </button>
    </div>
  );
};

export default PeriodSwitch;
