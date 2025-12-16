import api from "@/lib/axios";
import { useAuthStore } from '../stores/auth.store';
import { LoginCredentials, RegisterData, AuthResponse } from '../types/auth.types';
import Cookies from 'js-cookie';

export const authService = {
    login: async (credentials: LoginCredentials) => {
        const { data } = await api.post<AuthResponse>('/auth/login', credentials);
        authService.handleAuthSuccess(data, credentials.email);
        return data;
    },

    register: async (registerData: RegisterData) => {
        const { data } = await api.post<AuthResponse>('/auth/register', registerData);
        authService.handleAuthSuccess(data, registerData.adminEmail);
        return data;
    },

    handleAuthSuccess: (data: AuthResponse, email: string) => {
        if (data.token) {
            Cookies.set('token', data.token, { expires: 1 });

            const user = {
                id: data.userId,
                email: email,
                name: data.userName,
                role: 'ADMIN' as const
            };

            useAuthStore.getState().setAuth(
                user,
                data.token,
                data.companyId,
                [] // companies - not in flat response, sending empty array
            );

            // Legacy/Duplicate storage if needed, but store should handle it
            localStorage.setItem('user_data', JSON.stringify(user));
        }
    },

    logout: () => {
        Cookies.remove('token');
        useAuthStore.getState().logout();
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
    },

    // Company Management
    updateCompany: async (data: any) => {
        const { data: response } = await api.put('/companies/me', data);
        return response;
    },

    // User Management
    createUser: async (user: any) => {
        const { data } = await api.post('/users', user);
        return data;
    },

    updateUserRole: async (id: string, role: string) => {
        const { data } = await api.put(`/users/${id}/role`, { role });
        return data;
    }
};
