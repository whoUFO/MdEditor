import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  previewVisible: boolean;
  splitRatio: number;
  sidebarVisible: boolean;
  theme: 'light' | 'dark';
  
  togglePreview: () => void;
  setPreviewVisible: (visible: boolean) => void;
  setSplitRatio: (ratio: number) => void;
  toggleSidebar: () => void;
  setSidebarVisible: (visible: boolean) => void;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      previewVisible: true,
      splitRatio: 50,
      sidebarVisible: true,
      theme: 'light',

      togglePreview: () => {
        set({ previewVisible: !get().previewVisible });
      },

      setPreviewVisible: (visible) => {
        set({ previewVisible: visible });
      },

      setSplitRatio: (ratio) => {
        set({ splitRatio: Math.max(20, Math.min(80, ratio)) });
      },

      toggleSidebar: () => {
        set({ sidebarVisible: !get().sidebarVisible });
      },

      setSidebarVisible: (visible) => {
        set({ sidebarVisible: visible });
      },

      toggleTheme: () => {
        const newTheme: 'light' | 'dark' = get().theme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme });
        document.documentElement.setAttribute('data-theme', newTheme);
      },

      setTheme: (theme) => {
        set({ theme });
        document.documentElement.setAttribute('data-theme', theme);
      },
    }),
    {
      name: 'ui-storage',
    }
  )
);
