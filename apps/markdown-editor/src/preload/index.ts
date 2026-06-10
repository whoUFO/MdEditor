import { contextBridge, ipcRenderer } from 'electron';
import type { ElectronAPI } from '@shared/types';

const electronAPI: ElectronAPI = {
  files: {
    open: () => ipcRenderer.invoke('files:open'),
    openPath: (path: string) => ipcRenderer.invoke('files:openPath', path),
    save: (path, content, encoding) => ipcRenderer.invoke('files:save', path, content, encoding),
    saveAs: (content, encoding) => ipcRenderer.invoke('files:saveAs', content, encoding),
    readDirectory: (path) => ipcRenderer.invoke('files:readDirectory', path),
  },
  window: {
    minimize: () => ipcRenderer.invoke('window:minimize'),
    maximize: () => ipcRenderer.invoke('window:maximize'),
    close: () => ipcRenderer.invoke('window:close'),
    isMaximized: () => ipcRenderer.invoke('window:isMaximized'),
    showConfirm: (message: string, detail?: string) => ipcRenderer.invoke('window:showConfirm', message, detail),
  },
  app: {
    getVersion: () => ipcRenderer.invoke('app:getVersion'),
    getPlatform: () => ipcRenderer.invoke('app:getPlatform'),
  },
  printToPDF: () => ipcRenderer.invoke('print:pdf'),
  exportToPDF: (html: string, fileName: string) => ipcRenderer.invoke('export:pdf', html, fileName),
  onFileOpened: (callback: (event: unknown, data: { path: string; name: string; content: string; encoding: string }) => void) => {
    ipcRenderer.on('file:opened', callback);
  },
  onMenuSave: (callback: () => void) => {
    ipcRenderer.on('menu:save', callback);
  },
  onMenuSaveAs: (callback: () => void) => {
    ipcRenderer.on('menu:saveAs', callback);
  },
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);