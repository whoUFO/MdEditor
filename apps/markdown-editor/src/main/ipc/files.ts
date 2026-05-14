import { ipcMain, dialog, BrowserWindow } from 'electron';
import fs from 'fs/promises';
import path from 'path';
import jschardet from 'jschardet';
import iconv from 'iconv-lite';

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
  if (!encoding || typeof encoding !== 'string') {
    console.warn('normalizeEncoding: Invalid encoding, using utf-8');
    return 'utf-8';
  }
  
  const normalized = encoding.toUpperCase().trim();
  const mapped = encodingMap[normalized];
  
  if (mapped) {
    return mapped;
  }
  
  if (iconv.encodingExists(encoding)) {
    return encoding;
  }
  
  console.warn(`normalizeEncoding: Unknown encoding "${encoding}", using utf-8`);
  return 'utf-8';
}

async function detectEncoding(buffer: Buffer): Promise<string> {
  if (!buffer || buffer.length === 0) {
    console.log('detectEncoding: Empty buffer, using utf-8');
    return 'utf-8';
  }
  
  const result = jschardet.detect(buffer);
  
  if (!result || !result.encoding) {
    console.log('detectEncoding: No encoding detected, using utf-8');
    return 'utf-8';
  }
  
  const detected = result.encoding;
  const normalized = normalizeEncoding(detected);
  
  console.log(`detectEncoding: Detected "${detected}", normalized to "${normalized}" (confidence: ${result.confidence})`);
  
  const hasNonASCII = buffer.some(byte => byte > 127);
  
  if (normalized === 'ascii' && hasNonASCII) {
    console.log('detectEncoding: Detected ASCII but buffer contains non-ASCII bytes, using utf-8');
    return 'utf-8';
  }
  
  if (result.confidence && result.confidence < 0.5) {
    if (hasNonASCII) {
      console.log(`detectEncoding: Low confidence (${result.confidence}) but has non-ASCII, using ${normalized}`);
      return normalized;
    }
    console.log('detectEncoding: Low confidence and no non-ASCII, using utf-8');
    return 'utf-8';
  }
  
  return normalized;
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

    console.log(`files:open: ${filePath}, encoding: ${encoding}, content length: ${content.length}`);

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

      console.log(`files:openPath: ${filePath}, encoding: ${encoding}, content length: ${content.length}`);

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
      let finalEncoding = normalizeEncoding(encoding);
      
      if (finalEncoding === 'ascii') {
        const hasNonASCII = content.split('').some(char => char.charCodeAt(0) > 127);
        if (hasNonASCII) {
          console.log(`files:save: Content contains non-ASCII characters, changing encoding from ASCII to UTF-8`);
          finalEncoding = 'utf-8';
        }
      }
      
      const buffer = iconv.encode(content, finalEncoding);
      await fs.writeFile(filePath, buffer);
      
      console.log(`files:save: ${filePath}, encoding: ${finalEncoding}, buffer length: ${buffer.length}`);
      console.log(`files:save: Success`);
      
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
      let finalEncoding = normalizeEncoding(encoding);
      
      if (finalEncoding === 'ascii') {
        const hasNonASCII = content.split('').some(char => char.charCodeAt(0) > 127);
        if (hasNonASCII) {
          console.log(`files:saveAs: Content contains non-ASCII characters, changing encoding from ASCII to UTF-8`);
          finalEncoding = 'utf-8';
        }
      }
      
      const buffer = iconv.encode(content, finalEncoding);
      await fs.writeFile(filePath, buffer);
      
      console.log(`files:saveAs: ${filePath}, encoding: ${finalEncoding}, buffer length: ${buffer.length}`);
      console.log(`files:saveAs: Success`);
      
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