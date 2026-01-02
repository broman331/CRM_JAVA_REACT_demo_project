import { test, expect, APIRequestContext } from '@playwright/test';
import { resetDatabase, createAuthenticatedContext } from './utils/setup';
import { generateDeal } from './utils/seeds';

test.describe('Search API', () => {
    let apiContext: APIRequestContext;
    let contactId: string;

    test.beforeAll(async () => {
        await resetDatabase();
        const result = await createAuthenticatedContext();
        apiContext = result.api;

        // Seed Data
        // Create 2 contacts
        const contact1 = await apiContext.post('/api/contacts', {
            data: { firstName: 'Alice', lastName: 'Smith', email: 'alice@test.com', phone: '111' }
        });
        const c1Data = await contact1.json();
        contactId = c1Data.id;

        await apiContext.post('/api/contacts', {
            data: { firstName: 'Bob', lastName: 'Jones', email: 'bob@test.com', phone: '222' }
        });

        // Create Deals
        // Deal 1: LEAD, 500
        await apiContext.post('/api/deals', {
            data: { ...generateDeal(c1Data.id, null), title: 'Small Deal', stage: 'LEAD', value: 500 }
        });
        // Deal 2: CLOSED_WON, 5000
        await apiContext.post('/api/deals', {
            data: { ...generateDeal(c1Data.id, null), title: 'Big Deal', stage: 'CLOSED_WON', value: 5000 }
        });
    });

    test('should search contacts by name (equality)', async () => {
        const res = await apiContext.get('/api/contacts?search=firstName:Alice');
        expect(res.ok()).toBeTruthy();
        const data = await res.json();
        expect(data).toHaveLength(1);
        expect(data[0].firstName).toBe('Alice');
    });

    test('should search contacts by partial match (if implemented strings use like)', async () => {
        // Our BaseSpecification uses LIKE for Strings if operation is ':'
        const res = await apiContext.get('/api/contacts?search=firstName:li');
        expect(res.ok()).toBeTruthy();
        const data = await res.json();
        expect(data.length).toBeGreaterThanOrEqual(1);
        expect(data[0].firstName).toBe('Alice');
    });

    test('should search deals by greater than value', async () => {
        const res = await apiContext.get('/api/deals?search=value>1000');
        expect(res.ok()).toBeTruthy();
        const data = await res.json();
        expect(data).toHaveLength(1);
        expect(data[0].value).toBe(5000);
    });

    test('should search deals by less than value', async () => {
        const res = await apiContext.get('/api/deals?search=value<1000');
        expect(res.ok()).toBeTruthy();
        const data = await res.json();
        expect(data).toHaveLength(1);
        expect(data[0].value).toBe(500);
    });

    test('should fail gracefully or return empty for no match', async () => {
        const res = await apiContext.get('/api/contacts?search=firstName:Xenomorph');
        expect(res.ok()).toBeTruthy();
        const data = await res.json();
        expect(data).toHaveLength(0);
    });
});
