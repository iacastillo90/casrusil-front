import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CompanyProfile, User, NotificationPreferences } from '../types/settings.types';
import { settingsService } from '../services/settings.service';

interface SettingsState {
    company: CompanyProfile;
    users: User[];
    notifications: NotificationPreferences;
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchSettings: () => Promise<void>;
    updateCompany: (data: FormData) => Promise<void>;
    inviteUser: (email: string, role: string, name?: string) => Promise<void>;
    removeUser: (id: string) => Promise<void>;
    updateNotifications: (data: NotificationPreferences) => Promise<void>;
    triggerReport: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set, get) => ({
            company: {
                name: '',
                rut: '',
                address: '',
                email: '',
                phone: '',
                website: '',
                isProfileComplete: false,
            },
            users: [],
            notifications: {
                email: true,
                push: true,
                marketing: false,
            },
            isLoading: false, // Don't persist loading state
            error: null,

            fetchSettings: async () => {
                set({ isLoading: true, error: null });
                try {
                    const [company, users, notifications] = await Promise.all([
                        settingsService.getCompanyProfile(),
                        settingsService.getUsersList(),
                        settingsService.getNotificationPreferences(),
                    ]);
                    set({ company, users, notifications, isLoading: false });
                } catch (error) {
                    console.error("Failed to fetch settings", error);
                    // Use fallback/mock data if backend fails for demo purposes or handle error properly
                    set({ isLoading: false, error: "Error al cargar configuración" });
                }
            },

            updateCompany: async (data: FormData) => {
                set({ isLoading: true, error: null });
                try {
                    const updatedCompany = await settingsService.updateCompanyProfile(data);
                    set((state) => ({ company: updatedCompany, isLoading: false }));
                } catch (error) {
                    set({ isLoading: false, error: "Error al actualizar compañía" });
                    throw error;
                }
            },

            inviteUser: async (email, role, name) => {
                set({ isLoading: true, error: null });
                try {
                    const newUser = await settingsService.inviteUser(email, role, name);
                    set((state) => ({ users: [...state.users, newUser], isLoading: false }));
                } catch (error) {
                    set({ isLoading: false, error: "Error al invitar usuario" });
                    throw error;
                }
            },

            removeUser: async (id) => {
                set({ isLoading: true });
                try {
                    await settingsService.removeUser(id);
                    set((state) => ({ users: state.users.filter((u) => u.id !== id), isLoading: false }));
                } catch (error) {
                    set({ isLoading: false, error: "Error al eliminar usuario" });
                    throw error;
                }
            },

            updateNotifications: async (data) => {
                // Optimistic update
                set((state) => ({ notifications: { ...state.notifications, ...data } }));
                try {
                    await settingsService.updateNotificationPreferences(data);
                } catch (error) {
                    // Revert on failure
                    console.error(error);
                    // Could re-fetch functionality here
                }
            },

            triggerReport: async () => {
                await settingsService.triggerWeeklyReport();
            }
        }),
        {
            name: 'settings-storage',
            partialize: (state) => ({
                // Persist company and notifications, but maybe not sensitive user lists or loading states
                company: state.company,
                notifications: state.notifications
            }),
        }
    )
);
