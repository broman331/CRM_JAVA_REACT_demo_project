import { api } from '../../lib/api';

export interface Activity {
    id: string;
    subject: string;
    description: string;
    type: 'CALL' | 'MEETING' | 'TASK' | 'NOTE' | 'EMAIL';
    dueDate: string;
    completed: boolean;
    contactId?: string;
    dealId?: string;
    createdAt: string;
}

export const activitiesApi = {
    getAll: async (): Promise<Activity[]> => {
        const response = await api.get('/activities');
        return response.data;
    },

    create: async (activity: Partial<Activity>): Promise<Activity> => {
        const response = await api.post('/activities', activity);
        return response.data;
    },

    complete: async (id: string): Promise<Activity> => {
        const response = await api.patch(`/activities/${id}/complete`);
        return response.data;
    }
};
