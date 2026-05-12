# Electron Markdown Editor - 技术架构文档

## 文档信息

| 项目 | 内容 |
|------|------|
| 文档版本 | v1.1.0 |
| 创建日期 | 2026-05-11 |
| 更新日期 | 2026-05-11 |
| 架构师 | 胡宇峰 |
| 开发者 | 胡宇峰 |
| 联系邮箱 | hyf2k@163.com |
| 审核状态 | 待审核 |

---

## 1. 架构概述

### 1.1 架构目标

本架构设计旨在构建一个高性能、安全可靠、易于维护的 Markdown 桌面编辑器。核心设计原则包括：

- **安全优先**：严格隔离主进程与渲染进程，防止安全漏洞
- **性能优化**：实时预览采用防抖机制，大文档渲染优化
- **模块化设计**：清晰的模块边界，便于独立开发和测试
- **可扩展性**：预留扩展接口，支持未来功能迭代

### 1.2 技术选型

| 层次 | 技术栈 | 版本 | 选型理由 |
|------|--------|------|---------|
| 桌面框架 | Electron | 41.x | 成熟的跨平台方案，丰富的生态 |
| 前端框架 | React | 19.x | 组件化开发，虚拟 DOM 性能优秀 |
| 语言 | TypeScript | 6.x | 类型安全，IDE 支持好 |
| 构建工具 | Vite | 8.x | 快速 HMR，现代化构建 |
| Monorepo | Turborepo | 2.9.x | 任务编排优化，缓存加速 |
| 包管理 | pnpm | 9.15.x | 磁盘空间优化，workspace 支持 |
| 编辑器 | CodeMirror 6 | 6.x | 模块化设计，可定制性强 |
| Markdown | unified | - | 插件生态丰富，处理链清晰 |
| 状态管理 | Zustand | 4.x | 轻量级，TypeScript 友好 |
| 样式 | CSS Modules + CSS Variables | - | 样式隔离，主题切换 |

### 1.3 架构风格

采用 **分层架构 + Monorepo** 的组织方式：

- **分层架构**：主进程、Preload 层、渲染进程三层分离
- **Monorepo**：应用代码与共享配置分离管理
- **模块化**：功能按模块组织，高内聚低耦合

---

## 2. 系统架构

### 2.1 整体架构图

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Electron Application                        │
├─────────────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                     Main Process (Node.js)                    │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐   │  │
│  │  │ Window Mgr  │  │ File System │  │ IPC Handlers        │   │  │
│  │  │             │  │             │  │                     │   │  │
│  │  │ - create    │  │ - readFile  │  │ - handleOpenFile    │   │  │
│  │  │ - manage    │  │ - writeFile │  │ - handleSaveFile    │   │  │
│  │  │ - events    │  │ - dialog    │  │ - handleGetFiles    │   │  │
│  │  └─────────────┘  └─────────────┘  └─────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                              │ IPC                                   │
│                              ▼                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                     Preload Script                            │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │
│  │  │  contextBridge.exposeInMainWorld('electronAPI', {       │  │  │
│  │  │    files: { open, save, readDirectory },                │  │  │
│  │  │    window: { minimize, maximize, close },               │  │  │
│  │  │    app: { getVersion, getPlatform }                     │  │  │
│  │  │  })                                                     │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                              │ contextBridge                        │
│                              ▼                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                   Renderer Process (Chromium)                 │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐    │  │
│  │  │   React App  │  │  CodeMirror  │  │  Preview Render  │    │  │
│  │  │              │  │              │  │                  │    │  │
│  │  │ - Components │  │ - Editor     │  │ - unified        │    │  │
│  │  │ - Hooks      │  │ - Extensions │  │ - KaTeX          │    │  │
│  │  │ - State      │  │ - Keymaps    │  │ - Mermaid        │    │  │
│  │  └──────────────┘  └──────────────┘  └──────────────────┘    │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 进程架构

#### 2.2.1 主进程 (Main Process)

**职责**：
- 应用生命周期管理
- 窗口创建与管理
- 系统对话框调用
- 文件系统操作
- IPC 通信处理

**安全考虑**：
- 启用 `contextIsolation: true`
- 启用 `sandbox: true`
- 禁用 `nodeIntegration: false`
- 使用 `contextBridge` 暴露 API

#### 2.2.2 Preload 层

**职责**：
- 安全地桥接主进程和渲染进程
- 暴露受控的 API 接口
- 类型定义共享

**API 设计**：

```typescript
// preload/types.ts
interface ElectronAPI {
  files: {
    open: () => Promise<{ path: string; content: string; encoding: string } | null>;
    save: (path: string, content: string, encoding: string) => Promise<boolean>;
    saveAs: (content: string, encoding: string) => Promise<string | null>;
    readDirectory: (path: string) => Promise<FileTreeItem[]>;
  };
  window: {
    minimize: () => void;
    maximize: () => void;
    close: () => void;
    isMaximized: () => Promise<boolean>;
  };
  app: {
    getVersion: () => Promise<string>;
    getPlatform: () => Promise<string>;
  };
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
```

#### 2.2.3 渲染进程 (Renderer Process)

**职责**：
- 用户界面渲染
- 用户交互处理
- Markdown 编辑和预览
- 状态管理

**安全沙箱**：
- 无法直接访问 Node.js API
- 无法直接访问文件系统
- 所有系统操作通过 IPC 委托

---

## 3. 模块设计

### 3.1 模块划分

```
apps/markdown-editor/src/
├── main/                          # 主进程模块
│   ├── index.ts                   # 入口文件
│   ├── window.ts                  # 窗口管理
│   ├── ipc/                       # IPC 处理器
│   │   ├── file-handlers.ts       # 文件操作
│   │   ├── window-handlers.ts     # 窗口操作
│   │   └── app-handlers.ts        # 应用信息
│   ├── menu/                      # 菜单配置
│   │   ├── application-menu.ts    # 应用菜单
│   │   └── context-menu.ts        # 上下文菜单
│   └── utils/                     # 工具函数
│       ├── encoding.ts            # 编码检测
│       └── security.ts            # 安全配置
│
├── preload/                       # Preload 模块
│   ├── index.ts                   # 入口文件
│   ├── api/                       # API 定义
│   │   ├── files.ts               # 文件 API
│   │   ├── window.ts              # 窗口 API
│   │   └── app.ts                 # 应用 API
│   └── types.ts                   # 类型定义
│
└── renderer/                      # 渲染进程模块
    ├── main.tsx                   # React 入口
    ├── App.tsx                    # 根组件
    ├── components/                # UI 组件
    │   ├── layout/                # 布局组件
    │   │   ├── MainLayout.tsx     # 主布局
    │   │   ├── Sidebar.tsx        # 侧边栏
    │   │   ├── Toolbar.tsx        # 工具栏
    │   │   └── StatusBar.tsx      # 状态栏
    │   ├── editor/                # 编辑器组件
    │   │   ├── Editor.tsx         # 编辑器容器
    │   │   ├── CodeMirror.tsx     # CodeMirror 封装
    │   │   └── extensions/        # 编辑器扩展
    │   ├── preview/               # 预览组件
    │   │   ├── Preview.tsx        # 预览容器
    │   │   ├── MarkdownRender.tsx # Markdown 渲染
    │   │   └── extensions/        # 渲染扩展
    │   └── file-tree/             # 文件树组件
    │       ├── FileTree.tsx       # 文件树容器
    │       ├── TreeNode.tsx       # 树节点
    │       └── FileTreeItem.tsx   # 文件项
    ├── hooks/                     # 自定义 Hooks
    │   ├── useEditor.ts           # 编辑器状态
    │   ├── useFile.ts             # 文件操作
    │   ├── usePreview.ts          # 预览控制
    │   └── useTheme.ts            # 主题管理
    ├── stores/                    # 状态管理 (Zustand)
    │   ├── editorStore.ts         # 编辑器状态
    │   ├── fileStore.ts           # 文件状态
    │   ├── uiStore.ts             # UI 状态
    │   └── settingsStore.ts       # 设置状态
    ├── utils/                     # 工具函数
    │   ├── markdown.ts            # Markdown 处理
    │   ├── shortcuts.ts           # 快捷键处理
    │   └── helpers.ts             # 通用工具
    └── styles/                    # 样式文件
        ├── variables.css          # CSS 变量
        ├── themes/                # 主题文件
        └── components/            # 组件样式
```

### 3.2 核心模块详细设计

#### 3.2.1 编辑器模块 (Editor)

**职责**：提供 Markdown 编辑功能

**核心组件**：
- `Editor.tsx`：编辑器容器，管理编辑器生命周期
- `CodeMirror.tsx`：CodeMirror 封装组件
- `extensions/`：编辑器扩展配置

**扩展清单**：

| 扩展 | 功能 | 包名 |
|------|------|------|
| 基础编辑 | 光标、选择、历史 | @codemirror/commands |
| Markdown 语言 | Markdown 语法支持 | @codemirror/lang-markdown |
| 语法高亮 | 代码着色 | @codemirror/language-data |
| 行号 | 显示行号 | @codemirror/view |
| 括号匹配 | 自动匹配括号 | @codemirror/matchbrackets |
| 自动缩进 | 智能缩进 | @codemirror/indent |
| 搜索 | 查找替换 | @codemirror/search |
| 主题 | 编辑器主题 | @codemirror/theme-one-dark |

**状态管理**：

```typescript
// stores/editorStore.ts
interface EditorState {
  content: string;
  cursorPosition: { line: number; column: number };
  selection: { from: number; to: number } | null;
  isDirty: boolean;
  
  setContent: (content: string) => void;
  setCursorPosition: (pos: { line: number; column: number }) => void;
  setSelection: (selection: { from: number; to: number } | null) => void;
  markDirty: (dirty: boolean) => void;
  insertText: (text: string, at?: number) => void;
  getSelectedText: () => string;
}
```

#### 3.2.2 预览模块 (Preview)

**职责**：将 Markdown 渲染为 HTML

**处理流程**：

```
Markdown Text
    ↓
remark-parse (解析为 AST)
    ↓
remark plugins (处理 Markdown)
    ↓
remark-rehype (转换为 HTML AST)
    ↓
rehype plugins (处理 HTML)
    ↓
rehype-stringify (生成 HTML)
    ↓
DOMPurify (安全净化)
    ↓
Rendered HTML
```

**插件清单**：

| 插件 | 功能 | 包名 |
|------|------|------|
| remark-parse | Markdown 解析 | remark-parse |
| remark-gfm | GitHub Flavored Markdown | remark-gfm |
| remark-math | 数学公式支持 | remark-math |
| remark-rehype | 转换为 HTML | remark-rehype |
| rehype-katex | KaTeX 公式渲染 | rehype-katex |
| rehype-highlight | 代码高亮 | rehype-highlight |
| rehype-mermaid | Mermaid 图表 | rehype-mermaid |
| rehype-sanitize | HTML 净化 | rehype-sanitize |
| rehype-stringify | HTML 生成 | rehype-stringify |

**预览面板开关设计**：

预览面板开关功能允许用户动态控制预览区的显示和隐藏，提供更灵活的编辑体验。

```typescript
// stores/uiStore.ts
interface UIState {
  previewVisible: boolean;
  splitRatio: number;
  
  togglePreview: () => void;
  setPreviewVisible: (visible: boolean) => void;
  setSplitRatio: (ratio: number) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      previewVisible: true,
      splitRatio: 50,

      togglePreview: () => {
        set({ previewVisible: !get().previewVisible });
      },

      setPreviewVisible: (visible) => {
        set({ previewVisible: visible });
      },

      setSplitRatio: (ratio) => {
        set({ splitRatio: ratio });
      },
    }),
    {
      name: 'ui-storage',
    }
  )
);
```

**布局组件设计**：

```tsx
// components/layout/MainLayout.tsx
import { useUIStore } from '../../stores/uiStore';

export function MainLayout(): JSX.Element {
  const { previewVisible, splitRatio } = useUIStore();

  return (
    <div className="main-layout">
      <Toolbar />
      <div className="editor-container">
        <div 
          className="editor-pane" 
          style={{ 
            flex: previewVisible ? splitRatio : 1,
            transition: 'flex 0.2s ease'
          }}
        >
          <Editor />
        </div>
        {previewVisible && (
          <>
            <div className="resizer" />
            <div 
              className="preview-pane" 
              style={{ flex: 100 - splitRatio }}
            >
              <Preview />
            </div>
          </>
        )}
      </div>
      <StatusBar />
    </div>
  );
}
```

#### 3.2.3 文件管理模块 (File Manager)

**职责**：管理文件操作和目录树

**核心功能**：
- 文件打开/保存
- 目录树浏览
- 编码检测
- 最近文件列表

**编码检测策略**：

```typescript
// main/utils/encoding.ts
import * as jschardet from 'jschardet';
import * as iconv from 'iconv-lite';

async function detectEncoding(buffer: Buffer): Promise<string> {
  const result = jschardet.detect(buffer);
  return result.encoding || 'utf-8';
}

async function readFileWithEncoding(filePath: string): Promise<{ content: string; encoding: string }> {
  const buffer = await fs.readFile(filePath);
  const encoding = await detectEncoding(buffer);
  const content = iconv.decode(buffer, encoding);
  return { content, encoding };
}
```

#### 3.2.4 主题系统模块 (Theme System)

**职责**：管理应用主题

**CSS 变量设计**：

```css
/* styles/variables.css */
:root {
  /* 颜色系统 */
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f5f5f5;
  --color-bg-tertiary: #e8e8e8;
  
  --color-text-primary: #1a1a1a;
  --color-text-secondary: #666666;
  --color-text-tertiary: #999999;
  
  --color-border: #d9d9d9;
  --color-accent: #1890ff;
  --color-accent-hover: #40a9ff;
  
  /* 编辑器 */
  --editor-bg: #ffffff;
  --editor-text: #1a1a1a;
  --editor-line-number: #999999;
  --editor-cursor: #1a1a1a;
  --editor-selection: #b3d8ff;
  
  /* 预览区 */
  --preview-bg: #ffffff;
  --preview-text: #1a1a1a;
  --preview-link: #1890ff;
  --preview-code-bg: #f5f5f5;
  
  /* 间距 */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* 字体 */
  --font-mono: 'Fira Code', 'Consolas', monospace;
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

[data-theme="dark"] {
  --color-bg-primary: #1a1a1a;
  --color-bg-secondary: #2d2d2d;
  --color-bg-tertiary: #3d3d3d;
  
  --color-text-primary: #e8e8e8;
  --color-text-secondary: #b0b0b0;
  --color-text-tertiary: #808080;
  
  --color-border: #404040;
  --color-accent: #4dabf7;
  --color-accent-hover: #74c0fc;
  
  --editor-bg: #1a1a1a;
  --editor-text: #e8e8e8;
  --editor-line-number: #666666;
  --editor-cursor: #e8e8e8;
  --editor-selection: #264f78;
  
  --preview-bg: #1a1a1a;
  --preview-text: #e8e8e8;
  --preview-link: #4dabf7;
  --preview-code-bg: #2d2d2d;
}
```

---

## 4. 数据流设计

### 4.1 状态管理架构

采用 **Zustand** 进行状态管理，按功能域划分 Store：

```
┌─────────────────────────────────────────────────────────────┐
│                      Zustand Stores                         │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ editorStore  │  │  fileStore   │  │    uiStore       │  │
│  │              │  │              │  │                  │  │
│  │ - content    │  │ - currentFile│  │ - sidebarVisible │  │
│  │ - cursorPos  │  │ - fileTree   │  │ - previewVisible │  │
│  │ - isDirty    │  │ - recentFiles│  │ - splitRatio     │  │
│  │ - selection  │  │ - isLoading  │  │ - theme          │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                 settingsStore                        │  │
│  │  - theme, fontSize, autoSave, keybindings, etc.     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 核心数据流

#### 4.2.1 文件打开流程

```
用户点击"打开文件"
    ↓
Toolbar 调用 fileStore.openFile()
    ↓
fileStore 调用 window.electronAPI.files.open()
    ↓
IPC 通信到主进程
    ↓
主进程显示文件对话框
    ↓
用户选择文件
    ↓
主进程读取文件内容 + 检测编码
    ↓
返回 { path, content, encoding }
    ↓
fileStore 更新 currentFile
    ↓
editorStore 设置 content
    ↓
编辑器显示内容，预览区渲染
```

#### 4.2.2 实时预览流程

```
用户在编辑器输入
    ↓
CodeMirror onChange 事件
    ↓
editorStore.setContent() (防抖 300ms)
    ↓
触发预览重新渲染
    ↓
unified 处理链转换 Markdown → HTML
    ↓
DOMPurify 净化 HTML
    ↓
更新预览区 DOM
    ↓
KaTeX 渲染数学公式
Mermaid 渲染图表
highlight.js 高亮代码
```

#### 4.2.3 预览面板开关流程

```
用户点击预览开关按钮或按 Ctrl+Shift+P
    ↓
Toolbar 调用 uiStore.togglePreview()
    ↓
uiStore 更新 previewVisible 状态
    ↓
状态持久化到 localStorage
    ↓
MainLayout 组件响应状态变化
    ↓
预览面板显示/隐藏（带过渡动画）
    ↓
编辑区自动调整宽度
```

---

## 5. 安全架构

### 5.1 安全策略

#### 5.1.1 进程隔离

```typescript
// main/window.ts
const mainWindow = new BrowserWindow({
  webPreferences: {
    // 启用上下文隔离
    contextIsolation: true,
    // 启用沙箱
    sandbox: true,
    // 禁用 Node.js 集成
    nodeIntegration: false,
    // 禁用远程模块
    enableRemoteModule: false,
    // 只允许加载本地资源
    allowRunningInsecureContent: false,
    // Preload 脚本路径
    preload: path.join(__dirname, '../preload/index.js'),
  },
});
```

#### 5.1.2 内容安全策略 (CSP)

```typescript
// main/window.ts
mainWindow.webContents.session.webRequest.onHeadersReceived(
  (details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self';" +
          "script-src 'self' 'unsafe-inline' 'unsafe-eval';" +
          "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;" +
          "img-src 'self' data: https:;" +
          "font-src 'self' https://cdn.jsdelivr.net;" +
          "connect-src 'self';" +
          "frame-src 'none';" +
          "object-src 'none';",
        ],
      },
    });
  }
);
```

#### 5.1.3 HTML 净化

```typescript
// renderer/utils/markdown.ts
import DOMPurify from 'dompurify';
import { unified } from 'unified';
import rehypeSanitize from 'rehype-sanitize';

const processor = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeSanitize, {
    // 允许的标签
    tagNames: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'br', ...],
    // 允许的协议
    protocols: {
      href: ['http', 'https', 'mailto'],
      src: ['http', 'https', 'data'],
    },
  })
  .use(rehypeStringify);

async function renderMarkdown(content: string): Promise<string> {
  const result = await processor.process(content);
  return DOMPurify.sanitize(String(result));
}
```

### 5.2 安全审查清单

| 检查项 | 状态 | 说明 |
|--------|------|------|
| contextIsolation 启用 | ✅ | 防止 Preload 和页面共享上下文 |
| sandbox 启用 | ✅ | 限制渲染进程权限 |
| nodeIntegration 禁用 | ✅ | 防止页面访问 Node.js API |
| enableRemoteModule 禁用 | ✅ | 防止使用远程模块 |
| CSP 配置 | ✅ | 限制资源加载来源 |
| HTML 净化 | ✅ | rehype-sanitize + DOMPurify |
| 文件路径验证 | ✅ | 防止路径遍历攻击 |
| IPC 输入验证 | ✅ | 验证所有 IPC 消息参数 |

---

## 6. 性能优化

### 6.1 渲染优化

#### 6.1.1 防抖机制

```typescript
// hooks/usePreview.ts
import { useCallback, useRef } from 'react';
import { debounce } from 'lodash-es';

export function usePreview() {
  const renderRef = useRef<(() => void) | null>(null);
  
  const debouncedRender = useCallback(
    debounce((content: string) => {
      renderMarkdown(content);
    }, 300),
    []
  );
  
  return { debouncedRender };
}
```

#### 6.1.2 虚拟滚动

对于大文档的目录树，采用虚拟滚动优化：

```typescript
// components/file-tree/VirtualTree.tsx
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualTree({ items }: { items: FileTreeItem[] }) {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 28,
  });
  
  // 只渲染可见区域的项目
  return (
    <div ref={parentRef}>
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <TreeNode
            key={virtualItem.key}
            item={items[virtualItem.index]}
            style={{ transform: `translateY(${virtualItem.start}px)` }}
          />
        ))}
      </div>
    </div>
  );
}
```

### 6.2 构建优化

#### 6.2.1 代码分割

```typescript
// renderer/App.tsx
import { lazy, Suspense } from 'react';

// 懒加载预览组件
const Preview = lazy(() => import('./components/preview/Preview'));

function App() {
  return (
    <Suspense fallback={<PreviewSkeleton />}>
      <Preview />
    </Suspense>
  );
}
```

#### 6.2.2 依赖优化

```javascript
// vite.config.ts
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 将大型依赖单独打包
          'codemirror': ['@codemirror/state', '@codemirror/view', ...],
          'markdown': ['unified', 'remark-parse', 'remark-rehype', ...],
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
  },
};
```

---

## 7. 部署架构

### 7.1 构建流程

```
开发代码
    ↓
TypeScript 编译
    ↓
Vite 打包
    ↓
Electron Builder 打包
    ↓
平台特定产物
    ├── Windows: .exe, .msi
    ├── macOS: .dmg, .zip
    └── Linux: .AppImage, .deb, .rpm
```

### 7.2 发布流程

```
代码合并到 main 分支
    ↓
CI 触发构建
    ↓
运行测试套件
    ↓
构建各平台安装包
    ↓
上传到发布服务器
    ↓
生成更新日志
    ↓
GitHub Release
```

---

## 8. 监控与日志

### 8.1 日志系统

```typescript
// shared/logger.ts
import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV === 'development') {
  logger.add(new transports.Console({
    format: format.simple(),
  }));
}
```

### 8.2 性能监控

```typescript
// renderer/utils/performance.ts
export function measureRenderTime(componentName: string) {
  return function<T extends (...args: any[]) => any>(fn: T): T {
    return function(...args: Parameters<T>): ReturnType<T> {
      const start = performance.now();
      const result = fn(...args);
      const end = performance.now();
      console.log(`${componentName} render time: ${end - start}ms`);
      return result;
    } as T;
  };
}
```

---

## 9. 附录

### 9.1 技术债务

| 项目 | 描述 | 优先级 | 计划解决时间 |
|------|------|--------|-------------|
| 文件树右键菜单 | 缺少新建/重命名/删除功能 | P2 | v0.2.0 |
| 插件系统 | 需要设计扩展机制 | P3 | v0.3.0 |
| 协作编辑 | 多人实时编辑支持 | P3 | v1.0.0 |

### 9.2 参考资料

- [Electron 架构文档](https://www.electronjs.org/docs/latest/tutorial/process-model)
- [CodeMirror 6 系统设计](https://codemirror.net/docs/guide/)
- [unified 生态系统](https://unifiedjs.com/)
- [Zustand 状态管理](https://docs.pmnd.rs/zustand)

---

**文档维护记录**

| 版本 | 日期 | 修改内容 | 作者 |
|------|------|---------|------|
| v1.0.0 | 2026-05-11 | 初始版本 | 胡宇峰 |
| v1.1.0 | 2026-05-11 | 增加预览面板开关功能设计 | 胡宇峰 |
