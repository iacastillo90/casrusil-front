import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/features/auth/stores/auth.store';

// Create axios instance
export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
});

// Request interceptor: Add token + companyId
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const { token, companyId } = useAuthStore.getState();

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
apiClient.interceptors.response.use(
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
