
export interface AccountingEntryLine {
    id: string;
    accountCode: string;
    accountName: string;
    debit: number;
    credit: number;
}

export interface AccountingEntry {
    id: string;
    companyId: string;
    entryDate: string; // YYYY-MM-DD
    description: string;
    totalAmount: number;
    status: 'DRAFT' | 'POSTED' | 'VOID';

    // Metadata
    referenceId?: string;   // Folio (antes documentNumber)
    referenceType?: string; // (antes documentType)

    // SII Data
    taxPayerId?: string;      // RUT
    taxPayerName?: string;    // Razón Social

    lines: AccountingEntryLine[];
}

export interface Account {
    id: string;
    code: string;
    name: string;
    type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'INCOME' | 'EXPENSE';
    parent?: string;
}

export interface AccountBalance {
    accountCode: string;
    accountName: string;
    balance: number;
    level: number; // 1, 2, 3, 4
    children: AccountBalance[]; // Estructura recursiva
}

export interface BalanceSheetData {
    date: string;
    totalAssets: number;
    totalLiabilities: number;
    totalEquity: number;
    // Estos son los nombres exactos que suelen fallar en el mapeo
    assetAccounts: AccountBalance[];
    liabilityAccounts: AccountBalance[];
    equityAccounts: AccountBalance[];
}

export interface F29Report {
    period: string;
    totalSales: number;
    totalPurchases: number;
    vatPayable: number;
    totalPayable: number;
    details: {
        code: string;
        description: string;
        amount: number;
    }[];
}

export interface AuditAlert {
    id: string;
    type: 'DUPLICATE' | 'SUSPICIOUS_AMOUNT' | 'MISSING_ACCOUNT' | 'UNBALANCED';
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    description: string;
    affectedEntries: string[];
    suggestedAction?: string;
}

export interface LedgerFilters {
    dateFrom?: string;
    dateTo?: string;
    accountCode?: string;
}

export interface IncomeStatementData {
    period: { month: number; year: number };
    totalRevenue: number;
    totalCostOfSales: number;
    grossProfit: number;
    totalOperatingExpenses: number;
    netIncome: number;
    netIncomeMargin: number;
    revenueBreakdown: Array<{ accountName: string; amount: number; percentage: number }>;
    expenseBreakdown: Array<{ accountName: string; amount: number; percentage: number }>;
    aiAnalysis: string; // El texto generado por la IA
}

export type ReconciliationStatus = 'MATCH' | 'MISSING_IN_ERP' | 'MISSING_IN_SII' | 'MISMATCH';

export interface TaxReconciliationDetail {
    id: string;
    period: string;
    documentType: string;
    folio: number;
    counterpartRut: string;
    counterpartName: string; // ✅ Razón Social
    amountSii: number;
    amountErp: number;
    status: ReconciliationStatus;
    difference: number;
    tags?: string[];
}

export interface AuditStats {
    totalSii: number;
    totalErp: number;
    matchRate: number;
    docCount: number;
}
