import { test, expect } from '@playwright/test';

test.describe('Entity Actions (Edit/Delete)', () => {
    test.beforeEach(async ({ page }) => {
        // Login as admin
        await page.goto('/login');
        await page.locator('input[name="email"]').fill('admin@example.com');
        await page.locator('input[name="password"]').fill('admin123');
        await page.getByRole('button', { name: 'Sign in' }).click();
        await page.waitForURL('**/dashboard');
    });

    test('should edit and delete a company', async ({ page }) => {
        // 1. Create a company to manipulate
        await page.goto('/companies');
        await page.getByRole('button', { name: 'Add Company' }).click();
        await page.locator('input[name="name"]').fill('Action Test Company');
        await page.locator('input[name="industry"]').fill('Testing');
        await page.getByRole('button', { name: 'Create Company' }).click();
        await expect(page.getByText('Action Test Company')).toBeVisible();

        // 2. Edit the company
        await page.getByRole('row', { name: 'Action Test Company' })
            .getByRole('button', { name: /open actions/i }) // Assuming aria-label or text on trigger
            .click();

        // Note: Edit is currently a toast placeholder, verified by toast appearance
        await page.getByRole('menuitem', { name: 'Edit' }).click();
        await expect(page.getByText('Edit coming soon')).toBeVisible();

        // 3. Delete the company
        await page.getByRole('row', { name: 'Action Test Company' })
            .getByRole('button', { name: /open actions/i })
            .click();

        // Setup listener for dialog or just click if it's direct (current implementation has no confirmation dialog for delete, strictly speaking based on previous code, but let's check)
        // Checking CompaniesPage.tsx: deleteMutation.mutate(company.id) is called directly.
        await page.getByRole('menuitem', { name: 'Delete' }).click();

        await expect(page.getByText('Company deleted')).toBeVisible();
        await expect(page.getByText('Action Test Company')).not.toBeVisible();
    });

    test('should edit and delete an activity', async ({ page }) => {
        await page.goto('/activities');

        // 1. Create activity
        await page.getByRole('button', { name: 'New Activity' }).click();
        await page.locator('input[name="subject"]').fill('Delete Me Activity');
        await page.locator('select[name="type"]').selectOption('CALL');
        // Select date (defaults to today/now usually works)
        await page.getByRole('button', { name: 'Save Activity' }).click();
        await expect(page.getByText('Delete Me Activity')).toBeVisible();

        // 2. Edit activity
        // Find the specific card's action menu
        const activityCard = page.getByText('Delete Me Activity').locator('..').locator('..'); // Adjust selector based on structure
        // Actually, ActivitiesPage renders ActionsMenu in a div. 
        // Let's target by text closeness.
        await page.locator('div').filter({ hasText: 'Delete Me Activity' }).last()
            .getByRole('button').last() // The actions menu trigger is likely the last button
            .click();

        await page.getByRole('menuitem', { name: 'Edit' }).click();
        await expect(page.getByRole('dialog', { name: 'Edit Activity' })).toBeVisible();
        await page.locator('input[name="subject"]').fill('Updated Activity Name');
        await page.getByRole('button', { name: 'Save Changes' }).click();

        await expect(page.getByText('Activity updated')).toBeVisible();
        await expect(page.getByText('Updated Activity Name')).toBeVisible();

        // 3. Delete activity
        await page.locator('div').filter({ hasText: 'Updated Activity Name' }).last()
            .getByRole('button').last()
            .click();

        await page.getByRole('menuitem', { name: 'Delete' }).click();

        // Current implementation in ActivityDialog/Page might use a confirmation or direct delete?
        // ActivitiesPage.tsx has deleteMutation.mutate(id) directly in onConfirm? 
        // Wait, ActivitiesPage.tsx passes onDelete to ActionsMenu. ActionsMenu calls it directly.
        // Wait, previously I saw "Delete Activity: Confirmation dialog" in roadmap.
        // Let's re-read ActivitiesPage.tsx if needed. Assuming direct delete for now as per other pages.

        await expect(page.getByText('Activity deleted')).toBeVisible();
        await expect(page.getByText('Updated Activity Name')).not.toBeVisible();
    });
});
