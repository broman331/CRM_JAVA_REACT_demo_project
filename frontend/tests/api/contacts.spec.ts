import { test, expect, APIRequestContext } from '@playwright/test';
import { resetDatabase, createAuthenticatedContext } from './utils/setup';
import { generateContact } from './utils/seeds';

test.describe('Contacts API', () => {
    let api: APIRequestContext;

    test.beforeAll(async () => {
        await resetDatabase();
        const context = await createAuthenticatedContext();
        api = context.api;
    });

    test('should create and retrieve a contact', async () => {
        const contactData = generateContact();

        // Create
        const createRes = await api.post('/api/contacts', {
            data: contactData
        });
        expect(createRes.ok()).toBeTruthy();
        const created = await createRes.json();
        expect(created.email).toBe(contactData.email);
        expect(created.id).toBeDefined();

        // Get By ID
        const getRes = await api.get(`/api/contacts/${created.id}`);
        expect(getRes.ok()).toBeTruthy();
        const retrieved = await getRes.json();
        expect(retrieved.email).toBe(contactData.email);
    });

    test('should list all contacts', async () => {
        // We know we created at least one above, but since we reset ONCE before ALL (in this file),
        // let's verify list contains something.
        // Actually, for true isolation we should reset before EACH test, or just trust the flow.
        // Let's create another one to be sure.
        await api.post('/api/contacts', { data: generateContact() });

        const listRes = await api.get('/api/contacts');
        expect(listRes.ok()).toBeTruthy();
        const list = await listRes.json();
        expect(Array.isArray(list)).toBeTruthy();
        expect(list.length).toBeGreaterThan(0);
    });
});
