import { ipcMain, app, BrowserWindow, dialog } from 'electron';
import fs from 'fs/promises';
import path from 'path';

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

  ipcMain.handle('export:pdf', async (_event, htmlContent: string, fileName: string) => {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (!focusedWindow) return;
    
    const { canceled, filePath } = await dialog.showSaveDialog(focusedWindow, {
      defaultPath: `${fileName.replace(/\.md$/, '') || 'document'}.pdf`,
      filters: [
        { name: 'PDF Files', extensions: ['pdf'] },
      ],
    });
    
    if (canceled || !filePath) return;
    
    const tempDir = app.getPath('temp');
    const tempHtmlPath = path.join(tempDir, `markdown-preview-${Date.now()}.html`);
    
    try {
      await fs.writeFile(tempHtmlPath, htmlContent, 'utf-8');
      
      const pdfBuffer = await focusedWindow.webContents.printToPDF({
        printBackground: true,
        pageSize: 'A4',
        url: `file://${tempHtmlPath}`,
      });
      
      await fs.writeFile(filePath, pdfBuffer);
    } finally {
      try {
        await fs.unlink(tempHtmlPath);
      } catch {
        // Ignore cleanup errors
      }
    }
  });
}