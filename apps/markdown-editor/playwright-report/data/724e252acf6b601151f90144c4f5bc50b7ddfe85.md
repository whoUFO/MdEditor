# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: keyboard-shortcuts.spec.ts >> Menu Bar >> should have File menu
- Location: src\test\e2e\keyboard-shortcuts.spec.ts:54:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=文件')
Expected: visible
Error: strict mode violation: locator('text=文件') resolved to 3 elements:
    1) <span>文件</span> aka getByTestId('sidebar').getByRole('button', { name: '文件' })
    2) <span>文件目录</span> aka getByText('文件目录')
    3) <div class="file-tree-empty">暂无文件</div> aka getByText('暂无文件')

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=文件')

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
> 56 |     await expect(fileMenu).toBeVisible();
     |                            ^ Error: expect(locator).toBeVisible() failed
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
  77 |     await expect(windowControls).toBeVisible();
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