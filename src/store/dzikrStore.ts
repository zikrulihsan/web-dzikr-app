import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DzikrItem, dzikrData } from '@/data/dzikrData';
import { localDayKey } from '@/lib/day';

interface DzikrProgress {
  dzikrId: number;
  completed: number;
}

const freshProgress = (): DzikrProgress[] =>
  dzikrData.map(dzikr => ({ dzikrId: dzikr.id, completed: 0 }));

type Theme = 'dark' | 'light';
type CountingMethod = 'penanda' | 'counter';

interface AppSettings {
  theme: Theme;
  showTranslation: boolean;
  showLatin: boolean;
  showDescription: boolean;
  countingMethod: CountingMethod;
  hasSeenTooltip: boolean;
  /** Name shown on the leaderboard. Empty means "Hamba Allah". */
  displayName: string;
}

interface DzikrState {
  currentIndex: number;
  progress: DzikrProgress[];
  /** Local calendar day the stored progress belongs to. */
  lastActiveDay: string;
  settings: AppSettings;
  setCurrentIndex: (index: number) => void;
  ensureToday: () => void;
  incrementCount: (dzikrId: number) => void;
  decrementCount: (dzikrId: number) => void;
  resetCount: (dzikrId: number) => void;
  resetAllProgress: () => void;
  getProgress: (dzikrId: number) => number;
  getCompletionPercentage: (dzikrId: number) => number;
  toggleTheme: () => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
}

export const useDzikrStore = create<DzikrState>()(
  persist(
    (set, get) => ({
      currentIndex: 0,
      progress: freshProgress(),
      lastActiveDay: localDayKey(),
      settings: {
        theme: 'dark',
        showTranslation: true,
        showLatin: true,
        showDescription: true,
        countingMethod: 'penanda',
        hasSeenTooltip: false,
        displayName: ''
      },

      setCurrentIndex: (index: number) => set({ currentIndex: index }),

      /**
       * Clears progress when the calendar day has rolled over. Progress is
       * persisted to localStorage, so without this yesterday's counts would be
       * read as today's — and pushed straight to today's leaderboard row before
       * the user has read a single dzikr.
       */
      ensureToday: () => {
        const today = localDayKey();
        if (get().lastActiveDay === today) return;
        set({ progress: freshProgress(), currentIndex: 0, lastActiveDay: today });
      },

      toggleTheme: () => {
        const { settings } = get();
        set({ 
          settings: { 
            ...settings, 
            theme: settings.theme === 'dark' ? 'light' : 'dark' 
          } 
        });
      },
      
      updateSettings: (newSettings: Partial<AppSettings>) => {
        const { settings } = get();
        set({ settings: { ...settings, ...newSettings } });
      },
      
      resetAllProgress: () => {
        set({
          progress: freshProgress(),
          currentIndex: 0,
          lastActiveDay: localDayKey(),
        });
      },

      incrementCount: (dzikrId: number) => {
        // Catches a rollover that happens while the app is left open overnight.
        get().ensureToday();
        const { progress } = get();
        const dzikr = dzikrData.find(d => d.id === dzikrId);

        if (!dzikr) return;

        const updatedProgress = progress.map(p => {
          if (p.dzikrId === dzikrId) {
            // Don't exceed the required count
            const newCompleted = Math.min(p.completed + 1, dzikr.count);
            return { ...p, completed: newCompleted };
          }
          return p;
        });
        
        set({ progress: updatedProgress });
      },
      
      decrementCount: (dzikrId: number) => {
        const { progress } = get();
        const dzikr = dzikrData.find(d => d.id === dzikrId);
        
        if (!dzikr) return;
        
        const updatedProgress = progress.map(p => {
          if (p.dzikrId === dzikrId) {
            // Don't go below zero
            const newCompleted = Math.max(p.completed - 1, 0);
            return { ...p, completed: newCompleted };
          }
          return p;
        });
        
        set({ progress: updatedProgress });
      },
      
      resetCount: (dzikrId: number) => {
        const { progress } = get();
        const updatedProgress = progress.map(p => {
          if (p.dzikrId === dzikrId) {
            return { ...p, completed: 0 };
          }
          return p;
        });
        
        set({ progress: updatedProgress });
      },
      
      getProgress: (dzikrId: number) => {
        const { progress } = get();
        const progressItem = progress.find(p => p.dzikrId === dzikrId);
        return progressItem ? progressItem.completed : 0;
      },
      
      getCompletionPercentage: (dzikrId: number) => {
        const { progress } = get();
        const progressItem = progress.find(p => p.dzikrId === dzikrId);
        const dzikr = dzikrData.find(d => d.id === dzikrId);
        
        if (!progressItem || !dzikr) return 0;
        
        return (progressItem.completed / dzikr.count) * 100;
      }
    }),
    {
      name: 'dzikr-storage',
      // v2 introduced lastActiveDay. Stored progress from v1 carries no date, so
      // there is no way to tell which day it belongs to — start the day clean
      // rather than credit stale counts to today's leaderboard.
      version: 2,
      migrate: (persisted, version) => {
        const state = persisted as Partial<DzikrState> | undefined;
        if (version >= 2 || !state) return state as DzikrState;
        return {
          ...state,
          progress: freshProgress(),
          currentIndex: 0,
          lastActiveDay: localDayKey(),
          settings: { ...(state.settings as AppSettings), displayName: '' },
        } as DzikrState;
      },
    }
  )
);
