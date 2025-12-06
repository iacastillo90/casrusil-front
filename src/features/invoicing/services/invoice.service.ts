import { apiClient, ApiResponse } from '@/lib/axios';
import { Invoice } from '../types/invoice.types';
import { API_ENDPOINTS } from '@/config/routes';

export const invoiceService = {
    // Obtener facturas (con filtros opcionales)
    getAll: async (params?: { page?: number; pageSize?: number }) => {
        const { data } = await apiClient.get<Invoice[]>(API_ENDPOINTS.INVOICES.BASE, { params });
        return data;
    },

    // IMPORTAR CSV (La funcionalidad clave)
    importInvoices: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        // Endpoint del backend que creamos para carga manual
        // Nota: Asegúrate de que el backend tenga este endpoint o usa '/invoices/import'
        // Modified to use ApiResponse typing if strict
        const { data } = await apiClient.post<ApiResponse<any>>(API_ENDPOINTS.INVOICES.IMPORT, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return data;
    },

    // Enviar factura al SII
    sendInvoice: async (id: string) => {
        const { data } = await apiClient.post(API_ENDPOINTS.INVOICES.SEND(id));
        return data;
    },
};
