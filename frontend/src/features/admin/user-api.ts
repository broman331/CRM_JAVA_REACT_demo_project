import { api } from '../../lib/api';

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    roles: ('ADMIN' | 'SALES_REP' | 'MANAGER')[];
}

export const userApi = {
    getAll: async (): Promise<User[]> => {
        const response = await api.get('/users');
        return response.data;
    },

    create: async (user: Partial<User> & { password?: string }): Promise<User> => {
        const response = await api.post('/users', user);
        return response.data;
    },

    update: async (id: string, user: Partial<User>): Promise<User> => {
        const response = await api.put(`/users/${id}`, user);
        return response.data;
    },

    delete: async (id: string) => {
        await api.delete(`/users/${id}`);
    }
};
