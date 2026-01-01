import { test, expect, APIRequestContext } from '@playwright/test';
import { resetDatabase, createAuthenticatedContext } from './utils/setup';
import { generateContact, generateDeal, generateActivity } from './utils/seeds';

test.describe('Activities API', () => {
    let api: APIRequestContext;
    let contactId: string;
    let dealId: string;

    test.beforeAll(async () => {
        await resetDatabase();
        const context = await createAuthenticatedContext();
        api = context.api;

        // Setup dependencies
        const cRes = await api.post('/api/contacts', { data: generateContact() });
        contactId = (await cRes.json()).id;

        const dRes = await api.post('/api/deals', { data: generateDeal(contactId, '') });
        dealId = (await dRes.json()).id;
    });

    test('should create an activity', async () => {
        const act = generateActivity(contactId, dealId);
        const res = await api.post('/api/activities', { data: act });
        expect(res.ok()).toBeTruthy();
        const created = await res.json();
        expect(created.subject).toBe(act.subject);
        expect(created.completed).toBe(false);
    });

    test('should complete an activity', async () => {
        const act = generateActivity(contactId, dealId);
        const cRes = await api.post('/api/activities', { data: act });
        const created = await cRes.json();

        const patchRes = await api.patch(`/api/activities/${created.id}/complete`);
        expect(patchRes.ok()).toBeTruthy();
        const updated = await patchRes.json();
        expect(updated.completed).toBe(true);
    });
});
