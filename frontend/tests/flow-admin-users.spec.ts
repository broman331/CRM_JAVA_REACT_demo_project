import { test, expect } from '@playwright/test';

test.describe('Admin User Management', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
        await page.locator('input[name="email"]').fill('admin@example.com');
        await page.locator('input[name="password"]').fill('admin123');
        await page.getByRole('button', { name: 'Sign in' }).click();
        await page.waitForURL('**/dashboard');
        await page.goto('/admin');
    });

    test('should perform full user lifecycle (CRUD)', async ({ page }) => {
        const testEmail = `testuser_${Date.now()}@example.com`;

        // 1. Create User
        await page.getByRole('button', { name: 'New User' }).click();
        await expect(page.getByRole('dialog', { name: 'New User' })).toBeVisible();

        await page.locator('input[name="firstName"]').fill('Test');
        await page.locator('input[name="lastName"]').fill('User');
        await page.locator('input[name="email"]').fill(testEmail);
        await page.locator('input[name="password"]').fill('password123');
        await page.locator('select[name="role"]').selectOption('SALES_REP');

        await page.getByRole('button', { name: 'Create User' }).click();
        await expect(page.getByText('User created')).toBeVisible();
        await expect(page.getByRole('cell', { name: testEmail })).toBeVisible();

        // 2. Edit User
        await page.getByRole('row', { name: testEmail })
            .getByRole('button', { name: /open actions/i })
            .click();
        await page.getByRole('menuitem', { name: 'Edit' }).click();

        await expect(page.getByRole('dialog', { name: 'Edit User' })).toBeVisible();
        await page.locator('input[name="firstName"]').fill('Updated');
        // Password field should NOT be visible
        await expect(page.locator('input[name="password"]')).not.toBeVisible();

        await page.getByRole('button', { name: 'Save Changes' }).click();
        await expect(page.getByText('User updated')).toBeVisible();
        await expect(page.getByRole('cell', { name: 'Updated User' })).toBeVisible();

        // 3. Delete User
        await page.getByRole('row', { name: testEmail })
            .getByRole('button', { name: /open actions/i })
            .click();
        await page.getByRole('menuitem', { name: 'Delete' }).click();

        await expect(page.getByText('User deleted')).toBeVisible();
        await expect(page.getByRole('cell', { name: testEmail })).not.toBeVisible();
    });
});
