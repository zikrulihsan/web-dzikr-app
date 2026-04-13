import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DzikrItem, fetchDzikrData } from '@/data/dzikrData';

interface DzikrProgress {
  dzikrId: number;
  completed: number;
}

type Theme = 'dark' | 'light';
type CountingMethod = 'penanda' | 'counter';

interface AppSettings {
  theme: Theme;
  showTranslation: boolean;
  showLatin: boolean;
  showDescription: boolean;
  countingMethod: CountingMethod;
  hasSeenTooltip: boolean;
}

interface DzikrState {
  dzikrData: DzikrItem[];
  isLoading: boolean;
  error: string | null;
  currentIndex: number;
  progress: DzikrProgress[];
  settings: AppSettings;
  fetchDzikr: () => Promise<void>;
  setCurrentIndex: (index: number) => void;
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
      dzikrData: [],
      isLoading: false,
      error: null,
      currentIndex: 0,
      progress: [],
      settings: {
        theme: 'dark',
        showTranslation: true,
        showLatin: true,
        showDescription: true,
        countingMethod: 'penanda',
        hasSeenTooltip: false
      },

      fetchDzikr: async () => {
        set({ isLoading: true, error: null });
        try {
          const data = await fetchDzikrData();
          const { progress } = get();
          // Preserve existing progress, add new entries for new items
          const existingIds = new Set(progress.map(p => p.dzikrId));
          const newProgress = [
            ...progress.filter(p => data.some(d => d.id === p.dzikrId)),
            ...data
              .filter(d => !existingIds.has(d.id))
              .map(d => ({ dzikrId: d.id, completed: 0 }))
          ];
          set({ dzikrData: data, progress: newProgress, isLoading: false });
        } catch (err) {
          set({ error: (err as Error).message, isLoading: false });
        }
      },

      setCurrentIndex: (index: number) => set({ currentIndex: index }),

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
        const { dzikrData } = get();
        set({ progress: dzikrData.map(dzikr => ({ dzikrId: dzikr.id, completed: 0 })) });
      },

      incrementCount: (dzikrId: number) => {
        const { progress, dzikrData } = get();
        const dzikr = dzikrData.find(d => d.id === dzikrId);

        if (!dzikr) return;

        const updatedProgress = progress.map(p => {
          if (p.dzikrId === dzikrId) {
            const newCompleted = Math.min(p.completed + 1, dzikr.count);
            return { ...p, completed: newCompleted };
          }
          return p;
        });

        set({ progress: updatedProgress });
      },

      decrementCount: (dzikrId: number) => {
        const { progress, dzikrData } = get();
        const dzikr = dzikrData.find(d => d.id === dzikrId);

        if (!dzikr) return;

        const updatedProgress = progress.map(p => {
          if (p.dzikrId === dzikrId) {
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
        const { progress, dzikrData } = get();
        const progressItem = progress.find(p => p.dzikrId === dzikrId);
        const dzikr = dzikrData.find(d => d.id === dzikrId);

        if (!progressItem || !dzikr) return 0;

        return (progressItem.completed / dzikr.count) * 100;
      }
    }),
    {
      name: 'dzikr-storage',
      partialize: (state) => ({
        currentIndex: state.currentIndex,
        progress: state.progress,
        settings: state.settings,
      }),
    }
  )
);
