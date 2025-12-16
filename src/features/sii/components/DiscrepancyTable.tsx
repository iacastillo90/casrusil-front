"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCLP } from "@/lib/formatters";
import { AlertCircle, CheckCircle2, CloudDownload, HelpCircle } from "lucide-react";
import { useAuditStore } from "../stores/audit.store";
import { Discrepancy } from "../services/audit.service";

export function DiscrepancyTable() {
    const { auditReport, isLoading } = useAuditStore();

    const getStatusBadge = (status: Discrepancy["status"]) => {
        switch (status) {
            case "MATCH":
                return <Badge variant="outline" className="border-emerald-500 text-emerald-500 bg-emerald-500/10"><CheckCircle2 className="w-3 h-3 mr-1" /> Calza Exacto</Badge>;
            case "MISSING_IN_ERP":
                return <Badge variant="outline" className="border-amber-500 text-amber-500 bg-amber-500/10"><CloudDownload className="w-3 h-3 mr-1" /> No en ERP</Badge>;
            case "MISSING_IN_SII":
                return <Badge variant="outline" className="border-rose-500 text-rose-500 bg-rose-500/10"><AlertCircle className="w-3 h-3 mr-1" /> No en SII</Badge>;
            case "NO_CONTABILIZADO":
                return <Badge variant="outline" className="border-amber-500 text-amber-500 bg-amber-500/10"><CloudDownload className="w-3 h-3 mr-1" /> No Contabilizado</Badge>;
            case "AMOUNT_MISMATCH":
                return <Badge variant="outline" className="border-orange-500 text-orange-500 bg-orange-500/10"><HelpCircle className="w-3 h-3 mr-1" /> Diferencia Monto</Badge>;
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground bg-white/5 border border-white/10 rounded-md">Analizando discrepancias con IA...</div>;
    }

    if (!auditReport?.discrepancies || auditReport.discrepancies.length === 0) {
        return (
            <div className="p-8 text-center bg-white/5 border border-white/10 rounded-md">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-white">Todo en orden</h3>
                <p className="text-slate-400">No se encontraron discrepancias entre SII y ERP.</p>
            </div>
        );
    }

    return (
        <div className="rounded-md border border-white/10 bg-white/5 backdrop-blur-sm shadow-xl overflow-hidden">
            <Table>
                <TableHeader className="bg-white/5">
                    <TableRow className="hover:bg-transparent border-white/10">
                        <TableHead className="text-white">Periodo</TableHead>
                        <TableHead className="text-white">Documento</TableHead>
                        <TableHead className="text-white">Contraparte</TableHead>
                        <TableHead className="text-white text-right">Monto SII</TableHead>
                        <TableHead className="text-white text-right">Monto ERP</TableHead>
                        <TableHead className="text-white">Estado</TableHead>
                        <TableHead className="text-right text-white">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {auditReport.discrepancies.map((row) => (
                        <TableRow key={row.id} className="hover:bg-white/5 border-white/10 group">
                            <TableCell className="font-medium text-slate-300">{row.period}</TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="text-sm text-slate-200">{row.documentType}</span>
                                    <span className="text-xs text-muted-foreground">#{row.documentNumber}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="text-sm text-slate-200">{row.supplier}</span>
                                    <span className="text-xs text-muted-foreground">{row.rut}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-right font-mono text-slate-300">{formatCLP(row.amountSii)}</TableCell>
                            <TableCell className="text-right font-mono text-slate-300">{formatCLP(row.amountErp)}</TableCell>
                            <TableCell>{getStatusBadge(row.status)}</TableCell>
                            <TableCell className="text-right">
                                {(row.status === "MISSING_IN_ERP" || row.status === "NO_CONTABILIZADO") && (
                                    <Button size="sm" variant="ghost" className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 h-7 text-xs">
                                        Importar
                                    </Button>
                                )}
                                {row.status === "MISSING_IN_SII" && (
                                    <Button size="sm" variant="ghost" className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 h-7 text-xs">
                                        Verificar DTE
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
