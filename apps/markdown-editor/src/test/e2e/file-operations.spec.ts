import { test, expect } from '@playwright/test';

test.describe('File Operations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should show file tree section', async ({ page }) => {
    const fileTab = page.locator('[data-testid="file-tab"]');
    await fileTab.click();
    
    const fileTree = page.locator('.file-tree');
    await expect(fileTree).toBeVisible();
  });

  test('should toggle sidebar', async ({ page }) => {
    const sidebarToggle = page.locator('[data-testid="sidebar-toggle"]');
    const sidebar = page.locator('.sidebar');
    
    await expect(sidebar).toBeVisible();
    await sidebarToggle.click();
    await expect(sidebar).not.toBeVisible();
    
    await sidebarToggle.click();
    await expect(sidebar).toBeVisible();
  });
});

test.describe('TOC Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should show TOC section', async ({ page }) => {
    const tocTab = page.locator('[data-testid="toc-tab"]');
    await tocTab.click();
    
    const tocPanel = page.locator('.toc-panel');
    await expect(tocPanel).toBeVisible();
  });

  test('should display headings in TOC', async ({ page }) => {
    const editor = page.locator('.cm-content');
    await editor.click();
    await editor.type('# Heading 1\n## Heading 2\n### Heading 3');
    
    const tocTab = page.locator('[data-testid="toc-tab"]');
    await tocTab.click();
    
    const tocItems = page.locator('.toc-item');
    await expect(tocItems).toHaveCount(3);
  });

  test('should toggle TOC visibility', async ({ page }) => {
    const tocTab = page.locator('[data-testid="toc-tab"]');
    const tocPanel = page.locator('.toc-panel');
    
    await tocTab.click();
    await expect(tocPanel).toBeVisible();
    
    await tocTab.click();
    await expect(tocPanel).not.toBeVisible();
  });
});

test.describe('Resizer Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should show resizer between panes', async ({ page }) => {
    const resizer = page.locator('.resizer');
    await expect(resizer).toBeVisible();
  });

  test('should resize panes by dragging', async ({ page }) => {
    const resizer = page.locator('.resizer');
    const container = page.locator('.main-content');
    const editorPane = page.locator('.editor-pane');
    
    const initialWidth = await editorPane.evaluate(el => el.getBoundingClientRect().width);
    
    await resizer.hover();
    await page.mouse.down();
    await page.mouse.move(resizer.boundingBox().x + 100, resizer.boundingBox().y);
    await page.mouse.up();
    
    const newWidth = await editorPane.evaluate(el => el.getBoundingClientRect().width);
    expect(newWidth).not.toBe(initialWidth);
  });
});
