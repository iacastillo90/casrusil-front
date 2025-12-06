import { apiClient } from '@/lib/axios';
import {
    AccountingEntry,
    BalanceSheet,
    F29Report,
    AuditAlert,
    LedgerFilters
} from '../types/accounting.types';

export const accountingService = {
    getLedger: async (filters: LedgerFilters = {}): Promise<AccountingEntry[]> => {
        const params = new URLSearchParams();
        if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
        if (filters.dateTo) params.append('dateTo', filters.dateTo);
        if (filters.accountCode) params.append('accountCode', filters.accountCode);

        const response = await apiClient.get<AccountingEntry[]>(`/accounting/entries?${params.toString()}`);
        return response.data;
    },

    getBalanceSheet: async (date: string): Promise<BalanceSheet> => {
        const response = await apiClient.get<BalanceSheet>(`/accounting/balance-sheet?date=${date}`);
        return response.data;
    },

    getF29: async (period: string): Promise<F29Report> => {
        const response = await apiClient.get<F29Report>(`/accounting/f29?period=${period}`);
        return response.data;
    },

    getAuditAlerts: async (): Promise<AuditAlert[]> => {
        const response = await apiClient.get<AuditAlert[]>('/accounting/audit');
        return response.data;
    }
};
