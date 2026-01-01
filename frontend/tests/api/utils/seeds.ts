import { randomUUID } from 'crypto';

export const generateUser = () => {
    const id = randomUUID().substring(0, 8);
    return {
        firstName: `Test`,
        lastName: `User-${id}`,
        email: `user-${id}@example.com`,
        password: 'password123',
    };
};

export const generateContact = () => {
    const id = randomUUID().substring(0, 8);
    return {
        firstName: `John`,
        lastName: `Doe-${id}`,
        email: `john-${id}@example.com`,
        phone: '+1234567890',
        jobTitle: 'Manager',
    };
};

export const generateCompany = () => ({
    name: `Company ${randomUUID().substring(0, 8)}`,
    industry: 'Technology',
    website: 'https://example.com',
    phone: '123-456-7890'
});

export const generateActivity = (dealId?: string, contactId?: string) => ({
    subject: `Call ${randomUUID().substring(0, 8)}`,
    description: 'Discuss project',
    type: 'CALL',
    dueDate: new Date().toISOString(),
    contactId,
    dealId,
});

export const generateDeal = (contactId: string, ownerId: string | null) => {
    return {
        title: `Deal ${randomUUID().substring(0, 8)}`,
        description: 'Test deal description',
        value: 1000 + Math.floor(Math.random() * 9000),
        stage: 'LEAD',
        contactId,
        ownerId: ownerId || undefined,
    };
};
