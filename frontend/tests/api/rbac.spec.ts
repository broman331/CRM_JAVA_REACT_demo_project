import { test, expect } from '@playwright/test';
import { generateUser, generateContact } from './utils/seeds';

const API_URL = 'http://localhost:9090/api';

test.describe('RBAC API Security', () => {
    let userToken: string;
    let adminToken: string;
    let contactId: string;

    test.beforeAll(async ({ request }) => {
        // Reset DB
        await request.delete(`${API_URL}/test/reset`);

        // Seed Admin
        await request.post(`${API_URL}/test/seed-admin`);

        // Register Standard User
        const user = generateUser();
        await request.post(`${API_URL}/auth/register`, { data: user });

        // Login User
        const userLogin = await request.post(`${API_URL}/auth/login`, {
            data: { email: user.email, password: user.password }
        });
        userToken = (await userLogin.json()).token;

        // Login Admin
        const adminLogin = await request.post(`${API_URL}/auth/login`, {
            data: { email: 'admin@example.com', password: 'admin123' }
        });
        adminToken = (await adminLogin.json()).token;

        // Create a Contact (as User) to delete later
        const contact = generateContact();
        const createRes = await request.post(`${API_URL}/contacts`, {
            data: contact,
            headers: { Authorization: `Bearer ${userToken}` }
        });
        contactId = (await createRes.json()).id;
    });

    test('Standard User cannot delete contact (403)', async ({ request }) => {
        const response = await request.delete(`${API_URL}/contacts/${contactId}`, {
            headers: { Authorization: `Bearer ${userToken}` }
        });
        expect(response.status()).toBe(403);
    });

    test('Admin can delete contact (204)', async ({ request }) => {
        const response = await request.delete(`${API_URL}/contacts/${contactId}`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        expect(response.status()).toBe(204);
    });

    test('Standard User cannot delete other entities (403)', async ({ request }) => {
        // Use a random valid UUID
        const randomId = '123e4567-e89b-12d3-a456-426614174000';
        const response = await request.delete(`${API_URL}/deals/${randomId}`, {
            headers: { Authorization: `Bearer ${userToken}` }
        });
        expect(response.status()).toBe(403);
    });
});
