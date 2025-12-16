import api from "@/lib/axios";
import { TaxAuditReport } from "../types/audit.types";

export const taxAuditService = {
    getReport: async (month: string): Promise<TaxAuditReport> => {
        // month format: YYYY-MM
        const response = await api.get<TaxAuditReport>(`/accounting/audit/report`, {
            params: { month }
        });
        return response.data;
    }
};
