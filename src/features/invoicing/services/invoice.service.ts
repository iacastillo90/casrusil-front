import { apiClient, ApiResponse } from '@/lib/axios';
import { Invoice, GetInvoicesResponse, CreateInvoiceRequest } from '../types/invoice.types';
import { API_ENDPOINTS } from '@/config/routes';

interface ImportInvoiceParams {
    file: File;
    companyId: string;
    bookType: 'PURCHASE' | 'SALE';
}

export const invoiceService = {
    getAll: async (params?: { page?: number; pageSize?: number }) => {
        const { data } = await apiClient.get<Invoice[]>(API_ENDPOINTS.INVOICES.BASE, { params });
        return data;
    },

    getInvoices: async (params: any) => {
        const { data } = await apiClient.get<GetInvoicesResponse>(API_ENDPOINTS.INVOICES.BASE, { params });
        return data;
    },

    getInvoiceById: async (id: string) => {
        const { data } = await apiClient.get<Invoice>(`${API_ENDPOINTS.INVOICES.BASE}/${id}`);
        return data;
    },

    createInvoice: async (data: CreateInvoiceRequest) => {
        const { data: response } = await apiClient.post<Invoice>(API_ENDPOINTS.INVOICES.BASE, data);
        return response;
    },

    importInvoices: async ({ file, companyId, bookType }: ImportInvoiceParams) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('companyId', companyId);
        formData.append('bookType', bookType);

        const { data } = await apiClient.post(API_ENDPOINTS.INVOICES.IMPORT, formData);
        return data;
    },

    // Enviar factura al SII
    sendInvoice: async (id: string) => {
        const { data } = await apiClient.post(API_ENDPOINTS.INVOICES.SEND(id));
        return data;
    },
};
