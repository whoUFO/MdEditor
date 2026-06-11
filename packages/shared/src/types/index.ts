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

export interface PageMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface FontSettings {
  titleFont: string;
  titleSize: number;
  bodyFont: string;
  bodySize: number;
  lineHeight: 'single' | '1.5x' | 'double' | 'custom';
  customLineHeight: number;
}

export interface PageNumberSettings {
  enabled: boolean;
  position: 'bottom-right' | 'bottom-center' | 'bottom-left' | 'top-right' | 'top-center' | 'top-left';
  format: 'page' | 'page/total' | 'page of total';
  fontSize: number;
  fontColor: string;
}

export interface ExportPageSettings {
  paperSize: 'A4' | 'Letter' | 'Legal' | 'A3' | 'A5' | 'custom';
  customWidth: number;
  customHeight: number;
  margins: PageMargins;
  marginUnit: 'mm' | 'cm' | 'inch';
  fonts: FontSettings;
  pageNumbers: PageNumberSettings;
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
  exportToPDF: (html: string, fileName: string, pageSettings?: ExportPageSettings) => Promise<void>;
  onFileOpened: (callback: (event: unknown, data: { path: string; name: string; content: string; encoding: string }) => void) => void;
  onMenuSave: (callback: () => void) => void;
  onMenuSaveAs: (callback: () => void) => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}