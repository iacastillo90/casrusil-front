import { create } from "zustand";
import { AuditReport, auditService } from "../services/audit.service";

interface AuditState {
    auditReport: AuditReport | null;
    isLoading: boolean;
    error: string | null;
    selectedYear: number;
    selectedMonth: number;

    setPeriod: (year: number, month: number) => void;
    fetchAuditReport: () => Promise<void>;
}

export const useAuditStore = create<AuditState>((set, get) => ({
    auditReport: null,
    isLoading: false,
    error: null,
    selectedYear: new Date().getFullYear(),
    selectedMonth: new Date().getMonth() + 1,

    setPeriod: (year, month) => {
        set({ selectedYear: year, selectedMonth: month });
        get().fetchAuditReport();
    },

    fetchAuditReport: async () => {
        const { selectedYear, selectedMonth } = get();
        set({ isLoading: true, error: null });
        try {
            const data = await auditService.getAuditReport(selectedYear, selectedMonth);
            set({ auditReport: data, isLoading: false });
        } catch (error) {
            console.error("Failed to fetch audit report", error);
            // Fallback mock data for demo purposes if backend fails
            // En producción, esto debería ser un error real.
            set({
                error: "Error al cargar reporte de auditoría",
                isLoading: false,
                // Opcional: data dummy si queremos que la UI no se rompa durante el desarrollo sin backend
            });
        }
    }
}));
