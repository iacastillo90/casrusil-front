import api from "@/lib/axios";

export interface BankTransactionDto {
    id: string;
    date: string;
    description: string;
    amount: number;
    reference: string;
    reconciled: boolean;
}

export interface ReconciliationStatusResponse {
    unreconciledCount: number;
    suggestedMatches: any[];
    unreconciledTransactions: BankTransactionDto[];
}

export interface DailyDataPoint {
    date: string; // YYYY-MM-DD
    income: number;
    expense: number;
    balance: number;
}

export interface DailyCashFlowResponse {
    days: DailyDataPoint[];
    totalIncome: number;
    totalExpense: number;
}

export const treasuryService = {
    uploadBankStatement: async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        // Llamada al endpoint real que arreglamos
        const response = await api.post<{ message: string; transactionsCount: number }>(
            "/bank/upload",
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
        return response.data;
    },

    getReconciliationStatus: async () => {
        // Llamada para obtener los movimientos pendientes
        const response = await api.get<ReconciliationStatusResponse>("/bank/reconciliation");
        return response.data;
    },

    // ✅ FIX: Alias para compatibilidad con componentes legacy (BankMatcher)
    getWorkbench: async () => {
        return treasuryService.getReconciliationStatus();
    },

    // ✅ Nuevo método (diario)
    getDailyCashFlow: async (year: number, month: number) => {
        const response = await api.get<DailyCashFlowResponse>(`/treasury/cash-flow-daily`, {
            params: { year, month }
        });
        return response.data;
    },

    getLiquidityKPIs: async (year: number, month: number) => {
        const response = await api.get<LiquidityRatiosResponse>(`/treasury/financial-ratios`, {
            params: { year, month }
        });
        return response.data;
    }
};

// Interfaces para KPIs
export interface LiquidityRatio {
    value: number;
    trend: number; // Variación respecto al periodo anterior (+0.2, -0.1, etc.)
    status: 'good' | 'warning' | 'critical';
}

export interface LiquidityRatiosResponse {
    currentRatio: LiquidityRatio;  // Razón Corriente
    acidTest: LiquidityRatio;      // Prueba Ácida
    workingCapital: LiquidityRatio; // Capital de Trabajo
    daysCashOnHand: number;        // Días de caja (extra)
}
