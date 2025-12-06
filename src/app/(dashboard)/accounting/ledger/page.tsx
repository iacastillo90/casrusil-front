"use client";

import { useLedger } from "@/features/accounting/hooks/useAccounting";
import { LedgerTable } from "@/features/accounting/components/LedgerTable";
import { useState } from "react";

export default function LedgerPage() {
    const [filters, setFilters] = useState({});
    const { data: entries, isLoading } = useLedger(filters);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Libro Mayor</h1>
            <LedgerTable entries={entries || []} isLoading={isLoading} />
        </div>
    );
}
