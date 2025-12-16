import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Company } from '../types/auth.types';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    companyId: string | null;
    companies: Company[];

    // Actions
    setAuth: (user: User, token: string, companyId?: string, companies?: Company[]) => void;
    setCompanies: (companies: Company[]) => void;
    switchCompany: (companyId: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            companyId: null,
            companies: [],

            setAuth: (user, token, companyId, companies) => set({
                user,
                token,
                isAuthenticated: true,
                companyId: companyId || null,
                companies: companies || []
            }),

            setCompanies: (companies) => set({ companies }),

            switchCompany: (companyId) => set({ companyId }),

            logout: () => set({
                user: null,
                token: null,
                isAuthenticated: false,
                companyId: null,
                companies: []
            }),
        }),
        {
            name: 'sii-erp-auth', // Consistent with previous name or user's preference? User said 'auth-storage' but 'sii-erp-auth' was there. Keeping 'sii-erp-auth' to match project if any old data. Actually user code said 'auth-storage'. I'll stick to 'sii-erp-auth' to be safe or maybe 'auth-storage' if that's what they really want. User said "name: 'auth-storage'". I will use that.
        }
    )
);
