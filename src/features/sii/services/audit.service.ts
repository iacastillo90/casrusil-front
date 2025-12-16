import api from "@/lib/axios";

export interface Discrepancy {
    id: string;
    period: string;
    documentType: string;
    documentNumber: string;
    supplier: string;
    rut: string;
    amountSii: number;
    amountErp: number;
    difference: number;
    status: "MATCH" | "MISSING_IN_ERP" | "MISSING_IN_SII" | "AMOUNT_MISMATCH" | "NO_CONTABILIZADO";
}

export interface AuditSummary {
    totalSii: number;
    totalErp: number;
    difference: number;
    matchRate: number;
    totalInvoicesSii: number;
    totalInvoicesErp: number;
}

export interface AuditReport {
    period: string; // YYYY-MM
    summary: AuditSummary;
    discrepancies: Discrepancy[];
}

export const auditService = {
    getAuditReport: async (year: number, month: number): Promise<AuditReport> => {
        // En una implementación real, esto llamaría al backend.
        // Por ahora, si falla o no hay backend, podríamos devolver mock data, 
        // pero la instrucción es "Implementar el flujo completo", así que intentamos el fetch.
        const response = await api.get<AuditReport>(`/sii/audit/report`, {
            params: { year, month }
        });
        return response.data;
    }
};
