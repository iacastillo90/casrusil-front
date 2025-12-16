"use client";

import { useBalanceSheet } from "@/features/accounting/hooks/useAccounting";
import { BalanceSheetTree } from "@/features/accounting/components/BalanceSheetTree";
import { OpeningBalanceUpload } from "@/features/accounting/components/OpeningBalanceUpload";
import { CreateAccountModal } from "@/features/accounting/components/CreateAccountModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";

export default function BalanceSheetPage() {
    const [date, setDate] = useState("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setDate(new Date().toISOString().split('T')[0]);
        setMounted(true);
    }, []);

    const { data: balanceSheet, isLoading } = useBalanceSheet(date);

    // Prevent hydration mismatch by showing loading state until mounted and date is set
    if (!mounted || !date) return <div>Cargando balance...</div>;

    if (isLoading) return <div>Cargando balance...</div>;
    if (!balanceSheet) return <div>No hay datos disponibles.</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Balance General</h1>
                <div className="flex gap-2 items-center">
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="border rounded px-2 py-1"
                    />
                    <CreateAccountModal />
                    <OpeningBalanceUpload />
                </div>
            </div>

            <div className="mt-6">
                <BalanceSheetTree data={balanceSheet!} />
            </div>
        </div>
    );
}
