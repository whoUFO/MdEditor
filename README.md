# Electron Markdown Editor - 发布说明

## 版本信息

| 项目 | 内容 |
|------|------|
| 版本号 | v0.2.0 |
| 发布日期 | 2026-05-13 |
| 开发者 | 胡宇峰 |
| 联系方式 | hyf2k@163.com |

---

## 下载地址

### 当前版本

| 平台 | 下载链接 | 文件大小 |
|------|---------|---------|
| Windows | [MarkdownEditor-0.2.0-win.zip]() | ~120MB |
| macOS | [MarkdownEditor-0.2.0-mac.dmg]() | ~130MB |
| Linux | [MarkdownEditor-0.2.0-linux.AppImage]() | ~110MB |

### 历史版本

- [v0.1.0]()
- [v0.2.0]()

---

## 新功能

### v0.2.0 更新

#### 核心功能
- ✅ **文件树** - 递归渲染、展开/折叠、点击打开
- ✅ **Resizer 拖动** - 分栏比例可自由调整
- ✅ **设置面板** - 用户偏好设置管理
- ✅ **主题切换** - 明暗主题切换

#### 安全特性
- ✅ **CSP 安全策略** - 内容安全策略防护
- ✅ **进程隔离** - Electron 安全隔离模式

#### 工程化
- ✅ **单元测试** - Vitest 测试框架
- ✅ **E2E 测试** - Playwright 测试框架
- ✅ **类型检查** - TypeScript 完整类型支持
- ✅ **代码规范** - ESLint 代码检查

#### 主进程重构
- ✅ **模块化结构** - 清晰的代码组织
- ✅ **IPC 模块化** - 文件、窗口、应用 IPC 分离

---

## 功能特性

### 编辑器
- **CodeMirror 6** - 现代化编辑器
- **Markdown 语法高亮** - 标题、列表、代码块等
- **实时预览** - 边写边看效果
- **数学公式** - KaTeX 支持 `$E=mc^2$`
- **Mermaid 图表** - 流程图、时序图

### 文件管理
- **打开/保存** - 快速打开和保存文件
- **编码检测** - 自动识别 GBK/UTF-8
- **文件树** - 目录浏览和文件选择
- **最近文件** - 快速访问历史文件

### 导出功能
- **HTML 导出** - 生成独立 HTML 文件
- **PDF 导出** - 打印为 PDF 文档

### 界面定制
- **主题切换** - 亮色/暗色模式
- **分栏调整** - 拖动调整编辑器和预览比例
- **侧边栏** - 文件树和目录导航

### 快捷键
| 快捷键 | 功能 |
|--------|------|
| `Ctrl+O` | 打开文件 |
| `Ctrl+S` | 保存文件 |
| `Ctrl+Shift+S` | 另存为 |
| `Ctrl+B` | 加粗 |
| `Ctrl+I` | 斜体 |
| `Ctrl+K` | 行内代码 |
| `Ctrl+Shift+P` | 切换预览 |
| `Ctrl+1-6` | 插入标题 |
| `Ctrl+Q` | 退出应用 |

---

## 系统要求

### Windows
- Windows 10 或更高版本
- 64 位处理器
- 4GB RAM
- 500MB 可用磁盘空间

### macOS
- macOS 10.15 (Catalina) 或更高版本
- Apple Silicon 或 Intel 处理器
- 4GB RAM
- 500MB 可用磁盘空间

### Linux
- Ubuntu 18.04 或更高版本
- 64 位处理器
- 4GB RAM
- 500MB 可用磁盘空间

---

## 安装指南

### Windows

1. 下载 `MarkdownEditor-0.2.0-win.zip`
2. 解压到指定目录
3. 运行 `Markdown Editor.exe`
4. （可选）创建桌面快捷方式

### macOS

1. 下载 `MarkdownEditor-0.2.0-mac.dmg`
2. 双击打开 DMG 文件
3. 将应用拖到 Applications 文件夹
4. 从启动台启动应用

### Linux

1. 下载 `MarkdownEditor-0.2.0-linux.AppImage`
2. 设置执行权限：`chmod +x MarkdownEditor-0.2.0-linux.AppImage`
3. 双击运行或终端执行

---

## 使用教程

### 快速开始

1. **打开应用** - 启动 Markdown Editor
2. **创建文档** - 开始输入 Markdown 内容
3. **实时预览** - 右侧实时查看渲染效果
4. **保存文件** - 使用 `Ctrl+S` 保存

### 常用功能

#### 插入格式
1. 选中要格式化的文本
2. 使用工具栏按钮或快捷键
3. 例如：选中文本 → 按 `Ctrl+B` → 加粗

#### 导出文档
1. 点击工具栏导出按钮
2. 选择导出格式（HTML/PDF）
3. 选择保存位置

#### 文件树
1. 点击左侧"文件"标签
2. 浏览目录结构
3. 点击文件名打开文件

---

## 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 桌面框架 | Electron | ^41.0.0 |
| 前端框架 | React | ^19.0.0 |
| 类型系统 | TypeScript | ^6.0.0 |
| 编辑器 | CodeMirror | ^6.0.0 |
| 状态管理 | Zustand | ^4.0.0 |
| Markdown | unified/remark/rehype | ^11.0.0 |
| 数学公式 | KaTeX | ^0.16.0 |
| 图表 | Mermaid | ^10.0.0 |
| 代码高亮 | highlight.js | ^11.0.0 |
| 构建工具 | Turborepo + pnpm | - |

---

## 项目结构

```
electron-markdown-editor/
├── apps/
│   └── markdown-editor/      # 主应用
│       ├── src/
│       │   ├── main/         # Electron 主进程
│       │   ├── preload/      # 预加载脚本
│       │   └── renderer/     # React 渲染进程
│       └── package.json
├── packages/
│   ├── shared/               # 共享代码
│   ├── eslint-config/        # ESLint 配置
│   └── tsconfig/             # TypeScript 配置
├── docs/                     # 项目文档
├── turbo.json               # Turborepo 配置
└── package.json             # 根包配置
```

---

## 开发指南

### 环境要求
- Node.js 20.x
- pnpm 9.x
- Git

### 安装依赖
```bash
pnpm install
```

### 开发模式
```bash
pnpm dev
```

### 构建应用
```bash
pnpm build
pnpm dist
```

### 运行测试
```bash
pnpm test          # 所有测试
pnpm test:unit     # 单元测试
pnpm test:e2e      # E2E 测试
```

---

## 常见问题

### Q: macOS 无法打开应用？
**A**: 在 macOS 上，首次打开可能需要授权。进入"系统偏好设置 → 安全性与隐私 → 通用"，点击"仍要打开"。

### Q: 如何导出为 PDF？
**A**: 点击工具栏右侧的"导出 PDF"按钮，或使用菜单"文件 → 导出为 PDF"。

### Q: 支持哪些 Markdown 语法？
**A**: 支持 GitHub Flavored Markdown (GFM)，包括表格、任务列表、代码块等。

### Q: 如何使用数学公式？
**A**: 行内公式使用 `$公式$`，块级公式使用 `$$公式$$`。

### Q: Mermaid 图表怎么写？
**A**: 使用代码块，标记语言为 `mermaid`，例如：
~~~markdown
```mermaid
graph TD
    A[开始] --> B[结束]
```
~~~

---

## 更新日志

### v0.2.0 (2026-05-13)
- 添加文件树功能（递归渲染）
- 添加 Resizer 拖动功能
- 添加设置面板
- 完善主题切换
- 添加 CSP 安全策略
- 重构主进程为模块化结构
- 添加 Vitest + Playwright 测试框架

### v0.1.0 (2026-05-11)
- 初始版本发布
- 核心编辑器功能
- Markdown 实时预览
- 文件打开/保存
- 导出 HTML/PDF
- 工具栏格式化
- 快捷键支持
- 主题切换

---

## 许可证

本项目采用 MIT 许可证。

---

## 联系方式

- **开发者**: 胡宇峰
- **邮箱**: hyf2k@163.com
- **项目地址**: [GitHub Repository]()

---

**感谢使用 Markdown Editor！**
