export interface FileTreeItem {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileTreeItem[];
}

export interface EditorState {
  content: string;
  cursorPosition: { line: number; column: number };
  selection: { from: number; to: number } | null;
  isDirty: boolean;
}

export interface FileState {
  path: string;
  name: string;
  content: string;
  encoding: string;
}

export interface UIState {
  previewVisible: boolean;
  splitRatio: number;
  sidebarVisible: boolean;
  theme: 'light' | 'dark';
}

export interface RecentFile {
  path: string;
  name: string;
  lastOpened: number;
}

export interface Settings {
  theme: 'light' | 'dark';
  fontSize: number;
  autoSave: boolean;
  autoSaveInterval: number;
  lineNumbers: boolean;
  wordWrap: boolean;
  spellCheck: boolean;
}

export type ConfirmResult = 'save' | 'discard' | 'cancel';

export interface ElectronAPI {
  files: {
    open: () => Promise<{ path: string; name: string; content: string; encoding: string } | null>;
    openPath: (path: string) => Promise<{ path: string; name: string; content: string; encoding: string } | null>;
    save: (path: string, content: string, encoding: string) => Promise<boolean>;
    saveAs: (content: string, encoding: string) => Promise<string | null>;
    readDirectory: (path: string) => Promise<FileTreeItem[]>;
  };
  window: {
    minimize: () => void;
    maximize: () => void;
    close: () => void;
    isMaximized: () => Promise<boolean>;
    showConfirm: (message: string, detail?: string) => Promise<ConfirmResult>;
  };
  app: {
    getVersion: () => Promise<string>;
    getPlatform: () => Promise<string>;
  };
  printToPDF: () => Promise<void>;
  exportToPDF: (html: string, fileName: string) => Promise<void>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}