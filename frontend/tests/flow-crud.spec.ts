import { test, expect } from '@playwright/test';

test.describe('CRUD Operations', () => {
    test.beforeEach(async ({ page }) => {
        // Register and Login
        await page.goto('/register');
        const id = Math.random().toString(36).substring(7);
        const email = `test-${id}@example.com`;

        await page.fill('input[name="firstName"]', 'Test');
        await page.fill('input[name="lastName"]', 'User');
        await page.fill('input[name="email"]', email);
        await page.fill('input[name="password"]', 'password123');
        await page.click('button:has-text("Create Account")');

        await page.waitForURL('/login');
        await page.fill('input[name="email"]', email);
        await page.fill('input[name="password"]', 'password123');
        await page.click('button:has-text("Sign In")');
        await page.waitForURL(url => url.pathname === '/' || url.pathname === '/dashboard');
    });

    test('should create a new company', async ({ page }) => {
        await page.click('a[href="/companies"]');
        await expect(page).toHaveURL('/companies');

        await page.click('button:has-text("Add Company")');
        await expect(page.getByRole('dialog')).toBeVisible();

        const companyName = `Acme Corp ${Date.now()}`;
        await page.fill('input[name="name"]', companyName);
        await page.fill('input[name="industry"]', 'Technology');
        await page.fill('input[name="website"]', 'https://acme.com');
        await page.fill('input[name="phone"]', '555-0123');

        await page.click('button:has-text("Save changes")');

        // Dialog should close
        await expect(page.getByRole('dialog')).not.toBeVisible();

        // Toast should appear
        await expect(page.getByText('Company created successfully')).toBeVisible();

        // Company should be in the list
        await expect(page.getByText(companyName)).toBeVisible();
    });

    test('should create a new contact linked to a company', async ({ page }) => {
        // Navigate to Contacts
        await page.click('a[href="/contacts"]');
        await expect(page).toHaveURL('/contacts');

        await page.click('button:has-text("Add Contact")');
        await expect(page.getByRole('dialog')).toBeVisible();

        const firstName = `John ${Date.now()}`;
        await page.fill('input[name="firstName"]', firstName);
        await page.fill('input[name="lastName"]', 'Doe');
        await page.fill('input[name="email"]', `john.doe.${Date.now()}@example.com`);
        await page.fill('input[name="phone"]', '555-0199');
        await page.fill('input[name="jobTitle"]', 'CTO');

        // Select Company (Assuming seed data or previous test created one, but strictly should select first available)
        await page.selectOption('select[name="companyId"]', { index: 1 }); // Select second option (first real company)

        await page.click('button:has-text("Save changes")');

        await expect(page.getByRole('dialog')).not.toBeVisible();
        await expect(page.getByText('Contact created successfully')).toBeVisible();
        await expect(page.getByText(firstName)).toBeVisible();
    });

    test('should create a new deal linked to a company', async ({ page }) => {
        // Navigate to Deals
        await page.click('a[href="/deals"]');
        await expect(page).toHaveURL('/deals');

        await page.click('button:has-text("New Deal")');
        await expect(page.getByRole('dialog')).toBeVisible();

        const dealTitle = `Big Contract ${Date.now()}`;
        await page.fill('input[name="title"]', dealTitle);
        await page.fill('input[name="value"]', '50000');

        // Select Contact (created in previous test)
        await page.selectOption('select[name="contactId"]', { index: 1 });

        await page.click('button:has-text("Create Deal")');

        await expect(page.getByRole('dialog')).not.toBeVisible();
        await expect(page.getByText('Deal created successfully')).toBeVisible();

        // Check if it appears in the LEAD column (first column)
        await expect(page.getByText(dealTitle)).toBeVisible();
    });
});
