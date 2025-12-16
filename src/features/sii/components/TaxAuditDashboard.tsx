"use client";

import { useAuditStore } from "../stores/audit.store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCLP } from "@/lib/formatters";
import { AlertCircle, CheckCircle2, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function TaxAuditDashboard() {
    const { auditReport, isLoading } = useAuditStore();

    if (isLoading) {
        return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>;
    }

    if (!auditReport) return null;

    const { summary } = auditReport;

    if (!summary) return null;

    const difference = summary.totalInvoicesErp - summary.totalInvoicesSii; // Example Logic, simpler than money for now

    // Logic for color coding the money difference
    const moneyDiff = summary.totalErp - summary.totalSii;
    const isMismatch = Math.abs(moneyDiff) > 1000; // Tolerance
    const isPositive = moneyDiff >= 0;

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* OBJETIVO: Mostrar Monto SII vs ERP y Delta */}

            {/* 1. SII TOTAL */}
            <Card className="bg-slate-950 text-white border-slate-800">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400 flex justify-between">
                        Total IVA Crédito (SII)
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold font-mono text-emerald-400">
                        {formatCLP(summary.totalSii)}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Reportado en RCV</p>
                </CardContent>
            </Card>

            {/* 2. ERP TOTAL */}
            <Card className="bg-slate-950 text-white border-slate-800">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400 flex justify-between">
                        Total IVA Crédito (ERP)
                        {isMismatch ? <AlertCircle className="h-4 w-4 text-rose-500" /> : <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className={cn("text-2xl font-bold font-mono", isMismatch ? "text-rose-400" : "text-emerald-400")}>
                        {formatCLP(summary.totalErp)}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                        {isMismatch && (
                            <span className={cn("text-xs font-bold", isPositive ? "text-emerald-500" : "text-rose-500")}>
                                {isPositive ? "+" : ""}{formatCLP(moneyDiff)}
                            </span>
                        )}
                        <p className="text-xs text-slate-500">
                            {isMismatch ? "de diferencia" : "Cuadrado perfecto"}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* 3. DOCS COUNT */}
            <Card className="bg-slate-950 text-white border-slate-800">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">Documentos SII</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold font-mono">{summary.totalInvoicesSii}</div>
                    <p className="text-xs text-slate-500 mt-1">Facturas y N/C</p>
                </CardContent>
            </Card>

            {/* 4. MATCH RATE */}
            <Card className="bg-slate-950 text-white border-slate-800">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">Tasa de Cruce</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold font-mono text-blue-400">
                        {(summary.matchRate * 100).toFixed(1)}%
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Conciliación automática</p>
                </CardContent>
            </Card>
        </div>
    );
}
