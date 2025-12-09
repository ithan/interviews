import { test, expect } from '@playwright/test';

test.describe('Text component', () => {
  test('renders text with correct styles', async ({ page }) => {
    await page.goto('/');
    
    const text = page.locator('[data-slot="text"]').first();
    await expect(text).toBeVisible();
  });

  test('renders headings with correct hierarchy', async ({ page }) => {
    await page.goto('/');
    
    const h1 = page.locator('[data-slot="heading"]').filter({ has: page.locator('text="JSON block renderer"') });
    await expect(h1).toBeVisible();
    
    const h2 = page.getByRole('heading', { level: 2 }).first();
    await expect(h2).toBeVisible();
  });
});

