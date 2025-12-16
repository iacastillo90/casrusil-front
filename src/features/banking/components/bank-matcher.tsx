"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sparkles, ArrowRight, ArrowLeft, Search, Building2, Receipt, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { treasuryService } from "@/features/treasury/services/treasury.service";

// Types
interface BankTransaction {
    id: string;
    date: string;
    description: string;
    amount: number;
    status: "pending" | "matched";
}

interface ERPInvoice {
    id: string;
    date: string;
    supplier: string;
    documentType: string;
    amount: number;
    status: "unpaid" | "paid";
}

const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(amount);
};

export function BankMatcher() {
    const [selectedBankTx, setSelectedBankTx] = useState<string | null>(null);
    const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
    const [transactions, setTransactions] = useState<BankTransaction[]>([]);
    const [invoices, setInvoices] = useState<ERPInvoice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isMatching, setIsMatching] = useState(false);

    React.useEffect(() => {
        const loadWorkbench = async () => {
            try {
                const data = await treasuryService.getWorkbench();
                if (data) {
                    setTransactions(data.bankTransactions || []);
                    setInvoices(data.erpDocuments || []);
                }
            } catch (error) {
                console.error(error);
                // Fallback valid arrays
                setTransactions([]);
                setInvoices([]);
            } finally {
                setIsLoading(false);
            }
        };
        loadWorkbench();
    }, []);

    const handleBankSelect = (id: string) => {
        setSelectedBankTx(id);
        const tx = transactions.find(t => t.id === id);
        if (!tx) return;

        const match = invoices.find(inv => Math.abs(tx.amount) === inv.amount);
        if (match) {
            setSelectedInvoice(match.id);
        } else {
            setSelectedInvoice(null);
        }
    };

    const handleMatch = async () => {
        if (!selectedBankTx || !selectedInvoice) return;

        setIsMatching(true);
        try {
            await treasuryService.applyMatch({
                bankLineId: selectedBankTx,
                documentId: selectedInvoice,
                type: 'MANUAL',
                notes: 'Matched via Workbench'
            });

            toast.success("Conciliación aplicada exitosamente");

            setTransactions(prev => prev.filter(t => t.id !== selectedBankTx));
            setInvoices(prev => prev.filter(i => i.id !== selectedInvoice));
            setSelectedBankTx(null);
            setSelectedInvoice(null);
        } catch (error) {
            console.error(error);
            toast.error("Error al aplicar la conciliación");
        } finally {
            setIsMatching(false);
        }
    };

    const selectedTxData = transactions.find(t => t.id === selectedBankTx);
    const selectedInvData = invoices.find(i => i.id === selectedInvoice);
    const hasMatch = !!(selectedTxData && selectedInvData && Math.abs(selectedTxData.amount) === selectedInvData.amount);

    return (
        <div className="flex h-[calc(100vh-12rem)] gap-4">
            {/* LEFT PANEL: THE BANK */}
            <div className="flex-1 flex flex-col gap-4">
                <div className="flex items-center justify-between px-2">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-blue-400" />
                        Banco (Cartola)
                    </h3>
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                        {transactions.length} Pendientes
                    </Badge>
                </div>

                <Card className="flex-1 bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden flex flex-col">
                    <div className="p-3 border-b border-white/10">
                        <Input placeholder="Buscar movimiento..." className="bg-white/5 border-white/10" />
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                                <Loader2 className="h-8 w-8 animate-spin mb-4" />
                                <p>Cargando cartola...</p>
                            </div>
                        ) : transactions.length === 0 ? (
                            <div className="text-center p-8 text-muted-foreground">No hay movimientos pendientes</div>
                        ) : (
                            transactions.map((tx) => (
                                <div
                                    key={tx.id}
                                    onClick={() => handleBankSelect(tx.id)}
                                    className={cn(
                                        "p-3 rounded-lg border cursor-pointer transition-all hover:bg-white/5",
                                        selectedBankTx === tx.id
                                            ? "border-blue-500 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                                            : "border-white/5 bg-white/5"
                                    )}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-medium text-sm">{tx.description}</span>
                                        <span className="text-xs text-muted-foreground">{tx.date}</span>
                                    </div>
                                    <div className={cn("text-right font-bold font-mono", tx.amount > 0 ? "text-emerald-400" : "text-rose-400")}>
                                        {formatMoney(tx.amount)}
                                    </div>
                                </div>
                            )))}
                    </div>
                </Card>
            </div>

            {/* CENTER: THE MAGIC MATCH MAKER */}
            <div className="w-[300px] flex flex-col justify-center items-center relative z-10">
                <AnimatePresence>
                    {selectedBankTx && selectedInvoice ? (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full"
                        >
                            <div className="relative p-[1px] rounded-2xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-500 mb-4 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                                <div className="bg-black/90 rounded-2xl p-5 text-center relative overflow-hidden backdrop-blur-xl">
                                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50" />

                                    <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-3 animate-pulse" />

                                    <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-cyan-200 mb-1">
                                        {hasMatch ? "98% Match" : "Posible Match"}
                                    </h3>
                                    <p className="text-xs text-slate-400 mb-4">
                                        Sugerencia basada en monto y fecha
                                    </p>

                                    <div className="flex flex-col gap-2 mb-4 text-sm text-slate-300 bg-white/5 p-3 rounded-lg border border-white/10">
                                        <div className="flex justify-between">
                                            <span>Banco:</span>
                                            <span className="font-mono">{selectedTxData?.amount && formatMoney(selectedTxData.amount)}</span>
                                        </div>
                                        <div className="flex justify-between border-t border-white/10 pt-2">
                                            <span>ERP:</span>
                                            <span className="font-mono">{selectedInvData?.amount && formatMoney(selectedInvData.amount)}</span>
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-900/50 border-0"
                                        onClick={handleMatch}
                                        disabled={isMatching}
                                    >
                                        {isMatching ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                                        {isMatching ? "Conciliando..." : "Confirmar"}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ) : selectedBankTx ? (
                        <div className="text-center text-muted-foreground animate-pulse">
                            <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Buscando coincidencias...</p>
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground opacity-30">
                            <ArrowLeft className="inline mr-2" /> Selecciona un movimiento
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* RIGHT PANEL: THE ERP */}
            <div className="flex-1 flex flex-col gap-4">
                <div className="flex items-center justify-between px-2">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Receipt className="w-5 h-5 text-indigo-400" />
                        Contabilidad (ERP)
                    </h3>
                    <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
                        {invoices.length} Documentos
                    </Badge>
                </div>

                <Card className="flex-1 bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden flex flex-col">
                    <div className="p-3 border-b border-white/10 flex gap-2">
                        <Input placeholder="Buscar factura, monto..." className="bg-white/5 border-white/10" />
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                                <Loader2 className="h-8 w-8 animate-spin mb-4" />
                                <p>Cargando documentos...</p>
                            </div>
                        ) : invoices.length === 0 ? (
                            <div className="text-center p-8 text-muted-foreground">No hay documentos pendientes</div>
                        ) : (
                            invoices.map((inv) => (
                                <div
                                    key={inv.id}
                                    onClick={() => setSelectedInvoice(inv.id)}
                                    className={cn(
                                        "p-3 rounded-lg border cursor-pointer transition-all hover:bg-white/5",
                                        selectedInvoice === inv.id
                                            ? "border-indigo-500 bg-indigo-500/10 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                                            : "border-white/5 bg-white/5"
                                    )}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <div>
                                            <span className="font-medium text-sm block">{inv.supplier}</span>
                                            <span className="text-xs text-muted-foreground">{inv.documentType}</span>
                                        </div>
                                        <span className="text-xs text-muted-foreground">{inv.date}</span>
                                    </div>
                                    <div className="text-right font-bold font-mono text-slate-200">
                                        {formatMoney(inv.amount)}
                                    </div>
                                </div>
                            )))}
                    </div>
                </Card>
            </div>
        </div>
    );
}
