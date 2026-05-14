# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: file-operations.spec.ts >> File Operations >> should toggle sidebar
- Location: src\test\e2e\file-operations.spec.ts:16:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('[data-testid="sidebar-toggle"]')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - button "打开文件 (Ctrl+O)" [ref=e6] [cursor=pointer]:
        - img [ref=e7]
      - button "保存 (Ctrl+S)" [ref=e9] [cursor=pointer]:
        - img [ref=e10]
      - button "另存为 (Ctrl+Shift+S)" [ref=e14] [cursor=pointer]:
        - img [ref=e15]
    - generic [ref=e20]:
      - button "粗体 (Ctrl+B)" [ref=e21] [cursor=pointer]:
        - img [ref=e22]
      - button "斜体 (Ctrl+I)" [ref=e25] [cursor=pointer]:
        - img [ref=e26]
      - button "行内代码 (Ctrl+K)" [ref=e28] [cursor=pointer]:
        - img [ref=e29]
      - button "标题1 (Ctrl+1)" [ref=e32] [cursor=pointer]:
        - img [ref=e33]
      - button "无序列表 (Ctrl+Shift+U)" [ref=e35] [cursor=pointer]:
        - img [ref=e36]
      - button "有序列表 (Ctrl+Shift+O)" [ref=e37] [cursor=pointer]:
        - img [ref=e38]
      - button "引用 (Ctrl+Shift+])" [ref=e41] [cursor=pointer]:
        - img [ref=e42]
      - button "代码块 (Ctrl+Shift+K)" [ref=e45] [cursor=pointer]:
        - img [ref=e46]
      - button "链接 (Ctrl+L)" [ref=e50] [cursor=pointer]:
        - img [ref=e51]
      - button "图片 (Ctrl+Shift+I)" [ref=e54] [cursor=pointer]:
        - img [ref=e55]
      - button "分割线 (Ctrl+Shift+H)" [ref=e59] [cursor=pointer]:
        - img [ref=e60]
    - generic [ref=e62]:
      - button "隐藏预览 (Ctrl+Shift+P)" [ref=e63] [cursor=pointer]:
        - img [ref=e64]
      - button "切换到暗黑主题" [ref=e69] [cursor=pointer]:
        - img [ref=e70]
  - generic [ref=e72]:
    - generic [ref=e73]:
      - generic [ref=e74]:
        - button "文件" [ref=e75] [cursor=pointer]:
          - img [ref=e76]
          - generic [ref=e78]: 文件
        - button "最近" [ref=e79] [cursor=pointer]:
          - img [ref=e80]
          - generic [ref=e83]: 最近
        - button "目录" [ref=e84] [cursor=pointer]:
          - img [ref=e85]
          - generic [ref=e88]: 目录
      - generic [ref=e90]:
        - generic [ref=e91]: 文件目录
        - generic [ref=e93]: 暂无文件
    - generic [ref=e98]:
      - generic [ref=e101]: "1"
      - textbox [ref=e104]
  - generic [ref=e109]:
    - button "导出 HTML" [ref=e110] [cursor=pointer]:
      - img [ref=e111]
      - generic [ref=e114]: 导出 HTML
    - button "导出 PDF" [ref=e115] [cursor=pointer]:
      - img [ref=e116]
      - generic [ref=e119]: 导出 PDF
  - generic [ref=e120]:
    - generic [ref=e121]:
      - generic [ref=e122]: 未命名
      - generic [ref=e123]: "|"
      - generic [ref=e124]: 0 字
      - generic [ref=e125]: "|"
      - generic [ref=e126]: 1 行
    - generic [ref=e127]:
      - generic [ref=e128]: UTF-8
      - generic [ref=e129]: "|"
      - generic [ref=e130]: 明亮
      - generic [ref=e131]: "|"
      - generic [ref=e132]: v0.1.0
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('File Operations', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/');
  6  |   });
  7  | 
  8  |   test('should show file tree section', async ({ page }) => {
  9  |     const fileTab = page.locator('[data-testid="file-tab"]');
  10 |     await fileTab.click();
  11 |     
  12 |     const fileTree = page.locator('.file-tree');
  13 |     await expect(fileTree).toBeVisible();
  14 |   });
  15 | 
  16 |   test('should toggle sidebar', async ({ page }) => {
  17 |     const sidebarToggle = page.locator('[data-testid="sidebar-toggle"]');
  18 |     const sidebar = page.locator('.sidebar');
  19 |     
  20 |     await expect(sidebar).toBeVisible();
> 21 |     await sidebarToggle.click();
     |                         ^ Error: locator.click: Test timeout of 30000ms exceeded.
  22 |     await expect(sidebar).not.toBeVisible();
  23 |     
  24 |     await sidebarToggle.click();
  25 |     await expect(sidebar).toBeVisible();
  26 |   });
  27 | });
  28 | 
  29 | test.describe('TOC Navigation', () => {
  30 |   test.beforeEach(async ({ page }) => {
  31 |     await page.goto('/');
  32 |   });
  33 | 
  34 |   test('should show TOC section', async ({ page }) => {
  35 |     const tocTab = page.locator('[data-testid="toc-tab"]');
  36 |     await tocTab.click();
  37 |     
  38 |     const tocPanel = page.locator('.toc-panel');
  39 |     await expect(tocPanel).toBeVisible();
  40 |   });
  41 | 
  42 |   test('should display headings in TOC', async ({ page }) => {
  43 |     const editor = page.locator('.cm-content');
  44 |     await editor.click();
  45 |     await editor.type('# Heading 1\n## Heading 2\n### Heading 3');
  46 |     
  47 |     const tocTab = page.locator('[data-testid="toc-tab"]');
  48 |     await tocTab.click();
  49 |     
  50 |     const tocItems = page.locator('.toc-item');
  51 |     await expect(tocItems).toHaveCount(3);
  52 |   });
  53 | 
  54 |   test('should toggle TOC visibility', async ({ page }) => {
  55 |     const tocTab = page.locator('[data-testid="toc-tab"]');
  56 |     const tocPanel = page.locator('.toc-panel');
  57 |     
  58 |     await tocTab.click();
  59 |     await expect(tocPanel).toBeVisible();
  60 |     
  61 |     await tocTab.click();
  62 |     await expect(tocPanel).not.toBeVisible();
  63 |   });
  64 | });
  65 | 
  66 | test.describe('Resizer Functionality', () => {
  67 |   test.beforeEach(async ({ page }) => {
  68 |     await page.goto('/');
  69 |   });
  70 | 
  71 |   test('should show resizer between panes', async ({ page }) => {
  72 |     const resizer = page.locator('.resizer');
  73 |     await expect(resizer).toBeVisible();
  74 |   });
  75 | 
  76 |   test('should resize panes by dragging', async ({ page }) => {
  77 |     const resizer = page.locator('.resizer');
  78 |     const container = page.locator('.main-content');
  79 |     const editorPane = page.locator('.editor-pane');
  80 |     
  81 |     const initialWidth = await editorPane.evaluate(el => el.getBoundingClientRect().width);
  82 |     
  83 |     await resizer.hover();
  84 |     await page.mouse.down();
  85 |     await page.mouse.move(resizer.boundingBox().x + 100, resizer.boundingBox().y);
  86 |     await page.mouse.up();
  87 |     
  88 |     const newWidth = await editorPane.evaluate(el => el.getBoundingClientRect().width);
  89 |     expect(newWidth).not.toBe(initialWidth);
  90 |   });
  91 | });
  92 | 
```