import { api } from '../../lib/api';

export interface Company {
    id: string;
    name: string;
    industry?: string;
    website?: string;
    phone?: string;
}

export interface Contact {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    jobTitle?: string;
    companyId?: string;
    company?: Company;
}

export const crmApi = {
    getContacts: async (search?: string) => {
        const params = search ? { search } : {};
        const response = await api.get<Contact[]>('/contacts', { params });
        return response.data;
    },

    createContact: async (contact: Partial<Contact>) => {
        const response = await api.post('/contacts', contact);
        return response.data;
    },

    getContact: async (id: string) => {
        const response = await api.get<Contact>(`/contacts/${id}`);
        return response.data;
    },

    deleteContact: async (id: string) => {
        const response = await api.delete(`/contacts/${id}`);
        return response.data;
    },

    updateContact: async (id: string, contact: Partial<Contact>) => {
        const response = await api.put(`/contacts/${id}`, contact);
        return response.data;
    },

    // Company API
    getCompanies: async (search?: string) => {
        const params = search ? { search } : {};
        const response = await api.get('/companies', { params });
        return response.data;
    },

    createCompany: async (data: Partial<Company>) => {
        const response = await api.post('/companies', data);
        return response.data;
    },
    getCompany: async (id: string) => {
        const response = await api.get(`/companies/${id}`);
        return response.data;
    },
    updateCompany: async (id: string, data: Partial<Company>) => {
        const response = await api.put(`/companies/${id}`, data);
        return response.data;
    },
    deleteCompany: async (id: string) => {
        const response = await api.delete(`/companies/${id}`);
        return response.data;
    },
};

export const analyticsApi = {
    getRevenueOverTime: async () => {
        const response = await api.get<unknown[]>('/analytics/revenue');
        return response.data;
    },
    getPipelineDistribution: async () => {
        const response = await api.get<Record<string, number>>('/analytics/pipeline');
        return response.data;
    },
    getActivityVolume: async () => {
        const response = await api.get<unknown[]>('/analytics/activities');
        return response.data;
    }
};
