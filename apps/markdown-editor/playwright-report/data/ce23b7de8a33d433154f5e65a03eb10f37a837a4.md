# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: toc-recent.spec.ts >> TOC Enhanced Features >> should collapse and expand TOC items
- Location: src\test\e2e\toc-recent.spec.ts:20:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('[data-testid="toc-tab"]')

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
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('TOC Enhanced Features', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     await page.goto('/');
  6   |   });
  7   | 
  8   |   test('should display TOC count badge', async ({ page }) => {
  9   |     const tocTab = page.locator('[data-testid="toc-tab"]');
  10  |     await tocTab.click();
  11  |     
  12  |     const editor = page.locator('.cm-content');
  13  |     await editor.click();
  14  |     await editor.type('# Heading 1\n## Heading 2\n### Heading 3');
  15  |     
  16  |     const countBadge = page.locator('.toc-count');
  17  |     await expect(countBadge).toContainText('3');
  18  |   });
  19  | 
  20  |   test('should collapse and expand TOC items', async ({ page }) => {
  21  |     const tocTab = page.locator('[data-testid="toc-tab"]');
> 22  |     await tocTab.click();
      |                  ^ Error: locator.click: Test timeout of 30000ms exceeded.
  23  |     
  24  |     const editor = page.locator('.cm-content');
  25  |     await editor.click();
  26  |     await editor.type('# H1\n## H2\n### H3\n## H4');
  27  |     
  28  |     const collapseBtn = page.locator('.toc-collapse-btn').first();
  29  |     await expect(collapseBtn).toBeVisible();
  30  |     
  31  |     await collapseBtn.click();
  32  |     await expect(collapseBtn).toBeVisible();
  33  |   });
  34  | 
  35  |   test('should highlight active heading on scroll', async ({ page }) => {
  36  |     const tocTab = page.locator('[data-testid="toc-tab"]');
  37  |     await tocTab.click();
  38  |     
  39  |     const editor = page.locator('.cm-content');
  40  |     await editor.click();
  41  |     await editor.type('# First\n\n# Second\n\n# Third');
  42  |     
  43  |     const activeItem = page.locator('.toc-item.active').first();
  44  |     await expect(activeItem).toBeVisible();
  45  |   });
  46  | 
  47  |   test('should show indentation for nested headings', async ({ page }) => {
  48  |     const tocTab = page.locator('[data-testid="toc-tab"]');
  49  |     await tocTab.click();
  50  |     
  51  |     const editor = page.locator('.cm-content');
  52  |     await editor.click();
  53  |     await editor.type('# H1\n## H2\n### H3');
  54  |     
  55  |     const level1 = page.locator('.toc-item.level-1').first();
  56  |     const level2 = page.locator('.toc-item.level-2').first();
  57  |     const level3 = page.locator('.toc-item.level-3').first();
  58  |     
  59  |     await expect(level1).toBeVisible();
  60  |     await expect(level2).toBeVisible();
  61  |     await expect(level3).toBeVisible();
  62  |   });
  63  | 
  64  |   test('should scroll to heading on click', async ({ page }) => {
  65  |     const tocTab = page.locator('[data-testid="toc-tab"]');
  66  |     await tocTab.click();
  67  |     
  68  |     const editor = page.locator('.cm-content');
  69  |     await editor.click();
  70  |     await editor.type('# Title\n\nSome content');
  71  |     
  72  |     const tocItem = page.locator('.toc-item').first();
  73  |     await tocItem.click();
  74  |     
  75  |     await expect(tocItem).toHaveClass(/active/);
  76  |   });
  77  | });
  78  | 
  79  | test.describe('Recent Files Feature', () => {
  80  |   test.beforeEach(async ({ page }) => {
  81  |     await page.goto('/');
  82  |   });
  83  | 
  84  |   test('should show recent files tab', async ({ page }) => {
  85  |     const recentTab = page.locator('[data-testid="recent-tab"]');
  86  |     await expect(recentTab).toBeVisible();
  87  |   });
  88  | 
  89  |   test('should display empty state when no recent files', async ({ page }) => {
  90  |     const recentTab = page.locator('[data-testid="recent-tab"]');
  91  |     await recentTab.click();
  92  |     
  93  |     const emptyState = page.locator('.recent-files-empty');
  94  |     await expect(emptyState).toBeVisible();
  95  |     await expect(emptyState).toContainText('暂无最近文件');
  96  |   });
  97  | 
  98  |   test('should show recent files after opening file', async ({ page }) => {
  99  |     const recentTab = page.locator('[data-testid="recent-tab"]');
  100 |     await recentTab.click();
  101 |     
  102 |     const emptyState = page.locator('.recent-files-empty');
  103 |     await expect(emptyState).toBeVisible();
  104 |   });
  105 | 
  106 |   test('should not show clear button when no files', async ({ page }) => {
  107 |     const recentTab = page.locator('[data-testid="recent-tab"]');
  108 |     await recentTab.click();
  109 |     
  110 |     const clearBtn = page.locator('.clear-recent-btn');
  111 |     await expect(clearBtn).not.toBeVisible();
  112 |   });
  113 | 
  114 |   test('should switch between tabs correctly', async ({ page }) => {
  115 |     const fileTab = page.locator('[data-testid="file-tab"]');
  116 |     const recentTab = page.locator('[data-testid="recent-tab"]');
  117 |     const tocTab = page.locator('[data-testid="toc-tab"]');
  118 |     
  119 |     await expect(fileTab).toBeVisible();
  120 |     
  121 |     await recentTab.click();
  122 |     await expect(page.locator('.recent-files')).toBeVisible();
```