import { z } from 'zod';
import { validateRut } from './formatters';

// Auth schemas
export const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
});

export const registerSchema = z.object({
    rut: z.string().refine(validateRut, 'RUT inválido'),
    razonSocial: z.string().min(3, 'Mínimo 3 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(8, 'Mínimo 8 caracteres'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
});

// Invoice schemas
export const invoiceLineSchema = z.object({
    description: z.string().min(1, 'Descripción requerida'),
    quantity: z.number().positive('Cantidad debe ser positiva'),
    unitPrice: z.string().refine(
        (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
        'Precio debe ser positivo'
    ),
});

export const invoiceSchema = z.object({
    type: z.number(),
    folio: z.number().positive(),
    issuerRut: z.string().refine(validateRut, 'RUT emisor inválido'),
    recipientRut: z.string().refine(validateRut, 'RUT receptor inválido'),
    recipientName: z.string().min(3, 'Nombre receptor requerido'),
    issueDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Fecha inválida'),
    lines: z.array(invoiceLineSchema).min(1, 'Debe haber al menos una línea'),
});

// Company schema
export const companySchema = z.object({
    rut: z.string().refine(validateRut, 'RUT inválido'),
    razonSocial: z.string().min(3, 'Mínimo 3 caracteres'),
    email: z.string().email('Email inválido').optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
});

// User schema
export const userSchema = z.object({
    email: z.string().email('Email inválido'),
    name: z.string().min(2, 'Mínimo 2 caracteres'),
    role: z.enum(['ADMIN', 'ACCOUNTANT', 'USER']),
    password: z.string().min(8, 'Mínimo 8 caracteres').optional(),
});

// Period schema
export const periodSchema = z.string().regex(
    /^\d{6}$/,
    'Formato debe ser YYYYMM (ej: 202401)'
);

// Date range schema
export const dateRangeSchema = z.object({
    from: z.string().refine((date) => !isNaN(Date.parse(date)), 'Fecha desde inválida'),
    to: z.string().refine((date) => !isNaN(Date.parse(date)), 'Fecha hasta inválida'),
}).refine((data) => new Date(data.from) <= new Date(data.to), {
    message: 'Fecha desde debe ser menor o igual a fecha hasta',
    path: ['to'],
});
