import { test, expect } from '@playwright/test';
import { generateUser, generateContact } from './api/utils/seeds';

const TEST_URL = 'http://localhost:5173';
const API_URL = 'http://localhost:9090/api';

test.describe('RBAC UI Flow', () => {

    test.beforeEach(async ({ request }) => {
        // Reset DB & Seed Admin
        await request.delete(`${API_URL}/test/reset`);
        await request.post(`${API_URL}/test/seed-admin`);
    });

    test('Standard User sees restricted UI', async ({ page, request }) => {
        // Register & Login Standard User
        const user = generateUser();
        await request.post(`${API_URL}/auth/register`, { data: user });

        await page.goto(`${TEST_URL}/login`);
        await page.fill('input[type="email"]', user.email);
        await page.fill('input[type="password"]', user.password);
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL(`${TEST_URL}/dashboard`);

        // Check Sidebar (Admin link should be missing)
        const adminLink = page.getByRole('link', { name: 'Admin' });
        await expect(adminLink).not.toBeVisible();

        // Check Contacts Page (Delete button should be missing)
        // First create a contact via API so there is something to list
        const contact = generateContact();
        const userLogin = await request.post(`${API_URL}/auth/login`, {
            data: { email: user.email, password: user.password }
        });
        const token = (await userLogin.json()).token;
        await request.post(`${API_URL}/contacts`, {
            data: contact,
            headers: { Authorization: `Bearer ${token}` }
        });

        await page.goto(`${TEST_URL}/contacts`);
        const fullName = `${contact.firstName} ${contact.lastName}`;
        await expect(page.getByText(fullName)).toBeVisible();

        // Trash icon is lucide-trash-2, usually has class containing 'lucide-trash-2' or we search by button with that icon
        // In my code I used <Trash2>.
        // Let's check for the absence of the delete button.
        // The delete button was conditional: {user?.roles?.includes('ADMIN') && (...)}

        const deleteBtn = page.locator('button:has(.lucide-trash-2)');
        await expect(deleteBtn).not.toBeVisible();
    });

    test('Admin User sees full UI', async ({ page, request }) => {
        // Login Admin
        await page.goto(`${TEST_URL}/login`);
        await page.fill('input[type="email"]', 'admin@example.com');
        await page.fill('input[type="password"]', 'admin123');
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL(`${TEST_URL}/dashboard`);

        // Check Sidebar (Admin link should be VISIBLE)
        const adminLink = page.getByRole('link', { name: 'Admin' });
        await expect(adminLink).toBeVisible();

        // Check Contacts Page (Delete button should be VISIBLE)
        // Create a contact as admin
        const adminLogin = await request.post(`${API_URL}/auth/login`, {
            data: { email: 'admin@example.com', password: 'admin123' }
        });
        const token = (await adminLogin.json()).token;
        const contact = generateContact();
        await request.post(`${API_URL}/contacts`, {
            data: contact,
            headers: { Authorization: `Bearer ${token}` }
        });

        await page.goto(`${TEST_URL}/contacts`);
        const fullName = `${contact.firstName} ${contact.lastName}`;
        await expect(page.getByText(fullName)).toBeVisible();

        const deleteBtn = page.locator('button:has(.lucide-trash-2)');
        await expect(deleteBtn).toBeVisible();
        await expect(deleteBtn).toHaveCount(1);
        await expect(deleteBtn).toHaveCount(1);

        // Test Admin Route Access
        await adminLink.click();
        await expect(page).toHaveURL(`${TEST_URL}/admin`);
        await expect(page.getByText('Admin Settings')).toBeVisible();
    });

});
