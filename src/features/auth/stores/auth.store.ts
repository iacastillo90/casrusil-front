import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
    id: string;
    email: string;
    name: string;
    role: 'ADMIN' | 'ACCOUNTANT' | 'USER';
}

export interface Company {
    id: string;
    rut: string;
    razonSocial: string;
}

interface AuthState {
    token: string | null;
    user: User | null;
    companyId: string | null;
    companies: Company[];

    // Actions
    setAuth: (token: string, user: User, companyId: string) => void;
    setCompanies: (companies: Company[]) => void;
    switchCompany: (companyId: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            companyId: null,
            companies: [],

            setAuth: (token, user, companyId) =>
                set({ token, user, companyId }),

            setCompanies: (companies) =>
                set({ companies }),

            switchCompany: (companyId) =>
                set({ companyId }),

            logout: () =>
                set({ token: null, user: null, companyId: null, companies: [] }),
        }),
        {
            name: 'sii-erp-auth',
            partialize: (state) => ({
                token: state.token,
                user: state.user,
                companyId: state.companyId,
                companies: state.companies,
            }),
        }
    )
);
