import { ipcMain, dialog, BrowserWindow } from 'electron';
import fs from 'fs/promises';
import path from 'path';
import jschardet from 'jschardet';
import iconv from 'iconv-lite';
import { getMainWindow } from '../window';

const encodingMap: Record<string, string> = {
  'GB2312': 'gbk',
  'GBK': 'gbk',
  'GB18030': 'gbk',
  'Big5': 'big5',
  'Shift_JIS': 'shift_jis',
  'ISO-8859-1': 'latin1',
  'windows-1252': 'win1252',
  'UTF-8': 'utf-8',
  'ASCII': 'ascii',
  'UTF-16': 'utf16',
  'UTF-16BE': 'utf16-be',
  'UTF-16LE': 'utf16-le',
};

function normalizeEncoding(encoding: string): string {
  if (!encoding || typeof encoding !== 'string') return 'utf-8';
  const normalized = encoding.toUpperCase().trim();
  if (encodingMap[normalized]) return encodingMap[normalized];
  if (iconv.encodingExists(encoding)) return encoding;
  return 'utf-8';
}

async function detectEncoding(buffer: Buffer): Promise<string> {
  if (!buffer || buffer.length === 0) return 'utf-8';
  const result = jschardet.detect(buffer);
  if (!result || !result.encoding) return 'utf-8';
  const normalized = normalizeEncoding(result.encoding);
  if (normalized === 'ascii' && buffer.some(byte => byte > 127)) return 'utf-8';
  if (result.confidence && result.confidence < 0.5 && !buffer.some(byte => byte > 127)) return 'utf-8';
  return normalized;
}

export function registerFileIPC(): void {
  ipcMain.handle('files:open', async () => {
    const mainWindow = getMainWindow();
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow || undefined, {
      properties: ['openFile'],
      filters: [
        { name: 'Markdown', extensions: ['md', 'markdown', 'txt'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    });

    if (canceled || filePaths.length === 0) return null;

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
      return { path: filePath, name: path.basename(filePath), content, encoding };
    } catch {
      return null;
    }
  });

  ipcMain.handle('files:save', async (_, filePath: string, content: string, encoding: string) => {
    try {
      let finalEncoding = normalizeEncoding(encoding);
      if (finalEncoding === 'ascii' && content.split('').some(char => char.charCodeAt(0) > 127)) {
        finalEncoding = 'utf-8';
      }
      await fs.writeFile(filePath, iconv.encode(content, finalEncoding));
      return true;
    } catch {
      return false;
    }
  });

  ipcMain.handle('files:saveAs', async (_, content: string, encoding: string) => {
    const mainWindow = getMainWindow();
    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow || undefined, {
      defaultPath: 'document.md',
      filters: [
        { name: 'Markdown', extensions: ['md', 'markdown'] },
        { name: 'Text', extensions: ['txt'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    });

    if (canceled || !filePath) return null;

    try {
      let finalEncoding = normalizeEncoding(encoding);
      if (finalEncoding === 'ascii' && content.split('').some(char => char.charCodeAt(0) > 127)) {
        finalEncoding = 'utf-8';
      }
      await fs.writeFile(filePath, iconv.encode(content, finalEncoding));
      return filePath;
    } catch {
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
    } catch {
      return [];
    }
  });
}
