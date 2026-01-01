import { test, expect, request as globalRequest } from '@playwright/test';
import { resetDatabase } from './api/utils/setup';
import { generateUser, generateContact, generateDeal } from './api/utils/seeds';

test.describe('Search & Filtering Flow', () => {
    test.beforeAll(async ({ request }) => {
        await resetDatabase();

        // Register and Login
        const user = generateUser();
        await request.post('/api/auth/register', { data: user });
        const loginRes = await request.post('/api/auth/login', { data: { email: user.email, password: user.password } });
        const loginData = await loginRes.json();

        // Use the token to seed data
        const apiContext = await request.newContext({
            extraHTTPHeaders: { Authorization: `Bearer ${loginData.token}` }
        });

        // Seed Contacts
        const c1 = await apiContext.post('/api/contacts', { data: { ...generateContact(), firstName: 'Alice', lastName: 'Searchable' } });
        const c1Data = await c1.json();
        await apiContext.post('/api/contacts', { data: { ...generateContact(), firstName: 'Bob', lastName: 'Ignored' } });

        // Seed Deals
        await apiContext.post('/api/deals', { data: { ...generateDeal(c1Data.id, null), title: 'Small Deal', value: 500, stage: 'LEAD' } });
        await apiContext.post('/api/deals', { data: { ...generateDeal(c1Data.id, null), title: 'Big Deal', value: 5000, stage: 'CLOSED_WON' } });
    });

    test.beforeEach(async ({ page }) => {
        // Since we don't save auth state to file in beforeAll easily without browser, we login again or just use UI login test pattern
        // For simplicity, let's just do UI login flow
        await page.goto('/login');
        // We know the credentials from the seed? No, we need fresh ones or reuse.
        // Let's just create a new user for this test run in beforeEach or assume database is clean.
        // Actually, we reset database in beforeAll. We need to login as that user.
        // But we didn't save the user credentials. 
        // Let's Register fully in the test for simplicity.

        await page.goto('/register');
        await page.fill('input[name="fullName"]', 'Search User');
        await page.fill('input[name="email"]', `search_${Date.now()}@test.com`);
        await page.fill('input[name="password"]', 'Password123!');
        await page.click('button[type="submit"]');
        await page.waitForURL('/login');

        await page.fill('input[name="email"]', `search_${Date.now()}@test.com` /* Wait, I need the same email */);
        // This is getting messy with dynamic dates.
    });

    // Let's refactor: Use seeding via API, then Login via UI with KNOWN credentials.
});

// REFACTOR: clear and simple
test.describe('Search & Filtering Flow', () => {
    test.beforeEach(async () => {
        await resetDatabase();
    });

    test('should filter contacts and deals', async ({ page, request }) => {
        // 1. Setup Data via API
        const seedUser = generateUser();
        const user = { ...seedUser, email: `flow_search_${Date.now()}@example.com` };
        const registerRes = await request.post('/api/auth/register', { data: user });
        expect(registerRes.ok(), `Register failed: ${registerRes.status()} ${await registerRes.text()}`).toBeTruthy();

        const loginRes = await request.post('/api/auth/login', { data: { email: user.email, password: user.password } });
        expect(loginRes.ok(), `Login failed: ${await loginRes.text()}`).toBeTruthy();
        const { token } = await loginRes.json();
        const api = await globalRequest.newContext({ extraHTTPHeaders: { Authorization: `Bearer ${token}` } });

        // Seed
        await api.post('/api/contacts', { data: { firstName: 'Alice', lastName: 'Found', email: 'alice@test.com', phone: '123' } });
        const c2 = await api.post('/api/contacts', { data: { firstName: 'Bob', lastName: 'Hidden', email: 'bob@test.com', phone: '456' } });
        const c2Data = await c2.json(); // Bob is linked to deals

        await api.post('/api/deals', { data: { title: 'Big Win', value: 5000, stage: 'CLOSED_WON', contactId: c2Data.id } });
        await api.post('/api/deals', { data: { title: 'Small Start', value: 500, stage: 'LEAD', contactId: c2Data.id } });

        // 2. Login via UI
        await page.goto('/login');
        await page.fill('input[name="email"]', user.email);
        await page.fill('input[name="password"]', user.password);
        await page.click('button[type="submit"]');
        await page.waitForURL('/dashboard');

        // 3. Test Contact Search
        await page.click('a[href="/contacts"]');
        await page.waitForSelector('text=Alice Found'); // Wait for list
        await page.waitForSelector('text=Bob Hidden');

        await page.fill('input[placeholder="Search contacts..."]', 'Alice');
        // Debounce might delay result
        await page.waitForTimeout(500);

        // Assert Alice is visible, Bob is not
        // Assert Alice is visible, Bob is not
        await expect(page.getByText('Alice Found')).toBeVisible();
        await expect(page.getByText('Bob Hidden')).toBeHidden();

        // 4. Test Deal Filtering
        await page.click('a[href="/deals"]');
        await page.waitForSelector('text=Big Win');
        await page.waitForSelector('text=Small Start');

        // Filter by Min Value
        await page.fill('input[placeholder*="Min Value"]', '1000');
        await page.waitForTimeout(500); // Wait for query

        // Assert Big Win visible, Small Start hidden
        await expect(page.locator('text=Big Win')).toBeVisible();
        await expect(page.locator('text=Small Start')).toBeHidden();

        // Clear filter
        await page.fill('input[placeholder*="Min Value"]', '');
        await page.waitForTimeout(500);
        await expect(page.locator('text=Small Start')).toBeVisible();

        // Filter by Stage
        await page.selectOption('select', 'CLOSED_WON');
        await page.waitForTimeout(500);
        await expect(page.locator('text=Big Win')).toBeVisible();
        await expect(page.locator('text=Small Start')).toBeHidden();
    });
});
