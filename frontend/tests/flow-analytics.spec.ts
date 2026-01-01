import { test, expect } from '@playwright/test';
import { randomUUID } from 'crypto';

test.describe('Analytics Dashboard Flow', () => {
    test('should verify dashboard rendering', async ({ page }) => {
        // 1. Register and Login
        await page.goto('/register');
        const email = `test.analytics.${randomUUID()}@example.com`;
        await page.fill('input[name="firstName"]', 'Analytics');
        await page.fill('input[name="lastName"]', 'User');
        await page.fill('input[name="email"]', email);
        await page.fill('input[name="password"]', 'Password123!');
        await page.click('button[type="submit"]');

        await expect(page).toHaveURL('/login');

        // Login
        await page.fill('input[name="email"]', email);
        await page.fill('input[name="password"]', 'Password123!');
        await page.click('button[type="submit"]');

        await expect(page).toHaveURL('/dashboard');

        // 2. Navigate to Analytics
        await page.click('a[href="/analytics"]');
        await expect(page).toHaveURL('/analytics');

        // 3. Verify Charts Presence
        await expect(page.locator('text=Sales Analytics')).toBeVisible();
        await expect(page.locator('text=Revenue Trend')).toBeVisible();
        await expect(page.locator('text=Deal Pipeline Distribution')).toBeVisible();
        await expect(page.locator('text=Activity Volume')).toBeVisible();

        // 4. Verify no crash (basic check)
        // Recharts renders SVGs.
        await expect(page.locator('.recharts-responsive-container').first()).toBeVisible();
    });
});
