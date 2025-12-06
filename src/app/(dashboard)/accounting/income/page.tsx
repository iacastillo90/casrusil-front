"use client";

import { IncomeStatement } from "@/features/accounting/components/IncomeStatement";

export default function IncomeStatementPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Estado de Resultados</h1>
            <IncomeStatement />
        </div>
    );
}
