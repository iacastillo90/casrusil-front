import api from "@/lib/axios";
import { CompanyProfile, User, NotificationPreferences } from "../types/settings.types";

export const settingsService = {
    // Company Profile
    updateCompanyProfile: async (data: FormData): Promise<CompanyProfile> => {
        // Use FormData to support logo upload
        const { data: response } = await api.put<CompanyProfile>('/company/profile', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    },

    getCompanyProfile: async (): Promise<CompanyProfile> => {
        const { data } = await api.get<CompanyProfile>('/company/profile');
        return data;
    },

    // User Management
    getUsersList: async (): Promise<User[]> => {
        const { data } = await api.get<User[]>('/company/users');
        return data;
    },

    inviteUser: async (email: string, role: string, name?: string): Promise<User> => {
        const { data } = await api.post<User>('/company/users/invite', { email, role, name });
        return data;
    },

    removeUser: async (userId: string): Promise<void> => {
        await api.delete(`/company/users/${userId}`);
    },

    // Notifications
    updateNotificationPreferences: async (prefs: NotificationPreferences): Promise<NotificationPreferences> => {
        const { data } = await api.put<NotificationPreferences>('/notifications/preferences', prefs);
        return data;
    },

    getNotificationPreferences: async (): Promise<NotificationPreferences> => {
        const { data } = await api.get<NotificationPreferences>('/notifications/preferences');
        return data;
    },

    triggerWeeklyReport: async (): Promise<void> => {
        await api.post('/notifications/trigger-report');
    }
};
