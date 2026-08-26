import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DzikrPeriod, getDzikrCount } from '@/data/dzikrData';

export type ThemePreference = 'dark' | 'light' | 'auto';
export type PeriodPreference = DzikrPeriod | 'auto';
type CountingMethod = 'penanda' | 'counter';
export type FontSizePreference = 'small' | 'medium' | 'large';

/** Reps completed, keyed by dzikr id. Pagi and petang are counted separately
 *  so finishing the morning round doesn't pre-fill the evening one. */
export type PeriodProgress = Record<number, number>;
export type ProgressState = Record<DzikrPeriod, PeriodProgress>;

const PERIODS: DzikrPeriod[] = ['pagi', 'petang'];

/**
 * Accepts either shape of stored progress: the flat list written before dzikr
 * petang existed, or the per-id record used since. Storage written by the
 * previous version carries no `version` field, which makes zustand skip
 * `migrate` entirely, so this has to run on the merge path too.
 */
const normalizeProgress = (value: unknown): PeriodProgress => {
  if (Array.isArray(value)) {
    const normalized: PeriodProgress = {};
    value.forEach((entry) => {
      const item = entry as { dzikrId?: number; completed?: number };
      if (typeof item?.dzikrId === 'number') normalized[item.dzikrId] = item.completed ?? 0;
    });
    return normalized;
  }
  return value && typeof value === 'object' ? (value as PeriodProgress) : {};
};

/** Reps done across both parts of the day — what the leaderboard counts. */
export const totalCompleted = (progress: ProgressState): number =>
  PERIODS.reduce(
    (sum, period) =>
      sum + Object.values(progress?.[period] ?? {}).reduce((inner, value) => inner + value, 0),
    0,
  );

interface AppSettings {
  theme: ThemePreference;
  periodPreference: PeriodPreference;
  showTranslation: boolean;
  showLatin: boolean;
  showDescription: boolean;
  countingMethod: CountingMethod;
  arabicFontSize: FontSizePreference;
  latinFontSize: FontSizePreference;
  translationFontSize: FontSizePreference;
  showActionHint: boolean;
  focusMode: boolean;
}

interface DzikrState {
  currentIndex: number;
  progress: ProgressState;
  /** Part of the day derived from the device clock; refreshed by usePeriodWatcher. */
  detectedPeriod: DzikrPeriod;
  settings: AppSettings;
  setCurrentIndex: (index: number) => void;
  setDetectedPeriod: (period: DzikrPeriod) => void;
  getActivePeriod: () => DzikrPeriod;
  incrementCount: (dzikrId: number) => void;
  decrementCount: (dzikrId: number) => void;
  resetCount: (dzikrId: number) => void;
  resetAllProgress: () => void;
  getProgress: (dzikrId: number) => number;
  getCompletionPercentage: (dzikrId: number) => number;
  toggleTheme: () => void;
  toggleFocusMode: () => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
}

const THEME_CYCLE: ThemePreference[] = ['light', 'dark', 'auto'];

const defaultSettings: AppSettings = {
  theme: 'auto',
  periodPreference: 'auto',
  showTranslation: true,
  showLatin: true,
  showDescription: true,
  countingMethod: 'counter',
  arabicFontSize: 'medium',
  latinFontSize: 'medium',
  translationFontSize: 'medium',
  showActionHint: true,
  focusMode: false,
};

export const useDzikrStore = create<DzikrState>()(
  persist(
    (set, get) => ({
      currentIndex: 0,
      progress: { pagi: {}, petang: {} },
      // A fixed default keeps the server render and the first client render in
      // step; usePeriodWatcher corrects it as soon as the app mounts.
      detectedPeriod: 'pagi',
      settings: defaultSettings,

      setCurrentIndex: (index: number) => set({ currentIndex: index }),

      setDetectedPeriod: (period: DzikrPeriod) => {
        if (get().detectedPeriod !== period) set({ detectedPeriod: period });
      },

      getActivePeriod: () => {
        const { settings, detectedPeriod } = get();
        const preference = settings.periodPreference ?? 'auto';
        return preference === 'auto' ? detectedPeriod : preference;
      },

      toggleTheme: () => {
        const { settings } = get();
        const next = THEME_CYCLE[(THEME_CYCLE.indexOf(settings.theme) + 1) % THEME_CYCLE.length];
        set({ settings: { ...settings, theme: next } });
      },

      toggleFocusMode: () => {
        const { settings } = get();
        set({ settings: { ...settings, focusMode: !settings.focusMode } });
      },

      updateSettings: (newSettings: Partial<AppSettings>) => {
        const { settings } = get();
        set({ settings: { ...settings, ...newSettings } });
      },

      resetAllProgress: () => {
        const { progress, getActivePeriod } = get();
        set({
          progress: { ...progress, [getActivePeriod()]: {} },
          currentIndex: 0,
        });
      },

      incrementCount: (dzikrId: number) => {
        const { progress, getActivePeriod } = get();
        const target = getDzikrCount(dzikrId);

        if (target === undefined) return;

        const period = getActivePeriod();
        const completed = progress[period][dzikrId] ?? 0;
        // Don't exceed the required count
        set({
          progress: {
            ...progress,
            [period]: { ...progress[period], [dzikrId]: Math.min(completed + 1, target) },
          },
        });
      },

      decrementCount: (dzikrId: number) => {
        const { progress, getActivePeriod } = get();
        const period = getActivePeriod();
        const completed = progress[period][dzikrId] ?? 0;
        // Don't go below zero
        set({
          progress: {
            ...progress,
            [period]: { ...progress[period], [dzikrId]: Math.max(completed - 1, 0) },
          },
        });
      },

      resetCount: (dzikrId: number) => {
        const { progress, getActivePeriod } = get();
        const period = getActivePeriod();
        set({
          progress: { ...progress, [period]: { ...progress[period], [dzikrId]: 0 } },
        });
      },

      getProgress: (dzikrId: number) => {
        const { progress, getActivePeriod } = get();
        return progress[getActivePeriod()][dzikrId] ?? 0;
      },

      getCompletionPercentage: (dzikrId: number) => {
        const target = getDzikrCount(dzikrId);
        if (!target) return 0;
        return (get().getProgress(dzikrId) / target) * 100;
      },
    }),
    {
      name: 'dzikr-storage',
      version: 2,
      partialize: (state) => ({
        currentIndex: state.currentIndex,
        progress: state.progress,
        settings: state.settings,
      }),
      // Shallow-merge by default would drop any setting added after the reader
      // last saved, so fold the persisted values onto the defaults instead.
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as Partial<DzikrState>;
        // A v1 list is all dzikir pagi: petang had no counters of its own.
        const savedProgress = saved.progress as unknown;
        const legacy = Array.isArray(savedProgress) ? savedProgress : null;

        return {
          ...current,
          ...saved,
          settings: { ...current.settings, ...(saved.settings ?? {}) },
          progress: {
            pagi: normalizeProgress(legacy ?? saved.progress?.pagi),
            petang: legacy ? {} : normalizeProgress(saved.progress?.petang),
          },
        };
      },
    },
  ),
);
