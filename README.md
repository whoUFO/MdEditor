# Electron Markdown Editor

> 基于 Electron + React 的现代化 Markdown 编辑器，使用 Turborepo + pnpm 管理的 Monorepo 项目。

## 项目结构

```
├── apps/
│   └── markdown-editor/    # Electron 桌面应用
│       ├── src/
│       │   ├── main/       # Electron 主进程
│       │   ├── preload/    # Preload 桥接层
│       │   └── renderer/   # React 渲染进程
│       ├── docs/reports/   # 审查与测试报告
│       └── package.json
├── packages/
│   ├── shared/             # 共享类型与常量
│   ├── tsconfig/           # TypeScript 配置集
│   └── eslint-config/      # ESLint 配置集
├── docs/
│   ├── plans/              # 设计文档
│   └── project-management/ # 项目跟踪
└── package.json            # 根 monorepo 配置
```

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发环境（Electron + HMR）
pnpm dev

# TypeScript 类型检查
pnpm typecheck

# Lint
pnpm lint

# 生产构建
pnpm build
```

**详情请见：** [apps/markdown-editor/README.md](apps/markdown-editor/README.md)

## 技术栈

| 层 | 技术 |
|------|---------|
| 框架 | Electron 41 + React 19 |
| 语言 | TypeScript 6 (strict) |
| 构建 | Vite 8 + Turborepo 2.9 |
| 包管理 | pnpm 9.15 (workspace) |
| 编辑器 | CodeMirror 6 |
| Markdown | unified (remark + rehype) |
| 渲染增强 | KaTeX、Mermaid、highlight.js |
| 状态管理 | Zustand |
| 安全 | CSP + 沙箱 + DOMPurify |

## 功能特性

- **所见即所得** — 双栏实时预览，支持 300ms 自适应防抖
- **预览面板开关** — 支持一键打开/关闭预览面板，快捷键 Ctrl+Shift+P
- **文件管理** — 目录树浏览、文件打开/保存、编码自动检测 (GBK/Shift-JIS 等)
- **工具栏 + 快捷键** — 18+ 快捷键，支持加粗/标题/列表/引用等格式
- **富文本渲染** — 数学公式 (KaTeX)、图表 (Mermaid)、代码高亮 (10+ 语言)
- **自动目录** — 侧边栏 TOC，支持标题导航与光标同步高亮
- **滚动同步** — 段落级比例同步，编辑/预览联动
- **主题系统** — 明暗双主题，全局 CSS 变量驱动
- **导出** — HTML / PDF 导出，完整保留样式与图表
- **安全** — CSP + rehype-sanitize + iframe 沙箱 + contextIsolation

## 开发进度

当前版本 **v0.1.0**，全部 **84/84 任务完成**：

| 阶段 | 进度 | 交付物 |
|------|------|--------|
| M0 Monorepo 基础设施 | 100% | Turborepo + workspace 搭建 |
| P1 项目脚手架 | 100% | Electron + React 基础框架 |
| P2 核心编辑功能 | 100% | 编辑器 + 预览 + 文件管理闭环 |
| P3 增强功能 | 100% | 公式/图表/目录/导出/安全 |

## 报告

- [安全审查报告](docs/reports/security-review-p4.17.md)
- [代码审查报告](docs/reports/code-review-p4.18.md)
- [发布 Checklist](docs/reports/release-checklist.md)

## License

MIT

## 作者

**胡宇峰** - hyf2k@163.com
