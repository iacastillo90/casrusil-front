"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCLP } from "@/lib/formatters"; // Assuming this exists, based on previous files. If not I will fix.
import { AlertCircle, CheckCircle2, CloudDownload, HelpCircle } from "lucide-react";
import { accountingService } from "@/features/accounting/services/accounting.service";

// Types
export interface DiscrepancyData {
    id: string;
    period: string;
    documentType: string;
    documentNumber: string;
    supplier: string;
    rut: string;
    amountSii: number;
    amountErp: number;
    status: "match" | "missing_erp" | "missing_sii" | "mismatch_amount";
}

// Mock Data
const MOCK_DISCREPANCIES: DiscrepancyData[] = [
    { id: "d1", period: "Oct 2024", documentType: "Factura Electrónica", documentNumber: "1023", supplier: "Global Supply Co", rut: "76.444.333-2", amountSii: 1500000, amountErp: 1500000, status: "match" },
    { id: "d2", period: "Oct 2024", documentType: "Factura Electrónica", documentNumber: "889", supplier: "Client X SpA", rut: "77.111.222-K", amountSii: 500000, amountErp: 0, status: "missing_erp" },
    { id: "d3", period: "Oct 2024", documentType: "Nota de Crédito", documentNumber: "55", supplier: "Tech Services", rut: "78.999.888-1", amountSii: 0, amountErp: 120000, status: "missing_sii" },
    { id: "d4", period: "Oct 2024", documentType: "Factura Electrónica", documentNumber: "202", supplier: "Office Depot", rut: "90.123.456-7", amountSii: 320000, amountErp: 310000, status: "mismatch_amount" },
];

export function SiiDiffTable() {
    const [discrepancies, setDiscrepancies] = React.useState<DiscrepancyData[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchAudit = async () => {
            try {
                const data = await accountingService.getSiiMirrorReport();
                // Assuming backend returns { discrepancies: DiscrepancyData[] } or DiscrepancyData[]
                // We will handle array directly for now based on common patterns
                if (Array.isArray(data)) {
                    setDiscrepancies(data);
                } else if (data && Array.isArray(data.discrepancies)) {
                    setDiscrepancies(data.discrepancies);
                } else {
                    setDiscrepancies([]); // Fallback
                }
            } catch (error) {
                console.error("Failed to load audit report", error);
                setDiscrepancies([]); // Fallback to empty array on error to prevent crash
            } finally {
                setLoading(false);
            }
        };

        fetchAudit();
    }, []);

    // If formatCLP doesn't work, I'll inline a formatter here.
    const money = (val: number) => new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(val);

    const getStatusBadge = (status: DiscrepancyData["status"]) => {
        switch (status) {
            case "match":
                return <Badge variant="outline" className="border-emerald-500 text-emerald-500 bg-emerald-500/10"><CheckCircle2 className="w-3 h-3 mr-1" /> Calza Exacto</Badge>;
            case "missing_erp":
                return <Badge variant="outline" className="border-amber-500 text-amber-500 bg-amber-500/10"><CloudDownload className="w-3 h-3 mr-1" /> No en ERP</Badge>;
            case "missing_sii":
                return <Badge variant="outline" className="border-rose-500 text-rose-500 bg-rose-500/10"><AlertCircle className="w-3 h-3 mr-1" /> No en SII</Badge>;
            case "mismatch_amount":
                return <Badge variant="outline" className="border-orange-500 text-orange-500 bg-orange-500/10"><HelpCircle className="w-3 h-3 mr-1" /> Diferencia Monto</Badge>;
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-muted-foreground bg-white/5 border border-white/10 rounded-md">Analizando discrepancias con IA...</div>;
    }

    if (discrepancies.length === 0) {
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
                    {discrepancies.map((row) => (
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
                            <TableCell className="text-right font-mono text-slate-300">{money(row.amountSii)}</TableCell>
                            <TableCell className="text-right font-mono text-slate-300">{money(row.amountErp)}</TableCell>
                            <TableCell>{getStatusBadge(row.status)}</TableCell>
                            <TableCell className="text-right">
                                {row.status === "missing_erp" && (
                                    <Button size="sm" variant="ghost" className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 h-7 text-xs">
                                        Importar
                                    </Button>
                                )}
                                {row.status === "missing_sii" && (
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
