# HTML 导出子项目 - 技术设计文档

## 📊 项目概述

| 属性 | 内容 |
|------|------|
| **包名** | `@markdown-editor/html-export` |
| **版本** | 0.1.0 |
| **类型** | 独立库包（无框架依赖） |
| **架构模式** | 模块化、可扩展、类型安全 |
| **设计原则** | SOLID、KISS、DRY |
| **创建日期** | 2026-05-15 |

---

## 🎨 架构设计

### 整体架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                         @markdown-editor/html-export              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐   ┌──────────────────┐   ┌─────────────┐ │
│  │   导出入口       │   │   模板系统       │   │   工具层    │ │
│  │ (index.ts)       │   │ (templateEngine) │   │  (utils)    │ │
│  └────────┬─────────┘   └────────┬─────────┘   └──────┬──────┘ │
│           │                      │                      │        │
│  ┌────────▼─────────┐   ┌──────▼────────┐   ┌────────▼──────┐ │
│  │  HTMLExporter    │   │  内置模板     │   │   变量处理    │ │
│  │  (exporter.ts)   │   │  (templates)  │   │  (variables)  │ │
│  └────────┬─────────┘   └───────────────┘   └───────────────┘ │
│           │                      │                      │        │
│  ┌────────▼─────────┐   ┌──────▼────────┐   ┌────────▼──────┐ │
│  │  类型定义        │   │  模板引擎     │   │  TOC 生成     │ │
│  │  (types.ts)     │   │  (engine)      │   │   (toc)       │ │
│  └─────────────────┘   └───────────────┘   └───────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────────┘
```

### 设计原则

1. **单一职责原则**
   - 每个类/函数只做一件事
   - 模板引擎只负责渲染
   - 导出器只负责导出流程

2. **开闭原则**
   - 对扩展开放（可添加新模板）
   - 对修改关闭（核心逻辑稳定）

3. **依赖倒置原则**
   - 依赖抽象（接口）而非具体实现

---

## 📁 详细文件设计

### 1. 入口文件 (`src/index.ts`)

```typescript
// 核心类
export { HTMLExporter } from './exporter';
export { TemplateEngine } from './templateEngine';

// 类型
export * from './types';

// 常量
export { DEFAULT_OPTIONS, BUILTIN_TEMPLATES } from './constants';

// 内置模板
export { defaultTemplates } from './templates';

// 工具
export { generateTOC, sanitizeHTML } from './utils';
```

---

### 2. 类型定义 (`src/types.ts`)

```typescript
import { z } from 'zod';

// ==========================================
// 模板选项
// ==========================================
export const TemplateOptionsSchema = z.object({
  theme: z.enum(['light', 'dark', 'custom']).default('light'),
  fontFamily: z.string().default('-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'),
  fontSize: z.number().min(12).max(32).default(16),
  lineHeight: z.number().min(1).max(3).default(1.6),
  maxWidth: z.string().default('800px'),
  showTOC: z.boolean().default(false),
  showPageNumbers: z.boolean().default(false),
  printOptimized: z.boolean().default(false),
  highlightTheme: z.string().default('github'),
  mathEnabled: z.boolean().default(true),
  customCSS: z.string().optional(),
});

export type TemplateOptions = z.infer<typeof TemplateOptionsSchema>;

// ==========================================
// 模板变量
// ==========================================
export interface TemplateVariables {
  title: string;
  content: string;
  date: string;
  author: string;
  toc: string;
  style: string;
}

// ==========================================
// 导出模板
// ==========================================
export interface ExportTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  defaultOptions: TemplateOptions;
  thumbnail?: string;
}

// ==========================================
// 导出配置
// ==========================================
export interface ExportConfig {
  templateId: string;
  options: Partial<TemplateOptions>;
  variables?: Partial<TemplateVariables>;
}

// ==========================================
// 导出结果
// ==========================================
export interface ExportResult {
  success: boolean;
  html: string;
  filename: string;
  warnings?: string[];
  errors?: string[];
}
```

---

### 3. 常量定义 (`src/constants.ts`)

```typescript
import { TemplateOptions, ExportTemplate } from './types';

// 默认选项
export const DEFAULT_OPTIONS: TemplateOptions = {
  theme: 'light',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontSize: 16,
  lineHeight: 1.6,
  maxWidth: '800px',
  showTOC: false,
  showPageNumbers: false,
  printOptimized: false,
  highlightTheme: 'github',
  mathEnabled: true,
};

// CDN 资源
export const CDN_RESOURCES = {
  highlightJS: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0',
  kaTeX: 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9',
};

// 高亮主题列表
export const HIGHLIGHT_THEMES = [
  'github',
  'atom-one-dark',
  'atom-one-light',
  'monokai',
  'sublime',
  'dracula',
];

// 字体选项
export const FONT_FAMILIES = [
  { id: 'system', name: '系统默认', value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  { id: 'serif', name: '衬线字体', value: 'Georgia, "Times New Roman", serif' },
  { id: 'mono', name: '等宽字体', value: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace' },
];
```

---

### 4. 模板引擎 (`src/templateEngine.ts`)

```typescript
import { TemplateVariables, TemplateOptions } from './types';
import { mergeOptions, generateCSS } from './utils';

export class TemplateEngine {
  // 变量替换
  static renderVariables(template: string, variables: TemplateVariables): string {
    let result = template;
    
    // 简单变量替换 {{variable}}
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      result = result.replace(regex, String(value));
    });
    
    return result;
  }

  // 条件渲染 {{if condition}} ... {{/if}}
  static renderConditionals(template: string, options: TemplateOptions): string {
    let result = template;
    
    // 查找所有 {{if ...}} 块
    const ifRegex = /\{\{if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g;
    
    return result.replace(ifRegex, (_, condition, content) => {
      // 获取条件值
      const conditionValue = (options as any)[condition];
      
      // 布尔值判断
      if (typeof conditionValue === 'boolean') {
        return conditionValue ? content : '';
      }
      
      // 存在性判断
      return conditionValue ? content : '';
    });
  }

  // 样式注入
  static injectStyles(template: string, options: TemplateOptions): string {
    const css = generateCSS(options);
    return template.replace('{{style}}', `<style>${css}</style>`);
  }

  // 选项变量替换
  static renderOptions(template: string, options: TemplateOptions): string {
    let result = template;
    
    Object.entries(options).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      result = result.replace(regex, String(value));
    });
    
    return result;
  }

  // 完整渲染流程
  static renderFull(
    template: string,
    variables: TemplateVariables,
    options: TemplateOptions
  ): string {
    let result = template;
    
    // 1. 条件渲染
    result = this.renderConditionals(result, options);
    
    // 2. 选项变量替换
    result = this.renderOptions(result, options);
    
    // 3. 样式注入
    result = this.injectStyles(result, options);
    
    // 4. 内容变量替换
    result = this.renderVariables(result, variables);
    
    return result;
  }
}
```

---

### 5. 导出器 (`src/exporter.ts`)

```typescript
import { 
  ExportTemplate, 
  ExportConfig, 
  ExportResult, 
  TemplateVariables,
  TemplateOptions 
} from './types';
import { TemplateEngine } from './templateEngine';
import { DEFAULT_OPTIONS } from './constants';
import { generateTOC, mergeOptions, sanitizeHTML, generateFilename } from './utils';
// 注意：Markdown 渲染由主应用提供，这里只负责导出
// 导出器接受渲染后的 HTML，或提供可选的渲染集成

export class HTMLExporter {
  private templates: Map<string, ExportTemplate>;

  constructor(templates: ExportTemplate[] = []) {
    this.templates = new Map();
    templates.forEach(tpl => this.registerTemplate(tpl));
  }

  // 注册模板
  registerTemplate(template: ExportTemplate): void {
    this.templates.set(template.id, template);
  }

  // 获取所有模板
  getTemplates(): ExportTemplate[] {
    return Array.from(this.templates.values());
  }

  // 获取特定模板
  getTemplate(id: string): ExportTemplate | undefined {
    return this.templates.get(id);
  }

  // 获取默认选项
  getDefaultOptions(templateId: string): TemplateOptions | undefined {
    const template = this.templates.get(templateId);
    return template?.defaultOptions;
  }

  // 导出 HTML
  async export(
    renderedHTML: string,
    config: ExportConfig,
    extraVariables: Partial<TemplateVariables> = {}
  ): Promise<ExportResult> {
    const warnings: string[] = [];
    const errors: string[] = [];
    
    try {
      // 1. 查找模板
      const template = this.templates.get(config.templateId);
      if (!template) {
        return {
          success: false,
          html: '',
          filename: '',
          errors: [`Template ${config.templateId} not found`],
        };
      }

      // 2. 合并选项
      const options = mergeOptions(template.defaultOptions, config.options);

      // 3. 生成 TOC（如果需要）
      let tocHtml = '';
      if (options.showTOC) {
        tocHtml = generateTOC(renderedHTML);
      }

      // 4. 构建完整变量
      const variables: TemplateVariables = {
        title: extraVariables.title || 'Document',
        content: sanitizeHTML(renderedHTML),
        date: new Date().toLocaleDateString(),
        author: extraVariables.author || '',
        toc: tocHtml,
        style: '', // will be injected by TemplateEngine
      };

      // 5. 渲染模板
      const html = TemplateEngine.renderFull(
        template.template,
        variables,
        options
      );

      // 6. 生成文件名
      const filename = generateFilename(variables.title);

      return {
        success: true,
        html,
        filename,
        warnings,
      };
    } catch (error) {
      return {
        success: false,
        html: '',
        filename: '',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  // 下载文件
  download(html: string, filename: string): void {
    if (typeof window === 'undefined') {
      throw new Error('Download only available in browser');
    }

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
  }

  // 预览（打开新窗口）
  preview(html: string): void {
    if (typeof window === 'undefined') {
      throw new Error('Preview only available in browser');
    }

    const previewWindow = window.open('', '_blank', 'width=1024,height=768');
    if (previewWindow) {
      previewWindow.document.write(html);
      previewWindow.document.close();
    }
  }
}
```

---

### 6. 工具函数 (`src/utils/index.ts`)

```typescript
import { TemplateOptions } from '../types';
import { DEFAULT_OPTIONS } from '../constants';

// ==========================================
// 选项合并
// ==========================================
export function mergeOptions(
  defaults: TemplateOptions,
  overrides: Partial<TemplateOptions>
): TemplateOptions {
  return { ...defaults, ...overrides };
}

// ==========================================
// CSS 生成
// ==========================================
export function generateCSS(options: TemplateOptions): string {
  const isDark = options.theme === 'dark';
  const textColor = isDark ? '#e0e0e0' : '#333';
  const bgColor = isDark ? '#1a1a1a' : '#fff';
  const borderColor = isDark ? '#444' : '#ddd';
  const codeBg = isDark ? '#2d2d2d' : '#f6f8fa';

  return `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    body {
      font-family: ${options.fontFamily};
      font-size: ${options.fontSize}px;
      line-height: ${options.lineHeight};
      color: ${textColor};
      background-color: ${bgColor};
      max-width: ${options.maxWidth};
      margin: 0 auto;
      padding: 40px 20px;
    }
    
    h1, h2, h3, h4, h5, h6 {
      margin-top: 1.5em;
      margin-bottom: 0.5em;
      font-weight: 600;
      color: ${isDark ? '#fff' : '#111'};
    }
    
    h1 { font-size: 2em; }
    h2 { font-size: 1.5em; }
    h3 { font-size: 1.25em; }
    
    p { margin: 1em 0; }
    
    a { color: ${isDark ? '#8ab4f8' : '#0366d6'}; text-decoration: none; }
    a:hover { text-decoration: underline; }
    
    code {
      font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
      font-size: 0.9em;
      background: ${codeBg};
      padding: 0.2em 0.4em;
      border-radius: 3px;
    }
    
    pre {
      background: ${codeBg};
      padding: 16px;
      border-radius: 6px;
      overflow-x: auto;
      margin: 1em 0;
    }
    
    pre code {
      background: none;
      padding: 0;
    }
    
    blockquote {
      border-left: 4px solid ${borderColor};
      padding-left: 16px;
      margin-left: 0;
      color: ${isDark ? '#aaa' : '#666'};
    }
    
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 1em 0;
    }
    
    th, td {
      border: 1px solid ${borderColor};
      padding: 8px 12px;
      text-align: left;
    }
    
    th { background: ${isDark ? '#333' : '#f6f8fa'}; }
    
    img { max-width: 100%; height: auto; }
    
    ul, ol { margin: 1em 0; padding-left: 2em; }
    
    ${options.printOptimized ? `
      @media print {
        body {
          max-width: 100%;
          padding: 20px;
        }
        h1, h2, h3 {
          page-break-after: avoid;
        }
      }
    ` : ''}
  `;
}

// ==========================================
// 目录生成
// ==========================================
export function generateTOC(html: string): string {
  const headings: { level: number; text: string; id: string }[] = [];
  
  // 简单的正则提取（实际项目可以用 DOMParser）
  const headingRegex = /<h(\d)[^>]*>(.*?)<\/h\1>/g;
  let match;
  
  while ((match = headingRegex.exec(html)) !== null) {
    const level = parseInt(match[1]);
    const text = match[2].replace(/<[^>]+>/g, ''); // 去除 HTML 标签
    const id = text.toLowerCase().replace(/\s+/g, '-');
    headings.push({ level, text, id });
  }
  
  if (headings.length === 0) {
    return '';
  }
  
  let toc = '<nav class="toc">\n';
  toc += '  <h2>目录</h2>\n';
  toc += '  <ul>\n';
  
  headings.forEach((heading) => {
    const indent = '  '.repeat(heading.level - 1);
    toc += `${indent}  <li><a href="#${heading.id}">${heading.text}</a></li>\n`;
  });
  
  toc += '  </ul>\n';
  toc += '</nav>\n';
  
  return toc;
}

// ==========================================
// HTML 安全清理
// ==========================================
export function sanitizeHTML(html: string): string {
  // 基础的安全清理（生产环境应使用 DOMPurify）
  const forbiddenTags = ['script', 'iframe', 'form', 'input', 'button'];
  
  let result = html;
  forbiddenTags.forEach((tag) => {
    const regex = new RegExp(`<${tag}[^>]*>.*?</${tag}>`, 'gi');
    result = result.replace(regex, '');
  });
  
  return result;
}

// ==========================================
// 文件名生成
// ==========================================
export function generateFilename(title: string): string {
  return `${title.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')}.html`;
}
```

---

### 7. 内置模板 (`src/templates/default.ts`)

```typescript
import { ExportTemplate } from '../types';
import { DEFAULT_OPTIONS } from '../constants';

export const DEFAULT_TEMPLATE: ExportTemplate = {
  id: 'default',
  name: 'Default',
  description: '默认模板，简洁美观，保持与当前编辑器一致的样式',
  
  template: `
<!DOCTYPE html>
<html lang="{{if showTOC}}{{/if}}zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{title}}</title>
  
  <!-- Highlight.js for code -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/{{highlightTheme}}.min.css">
  
  <!-- KaTeX for math -->
  {{if mathEnabled}}
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css">
  {{/if}}
  
  <!-- Custom Styles -->
  {{style}}
</head>
<body>
  <!-- Table of Contents -->
  {{if showTOC}}
    {{toc}}
  {{/if}}
  
  <!-- Main Content -->
  <main>
    {{content}}
  </main>
  
  <!-- Highlight.js init -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
  <script>hljs.highlightAll();</script>
  
  {{if mathEnabled}}
  <script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js"></script>
  {{/if}}
</body>
</html>
  `,
  
  defaultOptions: {
    ...DEFAULT_OPTIONS,
    showTOC: true,
  },
};
```

---

### 8. 模板注册 (`src/templates/index.ts`)

```typescript
import { ExportTemplate } from '../types';
import { DEFAULT_TEMPLATE } from './default';
import { MINIMAL_TEMPLATE } from './minimal';
import { DOCUMENTATION_TEMPLATE } from './documentation';
import { BLOG_TEMPLATE } from './blog';
import { PRINT_TEMPLATE } from './print';

export const defaultTemplates: ExportTemplate[] = [
  DEFAULT_TEMPLATE,
  MINIMAL_TEMPLATE,
  DOCUMENTATION_TEMPLATE,
  BLOG_TEMPLATE,
  PRINT_TEMPLATE,
];

// 导出单个模板
export { DEFAULT_TEMPLATE } from './default';
export { MINIMAL_TEMPLATE } from './minimal';
export { DOCUMENTATION_TEMPLATE } from './documentation';
export { BLOG_TEMPLATE } from './blog';
export { PRINT_TEMPLATE } from './print';
```

---

## 🎯 API 设计规范

### 1. 导出器 API (`HTMLExporter`)

```typescript
// 构造
new HTMLExporter(templates?: ExportTemplate[]): HTMLExporter

// 模板管理
registerTemplate(template: ExportTemplate): void
getTemplates(): ExportTemplate[]
getTemplate(id: string): ExportTemplate | undefined
getDefaultOptions(templateId: string): TemplateOptions | undefined

// 导出功能
export(renderedHTML: string, config: ExportConfig, extraVariables?: Partial<TemplateVariables>): Promise<ExportResult>
download(html: string, filename: string): void
preview(html: string): void
```

### 2. 模板引擎 API (`TemplateEngine`)

```typescript
// 静态方法
TemplateEngine.renderVariables(template: string, variables: TemplateVariables): string
TemplateEngine.renderConditionals(template: string, options: TemplateOptions): string
TemplateEngine.injectStyles(template: string, options: TemplateOptions): string
TemplateEngine.renderOptions(template: string, options: TemplateOptions): string
TemplateEngine.renderFull(template: string, variables: TemplateVariables, options: TemplateOptions): string
```

---

## 📦 依赖关系图

```
@markdown-editor/html-export
  │
  ├─ 生产依赖
  │   ├─ @markdown-editor/shared (workspace)
  │   └─ zod (^3.0.0)
  │
  └─ 开发依赖
      ├─ @markdown-editor/tsconfig (workspace)
      ├─ @markdown-editor/eslint-config (workspace)
      ├─ typescript (^6.0.0)
      └─ vitest (^2.0.0)
```

---

## 🔒 安全设计

### XSS 防护策略

| 层级 | 防护措施 |
|------|---------|
| **输入层** | HTML 清理、标签过滤 |
| **渲染层** | 变量自动转义 |
| **模板层** | 白名单标签、CDN 验证 |

### 资源加载策略

1. **CDN 可配置**
   - 默认使用 CDN
   - 支持内联资源
   - 支持自定义 CDN

2. **离线导出**
   - 可选完全内联
   - 无外部依赖
   - 自包含文件

---

## 🚀 性能优化策略

### 1. 模板渲染优化

- 避免重复 DOM 操作
- 使用高效的字符串替换
- 缓存常用模板

### 2. 懒加载策略

- 资源按需加载
- 条件性 CDN 引入

### 3. 代码分割

- 核心库独立
- 模板可按需加载
- 工具函数树摇

---

## 🧪 测试策略

### 单元测试覆盖

| 模块 | 测试目标 | 覆盖率目标 |
|------|---------|-----------|
| `templateEngine.ts` | 变量替换、条件渲染、样式注入 | > 90% |
| `exporter.ts` | 导出流程、下载、预览 | > 85% |
| `utils/` | 工具函数、CSS 生成 | > 90% |
| `templates/` | 所有内置模板 | > 80% |

### 测试类型

1. **功能测试**
   - 模板变量替换
   - 条件渲染
   - 导出流程

2. **快照测试**
   - 模板输出验证
   - CSS 生成验证

3. **安全测试**
   - XSS 注入尝试
   - 恶意脚本过滤

---

## 📝 代码规范

### 命名约定

| 类型 | 格式 | 示例 |
|------|------|------|
| 类 | `PascalCase` | `HTMLExporter`, `TemplateEngine` |
| 函数 | `camelCase` | `generateCSS`, `mergeOptions` |
| 常量 | `UPPER_SNAKE_CASE` | `DEFAULT_OPTIONS`, `CDN_RESOURCES` |
| 接口 | `PascalCase` | `ExportTemplate`, `TemplateOptions` |

### 文件结构

```
src/
├── index.ts           # 导出入口（无逻辑）
├── types.ts           # 类型定义
├── constants.ts       # 常量
├── templateEngine.ts  # 核心类
├── exporter.ts        # 导出器类
├── utils/
│   ├── index.ts       # 工具导出
│   ├── variables.ts   # 变量处理
│   ├── toc.ts         # TOC 生成
│   └── sanitizer.ts   # 安全清理
└── templates/
    ├── index.ts       # 模板导出
    ├── default.ts
    ├── minimal.ts
    └── ...
```

---

## 📚 参考文档

### 相关标准

- [CommonMark Spec](https://spec.commonmark.org/)
- [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/WCAG/)
- [Content Security Policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

### 相关技术

- [Zod](https://zod.dev/) - TypeScript 优先的验证库
- [Highlight.js](https://highlightjs.org/) - 代码高亮
- [KaTeX](https://katex.org/) - 数学公式渲染

---

## 🗓️ 演进计划

### v0.1.0 (当前版本)
- 核心模板引擎
- 5个内置模板
- 基础导出功能

### v0.2.0 (规划中)
- 自定义模板编辑器
- 模板导入/导出
- 社区模板库

### v0.3.0 (规划中)
- 更多导出格式
- PDF 直接导出
- 批处理功能

---

**文档版本**: 0.1.0
**最后更新**: 2026-05-15
**状态**: 📝 设计完成，待实现
