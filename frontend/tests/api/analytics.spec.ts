import { test, expect, APIRequestContext } from '@playwright/test';
import { resetDatabase, createAuthenticatedContext } from './utils/setup';
import { generateDeal } from './utils/seeds';

test.describe('Analytics API', () => {
    let apiContext: APIRequestContext;

    test.beforeAll(async () => {
        await resetDatabase();
        const result = await createAuthenticatedContext();
        apiContext = result.api;

        // Seed some data for analytics
        // Create 2 deals, 1 LEAD, 1 CLOSED_WON
        // Note: seeds might allow overriding stage? Activity volume relies on activities.

        // We'll trust the createAuthenticatedContext to setup a user who can create stuff.
        // Actually, we need to create deals to see pipeline stats.
        generateDeal(result.user.id || '', result.user.id || ''); // invalid contacts, but maybe ok for backend? 
        // Need a contact first
        const contactRes = await apiContext.post('/api/contacts', {
            data: { firstName: 'Test', lastName: 'Contact', email: 'test@contact.com', phone: '123' }
        });
        const contact = await contactRes.json();

        // Create Deals
        await apiContext.post('/api/deals', {
            data: { ...generateDeal(contact.id, null), stage: 'LEAD', value: 5000 }
        });
        await apiContext.post('/api/deals', {
            data: { ...generateDeal(contact.id, null), stage: 'CLOSED_WON', value: 10000 }
        });

        // Create deals with different stages
        await apiContext.post('/api/deals', {
            data: {
                title: 'Deal Won',
                value: 5000,
                stage: 'CLOSED_WON',
                pipelineId: 'default'
            }
        });

        // Create Activity
        await apiContext.post('/api/activities', {
            data: {
                subject: 'Test Activity', description: 'desc', type: 'CALL',
                dueDate: new Date().toISOString(), contactId: contact.id
            }
        });
    });

    test('should return revenue stats', async () => {
        const res = await apiContext.get('/api/analytics/revenue');
        expect(res.ok()).toBeTruthy();
        const data = await res.json();
        expect(Array.isArray(data)).toBeTruthy();
        // Since we created deals, we might expect some entries, but simple array check is baseline.
        // data structure: [{date: 'YYYY-MM-DD', value: 10000}]
    });

    test('should return pipeline distribution', async () => {
        const res = await apiContext.get('/api/analytics/pipeline');
        expect(res.ok()).toBeTruthy();
        const data = await res.json();
        // Expected: { LEAD: 1, CLOSED_WON: 1 } (numbers might vary if cleaned properly)
        // But keys should be stages.
        expect(data).toHaveProperty('LEAD');
        expect(data).toHaveProperty('CLOSED_WON');
    });

    test('should return activity volume', async () => {
        const res = await apiContext.get('/api/analytics/activities');
        expect(res.ok()).toBeTruthy();
        const data = await res.json();
        expect(Array.isArray(data)).toBeTruthy();
        // data structure: [{date: 'YYYY-MM-DD', count: 1}]
    });
});
