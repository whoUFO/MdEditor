# Electron Markdown Editor - 开发实施计划

## 文档信息

| 项目 | 内容 |
|------|------|
| 文档版本 | v1.0.0 |
| 创建日期 | 2026-05-11 |
| 计划周期 | 15 周 |
| 负责人 | - |

---

## 1. 实施概述

### 1.1 目标

本计划详细描述了 Electron Markdown Editor 从项目初始化到 v0.1.0 发布的完整开发实施步骤。计划采用敏捷开发模式，分为 5 个阶段，共 15 周。

### 1.2 关键里程碑

| 里程碑 | 时间 | 交付物 |
|--------|------|--------|
| M0 完成 | 第 2 周末 | Monorepo 基础设施 |
| P1 完成 | 第 6 周末 | 核心编辑功能 |
| P2 完成 | 第 10 周末 | 增强功能 |
| P3 完成 | 第 13 周末 | 安全与优化 |
| v0.1.0 发布 | 第 15 周末 | 正式版本 |

---

## 2. 阶段一：基础设施搭建 (M0)

**时间**：第 1-2 周  
**目标**：搭建完整的开发环境和项目架构

### 2.1 任务清单

#### 任务 M0-1: 初始化 Monorepo

**负责人**：技术负责人  
**工时**：4 小时  
**依赖**：无

**详细步骤**：

1. **创建 pnpm workspace**
   ```bash
   # 初始化项目
   mkdir electron-markdown-editor
   cd electron-markdown-editor
   
   # 创建 pnpm-workspace.yaml
   cat > pnpm-workspace.yaml << 'EOF'
   packages:
     - 'apps/*'
     - 'packages/*'
   EOF
   
   # 初始化 package.json
   pnpm init
   ```

2. **配置 Turborepo**
   ```json
   // turbo.json
   {
     "$schema": "https://turbo.build/schema.json",
     "globalDependencies": ["**/.env.*local"],
     "pipeline": {
       "build": {
         "dependsOn": ["^build"],
         "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
       },
       "lint": {},
       "typecheck": {},
       "dev": {
         "cache": false,
         "persistent": true
       },
       "test": {
         "dependsOn": ["build"]
       }
     }
   }
   ```

3. **创建目录结构**
   ```bash
   mkdir -p apps/markdown-editor/src/{main,preload,renderer}
   mkdir -p packages/{shared,tsconfig,eslint-config}
   ```

**验收标准**：
- [ ] pnpm install 成功执行
- [ ] Turborepo 配置正确
- [ ] 目录结构符合规范

---

#### 任务 M0-2: 配置 TypeScript

**负责人**：技术负责人  
**工时**：2 小时  
**依赖**：M0-1

**详细步骤**：

1. **创建共享 tsconfig**
   ```json
   // packages/tsconfig/base.json
   {
     "compilerOptions": {
       "target": "ES2022",
       "lib": ["ES2022", "DOM", "DOM.Iterable"],
       "module": "ESNext",
       "moduleResolution": "bundler",
       "resolveJsonModule": true,
       "allowJs": false,
       "checkJs": false,
       "declaration": true,
       "declarationMap": true,
       "sourceMap": true,
       "outDir": "./dist",
       "removeComments": true,
       "esModuleInterop": true,
       "forceConsistentCasingInFileNames": true,
       "strict": true,
       "noImplicitAny": true,
       "strictNullChecks": true,
       "strictFunctionTypes": true,
       "strictBindCallApply": true,
       "strictPropertyInitialization": true,
       "noImplicitThis": true,
       "alwaysStrict": true,
       "noUnusedLocals": true,
       "noUnusedParameters": true,
       "noImplicitReturns": true,
       "noFallthroughCasesInSwitch": true,
       "skipLibCheck": true
     },
     "exclude": ["node_modules", "dist"]
   }
   ```

2. **创建应用 tsconfig**
   ```json
   // apps/markdown-editor/tsconfig.json
   {
     "extends": "@markdown-editor/tsconfig/base.json",
     "compilerOptions": {
       "jsx": "react-jsx",
       "baseUrl": ".",
       "paths": {
         "@/*": ["./src/renderer/*"],
         "@main/*": ["./src/main/*"],
         "@preload/*": ["./src/preload/*"],
         "@shared/*": ["../../packages/shared/src/*"]
       }
     },
     "include": ["src/**/*"]
   }
   ```

**验收标准**：
- [ ] tsc --noEmit 无错误
- [ ] 路径别名配置正确

---

#### 任务 M0-3: 配置 ESLint 和 Prettier

**负责人**：技术负责人  
**工时**：2 小时  
**依赖**：M0-1

**详细步骤**：

1. **创建 ESLint 配置包**
   ```javascript
   // packages/eslint-config/index.js
   module.exports = {
     env: {
       browser: true,
       es2022: true,
       node: true,
     },
     extends: [
       'eslint:recommended',
       '@typescript-eslint/recommended',
       'plugin:react-hooks/recommended',
       'plugin:react/recommended',
       'prettier',
     ],
     parser: '@typescript-eslint/parser',
     parserOptions: {
       ecmaVersion: 'latest',
       sourceType: 'module',
       ecmaFeatures: {
         jsx: true,
       },
     },
     plugins: ['@typescript-eslint', 'react', 'react-hooks'],
     rules: {
       'react/react-in-jsx-scope': 'off',
       '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
       '@typescript-eslint/explicit-function-return-type': 'off',
       '@typescript-eslint/no-explicit-any': 'error',
     },
     settings: {
       react: {
         version: 'detect',
       },
     },
   };
   ```

2. **创建 Prettier 配置**
   ```json
   // .prettierrc
   {
     "semi": true,
     "trailingComma": "es5",
     "singleQuote": true,
     "printWidth": 100,
     "tabWidth": 2,
     "useTabs": false
   }
   ```

**验收标准**：
- [ ] pnpm lint 无错误
- [ ] pnpm format 正常工作

---

#### 任务 M0-4: 搭建 Electron 基础框架

**负责人**：Electron 开发  
**工时**：8 小时  
**依赖**：M0-2

**详细步骤**：

1. **安装 Electron 依赖**
   ```bash
   cd apps/markdown-editor
   pnpm add electron@^41.0.0
   pnpm add -D vite vite-plugin-electron @vitejs/plugin-react
   ```

2. **创建主进程入口**
   ```typescript
   // src/main/index.ts
   import { app, BrowserWindow } from 'electron';
   import path from 'path';

   let mainWindow: BrowserWindow | null = null;

   function createWindow(): void {
     mainWindow = new BrowserWindow({
       width: 1400,
       height: 900,
       webPreferences: {
         contextIsolation: true,
         sandbox: true,
         nodeIntegration: false,
         preload: path.join(__dirname, '../preload/index.js'),
       },
     });

     // 加载渲染进程
     if (process.env.VITE_DEV_SERVER_URL) {
       mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
       mainWindow.webContents.openDevTools();
     } else {
       mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
     }

     mainWindow.on('closed', () => {
       mainWindow = null;
     });
   }

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
   ```

3. **创建 Preload 脚本**
   ```typescript
   // src/preload/index.ts
   import { contextBridge, ipcRenderer } from 'electron';

   contextBridge.exposeInMainWorld('electronAPI', {
     // 文件操作
     files: {
       open: () => ipcRenderer.invoke('files:open'),
       save: (path: string, content: string, encoding: string) =>
         ipcRenderer.invoke('files:save', path, content, encoding),
     },
     // 窗口操作
     window: {
       minimize: () => ipcRenderer.invoke('window:minimize'),
       maximize: () => ipcRenderer.invoke('window:maximize'),
       close: () => ipcRenderer.invoke('window:close'),
     },
   });
   ```

4. **配置 Vite**
   ```typescript
   // vite.config.ts
   import { defineConfig } from 'vite';
   import react from '@vitejs/plugin-react';
   import electron from 'vite-plugin-electron';

   export default defineConfig({
     plugins: [
       react(),
       electron([
         {
           entry: 'src/main/index.ts',
           onstart: (options) => options.startup(),
         },
         {
           entry: 'src/preload/index.ts',
           onstart: (options) => options.reload(),
         },
       ]),
     ],
     root: 'src/renderer',
     build: {
       outDir: '../../dist/renderer',
       emptyOutDir: true,
     },
   });
   ```

**验收标准**：
- [ ] pnpm dev 启动应用
- [ ] 窗口正常显示
- [ ] 开发者工具可打开

---

#### 任务 M0-5: 创建基础 UI 框架

**负责人**：前端开发  
**工时**：4 小时  
**依赖**：M0-4

**详细步骤**：

1. **创建 React 入口**
   ```tsx
   // src/renderer/main.tsx
   import React from 'react';
   import ReactDOM from 'react-dom/client';
   import App from './App';
   import './styles/index.css';

   ReactDOM.createRoot(document.getElementById('root')!).render(
     <React.StrictMode>
       <App />
     </React.StrictMode>
   );
   ```

2. **创建根组件**
   ```tsx
   // src/renderer/App.tsx
   import React from 'react';

   function App(): JSX.Element {
     return (
       <div className="app">
         <h1>Electron Markdown Editor</h1>
         <p>Welcome to your new editor!</p>
       </div>
     );
   }

   export default App;
   ```

3. **创建基础样式**
   ```css
   /* src/renderer/styles/index.css */
   * {
     margin: 0;
     padding: 0;
     box-sizing: border-box;
   }

   body {
     font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
     background: var(--color-bg-primary);
     color: var(--color-text-primary);
   }

   .app {
     width: 100vw;
     height: 100vh;
     display: flex;
     flex-direction: column;
     align-items: center;
     justify-content: center;
   }
   ```

**验收标准**：
- [ ] React 应用正常渲染
- [ ] 样式正确加载

---

### 2.2 M0 阶段检查点

| 检查项 | 状态 | 验证方式 |
|--------|------|---------|
| Monorepo 配置完成 | ⬜ | pnpm install 成功 |
| TypeScript 配置完成 | ⬜ | tsc --noEmit 通过 |
| ESLint/Prettier 配置完成 | ⬜ | lint 和 format 通过 |
| Electron 框架运行 | ⬜ | pnpm dev 启动成功 |
| React 基础 UI 显示 | ⬜ | 窗口显示正常 |

---

## 3. 阶段二：核心编辑功能 (P1)

**时间**：第 3-6 周  
**目标**：实现基础编辑和预览功能

### 3.1 任务清单

#### 任务 P1-1: 集成 CodeMirror 6

**负责人**：前端开发  
**工时**：16 小时  
**依赖**：M0-5

**详细步骤**：

1. **安装 CodeMirror 依赖**
   ```bash
   pnpm add @codemirror/state @codemirror/view @codemirror/commands
   pnpm add @codemirror/lang-markdown @codemirror/language-data
   pnpm add @codemirror/search @codemirror/autocomplete
   ```

2. **创建编辑器组件**
   ```tsx
   // src/renderer/components/editor/Editor.tsx
   import React, { useEffect, useRef } from 'react';
   import { EditorView, basicSetup } from 'codemirror';
   import { markdown } from '@codemirror/lang-markdown';
   import { oneDark } from '@codemirror/theme-one-dark';
   import { useEditorStore } from '../../stores/editorStore';

   export function Editor(): JSX.Element {
     const editorRef = useRef<HTMLDivElement>(null);
     const viewRef = useRef<EditorView | null>(null);
     const { content, setContent } = useEditorStore();

     useEffect(() => {
       if (!editorRef.current) return;

       const view = new EditorView({
         doc: content,
         extensions: [
           basicSetup,
           markdown({ codeLanguages: languages }),
           oneDark,
           EditorView.updateListener.of((update) => {
             if (update.docChanged) {
               setContent(update.state.doc.toString());
             }
           }),
         ],
         parent: editorRef.current,
       });

       viewRef.current = view;

       return () => {
         view.destroy();
       };
     }, []);

     return <div ref={editorRef} className="editor" />;
   }
   ```

**验收标准**：
- [ ] CodeMirror 编辑器正常显示
- [ ] Markdown 语法高亮工作
- [ ] 输入内容同步到状态管理

---

#### 任务 P1-2: 实现双栏布局

**负责人**：前端开发  
**工时**：8 小时  
**依赖**：P1-1

**详细步骤**：

1. **创建主布局组件**
   ```tsx
   // src/renderer/components/layout/MainLayout.tsx
   import React from 'react';
   import { Editor } from '../editor/Editor';
   import { Preview } from '../preview/Preview';
   import { Toolbar } from './Toolbar';
   import { StatusBar } from './StatusBar';
   import './MainLayout.css';

   export function MainLayout(): JSX.Element {
     return (
       <div className="main-layout">
         <Toolbar />
         <div className="editor-container">
           <div className="editor-pane">
             <Editor />
           </div>
           <div className="preview-pane">
             <Preview />
           </div>
         </div>
         <StatusBar />
       </div>
     );
   }
   ```

2. **添加样式**
   ```css
   /* MainLayout.css */
   .main-layout {
     display: flex;
     flex-direction: column;
     height: 100vh;
   }

   .editor-container {
     display: flex;
     flex: 1;
     overflow: hidden;
   }

   .editor-pane,
   .preview-pane {
     flex: 1;
     overflow: auto;
   }

   .editor-pane {
     border-right: 1px solid var(--color-border);
   }
   ```

**验收标准**：
- [ ] 双栏布局正常显示
- [ ] 编辑器占据左半部分
- [ ] 预览区占据右半部分

---

#### 任务 P1-3: 实现实时预览

**负责人**：前端开发  
**工时**：16 小时  
**依赖**：P1-2

**详细步骤**：

1. **安装 Markdown 处理依赖**
   ```bash
   pnpm add unified remark-parse remark-rehype remark-gfm
   pnpm add rehype-stringify rehype-sanitize rehype-highlight
   pnpm add @types/hast
   ```

2. **创建 Markdown 处理器**
   ```typescript
   // src/renderer/utils/markdown.ts
   import { unified } from 'unified';
   import remarkParse from 'remark-parse';
   import remarkGfm from 'remark-gfm';
   import remarkRehype from 'remark-rehype';
   import rehypeHighlight from 'rehype-highlight';
   import rehypeSanitize from 'rehype-sanitize';
   import rehypeStringify from 'rehype-stringify';
   import DOMPurify from 'dompurify';

   const processor = unified()
     .use(remarkParse)
     .use(remarkGfm)
     .use(remarkRehype)
     .use(rehypeHighlight)
     .use(rehypeSanitize)
     .use(rehypeStringify);

   export async function renderMarkdown(content: string): Promise<string> {
     const result = await processor.process(content);
     return DOMPurify.sanitize(String(result));
   }
   ```

3. **创建预览组件**
   ```tsx
   // src/renderer/components/preview/Preview.tsx
   import React, { useEffect, useState } from 'react';
   import { useDebounce } from '../../hooks/useDebounce';
   import { useEditorStore } from '../../stores/editorStore';
   import { renderMarkdown } from '../../utils/markdown';
   import './Preview.css';

   export function Preview(): JSX.Element {
     const { content } = useEditorStore();
     const debouncedContent = useDebounce(content, 300);
     const [html, setHtml] = useState('');

     useEffect(() => {
       renderMarkdown(debouncedContent).then(setHtml);
     }, [debouncedContent]);

     return (
       <div
         className="preview"
         dangerouslySetInnerHTML={{ __html: html }}
       />
     );
   }
   ```

**验收标准**：
- [ ] Markdown 正确渲染为 HTML
- [ ] 预览更新有 300ms 防抖
- [ ] 代码高亮正常工作

---

#### 任务 P1-4: 实现文件操作

**负责人**：Electron 开发  
**工时**：16 小时  
**依赖**：M0-4

**详细步骤**：

1. **实现 IPC 处理器**
   ```typescript
   // src/main/ipc/file-handlers.ts
   import { ipcMain, dialog } from 'electron';
   import fs from 'fs/promises';
   import path from 'path';
   import jschardet from 'jschardet';
   import iconv from 'iconv-lite';

   export function registerFileHandlers(): void {
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
       const encoding = jschardet.detect(buffer).encoding || 'utf-8';
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
   }
   ```

2. **创建文件状态管理**
   ```typescript
   // src/renderer/stores/fileStore.ts
   import { create } from 'zustand';

   interface FileState {
     currentFile: {
       path: string;
       name: string;
       content: string;
       encoding: string;
     } | null;
     isLoading: boolean;
     error: string | null;
     
     openFile: () => Promise<void>;
     saveFile: () => Promise<void>;
     setCurrentFile: (file: FileState['currentFile']) => void;
   }

   export const useFileStore = create<FileState>((set, get) => ({
     currentFile: null,
     isLoading: false,
     error: null,

     openFile: async () => {
       set({ isLoading: true, error: null });
       try {
         const result = await window.electronAPI.files.open();
         if (result) {
           set({ currentFile: result });
         }
       } catch (error) {
         set({ error: 'Failed to open file' });
       } finally {
         set({ isLoading: false });
       }
     },

     saveFile: async () => {
       const { currentFile } = get();
       if (!currentFile) return;

       const { useEditorStore } = await import('./editorStore');
       const content = useEditorStore.getState().content;
       
       await window.electronAPI.files.save(
         currentFile.path,
         content,
         currentFile.encoding
       );
     },

     setCurrentFile: (file) => set({ currentFile: file }),
   }));
   ```

**验收标准**：
- [ ] 文件对话框正常打开
- [ ] 文件内容正确加载
- [ ] 文件保存功能正常
- [ ] 编码检测准确

---

#### 任务 P1-5: 实现工具栏

**负责人**：前端开发  
**工时**：16 小时  
**依赖**：P1-1

**详细步骤**：

1. **创建工具栏组件**
   ```tsx
   // src/renderer/components/layout/Toolbar.tsx
   import React from 'react';
   import { useEditorStore } from '../../stores/editorStore';
   import { useFileStore } from '../../stores/fileStore';
   import './Toolbar.css';

   const toolbarButtons = [
     { icon: 'bold', label: 'Bold', shortcut: 'Ctrl+B', action: '**', surround: true },
     { icon: 'italic', label: 'Italic', shortcut: 'Ctrl+I', action: '*', surround: true },
     { icon: 'code', label: 'Code', shortcut: 'Ctrl+K', action: '`', surround: true },
     { icon: 'heading', label: 'Heading', shortcut: 'Ctrl+1', action: '# ', surround: false },
     { icon: 'list', label: 'List', shortcut: 'Ctrl+Shift+U', action: '- ', surround: false },
   ];

   export function Toolbar(): JSX.Element {
     const { insertText, getSelectedText } = useEditorStore();
     const { openFile, saveFile } = useFileStore();

     const handleToolbarAction = (button: typeof toolbarButtons[0]) => {
       const selectedText = getSelectedText();
       if (button.surround && selectedText) {
         insertText(`${button.action}${selectedText}${button.action}`);
       } else {
         insertText(button.action);
       }
     };

     return (
       <div className="toolbar">
         <div className="toolbar-group">
           <button onClick={openFile}>Open</button>
           <button onClick={saveFile}>Save</button>
         </div>
         <div className="toolbar-divider" />
         <div className="toolbar-group">
           {toolbarButtons.map((btn) => (
             <button
               key={btn.icon}
               onClick={() => handleToolbarAction(btn)}
               title={`${btn.label} (${btn.shortcut})`}
             >
               {btn.label}
             </button>
           ))}
         </div>
       </div>
     );
   }
   ```

**验收标准**：
- [ ] 工具栏按钮正常显示
- [ ] 按钮点击插入正确语法
- [ ] 快捷键提示显示

---

#### 任务 P1-6: 实现快捷键系统

**负责人**：前端开发  
**工时**：8 小时  
**依赖**：P1-5

**详细步骤**：

1. **创建快捷键 Hook**
   ```typescript
   // src/renderer/hooks/useShortcuts.ts
   import { useEffect } from 'react';
   import { useEditorStore } from '../stores/editorStore';
   import { useFileStore } from '../stores/fileStore';

   const shortcuts = [
     { key: 'Ctrl+b', action: 'bold' },
     { key: 'Ctrl+i', action: 'italic' },
     { key: 'Ctrl+k', action: 'code' },
     { key: 'Ctrl+1', action: 'h1' },
     { key: 'Ctrl+s', action: 'save' },
     { key: 'Ctrl+o', action: 'open' },
   ];

   export function useShortcuts(): void {
     const { insertText, getSelectedText } = useEditorStore();
     const { openFile, saveFile } = useFileStore();

     useEffect(() => {
       const handleKeyDown = (e: KeyboardEvent) => {
         const key = `${e.ctrlKey ? 'Ctrl+' : ''}${e.key.toLowerCase()}`;
         const shortcut = shortcuts.find((s) => s.key === key);

         if (shortcut) {
           e.preventDefault();
           
           switch (shortcut.action) {
             case 'bold':
               insertText(`**${getSelectedText() || 'bold text'}**`);
               break;
             case 'italic':
               insertText(`*${getSelectedText() || 'italic text'}*`);
               break;
             case 'save':
               saveFile();
               break;
             case 'open':
               openFile();
               break;
           }
         }
       };

       window.addEventListener('keydown', handleKeyDown);
       return () => window.removeEventListener('keydown', handleKeyDown);
     }, [insertText, getSelectedText, openFile, saveFile]);
   }
   ```

**验收标准**：
- [ ] 所有快捷键正常工作
- [ ] 快捷键与系统无冲突
- [ ] 响应时间 < 50ms

---

#### 任务 P1-7: 实现主题切换

**负责人**：前端开发  
**工时**：8 小时  
**依赖**：P1-2

**详细步骤**：

1. **创建主题状态管理**
   ```typescript
   // src/renderer/stores/settingsStore.ts
   import { create } from 'zustand';
   import { persist } from 'zustand/middleware';

   type Theme = 'light' | 'dark';

   interface SettingsState {
     theme: Theme;
     setTheme: (theme: Theme) => void;
     toggleTheme: () => void;
   }

   export const useSettingsStore = create<SettingsState>()(
     persist(
       (set, get) => ({
         theme: 'light',
         setTheme: (theme) => {
           set({ theme });
           document.documentElement.setAttribute('data-theme', theme);
         },
         toggleTheme: () => {
           const newTheme = get().theme === 'light' ? 'dark' : 'light';
           get().setTheme(newTheme);
         },
       }),
       {
         name: 'settings-storage',
       }
     )
   );
   ```

2. **添加主题切换按钮**
   ```tsx
   // 在 Toolbar.tsx 中添加
   <button onClick={toggleTheme}>
     {theme === 'light' ? '🌙' : '☀️'}
   </button>
   ```

**验收标准**：
- [ ] 主题切换即时生效
- [ ] 主题偏好持久化保存
- [ ] CSS 变量正确切换

---

### 3.2 P1 阶段检查点

| 检查项 | 状态 | 验证方式 |
|--------|------|---------|
| CodeMirror 集成完成 | ⬜ | 编辑器可输入 |
| 双栏布局完成 | ⬜ | 左右分栏显示 |
| 实时预览完成 | ⬜ | 输入同步预览 |
| 文件操作完成 | ⬜ | 打开/保存文件 |
| 工具栏完成 | ⬜ | 按钮功能正常 |
| 快捷键完成 | ⬜ | 快捷键响应 |
| 主题切换完成 | ⬜ | 明暗主题切换 |

---

## 4. 阶段三：增强功能 (P2)

**时间**：第 7-10 周  
**目标**：完善文件管理和富文本渲染

### 4.1 任务清单

#### 任务 P2-1: 实现目录树浏览

**负责人**：前端开发  
**工时**：16 小时  
**依赖**：P1-4

**详细步骤**：

1. **添加 IPC 处理器**
   ```typescript
   // src/main/ipc/file-handlers.ts
   ipcMain.handle('files:readDirectory', async (_, dirPath: string) => {
     const entries = await fs.readdir(dirPath, { withFileTypes: true });
     return entries.map((entry) => ({
       name: entry.name,
       path: path.join(dirPath, entry.name),
       type: entry.isDirectory() ? 'directory' : 'file',
     }));
   });
   ```

2. **创建文件树组件**
   ```tsx
   // src/renderer/components/file-tree/FileTree.tsx
   import React, { useState, useEffect } from 'react';
   import { useFileStore } from '../../stores/fileStore';

   interface FileTreeItem {
     name: string;
     path: string;
     type: 'file' | 'directory';
     children?: FileTreeItem[];
   }

   export function FileTree(): JSX.Element {
     const [tree, setTree] = useState<FileTreeItem[]>([]);
     const { currentFile, setCurrentFile } = useFileStore();

     const loadDirectory = async (path: string) => {
       const items = await window.electronAPI.files.readDirectory(path);
       setTree(items);
     };

     const handleItemClick = async (item: FileTreeItem) => {
       if (item.type === 'directory') {
         await loadDirectory(item.path);
       } else {
         const file = await window.electronAPI.files.open(item.path);
         if (file) setCurrentFile(file);
       }
     };

     return (
       <div className="file-tree">
         {tree.map((item) => (
           <div
             key={item.path}
             className={`file-tree-item ${item.type}`}
             onClick={() => handleItemClick(item)}
           >
             {item.type === 'directory' ? '📁' : '📄'} {item.name}
           </div>
         ))}
       </div>
     );
   }
   ```

**验收标准**：
- [ ] 目录树正确显示
- [ ] 文件夹可展开/折叠
- [ ] 点击文件打开

---

#### 任务 P2-2: 实现自动目录生成

**负责人**：前端开发  
**工时**：8 小时  
**依赖**：P1-3

**详细步骤**：

1. **创建目录解析函数**
   ```typescript
   // src/renderer/utils/toc.ts
   interface TocItem {
     level: number;
     text: string;
     id: string;
   }

   export function parseToc(content: string): TocItem[] {
     const lines = content.split('\n');
     const toc: TocItem[] = [];

     lines.forEach((line) => {
       const match = line.match(/^(#{1,6})\s+(.+)$/);
       if (match) {
         toc.push({
           level: match[1].length,
           text: match[2].trim(),
           id: match[2].trim().toLowerCase().replace(/\s+/g, '-'),
         });
       }
     });

     return toc;
   }
   ```

2. **创建目录组件**
   ```tsx
   // src/renderer/components/preview/Toc.tsx
   import React from 'react';
   import { useEditorStore } from '../../stores/editorStore';
   import { parseToc } from '../../utils/toc';

   export function Toc(): JSX.Element {
     const { content } = useEditorStore();
     const toc = parseToc(content);

     return (
       <div className="toc">
         <h3>目录</h3>
         <ul>
           {toc.map((item) => (
             <li key={item.id} style={{ paddingLeft: (item.level - 1) * 16 }}>
               <a href={`#${item.id}`}>{item.text}</a>
             </li>
           ))}
         </ul>
       </div>
     );
   }
   ```

**验收标准**：
- [ ] 目录正确解析
- [ ] 层级缩进正确
- [ ] 点击跳转正常

---

#### 任务 P2-3: 集成 KaTeX 数学公式

**负责人**：前端开发  
**工时**：8 小时  
**依赖**：P1-3

**详细步骤**：

1. **安装 KaTeX**
   ```bash
   pnpm add katex remark-math rehype-katex
   pnpm add -D @types/katex
   ```

2. **更新 Markdown 处理器**
   ```typescript
   // src/renderer/utils/markdown.ts
   import remarkMath from 'remark-math';
   import rehypeKatex from 'rehype-katex';
   import 'katex/dist/katex.min.css';

   const processor = unified()
     .use(remarkParse)
     .use(remarkMath)
     .use(remarkGfm)
     .use(remarkRehype)
     .use(rehypeKatex)
     .use(rehypeHighlight)
     .use(rehypeSanitize)
     .use(rehypeStringify);
   ```

**验收标准**：
- [ ] 行内公式渲染正确
- [ ] 块级公式渲染正确
- [ ] 复杂公式支持

---

#### 任务 P2-4: 集成 Mermaid 图表

**负责人**：前端开发  
**工时**：8 小时  
**依赖**：P1-3

**详细步骤**：

1. **安装 Mermaid**
   ```bash
   pnpm add mermaid
   ```

2. **创建 Mermaid 渲染组件**
   ```tsx
   // src/renderer/components/preview/MermaidRender.tsx
   import React, { useEffect, useRef } from 'react';
   import mermaid from 'mermaid';

   interface MermaidRenderProps {
     chart: string;
   }

   export function MermaidRender({ chart }: MermaidRenderProps): JSX.Element {
     const ref = useRef<HTMLDivElement>(null);

     useEffect(() => {
       if (ref.current) {
         mermaid.render('mermaid-svg', chart).then((result) => {
           ref.current!.innerHTML = result.svg;
         });
       }
     }, [chart]);

     return <div ref={ref} className="mermaid" />;
   }
   ```

**验收标准**：
- [ ] 流程图渲染正确
- [ ] 时序图渲染正确
- [ ] 图表样式正确

---

#### 任务 P2-5: 实现 HTML 导出

**负责人**：Electron 开发  
**工时**：8 小时  
**依赖**：P1-3

**详细步骤**：

1. **添加导出 IPC 处理器**
   ```typescript
   // src/main/ipc/export-handlers.ts
   import { ipcMain, dialog } from 'electron';
   import fs from 'fs/promises';

   export function registerExportHandlers(): void {
     ipcMain.handle('export:html', async (_, html: string) => {
       const { canceled, filePath } = await dialog.showSaveDialog({
         defaultPath: 'document.html',
         filters: [{ name: 'HTML', extensions: ['html'] }],
       });

       if (canceled || !filePath) return false;

       const fullHtml = `<!DOCTYPE html>
   <html>
   <head>
     <meta charset="UTF-8">
     <title>Exported Document</title>
     <style>
       ${await getStyles()}
     </style>
   </head>
   <body>
     ${html}
   </body>
   </html>`;

       await fs.writeFile(filePath, fullHtml, 'utf-8');
       return true;
     });
   }
   ```

**验收标准**：
- [ ] HTML 导出成功
- [ ] 样式内联正确
- [ ] 文件可离线查看

---

### 4.2 P2 阶段检查点

| 检查项 | 状态 | 验证方式 |
|--------|------|---------|
| 目录树完成 | ⬜ | 文件树显示正常 |
| 自动目录完成 | ⬜ | 目录生成正确 |
| KaTeX 集成完成 | ⬜ | 公式渲染正确 |
| Mermaid 集成完成 | ⬜ | 图表渲染正确 |
| HTML 导出完成 | ⬜ | 导出文件正常 |

---

## 5. 阶段四：安全与优化 (P3)

**时间**：第 11-13 周  
**目标**：实现安全机制和性能优化

### 5.1 任务清单

#### 任务 P3-1: 实现 CSP 安全策略

**负责人**：Electron 开发  
**工时**：8 小时  
**依赖**：M0-4

**详细步骤**：

1. **配置 CSP**
   ```typescript
   // src/main/window.ts
   mainWindow.webContents.session.webRequest.onHeadersReceived(
     (details, callback) => {
       callback({
         responseHeaders: {
           ...details.responseHeaders,
           'Content-Security-Policy': [
             "default-src 'self';" +
             "script-src 'self' 'unsafe-inline';" +
             "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;" +
             "img-src 'self' data: https:;" +
             "font-src 'self';" +
             "connect-src 'self';" +
             "frame-src 'none';" +
             "object-src 'none';",
           ],
         },
       });
     }
   );
   ```

**验收标准**：
- [ ] CSP 头正确设置
- [ ] 无 CSP 违规警告
- [ ] 功能正常可用

---

#### 任务 P3-2: 实现 PDF 导出

**负责人**：Electron 开发  
**工时**：16 小时  
**依赖**：P2-5

**详细步骤**：

1. **添加 PDF 导出功能**
   ```typescript
   // src/main/ipc/export-handlers.ts
   ipcMain.handle('export:pdf', async () => {
     const { canceled, filePath } = await dialog.showSaveDialog({
       defaultPath: 'document.pdf',
       filters: [{ name: 'PDF', extensions: ['pdf'] }],
     });

     if (canceled || !filePath) return false;

     const win = BrowserWindow.getFocusedWindow();
     if (!win) return false;

     await win.webContents.printToPDF({
       marginsType: 1,
       printBackground: true,
       pageSize: 'A4',
     }).then((data) => {
       fs.writeFile(filePath, data);
     });

     return true;
   });
   ```

**验收标准**：
- [ ] PDF 导出成功
- [ ] 格式保留完整
- [ ] 中文显示正常

---

#### 任务 P3-3: 性能优化

**负责人**：前端开发  
**工时**：16 小时  
**依赖**：P1-3

**详细步骤**：

1. **实现虚拟滚动**
   ```tsx
   // src/renderer/components/file-tree/VirtualFileTree.tsx
   import { useVirtualizer } from '@tanstack/react-virtual';

   export function VirtualFileTree({ items }: { items: FileTreeItem[] }) {
     const parentRef = useRef<HTMLDivElement>(null);
     const virtualizer = useVirtualizer({
       count: items.length,
       getScrollElement: () => parentRef.current,
       estimateSize: () => 28,
     });

     return (
       <div ref={parentRef} style={{ height: '100%', overflow: 'auto' }}>
         <div style={{ height: virtualizer.getTotalSize() }}>
           {virtualizer.getVirtualItems().map((virtualItem) => (
             <div
               key={virtualItem.key}
               style={{
                 position: 'absolute',
                 top: 0,
                 left: 0,
                 width: '100%',
                 transform: `translateY(${virtualItem.start}px)`,
               }}
             >
               <FileTreeItem item={items[virtualItem.index]} />
             </div>
           ))}
         </div>
       </div>
     );
   }
   ```

2. **代码分割**
   ```typescript
   // vite.config.ts
   export default {
     build: {
       rollupOptions: {
         output: {
           manualChunks: {
             'codemirror': ['@codemirror/state', '@codemirror/view'],
             'markdown': ['unified', 'remark-parse'],
             'vendor': ['react', 'react-dom', 'zustand'],
           },
         },
       },
     },
   };
   ```

**验收标准**：
- [ ] 大文件打开 < 500ms
- [ ] 内存占用 < 500MB
- [ ] 滚动流畅无卡顿

---

#### 任务 P3-4: 安全审查

**负责人**：技术负责人  
**工时**：8 小时  
**依赖**：P3-1

**审查清单**：
- [ ] contextIsolation 启用
- [ ] sandbox 启用
- [ ] nodeIntegration 禁用
- [ ] CSP 配置正确
- [ ] HTML 净化有效
- [ ] IPC 输入验证
- [ ] 文件路径验证

---

### 5.2 P3 阶段检查点

| 检查项 | 状态 | 验证方式 |
|--------|------|---------|
| CSP 配置完成 | ⬜ | 无安全警告 |
| PDF 导出完成 | ⬜ | PDF 生成正确 |
| 性能优化完成 | ⬜ | 性能测试通过 |
| 安全审查通过 | ⬜ | 审查清单完成 |

---

## 6. 阶段五：发布准备 (P4)

**时间**：第 14-15 周  
**目标**：完成发布前的准备工作

### 6.1 任务清单

#### 任务 P4-1: 编写用户文档

**负责人**：项目经理  
**工时**：16 小时  
**依赖**：P3-4

**文档清单**：
- [ ] 快速开始指南
- [ ] 功能使用手册
- [ ] 快捷键参考
- [ ] 常见问题解答

---

#### 任务 P4-2: 配置 CI/CD

**负责人**：Electron 开发  
**工时**：8 小时  
**依赖**：M0-1

**详细步骤**：

1. **创建 GitHub Actions 工作流**
   ```yaml
   # .github/workflows/release.yml
   name: Release

   on:
     push:
       tags:
         - 'v*'

   jobs:
     build:
       runs-on: ${{ matrix.os }}
       strategy:
         matrix:
           os: [ubuntu-latest, windows-latest, macos-latest]

       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: '20'
         - uses: pnpm/action-setup@v2
           with:
             version: 9
         - run: pnpm install
         - run: pnpm build
         - run: pnpm electron-builder --publish=always
           env:
             GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
   ```

---

#### 任务 P4-3: 制作安装包

**负责人**：Electron 开发  
**工时**：8 小时  
**依赖**：P4-2

**配置 electron-builder**
   ```json
   // package.json
   {
     "build": {
       "appId": "com.example.markdown-editor",
       "productName": "Markdown Editor",
       "directories": {
         "output": "release"
       },
       "files": [
         "dist/**/*"
       ],
       "mac": {
         "target": ["dmg", "zip"]
       },
       "win": {
         "target": ["nsis", "portable"]
       },
       "linux": {
         "target": ["AppImage", "deb"]
       }
     }
   }
   ```

---

#### 任务 P4-4: 发布 v0.1.0

**负责人**：项目经理  
**工时**：4 小时  
**依赖**：P4-3

**发布清单**：
- [ ] 版本号更新
- [ ] 更新日志编写
- [ ] GitHub Release 创建
- [ ] 安装包上传
- [ ] 发布公告

---

### 6.2 P4 阶段检查点

| 检查项 | 状态 | 验证方式 |
|--------|------|---------|
| 用户文档完成 | ⬜ | 文档已发布 |
| CI/CD 配置完成 | ⬜ | 构建成功 |
| 安装包制作完成 | ⬜ | 各平台包可用 |
| v0.1.0 发布 | ⬜ | Release 已创建 |

---

## 7. 风险管理

### 7.1 风险应对

| 风险 | 可能性 | 影响 | 应对措施 |
|------|--------|------|---------|
| 第三方库兼容性问题 | 中 | 高 | 提前测试，准备替代方案 |
| 性能不达标 | 中 | 高 | 早期性能测试，预留优化时间 |
| 安全漏洞 | 低 | 高 | 定期安全审查，及时更新 |
| 需求变更 | 中 | 中 | 敏捷迭代，控制变更范围 |

---

## 8. 附录

### 8.1 开发命令速查

```bash
# 安装依赖
pnpm install

# 启动开发
pnpm dev

# 构建
pnpm build

# 测试
pnpm test

# 打包
pnpm electron-builder

# 代码检查
pnpm lint
pnpm typecheck
```

### 8.2 参考文档

- [Electron 文档](https://www.electronjs.org/docs)
- [CodeMirror 文档](https://codemirror.net/docs/)
- [React 文档](https://react.dev/)
- [Zustand 文档](https://docs.pmnd.rs/zustand)

---

**文档维护记录**

| 版本 | 日期 | 修改内容 | 作者 |
|------|------|---------|------|
| v1.0.0 | 2026-05-11 | 初始版本 | - |
