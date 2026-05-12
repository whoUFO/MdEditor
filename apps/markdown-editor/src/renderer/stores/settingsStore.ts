import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Settings } from '@shared/types';

interface SettingsStore extends Settings {
  updateSettings: (settings: Partial<Settings>) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      theme: 'light',
      fontSize: 14,
      autoSave: false,
      autoSaveInterval: 30,
      lineNumbers: true,
      wordWrap: true,
      spellCheck: false,

      updateSettings: (settings) => {
        set((prev) => ({ ...prev, ...settings }));
      },
    }),
    {
      name: 'settings-storage',
    }
  )
);
