import { api } from '../lib/api';

export interface DashboardStats {
    totalRevenue: number;
    activeDeals: number;
    newContacts: number;
    upcomingTasks: number;
}

export const dashboardApi = {
    getStats: async (): Promise<DashboardStats> => {
        const response = await api.get('/dashboard/stats');
        return response.data;
    }
};
