import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCLP, formatDateCL } from "@/lib/formatters";
import { AccountingEntry } from "../types/accounting.types";
import { FileText, User } from "lucide-react";

interface LedgerTableProps {
    entries: AccountingEntry[];
    isLoading: boolean;
}

export function LedgerTable({ entries, isLoading }: LedgerTableProps) {
    if (isLoading) {
        return <div className="p-8 text-center text-slate-500 animate-pulse">Cargando Libro Diario...</div>;
    }

    if (!entries.length) {
        return <div className="p-8 text-center text-slate-500">No hay movimientos registrados.</div>;
    }

    return (
        <div className="rounded-md border bg-white shadow-sm overflow-hidden">
            <Table>
                <TableHeader className="bg-slate-50">
                    <TableRow>
                        <TableHead className="w-[120px] font-bold text-slate-700">Fecha</TableHead>
                        <TableHead className="w-[150px] font-bold text-slate-700">Tipo / Folio</TableHead>
                        <TableHead className="w-[200px] font-bold text-slate-700">Tercero</TableHead>
                        <TableHead className="font-bold text-slate-700">Glosa / Descripción</TableHead>
                        <TableHead className="text-right font-bold text-slate-700 w-[120px]">Total</TableHead>
                        <TableHead className="text-center font-bold text-slate-700 w-[100px]">Estado</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {entries.map((entry) => (
                        <TableRow key={entry.id} className="hover:bg-slate-50 transition-colors">
                            {/* Fecha Contable */}
                            <TableCell className="font-mono text-sm text-slate-600">
                                {formatDateCL(entry.entryDate)}
                            </TableCell>

                            {/* Tipo Documento + Folio */}
                            <TableCell>
                                {entry.referenceId ? (
                                    <div className="flex flex-col items-start gap-1">
                                        <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-100 flex gap-1">
                                            <FileText className="w-3 h-3" />
                                            {entry.referenceType === "33" ? "FACTURA" :
                                                entry.referenceType === "61" ? "N.CREDITO" :
                                                    entry.referenceType || "DOC"}
                                        </Badge>
                                        <span className="font-mono text-xs font-medium text-slate-700 ml-1">
                                            #{entry.referenceId}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-slate-400 text-xs italic">S/R</span>
                                )}
                            </TableCell>

                            {/* Tercero / Proveedor */}
                            <TableCell>
                                {entry.taxPayerName ? (
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-slate-700 truncate max-w-[180px]" title={entry.taxPayerName}>
                                            {entry.taxPayerName}
                                        </span>
                                        <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                                            <User className="w-3 h-3" />
                                            {entry.taxPayerId}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-slate-400 text-xs">-</span>
                                )}
                            </TableCell>

                            {/* Glosa / Descripción */}
                            <TableCell>
                                <p className="text-sm text-slate-700 line-clamp-2" title={entry.description}>
                                    {entry.description}
                                </p>
                            </TableCell>

                            {/* Monto Total (Debe/Haber balanceado, mostramos totalAmount o suma líneas) */}
                            <TableCell className="text-right font-mono text-sm font-semibold text-slate-800">
                                {formatCLP(entry.totalAmount || 0)}
                            </TableCell>

                            {/* Estado */}
                            <TableCell className="text-center">
                                <Badge variant={entry.status === 'POSTED' ? 'default' : 'secondary'}
                                    className={entry.status === 'POSTED' ? "bg-emerald-600" : "bg-amber-500"}>
                                    {entry.status === 'POSTED' ? 'OK' : 'BORR'}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
