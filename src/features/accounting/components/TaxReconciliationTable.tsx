"use client";

import { useQuery } from "@tanstack/react-query";
import { accountingService } from "../services/accounting.service";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, CheckCircle, XCircle, Tag } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";

export function TaxReconciliationTable() {
    // Hook para traer los datos reales
    const { data: records, isLoading } = useQuery({
        queryKey: ['tax-reconciliation', '2025-10'],
        queryFn: () => accountingService.getTaxReconciliation('2025-10')
    });

    // Cálculos para el Dashboard superior
    const totalSii = records?.reduce((acc, curr) => acc + curr.amountSii, 0) || 0;
    const totalErp = records?.reduce((acc, curr) => acc + curr.amountErp, 0) || 0;
    const matchRate = records && records.length > 0 ? (records.filter(r => r.status === 'MATCH').length / records.length) * 100 : 0;

    if (isLoading) return <Skeleton className="h-[400px] w-full" />;

    return (
        <div className="space-y-6">
            {/* Dashboard de Resumen */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total IVA (SII)</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-foreground">{formatCurrency(totalSii)}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total IVA (ERP)</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-foreground">{formatCurrency(totalErp)}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Tasa de Cruce</CardTitle></CardHeader>
                    <CardContent>
                        <div className={cn("text-2xl font-bold", matchRate < 100 ? "text-yellow-600" : "text-green-600")}>
                            {isNaN(matchRate) ? "0%" : `${matchRate.toFixed(1)}%`}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabla Detallada */}
            <div className="rounded-md border bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="text-foreground font-semibold">Periodo</TableHead>
                            <TableHead className="text-foreground font-semibold">Documento</TableHead>
                            <TableHead className="text-foreground font-semibold">Contraparte (Razón Social)</TableHead>
                            <TableHead className="text-right text-foreground font-semibold">Monto SII</TableHead>
                            <TableHead className="text-right text-foreground font-semibold">Monto ERP</TableHead>
                            <TableHead className="text-center text-foreground font-semibold">Estado</TableHead>
                            <TableHead className="text-center text-foreground font-semibold">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {records?.map((row) => (
                            <TableRow key={row.id} className="hover:bg-muted/5 transition-colors">
                                <TableCell className="text-foreground font-medium">{row.period}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-foreground">{row.documentType}</span>
                                        <span className="text-xs text-muted-foreground">#{row.folio}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <span className="font-medium text-foreground">{row.counterpartName}</span>
                                        <span className="text-xs text-muted-foreground">{row.counterpartRut}</span>
                                        {row.tags && row.tags.length > 0 && (
                                            <div className="flex gap-1 mt-1">
                                                {row.tags.map((tag, i) => (
                                                    <Badge key={i} variant="secondary" className="text-[10px] px-1 py-0 h-5">
                                                        <Tag className="w-3 h-3 mr-1" />{tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right font-mono text-foreground">{formatCurrency(row.amountSii)}</TableCell>
                                <TableCell className="text-right font-mono text-foreground">{formatCurrency(row.amountErp)}</TableCell>
                                <TableCell className="text-center">
                                    <StatusBadge status={row.status} />
                                </TableCell>
                                <TableCell className="text-center">
                                    {row.status === 'MISSING_IN_ERP' && (
                                        <button className="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1.5 rounded-md hover:bg-blue-100 font-medium transition-colors">
                                            Contabilizar
                                        </button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                        {(!records || records.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <AlertCircle className="w-8 h-8 text-muted-foreground/50" />
                                        <p>No se encontraron registros para este periodo.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    switch (status) {
        case 'MATCH':
            return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"><CheckCircle className="w-3 h-3 mr-1" /> Cuadrado</Badge>;
        case 'MISSING_IN_ERP':
            return <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"><XCircle className="w-3 h-3 mr-1" /> Falta en ERP</Badge>;
        case 'MISSING_IN_SII':
            return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"><AlertCircle className="w-3 h-3 mr-1" /> Falta en SII</Badge>;
        default:
            return <Badge variant="secondary" className="text-muted-foreground">{status}</Badge>;
    }
}
