import { test, expect } from '@playwright/test';

test.describe('Theme Switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have theme toggle', async ({ page }) => {
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    await expect(themeToggle).toBeVisible();
  });

  test('should switch to dark theme', async ({ page }) => {
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    
    await themeToggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('should switch back to light theme', async ({ page }) => {
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    
    await themeToggle.click();
    await themeToggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });
});

test.describe('Settings Panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should open settings panel', async ({ page }) => {
    const settingsBtn = page.locator('[data-testid="settings-btn"]');
    await settingsBtn.click();
    
    const settingsPanel = page.locator('.settings-panel');
    await expect(settingsPanel).toBeVisible();
  });

  test('should close settings panel', async ({ page }) => {
    const settingsBtn = page.locator('[data-testid="settings-btn"]');
    await settingsBtn.click();
    
    const closeBtn = page.locator('.settings-close');
    await closeBtn.click();
    
    const settingsPanel = page.locator('.settings-panel');
    await expect(settingsPanel).not.toBeVisible();
  });

  test('should change font size', async ({ page }) => {
    const settingsBtn = page.locator('[data-testid="settings-btn"]');
    await settingsBtn.click();
    
    const increaseFontBtn = page.locator('.font-size-btn:has-text("+")');
    await increaseFontBtn.click();
    
    const fontSizeValue = page.locator('.font-size-value');
    await expect(fontSizeValue).toContainText('15px');
  });
});
