export interface InvoiceLine {
    id: string;
    description: string;
    quantity: number;
    unitPrice: string; // BigDecimal as string
    lineTotal: string;
}

export interface Invoice {
    id: string;
    companyId: string;
    type: number;
    folio: number;
    issuerRut: string;
    recipientRut: string;
    recipientName: string;
    issueDate: string; // ISO date
    netAmount: string; // BigDecimal as string
    taxAmount: string;
    totalAmount: string;
    status: 'DRAFT' | 'SIGNED' | 'SENT' | 'ACCEPTED' | 'REJECTED';
    lines: InvoiceLine[];
}

export interface GetInvoicesResponse {
    invoices: Invoice[];
    total: number;
    page: number;
    pageSize: number;
}

export interface CreateInvoiceRequest {
    type: number;
    folio: number;
    issuerRut: string;
    recipientRut: string;
    recipientName: string;
    issueDate: string;
    lines: {
        description: string;
        quantity: number;
        unitPrice: string;
    }[];
}

export interface InvoiceFilters {
    folio?: string;
    dateFrom?: string;
    dateTo?: string;
    status?: string;
    page?: number;
    pageSize?: number;
}

export interface ReportItem {
    date: string;
    description: string;
    amount: number;
}
