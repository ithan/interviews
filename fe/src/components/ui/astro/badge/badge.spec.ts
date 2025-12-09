import { test, expect } from '@playwright/test';

test.describe('Badge component', () => {
  test('renders badges with different variants', async ({ page }) => {
    await page.goto('/');
    
    const defaultBadge = page.locator('[data-slot="badge"].badge--default').first();
    await expect(defaultBadge).toBeVisible();
    
    const secondaryBadge = page.locator('[data-slot="badge"].badge--secondary').first();
    await expect(secondaryBadge).toBeVisible();
    
    const outlineBadge = page.locator('[data-slot="badge"].badge--outline').first();
    await expect(outlineBadge).toBeVisible();
  });
});

