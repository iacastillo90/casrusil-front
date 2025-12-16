export interface AuditDiscrepancy {
    type: 'COMPRA' | 'VENTA';
    date: string;          // YYYY-MM-DD
    counterpart: string;   // Nombre/RazÃ³n Social
    folio: number;
    amountSii: number;
    amountErp: number;
    status: string;        // e.g., "MATCH", "MISSING_IN_ERP", "MISSING_IN_SII"
}

export interface AuditSummary {
    totalNet: number;
    totalTax: number;
    totalDocs: number;
    matchRate: number; // %
    missingInErp: number;
    missingInSii: number;
}

export interface TaxAuditReport {
    summary: {
        sales: AuditSummary;
        purchases: AuditSummary;
    };
    discrepancies: AuditDiscrepancy[];
}
