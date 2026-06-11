import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Settings, ExportPageSettings, PageMargins, FontSettings, PageNumberSettings } from '@shared/types';

const defaultMargins: PageMargins = {
  top: 15,
  right: 15,
  bottom: 15,
  left: 15,
};

const defaultFonts: FontSettings = {
  titleFont: 'Times New Roman',
  titleSize: 24,
  bodyFont: 'Times New Roman',
  bodySize: 16,
  lineHeight: '1.5x',
  customLineHeight: 1.5,
};

const defaultPageNumbers: PageNumberSettings = {
  enabled: true,
  position: 'bottom-right',
  format: 'page/total',
  fontSize: 12,
  fontColor: '#666666',
};

const defaultExportSettings: ExportPageSettings = {
  paperSize: 'A4',
  customWidth: 210,
  customHeight: 297,
  margins: defaultMargins,
  marginUnit: 'mm',
  fonts: defaultFonts,
  pageNumbers: defaultPageNumbers,
};

interface SettingsStore extends Settings {
  updateSettings: (settings: Partial<Settings>) => void;
  exportPageSettings: ExportPageSettings;
  setExportPageSettings: (settings: Partial<ExportPageSettings>) => void;
  resetExportPageSettings: () => void;
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
      exportPageSettings: defaultExportSettings,

      updateSettings: (settings) => {
        set((prev) => ({ ...prev, ...settings }));
      },

      setExportPageSettings: (settings) => {
        set((prev) => ({
          exportPageSettings: { ...prev.exportPageSettings, ...settings },
        }));
      },

      resetExportPageSettings: () => {
        set({ exportPageSettings: defaultExportSettings });
      },
    }),
    {
      name: 'settings-storage',
    }
  )
);
