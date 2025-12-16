"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown, ChevronUp, History, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { accountingService } from "../services/accounting.service";

// Mock Data Types
interface LedgerEntry {
    id: string;
    date: string;
    description: string;
    documentNumber: string;
    amount: number; // Positive = Invoice, Negative = Payment
    balance: number;
}

interface Partner {
    id: string;
    name: string;
    rut: string;
    type: "customer" | "supplier";
    totalPending: number;
    lastActivity: string;
    status: "current" | "overdue" | "critical";
    history: LedgerEntry[];
}

// Mock Data
const MOCK_PARTNERS: Partner[] = [
    {
        id: "p1",
        name: "Agroindustrial del Sur SpA",
        rut: "76.444.333-2",
        type: "customer",
        totalPending: 500000,
        lastActivity: "2024-10-05",
        status: "overdue",
        history: [
            { id: "e1", date: "2024-10-01", description: "Factura Venta", documentNumber: "100", amount: 1000000, balance: 1000000 },
            { id: "e2", date: "2024-10-05", description: "Pago Abono", documentNumber: "TRF-99", amount: -500000, balance: 500000 },
        ]
    },
    {
        id: "p2",
        name: "Tech Solutions Ltd",
        rut: "78.111.222-K",
        type: "customer",
        totalPending: 1250000,
        lastActivity: "2024-09-20",
        status: "critical",
        history: [
            { id: "e3", date: "2024-09-01", description: "Factura Venta", documentNumber: "80", amount: 1250000, balance: 1250000 },
        ]
    },
    {
        id: "p3",
        name: "Servicios Generales SA",
        rut: "90.123.123-1",
        type: "supplier",
        totalPending: 450000,
        lastActivity: "2024-10-10",
        status: "current",
        history: [
            { id: "e4", date: "2024-10-10", description: "Factura Compra", documentNumber: "5050", amount: 450000, balance: 450000 },
        ]
    }
];

const formatMoney = (val: number) => new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(val);

export function PartnerLedger() {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [movementsData, setMovementsData] = useState<Record<string, LedgerEntry[]>>({});
    const [loadingMovements, setLoadingMovements] = useState<Record<string, boolean>>({});
    const [filterType, setFilterType] = useState<"all" | "customer" | "supplier">("all");

    // Load initial Partner Summary
    React.useEffect(() => {
        const loadPartners = async () => {
            try {
                // Fetch both Customers and Suppliers to support "All" view
                const [customers, suppliers] = await Promise.all([
                    accountingService.getPartnerSummary('CUSTOMER'),
                    accountingService.getPartnerSummary('SUPPLIER')
                ]);

                const customerList = Array.isArray(customers) ? customers : [];
                const supplierList = Array.isArray(suppliers) ? suppliers : [];

                // Merge lists
                setPartners([...customerList, ...supplierList] as any);
            } catch (err) {
                console.error("Failed to load partners", err);
                setPartners([]);
            } finally {
                setLoading(false);
            }
        };
        loadPartners();
    }, []);

    const toggleExpand = async (id: string, rut: string) => {
        const isExpanding = expandedId !== id;
        setExpandedId(isExpanding ? id : null);

        if (isExpanding && !movementsData[id]) {
            setLoadingMovements(prev => ({ ...prev, [id]: true }));
            try {
                const movements = await accountingService.getPartnerMovements(rut);
                setMovementsData(prev => ({ ...prev, [id]: movements }));
            } catch (err) {
                console.error("Failed to load movements", err);
            } finally {
                setLoadingMovements(prev => ({ ...prev, [id]: false }));
            }
        }
    };

    const filteredPartners = partners.filter(p => filterType === "all" || p.type === filterType);

    if (loading) {
        return <div className="p-8 text-center text-muted-foreground">Cargando cuentas corrientes...</div>;
    }

    return (
        <div className="space-y-6">
            {/* TOP CARDS */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-gradient-to-br from-blue-950 to-slate-900 border-blue-800 shadow-xl">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-blue-200 mb-1">Total por Cobrar (Clientes)</p>
                                <h3 className="text-2xl font-bold text-white font-mono">$ 15.000.000</h3>
                            </div>
                            <div className="p-2 bg-blue-500/20 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-blue-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-indigo-950 to-slate-900 border-indigo-800 shadow-xl">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-indigo-200 mb-1">Total por Pagar (Proveedores)</p>
                                <h3 className="text-2xl font-bold text-white font-mono">$ 4.500.000</h3>
                            </div>
                            <div className="p-2 bg-indigo-500/20 rounded-lg">
                                <TrendingDown className="w-5 h-5 text-indigo-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-slate-900 to-slate-900 border-slate-800 shadow-xl">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-slate-400 mb-1">Top Deudor</p>
                                <h3 className="text-lg font-bold text-white truncate w-full">Tech Solutions Ltd</h3>
                                <p className="text-xs text-rose-400 font-mono mt-1">Deuda: $1.250.000</p>
                            </div>
                            <div className="p-2 bg-slate-800 rounded-lg">
                                <History className="w-5 h-5 text-slate-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* FILTERS & SEARCH */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar por Nombre o RUT..." className="pl-8 bg-background/50 backdrop-blur-sm" />
                </div>
                <div className="flex gap-2 p-1 bg-muted rounded-lg">
                    <Button variant={filterType === "all" ? "secondary" : "ghost"} size="sm" onClick={() => setFilterType("all")}>Todos</Button>
                    <Button variant={filterType === "customer" ? "secondary" : "ghost"} size="sm" onClick={() => setFilterType("customer")}>Clientes</Button>
                    <Button variant={filterType === "supplier" ? "secondary" : "ghost"} size="sm" onClick={() => setFilterType("supplier")}>Proveedores</Button>
                </div>
            </div>

            {/* MASTER LIST */}
            <div className="space-y-3">
                {filteredPartners.length === 0 ? (
                    <div className="text-center py-10 border border-dashed rounded-lg text-muted-foreground">
                        No se encontraron registros de cuentas corrientes.
                    </div>
                ) : (
                    filteredPartners.map((partner) => (
                        <Card key={`${partner.id}-${partner.type}`} className="overflow-hidden border-muted transition-all hover:border-primary/50">
                            <div
                                className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/30"
                                onClick={() => toggleExpand(partner.id, partner.rut)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm",
                                        partner.type === "customer" ? "bg-blue-600" : "bg-indigo-600")}>
                                        {partner.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-sm">{partner.name}</h4>
                                        <p className="text-xs text-muted-foreground">{partner.rut}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-xs text-muted-foreground">Última actividad</p>
                                        <p className="text-sm">{partner.lastActivity}</p>
                                    </div>
                                    <div className="text-right w-32">
                                        <p className="text-xs text-muted-foreground">Saldo Pendiente</p>
                                        <p className={cn("text-base font-bold font-mono", partner.totalPending > 0 ? "text-rose-500" : "text-emerald-500")}>
                                            {formatMoney(partner.totalPending)}
                                        </p>
                                    </div>
                                    {expandedId === partner.id ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                                </div>
                            </div>

                            {/* DETAIL: TIMELINE OF DEBT */}
                            <AnimatePresence>
                                {expandedId === partner.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="bg-muted/20 border-t"
                                    >
                                        <div className="p-4 pl-12">
                                            <h5 className="text-xs font-semibold uppercase text-muted-foreground mb-3 tracking-wider flex items-center gap-2">
                                                <History className="w-3 h-3" /> Historial de Movimientos
                                            </h5>
                                            {loadingMovements[partner.id] ? (
                                                <div className="text-xs text-muted-foreground py-2">Cargando movimientos...</div>
                                            ) : (
                                                <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-border px-2">
                                                    {movementsData[partner.id]?.map((entry) => (
                                                        <div key={entry.id} className="relative pl-6">
                                                            {/* Timeline Dot */}
                                                            <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-background bg-primary z-10 shadow-sm" />

                                                            <div className="flex justify-between items-start bg-card p-3 rounded-lg border shadow-sm">
                                                                <div>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="font-medium text-sm">{entry.description}</span>
                                                                        <Badge variant="outline" className="text-[10px] h-5">{entry.documentNumber}</Badge>
                                                                    </div>
                                                                    <span className="text-xs text-muted-foreground block mt-1">{entry.date}</span>
                                                                </div>
                                                                <div className="text-right">
                                                                    <div className={cn("font-medium text-sm", entry.amount > 0 ? "text-blue-500" : "text-emerald-500")}>
                                                                        {entry.amount > 0 ? "+" : ""}{formatMoney(entry.amount)}
                                                                    </div>
                                                                    <div className="text-xs text-muted-foreground font-mono mt-1">
                                                                        Saldo: {formatMoney(entry.balance)}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}

                                                    {/* Final Balance Line */}
                                                    <div className="relative pl-6 mt-4">
                                                        <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-rose-500 z-10 shadow-sm ring-4 ring-rose-500/20" />
                                                        <div className="flex justify-between items-center bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">
                                                            <span className="text-sm font-bold text-rose-600">Saldo Final Pendiente</span>
                                                            <span className="font-bold font-mono text-rose-600 text-lg">{formatMoney(partner.totalPending)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Card>
                    )))}
            </div>
        </div>
    );
}
