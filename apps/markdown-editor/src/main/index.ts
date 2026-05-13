import { app } from 'electron';
import { createWindow, getMainWindow, setMainWindow } from './window';
import { setupMenu } from './menu';
import { setupCSP } from './csp';
import { registerAllIPC } from './ipc';

registerAllIPC();

app.whenReady().then(() => {
  setupCSP();
  createWindow().then(() => {
    setupMenu();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (getMainWindow() === null) {
    createWindow();
  }
});
