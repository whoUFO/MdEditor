# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: settings.spec.ts >> Settings Panel >> should open settings panel
- Location: src\test\e2e\settings.spec.ts:34:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('[data-testid="settings-btn"]')

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
  3  | test.describe('Theme Switching', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/');
  6  |   });
  7  | 
  8  |   test('should have theme toggle', async ({ page }) => {
  9  |     const themeToggle = page.locator('[data-testid="theme-toggle"]');
  10 |     await expect(themeToggle).toBeVisible();
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
> 36 |     await settingsBtn.click();
     |                       ^ Error: locator.click: Test timeout of 30000ms exceeded.
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