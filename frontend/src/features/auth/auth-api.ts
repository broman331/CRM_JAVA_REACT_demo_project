import { api } from '../../lib/api';
import { useAuthStore } from './authStore';

export const authApi = {
    login: async (email: string, password: string) => {
        const response = await api.post('/auth/login', { email, password });
        useAuthStore.getState().setToken(response.data.token);
        // Fetch user details or decode token if needed
        // useAuthStore.getState().setUser(decodedUser);
        return response.data;
    },

    register: async (data: Record<string, string>) => {
        const response = await api.post('/auth/register', data);
        return response.data;
    }
};
