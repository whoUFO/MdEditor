import { test, expect } from '@playwright/test';

test.describe('Basic Functionality', () => {
  test('should load the app', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
  });

  test('should have editor and preview', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.editor-pane')).toBeVisible();
    await expect(page.locator('.preview-pane')).toBeVisible();
  });
});
