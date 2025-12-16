import { apiClient } from '@/lib/axios';
import {
    AccountingEntry,
    BalanceSheetData,
    F29Report,
    AuditAlert,
    LedgerFilters,
    IncomeStatementData,
    TaxReconciliationDetail
} from '../types/accounting.types';

export const accountingService = {
    getTaxReconciliation: async (period: string): Promise<TaxReconciliationDetail[]> => {
        const { data } = await apiClient.get(`/audit/reconciliation`, {
            params: { period }
        });
        return data;
    },

    getLedger: async (filters: LedgerFilters = {}): Promise<AccountingEntry[]> => {
        const params = new URLSearchParams();
        if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
        if (filters.dateTo) params.append('dateTo', filters.dateTo);
        if (filters.accountCode) params.append('accountCode', filters.accountCode);

        const response = await apiClient.get<AccountingEntry[]>(`/accounting/entries?${params.toString()}`);
        return response.data;
    },

    getBalanceSheet: async (date: string): Promise<BalanceSheetData> => {
        const response = await apiClient.get<BalanceSheetData>(`/accounting/balance-sheet?date=${date}`);
        return response.data;
    },

    getF29: async (period: string): Promise<F29Report> => {
        const response = await apiClient.get<F29Report>(`/accounting/f29?period=${period}`);
        return response.data;
    },

    getAuditAlerts: async (): Promise<AuditAlert[]> => {
        const response = await apiClient.get<any>('/audit/alerts');
        return response.data.alerts;
    },
    // Nuevo método para cargar el asiento de apertura
    setOpeningBalance: async (items: { accountCode: string; accountName: string; debit: number; credit: number }[]) => {
        // Envía el array de items al endpoint del backend
        await apiClient.post('/accounting/opening-balance', items);
    },

    // Accounts Management
    createAccount: async (account: any) => {
        const { data } = await apiClient.post('/accounting/accounts', account);
        return data;
    },

    getAccounts: async () => {
        const { data } = await apiClient.get('/accounting/accounts');
        return data;
    },

    // Partner Ledger (Cuentas Corrientes)
    getPartnerSummary: async (type: 'CUSTOMER' | 'SUPPLIER' = 'CUSTOMER') => {
        const { data } = await apiClient.get('/accounting/ledger/partners', {
            params: { type }
        });
        return data;
    },

    getPartnerMovements: async (rut: string) => {
        const { data } = await apiClient.get(`/accounting/ledger/partners/${rut}/movements`);
        return data;
    },

    // Month Closing
    closePeriod: async (period: string) => {
        const { data } = await apiClient.post('/accounting/periods/close', { period });
        return data;
    },

    getClosedPeriods: async () => {
        const { data } = await apiClient.get('/accounting/periods/closed');
        return data;
    },

    // Advanced Audit
    getSiiMirrorReport: async () => {
        const { data } = await apiClient.get('/accounting/audit/sii-mirror');
        return data;
    },

    getDuplicateInvoices: async () => {
        const { data } = await apiClient.get('/audit/duplicates');
        return data;
    },

    // Financial Reports
    getIncomeStatement: async (month: number | undefined, year: number): Promise<IncomeStatementData> => {
        const params: any = { year };
        if (month) params.month = month;

        const { data } = await apiClient.get('/accounting/reports/income-statement', {
            params
        });
        return data;
    },

    // Utilities
    cleanupNovemberEntries: async () => {
        await apiClient.post('/accounting/cleanup/november-rcv');
    }
};

export const getTaxReconciliation = accountingService.getTaxReconciliation;
