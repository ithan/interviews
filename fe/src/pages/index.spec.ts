import { test, expect } from '@playwright/test';

test.describe('index page', () => {
  test('has correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('Interview task – JSON block renderer');
  });

  test('displays main heading', async ({ page }) => {
    await page.goto('/');
    
    const heading = page.getByRole('heading', { name: 'JSON block renderer', level: 1 });
    await expect(heading).toBeVisible();
  });

  test('shows all main sections', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Routing' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'The block renderer' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Fetching hint' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Styling notes' })).toBeVisible();
  });

  test('displays editor.js block types', async ({ page }) => {
    await page.goto('/');

    const blockTypes = ['paragraph', 'header', 'list', 'image', 'quote', 'code'];
    
    for (const blockType of blockTypes) {
      await expect(page.getByText(blockType, { exact: true }).first()).toBeVisible();
    }
  });

  test('has working external links', async ({ page }) => {
    await page.goto('/');

    const astroRoutingLink = page.getByRole('link', { name: /Astro's routing docs/i });
    await expect(astroRoutingLink).toHaveAttribute('href', 'https://docs.astro.build/en/guides/routing/');
    await expect(astroRoutingLink).toHaveAttribute('target', '_blank');

    const editorJsLink = page.getByRole('link', { name: /Editor\.js/i });
    await expect(editorJsLink).toHaveAttribute('href', 'https://editorjs.io/');
  });
});


