import { ipcMain, dialog, BrowserWindow } from 'electron';
import fs from 'fs/promises';
import path from 'path';
import jschardet from 'jschardet';
import iconv from 'iconv-lite';

async function detectEncoding(buffer: Buffer): Promise<string> {
  const result = jschardet.detect(buffer);
  return result.encoding || 'utf-8';
}

export function registerFileIPC(): void {
  ipcMain.handle('files:open', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'Markdown', extensions: ['md', 'markdown', 'txt'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    });

    if (canceled || filePaths.length === 0) {
      return null;
    }

    const filePath = filePaths[0];
    const buffer = await fs.readFile(filePath);
    const encoding = await detectEncoding(buffer);
    const content = iconv.decode(buffer, encoding);

    return {
      path: filePath,
      name: path.basename(filePath),
      content,
      encoding,
    };
  });

  ipcMain.handle('files:openPath', async (_, filePath: string) => {
    try {
      const buffer = await fs.readFile(filePath);
      const encoding = await detectEncoding(buffer);
      const content = iconv.decode(buffer, encoding);

      return {
        path: filePath,
        name: path.basename(filePath),
        content,
        encoding,
      };
    } catch (error) {
      console.error('Open file failed:', error);
      return null;
    }
  });

  ipcMain.handle('files:save', async (_, filePath: string, content: string, encoding: string) => {
    try {
      const buffer = iconv.encode(content, encoding);
      await fs.writeFile(filePath, buffer);
      return true;
    } catch (error) {
      console.error('Save failed:', error);
      return false;
    }
  });

  ipcMain.handle('files:saveAs', async (_, content: string, encoding: string) => {
    const { canceled, filePath } = await dialog.showSaveDialog({
      defaultPath: 'document.md',
      filters: [
        { name: 'Markdown', extensions: ['md', 'markdown'] },
        { name: 'Text', extensions: ['txt'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    });

    if (canceled || !filePath) {
      return null;
    }

    try {
      const buffer = iconv.encode(content, encoding);
      await fs.writeFile(filePath, buffer);
      return filePath;
    } catch (error) {
      console.error('Save failed:', error);
      return null;
    }
  });

  ipcMain.handle('files:readDirectory', async (_, dirPath: string) => {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      return entries.map((entry) => ({
        name: entry.name,
        path: path.join(dirPath, entry.name),
        type: entry.isDirectory() ? 'directory' : 'file',
      }));
    } catch (error) {
      console.error('Read directory failed:', error);
      return [];
    }
  });
}
