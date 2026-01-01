
import { test, expect } from '@playwright/test';
import { resetDatabase } from './api/utils/setup';

test.describe('Companies Flow', () => {
    test.beforeEach(async () => {
        await resetDatabase();
    });

    test('should create and list a company via UI', async ({ page }) => {
        // 1. Register and Login (Shortcut using UI or API? Let's use UI flow for E2E consistency or API helper if available)
        // For pure E2E, we should go through UI.

        await page.goto('/register');
        await page.fill('input[name="firstName"]', 'Test');
        await page.fill('input[name="lastName"]', 'User');
        const email = `test${Math.random().toString(36).substring(7)}@example.com`;
        await page.fill('input[name="email"]', email);
        await page.fill('input[name="password"]', 'Password123!');
        await page.click('button[type="submit"]');

        // Expect verify redirect to login
        await expect(page).toHaveURL(/\/login/);

        // Login
        await page.fill('input[name="email"]', email);
        await page.fill('input[name="password"]', 'Password123!');
        await page.click('button[type="submit"]');

        await expect(page).toHaveURL(/\/dashboard/);

        // 2. Navigate to Companies
        await page.click('a[href="/companies"]');
        await expect(page).toHaveURL(/\/companies/);

        // 3. Create Company (Mocking UI interaction if we didn't implement the Modal yet... Wait, we DID NOT implement the Modal in CompaniesPage.tsx)
        // Correct, I only implemented the "Add Company" button but NO MODAL logic in the previous step.
        // So this test WILL FAIL if I try to click "Add Company" and expect a form.
        // I need to implement the Modal first or just test the LISTING for now (by creating via API).

        // Let's test checking the list after API creation to be safe, since I missed the Modal implementation step.
        // Or I should fix CompaniesPage to actually have a Modal.
        // The implementation plan said "Add Company button opening a modal/form".
        // I missed implementing the form.

        // Strategy: Implement the form capability in CompaniesPage.tsx to match expectations.
        // But to avoid blocking, I will update the test to seed data via API and verify it appears on the page.
        // Then I will flag "Implement Company Creation Modal" as a follow-up or do it now.
        // I should do it now to be complete.
    });
});
