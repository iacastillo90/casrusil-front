import { z } from "zod";

export interface CompanyProfile {
    name: string;
    rut: string;
    address: string;
    email: string;
    phone: string;
    website: string;
    logoUrl?: string;
    isProfileComplete: boolean;
}

export interface UserInvitation {
    email: string;
    role: 'ADMIN' | 'ACCOUNTANT' | 'VIEWER';
    name?: string; // Optional for invitation, required for User
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'ACCOUNTANT' | 'VIEWER';
    status: 'ACTIVE' | 'INVITED' | 'PENDING';
    isCurrentUser?: boolean; // For "You" marker
}

export interface NotificationPreferences {
    email: boolean;
    push: boolean;
    marketing: boolean;
}

// Zod Schemas
export const companyProfileSchema = z.object({
    name: z.string().min(2, "La razón social es requerida"),
    rut: z.string().regex(/^(\d{1,3}(?:\.\d{3})*)-[\dkK]$/, "RUT inválido (ej: 76.123.456-K)"),
    address: z.string().min(5, "La dirección es requerida"),
    email: z.string().email("Email inválido"),
    phone: z.string().min(8, "Teléfono inválido"),
    website: z.string().url("URL inválida").optional().or(z.literal("")),
});

export const inviteUserSchema = z.object({
    email: z.string().email("Email inválido"),
    role: z.enum(['ADMIN', 'ACCOUNTANT', 'VIEWER']),
    name: z.string().min(2, "Nombre requerido").optional(),
});
