import { test, expect } from '@playwright/test';

test.describe('Performance Benchmarks', () => {
    test('should load dashboard within performance thresholds', async ({ page }) => {
        // Register User
        const email = `perf-user-${Date.now()}@example.com`;
        await page.goto('http://localhost:5173/register');
        await page.fill('input[name="firstName"]', 'Perf');
        await page.fill('input[name="lastName"]', 'User');
        await page.fill('input[name="email"]', email);
        await page.fill('input[name="password"]', 'password123');
        await page.click('button[type="submit"]');

        // Wait for auto-login/redirect to Dashboard or force login
        // Usually register redirects to login or dashboard. Assuming login:
        await page.waitForURL('**/login');

        // Login Flow
        await page.fill('input[name="email"]', email);
        await page.fill('input[name="password"]', 'password123');
        await page.click('button[type="submit"]');

        // Wait for Dashboard
        await page.waitForURL('**/dashboard');

        // Measure Performance using Web Vitals
        const performanceTiming = await page.evaluate(() => JSON.parse(JSON.stringify(window.performance.timing)));
        const navigationStart = performanceTiming.navigationStart;
        const loadEventEnd = performanceTiming.loadEventEnd;
        const loadTime = loadEventEnd - navigationStart; // Approximation

        console.log(`Page Load Time: ${loadTime}ms`);

        // Using Performance API to get Paint Timing
        const paintMetrics = await page.evaluate(() => {
            const entries = performance.getEntriesByType('paint');
            return entries.map(entry => ({ name: entry.name, startTime: entry.startTime }));
        });

        const fcp = paintMetrics.find(p => p.name === 'first-contentful-paint');
        if (fcp) {
            console.log(`FCP: ${fcp.startTime}ms`);
            expect(fcp.startTime).toBeLessThan(1500); // Threshold: 1.5s
        }

        // Check specific element visibility (TTI proxy)
        const startTime = Date.now();
        await expect(page.locator('text=Total Revenue')).toBeVisible();
        const ttiCheck = Date.now() - startTime;
        console.log(`Time to content visible (post-login): ${ttiCheck}ms`);
        expect(ttiCheck).toBeLessThan(2000); // Threshold: 2s
    });
});
