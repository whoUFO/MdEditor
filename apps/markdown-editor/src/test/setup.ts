import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

afterEach(() => {
  cleanup();
});

// Mock electron API
window.electronAPI = {
  files: {
    open: async () => null,
    openPath: async () => null,
    save: async () => true,
    saveAs: async () => null,
    readDirectory: async () => [],
  },
  window: {
    minimize: () => {},
    maximize: () => {},
    close: () => {},
    isMaximized: async () => false,
  },
  app: {
    getVersion: () => Promise.resolve('0.1.0'),
    getPlatform: () => Promise.resolve('test'),
  },
  printToPDF: async () => {},
};
