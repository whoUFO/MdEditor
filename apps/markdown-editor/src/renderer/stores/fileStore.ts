import { create } from 'zustand';
import type { FileState, RecentFile } from '@shared/types';

interface FileStore {
  currentFile: FileState | null;
  fileTree: { name: string; path: string; type: 'file' | 'directory' }[];
  recentFiles: RecentFile[];
  isLoading: boolean;
  error: string | null;
  
  openFile: () => Promise<void>;
  saveFile: () => Promise<void>;
  saveAsFile: () => Promise<void>;
  setCurrentFile: (file: FileState | null) => void;
  loadDirectory: (path: string) => Promise<void>;
  addRecentFile: (file: Omit<RecentFile, 'lastOpened'>) => void;
  clearError: () => void;
}

export const useFileStore = create<FileStore>((set, get) => ({
  currentFile: null,
  fileTree: [],
  recentFiles: [],
  isLoading: false,
  error: null,

  openFile: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await window.electronAPI.files.open();
      if (result) {
        const file: FileState = {
          path: result.path,
          name: result.name,
          content: result.content,
          encoding: result.encoding,
        };
        set({ currentFile: file });
        get().addRecentFile({ path: result.path, name: result.name });
        useEditorStore.getState().setContent(result.content);
        useEditorStore.getState().markDirty(false);
      }
    } catch (error) {
      set({ error: 'Failed to open file' });
    } finally {
      set({ isLoading: false });
    }
  },

  saveFile: async () => {
    const { currentFile } = get();
    if (!currentFile) return;

    const content = useEditorStore.getState().content;
    const success = await window.electronAPI.files.save(
      currentFile.path,
      content,
      currentFile.encoding
    );

    if (success) {
      useEditorStore.getState().markDirty(false);
    }
  },

  saveAsFile: async () => {
    const content = useEditorStore.getState().content;
    const currentFile = get().currentFile;
    const encoding = currentFile?.encoding || 'utf-8';

    const result = await window.electronAPI.files.saveAs(content, encoding);
    if (result) {
      const newFile: FileState = {
        path: result,
        name: result.split('/').pop() || 'untitled.md',
        content,
        encoding,
      };
      set({ currentFile: newFile });
      get().addRecentFile({ path: result, name: newFile.name });
      useEditorStore.getState().markDirty(false);
    }
  },

  setCurrentFile: (file) => {
    set({ currentFile: file });
  },

  loadDirectory: async (path) => {
    set({ isLoading: true });
    try {
      const items = await window.electronAPI.files.readDirectory(path);
      set({ fileTree: items });
    } catch (error) {
      console.error('Failed to load directory:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addRecentFile: (file) => {
    const { recentFiles } = get();
    const existing = recentFiles.findIndex((f) => f.path === file.path);
    
    const newFiles: RecentFile[] = existing >= 0
      ? recentFiles.filter((_, i) => i !== existing)
      : recentFiles;
    
    newFiles.unshift({ ...file, lastOpened: Date.now() });
    
    set({ recentFiles: newFiles.slice(0, 10) });
  },

  clearError: () => {
    set({ error: null });
  },
}));

import { useEditorStore } from './editorStore';
