import { test, expect } from '@playwright/test';

test.describe('TOC Enhanced Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display TOC count badge', async ({ page }) => {
    const tocTab = page.locator('[data-testid="toc-tab"]');
    await tocTab.click();
    
    const editor = page.locator('.cm-content');
    await editor.click();
    await editor.type('# Heading 1\n## Heading 2\n### Heading 3');
    
    const countBadge = page.locator('.toc-count');
    await expect(countBadge).toContainText('3');
  });

  test('should collapse and expand TOC items', async ({ page }) => {
    const tocTab = page.locator('[data-testid="toc-tab"]');
    await tocTab.click();
    
    const editor = page.locator('.cm-content');
    await editor.click();
    await editor.type('# H1\n## H2\n### H3\n## H4');
    
    const collapseBtn = page.locator('.toc-collapse-btn').first();
    await expect(collapseBtn).toBeVisible();
    
    await collapseBtn.click();
    await expect(collapseBtn).toBeVisible();
  });

  test('should highlight active heading on scroll', async ({ page }) => {
    const tocTab = page.locator('[data-testid="toc-tab"]');
    await tocTab.click();
    
    const editor = page.locator('.cm-content');
    await editor.click();
    await editor.type('# First\n\n# Second\n\n# Third');
    
    const activeItem = page.locator('.toc-item.active').first();
    await expect(activeItem).toBeVisible();
  });

  test('should show indentation for nested headings', async ({ page }) => {
    const tocTab = page.locator('[data-testid="toc-tab"]');
    await tocTab.click();
    
    const editor = page.locator('.cm-content');
    await editor.click();
    await editor.type('# H1\n## H2\n### H3');
    
    const level1 = page.locator('.toc-item.level-1').first();
    const level2 = page.locator('.toc-item.level-2').first();
    const level3 = page.locator('.toc-item.level-3').first();
    
    await expect(level1).toBeVisible();
    await expect(level2).toBeVisible();
    await expect(level3).toBeVisible();
  });

  test('should scroll to heading on click', async ({ page }) => {
    const tocTab = page.locator('[data-testid="toc-tab"]');
    await tocTab.click();
    
    const editor = page.locator('.cm-content');
    await editor.click();
    await editor.type('# Title\n\nSome content');
    
    const tocItem = page.locator('.toc-item').first();
    await tocItem.click();
    
    await expect(tocItem).toHaveClass(/active/);
  });
});

test.describe('Recent Files Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should show recent files tab', async ({ page }) => {
    const recentTab = page.locator('[data-testid="recent-tab"]');
    await expect(recentTab).toBeVisible();
  });

  test('should display empty state when no recent files', async ({ page }) => {
    const recentTab = page.locator('[data-testid="recent-tab"]');
    await recentTab.click();
    
    const emptyState = page.locator('.recent-files-empty');
    await expect(emptyState).toBeVisible();
    await expect(emptyState).toContainText('暂无最近文件');
  });

  test('should show recent files after opening file', async ({ page }) => {
    const recentTab = page.locator('[data-testid="recent-tab"]');
    await recentTab.click();
    
    const emptyState = page.locator('.recent-files-empty');
    await expect(emptyState).toBeVisible();
  });

  test('should not show clear button when no files', async ({ page }) => {
    const recentTab = page.locator('[data-testid="recent-tab"]');
    await recentTab.click();
    
    const clearBtn = page.locator('.clear-recent-btn');
    await expect(clearBtn).not.toBeVisible();
  });

  test('should switch between tabs correctly', async ({ page }) => {
    const fileTab = page.locator('[data-testid="file-tab"]');
    const recentTab = page.locator('[data-testid="recent-tab"]');
    const tocTab = page.locator('[data-testid="toc-tab"]');
    
    await expect(fileTab).toBeVisible();
    
    await recentTab.click();
    await expect(page.locator('.recent-files')).toBeVisible();
    
    await tocTab.click();
    await expect(page.locator('.toc')).toBeVisible();
    
    await fileTab.click();
    await expect(page.locator('.file-tree')).toBeVisible();
  });
});

test.describe('Sidebar Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have three sidebar tabs', async ({ page }) => {
    const sidebarTabs = page.locator('.sidebar-tab');
    await expect(sidebarTabs).toHaveCount(3);
  });

  test('should highlight active tab', async ({ page }) => {
    const recentTab = page.locator('[data-testid="recent-tab"]');
    await recentTab.click();
    
    const activeTab = page.locator('.sidebar-tab.active');
    await expect(activeTab).toContainText('最近');
  });
});
