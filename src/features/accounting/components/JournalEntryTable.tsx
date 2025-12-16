import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatCLP as formatCurrency } from "@/lib/formatters";
import { format, parseISO, isValid } from "date-fns";
import { es } from "date-fns/locale";
import { AccountingEntry } from "../types/accounting.types";
import { FileText, User, Hash } from "lucide-react";

interface JournalEntryTableProps {
    entries: AccountingEntry[];
    isLoading: boolean;
}

// Mapa de Tipos de Documentos SII para etiquetas bonitas
const DOC_TYPES: Record<string, string> = {
    "33": "Factura Electrónica",
    "34": "Factura No Afecta",
    "61": "Nota de Crédito",
    "56": "Nota de Débito",
    "TR": "Traspaso Contable"
};

export function JournalEntryTable({ entries, isLoading }: JournalEntryTableProps) {
    if (isLoading) return <div className="p-8 text-center text-slate-500 animate-pulse">Cargando Libro Diario...</div>;

    return (
        <div className="space-y-6">
            {entries.map((entry) => (
                <Card key={entry.id} className="overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-shadow">

                    {/* --- CABECERA ENRIQUECIDA DEL ASIENTO --- */}
                    <div className="bg-slate-50/80 p-4 border-b flex flex-col md:flex-row justify-between gap-4">

                        <div className="flex items-start gap-4">
                            {/* Fecha Grande */}
                            <div className="flex flex-col items-center bg-white p-2 rounded border border-slate-200 min-w-[80px]">
                                <span className="text-xs text-slate-500 uppercase font-bold">
                                    {isValid(parseISO(entry.entryDate)) ? format(parseISO(entry.entryDate), "MMM", { locale: es }) : "-"}
                                </span>
                                <span className="text-2xl font-bold text-slate-800">
                                    {isValid(parseISO(entry.entryDate)) ? format(parseISO(entry.entryDate), "dd") : "?"}
                                </span>
                                <span className="text-xs text-slate-400">
                                    {isValid(parseISO(entry.entryDate)) ? format(parseISO(entry.entryDate), "yyyy") : "-"}
                                </span>
                            </div>

                            <div className="flex flex-col gap-1">
                                {/* Título Principal: Descripción/Glosa */}
                                <h3 className="font-bold text-slate-800 text-lg leading-tight">
                                    {entry.description}
                                </h3>

                                {/* ✅ METADATA DEL CSV (Solo si existe) */}
                                {(entry.taxPayerName || entry.referenceId) && (
                                    <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-slate-600">

                                        {/* Tipo Doc + Folio */}
                                        {entry.referenceId && (
                                            <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">
                                                <FileText className="w-3 h-3" />
                                                <span className="font-semibold">
                                                    {DOC_TYPES[entry.referenceType || ""] || "Doc"} #{entry.referenceId}
                                                </span>
                                            </div>
                                        )}

                                        {/* Razón Social + RUT */}
                                        {entry.taxPayerName && (
                                            <div className="flex items-center gap-1 text-slate-500">
                                                <User className="w-3 h-3" />
                                                <span className="font-medium">{entry.taxPayerName}</span>
                                                <span className="text-xs opacity-70">({entry.taxPayerId})</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Estado e ID Interno */}
                        <div className="flex flex-col items-end gap-2">
                            <Badge variant={entry.status === 'POSTED' ? 'default' : 'secondary'} className={entry.status === 'POSTED' ? "bg-emerald-600 hover:bg-emerald-700" : ""}>
                                {entry.status === 'POSTED' ? 'CONTABILIZADO' : 'BORRADOR'}
                            </Badge>
                            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                                <Hash className="w-3 h-3" />
                                ID: {entry.id.toString().substring(0, 8)}
                            </div>
                        </div>
                    </div>

                    {/* --- TABLA DE MOVIMIENTOS (Debe/Haber) --- */}
                    <div className="bg-white">
                        <Table>
                            <TableHeader className="bg-slate-50/50">
                                <TableRow className="border-b-slate-100 hover:bg-transparent">
                                    <TableHead className="w-[50%] h-8 text-xs font-bold text-slate-500 uppercase">Cuenta Contable</TableHead>
                                    <TableHead className="text-right w-[25%] h-8 text-xs font-bold text-slate-500 uppercase">Debe</TableHead>
                                    <TableHead className="text-right w-[25%] h-8 text-xs font-bold text-slate-500 uppercase">Haber</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {entry.lines.map((line, idx) => (
                                    <TableRow key={idx} className="border-b-0 hover:bg-slate-50/50 h-9">
                                        <TableCell className="py-2">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-xs font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 min-w-[60px] text-center">
                                                    {line.accountCode}
                                                </span>
                                                <span className="text-sm text-slate-700 truncate max-w-[300px]" title={line.accountName}>
                                                    {line.accountName}
                                                </span>
                                            </div>
                                        </TableCell>

                                        <TableCell className="text-right py-2 font-mono text-sm">
                                            {Number(line.debit) > 0 ? (
                                                <span className="text-slate-700">{formatCurrency(line.debit)}</span>
                                            ) : (
                                                <span className="text-slate-200 text-xs">-</span>
                                            )}
                                        </TableCell>

                                        <TableCell className="text-right py-2 font-mono text-sm">
                                            {Number(line.credit) > 0 ? (
                                                <span className="text-slate-700">{formatCurrency(line.credit)}</span>
                                            ) : (
                                                <span className="text-slate-200 text-xs">-</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {/* Fila de Totales Sutil */}
                                <TableRow className="bg-slate-50 border-t border-slate-200 hover:bg-slate-50">
                                    <TableCell className="text-right text-[10px] font-bold text-slate-400 uppercase py-2">Total Asiento</TableCell>
                                    <TableCell className="text-right font-mono text-sm font-bold text-blue-700 py-2">
                                        {formatCurrency(entry.lines.reduce((s, l) => s + Number(l.debit), 0))}
                                    </TableCell>
                                    <TableCell className="text-right font-mono text-sm font-bold text-emerald-700 py-2">
                                        {formatCurrency(entry.lines.reduce((s, l) => s + Number(l.credit), 0))}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            ))}
        </div>
    );
}
