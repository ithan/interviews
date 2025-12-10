import { test, expect } from '@playwright/test';

test.describe('Container component', () => {
  test('renders centered container', async ({ page }) => {
    await page.goto('/');
    
    const container = page.locator('[data-slot="container"]').first();
    await expect(container).toBeVisible();
    await expect(container).toHaveClass(/container--center/);
  });

  test('applies content size', async ({ page }) => {
    await page.goto('/');
    
    const container = page.locator('[data-slot="container"].container--content').first();
    await expect(container).toBeVisible();
  });
});


