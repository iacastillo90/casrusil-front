"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Link2, Search, ArrowRightLeft, AlertCircle } from "lucide-react";
import { useTreasuryStore } from "../stores/treasury.store";
import { formatCLP, formatDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export function ReconciliationInterface() {
    // ✅ FIX: Usamos fetchTransactions en lugar de fetchTreasuryData
    const { bankLines, suggestedMatches, fetchTransactions, isLoading } = useTreasuryStore();
    const [selectedBankLineId, setSelectedBankLineId] = useState<string | null>(null);

    // Cargar MOVIMIENTOS BANCARIOS al montar
    useEffect(() => {
        fetchTransactions();
    }, []);

    const pendingBankLines = bankLines.filter(line => !line.reconciled);

    const currentSuggestions = suggestedMatches.filter(
        match => match.bankTransactionId === selectedBankLineId
    );

    const selectedLine = pendingBankLines.find(line => line.id === selectedBankLineId);

    return (
        <div className="grid gap-6 md:grid-cols-2 h-[600px]">
            {/* 🏦 PANEL IZQUIERDO: BANCO */}
            <Card className="flex flex-col h-full border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <span>Banco (Cartola)</span>
                            <Badge variant="secondary">{pendingBankLines.length}</Badge>
                        </CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => fetchTransactions()} disabled={isLoading}>
                            <ArrowRightLeft className={cn("h-4 w-4", isLoading && "animate-spin")} />
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Selecciona un movimiento para conciliar</p>
                </CardHeader>

                <Separator />

                <ScrollArea className="flex-1">
                    <div className="p-4 space-y-3">
                        {pendingBankLines.length === 0 ? (
                            <div className="text-center py-10 text-muted-foreground">
                                {isLoading ? (
                                    <p>Cargando movimientos...</p>
                                ) : (
                                    <>
                                        <Check className="h-10 w-10 mx-auto mb-2 text-green-500 opacity-50" />
                                        <p>¡Todo conciliado!</p>
                                    </>
                                )}
                            </div>
                        ) : (
                            pendingBankLines.map(line => (
                                <div
                                    key={line.id}
                                    onClick={() => setSelectedBankLineId(line.id)}
                                    className={cn(
                                        "p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md",
                                        selectedBankLineId === line.id
                                            ? "border-blue-500 bg-blue-50 shadow-md ring-1 ring-blue-200"
                                            : "border-slate-200 hover:bg-slate-50"
                                    )}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-xs font-semibold text-slate-500">
                                            {formatDate(line.date)}
                                        </span>
                                        <span className={cn(
                                            "font-bold font-mono",
                                            line.amount > 0 ? "text-green-600" : "text-red-600"
                                        )}>
                                            {formatCLP(line.amount)}
                                        </span>
                                    </div>
                                    <div className="text-sm font-medium line-clamp-2 text-slate-700">
                                        {line.description}
                                    </div>
                                    {line.reference && (
                                        <div className="mt-1 text-xs text-slate-400">Ref: {line.reference}</div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </Card>

            {/* 📊 PANEL DERECHO: CONTABILIDAD / SUGERENCIAS */}
            <Card className="flex flex-col h-full border-l-4 border-l-green-500 bg-slate-50/50">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <span>Contabilidad (ERP)</span>
                        {selectedLine && <Badge variant="outline">Sugerencias IA</Badge>}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                        {selectedLine
                            ? `Buscando coincidencias para ${formatCLP(selectedLine.amount)}`
                            : "Selecciona un movimiento del banco para ver coincidencias"}
                    </p>
                </CardHeader>

                <Separator />

                <ScrollArea className="flex-1">
                    <div className="p-4 space-y-4">
                        {!selectedLine ? (
                            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground opacity-60">
                                <Search className="h-12 w-12 mb-3" />
                                <p>Esperando selección...</p>
                            </div>
                        ) : currentSuggestions.length > 0 ? (
                            <div className="space-y-3">
                                {currentSuggestions.map((match, idx) => (
                                    <div key={idx} className="bg-white p-4 rounded-lg border border-green-200 shadow-sm relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 bg-green-100 text-green-700 text-[10px] px-2 py-1 rounded-bl-lg font-bold">
                                            {(match.confidenceScore * 100).toFixed(0)}% COINCIDENCIA
                                        </div>

                                        <div className="mb-2">
                                            <div className="text-sm font-semibold text-slate-800">Posible Asiento Contable</div>
                                            <div className="text-xs text-slate-500 mt-1">{match.matchReason}</div>
                                        </div>

                                        <div className="flex items-center justify-end gap-2 mt-4">
                                            <Button variant="outline" size="sm" className="h-8 text-xs">
                                                Ver Detalle
                                            </Button>
                                            <Button size="sm" className="h-8 text-xs bg-green-600 hover:bg-green-700 text-white">
                                                <Check className="w-3 h-3 mr-1" /> Conciliar
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="bg-white p-6 rounded-lg border border-dashed border-slate-300">
                                    <AlertCircle className="h-8 w-8 mx-auto text-amber-500 mb-2" />
                                    <h3 className="font-medium text-slate-900">No hay sugerencias automáticas</h3>
                                    <p className="text-sm text-slate-500 mb-4">
                                        No encontramos facturas o asientos que coincidan exactamente con este monto y fecha.
                                    </p>
                                    <Button variant="secondary" className="w-full">
                                        🔍 Búsqueda Manual Avanzada
                                    </Button>
                                    <div className="mt-3 text-xs text-slate-400">
                                        O crea un asiento contable nuevo desde aquí
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </Card>
        </div>
    );
}
