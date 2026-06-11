# 导出页面设置功能设计文档

## 1. 需求概述

为 Markdown 编辑器添加页面设置功能，用于设置导出 PDF/HTML 文件的页面参数：
- 纸张大小（预设尺寸 + 自定义）
- 页边距（上/下/左/右，支持统一设置）
- 字体设置（标题字体、正文字体、字号、行间距）

## 2. 设计方案

### 2.1 数据模型

```typescript
export interface PageMargins {
  top: number;      // 上边距
  right: number;    // 右边距
  bottom: number;   // 下边距
  left: number;     // 左边距
}

export interface FontSettings {
  titleFont: string;       // 标题字体（支持 Web Font URL）
  titleSize: number;       // 标题字号（px）
  bodyFont: string;        // 正文字体（支持 Web Font URL）
  bodySize: number;        // 正文字号（px）
  lineHeight: 'single' | '1.5x' | 'double' | 'custom';
  customLineHeight: number; // 自定义行间距倍数
}

export interface ExportPageSettings {
  paperSize: 'A4' | 'Letter' | 'Legal' | 'A3' | 'A5' | 'custom';
  customWidth: number;     // 自定义宽度（mm）
  customHeight: number;    // 自定义高度（mm）
  margins: PageMargins;
  marginUnit: 'mm' | 'cm' | 'inch';
  fonts: FontSettings;
}
```

### 2.2 组件结构

在 `Settings.tsx` 中新增"导出设置"Tab，包含三个区域：

| 区域 | 内容 |
|------|------|
| 页面大小 | 预设尺寸下拉 + 自定义宽高输入 |
| 页边距 | 上/下/左/右输入框 + 统一设置按钮 + 单位切换 |
| 字体设置 | 标题字体/字号 + 正文字体/字号 + 行间距选择 |

### 2.3 集成流程

1. 设置面板 → settingsStore → 持久化存储
2. 导出时 → ExportDialog 读取默认设置 → 可临时修改 → 传递给 exporter
3. exporter 根据设置生成 CSS（@page 规则、字体引用、行高）

### 2.4 默认值

| 参数 | 默认值 |
|------|--------|
| 纸张大小 | A4 |
| 页边距 | 15mm（四边一致） |
| 标题字体 | "Times New Roman" |
| 标题字号 | 24px |
| 正文字体 | "Times New Roman" |
| 正文字号 | 16px |
| 行间距 | 1.5x |

## 3. 技术实现

### 3.1 文件修改清单

| 文件路径 | 修改类型 | 说明 |
|----------|----------|------|
| `packages/shared/src/types/index.ts` | 新增 | 添加类型定义 |
| `src/renderer/stores/settingsStore.ts` | 修改 | 添加导出设置状态 |
| `src/renderer/components/settings/Settings.tsx` | 修改 | 新增"导出设置"Tab |
| `packages/html-export/src/types.ts` | 修改 | 添加导出设置类型 |
| `packages/html-export/src/exporter.ts` | 修改 | 根据设置生成样式 |
| `src/renderer/components/export/ExportDialog.tsx` | 修改 | 加载并传递设置 |

### 3.2 状态管理

使用 Zustand store 管理全局导出设置，并持久化到 localStorage。

### 3.3 导出流程

```
用户点击导出 → ExportDialog 读取设置 → 传递给 generateHTML() → 生成带样式的 HTML → 导出为 PDF/HTML
```

## 4. 安全考虑

- Web Font URL 需要进行安全验证，防止 XSS 攻击
- 自定义尺寸输入需要进行数值范围校验
- 使用 DOMPurify 净化生成的 HTML
