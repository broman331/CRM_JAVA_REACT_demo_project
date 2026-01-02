import { api } from '../../lib/api';

export interface Deal {
    id: string;
    title: string;
    value: number;
    companyName: string; // Flattened for display
    contact?: { id: string; firstName: string; lastName: string };
    contactId?: string; // For creation/updates
    stage: 'LEAD' | 'QUALIFIED' | 'PROPOSAL' | 'NEGOTIATION' | 'CLOSED_WON';
}

export const dealsApi = {
    getDeals: async (search?: string) => {
        const params = search ? { search } : {};
        const response = await api.get<Deal[]>('/deals', { params });
        return response.data;
    },

    createDeal: async (deal: Partial<Deal>) => {
        const response = await api.post('/deals', deal);
        return response.data;
    },

    updateDeal: async (id: string, deal: Partial<Deal>) => {
        const response = await api.put(`/deals/${id}`, deal);
        return response.data;
    },

    updateStage: async (id: string, stage: string) => {
        const response = await api.patch(`/deals/${id}/stage`, null, { params: { stage } }); // Fix param passing
        return response.data;
    },

    deleteDeal: async (id: string) => {
        await api.delete(`/deals/${id}`);
    }
};
