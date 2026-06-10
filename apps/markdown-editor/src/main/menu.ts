import { Menu, app, dialog } from 'electron';
import { getMainWindow } from './window';
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
    return 'utf-8';
  }
  const normalized = encoding.toUpperCase().trim();
  const mapped = encodingMap[normalized];
  if (mapped) return mapped;
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

export function setupMenu(): void {
  const menuTemplate = [
    {
      label: '文件',
      submenu: [
        {
          label: '打开',
          accelerator: 'CmdOrCtrl+O',
          click: async () => {
            const mainWindow = getMainWindow();
            const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
              properties: ['openFile'],
              filters: [
                { name: 'Markdown', extensions: ['md', 'markdown', 'txt'] },
                { name: 'All Files', extensions: ['*'] },
              ],
            });
            if (!canceled && filePaths && filePaths.length > 0) {
              const filePath = filePaths[0];
              const buffer = await fs.readFile(filePath);
              const encoding = await detectEncoding(buffer);
              const content = iconv.decode(buffer, encoding);
              mainWindow?.webContents.send('file:opened', {
                path: filePath,
                name: path.basename(filePath),
                content,
                encoding,
              });
            }
          },
        },
        {
          label: '保存',
          accelerator: 'CmdOrCtrl+S',
          click: () => getMainWindow()?.webContents.send('menu:save'),
        },
        {
          label: '另存为',
          accelerator: 'CmdOrCtrl+Shift+S',
          click: () => getMainWindow()?.webContents.send('menu:saveAs'),
        },
        { type: 'separator' },
        {
          label: '退出',
          accelerator: 'CmdOrCtrl+Q',
          click: () => app.quit(),
        },
      ],
    },
    {
      label: '编辑',
      submenu: [
        { label: '撤销', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
        { label: '重做', accelerator: 'CmdOrCtrl+Y', role: 'redo' },
        { type: 'separator' },
        { label: '剪切', accelerator: 'CmdOrCtrl+X', role: 'cut' },
        { label: '复制', accelerator: 'CmdOrCtrl+C', role: 'copy' },
        { label: '粘贴', accelerator: 'CmdOrCtrl+V', role: 'paste' },
      ],
    },
    {
      label: '视图',
      submenu: [
        {
          label: '切换预览',
          accelerator: 'CmdOrCtrl+Shift+P',
          click: () => getMainWindow()?.webContents.send('menu:togglePreview'),
        },
        { type: 'separator' },
        { label: '放大', accelerator: 'CmdOrCtrl+Plus', role: 'zoomIn' },
        { label: '缩小', accelerator: 'CmdOrCtrl+-', role: 'zoomOut' },
        { label: '重置缩放', accelerator: 'CmdOrCtrl+0', role: 'resetZoom' },
        { type: 'separator' },
        { label: '切换全屏', accelerator: 'F11', role: 'togglefullscreen' },
      ],
    },
    {
      label: '帮助',
      submenu: [
        {
          label: '关于',
          click: () => dialog.showMessageBox({
            title: '关于 Markdown Editor',
            message: 'Markdown Editor v0.1.0',
            detail: '一款现代化的 Markdown 编辑器',
          }),
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
}
