# AGENTS.md —— Electron Markdown Editor

> 本文件面向 AI 编程助手。如果你正在阅读此文件，说明你对本项目一无所知。以下信息全部基于项目实际内容，请勿臆测。

---

## 项目概览

本项目是一个基于 **Electron + React + TypeScript** 开发的现代化 Markdown 桌面编辑器，采用 **Turborepo + pnpm workspace** 进行 Monorepo 管理。

- **项目名称**: Markdown Editor（包名 `@markdown-editor/app`）
- **版本**: v0.2.0
- **开发者**: 胡宇峰（hyf2k@163.com）
- **许可证**: MIT
- **所有文档、UI 字符串、提交规范均使用中文**。代码标识符（变量名、函数名、接口名）使用英文。

### 核心功能
- 基于 CodeMirror 6 的 Markdown 编辑器，支持实时双栏预览
- 文件树浏览、打开、保存，支持自动编码检测（GBK、Shift-JIS、UTF-8 等）
- Markdown 富文本渲染：GFM、KaTeX 数学公式、Mermaid 图表、highlight.js 代码高亮
- 主题切换（亮色/暗色）、分栏比例拖动调整
- 导出 HTML / PDF
- 自动目录生成、编辑区与预览区滚动同步

---

## 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| 桌面框架 | Electron | ^41.0.0 |
| 前端框架 | React | ^19.0.0 |
| 语言 | TypeScript | ^6.0.0（strict 模式全开） |
| 构建工具 | Vite | ^8.0.0 |
| Monorepo 编排 | Turborepo | ^2.9.0 |
| 包管理器 | pnpm | 9.15.0（固定版本） |
| 编辑器内核 | CodeMirror 6 | ^6.0.0 |
| Markdown 处理 | unified / remark / rehype | ^11.0.0 |
| 数学公式 | KaTeX | ^0.16.0 |
| 图表 | Mermaid | ^10.0.0 |
| 代码高亮 | highlight.js | ^11.0.0 |
| 状态管理 | Zustand | ^4.0.0 |
| 图标 | lucide-react | ^0.290.0 |
| 编码检测 | iconv-lite + jschardet | — |
| 安全防护 | DOMPurify + rehype-sanitize | — |

---

## 项目结构

```
MdEditor/
├── apps/
│   └── markdown-editor/          # 主应用（Electron 桌面应用）
│       ├── src/
│       │   ├── main/             # Electron 主进程
│       │   │   ├── index.ts      # 入口
│       │   │   ├── csp.ts        # 内容安全策略
│       │   │   ├── menu.ts       # 应用菜单
│       │   │   ├── window.ts     # 窗口管理
│       │   │   └── ipc/          # IPC 处理器（app / files / window）
│       │   ├── preload/          # Preload 桥接脚本
│       │   │   └── index.ts      # 通过 contextBridge 暴露 electronAPI
│       │   ├── renderer/         # React 渲染进程
│       │   │   ├── main.tsx      # React 入口
│       │   │   ├── App.tsx       # 根组件
│       │   │   ├── index.html
│       │   │   ├── components/   # UI 组件
│       │   │   │   ├── editor/   # 编辑器相关
│       │   │   │   ├── file-tree/
│       │   │   │   ├── layout/   # 主布局
│       │   │   │   ├── preview/  # 预览面板
│       │   │   │   ├── recent-files/
│       │   │   │   ├── settings/ # 设置面板
│       │   │   │   └── toc/      # 目录导航
│       │   │   ├── hooks/        # 自定义 Hooks
│       │   │   ├── stores/       # Zustand 状态库
│       │   │   ├── styles/       # CSS 样式
│       │   │   └── utils/        # 工具函数
│       │   └── test/             # 测试
│       │       ├── setup.ts      # Vitest 初始化 + electronAPI mock
│       │       ├── unit/         # 16 个单元测试文件
│       │       └── e2e/          # 6 个 Playwright 测试文件
│       ├── package.json
│       ├── vite.config.ts
│       ├── vitest.config.ts
│       ├── playwright.config.ts
│       └── tsconfig.json
├── packages/
│   ├── shared/                   # 共享类型与工具（@markdown-editor/shared）
│   │   └── src/
│   │       ├── types/index.ts    # FileTreeItem, EditorState, ElectronAPI 等
│   │       └── utils/index.ts    # debounce, formatFileSize, countWords 等
│   ├── tsconfig/                 # 共享 TypeScript 配置（@markdown-editor/tsconfig）
│   │   ├── base.json
│   │   ├── react.json
│   │   └── electron.json
│   └── eslint-config/            # 共享 ESLint 配置（@markdown-editor/eslint-config）
│       └── index.js
├── docs/
│   ├── plans/                    # 设计文档（PRD、技术架构、测试用例、实施计划）
│   └── project-management/       # 项目管理文档（进度、发布指南、总结等）
├── package.json                  # 根 Monorepo 配置
├── pnpm-workspace.yaml
├── turbo.json
└── AGENTS.md                     # 本文件
```

---

## 模块职责

### 主进程（`src/main/`）
- 运行在 Node.js 环境，拥有完整系统权限
- 负责窗口创建与管理、应用生命周期、文件系统代理、系统对话框
- 通过 `ipcMain.handle` 注册 IPC 处理器
- 自动编码检测使用 `jschardet` + `iconv-lite`

### Preload 桥接（`src/preload/`）
- 在渲染进程加载前执行
- 通过 `contextBridge.exposeInMainWorld('electronAPI', ...)` 暴露受控 API
- **严禁**直接暴露 Node.js API 或主进程模块
- IPC 通道按命名空间组织：`files:*`、`window:*`、`app:*`、`print:*`

### 渲染进程（`src/renderer/`）
- 运行在 Chromium 沙箱中
- React 函数组件 + Hooks 写法
- 所有文件操作通过 `window.electronAPI` 委托给主进程
- Zustand 管理全局状态（editorStore、fileStore、settingsStore、uiStore）

---

## 构建与运行命令

所有命令均在项目根目录执行，通过 Turborepo 编排子包任务。

### 根目录命令

```bash
# 安装依赖
pnpm install

# 启动开发环境（Vite HMR + Electron）
pnpm dev

# 生产构建（Vite 构建 renderer + main + preload）
pnpm build

# 类型检查
pnpm typecheck

# 代码检查
pnpm lint

# 运行全部测试（单元 + E2E）
pnpm test

# 仅运行单元测试
pnpm test:unit

# 仅运行 E2E 测试
pnpm test:e2e

# 清理构建产物与 node_modules
pnpm clean
```

### 应用专属命令（`apps/markdown-editor/` 目录内）

```bash
# 开发模式
pnpm dev

# 构建
pnpm build

# 直接启动 Electron（需先 build）
pnpm start

# 打包为安装包（electron-builder）
pnpm dist

# 仅打包目录（不生成安装包）
pnpm pack

# 单元测试（带 watch 模式）
pnpm test:unit
pnpm test:unit:watch
pnpm test:unit:coverage

# E2E 测试（带 UI 模式）
pnpm test:e2e
pnpm test:e2e:ui
```

### 构建产物路径
- `apps/markdown-editor/dist/` —— Vite 构建输出（main / preload / renderer）
- `apps/markdown-editor/release/` —— electron-builder 打包输出（安装包）

### 分发目标
- **macOS**: DMG、ZIP
- **Windows**: NSIS（支持自定义安装目录）、Portable
- **Linux**: AppImage、DEB

---

## 路径别名

Vite 与 TypeScript 中配置的统一别名：

| 别名 | 指向路径 |
|------|----------|
| `@` | `src/renderer` |
| `@main` | `src/main` |
| `@preload` | `src/preload` |
| `@shared` | `packages/shared/src` |

**注意**: Vitest 配置中 `@` 指向 `./src`（即 `apps/markdown-editor/src`），与 Vite 配置略有不同。在 renderer 测试代码中引用 `@/renderer/...` 时需注意实际解析路径。

---

## 代码风格规范

### TypeScript
- **strict 模式全开**（`noImplicitAny`、`strictNullChecks`、`strictFunctionTypes` 等全部启用）
- **禁止显式使用 `any`**（ESLint 规则 `@typescript-eslint/no-explicit-any: error`）
- 未使用的本地变量和参数会报错（`noUnusedLocals`、`noUnusedParameters`）
- 函数返回值必须完整（`noImplicitReturns`）
- 目标: ES2022，模块: ESNext，解析策略: bundler
- JSX: `react-jsx`（无需手动引入 React）

### ESLint 规则（`packages/eslint-config/index.js`）
- 继承: `eslint:recommended`、`@typescript-eslint/recommended`、`plugin:react-hooks/recommended`、`plugin:react/recommended`、`prettier`
- `react/react-in-jsx-scope: off`（使用 react-jsx 转换）
- `react/prop-types: off`（使用 TypeScript 类型替代）
- `@typescript-eslint/no-unused-vars: error`，但允许 `_` 前缀的参数
- `@typescript-eslint/explicit-function-return-type: off`

### React 组件规范
- 使用**函数组件**和 **Hooks**
- Props 接口需明确类型定义
- 状态管理优先使用 Zustand，局部状态使用 `useState` / `useReducer`

### Git 提交规范
建议使用以下前缀：
- `feat:` 新功能
- `fix:` 修复问题
- `docs:` 文档更新
- `style:` 代码格式调整（不影响逻辑）
- `refactor:` 重构
- `test:` 测试相关
- `chore:` 构建/工具链相关

提交前确保通过类型检查、lint 检查和测试。

---

## 测试策略

### 单元测试（Vitest）
- **框架**: Vitest v2 + jsdom 环境
- **React 测试库**: `@testing-library/react` + `@testing-library/jest-dom`
- **配置**: `apps/markdown-editor/vitest.config.ts`
- **setup 文件**: `src/test/setup.ts` —— 注册 jest-dom matchers，并 mock `window.electronAPI`
- **测试范围**: `src/**/*.{test,spec}.{ts,tsx}`，排除 `src/test/e2e/**/*`
- **覆盖范围**: 仅统计 `src/renderer/**/*.{ts,tsx}`，阈值 50%（statements / branches / functions / lines）
- **不覆盖**: `src/main/**`、`src/preload/**`、`src/test/e2e/**`

### E2E 测试（Playwright）
- **配置**: `apps/markdown-editor/playwright.config.ts`
- **测试目录**: `src/test/e2e/`
- **浏览器**: 仅 Desktop Chromium
- **Web Server**: 自动启动 `pnpm dev`（`http://localhost:5173`）
- **CI 行为**: retries=2, workers=1
- **报告**: HTML 报告，trace 在首次重试时收集

### 测试文件清单
- **单元测试（16 个）**: editor-component、encoding、filetree-component、integration、main-layout、markdown、markdown-advanced、performance、preview-component、recent-files、settings-component、statusbar-component、store、toc-component、toc-enhanced、toolbar-component
- **E2E 测试（6 个）**: basic、editor、file-operations、keyboard-shortcuts、settings、toc-recent

---

## 安全机制

项目采用纵深防御体系：

1. **Electron 层面**
   - `contextIsolation: true` —— Preload 脚本与页面隔离
   - `sandbox: true` —— 渲染进程沙箱化
   - `nodeIntegration: false` —— 禁止页面直接访问 Node.js
   - `contextBridge` —— 仅暴露最小化、受控的 API

2. **CSP（内容安全策略）**
   - 主进程通过 `setupCSP()` 配置严格的 Content-Security-Policy
   - 限制可加载的脚本、样式、图片资源来源

3. **HTML 净化**
   - `rehype-sanitize` —— Markdown 转 HTML 时过滤危险标签和属性
   - `DOMPurify` —— 二次净化最终渲染的 HTML

4. **文件系统安全**
   - 所有文件操作由主进程代理，渲染进程不直接持有文件路径的绝对控制权
   - IPC 通信基于 Promise 模式（`ipcRenderer.invoke` / `ipcMain.handle`）

---

## 已知限制

- **文件树右键菜单尚未实现**（上下文菜单：新建文件/文件夹、重命名、删除等）
- 无国际化（i18n）框架，UI 字符串全部为中文
- **无 CI/CD 配置**（没有 `.github/workflows`、Dockerfile 等），发布流程为本地手动构建

---

## 开发注意事项

1. **不要修改 `packageManager` 字段**: 根 `package.json` 固定使用 `pnpm@9.15.0`。
2. **新增 IPC 通道时**: 需在 `src/preload/index.ts` 中声明类型，在 `src/main/ipc/` 中实现处理器，并在 `packages/shared/src/types/index.ts` 的 `ElectronAPI` 接口中更新类型定义。
3. **引入新的 Node.js 内置模块到主进程**: 确保在 `vite.config.ts` 的 `rollupOptions.external` 中标记为 `external`。
4. **renderer 代码中禁止直接引入 `fs`、`path` 等 Node.js 模块** —— 必须通过 `window.electronAPI` 走 IPC。
5. **样式主题**: 使用 CSS 变量驱动，根元素 `data-theme` 属性切换 `light` / `dark`。
6. **编码处理**: 文件读写时主进程自动检测编码；保存时默认使用原文件编码，用户可在设置中调整。

---

## 关键配置文件速查

| 文件 | 作用 |
|------|------|
| `package.json`（根） | Monorepo 脚本、Turborepo 依赖 |
| `pnpm-workspace.yaml` | 定义 `apps/*` 和 `packages/*` 工作区 |
| `turbo.json` | 任务依赖图（build → ^build，test → build，dev 不缓存） |
| `apps/markdown-editor/package.json` | 应用脚本、electron-builder 配置、平台打包目标 |
| `apps/markdown-editor/vite.config.ts` | Vite + React + vite-plugin-electron 配置、路径别名、manual chunks |
| `apps/markdown-editor/vitest.config.ts` | Vitest + jsdom + 覆盖率阈值配置 |
| `apps/markdown-editor/playwright.config.ts` | E2E 测试配置（Chromium Desktop、本地 dev server） |
| `apps/markdown-editor/tsconfig.json` | 应用级 TS 配置（strict、path mapping） |
| `packages/tsconfig/base.json` | 共享 TS 基础配置 |
| `packages/eslint-config/index.js` | 共享 ESLint 规则 |

---

*本文件基于项目实际代码和配置生成。如有架构变更，请同步更新本文件。*
