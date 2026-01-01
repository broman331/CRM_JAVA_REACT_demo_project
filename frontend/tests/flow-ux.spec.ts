import { test, expect } from '@playwright/test';

test.describe('Activity Timeline & UX Flow', () => {
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

    test('should show activity timeline in Contacts page', async ({ page }) => {
        await page.goto('/contacts');

        // 1. Check for Skeleton (might be too fast, but let's check for table structure)
        await expect(page.locator('table')).toBeVisible();

        // 2. Verify "Add Contact" toast (feature not ready yet)
        await page.click('button:has-text("Add Contact")');
        await expect(page.locator('text=Add Contact feature coming soon')).toBeVisible();

        // 3. Create a contact via API so we can test the timeline
        const uniqueId = Math.random().toString(36).substring(7);
        const firstName = `Timeline-${uniqueId}`;
        const lastName = 'Test';
        const contactName = `${firstName} ${lastName}`;
        const contactEmail = `timeline-${uniqueId}@test.com`;

        // Get token from local storage
        const token = await page.evaluate(() => {
            const storage = localStorage.getItem('auth-storage');
            return storage ? JSON.parse(storage).state.token : null;
        });

        const response = await page.request.post('http://localhost:9090/api/contacts', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data: {
                firstName: firstName,
                lastName: lastName,
                email: contactEmail,
                jobTitle: 'Tester'
            }
        });
        expect(response.status()).toBe(200);
        const body = await response.json();
        console.log('Created Contact:', body);

        // Reload to see the new contact
        await page.reload();
        await expect(page.locator('table')).toBeVisible();

        // Search for the contact to avoid pagination/sorting issues
        await page.fill('input[placeholder="Search contacts..."]', firstName);
        // Wait for search result with timeout
        await expect(page.locator(`text=${contactName}`)).toBeVisible({ timeout: 10000 });

        // 4. Expand contact row
        // Click the chevron for the contact "Timeline Test <uniqueId>"
        const row = page.locator('tr', { hasText: contactName });
        await row.locator('button').first().click();

        // 5. Verify Timeline content
        await expect(page.locator('text=Activity History')).toBeVisible();

        // Wait for loading to finish (skeletons to disappear)
        await expect(page.locator('tr.bg-slate-900\\/30 .animate-pulse').first()).not.toBeVisible({ timeout: 10000 });

        // Since no activities yet
        await expect(page.locator('text=No activity history found')).toBeVisible();
    });

    test('should show toasts for actions in Deals page', async ({ page }) => {
        await page.goto('/deals');

        // 5. Verify Skeletons appear on reload (fast check)
        await page.reload();
        // Just verify table exists
        await expect(page.locator('table')).toBeVisible();

        // 2. Create a deal and check toast
        await page.click('button:has-text("New Deal")');
        // Currently 'New Deal' shows a "Coming Soon" toast based on my implementation
        await expect(page.locator('text=Feature coming soon')).toBeVisible();
    });
});
