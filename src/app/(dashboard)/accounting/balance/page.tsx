"use client";

import { useBalanceSheet } from "@/features/accounting/hooks/useAccounting";
import { BalanceSheetTree } from "@/features/accounting/components/BalanceSheetTree";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export default function BalanceSheetPage() {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const { data: balanceSheet, isLoading } = useBalanceSheet(date);

    if (isLoading) return <div>Cargando balance...</div>;
    if (!balanceSheet) return <div>No hay datos disponibles.</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Balance General</h1>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border rounded px-2 py-1"
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Activos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <BalanceSheetTree sections={balanceSheet.assets} />
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pasivos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <BalanceSheetTree sections={balanceSheet.liabilities} />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Patrimonio</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <BalanceSheetTree sections={balanceSheet.equity} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
