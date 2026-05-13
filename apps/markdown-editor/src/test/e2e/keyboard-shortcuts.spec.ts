import { test, expect } from '@playwright/test';

test.describe('Keyboard Shortcuts', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should toggle bold with Ctrl+B', async ({ page }) => {
    const editor = page.locator('.cm-content');
    await editor.click();
    await editor.type('text');
    
    await page.keyboard.press('Control+a');
    await page.keyboard.press('Control+b');
    
    const preview = page.locator('.preview-content');
    await expect(preview.locator('strong')).toBeVisible();
  });

  test('should toggle italic with Ctrl+I', async ({ page }) => {
    const editor = page.locator('.cm-content');
    await editor.click();
    await editor.type('text');
    
    await page.keyboard.press('Control+a');
    await page.keyboard.press('Control+i');
    
    const preview = page.locator('.preview-content');
    await expect(preview.locator('em')).toBeVisible();
  });

  test('should toggle preview with Ctrl+Shift+P', async ({ page }) => {
    const previewPane = page.locator('.preview-pane');
    
    await expect(previewPane).toBeVisible();
    await page.keyboard.press('Control+Shift+p');
    await expect(previewPane).not.toBeVisible();
    
    await page.keyboard.press('Control+Shift+p');
    await expect(previewPane).toBeVisible();
  });
});

test.describe('Menu Bar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display menu bar', async ({ page }) => {
    const menuBar = page.locator('.menu-bar');
    await expect(menuBar).toBeVisible();
  });

  test('should have File menu', async ({ page }) => {
    const fileMenu = page.locator('text=文件');
    await expect(fileMenu).toBeVisible();
  });

  test('should have Edit menu', async ({ page }) => {
    const editMenu = page.locator('text=编辑');
    await expect(editMenu).toBeVisible();
  });

  test('should have View menu', async ({ page }) => {
    const viewMenu = page.locator('text=视图');
    await expect(viewMenu).toBeVisible();
  });
});

test.describe('Window Controls', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display window controls', async ({ page }) => {
    const windowControls = page.locator('.window-controls');
    await expect(windowControls).toBeVisible();
  });

  test('should have minimize button', async ({ page }) => {
    const minimizeBtn = page.locator('[data-testid="minimize-btn"]');
    await expect(minimizeBtn).toBeVisible();
  });

  test('should have maximize button', async ({ page }) => {
    const maximizeBtn = page.locator('[data-testid="maximize-btn"]');
    await expect(maximizeBtn).toBeVisible();
  });

  test('should have close button', async ({ page }) => {
    const closeBtn = page.locator('[data-testid="close-btn"]');
    await expect(closeBtn).toBeVisible();
  });
});
