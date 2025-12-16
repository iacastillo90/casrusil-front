import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { useAuthStore } from '@/features/auth/stores/auth.store';

// Asegúrate de que apunte al BACKEND (puerto 8080), no al frontend
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// Create axios instance
const api = axios.create({
    baseURL: BASE_URL,
    // headers: {
    //     'Content-Type': 'application/json',
    // },
    withCredentials: true, // Importante para que coincida con el backend allowCredentials(true)
    timeout: 30000,
});

// Alias for backward compatibility if needed, but 'api' is the main export now.
export const apiClient = api;

// Request interceptor: Add token + companyId
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Prioritize cookie for token to match middleware logic
        const token = Cookies.get('token');
        const { companyId } = useAuthStore.getState();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (companyId) {
            config.headers['X-Company-Id'] = companyId;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: Handle 401 (auto logout)
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const { logout } = useAuthStore.getState();

        if (error.response?.status === 401) {
            logout();
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }

        // Format error message
        const message =
            (error.response?.data as any)?.message ||
            error.message ||
            'Ocurrió un error inesperado';

        return Promise.reject(new Error(message));
    }
);

export default api;

// Helper types
export interface ApiResponse<T = any> {
    data: T;
    message?: string;
    success: boolean;
}

export interface ApiError {
    message: string;
    code?: string;
    details?: Record<string, any>;
}
