import { apiClient, ApiResponse } from "@/lib/axios";
import { User, Company } from "../stores/auth.store";
import { API_ENDPOINTS } from "@/config/routes";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    rut: string;
    razonSocial: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: User;
    companyId: string;
    companies: Company[];
}

export const authService = {
    login: async (credentials: LoginRequest): Promise<AuthResponse> => {
        const response = await apiClient.post<ApiResponse<AuthResponse>>(API_ENDPOINTS.AUTH.LOGIN, credentials);
        return response.data.data;
    },

    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        const response = await apiClient.post<ApiResponse<AuthResponse>>(API_ENDPOINTS.AUTH.REGISTER, data);
        console.log("Register response:", response.data);
        return response.data.data;
    }
};
