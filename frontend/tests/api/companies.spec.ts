import { test, expect, APIRequestContext } from '@playwright/test';
import { createAuthenticatedContext, resetDatabase } from './utils/setup';
import { generateCompany } from './utils/seeds';

test.describe('Companies API', () => {
    let api: APIRequestContext;

    test.beforeAll(async () => {
        await resetDatabase();
        const context = await createAuthenticatedContext() as unknown;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        api = (context as any).api; // Cast to any to access .api property after unknown
    });

    test('should create and retrieve a company', async () => {
        const companyData = generateCompany();
        const createRes = await api.post('/api/companies', { data: companyData });
        if (!createRes.ok()) {
            console.log('Create failed:', createRes.status(), createRes.statusText(), await createRes.text());
        }
        expect(createRes.ok()).toBeTruthy();
        const createdCompany = await createRes.json();
        expect(createdCompany.name).toBe(companyData.name);

        const getRes = await api.get(`/api/companies/${createdCompany.id}`);
        expect(getRes.ok()).toBeTruthy();
        const fetchedCompany = await getRes.json();
        expect(fetchedCompany.id).toBe(createdCompany.id);
    });

    test('should list all companies', async () => {
        await api.post('/api/companies', { data: generateCompany() });
        await api.post('/api/companies', { data: generateCompany() });

        const listRes = await api.get('/api/companies');
        expect(listRes.ok()).toBeTruthy();
        const companies = await listRes.json();
        expect(companies.length).toBeGreaterThanOrEqual(2);
    });
});
