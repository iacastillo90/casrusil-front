import { create } from 'zustand';
import { treasuryService, BankTransactionDto, DailyCashFlowResponse, LiquidityRatiosResponse } from '../services/treasury.service';

// Definir interfaz para match
export interface ReconciliationMatch {
    bankTransactionId: string;
    accountingEntryId: string;
    confidenceScore: number;
    matchReason: string;
}

interface TreasuryState {
    bankLines: BankTransactionDto[];
    suggestedMatches: ReconciliationMatch[];
    isLoading: boolean;
    error: string | null;

    // Nuevo estado
    dailyCashFlowData: DailyCashFlowResponse | null;
    liquidityData: LiquidityRatiosResponse | null; // ✅ Datos de KPIs
    selectedDate: { year: number; month: number };

    fetchTransactions: () => Promise<void>;
    fetchTreasuryData: () => Promise<void>; // Alias compatible
    uploadStatement: (file: File) => Promise<void>;

    // Nuevas acciones
    setCashFlowDate: (year: number, month: number) => void;
    fetchDailyCashFlow: () => Promise<void>;
    fetchLiquidityKPIs: () => Promise<void>; // ✅ Acción para KPIs
}

export const useTreasuryStore = create<TreasuryState>((set, get) => ({
    bankLines: [],
    suggestedMatches: [],
    isLoading: false,
    error: null,

    dailyCashFlowData: null,
    liquidityData: null,
    selectedDate: {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1
    },

    setCashFlowDate: (year, month) => {
        set({ selectedDate: { year, month } });
        // Recargar dashboard completo
        get().fetchDailyCashFlow();
        get().fetchLiquidityKPIs();
    },

    fetchDailyCashFlow: async () => {
        const { year, month } = get().selectedDate;
        set({ isLoading: true });
        try {
            const data = await treasuryService.getDailyCashFlow(year, month);
            set({ dailyCashFlowData: data, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            console.error(error);
        }
    },

    fetchLiquidityKPIs: async () => {
        const { year, month } = get().selectedDate;
        // No seteamos isLoading global para no bloquear toda la UI, 
        // idealmente tendríamos isKpiLoading, pero usaremos el mismo por ahora
        try {
            const data = await treasuryService.getLiquidityKPIs(year, month);
            set({ liquidityData: data });
        } catch (error) {
            console.error("Error loading KPIs:", error);
            // No seteamos error global para no romper la vista entera si solo fallan los KPIs
        }
    },

    fetchTransactions: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await treasuryService.getReconciliationStatus();
            set({
                bankLines: data.unreconciledTransactions,
                suggestedMatches: data.suggestedMatches,
                isLoading: false
            });
        } catch (error) {
            set({ error: "Error cargando datos", isLoading: false });
        }
    },
    // Alias para mantener compatibilidad con componentes nuevos
    fetchTreasuryData: async () => {
        return get().fetchTransactions();
    },

    uploadStatement: async (file: File) => {
        set({ isLoading: true });
        try {
            await treasuryService.uploadBankStatement(file);
            const data = await treasuryService.getReconciliationStatus();
            set({
                bankLines: data.unreconciledTransactions,
                suggestedMatches: data.suggestedMatches,
                isLoading: false
            });
        } catch (error) {
            set({ error: "Error subiendo archivo", isLoading: false });
        }
    }
}));
