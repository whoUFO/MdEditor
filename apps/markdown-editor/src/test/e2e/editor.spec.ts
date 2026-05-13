import { test, expect } from '@playwright/test';

test.describe('Editor Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should type text in editor', async ({ page }) => {
    const editor = page.locator('.cm-content');
    await editor.click();
    await editor.type('# Hello World\n\nThis is a test.');
    
    await expect(editor).toContainText('Hello World');
    await expect(editor).toContainText('This is a test.');
  });

  test('should show line numbers', async ({ page }) => {
    const lineNumbers = page.locator('.cm-lineNumbers');
    await expect(lineNumbers).toBeVisible();
  });

  test('should highlight markdown syntax', async ({ page }) => {
    const editor = page.locator('.cm-content');
    await editor.click();
    await editor.type('# Heading\n**bold** *italic*');
    
    const preview = page.locator('.preview-content');
    await expect(preview.locator('h1')).toContainText('Heading');
  });
});

test.describe('Preview Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should render heading', async ({ page }) => {
    const editor = page.locator('.cm-content');
    await editor.click();
    await editor.type('# Test Heading');
    
    const preview = page.locator('.preview-content');
    await expect(preview.locator('h1')).toContainText('Test Heading');
  });

  test('should render bold text', async ({ page }) => {
    const editor = page.locator('.cm-content');
    await editor.click();
    await editor.type('**bold text**');
    
    const preview = page.locator('.preview-content');
    await expect(preview.locator('strong')).toContainText('bold text');
  });

  test('should render italic text', async ({ page }) => {
    const editor = page.locator('.cm-content');
    await editor.click();
    await editor.type('*italic text*');
    
    const preview = page.locator('.preview-content');
    await expect(preview.locator('em')).toContainText('italic text');
  });

  test('should render code block', async ({ page }) => {
    const editor = page.locator('.cm-content');
    await editor.click();
    await editor.type('```javascript\nconst x = 1;\n```');
    
    const preview = page.locator('.preview-content');
    await expect(preview.locator('pre code')).toBeVisible();
  });

  test('should render list', async ({ page }) => {
    const editor = page.locator('.cm-content');
    await editor.click();
    await editor.type('- Item 1\n- Item 2\n- Item 3');
    
    const preview = page.locator('.preview-content');
    await expect(preview.locator('ul li')).toHaveCount(3);
  });

  test('should render link', async ({ page }) => {
    const editor = page.locator('.cm-content');
    await editor.click();
    await editor.type('[GitHub](https://github.com)');
    
    const preview = page.locator('.preview-content');
    const link = preview.locator('a[href="https://github.com"]');
    await expect(link).toContainText('GitHub');
  });
});

test.describe('Toolbar Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display all toolbar buttons', async ({ page }) => {
    const toolbar = page.locator('.toolbar');
    await expect(toolbar).toBeVisible();
    
    const buttons = [
      'bold-btn',
      'italic-btn',
      'heading-btn',
      'code-btn',
      'link-btn',
      'image-btn',
      'quote-btn',
      'list-btn',
      'ordered-list-btn',
      'preview-btn',
      'export-btn',
    ];
    
    for (const btn of buttons) {
      await expect(page.locator(`[data-testid="${btn}"]`)).toBeVisible();
    }
  });

  test('should toggle preview', async ({ page }) => {
    const previewBtn = page.locator('[data-testid="preview-btn"]');
    const previewPane = page.locator('.preview-pane');
    
    await expect(previewPane).toBeVisible();
    await previewBtn.click();
    await expect(previewPane).not.toBeVisible();
    
    await previewBtn.click();
    await expect(previewPane).toBeVisible();
  });
});

test.describe('Status Bar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display status bar', async ({ page }) => {
    const statusBar = page.locator('.status-bar');
    await expect(statusBar).toBeVisible();
  });

  test('should show line and column', async ({ page }) => {
    const statusBar = page.locator('.status-bar');
    await expect(statusBar).toContainText('Ln');
    await expect(statusBar).toContainText('Col');
  });

  test('should show word count', async ({ page }) => {
    const statusBar = page.locator('.status-bar');
    await expect(statusBar).toContainText('Words');
  });
});
