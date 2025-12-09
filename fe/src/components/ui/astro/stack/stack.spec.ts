import { test, expect } from '@playwright/test';

test.describe('Stack component', () => {
  test('renders vertical stack by default', async ({ page }) => {
    await page.goto('/');
    
    const stack = page.locator('[data-slot="stack"].stack--vertical').first();
    await expect(stack).toBeVisible();
  });

  test('renders horizontal stack', async ({ page }) => {
    await page.goto('/');
    
    const horizontalStack = page.locator('[data-slot="stack"].stack--horizontal').first();
    await expect(horizontalStack).toBeVisible();
  });
});

