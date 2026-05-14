# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: settings.spec.ts >> Theme Switching >> should have theme toggle
- Location: src\test\e2e\settings.spec.ts:8:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[data-testid="theme-toggle"]')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('[data-testid="theme-toggle"]')

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
  3  | test.describe('Theme Switching', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/');
  6  |   });
  7  | 
  8  |   test('should have theme toggle', async ({ page }) => {
  9  |     const themeToggle = page.locator('[data-testid="theme-toggle"]');
> 10 |     await expect(themeToggle).toBeVisible();
     |                               ^ Error: expect(locator).toBeVisible() failed
  11 |   });
  12 | 
  13 |   test('should switch to dark theme', async ({ page }) => {
  14 |     const themeToggle = page.locator('[data-testid="theme-toggle"]');
  15 |     
  16 |     await themeToggle.click();
  17 |     await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  18 |   });
  19 | 
  20 |   test('should switch back to light theme', async ({ page }) => {
  21 |     const themeToggle = page.locator('[data-testid="theme-toggle"]');
  22 |     
  23 |     await themeToggle.click();
  24 |     await themeToggle.click();
  25 |     await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  26 |   });
  27 | });
  28 | 
  29 | test.describe('Settings Panel', () => {
  30 |   test.beforeEach(async ({ page }) => {
  31 |     await page.goto('/');
  32 |   });
  33 | 
  34 |   test('should open settings panel', async ({ page }) => {
  35 |     const settingsBtn = page.locator('[data-testid="settings-btn"]');
  36 |     await settingsBtn.click();
  37 |     
  38 |     const settingsPanel = page.locator('.settings-panel');
  39 |     await expect(settingsPanel).toBeVisible();
  40 |   });
  41 | 
  42 |   test('should close settings panel', async ({ page }) => {
  43 |     const settingsBtn = page.locator('[data-testid="settings-btn"]');
  44 |     await settingsBtn.click();
  45 |     
  46 |     const closeBtn = page.locator('.settings-close');
  47 |     await closeBtn.click();
  48 |     
  49 |     const settingsPanel = page.locator('.settings-panel');
  50 |     await expect(settingsPanel).not.toBeVisible();
  51 |   });
  52 | 
  53 |   test('should change font size', async ({ page }) => {
  54 |     const settingsBtn = page.locator('[data-testid="settings-btn"]');
  55 |     await settingsBtn.click();
  56 |     
  57 |     const increaseFontBtn = page.locator('.font-size-btn:has-text("+")');
  58 |     await increaseFontBtn.click();
  59 |     
  60 |     const fontSizeValue = page.locator('.font-size-value');
  61 |     await expect(fontSizeValue).toContainText('15px');
  62 |   });
  63 | });
  64 | 
```