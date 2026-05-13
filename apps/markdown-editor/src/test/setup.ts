import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

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
    getVersion: async () => '0.1.0',
    getPlatform: async () => 'test',
  },
  printToPDF: async () => {},
};
