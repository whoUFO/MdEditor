import { ipcMain, dialog } from 'electron';
import { getMainWindow } from '../window';

export function registerWindowIPC(): void {
  ipcMain.handle('window:minimize', () => {
    getMainWindow()?.minimize();
  });

  ipcMain.handle('window:maximize', () => {
    const window = getMainWindow();
    if (window?.isMaximized()) {
      window.unmaximize();
    } else {
      window?.maximize();
    }
  });

  ipcMain.handle('window:close', () => {
    getMainWindow()?.close();
  });

  ipcMain.handle('window:isMaximized', () => {
    return getMainWindow()?.isMaximized() ?? false;
  });

  ipcMain.handle('window:showConfirm', async (_event, message: string, detail?: string) => {
    const window = getMainWindow();
    if (!window) return 'cancel';

    const result = await dialog.showMessageBox(window, {
      type: 'question',
      buttons: ['保存', '不保存', '取消'],
      defaultId: 0,
      cancelId: 2,
      title: '确认',
      message,
      detail,
    });

    switch (result.response) {
      case 0:
        return 'save';
      case 1:
        return 'discard';
      case 2:
      default:
        return 'cancel';
    }
  });
}