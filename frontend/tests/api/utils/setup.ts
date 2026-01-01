
import { request } from '@playwright/test';
import { generateUser } from './seeds';

const BACKEND_URL = 'http://localhost:9090';

export const resetDatabase = async () => {
    const apiContext = await request.newContext({
        baseURL: BACKEND_URL,
    });
    const response = await apiContext.delete('/api/test/reset');
    if (!response.ok()) {
        throw new Error(`Failed to reset database: ${response.status()} ${response.statusText()} `);
    }
};

export const createAuthenticatedContext = async () => {
    const apiContext = await request.newContext({
        baseURL: BACKEND_URL,
    });

    const user = generateUser();
    // Register
    const regResponse = await apiContext.post('/api/auth/register', {
        data: user,
    });
    if (!regResponse.ok()) throw new Error('Failed to register user in setup');
    const createdUser = await regResponse.json();

    // Login
    const loginResponse = await apiContext.post('/api/auth/login', {
        data: { email: user.email, password: user.password },
    });
    if (!loginResponse.ok()) throw new Error('Failed to login in setup');

    const { token } = await loginResponse.json();

    // Return a new context with auth header
    return {
        api: await request.newContext({
            baseURL: BACKEND_URL,
            extraHTTPHeaders: {
                'Authorization': `Bearer ${token} `,
                'Content-Type': 'application/json',
            },
        }),
        user: { ...user, id: createdUser.id },
        token
    };
};
