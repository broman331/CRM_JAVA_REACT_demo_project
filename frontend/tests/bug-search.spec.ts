import { test, expect } from '@playwright/test';

test.describe('Search Debounce & UX', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
        await page.locator('input[name="email"]').fill('admin@example.com');
        await page.locator('input[name="password"]').fill('admin123');
        await page.getByRole('button', { name: 'Sign In' }).click();
        await page.waitForURL('**/dashboard');
    });

    test('should explicitly wait for debounce before filtering', async ({ page }) => {
        await page.goto('/companies');

        // Create two distinct companies
        await page.getByRole('button', { name: 'Add Company' }).click();
        await page.locator('input[name="name"]').fill('Alpha Corp');
        await page.getByRole('button', { name: 'Create Company' }).click();
        await expect(page.getByText('Alpha Corp')).toBeVisible();

        await page.getByRole('button', { name: 'Add Company' }).click();
        await page.locator('input[name="name"]').fill('Beta Ltd');
        await page.getByRole('button', { name: 'Create Company' }).click();
        await expect(page.getByText('Beta Ltd')).toBeVisible();

        // Type 'Alpha' slowly
        const searchInput = page.getByPlaceholder('Search companies...');
        await searchInput.focus();
        await searchInput.pressSequentially('Alpha', { delay: 100 });

        // Ensure input stays focused (validating the keepPreviousData fix)
        await expect(searchInput).toBeFocused();

        // Wait for debounce (500ms) + network
        await expect(page.getByText('Alpha Corp')).toBeVisible();
        await expect(page.getByText('Beta Ltd')).not.toBeVisible();

        // Clear search
        await searchInput.fill('');
        await expect(page.getByText('Beta Ltd')).toBeVisible();

        // Cleanup
        await page.getByRole('row', { name: 'Alpha Corp' }).getByRole('button').last().click();
        await page.getByRole('menuitem', { name: 'Delete' }).click();
        await page.getByRole('row', { name: 'Beta Ltd' }).getByRole('button').last().click();
        await page.getByRole('menuitem', { name: 'Delete' }).click();
    });
});
