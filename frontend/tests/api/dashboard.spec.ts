import { test, expect, APIRequestContext } from '@playwright/test';
import { resetDatabase, createAuthenticatedContext } from './utils/setup';
import { generateContact, generateDeal } from './utils/seeds';

test.describe('Dashboard API', () => {
    let api: APIRequestContext;

    test.beforeEach(async () => {
        // Reset before each here to ensure stats are deterministic
        await resetDatabase();
        const context = await createAuthenticatedContext();
        api = context.api;
    });

    test('should return correct stats', async () => {
        // 1. Initial State -> 0
        const initialRes = await api.get('/api/dashboard/stats');
        const initial = await initialRes.json();
        expect(initial.totalRevenue).toBe(0);
        expect(initial.activeDeals).toBe(0);
        expect(initial.newContacts).toBe(0); // Assuming user themselves doesn't count as contact

        // 2. Add Data
        const cRes = await api.post('/api/contacts', { data: generateContact() });
        const contactId = (await cRes.json()).id;

        const deal1 = generateDeal(contactId, '');
        deal1.value = 1000;
        await api.post('/api/deals', { data: deal1 });

        const deal2 = generateDeal(contactId, '');
        deal2.value = 2000;
        await api.post('/api/deals', { data: deal2 });

        // 3. Verify Stats
        const finalRes = await api.get('/api/dashboard/stats');
        const final = await finalRes.json();

        expect(final.newContacts).toBe(1);
        expect(final.activeDeals).toBe(2);
        // Revenue typically sums all deals or just closed won? 
        // Based on controller logic: "dealService.calculateTotalRevenue()" usually sums all or distinct stage. 
        // Let's assume it sums all for now based on previous `view_file` of `DealService.java`.
        // Checked DealService.java: `return dealRepository.findAll().stream().map(Deal::getValue)...` 
        // So it sums ALL deals regardless of stage.
        expect(final.totalRevenue).toBe(3000);
    });
});
