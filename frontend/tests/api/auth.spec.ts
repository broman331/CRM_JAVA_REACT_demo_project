import { test, expect } from '@playwright/test';
import { resetDatabase } from './utils/setup';
import { generateUser } from './utils/seeds';

test.describe('Auth API', () => {
    test.beforeAll(async () => {
        await resetDatabase();
    });

    test('should register a new user', async ({ request }) => {
        const user = generateUser();
        const response = await request.post('/api/auth/register', {
            data: user,
        });

        expect(response.ok()).toBeTruthy();
        const body = await response.json();
        expect(body.email).toBe(user.email);
        expect(body.firstName).toBe(user.firstName);
        expect(body.id).toBeDefined();
    });

    test('should login successfully', async ({ request }) => {
        // 1. Register first
        const user = generateUser();
        await request.post('/api/auth/register', { data: user });

        // 2. Login
        const response = await request.post('/api/auth/login', {
            data: { email: user.email, password: user.password },
        });

        expect(response.ok()).toBeTruthy();
        const body = await response.json();
        expect(body.token).toBeDefined();
    });

    test('should fail login with wrong password', async ({ request }) => {
        // 1. Register first
        const user = generateUser();
        await request.post('/api/auth/register', { data: user });

        // 2. Login with wrong pass
        const response = await request.post('/api/auth/login', {
            data: { email: user.email, password: 'wrongpassword' },
        });

        // Depending on backend, might be 401 or 403
        expect([401, 403]).toContain(response.status());
    });
});
