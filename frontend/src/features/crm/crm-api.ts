import { api } from '../../lib/api';

export interface Contact {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    jobTitle?: string;
    company?: {
        id: string;
        name: string;
    };
}

export const crmApi = {
    getContacts: async () => {
        const response = await api.get<Contact[]>('/contacts');
        return response.data;
    },

    createContact: async (contact: Partial<Contact>) => {
        const response = await api.post('/contacts', contact);
        return response.data;
    },

    getContact: async (id: string) => {
        const response = await api.get<Contact>(`/contacts/${id}`);
        return response.data;
    }
};
