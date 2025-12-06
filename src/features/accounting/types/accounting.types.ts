export interface AccountingEntry {
    id: string;
    date: string;
    accountCode: string;
    accountName: string;
    debit: string; // BigDecimal as string
    credit: string;
    description: string;
    documentReference?: string;
}

export interface Account {
    id: string;
    code: string;
    name: string;
    type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'INCOME' | 'EXPENSE';
    parent?: string;
}

export interface BalanceSheetSection {
    accountCode: string;
    accountName: string;
    amount: string; // BigDecimal as string
    children?: BalanceSheetSection[];
}

export interface BalanceSheet {
    date: string;
    assets: BalanceSheetSection[];
    liabilities: BalanceSheetSection[];
    equity: BalanceSheetSection[];
}

export interface F29Report {
    period: string;
    sales: string;
    purchases: string;
    vatPayable: string;
    vatRecoverable: string;
    netVat: string;
    details: {
        code: string;
        description: string;
        amount: string;
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
