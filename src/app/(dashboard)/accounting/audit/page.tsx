// src/app/(dashboard)/accounting/audit/page.tsx
import { TaxReconciliationTable } from "@/features/accounting/components/TaxReconciliationTable";

export default function AuditPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Auditoría Tributaria SII</h1>
            <p className="text-muted-foreground">Comparación automática RCV vs Contabilidad Interna.</p>

            {/* Aquí insertamos la nueva tabla detallada */}
            <TaxReconciliationTable />
        </div>
    );
}
