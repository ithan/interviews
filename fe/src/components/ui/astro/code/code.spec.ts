import { test, expect } from '@playwright/test';

test.describe('Code component', () => {
  test('renders inline code', async ({ page }) => {
    await page.goto('/');
    
    const inlineCode = page.locator('[data-slot="code"].code--inline').first();
    await expect(inlineCode).toBeVisible();
  });

  test('renders code block with header', async ({ page }) => {
    await page.goto('/');
    
    const codeBlock = page.locator('[data-slot="code-block"]').first();
    await expect(codeBlock).toBeVisible();
    
    const filename = codeBlock.locator('.code-block__filename');
    await expect(filename).toBeVisible();
  });
});

