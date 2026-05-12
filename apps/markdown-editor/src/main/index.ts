import { app, BrowserWindow, ipcMain, dialog, Menu } from 'electron';
import path from 'path';
import fs from 'fs/promises';
import jschardet from 'jschardet';
import iconv from 'iconv-lite';

let mainWindow: BrowserWindow | null = null;

async function createWindow(): Promise<void> {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
      preload: path.join(__dirname, '../preload/index.js'),
    },
    title: 'Markdown Editor',
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    await mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    await mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  setupMenu();
}

function setupMenu(): void {
  const menuTemplate = [
    {
      label: '文件',
      submenu: [
        {
          label: '打开',
          accelerator: 'CmdOrCtrl+O',
          click: () => mainWindow?.webContents.send('menu:open'),
        },
        {
          label: '保存',
          accelerator: 'CmdOrCtrl+S',
          click: () => mainWindow?.webContents.send('menu:save'),
        },
        {
          label: '另存为',
          accelerator: 'CmdOrCtrl+Shift+S',
          click: () => mainWindow?.webContents.send('menu:saveAs'),
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
          click: () => mainWindow?.webContents.send('menu:togglePreview'),
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

async function detectEncoding(buffer: Buffer): Promise<string> {
  const result = jschardet.detect(buffer);
  return result.encoding || 'utf-8';
}

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

ipcMain.handle('window:minimize', () => {
  mainWindow?.minimize();
});

ipcMain.handle('window:maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow?.maximize();
  }
});

ipcMain.handle('window:close', () => {
  mainWindow?.close();
});

ipcMain.handle('window:isMaximized', () => {
  return mainWindow?.isMaximized() ?? false;
});

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

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
