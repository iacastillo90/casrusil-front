import { apiClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/config/routes';

export interface Fee {
    id: string;
    folio: number;
    providerRut: string;
    providerName: string;
    date: string;
    grossAmount: number;
    retentionAmount: number; // 13.75% or 14.5%
    netAmount: number;
    companyId: string;
    status: 'VALID' | 'ANNULLED';
}

interface ImportFeesParams {
    file: File;
    companyId: string;
}

export const feeService = {
    getFees: async (params?: { companyId?: string; year?: number; month?: number }) => {
        const { data } = await apiClient.get<Fee[]>(API_ENDPOINTS.FEES.BASE, { params });
        return data;
    },

    importFees: async ({ file, companyId }: ImportFeesParams) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('companyId', companyId);

        const { data } = await apiClient.post(API_ENDPOINTS.FEES.IMPORT, formData);
        return data;
    },

    downloadDj1879: async (year: number) => {
        const response = await apiClient.get(API_ENDPOINTS.COMPLIANCE.DJ1879(year), {
            responseType: 'blob', // Important for file download
        });
        return response.data;
    },
};
