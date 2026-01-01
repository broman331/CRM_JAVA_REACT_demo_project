import { test, expect, APIRequestContext } from '@playwright/test';
import { resetDatabase, createAuthenticatedContext } from './utils/setup';
import { generateContact, generateDeal } from './utils/seeds';

test.describe('Deals API', () => {
    let api: APIRequestContext;
    let contactId: string;
    let ownerId: string;

    test.beforeAll(async () => {
        await resetDatabase();
        const context = await createAuthenticatedContext();
        api = context.api;
        ownerId = context.user.id || 'unknown'; // Note: Register response usually gives ID. 
        // But setup.ts doesn't return user ID from register body yet.
        // We might need to fetch me or just ignore owner verification for now if optional.

        // Create a common contact for deals
        const cRes = await api.post('/api/contacts', { data: generateContact() });
        const c = await cRes.json();
        contactId = c.id;
    });

    test('should create a deal', async () => {
        const dealData = generateDeal(contactId, ownerId); // ownerId might be null/string
        const res = await api.post('/api/deals', { data: dealData });
        expect(res.ok()).toBeTruthy();
        const created = await res.json();
        expect(created.value).toBe(dealData.value);
        expect(created.stage).toBe('LEAD');
    });

    test('should update deal stage', async () => {
        // Create
        const dealData = generateDeal(contactId, ownerId);
        const createRes = await api.post('/api/deals', { data: dealData });
        const deal = await createRes.json();

        // Update
        const updateRes = await api.patch(`/api/deals/${deal.id}/stage?stage=CLOSED_WON`);
        expect(updateRes.ok()).toBeTruthy();
        const updated = await updateRes.json();
        expect(updated.stage).toBe('CLOSED_WON');
    });
});
