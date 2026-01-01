import { test, expect } from '@playwright/test';

test('User can register, login, and navigate', async ({ page }) => {
    const email = `testuser-${Date.now()}@example.com`;
    const password = 'password123';
    const name = 'Test User';

    // 1. Register
    await page.goto('/register');
    await page.fill('input[name="firstName"]', 'Test');
    await page.fill('input[name="lastName"]', 'User');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');

    // Should redirect to login or auto-login (PrimeCRM redirects to Login usually)
    // Let's assume we need to login after register or it auto-redirects to login
    await expect(page).toHaveURL('/login');

    // 2. Login
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');

    // 3. Verify Dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText('Total Revenue')).toBeVisible();

    // 4. Navigate to Contacts
    await page.click('a[href="/contacts"]');
    await expect(page).toHaveURL('/contacts');
    await expect(page.getByRole('heading', { name: 'Contacts' })).toBeVisible();

    // 5. Navigate to Sales
    await page.click('a[href="/deals"]');
    await expect(page).toHaveURL('/deals');
    await expect(page.getByText('Deals Pipeline')).toBeVisible();
});
