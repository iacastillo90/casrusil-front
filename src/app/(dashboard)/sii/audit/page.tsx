"use client";

import React from "react";
import { TaxReconciliationTable } from "@/features/accounting/components/TaxReconciliationTable";

export default function TaxAuditPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Auditoría Tributaria SII
                    </h2>
                    <p className="text-muted-foreground">
                        Comparación automática RCV (Registro Compra Venta) vs Contabilidad Interna.
                    </p>
                </div>
            </div>

            {/* Nueva Tabla Nivel Dios */}
            <TaxReconciliationTable />
        </div>
    );
}
