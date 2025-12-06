"use client";

import { useF29 } from "@/features/accounting/hooks/useAccounting";
import { F29Preview } from "@/features/accounting/components/F29Preview";
import { useState } from "react";

export default function F29Page() {
    const [period, setPeriod] = useState(new Date().toISOString().slice(0, 7).replace('-', '')); // YYYYMM
    const { data: report, isLoading } = useF29(period);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Formulario 29</h1>
                <input
                    type="month"
                    value={period.replace(/(\d{4})(\d{2})/, '$1-$2')}
                    onChange={(e) => setPeriod(e.target.value.replace('-', ''))}
                    className="border rounded px-2 py-1"
                />
            </div>

            {isLoading ? (
                <div>Cargando F29...</div>
            ) : report ? (
                <F29Preview report={report} />
            ) : (
                <div>No hay datos para este periodo.</div>
            )}
        </div>
    );
}
