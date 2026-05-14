# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: keyboard-shortcuts.spec.ts >> Window Controls >> should display window controls
- Location: src\test\e2e\keyboard-shortcuts.spec.ts:75:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.window-controls')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('.window-controls')

```

```yaml
- button "打开文件 (Ctrl+O)":
  - img
- button "保存 (Ctrl+S)":
  - img
- button "另存为 (Ctrl+Shift+S)":
  - img
- button "粗体 (Ctrl+B)":
  - img
- button "斜体 (Ctrl+I)":
  - img
- button "行内代码 (Ctrl+K)":
  - img
- button "标题1 (Ctrl+1)":
  - img
- button "无序列表 (Ctrl+Shift+U)":
  - img
- button "有序列表 (Ctrl+Shift+O)":
  - img
- button "引用 (Ctrl+Shift+])":
  - img
- button "代码块 (Ctrl+Shift+K)":
  - img
- button "链接 (Ctrl+L)":
  - img
- button "图片 (Ctrl+Shift+I)":
  - img
- button "分割线 (Ctrl+Shift+H)":
  - img
- button "隐藏预览 (Ctrl+Shift+P)":
  - img
- button "切换到暗黑主题":
  - img
- button "文件":
  - img
  - text: 文件
- button "最近":
  - img
  - text: 最近
- button "目录":
  - img
  - text: 目录
- text: 文件目录 暂无文件
- textbox
- button "导出 HTML":
  - img
  - text: 导出 HTML
- button "导出 PDF":
  - img
  - text: 导出 PDF
- text: 未命名 | 0 字 | 1 行 UTF-8 | 明亮 | v0.1.0
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Keyboard Shortcuts', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/');
  6  |   });
  7  | 
  8  |   test('should toggle bold with Ctrl+B', async ({ page }) => {
  9  |     const editor = page.locator('.cm-content');
  10 |     await editor.click();
  11 |     await editor.type('text');
  12 |     
  13 |     await page.keyboard.press('Control+a');
  14 |     await page.keyboard.press('Control+b');
  15 |     
  16 |     const preview = page.locator('.preview-content');
  17 |     await expect(preview.locator('strong')).toBeVisible();
  18 |   });
  19 | 
  20 |   test('should toggle italic with Ctrl+I', async ({ page }) => {
  21 |     const editor = page.locator('.cm-content');
  22 |     await editor.click();
  23 |     await editor.type('text');
  24 |     
  25 |     await page.keyboard.press('Control+a');
  26 |     await page.keyboard.press('Control+i');
  27 |     
  28 |     const preview = page.locator('.preview-content');
  29 |     await expect(preview.locator('em')).toBeVisible();
  30 |   });
  31 | 
  32 |   test('should toggle preview with Ctrl+Shift+P', async ({ page }) => {
  33 |     const previewPane = page.locator('.preview-pane');
  34 |     
  35 |     await expect(previewPane).toBeVisible();
  36 |     await page.keyboard.press('Control+Shift+p');
  37 |     await expect(previewPane).not.toBeVisible();
  38 |     
  39 |     await page.keyboard.press('Control+Shift+p');
  40 |     await expect(previewPane).toBeVisible();
  41 |   });
  42 | });
  43 | 
  44 | test.describe('Menu Bar', () => {
  45 |   test.beforeEach(async ({ page }) => {
  46 |     await page.goto('/');
  47 |   });
  48 | 
  49 |   test('should display menu bar', async ({ page }) => {
  50 |     const menuBar = page.locator('.menu-bar');
  51 |     await expect(menuBar).toBeVisible();
  52 |   });
  53 | 
  54 |   test('should have File menu', async ({ page }) => {
  55 |     const fileMenu = page.locator('text=文件');
  56 |     await expect(fileMenu).toBeVisible();
  57 |   });
  58 | 
  59 |   test('should have Edit menu', async ({ page }) => {
  60 |     const editMenu = page.locator('text=编辑');
  61 |     await expect(editMenu).toBeVisible();
  62 |   });
  63 | 
  64 |   test('should have View menu', async ({ page }) => {
  65 |     const viewMenu = page.locator('text=视图');
  66 |     await expect(viewMenu).toBeVisible();
  67 |   });
  68 | });
  69 | 
  70 | test.describe('Window Controls', () => {
  71 |   test.beforeEach(async ({ page }) => {
  72 |     await page.goto('/');
  73 |   });
  74 | 
  75 |   test('should display window controls', async ({ page }) => {
  76 |     const windowControls = page.locator('.window-controls');
> 77 |     await expect(windowControls).toBeVisible();
     |                                  ^ Error: expect(locator).toBeVisible() failed
  78 |   });
  79 | 
  80 |   test('should have minimize button', async ({ page }) => {
  81 |     const minimizeBtn = page.locator('[data-testid="minimize-btn"]');
  82 |     await expect(minimizeBtn).toBeVisible();
  83 |   });
  84 | 
  85 |   test('should have maximize button', async ({ page }) => {
  86 |     const maximizeBtn = page.locator('[data-testid="maximize-btn"]');
  87 |     await expect(maximizeBtn).toBeVisible();
  88 |   });
  89 | 
  90 |   test('should have close button', async ({ page }) => {
  91 |     const closeBtn = page.locator('[data-testid="close-btn"]');
  92 |     await expect(closeBtn).toBeVisible();
  93 |   });
  94 | });
  95 | 
```