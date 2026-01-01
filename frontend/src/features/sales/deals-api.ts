import { api } from '../../lib/api';

export interface Deal {
    id: string;
    title: string;
    value: string;
    companyName: string; // Flattened for display
    stage: 'LEAD' | 'QUALIFIED' | 'PROPOSAL' | 'NEGOTIATION' | 'CLOSED_WON';
}

export const dealsApi = {
    getDeals: async () => {
        const response = await api.get<Deal[]>('/deals');
        return response.data;
    },

    createDeal: async (deal: Partial<Deal>) => {
        const response = await api.post('/deals', deal);
        return response.data;
    },

    updateStage: async (id: string, stage: string) => {
        const response = await api.patch(`/deals/${id}/stage`, { stage });
        return response.data;
    }
};
