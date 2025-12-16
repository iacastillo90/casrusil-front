import { apiClient } from '@/lib/axios';

export interface SIISyncResponse {
    message: string;
    documentsSynced: number;
}

export interface CAFUploadResponse {
    message: string;
    folioRange: {
        start: number;
        end: number;
    };
}

export const siiService = {
    /**
     * Trigger manual RCV fetch from SII
     */
    fetchRCV: async (period?: string): Promise<SIISyncResponse> => {
        // period format: YYYY-MM (optional, defaults to current in backend usually)
        const payload = period ? { period } : {};
        const { data } = await apiClient.post<SIISyncResponse>('/sii/ops/fetch-rcv', payload);
        return data;
    },

    /**
     * Upload CAF XML file
     */
    uploadCAF: async (file: File): Promise<CAFUploadResponse> => {
        const formData = new FormData();
        formData.append('file', file);

        const { data } = await apiClient.post<CAFUploadResponse>('/sii/caf', formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return data;
    },

    /**
     * Check DTE Status with SII (Extra utility)
     */
    checkStatus: async (trackId: string) => {
        const { data } = await apiClient.get(`/sii/dte/${trackId}/status`);
        return data;
    }
};
