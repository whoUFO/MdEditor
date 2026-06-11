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

  const PAPER_SIZES: Record<string, { width: number; height: number }> = {
  A4: { width: 210, height: 297 },
  Letter: { width: 215.9, height: 279.4 },
  Legal: { width: 215.9, height: 355.6 },
  A3: { width: 297, height: 420 },
  A5: { width: 148, height: 210 },
};

function convertToInch(value: number, unit: string): number {
  switch (unit) {
    case 'mm':
      return value / 25.4;
    case 'cm':
      return value / 2.54;
    case 'inch':
      return value;
    default:
      return value / 25.4;
  }
}

function convertToMM(value: number, unit: string): number {
  switch (unit) {
    case 'cm':
      return value * 10;
    case 'inch':
      return value * 25.4;
    default:
      return value;
  }
}

ipcMain.handle('export:pdf', async (_event, htmlContent: string, fileName: string, pageSettings?: unknown) => {
    const mainWindow = BrowserWindow.getAllWindows().find(w => !w.isDestroyed());
    if (!mainWindow) return;
    
    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
      defaultPath: `${fileName?.replace(/\.md$/, '') || 'document'}.pdf`,
      filters: [
        { name: 'PDF Files', extensions: ['pdf'] },
      ],
    });
    
    if (canceled || !filePath) return;
    
    const settings = pageSettings as {
      paperSize?: string;
      customWidth?: number;
      customHeight?: number;
      margins?: { top: number; right: number; bottom: number; left: number };
      marginUnit?: string;
    } || {};
    
    let pageSize: 'A4' | 'Letter' | 'Legal' | 'A3' | 'A5' | { width: number; height: number } = 'A4';
    let margins: { top: number; bottom: number; left: number; right: number } | undefined;
    
    if (settings.paperSize) {
      if (settings.paperSize === 'custom' && settings.customWidth && settings.customHeight) {
        pageSize = { 
          width: settings.customWidth, 
          height: settings.customHeight 
        };
      } else if (PAPER_SIZES[settings.paperSize]) {
        pageSize = settings.paperSize as 'A4' | 'Letter' | 'Legal' | 'A3' | 'A5';
      }
    }
    
    if (settings.margins) {
      const unit = settings.marginUnit || 'mm';
      margins = {
        top: Math.max(0, Math.min(2, convertToInch(settings.margins.top, unit))),
        bottom: Math.max(0, Math.min(2, convertToInch(settings.margins.bottom, unit))),
        left: Math.max(0, Math.min(2, convertToInch(settings.margins.left, unit))),
        right: Math.max(0, Math.min(2, convertToInch(settings.margins.right, unit))),
      };
    }
    
    const printWindow = new BrowserWindow({
      width: 1200,
      height: 1600,
      show: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
      },
    });
    
    try {
      const url = `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`;
      await printWindow.loadURL(url);
      
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 500);
      });
      
      const pdfBuffer = await printWindow.webContents.printToPDF({
        printBackground: true,
        pageSize,
        margins,
      });
      
      await fs.writeFile(filePath, pdfBuffer);
    } catch (error) {
      throw error;
    } finally {
      printWindow.close();
    }
  });
}