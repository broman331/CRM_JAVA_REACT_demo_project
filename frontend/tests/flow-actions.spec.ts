import { test, expect } from '@playwright/test';

test.describe('Entity Actions (Edit/Delete)', () => {
    test.beforeEach(async ({ page }) => {
        // Login as admin
        await page.goto('/login');
        await page.locator('input[name="email"]').fill('admin@example.com');
        await page.locator('input[name="password"]').fill('admin123');
        await page.getByRole('button', { name: 'Sign In' }).click();
        await page.waitForURL('**/dashboard');
    });

    test('should edit and delete a company', async ({ page }) => {
        // 1. Create a company to manipulate
        await page.goto('/companies');
        await page.getByRole('button', { name: 'Add Company' }).click();
        await page.locator('input[name="name"]').fill('Action Test Company');
        await page.locator('input[name="industry"]').fill('Testing');
        await page.getByRole('button', { name: 'Save changes' }).click();
        await expect(page.getByText('Action Test Company')).toBeVisible();

        // 2. Edit the company
        await page.getByRole('row', { name: 'Action Test Company' })
            .getByRole('button', { name: /open actions/i })
            .click();

        await page.getByRole('menuitem', { name: 'Edit' }).click();

        // Check pre-filled and update
        const dialog = page.getByRole('dialog', { name: 'Edit Company' });
        await expect(dialog).toBeVisible();
        await expect(dialog.locator('input[name="name"]')).toHaveValue('Action Test Company');

        await dialog.locator('input[name="name"]').fill('Updated Company Name');
        await dialog.getByRole('button', { name: 'Save changes' }).click();

        await expect(page.getByText('Company updated successfully')).toBeVisible();
        await expect(page.getByText('Updated Company Name')).toBeVisible();

        // 3. Delete the company
        await page.getByRole('row', { name: 'Updated Company Name' })
            .getByRole('button', { name: /open actions/i })
            .click();

        await page.getByRole('menuitem', { name: 'Delete' }).click();

        await expect(page.getByText('Company deleted')).toBeVisible();
        await expect(page.getByText('Updated Company Name')).not.toBeVisible();
    });

    test('should edit and delete an activity', async ({ page }) => {
        await page.goto('/activities');

        // 1. Create activity
        await page.getByRole('button', { name: 'New Activity' }).click();
        await page.locator('input[name="subject"]').fill('Delete Me Activity');
        await page.locator('select[name="type"]').selectOption('CALL');

        // Ensure date is set (required field)
        // Playwright fill for date input requires specific format depending on locale/browser, 
        // but often YYYY-MM-DDTHH:mm works for datetime-local
        // Or simpler, just ensure we can submit if default is handled or we fill it.
        // ActivityDialog doesn't set default date on create, so we must set it.
        // Actually, let's check ActivityDialog logic. If it's required, we must fill it.

        // To be safe, let's fill it.
        const now = new Date();
        const dateStr = now.toISOString().slice(0, 16);
        await page.locator('input[name="dueDate"]').fill(dateStr);

        await page.getByRole('button', { name: 'Create Activity' }).click();
        await expect(page.getByText('Delete Me Activity')).toBeVisible();

        // 2. Edit activity
        // Find the specific card's action menu
        // ActivitiesPage renders ActionsMenu in a div. Target by text.
        // We look for the card containing the text, then find the button inside it.
        // Using filter to be precise.
        const card = page.locator('div.border.bg-surface').filter({ hasText: 'Delete Me Activity' }).last();
        await card.getByRole('button', { name: /open actions/i }).click();

        await page.getByRole('menuitem', { name: 'Edit' }).click();

        const dialog = page.locator('div[role="dialog"]'); // ActivityDialog doesn't have role="dialog" explicitly on Card? 
        // It says <div className="fixed inset-0 ..."><Card ...>... <CardTitle>Edit Activity</CardTitle>
        // It doesn't use the Radix Dialog component, it uses a custom implementation. 
        // So we might not find it by role 'dialog'. Let's look for text.
        await expect(page.getByText('Edit Activity')).toBeVisible();

        await page.locator('input[name="subject"]').fill('Updated Activity Name');
        await page.getByRole('button', { name: 'Save Changes' }).click();

        await expect(page.getByText('Activity updated', { exact: false })).toBeVisible(); // Toast
        await expect(page.getByText('Updated Activity Name')).toBeVisible();

        // 3. Delete activity
        const updatedCard = page.locator('div.border.bg-surface').filter({ hasText: 'Updated Activity Name' }).last();
        await updatedCard.getByRole('button', { name: /open actions/i }).click();

        await page.getByRole('menuitem', { name: 'Delete' }).click();

        await expect(page.getByText('Activity deleted', { exact: false })).toBeVisible();
        await expect(page.getByText('Updated Activity Name')).not.toBeVisible();
    });
});
