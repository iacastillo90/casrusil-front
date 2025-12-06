import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'ACCOUNTANT' | 'VIEWER';
    status: 'ACTIVE' | 'INVITED';
}

interface SettingsState {
    company: {
        name: string;
        rut: string;
        address: string;
        email: string;
        phone: string;
        website: string;
    };
    sii: {
        certificateUploaded: boolean;
        certificatePassword: string; // Mock, in real app this is sensitive
    };
    users: User[];
    notifications: {
        email: boolean;
        push: boolean;
        marketing: boolean;
    };

    // Actions
    updateCompany: (data: Partial<SettingsState['company']>) => void;
    updateSII: (data: Partial<SettingsState['sii']>) => void;
    addUser: (user: Omit<User, 'id' | 'status'>) => void;
    removeUser: (id: string) => void;
    updateNotifications: (data: Partial<SettingsState['notifications']>) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            company: {
                name: 'Mi Empresa SpA',
                rut: '76.123.456-7',
                address: 'Av. Providencia 1234, Of. 601',
                email: 'contacto@miempresa.cl',
                phone: '+56 9 1234 5678',
                website: 'www.miempresa.cl',
            },
            sii: {
                certificateUploaded: true,
                certificatePassword: '••••••••',
            },
            users: [
                { id: '1', name: 'Juan Pérez', email: 'juan@miempresa.cl', role: 'ADMIN', status: 'ACTIVE' },
                { id: '2', name: 'María González', email: 'maria@contadores.cl', role: 'ACCOUNTANT', status: 'ACTIVE' },
            ],
            notifications: {
                email: true,
                push: true,
                marketing: false,
            },

            updateCompany: (data) => set((state) => ({ company: { ...state.company, ...data } })),
            updateSII: (data) => set((state) => ({ sii: { ...state.sii, ...data } })),
            addUser: (user) => set((state) => ({
                users: [...state.users, { ...user, id: Math.random().toString(36).substring(7), status: 'INVITED' }]
            })),
            removeUser: (id) => set((state) => ({ users: state.users.filter((u) => u.id !== id) })),
            updateNotifications: (data) => set((state) => ({ notifications: { ...state.notifications, ...data } })),
        }),
        {
            name: 'settings-storage',
        }
    )
);
