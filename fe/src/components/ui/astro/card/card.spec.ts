import { test, expect } from '@playwright/test';

test.describe('Card component', () => {
  test('renders with default variant', async ({ page }) => {
    await page.goto('/');
    
    const card = page.locator('[data-slot="card"]').first();
    await expect(card).toBeVisible();
    await expect(card).toHaveClass(/card--default/);
  });

  test('renders outlined variant', async ({ page }) => {
    await page.goto('/');
    
    const outlinedCard = page.locator('[data-slot="card"].card--outlined').first();
    await expect(outlinedCard).toBeVisible();
  });

  test('card sections are present', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('[data-slot="card-header"]').first()).toBeVisible();
    await expect(page.locator('[data-slot="card-content"]').first()).toBeVisible();
  });
});

