# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: editor.spec.ts >> Preview Functionality >> should render link
- Location: src\test\e2e\editor.spec.ts:82:7

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('.preview-content').locator('a[href="https://github.com"]')
Expected substring: "GitHub"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('.preview-content').locator('a[href="https://github.com"]')

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
- paragraph:
  - link "GitHub":
    - /url: https://github.com
- button "导出 HTML":
  - img
  - text: 导出 HTML
- button "导出 PDF":
  - img
  - text: 导出 PDF
- text: 未命名* | 4 字 | 1 行 UTF-8 | 明亮 | v0.1.0
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Editor Functionality', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     await page.goto('/');
  6   |   });
  7   | 
  8   |   test('should type text in editor', async ({ page }) => {
  9   |     const editor = page.locator('.cm-content');
  10  |     await editor.click();
  11  |     await editor.type('# Hello World\n\nThis is a test.');
  12  |     
  13  |     await expect(editor).toContainText('Hello World');
  14  |     await expect(editor).toContainText('This is a test.');
  15  |   });
  16  | 
  17  |   test('should show line numbers', async ({ page }) => {
  18  |     const lineNumbers = page.locator('.cm-lineNumbers');
  19  |     await expect(lineNumbers).toBeVisible();
  20  |   });
  21  | 
  22  |   test('should highlight markdown syntax', async ({ page }) => {
  23  |     const editor = page.locator('.cm-content');
  24  |     await editor.click();
  25  |     await editor.type('# Heading\n**bold** *italic*');
  26  |     
  27  |     const preview = page.locator('.preview-content');
  28  |     await expect(preview.locator('h1')).toContainText('Heading');
  29  |   });
  30  | });
  31  | 
  32  | test.describe('Preview Functionality', () => {
  33  |   test.beforeEach(async ({ page }) => {
  34  |     await page.goto('/');
  35  |   });
  36  | 
  37  |   test('should render heading', async ({ page }) => {
  38  |     const editor = page.locator('.cm-content');
  39  |     await editor.click();
  40  |     await editor.type('# Test Heading');
  41  |     
  42  |     const preview = page.locator('.preview-content');
  43  |     await expect(preview.locator('h1')).toContainText('Test Heading');
  44  |   });
  45  | 
  46  |   test('should render bold text', async ({ page }) => {
  47  |     const editor = page.locator('.cm-content');
  48  |     await editor.click();
  49  |     await editor.type('**bold text**');
  50  |     
  51  |     const preview = page.locator('.preview-content');
  52  |     await expect(preview.locator('strong')).toContainText('bold text');
  53  |   });
  54  | 
  55  |   test('should render italic text', async ({ page }) => {
  56  |     const editor = page.locator('.cm-content');
  57  |     await editor.click();
  58  |     await editor.type('*italic text*');
  59  |     
  60  |     const preview = page.locator('.preview-content');
  61  |     await expect(preview.locator('em')).toContainText('italic text');
  62  |   });
  63  | 
  64  |   test('should render code block', async ({ page }) => {
  65  |     const editor = page.locator('.cm-content');
  66  |     await editor.click();
  67  |     await editor.type('```javascript\nconst x = 1;\n```');
  68  |     
  69  |     const preview = page.locator('.preview-content');
  70  |     await expect(preview.locator('pre code')).toBeVisible();
  71  |   });
  72  | 
  73  |   test('should render list', async ({ page }) => {
  74  |     const editor = page.locator('.cm-content');
  75  |     await editor.click();
  76  |     await editor.type('- Item 1\n- Item 2\n- Item 3');
  77  |     
  78  |     const preview = page.locator('.preview-content');
  79  |     await expect(preview.locator('ul li')).toHaveCount(3);
  80  |   });
  81  | 
  82  |   test('should render link', async ({ page }) => {
  83  |     const editor = page.locator('.cm-content');
  84  |     await editor.click();
  85  |     await editor.type('[GitHub](https://github.com)');
  86  |     
  87  |     const preview = page.locator('.preview-content');
  88  |     const link = preview.locator('a[href="https://github.com"]');
> 89  |     await expect(link).toContainText('GitHub');
      |                        ^ Error: expect(locator).toContainText(expected) failed
  90  |   });
  91  | });
  92  | 
  93  | test.describe('Toolbar Functionality', () => {
  94  |   test.beforeEach(async ({ page }) => {
  95  |     await page.goto('/');
  96  |   });
  97  | 
  98  |   test('should display all toolbar buttons', async ({ page }) => {
  99  |     const toolbar = page.locator('.toolbar');
  100 |     await expect(toolbar).toBeVisible();
  101 |     
  102 |     const buttons = [
  103 |       'bold-btn',
  104 |       'italic-btn',
  105 |       'heading-btn',
  106 |       'code-btn',
  107 |       'link-btn',
  108 |       'image-btn',
  109 |       'quote-btn',
  110 |       'list-btn',
  111 |       'ordered-list-btn',
  112 |       'preview-btn',
  113 |       'export-btn',
  114 |     ];
  115 |     
  116 |     for (const btn of buttons) {
  117 |       await expect(page.locator(`[data-testid="${btn}"]`)).toBeVisible();
  118 |     }
  119 |   });
  120 | 
  121 |   test('should toggle preview', async ({ page }) => {
  122 |     const previewBtn = page.locator('[data-testid="preview-btn"]');
  123 |     const previewPane = page.locator('.preview-pane');
  124 |     
  125 |     await expect(previewPane).toBeVisible();
  126 |     await previewBtn.click();
  127 |     await expect(previewPane).not.toBeVisible();
  128 |     
  129 |     await previewBtn.click();
  130 |     await expect(previewPane).toBeVisible();
  131 |   });
  132 | });
  133 | 
  134 | test.describe('Status Bar', () => {
  135 |   test.beforeEach(async ({ page }) => {
  136 |     await page.goto('/');
  137 |   });
  138 | 
  139 |   test('should display status bar', async ({ page }) => {
  140 |     const statusBar = page.locator('.status-bar');
  141 |     await expect(statusBar).toBeVisible();
  142 |   });
  143 | 
  144 |   test('should show line and column', async ({ page }) => {
  145 |     const statusBar = page.locator('.status-bar');
  146 |     await expect(statusBar).toContainText('Ln');
  147 |     await expect(statusBar).toContainText('Col');
  148 |   });
  149 | 
  150 |   test('should show word count', async ({ page }) => {
  151 |     const statusBar = page.locator('.status-bar');
  152 |     await expect(statusBar).toContainText('Words');
  153 |   });
  154 | });
  155 | 
```