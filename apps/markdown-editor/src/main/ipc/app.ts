import { ipcMain, app, BrowserWindow, dialog } from 'electron';
import fs from 'fs/promises';

export function registerAppIPC(): void {
  ipcMain.handle('app:getVersion', () => {
    return app.getVersion();
  });

  ipcMain.handle('app:getPlatform', () => {
    return process.platform;
  });

  ipcMain.handle('print:pdf', async () => {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (!focusedWindow) return;
    
    const { canceled, filePath } = await dialog.showSaveDialog(focusedWindow, {
      defaultPath: 'document.pdf',
      filters: [
        { name: 'PDF Files', extensions: ['pdf'] },
      ],
    });
    
    if (canceled || !filePath) return;
    
    const pdfBuffer = await focusedWindow.webContents.printToPDF({
      printBackground: true,
      pageSize: 'A4',
    });
    
    await fs.writeFile(filePath, pdfBuffer);
  });
}
