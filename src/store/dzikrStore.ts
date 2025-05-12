import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DzikrItem, dzikrData } from '@/data/dzikrData';

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
}

interface DzikrState {
  currentIndex: number;
  progress: DzikrProgress[];
  settings: AppSettings;
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
      currentIndex: 0,
      progress: dzikrData.map(dzikr => ({ dzikrId: dzikr.id, completed: 0 })),
      settings: {
        theme: 'dark',
        showTranslation: true,
        showLatin: true,
        showDescription: true,
        countingMethod: 'penanda'
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
        set({ progress: dzikrData.map(dzikr => ({ dzikrId: dzikr.id, completed: 0 })) });
      },
      
      incrementCount: (dzikrId: number) => {
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
    }
  )
);
