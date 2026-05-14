# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: editor.spec.ts >> Status Bar >> should show line and column
- Location: src\test\e2e\editor.spec.ts:144:7

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('.status-bar')
Expected substring: "Ln"
Received string:    "未命名|0 字|1 行UTF-8|明亮|v0.1.0"
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('.status-bar')
    13 × locator resolved to <div class="status-bar" data-testid="status-bar">…</div>
       - unexpected value "未命名|0 字|1 行UTF-8|明亮|v0.1.0"

```

```yaml
- text: 未命名 | 0 字 | 1 行 UTF-8 | 明亮 | v0.1.0
```

# Test source

```ts
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
  89  |     await expect(link).toContainText('GitHub');
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
> 146 |     await expect(statusBar).toContainText('Ln');
      |                             ^ Error: expect(locator).toContainText(expected) failed
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