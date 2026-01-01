import { test, expect, APIRequestContext } from '@playwright/test';
import { resetDatabase, createAuthenticatedContext } from './utils/setup';
import { generateActivity } from './utils/seeds';

test.describe('Timeline API', () => {
    let apiContext: APIRequestContext;

    test.beforeAll(async () => {
        await resetDatabase();
        const auth = await createAuthenticatedContext();
        apiContext = auth.api;
        userId = auth.user.id;
    });

    test('should fetch timeline for a contact', async () => {
        // 1. Create a contact
        const contactResponse = await apiContext.post('/api/contacts', {
            data: {
                firstName: 'Timeline',
                lastName: 'Test',
                email: 'timeline@example.com'
            }
        });
        const contact = await contactResponse.json();
        const contactId = contact.id;

        // 2. Create activities for the contact
        const activity1 = generateActivity();
        activity1.contactId = contactId;
        activity1.subject = "First Activity";
        await apiContext.post('/api/activities', { data: activity1 });

        // Wait a bit to ensure unique timestamps if DB precision is low
        await new Promise(resolve => setTimeout(resolve, 100));

        const activity2 = generateActivity();
        activity2.contactId = contactId;
        activity2.subject = "Second Activity";
        await apiContext.post('/api/activities', { data: activity2 });

        // 3. Fetch timeline
        const timelineResponse = await apiContext.get(`/api/timeline/contact/${contactId}`);
        expect(timelineResponse.status()).toBe(200);
        const timeline = await timelineResponse.json();

        expect(Array.isArray(timeline)).toBe(true);
        expect(timeline.length).toBe(2);
        // Should be sorted desc by createdAt
        expect(timeline[0].subject).toBe("Second Activity");
        expect(timeline[1].subject).toBe("First Activity");
    });

    test('should fetch timeline for a deal', async () => {
        // 1. Create a contact first (required for deal)
        const contactResponse = await apiContext.post('/api/contacts', {
            data: {
                firstName: 'Deal',
                lastName: 'Contact',
                email: 'deal.contact@example.com'
            }
        });
        expect(contactResponse.ok()).toBeTruthy();
        const contact = await contactResponse.json();
        const contactId = contact.id;

        // 2. Create a deal associated with the contact
        const dealResponse = await apiContext.post('/api/deals', {
            data: {
                title: 'Timeline Deal',
                value: 5000,
                stage: 'LEAD',
                contactId: contactId
            }
        });
        expect(dealResponse.ok()).toBeTruthy();
        const deal = await dealResponse.json();
        const dealId = deal.id;

        // 3. Create activities for the deal
        const activity = generateActivity();
        activity.dealId = dealId;
        activity.subject = "Deal Activity";
        const actResponse = await apiContext.post('/api/activities', { data: activity });
        expect(actResponse.ok()).toBeTruthy();

        // 4. Fetch timeline
        const timelineResponse = await apiContext.get(`/api/timeline/deal/${dealId}`);
        expect(timelineResponse.status()).toBe(200);
        const timeline = await timelineResponse.json();

        expect(timeline.length).toBe(1);
        expect(timeline[0].subject).toBe("Deal Activity");
    });

    test('should return empty list for invalid entity type', async () => {
        const response = await apiContext.get('/api/timeline/unknown/00000000-0000-0000-0000-000000000000');
        expect(response.status()).toBe(200);
        const data = await response.json();
        expect(data).toEqual([]);
    });
});
