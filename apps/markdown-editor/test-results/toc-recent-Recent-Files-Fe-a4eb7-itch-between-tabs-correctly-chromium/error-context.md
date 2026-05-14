# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: toc-recent.spec.ts >> Recent Files Feature >> should switch between tabs correctly
- Location: src\test\e2e\toc-recent.spec.ts:114:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[data-testid="file-tab"]')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('[data-testid="file-tab"]')

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
  19  | 
  20  |   test('should collapse and expand TOC items', async ({ page }) => {
  21  |     const tocTab = page.locator('[data-testid="toc-tab"]');
  22  |     await tocTab.click();
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
> 119 |     await expect(fileTab).toBeVisible();
      |                           ^ Error: expect(locator).toBeVisible() failed
  120 |     
  121 |     await recentTab.click();
  122 |     await expect(page.locator('.recent-files')).toBeVisible();
  123 |     
  124 |     await tocTab.click();
  125 |     await expect(page.locator('.toc')).toBeVisible();
  126 |     
  127 |     await fileTab.click();
  128 |     await expect(page.locator('.file-tree')).toBeVisible();
  129 |   });
  130 | });
  131 | 
  132 | test.describe('Sidebar Integration', () => {
  133 |   test.beforeEach(async ({ page }) => {
  134 |     await page.goto('/');
  135 |   });
  136 | 
  137 |   test('should have three sidebar tabs', async ({ page }) => {
  138 |     const sidebarTabs = page.locator('.sidebar-tab');
  139 |     await expect(sidebarTabs).toHaveCount(3);
  140 |   });
  141 | 
  142 |   test('should highlight active tab', async ({ page }) => {
  143 |     const recentTab = page.locator('[data-testid="recent-tab"]');
  144 |     await recentTab.click();
  145 |     
  146 |     const activeTab = page.locator('.sidebar-tab.active');
  147 |     await expect(activeTab).toContainText('最近');
  148 |   });
  149 | });
  150 | 
```