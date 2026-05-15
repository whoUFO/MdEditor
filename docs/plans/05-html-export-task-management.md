# HTML 导出子项目 - 任务管理文档

## 📊 子项目概览

| 项目信息 | 内容 |
|---------|------|
| **包名** | `@markdown-editor/html-export` |
| **版本** | 0.1.0 |
| **类型** | 独立库包 |
| **定位** | 模板化 Markdown 到 HTML 导出引擎 |
| **创建日期** | 2026-05-15 |
| **负责人** | FE Agent |

---

## 🎯 项目目标

### 核心目标
1. ✅ 将 HTML 导出功能独立为可复用的库
2. ✅ 实现完整的模板系统
3. ✅ 提供多个预设模板
4. ✅ 支持用户自定义模板

### 技术目标
- 无框架依赖（可单独使用）
- 完整的 TypeScript 支持
- 高性能渲染
- 完整测试覆盖

---

## 📁 子项目结构

```
packages/html-export/
├── package.json
├── tsconfig.json
├── README.md
├── src/
│   ├── index.ts                 # 导出入口
│   ├── types.ts                 # 类型定义
│   ├── constants.ts             # 常量定义
│   ├── templateEngine.ts        # 模板引擎核心
│   ├── exporter.ts              # 导出器
│   ├── templates/               # 内置模板
│   │   ├── default.ts
│   │   ├── minimal.ts
│   │   ├── documentation.ts
│   │   ├── blog.ts
│   │   └── print.ts
│   └── utils/
│       ├── variables.ts         # 变量处理器
│       ├── toc.ts              # TOC 生成
│       └── sanitizer.ts        # 安全清理
└── tests/
    ├── templateEngine.test.ts
    ├── exporter.test.ts
    └── templates.test.ts
```

---

## 📋 详细任务列表

### Phase 1: 项目初始化 (P0 - 高优先级)

| 序号 | 任务 | 描述 | 负责人 | 预计时间 | 状态 |
|------|------|------|--------|---------|------|
| 1.1 | 创建项目目录 | 建立 `packages/html-export/` 目录结构 | FE Agent | 5m | ⏳ |
| 1.2 | 配置 package.json | 依赖、脚本、元数据 | FE Agent | 15m | ⏳ |
| 1.3 | 配置 tsconfig.json | TypeScript 配置 | FE Agent | 10m | ⏳ |
| 1.4 | 配置 eslint | 代码规范配置 | FE Agent | 10m | ⏳ |
| 1.5 | 配置 vitest | 测试框架配置 | FE Agent | 15m | ⏳ |
| 1.6 | 更新 turbo.json | 添加新包到 Turborepo | FE Agent | 10m | ⏳ |
| 1.7 | 安装依赖 | pnpm install | FE Agent | 10m | ⏳ |
| 1.8 | 创建基础文件 | index.ts, types.ts, constants.ts | FE Agent | 20m | ⏳ |

**Phase 1 总计**: ~ 1.5 小时

---

### Phase 2: 核心引擎 (P0 - 高优先级)

| 序号 | 任务 | 描述 | 负责人 | 预计时间 | 状态 |
|------|------|------|--------|---------|------|
| 2.1 | 类型定义 | `types.ts` 完整类型系统 | FE Agent | 30m | ⏳ |
| 2.2 | 常量定义 | `constants.ts` 内置常量 | FE Agent | 20m | ⏳ |
| 2.3 | 模板引擎核心 | `templateEngine.ts` - 变量替换 | FE Agent | 45m | ⏳ |
| 2.4 | 条件渲染 | 支持 {{if}} {{/if}} 语法 | FE Agent | 30m | ⏳ |
| 2.5 | 样式注入 | 动态样式注入系统 | FE Agent | 30m | ⏳ |
| 2.6 | 工具函数 | 变量、TOC、安全清理工具 | FE Agent | 40m | ⏳ |
| 2.7 | 引擎测试 | 模板引擎单元测试 | QA Agent | 45m | ⏳ |

**Phase 2 总计**: ~ 4 小时

---

### Phase 3: 内置模板库 (P1 - 中优先级)

| 序号 | 任务 | 描述 | 负责人 | 预计时间 | 状态 |
|------|------|------|--------|---------|------|
| 3.1 | Default 模板 | 当前样式，保持兼容 | FE Agent | 40m | ⏳ |
| 3.2 | Minimal 模板 | 极简风格，快速分享 | FE Agent | 30m | ⏳ |
| 3.3 | Documentation 模板 | 专业文档风格 | FE Agent | 40m | ⏳ |
| 3.4 | Blog 模板 | 博客风格，响应式 | FE Agent | 40m | ⏳ |
| 3.5 | Print 模板 | 打印优化，分页支持 | FE Agent | 30m | ⏳ |
| 3.6 | 模板注册 | 统一导出和注册 | FE Agent | 20m | ⏳ |
| 3.7 | 模板测试 | 所有模板的测试 | QA Agent | 45m | ⏳ |

**Phase 3 总计**: ~ 4 小时

---

### Phase 4: 导出器 (P1 - 中优先级)

| 序号 | 任务 | 描述 | 负责人 | 预计时间 | 状态 |
|------|------|------|--------|---------|------|
| 4.1 | HTMLExporter 类 | 导出器核心类 | FE Agent | 50m | ⏳ |
| 4.2 | 导出方法 | `export()` Markdown 转 HTML | FE Agent | 30m | ⏳ |
| 4.3 | 下载功能 | Blob + URL.createObjectURL | FE Agent | 25m | ⏳ |
| 4.4 | 预览功能 | 预览渲染 | FE Agent | 30m | ⏳ |
| 4.5 | 导出器测试 | 完整功能测试 | QA Agent | 50m | ⏳ |

**Phase 4 总计**: ~ 3.5 小时

---

### Phase 5: UI 组件集成 (P2 - 中优先级)

| 序号 | 任务 | 描述 | 负责人 | 预计时间 | 状态 |
|------|------|------|--------|---------|------|
| 5.1 | TemplateSelector | 模板选择器组件 | FE Agent | 50m | ⏳ |
| 5.2 | ExportDialog | 导出设置对话框 | FE Agent | 60m | ⏳ |
| 5.3 | TemplatePreview | 模板预览组件 | FE Agent | 40m | ⏳ |
| 5.4 | StyleCustomizer | 样式定制器 | FE Agent | 60m | ⏳ |
| 5.5 | 集成到主应用 | 导入并使用库 | FE Agent | 45m | ⏳ |
| 5.6 | UI 测试 | 组件测试 | QA Agent | 50m | ⏳ |

**Phase 5 总计**: ~ 5 小时

---

## 🎨 技术设计详情

### 类型系统设计

```typescript
// src/types.ts

// 模板定义
export interface ExportTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  defaultOptions: TemplateOptions;
  thumbnail?: string;
}

// 模板选项
export interface TemplateOptions {
  theme: 'light' | 'dark' | 'custom';
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  maxWidth: string;
  showTOC: boolean;
  showPageNumbers: boolean;
  printOptimized: boolean;
  highlightTheme: string;
  mathEnabled: boolean;
  customCSS?: string;
}

// 模板变量
export interface TemplateVariables {
  title: string;
  content: string;
  date: string;
  author: string;
  toc: string;
  style: string;
}

// 导出配置
export interface ExportConfig {
  templateId: string;
  options: Partial<TemplateOptions>;
  variables?: Partial<TemplateVariables>;
}
```

### 模板引擎 API

```typescript
// src/templateEngine.ts
export class TemplateEngine {
  // 变量替换
  static render(template: string, variables: TemplateVariables): string;
  
  // 条件渲染
  static renderConditionals(template: string, options: TemplateOptions): string;
  
  // 样式注入
  static injectStyles(template: string, options: TemplateOptions): string;
  
  // 完整渲染
  static renderFull(template: string, variables: TemplateVariables, options: TemplateOptions): string;
}
```

### 导出器 API

```typescript
// src/exporter.ts
export class HTMLExporter {
  constructor(templates: ExportTemplate[]);
  
  // 注册模板
  registerTemplate(template: ExportTemplate): void;
  
  // 获取可用模板
  getTemplates(): ExportTemplate[];
  
  // 获取默认选项
  getDefaultOptions(templateId: string): TemplateOptions | undefined;
  
  // 导出 HTML
  async export(markdown: string, config: ExportConfig): Promise<string>;
  
  // 下载文件
  download(html: string, filename: string): void;
  
  // 预览
  preview(html: string): void;
}
```

---

## 🔧 模板语法规范

### 变量语法

```html
<!-- 简单变量 -->
<h1>{{title}}</h1>
<article>{{content}}</article>

<!-- 条件变量 -->
{{if showTOC}}
  <nav>{{toc}}</nav>
{{/if}}

<!-- 选项引用 -->
<style>
  body {
    font-family: {{fontFamily}};
    font-size: {{fontSize}}px;
    line-height: {{lineHeight}};
  }
</style>
```

### 内置变量

| 变量名 | 描述 |
|--------|------|
| `{{title}}` | 文档标题 |
| `{{content}}` | Markdown 渲染的 HTML |
| `{{date}}` | 当前日期 |
| `{{author}}` | 作者（可选） |
| `{{toc}}` | 目录 HTML |
| `{{style}}` | 动态生成的样式 |

### 内置选项变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `{{theme}}` | `light` | 主题色 |
| `{{fontFamily}}` | 系统字体 | 字体族 |
| `{{fontSize}}` | `16` | 字体大小 |
| `{{lineHeight}}` | `1.6` | 行高 |
| `{{maxWidth}}` | `800px` | 最大宽度 |
| `{{showTOC}}` | `false` | 显示目录 |
| `{{printOptimized}}` | `false` | 打印优化 |

---

## 📦 依赖规划

### 生产依赖

| 包名 | 用途 | 版本 |
|------|------|------|
| `@markdown-editor/shared` | 共享类型与工具 | `workspace:*` |
| `zod` | 运行时验证 | `^3.0.0` |

### 开发依赖

| 包名 | 用途 | 版本 |
|------|------|------|
| `@markdown-editor/tsconfig` | TS 配置 | `workspace:*` |
| `@markdown-editor/eslint-config` | ESLint 配置 | `workspace:*` |
| `typescript` | 类型检查 | `^6.0.0` |
| `vitest` | 单元测试 | `^2.0.0` |
| `@vitest/coverage-v8` | 覆盖率 | `^2.0.0` |

---

## 🧪 测试计划

### 测试覆盖目标
- **单元测试**: > 85%
- **集成测试**: 主要流程
- **快照测试**: 模板输出

### 测试文件

| 测试文件 | 覆盖内容 |
|---------|---------|
| `templateEngine.test.ts` | 模板引擎功能 |
| `exporter.test.ts` | 导出器完整流程 |
| `templates.test.ts` | 所有内置模板 |
| `utils.test.ts` | 工具函数 |

---

## 📅 时间线与里程碑

### 总预计时间
- **Phase 1-2 (核心)**: 1 天
- **Phase 3-4 (完整)**: 1 天
- **Phase 5 (UI)**: 1 天
- **总计**: ~ 3 天

### 里程碑
- **M1 (Day 1 结束)**: 核心引擎 + Default 模板
- **M2 (Day 2 结束)**: 所有模板 + 完整导出器
- **M3 (Day 3 结束)**: UI 集成 + 完整测试

---

## 🔗 与主应用集成

### 1. 主应用依赖

```json
{
  "dependencies": {
    "@markdown-editor/html-export": "workspace:*"
  }
}
```

### 2. 使用示例

```typescript
import { HTMLExporter, defaultTemplates } from '@markdown-editor/html-export';

const exporter = new HTMLExporter(defaultTemplates);

// 导出
const html = await exporter.export(markdown, {
  templateId: 'documentation',
  options: {
    theme: 'light',
    showTOC: true,
    printOptimized: false
  }
});

// 下载
exporter.download(html, 'document.html');
```

### 3. UI 组件

```tsx
import { TemplateSelector, ExportDialog } from '@markdown-editor/html-export/react';

function App() {
  return (
    <ExportDialog
      templates={exporter.getTemplates()}
      onExport={handleExport}
    />
  );
}
```

---

## 🔒 安全考虑

### XSS 防护
- 所有用户输入转义
- 自定义模板安全验证
- CSS 白名单过滤

### 资源管理
- CDN 资源可配置
- 支持内联资源
- 离线导出选项

---

## 📊 检查清单

### 发布前检查
- [ ] 所有任务完成
- [ ] 测试覆盖率达标
- [ ] 文档完善
- [ ] 代码规范检查通过
- [ ] 性能达标
- [ ] 安全审计通过
- [ ] 集成测试通过

---

## 📝 变更记录

| 版本 | 日期 | 变更内容 |
|------|------|---------|
| 0.1.0 | 2026-05-15 | 初始版本，任务规划创建 |

---

**文档状态**: 📝 规划中，待执行
