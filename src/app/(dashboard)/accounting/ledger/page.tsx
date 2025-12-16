"use client";

import { useLedger, useCleanupNovember } from "@/features/accounting/hooks/useAccounting";
import { JournalEntryTable } from "@/features/accounting/components/JournalEntryTable";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function LedgerPage() {
    const [filters, setFilters] = useState({});
    const { data: entries, isLoading } = useLedger(filters);
    const { mutate: cleanup, isPending: isCleaning } = useCleanupNovember();

    const handleCleanup = () => {
        if (window.confirm("⚠️ ¿Estás seguro de que deseas ejecutar la limpieza de Noviembre? \n\nEsto borrará los asientos duplicados y dejará solo el Asiento de Apertura.")) {
            cleanup();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Libro Diario</h1>
                <Button
                    variant="destructive"
                    onClick={handleCleanup}
                    disabled={isCleaning}
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {isCleaning ? "Limpiando..." : "Limpiar Noviembre"}
                </Button>
            </div>
            <JournalEntryTable entries={entries || []} isLoading={isLoading} />
        </div>
    );
}
