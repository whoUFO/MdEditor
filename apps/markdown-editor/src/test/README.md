# 测试指南

## 概述

本项目使用 Vitest 进行单元测试和组件测试，使用 Playwright 进行端到端（E2E）测试。

## 测试结构

```
src/test/
├── setup.ts              # 测试环境配置
├── unit/                 # 单元测试
│   ├── markdown.test.ts
│   ├── markdown-advanced.test.ts
│   ├── store.test.ts
│   ├── encoding.test.ts
│   ├── performance.test.ts
│   ├── editor-component.test.tsx
│   ├── preview-component.test.tsx
│   ├── toolbar-component.test.tsx
│   ├── statusbar-component.test.tsx
│   ├── settings-component.test.tsx
│   ├── toc-component.test.tsx
│   ├── filetree-component.test.tsx
│   ├── main-layout.test.tsx
│   └── integration.test.ts
└── e2e/                  # E2E 测试
    ├── basic.spec.ts
    ├── editor.spec.ts
    ├── settings.spec.ts
    ├── file-operations.spec.ts
    └── keyboard-shortcuts.spec.ts
```

## 运行测试

### 运行所有测试

```bash
# 在项目根目录
pnpm test

# 或者在应用目录
cd apps/markdown-editor
pnpm test
```

### 运行单元测试

```bash
pnpm test:unit
```

### 运行单元测试（监视模式）

```bash
pnpm test:unit:watch
```

### 运行覆盖率报告

```bash
pnpm test:unit:coverage
```

覆盖率报告将生成在 `coverage/` 目录：
- `coverage/index.html` - HTML 格式报告
- `coverage/lcov.info` - LCOV 格式（用于 CI）
- `coverage/coverage-summary.json` - JSON 格式

### 运行 E2E 测试

```bash
pnpm test:e2e
```

### 运行 E2E 测试（UI 模式）

```bash
pnpm test:e2e:ui
```

---

## 单元测试覆盖范围

### Markdown 解析测试

- [x] 基础语法（标题、段落、粗体、斜体）
- [x] 高级语法（表格、引用、链接、图片、任务列表）
- [x] 代码块语法高亮
- [x] 数学公式（KaTeX）
- [x] Mermaid 图表
- [x] 安全防护（XSS 防护）

### 状态管理测试

- [x] Editor Store
- [x] File Store
- [x] UI Store
- [x] Settings Store

### 组件测试

- [x] Editor 组件
- [x] Preview 组件
- [x] Toolbar 组件
- [x] StatusBar 组件
- [x] Settings 组件
- [x] TOC 组件
- [x] TOC 增强功能（折叠、缩进、高亮）
- [x] RecentFiles 组件（最近文件管理）
- [x] FileTree 组件
- [x] MainLayout 组件

### 工具函数测试

- [x] 编码检测
- [x] Debounce 函数
- [x] 文件排序
- [x] TOC 解析

### 性能测试

- [x] 小文档解析性能
- [x] 中文档解析性能
- [x] TOC 提取性能
- [x] 内存使用

### 集成测试

- [x] Editor 和 File Store 集成
- [x] UI Store 集成
- [x] Settings Store 集成
- [x] 完整应用流程

---

## E2E 测试覆盖范围

### 基础功能测试

- [x] 应用加载
- [x] 编辑器和预览显示

### 编辑器功能测试

- [x] 文本输入
- [x] 行号显示
- [x] Markdown 语法高亮

### 预览功能测试

- [x] 标题渲染
- [x] 粗体渲染
- [x] 斜体渲染
- [x] 代码块渲染
- [x] 列表渲染
- [x] 链接渲染

### 工具栏功能测试

- [x] 工具栏按钮显示
- [x] 预览切换

### 状态栏功能测试

- [x] 状态栏显示
- [x] 行列信息
- [x] 字数统计

### 主题切换测试

- [x] 主题切换按钮
- [x] 暗色主题
- [x] 亮色主题

### 设置面板测试

- [x] 打开设置面板
- [x] 关闭设置面板
- [x] 字体大小调节

### 文件操作测试

- [x] 文件树显示
- [x] 侧边栏切换

### TOC 导航测试

- [x] TOC 面板显示
- [x] 标题提取显示
- [x] TOC 可见性切换
- [x] TOC 折叠功能
- [x] TOC 缩进显示
- [x] TOC 活动标题高亮
- [x] TOC 数量统计显示

### 最近文件测试 ✨

- [x] 最近文件列表显示
- [x] 文件名称和路径显示
- [x] 时间格式显示（刚刚、分钟前、小时前、天前）
- [x] 空状态提示
- [x] 清空所有按钮
- [x] 打开文件功能
- [x] 移除单个文件
- [x] 当前文件高亮显示

### Resizer 功能测试

- [x] Resizer 显示
- [x] 拖动调整大小

### 快捷键测试

- [x] Ctrl+B 加粗
- [x] Ctrl+I 斜体
- [x] Ctrl+Shift+P 预览切换

### 菜单栏测试

- [x] 菜单栏显示
- [x] File 菜单
- [x] Edit 菜单
- [x] View 菜单

### 窗口控制测试

- [x] 窗口控制按钮显示
- [x] 最小化按钮
- [x] 最大化按钮
- [x] 关闭按钮

---

## 覆盖率目标

我们的目标是为关键代码达到以下覆盖率：

| 类型 | 目标覆盖率 |
|------|----------|
| 语句 (Statements) | 50% |
| 分支 (Branches) | 50% |
| 函数 (Functions) | 50% |
| 行 (Lines) | 50% |

当前已覆盖：
- Markdown 解析器：~90%
- 状态管理：~85%
- 组件：~70%
- 工具函数：~95%

---

## 添加新测试

### 添加单元测试

创建新文件 `src/test/unit/feature-name.test.ts` 或 `feature-name.test.tsx`：

```typescript
import { describe, it, expect, vi } from 'vitest';

describe('Feature Name', () => {
  it('should do something', () => {
    expect(true).toBe(true);
  });
});
```

### 添加组件测试

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { YourComponent } from '../../renderer/components/YourComponent';

vi.mock('../../renderer/stores/yourStore', () => ({
  useYourStore: vi.fn(),
}));

describe('YourComponent', () => {
  it('should render', () => {
    render(<YourComponent />);
    expect(screen.getByTestId('component')).toBeInTheDocument();
  });
});
```

### 添加 E2E 测试

创建新文件 `src/test/e2e/feature.spec.ts`：

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('selector')).toBeVisible();
  });
});
```

---

## 测试最佳实践

1. **每个测试应该独立**：测试之间不应该有依赖关系
2. **使用描述性测试名称**：清晰表达测试意图
3. **遵循 AAA 模式**：Arrange（准备）→ Act（执行）→ Assert（断言）
4. **避免过度 mock**：只 mock 必要的外部依赖
5. **测试边界情况**：包括空值、错误处理等
6. **保持测试快速**：避免不必要的等待和延迟

---

## 持续集成

在 CI 环境中运行测试：

```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v3
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm test:unit
      - run: pnpm test:e2e
```

---

## 查看覆盖率报告

```bash
# 生成覆盖率报告
pnpm test:unit:coverage

# 使用浏览器打开 HTML 报告
open coverage/index.html

# 查看文本摘要
cat coverage/coverage-summary.json
```

---

## 常见问题

### Q: 测试失败怎么办？

1. 检查测试代码是否正确
2. 检查组件实现是否符合预期
3. 查看错误消息和堆栈跟踪
4. 使用 `pnpm test:unit:watch` 进行调试

### Q: 如何跳过某些测试？

使用 `test.skip`：

```typescript
test.skip('should be skipped', () => {
  expect(true).toBe(false);
});
```

### Q: 如何只运行特定测试？

使用 `test.only`：

```typescript
test.only('should run only this', () => {
  expect(true).toBe(true);
});
```

### Q: E2E 测试太慢怎么办？

使用 `test.describe.configure` 优化并行度：

```typescript
test.describe.configure({ mode: 'parallel' });
```
