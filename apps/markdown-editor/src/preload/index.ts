import { contextBridge, ipcRenderer } from 'electron';
import type { ElectronAPI, FileTreeItem } from '@shared/types';

const electronAPI: ElectronAPI = {
  files: {
    open: () => ipcRenderer.invoke('files:open'),
    save: (path, content, encoding) => ipcRenderer.invoke('files:save', path, content, encoding),
    saveAs: (content, encoding) => ipcRenderer.invoke('files:saveAs', content, encoding),
    readDirectory: (path) => ipcRenderer.invoke('files:readDirectory', path),
  },
  window: {
    minimize: () => ipcRenderer.invoke('window:minimize'),
    maximize: () => ipcRenderer.invoke('window:maximize'),
    close: () => ipcRenderer.invoke('window:close'),
    isMaximized: () => ipcRenderer.invoke('window:isMaximized'),
  },
  app: {
    getVersion: () => ipcRenderer.invoke('app:getVersion'),
    getPlatform: () => ipcRenderer.invoke('app:getPlatform'),
  },
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);
