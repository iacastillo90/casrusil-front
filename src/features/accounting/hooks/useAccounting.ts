import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountingService } from '../services/accounting.service';
import { LedgerFilters } from '../types/accounting.types';

export const useLedger = (filters: LedgerFilters) => {
    return useQuery({
        queryKey: ['ledger', filters],
        queryFn: () => accountingService.getLedger(filters),
    });
};

export const useBalanceSheet = (date: string) => {
    return useQuery({
        queryKey: ['balance-sheet', date],
        queryFn: () => accountingService.getBalanceSheet(date),
        enabled: !!date,
    });
};

export const useF29 = (period: string) => {
    return useQuery({
        queryKey: ['f29', period],
        queryFn: () => accountingService.getF29(period),
        enabled: !!period,
    });
};

export const useAuditAlerts = () => {
    return useQuery({
        queryKey: ['audit-alerts'],
        queryFn: () => accountingService.getAuditAlerts(),
    });
};

export const useCleanupNovember = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: accountingService.cleanupNovemberEntries,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ledger'] });
            queryClient.invalidateQueries({ queryKey: ['balance-sheet'] });
        },
    });
};
